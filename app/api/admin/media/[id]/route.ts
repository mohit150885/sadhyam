import { adminBucket, adminDb } from "../../../../lib/firebase-admin";
import { deleteFirestoreMedia } from "../../../../lib/media";
import { handle, jsonError, ok, requireAdmin } from "../../../../lib/server";

export const runtime = "nodejs";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    return handle(async () => {
        const auth = await requireAdmin(["owner", "admin"]);
        if (auth.error) return auth.error;
        const { id } = await params;
        const db = adminDb();
        const ref = db.doc(`media_library/${id}`);
        const snap = await ref.get();
        if (!snap.exists) return jsonError("File not found.", 404);
        const data = snap.data() ?? {};
        if (data.backend === "storage" && data.storagePath) {
            // The bucket name is inside the stored URL.
            const bucketName = String(data.url || "").match(/\/v0\/b\/([^/]+)\/o\//)?.[1];
            await adminBucket(bucketName).file(data.storagePath).delete({ ignoreNotFound: true }).catch(() => undefined);
        } else {
            await deleteFirestoreMedia(db, id);
        }
        await ref.delete();
        return ok();
    });
}
