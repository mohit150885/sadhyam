import { adminAuth, adminDb } from "../../../../../lib/firebase-admin";
import { hashPassword } from "../../../../../lib/admin-session";
import { COLLECTIONS, pickFields, plain } from "../../../../../lib/adminCollections";
import { handle, jsonError, ok, requireAdmin } from "../../../../../lib/server";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ collection: string; id: string }> };

const ORDER_STATUSES = ["pending", "paid", "failed", "refunded", "cancelled"];
const REVIEW_STATUSES = ["pending", "approved", "rejected"];
const QUERY_STATUSES = ["open", "in-progress", "resolved"];

export async function GET(_req: Request, { params }: Ctx) {
    return handle(async () => {
        const { collection, id } = await params;
        const rule = COLLECTIONS[collection];
        if (!rule) return jsonError("Unknown collection.", 404);
        const auth = await requireAdmin(rule.read);
        if (auth.error) return auth.error;
        const snap = await adminDb().doc(`${collection}/${id}`).get();
        if (!snap.exists) return ok({ item: null });
        return ok({ item: { id: snap.id, ...plain(snap.data() ?? {}) } });
    });
}

export async function PATCH(request: Request, { params }: Ctx) {
    return handle(async () => {
        const { collection, id } = await params;
        const rule = COLLECTIONS[collection];
        if (!rule) return jsonError("Unknown collection.", 404);
        const auth = await requireAdmin(rule.write);
        if (auth.error) return auth.error;

        const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
        if (!body) return jsonError("Invalid request.");
        const data: Record<string, unknown> = pickFields(rule, body);
        const db = adminDb();
        const ref = db.doc(`${collection}/${id}`);
        const snap = await ref.get();
        if (!snap.exists) return jsonError("Item not found.", 404);

        if (collection === "orders" && data.status !== undefined) {
            if (!ORDER_STATUSES.includes(String(data.status))) return jsonError("Invalid order status.");
            if (data.status === "paid") data.paidAt = Date.now();
        }
        if (collection === "reviews" && data.status !== undefined && !REVIEW_STATUSES.includes(String(data.status))) {
            return jsonError("Invalid review status.");
        }
        if (collection === "support_queries" && data.status !== undefined && !QUERY_STATUSES.includes(String(data.status))) {
            return jsonError("Invalid status.");
        }
        if (collection === "coupons" && typeof data.code === "string") {
            data.code = data.code.trim().toUpperCase().replace(/\s+/g, "");
        }
        if (collection === "users" && data.blocked !== undefined) {
            // Blocking also disables Firebase Authentication sign-in.
            await adminAuth().updateUser(id, { disabled: Boolean(data.blocked) }).catch(() => undefined);
        }
        if (collection === "admins") {
            if (typeof data.password === "string" && data.password) {
                if (data.password.length < 10) return jsonError("Admin passwords must be at least 10 characters.");
                data.passwordHash = hashPassword(data.password);
            }
            delete data.password;
            if (data.role !== undefined) data.role = data.role === "editor" ? "editor" : "admin";
            if (typeof data.email === "string") data.email = data.email.trim().toLowerCase();
        }

        await ref.update({ ...data, updatedAt: Date.now(), updatedBy: auth.admin.name });
        return ok();
    });
}

export async function DELETE(_req: Request, { params }: Ctx) {
    return handle(async () => {
        const { collection, id } = await params;
        const rule = COLLECTIONS[collection];
        if (!rule || !rule.remove) return jsonError("Deleting is not allowed here.", 405);
        const auth = await requireAdmin(collection === "orders" ? ["owner"] : rule.write);
        if (auth.error) return auth.error;
        await adminDb().doc(`${collection}/${id}`).delete();
        return ok();
    });
}
