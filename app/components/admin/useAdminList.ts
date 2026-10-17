"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "./api";

/** Loads /api/admin/data/<collection> and exposes create / update / remove helpers. */
export function useAdminList<T extends { id: string }>(collection: string) {
    const [items, setItems] = useState<T[] | null>(null);
    const [error, setError] = useState("");

    const reload = useCallback(
        () =>
            adminApi<{ items: T[] }>(`/api/admin/data/${collection}`)
                .then((r) => {
                    setError("");
                    setItems(r.items);
                })
                .catch((e: unknown) => {
                    setError(e instanceof Error ? e.message : "Failed to load");
                    setItems([]);
                }),
        [collection]
    );

    useEffect(() => {
        reload();
    }, [reload]);

    const update = async (id: string, patch: Partial<T>) => {
        await adminApi(`/api/admin/data/${collection}/${id}`, { method: "PATCH", json: patch });
        setItems((list) => (list ?? []).map((i) => (i.id === id ? { ...i, ...patch } : i)));
    };

    const create = async (data: Partial<T>) => {
        const r = await adminApi<{ id: string }>(`/api/admin/data/${collection}`, { method: "POST", json: data });
        await reload();
        return r.id;
    };

    const remove = async (id: string) => {
        await adminApi(`/api/admin/data/${collection}/${id}`, { method: "DELETE" });
        setItems((list) => (list ?? []).filter((i) => i.id !== id));
    };

    return { items, error, reload, update, create, remove, loading: items === null };
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
    if (!rows.length) return;
    const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
    const esc = (v: unknown) => {
        const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}
