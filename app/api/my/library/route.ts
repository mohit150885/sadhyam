import { adminDb } from "../../../lib/firebase-admin";
import { handle, jsonError, ok, verifyUser } from "../../../lib/server";

export const runtime = "nodejs";

/**
 * Returns access links (class link, playlist, PDF download, test portal) for
 * items the student has paid for. Links live in the private "private_content"
 * collection, which the public cannot read.
 */
export async function GET(request: Request) {
    return handle(async () => {
        const user = await verifyUser(request);
        if (!user) return jsonError("Please log in.", 401);
        const db = adminDb();
        const orders = await db.collection("orders").where("userId", "==", user.uid).get();
        const keys = new Set<string>();
        orders.docs.forEach((d) => {
            const o = d.data();
            if (o.status === "paid") (o.items ?? []).forEach((i: { kind: string; id: string }) => keys.add(`${i.kind}:${i.id}`));
        });
        const access: Record<string, { url?: string; note?: string }> = {};
        if (keys.size) {
            const refs = [...keys].map((k) => db.doc(`private_content/${k.replace(":", "_")}`));
            const snaps = await db.getAll(...refs);
            snaps.forEach((s, idx) => {
                if (s.exists) {
                    const d = s.data() ?? {};
                    access[[...keys][idx]] = { url: d.url || "", note: d.note || "" };
                }
            });
        }
        return ok({ access });
    });
}
