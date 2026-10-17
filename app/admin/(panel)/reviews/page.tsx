"use client";

import { useState } from "react";
import { Check, RefreshCcw, Star, Trash2, X } from "lucide-react";
import { useAdminList } from "../../../components/admin/useAdminList";
import { Badge, Btn, ErrorBox, Loading, PageHeader, STATUS_TONE, useConfirm, useToast } from "../../../components/admin/ui";
import type { Review } from "../../../lib/models";
import { cn, formatDate } from "../../../lib/utils";

export default function ReviewsPage() {
    const toast = useToast();
    const { confirm, dialog } = useConfirm();
    const { items, error, reload, update, remove } = useAdminList<Review>("reviews");
    const [tab, setTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
    const shown = (items ?? []).filter((r) => tab === "all" || r.status === tab);

    const act = async (r: Review, status: Review["status"]) => {
        try {
            await update(r.id, { status });
            toast("success", status === "approved" ? "Review published on the website." : "Review rejected.");
        } catch (e) {
            toast("error", e instanceof Error ? e.message : "Failed");
        }
    };

    const href = (r: Review) => (r.kind === "course" ? `/courses/${r.itemId}` : r.kind === "test" ? `/test-series/${r.itemId}` : r.kind === "material" ? `/study-material/${r.itemId}` : `/faculty/${r.itemId}`);

    return (
        <>
            {dialog}
            <PageHeader title="Reviews" description="Students submit reviews on course, test, material and faculty pages. Approved reviews appear on the website." actions={<Btn onClick={reload}><RefreshCcw size={15} /> Refresh</Btn>} />
            <div className="mb-4 flex gap-2">
                {(["pending", "approved", "rejected", "all"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setTab(t)} className={cn("rounded-lg px-3 py-1.5 text-[13px] font-bold capitalize", tab === t ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200")}>
                        {t} ({(items ?? []).filter((r) => t === "all" || r.status === t).length})
                    </button>
                ))}
            </div>
            {error ? (
                <ErrorBox message={error} onRetry={reload} />
            ) : !items ? (
                <Loading />
            ) : shown.length === 0 ? (
                <p className="rounded-xl border border-slate-200 bg-white py-12 text-center text-[14px] text-slate-500">No reviews here.</p>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {shown.map((r) => (
                        <article key={r.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-bold text-slate-900">{r.userName}</p>
                                    <a href={href(r)} target="_blank" rel="noreferrer" className="text-[13px] font-semibold text-brand hover:underline">{r.itemTitle || r.itemId}</a>
                                    <p className="text-[12px] text-slate-400">{formatDate(r.createdAt, true)}</p>
                                </div>
                                <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                            </div>
                            <div className="mt-3 flex gap-0.5">
                                {Array.from({ length: 5 }, (_, i) => <Star key={i} size={15} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />)}
                            </div>
                            <p className="mt-2 whitespace-pre-line text-[14px] text-slate-700">{r.comment}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {r.status !== "approved" && <Btn size="sm" variant="success" onClick={() => act(r, "approved")}><Check size={14} /> Approve</Btn>}
                                {r.status !== "rejected" && <Btn size="sm" onClick={() => act(r, "rejected")}><X size={14} /> Reject</Btn>}
                                <Btn size="sm" variant="ghost" onClick={async () => { if (await confirm("Delete this review permanently?")) { await remove(r.id); toast("success", "Deleted."); } }}><Trash2 size={14} /> Delete</Btn>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </>
    );
}
