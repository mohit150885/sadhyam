import { adminDb } from "../../../lib/firebase-admin";
import { handle, ok, requireAdmin } from "../../../lib/server";

export const runtime = "nodejs";

export async function GET() {
    return handle(async () => {
        const auth = await requireAdmin();
        if (auth.error) return auth.error;
        const snap = await adminDb().collection("media_library").orderBy("createdAt", "desc").limit(300).get();
        return ok({ items: snap.docs.map((d) => ({ id: d.id, ...d.data() })) });
    });
}
