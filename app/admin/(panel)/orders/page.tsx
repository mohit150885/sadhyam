"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, RefreshCcw } from "lucide-react";
import { downloadCsv, useAdminList } from "../../../components/admin/useAdminList";
import { Badge, Btn, ErrorBox, inputCls, Loading, Modal, PageHeader, STATUS_TONE, useConfirm, useToast } from "../../../components/admin/ui";
import type { Order } from "../../../lib/models";
import { cn, formatDate, formatINR } from "../../../lib/utils";

const STATUSES = ["all", "pending", "paid", "failed", "cancelled", "refunded"] as const;

function OrdersInner() {
    const params = useSearchParams();
    const toast = useToast();
    const { confirm, dialog } = useConfirm();
    const { items, error, reload, update, remove } = useAdminList<Order & { paymentSubmittedAt?: number }>("orders");
    const [status, setStatus] = useState<string>(params.get("status") || "all");
    const [q, setQ] = useState("");
    const [openId, setOpenId] = useState<string | null>(params.get("open"));
    const [note, setNote] = useState("");
    const [busy, setBusy] = useState(false);

    const filtered = useMemo(
        () =>
            (items ?? []).filter(
                (o) =>
                    (status === "all" || o.status === status) &&
                    (!q || `${o.orderNumber} ${o.userName} ${o.userEmail} ${o.userMobile ?? ""} ${o.paymentReference ?? ""}`.toLowerCase().includes(q.toLowerCase()))
            ),
        [items, status, q]
    );
    const open = (items ?? []).find((o) => o.id === openId) ?? null;
    const [noteFor, setNoteFor] = useState<string | null>(null);
    if (open && noteFor !== open.id) {
        setNoteFor(open.id);
        setNote(open.note ?? "");
    }

    const setOrderStatus = async (s: Order["status"]) => {
        if (!open) return;
        if (s !== "paid" && !(await confirm(`Mark order #${open.orderNumber} as ${s}?`))) return;
        setBusy(true);
        try {
            await update(open.id, { status: s, note });
            toast("success", s === "paid" ? "Payment confirmed — the student now has access." : `Order marked ${s}.`);
        } catch (e) {
            toast("error", e instanceof Error ? e.message : "Update failed");
        } finally {
            setBusy(false);
        }
    };

    const counts = useMemo(() => {
        const c: Record<string, number> = { all: items?.length ?? 0 };
        (items ?? []).forEach((o) => (c[o.status] = (c[o.status] ?? 0) + 1));
        return c;
    }, [items]);

    return (
        <>
            {dialog}
            <PageHeader
                title="Orders & Payments"
                description="Confirm UPI payments to unlock courses for students."
                actions={
                    <>
                        <Btn onClick={reload}><RefreshCcw size={15} /> Refresh</Btn>
                        <Btn
                            onClick={() =>
                                downloadCsv(
                                    `orders-${new Date().toISOString().slice(0, 10)}.csv`,
                                    filtered.map((o) => ({ order: o.orderNumber, date: formatDate(o.createdAt, true), name: o.userName, email: o.userEmail, mobile: o.userMobile, items: o.items.map((i) => i.title).join(" | "), subtotal: o.subtotal, discount: o.discount, coupon: o.couponCode, total: o.total, status: o.status, reference: o.paymentReference }))
                                )
                            }
                        >
                            <Download size={15} /> Export CSV
                        </Btn>
                    </>
                }
            />
            <div className="mb-4 flex flex-wrap items-center gap-2">
                {STATUSES.map((s) => (
                    <button key={s} type="button" onClick={() => setStatus(s)} className={cn("rounded-lg px-3 py-1.5 text-[13px] font-bold capitalize", status === s ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50")}>
                        {s} <span className="opacity-60">({counts[s] ?? 0})</span>
                    </button>
                ))}
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order, name, email, UPI ref..." className={cn(inputCls, "ml-auto w-72")} />
            </div>

            {error ? (
                <ErrorBox message={error} onRetry={reload} />
            ) : !items ? (
                <Loading />
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[860px] text-left text-[14px]">
                            <thead className="bg-slate-50 text-[12px] font-bold uppercase text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Order</th>
                                    <th className="px-4 py-3">Student</th>
                                    <th className="px-4 py-3">Items</th>
                                    <th className="px-4 py-3">Total</th>
                                    <th className="px-4 py-3">Payment ref</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.length === 0 && (
                                    <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500">No orders.</td></tr>
                                )}
                                {filtered.map((o) => (
                                    <tr key={o.id} onClick={() => setOpenId(o.id)} className="cursor-pointer hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-slate-900">#{o.orderNumber}</p>
                                            <p className="text-[12px] text-slate-400">{formatDate(o.createdAt, true)}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold">{o.userName}</p>
                                            <p className="text-[12px] text-slate-400">{o.userEmail}{o.userMobile ? ` • ${o.userMobile}` : ""}</p>
                                        </td>
                                        <td className="max-w-[240px] truncate px-4 py-3 text-slate-600">{o.items.map((i) => i.title).join(", ")}</td>
                                        <td className="px-4 py-3 font-bold">{formatINR(o.total)}</td>
                                        <td className="px-4 py-3 font-mono text-[13px]">{o.paymentReference || <span className="text-slate-300">—</span>}</td>
                                        <td className="px-4 py-3"><Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal
                open={Boolean(open)}
                onClose={() => setOpenId(null)}
                title={open ? `Order #${open.orderNumber}` : ""}
                wide
                footer={
                    open && (
                        <div className="flex w-full flex-wrap justify-between gap-2">
                            <Btn
                                variant="ghost"
                                onClick={async () => {
                                    if (await confirm("Permanently delete this order? Prefer “Cancel” to keep a record.")) {
                                        try {
                                            await remove(open.id);
                                            setOpenId(null);
                                            toast("success", "Order deleted.");
                                        } catch (e) {
                                            toast("error", e instanceof Error ? e.message : "Delete failed");
                                        }
                                    }
                                }}
                            >
                                Delete
                            </Btn>
                            <div className="flex flex-wrap gap-2">
                                {open.status !== "cancelled" && <Btn onClick={() => setOrderStatus("cancelled")} loading={busy}>Cancel order</Btn>}
                                {open.status === "paid" && <Btn onClick={() => setOrderStatus("refunded")} loading={busy}>Mark refunded</Btn>}
                                {open.status === "pending" && <Btn variant="danger" onClick={() => setOrderStatus("failed")} loading={busy}>Payment failed</Btn>}
                                {open.status !== "paid" && <Btn variant="success" onClick={() => setOrderStatus("paid")} loading={busy}>Confirm payment</Btn>}
                            </div>
                        </div>
                    )
                }
            >
                {open && (
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2 text-[14px]">
                            <Row k="Status" v={<Badge tone={STATUS_TONE[open.status]}>{open.status}</Badge>} />
                            <Row k="Placed" v={formatDate(open.createdAt, true)} />
                            <Row k="Student" v={open.userName} />
                            <Row k="Email" v={<a href={`mailto:${open.userEmail}`} className="text-brand">{open.userEmail}</a>} />
                            <Row k="Mobile" v={open.userMobile ? <a href={`tel:${open.userMobile}`} className="text-brand">{open.userMobile}</a> : "—"} />
                            <Row k="Payment method" v={open.paymentMethod || "upi"} />
                            <Row k="UPI reference" v={<span className="font-mono">{open.paymentReference || "Not submitted yet"}</span>} />
                            {open.paymentSubmittedAt && <Row k="Reference submitted" v={formatDate(open.paymentSubmittedAt, true)} />}
                        </div>
                        <div>
                            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                                {open.items.map((i) => (
                                    <li key={`${i.kind}-${i.id}`} className="flex justify-between gap-3 px-3 py-2 text-[14px]">
                                        <span>
                                            <span className="font-semibold">{i.title}</span>
                                            <span className="block text-[12px] capitalize text-slate-400">{i.kind}</span>
                                        </span>
                                        <span className="font-bold">{formatINR(i.price)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-3 space-y-1 text-[14px]">
                                <Row k="Subtotal" v={formatINR(open.subtotal)} />
                                {open.discount > 0 && <Row k={`Coupon ${open.couponCode ?? ""}`} v={`− ${formatINR(open.discount)}`} />}
                                <Row k="Total" v={<strong className="text-[18px]">{formatINR(open.total)}</strong>} />
                            </div>
                        </div>
                        <label className="md:col-span-2">
                            <span className="mb-1.5 block text-[13px] font-bold text-slate-700">Note (visible to the student when the order is closed)</span>
                            <textarea className={cn(inputCls, "h-auto py-2")} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
                        </label>
                    </div>
                )}
            </Modal>
        </>
    );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
    return (
        <div className="flex justify-between gap-4">
            <span className="text-slate-500">{k}</span>
            <span className="text-right font-semibold text-slate-800">{v}</span>
        </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={<Loading />}>
            <OrdersInner />
        </Suspense>
    );
}
