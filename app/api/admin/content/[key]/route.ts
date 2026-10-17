import { adminDb } from "../../../../lib/firebase-admin";
import { CONTENT_KEYS, type ContentKey } from "../../../../lib/siteContent";
import { handle, jsonError, ok, requireAdmin } from "../../../../lib/server";

export const runtime = "nodejs";

/** Firestore rejects undefined values and nested arrays; clean the payload first. */
function sanitize(value: unknown, depth = 0, inArray = false): unknown {
    if (depth > 12) throw new Error("Content is nested too deeply.");
    if (value === undefined) return undefined;
    if (value === null || typeof value === "string" || typeof value === "boolean") return value;
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (Array.isArray(value)) {
        const arr = value.map((v) => sanitize(v, depth + 1, true)).filter((v) => v !== undefined);
        return inArray ? { items: arr } : arr;
    }
    if (typeof value === "object") {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            if (k === "updatedAt" || k === "updatedBy") continue;
            const clean = sanitize(v, depth + 1, false);
            if (clean !== undefined) out[k] = clean;
        }
        return out;
    }
    return undefined;
}

function validKey(key: string): key is ContentKey {
    return (CONTENT_KEYS as string[]).includes(key);
}

export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
    return handle(async () => {
        const auth = await requireAdmin();
        if (auth.error) return auth.error;
        const { key } = await params;
        if (!validKey(key)) return jsonError("Unknown content section.", 404);
        const snap = await adminDb().doc(`site_content/${key}`).get();
        return ok({ exists: snap.exists, data: snap.data() ?? null });
    });
}

/**
 * Saves a whole page document. The site listens to these documents live,
 * so every open page updates as soon as this write lands.
 */
export async function PUT(request: Request, { params }: { params: Promise<{ key: string }> }) {
    return handle(async () => {
        const auth = await requireAdmin();
        if (auth.error) return auth.error;
        const { key } = await params;
        if (!validKey(key)) return jsonError("Unknown content section.", 404);
        const body = await request.json().catch(() => null);
        if (!body || typeof body.data !== "object" || body.data === null || Array.isArray(body.data)) {
            return jsonError("Invalid content payload.");
        }
        const data = sanitize(body.data) as Record<string, unknown>;
        const size = Buffer.byteLength(JSON.stringify(data));
        if (size > 900_000) {
            return jsonError("This page is too large to save (Firestore limit is 1 MB). Upload images instead of pasting image data.");
        }
        await adminDb().doc(`site_content/${key}`).set({ ...data, updatedAt: Date.now(), updatedBy: auth.admin.name });
        return ok({ ok: true, savedAt: Date.now() });
    });
}
