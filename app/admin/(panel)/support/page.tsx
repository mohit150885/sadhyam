"use client";

import { useState } from "react";
import { Mail, RefreshCcw, Trash2 } from "lucide-react";
import { useAdminList } from "../../../components/admin/useAdminList";
import { Badge, Btn, ErrorBox, inputCls, Loading, Modal, PageHeader, STATUS_TONE, useConfirm, useToast } from "../../../components/admin/ui";
import type { SupportQuery } from "../../../lib/models";
import { cn, formatDate } from "../../../lib/utils";

export default function SupportPage() {
    const toast = useToast();
    const { confirm, dialog } = useConfirm();
    const { items, error, reload, update, remove } = useAdminList<SupportQuery>("support_queries");
    const [tab, setTab] = useState<string>("open");
    const [openId, setOpenId] = useState<string | null>(null);
    const [reply, setReply] = useState("");
    const shown = (items ?? []).filter((q) => tab === "all" || q.status === tab);
    const open = (items ?? []).find((q) => q.id === openId) ?? null;

    const setStatus = async (status: SupportQuery["status"]) => {
        if (!open) return;
        try {
            await update(open.id, { status, reply });
            toast("success", "Updated.");
        } catch (e) {
            toast("error", e instanceof Error ? e.message : "Failed");
        }
    };

    return (
        <>
            {dialog}
            <PageHeader title="Support & Queries" description="Messages sent from the Contact page." actions={<Btn onClick={reload}><RefreshCcw size={15} /> Refresh</Btn>} />
            <div className="mb-4 flex gap-2">
                {["open", "in-progress", "resolved", "all"].map((t) => (
                    <button key={t} type="button" onClick={() => setTab(t)} className={cn("rounded-lg px-3 py-1.5 text-[13px] font-bold capitalize", tab === t ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200")}>
                        {t} ({(items ?? []).filter((q) => t === "all" || q.status === t).length})
                    </button>
                ))}
            </div>
            {error ? (
                <ErrorBox message={error} onRetry={reload} />
            ) : !items ? (
                <Loading />
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-left text-[14px]">
                        <thead className="bg-slate-50 text-[12px] font-bold uppercase text-slate-500">
                            <tr><th className="px-4 py-3">From</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Received</th><th className="px-4 py-3">Status</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {shown.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-slate-500">No messages.</td></tr>}
                            {shown.map((q) => (
                                <tr key={q.id} onClick={() => { setOpenId(q.id); setReply(q.reply ?? ""); }} className="cursor-pointer hover:bg-slate-50">
                                    <td className="px-4 py-3"><p className="font-bold">{q.name}</p><p className="text-[12px] text-slate-400">{q.email}</p></td>
                                    <td className="px-4 py-3"><p className="font-semibold">{q.subject}</p><p className="line-clamp-1 max-w-[380px] text-[13px] text-slate-500">{q.message}</p></td>
                                    <td className="px-4 py-3 text-[13px] text-slate-500">{formatDate(q.createdAt, true)}</td>
                                    <td className="px-4 py-3"><Badge tone={STATUS_TONE[q.status]}>{q.status}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Modal
                open={Boolean(open)}
                onClose={() => setOpenId(null)}
                title={open?.subject ?? ""}
                wide
                footer={open && (
                    <div className="flex w-full flex-wrap justify-between gap-2">
                        <Btn variant="ghost" onClick={async () => { if (await confirm("Delete this message?")) { await remove(open.id); setOpenId(null); } }}><Trash2 size={15} /> Delete</Btn>
                        <div className="flex gap-2">
                            <Btn onClick={() => setStatus("in-progress")}>Mark in progress</Btn>
                            <Btn variant="success" onClick={() => setStatus("resolved")}>Mark resolved</Btn>
                        </div>
                    </div>
                )}
            >
                {open && (
                    <div className="space-y-4 text-[14px]">
                        <div className="grid gap-2 sm:grid-cols-3">
                            <p><span className="text-slate-500">Name:</span> <strong>{open.name}</strong></p>
                            <p><span className="text-slate-500">Email:</span> <a className="font-semibold text-brand" href={`mailto:${open.email}`}>{open.email}</a></p>
                            <p><span className="text-slate-500">Mobile:</span> <strong>{open.mobile || "—"}</strong></p>
                        </div>
                        <p className="whitespace-pre-line rounded-lg bg-slate-50 p-4 text-slate-800">{open.message}</p>
                        <label className="block">
                            <span className="mb-1.5 block text-[13px] font-bold text-slate-700">Reply / internal note</span>
                            <textarea className={cn(inputCls, "h-auto py-2")} rows={4} value={reply} onChange={(e) => setReply(e.target.value)} />
                        </label>
                        <a href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.subject}`)}&body=${encodeURIComponent(reply)}`} className="inline-flex items-center gap-1.5 font-bold text-brand hover:underline">
                            <Mail size={15} /> Reply by email
                        </a>
                    </div>
                )}
            </Modal>
        </>
    );
}
