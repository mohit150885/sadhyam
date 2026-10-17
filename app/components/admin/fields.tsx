"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ImagePlus, Link2, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { uploadFile } from "./api";
import { MediaPicker } from "./MediaPicker";
import { inputCls, useToast } from "./ui";

/* ------------------------------------------------------------------ */
/* Schema                                                              */
/* ------------------------------------------------------------------ */

export type FieldDef =
    | { key: string; label: string; type: "text" | "textarea" | "richtext" | "color" | "date" | "datetime"; help?: string; placeholder?: string; wide?: boolean }
    | { key: string; label: string; type: "number"; help?: string; step?: number; wide?: boolean }
    | { key: string; label: string; type: "toggle"; help?: string; wide?: boolean }
    | { key: string; label: string; type: "select"; options: readonly string[]; help?: string; wide?: boolean }
    | { key: string; label: string; type: "image"; help?: string; folder?: string; wide?: boolean }
    | { key: string; label: string; type: "file"; help?: string; folder?: string; wide?: boolean }
    | { key: string; label: string; type: "images"; help?: string; folder?: string; wide?: boolean }
    | { key: string; label: string; type: "strings"; help?: string; placeholder?: string; wide?: boolean }
    | { key: string; label: string; type: "links"; help?: string; wide?: boolean }
    | { key: string; label: string; type: "list"; fields: FieldDef[]; itemLabel?: string; newItem?: Record<string, unknown>; help?: string; wide?: boolean }
    | { key: string; label: string; type: "object"; fields: FieldDef[]; help?: string; wide?: boolean };

export function getPath(obj: unknown, path: string): unknown {
    if (!path) return obj;
    return path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined), obj);
}

export function setPath<T>(obj: T, path: string, value: unknown): T {
    const keys = path.split(".");
    const clone = (o: unknown) => (Array.isArray(o) ? [...o] : o && typeof o === "object" ? { ...(o as object) } : {});
    const root = clone(obj) as Record<string, unknown>;
    let cur = root;
    keys.forEach((k, i) => {
        if (i === keys.length - 1) cur[k] = value;
        else {
            cur[k] = clone(cur[k]);
            cur = cur[k] as Record<string, unknown>;
        }
    });
    return root as T;
}

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

export function SchemaForm<T>({ schema, value, onChange }: { schema: FieldDef[]; value: T; onChange: (next: T) => void }) {
    return (
        <div className="grid gap-5 md:grid-cols-2">
            {schema.map((f) => (
                <div key={f.key} className={cn(isWide(f) && "md:col-span-2")}>
                    <FieldInput field={f} value={getPath(value, f.key)} onChange={(v) => onChange(setPath(value, f.key, v))} />
                </div>
            ))}
        </div>
    );
}

function isWide(f: FieldDef) {
    if (f.wide !== undefined) return f.wide;
    return ["textarea", "richtext", "images", "list", "object", "links", "strings", "image"].includes(f.type);
}

export function Label({ label, help, children }: { label: string; help?: string; children: ReactNode }) {
    return (
        <div>
            <span className="mb-1.5 block text-[13px] font-bold text-slate-700">{label}</span>
            {children}
            {help && <span className="mt-1 block text-[12px] text-slate-500">{help}</span>}
        </div>
    );
}

