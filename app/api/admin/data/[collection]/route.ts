import { adminDb } from "../../../../lib/firebase-admin";
import { hashPassword } from "../../../../lib/admin-session";
import { COLLECTIONS, pickFields, plain } from "../../../../lib/adminCollections";
import { handle, jsonError, ok, requireAdmin } from "../../../../lib/server";
import { toMillis } from "../../../../lib/utils";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ collection: string }> }) {
    return handle(async () => {
        const { collection } = await params;
        const rule = COLLECTIONS[collection];
        if (!rule) return jsonError("Unknown collection.", 404);
        const auth = await requireAdmin(rule.read);
        if (auth.error) return auth.error;

        const snap = await adminDb().collection(collection).limit(2000).get();
        const items = snap.docs
            .map((d) => ({ id: d.id, ...plain(d.data()) }))
            .sort((a, b) => toMillis((b as { createdAt?: unknown }).createdAt) - toMillis((a as { createdAt?: unknown }).createdAt));
        return ok({ items });
    });
}

export async function POST(request: Request, { params }: { params: Promise<{ collection: string }> }) {
    return handle(async () => {
        const { collection } = await params;
        const rule = COLLECTIONS[collection];
        if (!rule || !rule.create) return jsonError("Creating items here is not allowed.", 405);
        const auth = await requireAdmin(rule.write);
        if (auth.error) return auth.error;

        const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
        if (!body) return jsonError("Invalid request.");
        const data: Record<string, unknown> = pickFields(rule, body);
        const db = adminDb();

        if (collection === "coupons") {
            const code = String(data.code || "").trim().toUpperCase().replace(/\s+/g, "");
            if (!/^[A-Z0-9_-]{3,30}$/.test(code)) return jsonError("Coupon code must be 3–30 letters/numbers.");
            const dup = await db.collection("coupons").where("code", "==", code).limit(1).get();
            if (!dup.empty) return jsonError("A coupon with this code already exists.");
            data.code = code;
            data.used = Number(data.used) || 0;
            if (data.type !== "flat") data.type = "percent";
            if (data.active === undefined) data.active = true;
        }

        if (collection === "admins") {
            const email = String(data.email || "").trim().toLowerCase();
            const password = String(data.password || "");
            if (!/^\S+@\S+\.\S+$/.test(email)) return jsonError("Enter a valid email.");
            if (password.length < 10) return jsonError("Admin passwords must be at least 10 characters.");
            const dup = await db.collection("admins").where("email", "==", email).limit(1).get();
            if (!dup.empty) return jsonError("An admin with this email already exists.");
            delete data.password;
            data.email = email;
            data.role = data.role === "editor" ? "editor" : "admin";
            data.active = data.active !== false;
            data.passwordHash = hashPassword(password);
        }

        // private_content documents use a fixed id: "<kind>_<itemId>".
        if (collection === "private_content") {
            const id = String(body.id || "");
            if (!/^(course|test|material)_[A-Za-z0-9_-]{1,100}$/.test(id)) return jsonError("Invalid item id.");
            await db.doc(`private_content/${id}`).set({ ...data, updatedAt: Date.now() }, { merge: true });
            return ok({ id });
        }

        const ref = await db.collection(collection).add({ ...data, createdAt: Date.now(), createdBy: auth.admin.name });
        return ok({ id: ref.id });
    });
}
