"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ExternalLink, RotateCcw, Save, Search, Type } from "lucide-react";
import { useContent } from "../../hooks/useContent";
import { defaultSiteContent, type ContentKey } from "../../lib/siteContent";
import { cn } from "../../lib/utils";
import { adminApi, saveContent } from "./api";
import { getPath, SchemaForm, setPath } from "./fields";
import { settingsPages, TYPOGRAPHY_TOKENS } from "./schemas";
import { Btn, inputCls, Loading, PageHeader, Panel, useConfirm, useToast } from "./ui";

/**
 * Website Settings: edit any site_content document. "Save & Publish" writes
 * the document through /api/admin/content/<page>; every open page of the
 * website re-renders instantly from its live Firestore listener.
 */
export default function ContentEditor() {
    const pages = useMemo(() => settingsPages(), []);
    const params = useSearchParams();
    const [pageKey, setPageKey] = useState<string>(params.get("page") || "global");
    const [mode, setMode] = useState<"content" | "theme">(params.get("tab") === "theme" ? "theme" : "content");

    return (
        <>
            <PageHeader title="Website Settings" description="Edit text, images and layout for every page. Changes go live the moment you save." />
            <div className="grid items-start gap-6 xl:grid-cols-[280px_1fr]">
                <nav className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm xl:sticky xl:top-[88px]">
                    <button
                        type="button"
                        onClick={() => setMode("theme")}
                        className={cn("mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[14px] font-bold", mode === "theme" ? "bg-brand text-white" : "text-slate-700 hover:bg-slate-50")}
                    >
                        <Type size={16} /> Theme & Typography
                    </button>
                    {pages.map((p) => (
                        <button
                            key={p.key}
                            type="button"
                            onClick={() => {
                                setMode("content");
                                setPageKey(p.key);
                            }}
                            className={cn(
                                "block w-full rounded-lg px-3 py-2.5 text-left transition",
                                mode === "content" && pageKey === p.key ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            <span className="block text-[14px] font-bold">{p.title}</span>
                            <span className="block truncate text-[12px] text-slate-500">{p.description}</span>
                        </button>
                    ))}
                </nav>
                {mode === "theme" ? <ThemeEditor /> : <PageEditor key={pageKey} pageKey={pageKey as ContentKey} />}
            </div>
        </>
    );
}

function useDraft<K extends ContentKey>(key: K) {
    const { data, loading } = useContent(key);
    const [draft, setDraft] = useState<unknown>(null);
    const [savedJson, setSavedJson] = useState("");

    // Take the first loaded version as the editable draft.
    if (!loading && draft === null) {
        setDraft(data);
        setSavedJson(JSON.stringify(data));
    }

    const dirty = draft !== null && JSON.stringify(draft) !== savedJson;
    return { draft, setDraft, dirty, loading: loading || draft === null, markSaved: () => setSavedJson(JSON.stringify(draft)), live: data };
}

function PageEditor({ pageKey }: { pageKey: ContentKey }) {
    const page = settingsPages().find((p) => p.key === pageKey)!;
    const toast = useToast();
    const { confirm, dialog } = useConfirm();
    const { draft, setDraft, dirty, loading, markSaved } = useDraft(pageKey);
    const [saving, setSaving] = useState(false);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const warn = (e: BeforeUnloadEvent) => {
            if (dirty) e.preventDefault();
        };
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [dirty]);

    const save = async () => {
        setSaving(true);
        try {
            await saveContent(pageKey, draft);
            markSaved();
            toast("success", `${page.title} published. The website has been updated.`);
        } catch (err) {
            toast("error", err instanceof Error ? err.message : "Save failed");
        } finally {
            setSaving(false);
        }
    };

    const resetSection = async (fields: { key: string }[], title: string) => {
        if (!(await confirm(`Reset “${title}” to the default content? (You still need to save.)`))) return;
        let next = draft;
        fields.forEach((f) => (next = setPath(next, f.key, getPath(defaultSiteContent[pageKey], f.key))));
        setDraft(next);
    };

    if (loading) return <Loading label="Loading content..." />;

    const sections = page.sections.filter((s) => !filter || `${s.title} ${s.fields.map((f) => f.label).join(" ")}`.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="min-w-0 space-y-5">
            {dialog}
            <div className="sticky top-[64px] z-20 -mx-1 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
                <div>
                    <h2 className="text-[18px] font-black text-slate-900">{page.title}</h2>
                    <p className="text-[12px] font-semibold text-slate-500">
                        Firestore: <code>site_content/{pageKey}</code> {dirty ? <span className="ml-2 text-amber-600">● Unsaved changes</span> : <span className="ml-2 text-emerald-600">● Up to date</span>}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="relative">
                        <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Find a setting" className={cn(inputCls, "w-44 pl-8")} />
                    </span>
                    {page.preview && (
                        <a href={page.preview} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-[14px] font-bold text-slate-700 hover:bg-slate-50">
                            Preview <ExternalLink size={14} />
                        </a>
                    )}
                    <Btn variant="primary" onClick={save} loading={saving} disabled={!dirty}>
                        <Save size={16} /> Save & Publish
                    </Btn>
                </div>
            </div>

            {sections.map((s) => (
                <Panel
                    key={s.id}
                    title={s.title}
                    description={s.description}
                    actions={
                        <button type="button" onClick={() => resetSection(s.fields, s.title)} className="inline-flex items-center gap-1 text-[12px] font-bold text-slate-500 hover:text-slate-800">
                            <RotateCcw size={13} /> Reset to default
                        </button>
                    }
                >
                    <SchemaForm schema={s.fields} value={draft} onChange={setDraft} />
                </Panel>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Theme & typography                                                  */
/* ------------------------------------------------------------------ */

const FONTS = ["Inter", "Poppins", "Roboto", "Open Sans", "Lato", "Nunito", "Montserrat", "Mukta", "Noto Sans"];

function ThemeEditor() {
    const toast = useToast();
    const { draft, setDraft, dirty, loading, markSaved } = useDraft("global");
    const [saving, setSaving] = useState(false);
    const [seeding, setSeeding] = useState(false);

    if (loading) return <Loading />;
    const theme = (getPath(draft, "theme") as { brandColor: string; navyColor: string; fontFamily: string; typography: Record<string, string> }) ?? {
        brandColor: "#f97316",
        navyColor: "#021424",
        fontFamily: "Inter",
        typography: {},
    };
    const typo = theme.typography ?? {};

    const set = (k: string, v: unknown) => setDraft(setPath(draft, `theme.${k}`, v));
    const setToken = (token: string, v: string) => {
        const next = { ...typo };
        if (!v) delete next[token];
        else next[token] = /^\d+(\.\d+)?$/.test(v) ? `${v}px` : v;
        set("typography", next);
    };

    const save = async () => {
        setSaving(true);
        try {
            await saveContent("global", draft);
            markSaved();
            toast("success", "Theme published.");
        } catch (err) {
            toast("error", err instanceof Error ? err.message : "Save failed");
        } finally {
            setSaving(false);
        }
    };

    const seed = async () => {
        setSeeding(true);
        try {
            const r = await adminApi<{ results: Record<string, string> }>("/api/admin/seed", { method: "POST", json: { mode: "missing" } });
            const created = Object.entries(r.results).filter(([, v]) => v === "created").map(([k]) => k);
            toast("success", created.length ? `Created: ${created.join(", ")}` : "All pages already exist in Firestore.");
        } catch (err) {
            toast("error", err instanceof Error ? err.message : "Import failed");
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="min-w-0 space-y-5">
            <div className="sticky top-[64px] z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
                <div>
                    <h2 className="text-[18px] font-black text-slate-900">Theme & Typography</h2>
                    <p className="text-[12px] font-semibold text-slate-500">{dirty ? <span className="text-amber-600">● Unsaved changes</span> : <span className="text-emerald-600">● Up to date</span>}</p>
                </div>
                <Btn variant="primary" onClick={save} loading={saving} disabled={!dirty}>
                    <Save size={16} /> Save & Publish
                </Btn>
            </div>

            <Panel title="Colours & font" description="Used by every button, link, badge and heading on the website.">
                <div className="grid gap-5 md:grid-cols-3">
                    <ColorInput label="Brand colour" value={theme.brandColor} onChange={(v) => set("brandColor", v)} />
                    <ColorInput label="Dark (navy) colour" value={theme.navyColor} onChange={(v) => set("navyColor", v)} />
                    <label>
                        <span className="mb-1.5 block text-[13px] font-bold text-slate-700">Font</span>
                        <select className={inputCls} value={theme.fontFamily} onChange={(e) => set("fontFamily", e.target.value)}>
                            {FONTS.map((f) => (
                                <option key={f}>{f}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 p-4" style={{ ["--color-brand" as string]: theme.brandColor }}>
                    <span className="rounded-lg px-4 py-2 text-[15px] font-bold text-white" style={{ background: theme.brandColor }}>Primary button</span>
                    <span className="rounded-lg border-2 px-4 py-2 text-[15px] font-bold" style={{ borderColor: theme.brandColor, color: theme.brandColor }}>Outline button</span>
                    <span className="rounded-lg px-4 py-2 text-[15px] font-bold text-white" style={{ background: theme.navyColor }}>Navy section</span>
                </div>
            </Panel>

            <Panel title="Font sizes" description="The home page type scale is the default for every page. Leave a box empty to keep the default.">
                <div className="space-y-6">
                    {TYPOGRAPHY_TOKENS.map((g) => (
                        <div key={g.group}>
                            <h3 className="mb-3 text-[13px] font-black uppercase tracking-wide text-slate-500">{g.group}</h3>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {g.tokens.map((t) => (
                                    <label key={t.key} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
                                        <span className="min-w-0">
                                            <span className="block truncate text-[13px] font-bold text-slate-700">{t.label}</span>
                                            <span className="block text-[11px] text-slate-400">Default {t.def}</span>
                                        </span>
                                        <input
                                            value={(typo[t.key] ?? "").replace("px", "")}
                                            onChange={(e) => setToken(t.key, e.target.value.replace(/[^\d.]/g, ""))}
                                            placeholder={t.def.replace("px", "")}
                                            inputMode="decimal"
                                            className="h-9 w-16 rounded-md border border-slate-300 px-2 text-right text-[14px] font-semibold outline-none focus:border-brand"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-5">
                    <Btn size="sm" onClick={() => set("typography", {})}>
                        <RotateCcw size={14} /> Reset all font sizes
                    </Btn>
                </div>
            </Panel>

            <Panel title="Import default content" description="Creates any missing page documents in Firestore from the built-in defaults. Existing pages are not touched.">
                <Btn onClick={seed} loading={seeding}>Import missing pages</Btn>
            </Panel>
        </div>
    );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <label>
            <span className="mb-1.5 block text-[13px] font-bold text-slate-700">{label}</span>
            <span className="flex gap-2">
                <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1" />
                <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
            </span>
        </label>
    );
}