export function FieldInput({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
    switch (field.type) {
        case "datetime":
            return (
                <Label label={field.label} help={field.help}>
                    <div className="flex gap-2">
                        <input type="datetime-local" className={inputCls} value={isoToLocalInput(String(value ?? ""))} onChange={(e) => onChange(localInputToIso(e.target.value))} />
                        {Boolean(value) && (
                            <button type="button" onClick={() => onChange("")} className="shrink-0 rounded-lg border border-slate-300 px-3 text-[13px] font-bold text-slate-600 hover:bg-slate-50" aria-label="Clear date">
                                Clear
                            </button>
                        )}
                    </div>
                </Label>
            );
        case "text":
        case "date":
            return (
                <Label label={field.label} help={field.help}>
                    <input type={field.type === "date" ? "date" : "text"} className={inputCls} value={String(value ?? "")} placeholder={"placeholder" in field ? field.placeholder : undefined} onChange={(e) => onChange(e.target.value)} />
                </Label>
            );
        case "textarea":
        case "richtext":
            return (
                <Label label={field.label} help={field.help ?? (field.type === "richtext" ? "Use “## Heading”, “- bullet” and blank lines between paragraphs. Links: [text](https://...)" : undefined)}>
                    <textarea className={cn(inputCls, "h-auto py-2 leading-relaxed", field.type === "richtext" && "font-mono text-[13px]")} rows={field.type === "richtext" ? 14 : 3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
                </Label>
            );
        case "number":
            return (
                <Label label={field.label} help={field.help}>
                    <input type="number" step={field.step ?? 1} className={inputCls} value={value === undefined || value === null ? "" : String(value)} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />
                </Label>
            );
        case "toggle":
            return (
                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-slate-200 px-3 py-2.5">
                    <span>
                        <span className="block text-[13px] font-bold text-slate-700">{field.label}</span>
                        {field.help && <span className="block text-[12px] text-slate-500">{field.help}</span>}
                    </span>
                    <Toggle checked={Boolean(value)} onChange={onChange} />
                </label>
            );
        case "select":
            return (
                <Label label={field.label} help={field.help}>
                    <select className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
                        {!field.options.includes(String(value ?? "")) && <option value={String(value ?? "")}>{String(value ?? "") || "— Select —"}</option>}
                        {field.options.map((o) => (
                            <option key={o} value={o}>
                                {o}
                            </option>
                        ))}
                    </select>
                </Label>
            );
        case "color":
            return (
                <Label label={field.label} help={field.help}>
                    <div className="flex gap-2">
                        <input type="color" value={String(value || "#000000")} onChange={(e) => onChange(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1" />
                        <input className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
                    </div>
                </Label>
            );
        case "image":
            return (
                <Label label={field.label} help={field.help}>
                    <ImageField value={String(value ?? "")} onChange={onChange} folder={field.folder} />
                </Label>
            );
        case "file":
            return (
                <Label label={field.label} help={field.help}>
                    <ImageField value={String(value ?? "")} onChange={onChange} folder={field.folder} accept="application/pdf,image/*" preview={false} />
                </Label>
            );
        case "images":
            return (
                <Label label={field.label} help={field.help}>
                    <ImagesField value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} folder={field.folder} />
                </Label>
            );
        case "strings":
            return (
                <Label label={field.label} help={field.help}>
                    <StringsField value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} placeholder={field.placeholder} />
                </Label>
            );
        case "links":
            return (
                <Label label={field.label} help={field.help}>
                    <ListField
                        value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
                        onChange={onChange}
                        fields={[
                            { key: "label", label: "Label", type: "text" },
                            { key: "href", label: "Link (e.g. /courses or https://...)", type: "text" },
                        ]}
                        itemLabel="label"
                        compact
                    />
                </Label>
            );
        case "list":
            return (
                <Label label={field.label} help={field.help}>
                    <ListField value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []} onChange={onChange} fields={field.fields} itemLabel={field.itemLabel} newItem={field.newItem} />
                </Label>
            );
        case "object":
            return (
                <fieldset className="rounded-xl border border-slate-200 p-4">
                    <legend className="px-1 text-[13px] font-black text-slate-800">{field.label}</legend>
                    <SchemaForm schema={field.fields} value={(value as Record<string, unknown>) ?? {}} onChange={onChange} />
                </fieldset>
            );
    }
}

/** "2026-10-20T12:30:00.000Z" → "2026-10-20T18:00" in the admin's local time. */
function isoToLocalInput(iso: string) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Local "YYYY-MM-DDTHH:mm" → ISO string with timezone, so every visitor sees the same moment. */
function localInputToIso(local: string) {
    if (!local) return "";
    const d = new Date(local);
    return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={cn("relative h-6 w-11 shrink-0 rounded-full transition", checked ? "bg-brand" : "bg-slate-300")}
        >
            <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition", checked ? "left-[22px]" : "left-0.5")} />
        </button>
    );
}

/* ------------------------------------------------------------------ */
/* Images                                                              */
/* ------------------------------------------------------------------ */

