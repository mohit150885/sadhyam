import { adminDb } from "../../../lib/firebase-admin";
import { handle, jsonError, ok, verifyUser } from "../../../lib/server";

export const runtime = "nodejs";

/** Student submits their UPI / bank transaction reference for a pending order. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    return handle(async () => {
        const user = await verifyUser(request);
        if (!user) return jsonError("Please log in.", 401);
        const { id } = await params;
        const body = await request.json().catch(() => null);
        const reference = typeof body?.reference === "string" ? body.reference.trim().slice(0, 60) : "";
        if (reference.length < 6) return jsonError("Enter a valid transaction ID (at least 6 characters).");

        const ref = adminDb().doc(`orders/${id}`);
        const snap = await ref.get();
        if (!snap.exists || snap.data()?.userId !== user.uid) return jsonError("Order not found.", 404);
        if (snap.data()?.status !== "pending") return jsonError("This order is no longer awaiting payment.");

        await ref.update({ paymentReference: reference, paymentSubmittedAt: Date.now(), updatedAt: Date.now() });
        return ok();
    });
}
