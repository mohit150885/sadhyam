import "server-only";

import type { Firestore } from "firebase-admin/firestore";

/** Firestore documents max out at 1 MiB; 900 KB of bytes per chunk leaves room for metadata. */
export const CHUNK_BYTES = 900 * 1024;

/** Reads a file stored in site_media (single base64 doc or chunked bytes). */
export async function readFirestoreMedia(db: Firestore, id: string): Promise<{ body: Buffer; mime: string; name: string } | null> {
    const snap = await db.doc(`site_media/${id}`).get();
    if (!snap.exists) return null;
    const data = snap.data() as { data?: string; dataUrl?: string; mimeType?: string; chunks?: number; originalName?: string };
    let mime = data.mimeType || "image/webp";
    const name = data.originalName || id;

    if (data.chunks) {
        const parts = await db.collection(`site_media/${id}/chunks`).orderBy("i").get();
        const buffers = parts.docs.map((d) => {
            const v = d.get("data") as Buffer | Uint8Array | { toUint8Array?: () => Uint8Array };
            if (Buffer.isBuffer(v)) return v;
            if (v instanceof Uint8Array) return Buffer.from(v);
            return Buffer.from(v.toUint8Array ? v.toUint8Array() : []);
        });
        return { body: Buffer.concat(buffers), mime, name };
    }

    let base64 = data.data;
    if (!base64 && data.dataUrl) {
        const m = data.dataUrl.match(/^data:([^;]+);base64,(.*)$/);
        if (m) {
            mime = m[1];
            base64 = m[2];
        }
    }
    if (!base64) return null;
    return { body: Buffer.from(base64, "base64"), mime, name };
}

/** Deletes a site_media document and any chunks under it. */
export async function deleteFirestoreMedia(db: Firestore, id: string) {
    const chunks = await db.collection(`site_media/${id}/chunks`).listDocuments();
    const batch = db.batch();
    chunks.forEach((c) => batch.delete(c));
    batch.delete(db.doc(`site_media/${id}`));
    await batch.commit();
}
