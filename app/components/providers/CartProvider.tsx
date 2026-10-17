"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { CartLine, ProductKind } from "../../lib/models";

const STORAGE_KEY = "sadhyam_cart_v1";
const EMPTY: CartLine[] = [];

/* A tiny localStorage-backed store so every tab and component sees the same cart. */
let cache: CartLine[] | null = null;
const listeners = new Set<() => void>();

function read(): CartLine[] {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed)
            ? parsed.filter((l): l is CartLine => l && typeof l.id === "string" && typeof l.kind === "string")
            : [];
    } catch {
        return [];
    }
}

function getSnapshot(): CartLine[] {
    if (cache === null) cache = read();
    return cache;
}

function write(next: CartLine[]) {
    cache = next;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        /* storage unavailable — cart stays in memory */
    }
    listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY) {
            cache = read();
            listener();
        }
    };
    window.addEventListener("storage", onStorage);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
    };
}

type CartState = {
    lines: CartLine[];
    count: number;
    has: (kind: ProductKind, id: string) => boolean;
    add: (kind: ProductKind, id: string) => void;
    remove: (kind: ProductKind, id: string) => void;
    clear: () => void;
};

const CartContext = createContext<CartState>({
    lines: [],
    count: 0,
    has: () => false,
    add: () => {},
    remove: () => {},
    clear: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
    const lines = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

    const value = useMemo<CartState>(
        () => ({
            lines,
            count: lines.length,
            has: (kind, id) => lines.some((l) => l.kind === kind && l.id === id),
            add: (kind, id) => {
                const current = getSnapshot();
                if (!current.some((l) => l.kind === kind && l.id === id)) write([...current, { kind, id }]);
            },
            remove: (kind, id) => write(getSnapshot().filter((l) => !(l.kind === kind && l.id === id))),
            clear: () => write([]),
        }),
        [lines]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    return useContext(CartContext);
}
