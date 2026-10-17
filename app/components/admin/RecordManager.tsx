"use client";

import { useState, type ReactNode } from "react";
import { Pencil, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { SchemaForm, type FieldDef } from "./fields";
import { useAdminList } from "./useAdminList";
import { Btn, ErrorBox, Loading, Modal, PageHeader, useConfirm, useToast } from "./ui";

type Rec = { id: string } & Record<string, unknown>;

/** CRUD screen for a Firestore collection (coupons, notifications, admins). */
export default function RecordManager({
    title,
    description,
    collection,
    schema,
    editSchema,
    blank,
    columns,
    noun,
    validate,
}: {
    title: string;
    description: string;
    collection: string;
    schema: FieldDef[];
    editSchema?: FieldDef[];
    blank: Record<string, unknown>;
    columns: { label: string; render: (r: Rec) => ReactNode }[];
    noun: string;
    validate?: (r: Record<string, unknown>) => string | null;
}) {
    const toast = useToast();
    const { confirm, dialog } = useConfirm();
    const { items, error, reload, create, update, remove } = useAdminList<Rec>(collection);
    const [editing, setEditing] = useState<{ id?: string; data: Record<string, unknown> } | null>(null);
    const [busy, setBusy] = useState(false);

    const save = async () => {
        if (!editing) return;
        const problem = validate?.(editing.data);
        if (problem) {
            toast("error", problem);
            return;
        }
        setBusy(true);
        try {
            if (editing.id) await update(editing.id, editing.data);
            else await create(editing.data);
            toast("success", `${noun[0].toUpperCase()}${noun.slice(1)} saved.`);
            setEditing(null);
        } catch (e) {
            toast("error", e instanceof Error ? e.message : "Save failed");
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            {dialog}
            <PageHeader
                title={title}
                description={description}
                actions={
                    <>
                        <Btn onClick={reload}><RefreshCcw size={15} /> Refresh</Btn>
                        <Btn variant="primary" onClick={() => setEditing({ data: { ...blank } })}><Plus size={16} /> Add {noun}</Btn>
                    </>
                }
            />
            {error ? (
                <ErrorBox message={error} onRetry={reload} />
            ) : !items ? (
                <Loading />
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-[14px]">
                            <thead className="bg-slate-50 text-[12px] font-bold uppercase text-slate-500">
                                <tr>
                                    {columns.map((c) => <th key={c.label} className="px-4 py-3">{c.label}</th>)}
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.length === 0 && <tr><td colSpan={columns.length + 1} className="px-4 py-12 text-center text-slate-500">Nothing here yet.</td></tr>}
                                {items.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50/60">
                                        {columns.map((c) => <td key={c.label} className="px-4 py-3">{c.render(r)}</td>)}
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                <button type="button" title="Edit" onClick={() => setEditing({ id: r.id, data: { ...r } })} className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"><Pencil size={15} /></button>
                                                <button
                                                    type="button"
                                                    title="Delete"
                                                    onClick={async () => {
                                                        if (await confirm(`Delete this ${noun}?`)) {
                                                            try {
                                                                await remove(r.id);
                                                                toast("success", "Deleted.");
                                                            } catch (e) {
                                                                toast("error", e instanceof Error ? e.message : "Delete failed");
                                                            }
                                                        }
                                                    }}
                                                    className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-red-600"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <Modal
                open={Boolean(editing)}
                onClose={() => setEditing(null)}
                title={editing?.id ? `Edit ${noun}` : `Add ${noun}`}
                wide
                footer={
                    <>
                        <Btn onClick={() => setEditing(null)}>Cancel</Btn>
                        <Btn variant="primary" onClick={save} loading={busy}>Save</Btn>
                    </>
                }
            >
                {editing && <SchemaForm schema={editing.id && editSchema ? editSchema : schema} value={editing.data} onChange={(data) => setEditing({ ...editing, data })} />}
            </Modal>
        </>
    );
}