export function ImageField({
    value,
    onChange,
    folder = "general",
    accept = "image/*",
    preview = true,
}: {
    value: string;
    onChange: (v: string) => void;
    folder?: string;
    accept?: string;
    preview?: boolean;
}) {
    const toast = useToast();
    const ref = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState(false);
    const [picker, setPicker] = useState(false);

    const pick = async (file?: File) => {
        if (!file) return;
        setBusy(true);
        try {
            const res = await uploadFile(file, folder);
            onChange(res.url);
            toast("success", `Uploaded (${res.backend === "storage" ? "Firebase Storage" : "Firestore"}). Save to publish.`);
        } catch (err) {
            toast("error", err instanceof Error ? err.message : "Upload failed");
        } finally {
            setBusy(false);
            if (ref.current) ref.current.value = "";
        }
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            {preview && (
                <div className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
                    {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="text-slate-300" size={28} />}
                </div>
            )}
            <div className="min-w-0 flex-1 space-y-2">
                <div className="flex gap-2">
                    <span className="relative flex-1">
                        <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input className={cn(inputCls, "pl-8")} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste an image URL or upload" />
                    </span>
                    {value && (
                        <button type="button" onClick={() => onChange("")} className="rounded-lg border border-slate-300 px-2.5 text-slate-500 hover:bg-slate-50" aria-label="Clear">
                            <X size={16} />
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[13px] font-bold text-white hover:bg-slate-800 disabled:opacity-60">
                        {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} {busy ? "Uploading..." : "Upload"}
                    </button>
                    <button type="button" onClick={() => setPicker(true)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-[13px] font-bold text-slate-700 hover:bg-slate-50">
                        Media library
                    </button>
                </div>
                <input ref={ref} type="file" accept={accept} hidden onChange={(e) => pick(e.target.files?.[0])} />
            </div>
            <MediaPicker
                open={picker}
                onClose={() => setPicker(false)}
                onPick={(url) => {
                    onChange(url);
                    setPicker(false);
                }}
            />
        </div>
    );
}

function ImagesField({ value, onChange, folder }: { value: string[]; onChange: (v: string[]) => void; folder?: string }) {
    const toast = useToast();
    const ref = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState(false);
    const [picker, setPicker] = useState(false);

    const upload = async (files: FileList | null) => {
        if (!files?.length) return;
        setBusy(true);
        const urls: string[] = [];
        for (const f of Array.from(files)) {
            try {
                urls.push((await uploadFile(f, folder)).url);
            } catch (err) {
                toast("error", `${f.name}: ${err instanceof Error ? err.message : "upload failed"}`);
            }
        }
        if (urls.length) {
            onChange([...value, ...urls]);
            toast("success", `${urls.length} image(s) uploaded. Save to publish.`);
        }
        setBusy(false);
        if (ref.current) ref.current.value = "";
    };

    const move = (i: number, d: number) => {
        const next = [...value];
        const j = i + d;
        if (j < 0 || j >= next.length) return;
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
    };

    return (
        <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {value.map((src, i) => (
                    <div key={`${src}-${i}`} className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <img src={src} alt="" className="aspect-video w-full object-cover" />
                        <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 text-[11px] font-bold text-white">{i + 1}</span>
                        <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
                            <IconBtn label="Move left" onClick={() => move(i, -1)}><ArrowUp size={13} className="-rotate-90" /></IconBtn>
                            <IconBtn label="Move right" onClick={() => move(i, 1)}><ArrowDown size={13} className="-rotate-90" /></IconBtn>
                            <IconBtn label="Remove" onClick={() => onChange(value.filter((_, x) => x !== i))}><Trash2 size={13} /></IconBtn>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="flex aspect-video flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-[12px] font-bold text-slate-500 hover:border-brand hover:text-brand">
                    {busy ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                    {busy ? "Uploading..." : "Upload images"}
                </button>
            </div>
            <div className="mt-2 flex gap-2">
                <button type="button" onClick={() => setPicker(true)} className="text-[13px] font-bold text-brand hover:underline">
                    + Add from media library
                </button>
                <button
                    type="button"
                    onClick={() => {
                        const url = window.prompt("Image URL");
                        if (url) onChange([...value, url.trim()]);
                    }}
                    className="text-[13px] font-bold text-slate-600 hover:underline"
                >
                    + Add by URL
                </button>
            </div>
            <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
            <MediaPicker
                open={picker}
                onClose={() => setPicker(false)}
                onPick={(url) => {
                    onChange([...value, url]);
                    setPicker(false);
                }}
            />
        </div>
    );
}

function IconBtn({ children, onClick, label }: { children: ReactNode; onClick: () => void; label: string }) {
    return (
        <button type="button" onClick={onClick} aria-label={label} className="grid h-6 w-6 place-items-center rounded bg-white/90 text-slate-700 hover:bg-white">
            {children}
        </button>
    );
}

/* ------------------------------------------------------------------ */
/* Lists                                                               */
/* ------------------------------------------------------------------ */

function StringsField({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
    const [draft, setDraft] = useState("");
    const add = () => {
        const v = draft.trim();
        if (v) onChange([...value, v]);
        setDraft("");
    };
    return (
        <div className="rounded-lg border border-slate-300 bg-white p-2">
            <div className="flex flex-wrap gap-1.5">
                {value.map((s, i) => (
                    <span key={`${s}-${i}`} className="inline-flex items-center gap-1 rounded-md bg-slate-100 py-1 pl-2.5 pr-1 text-[13px] font-semibold text-slate-700">
                        <input
                            value={s}
                            onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
                            className="bg-transparent outline-none"
                            style={{ width: `${Math.max(3, s.length + 1)}ch` }}
                        />
                        <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-red-600" aria-label="Remove">
                            <X size={13} />
                        </button>
                    </span>
                ))}
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            add();
                        }
                    }}
                    onBlur={add}
                    placeholder={placeholder || "Type and press Enter"}
                    className="min-w-[160px] flex-1 px-1.5 py-1 text-[13px] outline-none"
                />
            </div>
        </div>
    );
}

export function ListField({
    value,
    onChange,
    fields,
    itemLabel,
    newItem,
    compact = false,
}: {
    value: Record<string, unknown>[];
    onChange: (v: Record<string, unknown>[]) => void;
    fields: FieldDef[];
    itemLabel?: string;
    newItem?: Record<string, unknown>;
    compact?: boolean;
}) {
    const [open, setOpen] = useState<number | null>(null);

    const blank = () => {
        if (newItem) return { ...newItem };
        const o: Record<string, unknown> = {};
        fields.forEach((f) => {
            o[f.key] = f.type === "toggle" ? false : f.type === "number" ? 0 : ["strings", "images", "list", "links"].includes(f.type) ? [] : f.type === "object" ? {} : "";
        });
        return o;
    };

    const move = (i: number, d: number) => {
        const j = i + d;
        if (j < 0 || j >= value.length) return;
        const next = [...value];
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
        setOpen(open === i ? j : open);
    };

    if (compact) {
        return (
            <div className="space-y-2">
                {value.map((item, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 sm:flex-nowrap">
                        {fields.map((f) => (
                            <input key={f.key} className={cn(inputCls, "h-9")} placeholder={f.label} value={String(item[f.key] ?? "")} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, [f.key]: e.target.value } : x)))} />
                        ))}
                        <div className="flex shrink-0 gap-1">
                            <SmallBtn label="Up" onClick={() => move(i, -1)}><ArrowUp size={14} /></SmallBtn>
                            <SmallBtn label="Down" onClick={() => move(i, 1)}><ArrowDown size={14} /></SmallBtn>
                            <SmallBtn label="Remove" danger onClick={() => onChange(value.filter((_, j) => j !== i))}><Trash2 size={14} /></SmallBtn>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={() => onChange([...value, blank()])} className="inline-flex items-center gap-1 text-[13px] font-bold text-brand hover:underline">
                    <Plus size={14} /> Add
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {value.map((item, i) => {
                const title = String((itemLabel && item[itemLabel]) || item.title || item.name || item.question || item.label || `Item ${i + 1}`);
                const expanded = open === i;
                return (
                    <div key={i} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2">
                            <button type="button" onClick={() => setOpen(expanded ? null : i)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                                <ChevronDown size={16} className={cn("shrink-0 text-slate-400 transition", expanded && "rotate-180")} />
                                <span className="text-[12px] font-bold text-slate-400">{i + 1}.</span>
                                <span className="truncate text-[14px] font-bold text-slate-800">{title}</span>
                            </button>
                            <SmallBtn label="Up" onClick={() => move(i, -1)}><ArrowUp size={14} /></SmallBtn>
                            <SmallBtn label="Down" onClick={() => move(i, 1)}><ArrowDown size={14} /></SmallBtn>
                            <SmallBtn label="Remove" danger onClick={() => onChange(value.filter((_, j) => j !== i))}><Trash2 size={14} /></SmallBtn>
                        </div>
                        {expanded && (
                            <div className="border-t border-slate-100 p-4">
                                <SchemaForm schema={fields} value={item} onChange={(next) => onChange(value.map((x, j) => (j === i ? next : x)))} />
                            </div>
                        )}
                    </div>
                );
            })}
            <button
                type="button"
                onClick={() => {
                    onChange([...value, blank()]);
                    setOpen(value.length);
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 text-[13px] font-bold text-slate-600 hover:border-brand hover:text-brand"
            >
                <Plus size={15} /> Add item
            </button>
        </div>
    );
}

function SmallBtn({ children, onClick, label, danger }: { children: ReactNode; onClick: () => void; label: string; danger?: boolean }) {
    return (
        <button type="button" onClick={onClick} aria-label={label} title={label} className={cn("grid h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-white", danger ? "hover:text-red-600" : "hover:text-slate-900")}>
            {children}
        </button>
    );
}
