import "server-only";

import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "./firebase-admin";
import { timingSafeEqual } from "node:crypto";
import { getAdminIdentity, type AdminIdentity, type AdminRole } from "./admin-session";
import { defaultSiteContent } from "./siteContent";
import { mergeContent } from "./utils";
import { asArray, normalizeCourse, normalizeMaterial, normalizeTest } from "./catalog";
import type { ProductKind } from "./models";

export function jsonError(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export function ok(data: unknown = { ok: true }) {
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}

export function safeEqualText(a: string, b: string): boolean {
    const x = Buffer.from(a);
    const y = Buffer.from(b);
    return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * Checks the admin session cookie. Returns { error } with a 401/403 response
 * when not allowed, otherwise { admin }.
 */
export async function requireAdmin(
    roles: AdminRole[] = ["owner", "admin", "editor"]
): Promise<{ admin: AdminIdentity; error?: undefined } | { admin?: undefined; error: NextResponse }> {
    const admin = await getAdminIdentity();
    if (!admin) return { error: jsonError("Admin session expired. Please sign in again.", 401) };
    if (!roles.includes(admin.role)) return { error: jsonError("Your admin role does not allow this action.", 403) };
    return { admin };
}

/** Wraps a handler so Firebase Admin configuration errors become readable JSON. */
export async function handle(fn: () => Promise<NextResponse>): Promise<NextResponse> {
    try {
        return await fn();
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected server error";
        console.error("[api]", message);
        return jsonError(message, 500);
    }
}

export async function verifyUser(request: Request) {
    const header = request.headers.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) return null;
    try {
        return await adminAuth().verifyIdToken(token);
    } catch {
        return null;
    }
}

type Product = { kind: ProductKind; id: string; title: string; price: number; oldPrice: number; image: string };

/** Reads the live catalog (with defaults) so prices are always computed on the server. */
export async function loadCatalog(): Promise<Map<string, Product>> {
    const db = adminDb();
    const [c, t, m] = await Promise.all([
        db.doc("site_content/courses").get(),
        db.doc("site_content/testSeries").get(),
        db.doc("site_content/studyMaterial").get(),
    ]);
    const courses = mergeContent(defaultSiteContent.courses, c.data());
    const tests = mergeContent(defaultSiteContent.testSeries, t.data());
    const materials = mergeContent(defaultSiteContent.studyMaterial, m.data());

    const map = new Map<string, Product>();
    const put = (kind: ProductKind, x: { id: string; title: string; price: number; oldPrice: number; image: string; published?: boolean }) => {
        if (x.id && x.published !== false) map.set(`${kind}:${x.id}`, { kind, id: x.id, title: x.title, price: x.price, oldPrice: x.oldPrice, image: x.image });
    };
    asArray<Record<string, unknown>>(courses.items).map(normalizeCourse).forEach((x) => put("course", x));
    asArray<Record<string, unknown>>(tests.items).map(normalizeTest).forEach((x) => put("test", x));
    asArray<Record<string, unknown>>(materials.items).map(normalizeMaterial).forEach((x) => put("material", x));
    return map;
}

export type CouponDoc = {
    code: string;
    type: "percent" | "flat";
    value: number;
    minAmount?: number;
    maxDiscount?: number;
    usageLimit?: number;
    used?: number;
    validFrom?: string;
    validTo?: string;
    active: boolean;
    appliesTo?: "all" | ProductKind;
};

/** Validates a coupon against cart lines and returns the discount in rupees. */
export async function evaluateCoupon(code: string, lines: Product[]) {
    const normalized = code.trim().toUpperCase();
    if (!normalized) throw new Error("Enter a coupon code.");
    const snap = await adminDb().collection("coupons").where("code", "==", normalized).limit(1).get();
    if (snap.empty) throw new Error("This coupon code is not valid.");
    const doc = snap.docs[0];
    const c = doc.data() as CouponDoc;
    const today = new Date().toISOString().slice(0, 10);
    if (!c.active) throw new Error("This coupon is no longer active.");
    if (c.validFrom && today < c.validFrom) throw new Error("This coupon is not active yet.");
    if (c.validTo && today > c.validTo) throw new Error("This coupon has expired.");
    if (c.usageLimit && (c.used ?? 0) >= c.usageLimit) throw new Error("This coupon has reached its usage limit.");

    const eligible = lines.filter((l) => !c.appliesTo || c.appliesTo === "all" || c.appliesTo === l.kind);
    const base = eligible.reduce((s, l) => s + l.price, 0);
    if (base <= 0) throw new Error("This coupon does not apply to the items in your cart.");
    if (c.minAmount && base < c.minAmount) throw new Error(`Add items worth ₹${c.minAmount} or more to use this coupon.`);

    let discount = c.type === "percent" ? Math.round((base * c.value) / 100) : c.value;
    if (c.maxDiscount) discount = Math.min(discount, c.maxDiscount);
    discount = Math.max(0, Math.min(discount, base));
    const message = c.type === "percent" ? `${c.value}% off applied` : `₹${c.value} off applied`;
    return { code: normalized, discount, message, couponId: doc.id };
}
