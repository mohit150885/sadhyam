"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useRef, useState } from "react";
import { Copy, ExternalLink, Loader2, Save, Trash2, Upload } from "lucide-react";
import { useContent } from "../../../hooks/useContent";
import type { ContentKey } from "../../../lib/siteContent";
import { adminApi, saveContent, uploadFile } from "../../../components/admin/api";
import { FieldInput, getPath, setPath } from "../../../components/admin/fields";
import { useMediaLibrary } from "../../../components/admin/MediaPicker";
import { Badge, Btn, Loading, PageHeader, Panel, useConfirm, useToast } from "../../../components/admin/ui";
import { cn, formatDate } from "../../../lib/utils";

const BANNER_SLOTS: { contentKey: ContentKey; path: string; label: string; preview: string }[] = [
    { contentKey: "home", path: "hero.banners", label: "Home page hero (also the default for every page)", preview: "/" },
    { contentKey: "courses", path: "hero.bannerImages", label: "Courses page", preview: "/courses" },
    { contentKey: "testSeries", path: "hero.bannerImages", label: "Test Series page", preview: "/test-series" },
    { contentKey: "studyMaterial", path: "hero.bannerImages", label: "Study Material page", preview: "/study-material" },
    { contentKey: "faculty", path: "hero.bannerImages", label: "Faculty page", preview: "/faculty" },
    { contentKey: "results", path: "hero.bannerImages", label: "Results page", preview: "/results" },
    { contentKey: "about", path: "hero.bannerImages", label: "About page", preview: "/about" },
    { contentKey: "contact", path: "hero.bannerImages", label: "Contact page", preview: "/contact" },
];

export default function BannersPage() {
    const [tab, setTab] = useState<"banners" | "library">("banners");
    return (
        <>
            <PageHeader title="Banners & Media" description="Upload banner images for every page and manage all uploaded files." />
            <div className="mb-5 flex gap-2">
                {(["banners", "library"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setTab(t)} className={cn("rounded-lg px-4 py-2 text-[14px] font-bold", tab === t ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200")}>
                        {t === "banners" ? "Page banners" : "Media library"}
                    </button>
                ))}
            </div>
            {tab === "banners" ? (
                <div className="space-y-5">
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-[14px] text-blue-900">
                        Upload or reorder images, then press <strong>Save</strong>. The image URLs are written to Firestore (<code>site_content</code>) and every visitor sees the new banners immediately. Images are compressed to WebP automatically.
                    </div>
                    {BANNER_SLOTS.map((s) => (
                        <BannerSlot key={s.contentKey} {...s} />
                    ))}
                </div>
            ) : (
                <Library />
            )}
        </>
    );
}

function BannerSlot({ contentKey, path, label, preview }: { contentKey: ContentKey; path: string; label: string; preview: string }) {
    const toast = useToast();
    const { data, loading } = useContent(contentKey);
    const [draft, setDraft] = useState<string[] | null>(null);
    const [saving, setSaving] = useState(false);
    const live = useMemo(() => (getPath(data, path) as string[] | undefined) ?? [], [data, path]);
    if (!loading && draft === null) setDraft(live);

    const dirty = draft !== null && JSON.stringify(draft) !== JSON.stringify(live);

    const save = async () => {
        if (!draft) return;
        setSaving(true);
        try {
            await saveContent(contentKey, setPath(data, path, draft));
            toast("success", `${label}: banners published.`);
        } catch (e) {
            toast("error", e instanceof Error ? e.message : "Save failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Panel
            title={label}
            description={contentKey === "home" ? undefined : "Leave empty to reuse the home page banners."}
            actions={
                <div className="flex items-center gap-2">
                    {dirty && <span className="text-[12px] font-bold text-amber-600">Unsaved</span>}
                    <a href={preview} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 px-3 text-[13px] font-bold text-slate-600 hover:bg-slate-50">
                        View <ExternalLink size={13} />
                    </a>
                    <Btn size="sm" variant="primary" onClick={save} loading={saving} disabled={!dirty}>
                        <Save size={14} /> Save
                    </Btn>
                </div>
            }
        >
            {draft === null ? <Loading /> : <FieldInput field={{ key: path, label: "Images (first image shows first)", type: "images", folder: "banners" }} value={draft} onChange={(v) => setDraft(v as string[])} />}
        </Panel>
    );
}

function Library() {
    const toast = useToast();
    const { confirm, dialog } = useConfirm();
    const { items, error, reload } = useMediaLibrary(true);
    const ref = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState(false);

    const upload = async (files: FileList | null) => {
        if (!files?.length) return;
        setBusy(true);
        let n = 0;
        for (const f of Array.from(files)) {
            try {
                await uploadFile(f, "library");
                n++;
            } catch (e) {
                toast("error", `${f.name}: ${e instanceof Error ? e.message : "failed"}`);
            }
        }
        setBusy(false);
        if (n) toast("success", `${n} file(s) uploaded.`);
        reload();
    };

    return (
        <Panel
            title="All uploaded files"
            description="Copy a URL to use it anywhere, or pick files from any image field."
            actions={
                <>
                    <Btn variant="primary" onClick={() => ref.current?.click()} loading={busy}>
                        {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Upload files
                    </Btn>
                    <input ref={ref} type="file" multiple accept="image/*,application/pdf" hidden onChange={(e) => upload(e.target.files)} />
                </>
            }
        >
            {dialog}
            {items === null ? (
                <Loading />
            ) : error ? (
                <p className="text-[14px] text-red-600">{error}</p>
            ) : items.length === 0 ? (
                <p className="py-10 text-center text-[14px] text-slate-500">No files yet.</p>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {items.map((m) => (
                        <div key={m.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                            {m.type.startsWith("image/") ? (
                                <img src={m.url} alt="" className="aspect-video w-full bg-slate-50 object-cover" />
                            ) : (
                                <div className="grid aspect-video place-items-center bg-slate-50 text-[13px] font-bold text-slate-500">PDF</div>
                            )}
                            <div className="p-2.5">
                                <p className="truncate text-[12px] font-bold text-slate-800">{m.name}</p>
                                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                                    {Math.round(m.size / 1024)} KB • {formatDate(m.createdAt)} <Badge tone={m.backend === "storage" ? "blue" : "slate"}>{m.backend}</Badge>
                                </p>
                                <div className="mt-2 flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const full = m.url.startsWith("/") ? `${window.location.origin}${m.url}` : m.url;
                                            navigator.clipboard?.writeText(full);
                                            toast("success", "URL copied.");
                                        }}
                                        className="flex flex-1 items-center justify-center gap-1 rounded-md border border-slate-200 py-1 text-[12px] font-bold text-slate-600 hover:bg-slate-50"
                                    >
                                        <Copy size={12} /> Copy URL
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Delete"
                                        onClick={async () => {
                                            if (!(await confirm("Delete this file? Pages that still use it will show a placeholder."))) return;
                                            try {
                                                await adminApi(`/api/admin/media/${m.id}`, { method: "DELETE" });
                                                toast("success", "Deleted.");
                                                reload();
                                            } catch (e) {
                                                toast("error", e instanceof Error ? e.message : "Delete failed");
                                            }
                                        }}
                                        className="grid w-8 place-items-center rounded-md border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Panel>
    );
}
