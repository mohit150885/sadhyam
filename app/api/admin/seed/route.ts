import { adminDb } from "../../../lib/firebase-admin";
import { defaultSiteContent, CONTENT_KEYS, type ContentKey } from "../../../lib/siteContent";
import { handle, jsonError, ok, requireAdmin } from "../../../lib/server";

export const runtime = "nodejs";

/**
 * Writes the built-in default content to Firestore.
 *   { mode: "missing" }            → only creates documents that don't exist yet
 *   { mode: "reset", keys: [...] } → overwrites the listed documents with defaults
 */
export async function POST(request: Request) {
    return handle(async () => {
        const auth = await requireAdmin(["owner", "admin"]);
        if (auth.error) return auth.error;
        const body = await request.json().catch(() => ({}));
        const mode = body?.mode === "reset" ? "reset" : "missing";
        const keys: ContentKey[] = Array.isArray(body?.keys)
            ? (body.keys as string[]).filter((k): k is ContentKey => (CONTENT_KEYS as string[]).includes(k))
            : CONTENT_KEYS;
        if (mode === "reset" && !Array.isArray(body?.keys)) return jsonError("Choose which pages to reset.");

        const db = adminDb();
        const results: Record<string, string> = {};
        for (const key of keys) {
            const ref = db.doc(`site_content/${key}`);
            const snap = await ref.get();
            if (snap.exists && mode === "missing") {
                results[key] = "kept";
                continue;
            }
            await ref.set({ ...JSON.parse(JSON.stringify(defaultSiteContent[key])), updatedAt: Date.now(), updatedBy: auth.admin.name });
            results[key] = snap.exists ? "reset" : "created";
        }
        return ok({ results });
    });
}
