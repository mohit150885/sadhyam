import { evaluateCoupon, handle, jsonError, loadCatalog, ok } from "../../lib/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
    return handle(async () => {
        const body = await request.json().catch(() => null);
        if (!body || typeof body.code !== "string" || !Array.isArray(body.items)) return jsonError("Invalid request.");
        const catalog = await loadCatalog();
        const lines = (body.items as { kind: string; id: string }[])
            .map((i) => catalog.get(`${i.kind}:${i.id}`))
            .filter((x): x is NonNullable<typeof x> => Boolean(x));
        try {
            const result = await evaluateCoupon(body.code, lines);
            return ok({ code: result.code, discount: result.discount, message: result.message });
        } catch (err) {
            return jsonError(err instanceof Error ? err.message : "Invalid coupon.");
        }
    });
}
