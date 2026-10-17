import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../../lib/firebase-admin";
import { evaluateCoupon, handle, jsonError, loadCatalog, ok, verifyUser } from "../../lib/server";

export const runtime = "nodejs";

/**
 * Creates an order from the cart. Prices and coupon discounts are recalculated
 * here from Firestore, so the browser cannot change what is charged.
 * The order starts as "pending"; an admin marks it "paid" after confirming
 * payment, which unlocks the items in My Courses / My Test Series.
 */
export async function POST(request: Request) {
    return handle(async () => {
        const user = await verifyUser(request);
        if (!user) return jsonError("Please log in to place an order.", 401);

        const body = await request.json().catch(() => null);
        if (!body || !Array.isArray(body.items) || body.items.length === 0) return jsonError("Your cart is empty.");
        if (body.items.length > 30) return jsonError("Too many items in one order.");

        const catalog = await loadCatalog();
        const seen = new Set<string>();
        const lines = [];
        for (const raw of body.items as { kind: string; id: string }[]) {
            const key = `${raw.kind}:${raw.id}`;
            if (seen.has(key)) continue;
            seen.add(key);
            const p = catalog.get(key);
            if (!p) return jsonError("An item in your cart is no longer available. Please refresh your cart.");
            lines.push(p);
        }

        const db = adminDb();

        // Don't sell something the student already owns.
        const existing = await db.collection("orders").where("userId", "==", user.uid).get();
        const owned = new Set<string>();
        existing.docs.forEach((d) => {
            const o = d.data();
            if (o.status === "paid") (o.items ?? []).forEach((i: { kind: string; id: string }) => owned.add(`${i.kind}:${i.id}`));
        });
        const already = lines.find((l) => owned.has(`${l.kind}:${l.id}`));
        if (already) return jsonError(`You already own "${already.title}". Remove it from your cart to continue.`);

        const subtotal = lines.reduce((s, l) => s + l.price, 0);
        let discount = 0;
        let couponCode: string | undefined;
        let couponId: string | undefined;
        if (typeof body.couponCode === "string" && body.couponCode.trim()) {
            try {
                const c = await evaluateCoupon(body.couponCode, lines);
                discount = c.discount;
                couponCode = c.code;
                couponId = c.couponId;
            } catch (err) {
                return jsonError(err instanceof Error ? err.message : "Invalid coupon.");
            }
        }
        const total = Math.max(0, subtotal - discount);

        const profileSnap = await db.doc(`users/${user.uid}`).get();
        const profile = profileSnap.data() ?? {};

        const now = Date.now();
        const orderNumber = `SAD${new Date(now).toISOString().slice(2, 10).replace(/-/g, "")}${Math.floor(1000 + Math.random() * 9000)}`;
        const ref = db.collection("orders").doc();
        await ref.set({
            orderNumber,
            userId: user.uid,
            userName: String(profile.name || body.name || user.name || "Student").slice(0, 80),
            userEmail: user.email || profile.email || "",
            userMobile: String(profile.mobile || body.mobile || "").slice(0, 20),
            items: lines,
            subtotal,
            discount,
            couponCode: couponCode ?? null,
            total,
            status: total === 0 ? "paid" : "pending",
            paymentMethod: total === 0 ? "free" : "upi",
            createdAt: now,
            updatedAt: now,
        });
        if (couponId) await db.doc(`coupons/${couponId}`).update({ used: FieldValue.increment(1) });

        return ok({ id: ref.id, orderNumber, total });
    });
}
