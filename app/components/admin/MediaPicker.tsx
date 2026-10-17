"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "./api";
import { Loading, Modal } from "./ui";

export type MediaItem = { id: string; url: string; name: string; type: string; size: number; backend: string; folder?: string; createdAt: number };

export function useMediaLibrary(open: boolean) {
    const [items, setItems] = useState<MediaItem[] | null>(null);
    const [error, setError] = useState("");
    const reload = useCallback(
        () =>
            adminApi<{ items: MediaItem[] }>("/api/admin/media")
                .then((r) => {
                    setError("");
                    setItems(r.items);
                })
                .catch((e: Error) => {
                    setItems([]);
                    setError(e.message);
                }),
        []
    );
    useEffect(() => {
        if (open) reload();
    }, [open, reload]);
    return { items, error, reload };
}

/** Pick a previously uploaded image. */
export function MediaPicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (url: string) => void }) {
    const { items, error } = useMediaLibrary(open);
    const [q, setQ] = useState("");
    if (!open) return null;
    const shown = (items ?? []).filter((m) => m.type.startsWith("image/") && (!q || m.name.toLowerCase().includes(q.toLowerCase())));
    return (
        <Modal open={open} onClose={onClose} title="Media library" wide>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by file name..." className="mb-4 h-10 w-full rounded-lg border border-slate-300 px-3 text-[14px] outline-none focus:border-brand" />
            {items === null ? (
                <Loading />
            ) : error ? (
                <p className="text-[14px] text-red-600">{error}</p>
            ) : shown.length === 0 ? (
                <p className="py-10 text-center text-[14px] text-slate-500">No uploaded images yet. Use the Upload button on any image field.</p>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {shown.map((m) => (
                        <button key={m.id} type="button" onClick={() => onPick(m.url)} className="group overflow-hidden rounded-lg border border-slate-200 text-left hover:border-brand hover:ring-2 hover:ring-brand-100">
                            <img src={m.url} alt="" className="aspect-video w-full bg-slate-50 object-cover" />
                            <span className="block truncate px-2 py-1.5 text-[12px] font-semibold text-slate-600">{m.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </Modal>
    );
}
