import "server-only";

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "sadhyam_admin_session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

export type AdminRole = "owner" | "admin" | "editor";

export interface AdminIdentity {
    id: string;
    name: string;
    role: AdminRole;
}

function getSecret(): string {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("ADMIN_SESSION_SECRET must be set to a random string of at least 32 characters.");
    }
    return secret;
}

function sign(value: string): string {
    return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
    const x = Buffer.from(a);
    const y = Buffer.from(b);
    return x.length === y.length && timingSafeEqual(x, y);
}

export function createAdminSessionToken(identity: AdminIdentity): string {
    const payload = Buffer.from(
        JSON.stringify({ ...identity, expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000 })
    ).toString("base64url");
    return `${payload}.${sign(payload)}`;
}

export function readAdminSessionToken(token?: string): AdminIdentity | null {
    if (!token) return null;
    try {
        const [payload, signature] = token.split(".");
        if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
        const s = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        if (typeof s.expiresAt !== "number" || s.expiresAt <= Date.now()) return null;
        // Tokens issued before roles existed carried role "admin" only.
        const role: AdminRole = s.role === "owner" || s.role === "editor" ? s.role : s.id ? "admin" : "owner";
        return { id: String(s.id ?? "owner"), name: String(s.name ?? "Administrator"), role };
    } catch {
        return null;
    }
}

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
    try {
        const store = await cookies();
        return readAdminSessionToken(store.get(ADMIN_COOKIE)?.value);
    } catch {
        return null;
    }
}

export async function isAdminAuthenticated(): Promise<boolean> {
    return (await getAdminIdentity()) !== null;
}

export const adminCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
};

/* ------------------------------------------------------------------ */
/* Password hashing for additional admin accounts (Firestore "admins") */
/* ------------------------------------------------------------------ */

export function hashPassword(password: string): string {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
    const [scheme, salt, hash] = stored.split("$");
    if (scheme !== "scrypt" || !salt || !hash) return false;
    const candidate = scryptSync(password, salt, 64).toString("hex");
    return safeEqual(candidate, hash);
}
