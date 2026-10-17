import { adminDb } from "../../../lib/firebase-admin";
import { readFirestoreMedia } from "../../../lib/media";

export const runtime = "nodejs";

/**
 * Serves images and PDFs stored in the Firestore "site_media" collection
 * (used when Firebase Storage is not enabled). URLs look like /api/media/<id>.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!/^[A-Za-z0-9_-]{1,100}$/.test(id)) return new Response("Not found", { status: 404 });
    try {
        const file = await readFirestoreMedia(adminDb(), id);
        if (!file) return new Response("Not found", { status: 404 });
        const headers: Record<string, string> = {
            "Content-Type": file.mime,
            "Content-Length": String(file.body.length),
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Content-Type-Options": "nosniff",
        };
        if (file.mime === "application/pdf") {
            headers["Content-Disposition"] = `inline; filename="${file.name.replace(/[^\w.\- ]/g, "_")}"`;
        }
        if (file.mime === "image/svg+xml") headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'";
        return new Response(new Uint8Array(file.body), { headers });
    } catch (err) {
        console.error("media", err);
        return new Response("Media unavailable", { status: 500 });
    }
}
