import "server-only";

import type { AdminRole } from "./admin-session";

type FieldType = "string" | "number" | "boolean";

export interface CollectionRule {
    read: AdminRole[];
    write: AdminRole[];
    create: boolean;
    remove: boolean;
    fields: Record<string, FieldType>;
}

const ALL: AdminRole[] = ["owner", "admin", "editor"];
const STAFF: AdminRole[] = ["owner", "admin"];

/** What the admin panel may read and change in each Firestore collection. */
export const COLLECTIONS: Record<string, CollectionRule> = {
    orders: {
        read: STAFF, write: STAFF, create: false, remove: true,
        fields: { status: "string", note: "string", paymentReference: "string", paymentMethod: "string" },
    },
    users: {
        read: STAFF, write: STAFF, create: false, remove: false,
        fields: { name: "string", mobile: "string", exam: "string", city: "string", blocked: "boolean" },
    },
    coupons: {
        read: STAFF, write: STAFF, create: true, remove: true,
        fields: {
            code: "string", description: "string", type: "string", value: "number", minAmount: "number",
            maxDiscount: "number", usageLimit: "number", used: "number", validFrom: "string", validTo: "string",
            active: "boolean", appliesTo: "string",
        },
    },
    reviews: {
        read: ALL, write: ALL, create: false, remove: true,
        fields: { status: "string", comment: "string", rating: "number" },
    },
    notifications: {
        read: ALL, write: ALL, create: true, remove: true,
        fields: { title: "string", message: "string", link: "string", type: "string", published: "boolean" },
    },
    support_queries: {
        read: STAFF, write: STAFF, create: false, remove: true,
        fields: { status: "string", reply: "string" },
    },
    private_content: {
        read: ALL, write: ALL, create: true, remove: true,
        fields: { url: "string", note: "string" },
    },
    admins: {
        read: ["owner"], write: ["owner"], create: true, remove: true,
        fields: { name: "string", email: "string", role: "string", active: "boolean", password: "string" },
    },
};

export function pickFields(rule: CollectionRule, input: Record<string, unknown>) {
    const out: Record<string, string | number | boolean | null> = {};
    for (const [key, type] of Object.entries(rule.fields)) {
        if (!(key in input)) continue;
        const v = input[key];
        if (v === null || v === "") {
            out[key] = type === "string" ? "" : null;
        } else if (type === "number") {
            const n = Number(v);
            if (Number.isFinite(n)) out[key] = n;
        } else if (type === "boolean") {
            out[key] = Boolean(v);
        } else {
            out[key] = String(v).slice(0, 5000);
        }
    }
    return out;
}

/** Firestore Timestamps → millis so JSON stays simple. */
export function plain(data: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
        if (v && typeof v === "object" && "toMillis" in (v as object) && typeof (v as { toMillis: unknown }).toMillis === "function") {
            out[k] = (v as { toMillis: () => number }).toMillis();
        } else {
            out[k] = v;
        }
    }
    delete out.passwordHash;
    return out;
}
