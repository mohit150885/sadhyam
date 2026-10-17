"use client";

import { useMemo, useSyncExternalStore } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { defaultSiteContent, type AllSiteContent, type ContentKey } from "../lib/siteContent";
import { mergeContent } from "../lib/utils";
import type { Topper } from "../lib/models";
import { asArray, normalizeCourse, normalizeFaculty, normalizeMaterial, normalizeTest } from "../lib/catalog";

export { normalizeCourse, normalizeFaculty, normalizeMaterial, normalizeTest };

/*
 * One live Firestore subscription per site_content document, shared by every
 * component that needs it. Saving in the admin panel pushes the change to all
 * open pages immediately through onSnapshot.
 */

type Entry = {
    raw: unknown;
    loaded: boolean;
    error: string | null;
    listeners: Set<() => void>;
    started: boolean;
    snapshot: { raw: unknown; loaded: boolean; error: string | null };
};

const entries = new Map<string, Entry>();
const LOAD_TIMEOUT_MS = 3500;

function getEntry(key: string): Entry {
    let entry = entries.get(key);
    if (!entry) {
        entry = {
            raw: undefined,
            loaded: false,
            error: null,
            listeners: new Set(),
            started: false,
            snapshot: { raw: undefined, loaded: false, error: null },
        };
        entries.set(key, entry);
    }
    return entry;
}

function emit(entry: Entry) {
    entry.snapshot = { raw: entry.raw, loaded: entry.loaded, error: entry.error };
    entry.listeners.forEach((l) => l());
}

function start(key: string, entry: Entry) {
    if (entry.started || typeof window === "undefined") return;
    entry.started = true;

    const timer = window.setTimeout(() => {
        if (!entry.loaded) {
            entry.loaded = true;
            emit(entry);
        }
    }, LOAD_TIMEOUT_MS);

    onSnapshot(
        doc(db, "site_content", key),
        (snap) => {
            window.clearTimeout(timer);
            entry.raw = snap.exists() ? snap.data() : undefined;
            entry.loaded = true;
            entry.error = null;
            emit(entry);
        },
        (err) => {
            window.clearTimeout(timer);
            console.error(`site_content/${key}:`, err.message);
            entry.loaded = true;
            entry.error = err.message;
            emit(entry);
        }
    );
}

const serverSnapshot = { raw: undefined, loaded: false, error: null };

export function useContent<K extends ContentKey>(key: K) {
    const entry = getEntry(key);

    const snap = useSyncExternalStore(
        (listener) => {
            entry.listeners.add(listener);
            start(key, entry);
            return () => entry.listeners.delete(listener);
        },
        () => entry.snapshot,
        () => serverSnapshot
    );

    const data = useMemo(
        () => mergeContent(defaultSiteContent[key], normalizeFirestore(snap.raw)) as AllSiteContent[K],
        [key, snap.raw]
    );

    return { data, loading: !snap.loaded, error: snap.error };
}

/** Firestore cannot store nested arrays; older seeds wrapped them as {items: [...]}. */
function normalizeFirestore(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(normalizeFirestore);
    if (value && typeof value === "object") {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value)) out[k] = normalizeFirestore(v);
        return out;
    }
    return value;
}

const isPublished = (item: { published?: boolean; id?: string }) => item.published !== false && Boolean(item.id);

export function useCourses() {
    const { data, loading } = useContent("courses");
    const items = useMemo(
        () => asArray<Record<string, unknown>>(data.items).map(normalizeCourse).filter(isPublished),
        [data.items]
    );
    return { items, page: data, loading };
}

export function useTestSeries() {
    const { data, loading } = useContent("testSeries");
    const items = useMemo(
        () => asArray<Record<string, unknown>>(data.items).map(normalizeTest).filter(isPublished),
        [data.items]
    );
    return { items, page: data, loading };
}

export function useStudyMaterials() {
    const { data, loading } = useContent("studyMaterial");
    const items = useMemo(
        () => asArray<Record<string, unknown>>(data.items).map(normalizeMaterial).filter(isPublished),
        [data.items]
    );
    return { items, page: data, loading };
}

export function useFaculty() {
    const { data, loading } = useContent("faculty");
    const items = useMemo(
        () => asArray<Record<string, unknown>>(data.items).map(normalizeFaculty).filter(isPublished),
        [data.items]
    );
    return { items, page: data, loading };
}

export function useToppers() {
    const { data, loading } = useContent("results");
    const items = useMemo(
        () => asArray<Topper>(data.toppers).filter((t) => t && t.name),
        [data.toppers]
    );
    return { items, page: data, loading };
}

/** Featured items first, then the rest, limited to `count`. */
export function pickFeatured<T extends { featured?: boolean }>(items: T[], count: number): T[] {
    const featured = items.filter((i) => i.featured);
    const rest = items.filter((i) => !i.featured);
    return [...featured, ...rest].slice(0, Math.max(0, count || 4));
}
