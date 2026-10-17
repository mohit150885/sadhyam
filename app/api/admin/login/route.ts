import { NextRequest, NextResponse } from "next/server";
import {
    ADMIN_COOKIE,
    adminCookieOptions,
    createAdminSessionToken,
    verifyPassword,
    type AdminIdentity,
    type AdminRole,
} from "../../../lib/admin-session";
import { adminDb } from "../../../lib/firebase-admin";
import { safeEqualText } from "../../../lib/server";

export const runtime = "nodejs";

// Simple in-memory brute-force brake (per server instance).
const attempts = new Map<string, { count: number; until: number }>();

export async function POST(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const now = Date.now();
    const a = attempts.get(ip);
    if (a && a.until > now) {
        return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.id !== "string" || typeof body.password !== "string") {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const id = body.id.trim().toLowerCase();
    const password = body.password;

    let identity: AdminIdentity | null = null;

    // 1. Owner account from environment variables.
    const envId = process.env.ADMIN_LOGIN_ID?.trim().toLowerCase();
    const envPassword = process.env.ADMIN_LOGIN_PASSWORD;
    if (envId && envPassword && id === envId && safeEqualText(password, envPassword)) {
        identity = { id: "owner", name: "Owner", role: "owner" };
    }

    // 2. Additional admins created in Admin → Users & Admins.
    if (!identity) {
        try {
            const snap = await adminDb().collection("admins").where("email", "==", id).limit(1).get();
            const doc = snap.docs[0];
            const data = doc?.data();
            if (doc && data && data.active !== false && typeof data.passwordHash === "string" && verifyPassword(password, data.passwordHash)) {
                const role: AdminRole = data.role === "editor" ? "editor" : "admin";
                identity = { id: doc.id, name: String(data.name || data.email), role };
                await doc.ref.update({ lastLoginAt: now }).catch(() => undefined);
            }
        } catch {
            /* Firestore admin not configured — only the owner account can sign in */
        }
    }

    if (!identity) {
        const count = (a?.count ?? 0) + 1;
        attempts.set(ip, { count, until: count >= 5 ? now + 5 * 60 * 1000 : 0 });
        return NextResponse.json({ error: "Incorrect admin ID or password." }, { status: 401 });
    }
    attempts.delete(ip);

    try {
        const response = NextResponse.json({ authenticated: true, name: identity.name, role: identity.role });
        response.cookies.set(ADMIN_COOKIE, createAdminSessionToken(identity), adminCookieOptions);
        response.headers.set("Cache-Control", "no-store");
        return response;
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Unable to sign in." }, { status: 500 });
    }
}
