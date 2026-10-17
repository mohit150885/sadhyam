import { NextResponse } from "next/server";
import { getAdminIdentity } from "../../../lib/admin-session";

export const dynamic = "force-dynamic";

export async function GET() {
    const identity = await getAdminIdentity();
    return NextResponse.json(
        { authenticated: Boolean(identity), ...(identity ?? {}) },
        { status: identity ? 200 : 401, headers: { "Cache-Control": "no-store" } }
    );
}
