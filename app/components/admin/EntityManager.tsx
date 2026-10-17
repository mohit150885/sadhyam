"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Copy, ExternalLink, Eye, EyeOff, KeyRound, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useContent } from "../../hooks/useContent";
import type { ContentKey } from "../../lib/siteContent";
import type { ProductKind } from "../../lib/models";
import { cn, formatINR, slugify } from "../../lib/utils";
import { adminApi, saveContent } from "./api";
import { getPath, SchemaForm, setPath, type FieldDef } from "./fields";
import { Badge, Btn, inputCls, Loading, Modal, PageHeader, useConfirm, useToast } from "./ui";

type Item = Record<string, unknown> & { id?: string };

/**
 * Manages an array inside a site_content document (e.g. site_content/courses.items).
 * Every change is published straight away, so the website updates live.
 */
export default function EntityManager({
    title,
    description,
    contentKey,
    arrayPath,
    schema,
    noun,
    idFrom = "title",
    newItem,
    kind,
    previewBase,
    hasId = true,
}: {
    title: string;
    description: string;
    contentKey: ContentKey;
    arrayPath: string;
    schema: FieldDef[];
    noun: string;
    idFrom?: string;
    newItem: Item;
    kind?: ProductKind;
    previewBase?: string;
    hasId?: boolean;
}) {
    const toast = useToast();
    const { confirm, dialog } = useConfirm();
    const { data, loading } = useContent(contentKey);
    const items = useMemo(() => {
        const raw = getPath(data, arrayPath);
        return Array.isArray(raw) ? (raw as Item[]) : [];
    }, [data, arrayPath]);

    const [q, setQ] = useState("");
    const [category, setCategory] = useState("");
    const [editing, setEditing] = useState<{ index: number; item: Item } | null>(null);
    const [saving, setSaving] = useState(false);
    const [access, setAccess] = useState<{ url: string; note: string } | null>(null);

    const categories = useMemo(() => Array.from(new Set(items.map((i) => String(i.category ?? "")).filter(Boolean))), [items]);

    const publish = async (next: Item[], message: string) => {
        setSaving(true);
        try {
            await saveContent(contentKey, setPath(data, arrayPath, next));
            toast("success", message);
            return true;
        } catch (err) {
            toast("error", err instanceof Error ? err.message : "Save failed");
            return false;
        } finally {
            setSaving(false);
        }
    };

    const openEditor = async (index: number, item: Item) => {
        setEditing({ index, item: structuredClone(item) });
        setAccess(null);
        if (kind && item.id) {
            try {
                const r = await adminApi<{ item: { url?: string; note?: string } | null }>(`/api/admin/data/private_content/${kind}_${item.id}`);
                setAccess({ url: r.item?.url ?? "", note: r.item?.note ?? "" });
            } catch {
                setAccess({ url: "", note: "" });
            }
        } else if (kind) setAccess({ url: "", note: "" });
    };

    const saveEditing = async () => {
        if (!editing) return;
        const item = { ...editing.item };
        const label = String(item[idFrom] ?? item.title ?? item.name ?? "").trim();
        if (!label) {
            toast("error", `Please enter a ${idFrom}.`);
            return;
        }
        if (hasId) {
            if (!item.id) {
                let base = slugify(label) || `item-${Date.now()}`;
                if (items.some((i) => i.id === base)) base = `${base}-${Date.now().toString(36).slice(-4)}`;
                item.id = base;
            } else if (!/^[A-Za-z0-9_-]+$/.test(String(item.id))) {
                toast("error", "ID can only contain letters, numbers, - and _.");
                return;
            }
            const dup = items.findIndex((i, idx) => i.id === item.id && idx !== editing.index);
            if (dup !== -1) {
                toast("error", "Another item already uses this ID.");
                return;
            }
        }
        const next = [...items];
        if (editing.index === -1) next.unshift(item);
        else next[editing.index] = item;
        const ok = await publish(next, `${label} saved and published.`);
        if (ok && kind && access && item.id) {
            await adminApi("/api/admin/data/private_content", { method: "POST", json: { id: `${kind}_${item.id}`, url: access.url, note: access.note } }).catch((e) =>
                toast("error", `Saved, but access link failed: ${e.message}`)
            );
        }
        if (ok) setEditing(null);
    };

    const toggle = (index: number, key: "published" | "featured") => {
        const next = items.map((it, i) => (i === index ? { ...it, [key]: key === "published" ? it.published === false : !it.featured } : it));
        publish(next, "Updated.");
    };

    const move = (index: number, d: number) => {
        const j = index + d;
        if (j < 0 || j >= items.length) return;
        const next = [...items];
        [next[index], next[j]] = [next[j], next[index]];
        publish(next, "Order updated.");
    };

    const remove = async (index: number) => {
        const it = items[index];
        if (!(await confirm(`Delete “${String(it.title ?? it.name ?? noun)}”? This removes it from the website.`))) return;
        publish(items.filter((_, i) => i !== index), "Deleted.");
    };

    const duplicate = (index: number) => {
        const it = structuredClone(items[index]);
        delete it.id;
        it[idFrom] = `${String(it[idFrom] ?? "")} (copy)`;
        it.published = false;
        openEditor(-1, it);
    };

    const filtered = items
        .map((it, index) => ({ it, index }))
        .filter(({ it }) => (!category || it.category === category) && (!q || JSON.stringify(it).toLowerCase().includes(q.toLowerCase())));

    return (
        <>
            {dialog}
            <PageHeader
                title={title}
                description={description}
                actions={
                    <Btn variant="primary" onClick={() => openEditor(-1, structuredClone(newItem))}>
                        <Plus size={16} /> Add {noun}
                    </Btn>
                }
            />

            <div className="mb-4 flex flex-wrap items-center gap-3">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${noun}s...`} className={cn(inputCls, "w-64")} />
                {categories.length > 1 && (
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={cn(inputCls, "w-48")}>
                        <option value="">All exams</option>
                        {categories.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>
                )}
                <span className="text-[13px] font-semibold text-slate-500">{filtered.length} of {items.length}</span>
                {saving && <span className="text-[13px] font-semibold text-brand">Publishing...</span>}
            </div>

            {loading ? (
                <Loading />
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-[14px]">
                            <thead className="bg-slate-50 text-[12px] font-bold uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">{noun}</th>
                                    <th className="px-4 py-3">Details</th>
                                    {"price" in newItem && <th className="px-4 py-3">Price</th>}
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                                            No {noun}s found.
                                        </td>
                                    </tr>
                                )}
                                {filtered.map(({ it, index }) => {
                                    const name = String(it.title ?? it.name ?? "");
                                    const sub = [it.category, it.type, it.subject, it.exam, it.role, it.rank].filter(Boolean).join(" • ");
                                    const published = it.published !== false;
                                    return (
                                        <tr key={`${String(it.id ?? name)}-${index}`} className="hover:bg-slate-50/60">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {it.image ? (
                                                        <img src={String(it.image)} alt="" className="h-12 w-16 shrink-0 rounded-md bg-slate-100 object-cover" />
                                                    ) : (
                                                        <span className="h-12 w-16 shrink-0 rounded-md bg-slate-100" />
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="max-w-[340px] truncate font-bold text-slate-900">{name}</p>
                                                        {hasId && <p className="truncate text-[12px] text-slate-400">{String(it.id ?? "")}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-[13px] text-slate-600">{sub || "—"}</td>
                                            {"price" in newItem && (
                                                <td className="px-4 py-3">
                                                    <span className="font-bold">{formatINR(Number(it.price ?? 0))}</span>
                                                    {Number(it.oldPrice) > Number(it.price) && <del className="ml-1.5 text-[12px] text-slate-400">{formatINR(Number(it.oldPrice))}</del>}
                                                </td>
                                            )}
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {"published" in newItem && (published ? <Badge tone="green">Live</Badge> : <Badge>Hidden</Badge>)}
                                                    {Boolean(it.featured) && <Badge tone="brand">Featured</Badge>}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-0.5">
                                                    <IconAction label="Move up" onClick={() => move(index, -1)}><ArrowUp size={15} /></IconAction>
                                                    <IconAction label="Move down" onClick={() => move(index, 1)}><ArrowDown size={15} /></IconAction>
                                                    {"published" in newItem && (
                                                        <IconAction label={published ? "Hide" : "Publish"} onClick={() => toggle(index, "published")}>{published ? <Eye size={15} /> : <EyeOff size={15} />}</IconAction>
                                                    )}
                                                    {"featured" in newItem && (
                                                        <IconAction label="Toggle featured" onClick={() => toggle(index, "featured")}>
                                                            <Star size={15} className={it.featured ? "fill-amber-400 text-amber-400" : ""} />
                                                        </IconAction>
                                                    )}
                                                    {previewBase && Boolean(it.id) && (
                                                        <a href={`${previewBase}/${String(it.id)}`} target="_blank" rel="noreferrer" title="Open on website" className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                                                            <ExternalLink size={15} />
                                                        </a>
                                                    )}
                                                    <IconAction label="Duplicate" onClick={() => duplicate(index)}><Copy size={15} /></IconAction>
                                                    <IconAction label="Edit" onClick={() => openEditor(index, it)}><Pencil size={15} /></IconAction>
                                                    <IconAction label="Delete" danger onClick={() => remove(index)}><Trash2 size={15} /></IconAction>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal
                open={editing !== null}
                onClose={() => setEditing(null)}
                title={editing?.index === -1 ? `Add ${noun}` : `Edit ${noun}`}
                wide
                footer={
                    <>
                        <Btn onClick={() => setEditing(null)}>Cancel</Btn>
                        <Btn variant="primary" onClick={saveEditing} loading={saving}>
                            Save & Publish
                        </Btn>
                    </>
                }
            >
                {editing && (
                    <div className="space-y-6">
                        {hasId && (
                            <label className="block">
                                <span className="mb-1.5 block text-[13px] font-bold text-slate-700">URL ID</span>
                                <input
                                    className={inputCls}
                                    value={String(editing.item.id ?? "")}
                                    placeholder="Generated from the title if left empty"
                                    onChange={(e) => setEditing({ ...editing, item: { ...editing.item, id: e.target.value.trim() } })}
                                    disabled={editing.index !== -1 && Boolean(items[editing.index]?.id)}
                                />
                                <span className="mt-1 block text-[12px] text-slate-500">
                                    Page address: {previewBase}/{String(editing.item.id || slugify(String(editing.item[idFrom] ?? "")) || "...")}
                                    {editing.index !== -1 && " — the ID can't be changed after creation because students' orders reference it."}
                                </span>
                            </label>
                        )}
                        <SchemaForm schema={schema} value={editing.item} onChange={(item) => setEditing({ ...editing, item })} />
                        {kind && access && (
                            <fieldset className="rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-4">
                                <legend className="flex items-center gap-1.5 px-1 text-[13px] font-black text-emerald-800">
                                    <KeyRound size={14} /> Student access (private — only paid students see this)
                                </legend>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <label className="block md:col-span-2">
                                        <span className="mb-1.5 block text-[13px] font-bold text-slate-700">Access link</span>
                                        <input className={inputCls} value={access.url} onChange={(e) => setAccess({ ...access, url: e.target.value })} placeholder="Class link, YouTube playlist, Google Drive, test portal..." />
                                    </label>
                                    <label className="block md:col-span-2">
                                        <span className="mb-1.5 block text-[13px] font-bold text-slate-700">Note for students</span>
                                        <textarea className={cn(inputCls, "h-auto py-2")} rows={2} value={access.note} onChange={(e) => setAccess({ ...access, note: e.target.value })} placeholder="e.g. Live classes every Mon/Wed/Fri at 7 PM. Join the Telegram group for notes." />
                                    </label>
                                </div>
                            </fieldset>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
}

function IconAction({ children, onClick, label, danger }: { children: React.ReactNode; onClick: () => void; label: string; danger?: boolean }) {
    return (
        <button type="button" onClick={onClick} title={label} aria-label={label} className={cn("grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100", danger ? "hover:text-red-600" : "hover:text-slate-900")}>
            {children}
        </button>
    );
}

/** Exams configured in Website Settings → General (used for category dropdowns). */
export function useExams() {
    return useContent("global").data.exams;
}
