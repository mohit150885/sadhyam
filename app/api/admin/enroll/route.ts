import { adminDb } from "../../../lib/firebase-admin";
import { handle, jsonError, loadCatalog, ok, requireAdmin } from "../../../lib/server";

export const runtime = "nodejs";

/** Manually enrol a student (e.g. paid in cash or by bank transfer). Creates a paid order. */
export async function POST(request: Request) {
    return handle(async () => {
        const auth = await requireAdmin(["owner", "admin"]);
        if (auth.error) return auth.error;
        const body = await request.json().catch(() => null);
        if (!body || typeof body.userId !== "string" || !Array.isArray(body.items) || !body.items.length) return jsonError("Choose a student and at least one item.");

        const db = adminDb();
        const user = await db.doc(`users/${body.userId}`).get();
        if (!user.exists) return jsonError("Student not found.", 404);
        const catalog = await loadCatalog();
        const lines = (body.items as { kind: string; id: string }[]).map((i) => catalog.get(`${i.kind}:${i.id}`)).filter((x): x is NonNullable<typeof x> => Boolean(x));
        if (!lines.length) return jsonError("Those items were not found in the catalog.");

        const amount = Math.max(0, Number(body.amount) || 0);
        const u = user.data() ?? {};
        const now = Date.now();
        const ref = db.collection("orders").doc();
        await ref.set({
            orderNumber: `MAN${new Date(now).toISOString().slice(2, 10).replace(/-/g, "")}${Math.floor(1000 + Math.random() * 9000)}`,
            userId: body.userId,
            userName: u.name || "Student",
            userEmail: u.email || "",
            userMobile: u.mobile || "",
            items: lines,
            subtotal: lines.reduce((s, l) => s + l.price, 0),
            discount: 0,
            couponCode: null,
            total: amount,
            status: "paid",
            paymentMethod: "manual",
            note: String(body.note || `Enrolled by ${auth.admin.name}`).slice(0, 300),
            createdAt: now,
            updatedAt: now,
            paidAt: now,
        });
        return ok({ id: ref.id });
    });
}
