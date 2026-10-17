import { randomUUID } from "node:crypto";
import { adminDb, resolveBucket } from "../../../lib/firebase-admin";
import { handle, jsonError, ok, requireAdmin } from "../../../lib/server";
import { CHUNK_BYTES } from "../../../lib/media";

export const runtime = "nodejs";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"]);
const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Uploads an image or PDF and returns a public URL to put in the content.
 *  1. Firebase Storage, when a bucket exists → https://firebasestorage.googleapis.com/...
 *  2. Otherwise Firestore: the file is split into ~900 KB chunks under
 *     site_media/<id>/chunks/<n> (works on the free Spark plan) → /api/media/<id>
 * Every upload is also recorded in "media_library" for the admin Media Library.
 */
export async function POST(request: Request) {
    return handle(async () => {
        const auth = await requireAdmin();
        if (auth.error) return auth.error;

        const form = await request.formData().catch(() => null);
        const file = form?.get("file");
        if (!(file instanceof File)) return jsonError("No file received. (On Vercel, uploads must be under 4.5 MB.)");
        const folder = String(form?.get("folder") || "general").replace(/[^a-z0-9-]/gi, "").slice(0, 40) || "general";

        const isPdf = file.type === "application/pdf";
        if (!IMAGE_TYPES.has(file.type) && !isPdf) return jsonError("Upload a JPG, PNG, WEBP, GIF, SVG or PDF file.");
        if (file.size > MAX_BYTES) return jsonError("File is larger than 10 MB.");

        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = (file.name.split(".").pop() || (isPdf ? "pdf" : "webp")).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5);
        const id = `${Date.now().toString(36)}${randomUUID().slice(0, 8)}`;
        const db = adminDb();

        let url = "";
        let backend: "storage" | "firestore" = "firestore";
        let storagePath = "";

        const { bucket } = await resolveBucket();
        if (bucket) {
            try {
                storagePath = `site/${folder}/${id}.${ext}`;
                const token = randomUUID();
                await bucket.file(storagePath).save(buffer, {
                    resumable: false,
                    metadata: {
                        contentType: file.type,
                        cacheControl: "public, max-age=31536000, immutable",
                        metadata: { firebaseStorageDownloadTokens: token },
                    },
                });
                url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;
                backend = "storage";
            } catch (err) {
                console.warn("Storage upload failed, falling back to Firestore:", err instanceof Error ? err.message : err);
            }
        }

        if (backend === "firestore") {
            const chunkCount = Math.ceil(buffer.length / CHUNK_BYTES);
            const batch = db.batch();
            batch.set(db.doc(`site_media/${id}`), {
                mimeType: file.type,
                originalName: file.name.slice(0, 120),
                size: buffer.length,
                chunks: chunkCount,
                createdAt: Date.now(),
            });
            for (let i = 0; i < chunkCount; i++) {
                // Stored as Firestore "bytes" (no base64 overhead).
                batch.set(db.doc(`site_media/${id}/chunks/${String(i).padStart(3, "0")}`), {
                    i,
                    data: buffer.subarray(i * CHUNK_BYTES, (i + 1) * CHUNK_BYTES),
                });
            }
            await batch.commit();
            url = `/api/media/${id}`;
        }

        await db.doc(`media_library/${id}`).set({
            url,
            name: file.name.slice(0, 120),
            type: file.type,
            size: buffer.length,
            folder,
            backend,
            storagePath: backend === "storage" ? storagePath : null,
            createdAt: Date.now(),
            uploadedBy: auth.admin.name,
        });

        return ok({ id, url, backend, size: buffer.length });
    });
}
