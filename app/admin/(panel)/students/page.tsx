"use client";

import { useMemo, useState } from "react";
import { Ban, Download, Plus, RefreshCcw } from "lucide-react";
import { adminApi } from "../../../components/admin/api";
import { downloadCsv, useAdminList } from "../../../components/admin/useAdminList";
import { Badge, Btn, ErrorBox, inputCls, Loading, Modal, PageHeader, STATUS_TONE, useToast } from "../../../components/admin/ui";
import { useCourses, useStudyMaterials, useTestSeries } from "../../../hooks/useContent";
import type { Order, UserProfile } from "../../../lib/models";
import { cn, formatDate, formatINR } from "../../../lib/utils";

type Student = UserProfile & { id: string };

export default function StudentsPage() {
    const toast = useToast();
    const { items, error, reload, update } = useAdminList<Student>("users");
    const orders = useAdminList<Order>("orders");
    const courses = useCourses();
    const tests = useTestSeries();
    const materials = useStudyMaterials();

    const [q, setQ] = useState("");
    const [exam, setExam] = useState("");
    const [openId, setOpenId] = useState<string | null>(null);
    const [enrolKey, setEnrolKey] = useState("");
    const [amount, setAmount] = useState("");
    const [busy, setBusy] = useState(false);

    const exams = useMemo(() => Array.from(new Set((items ?? []).map((s) => s.exam).filter(Boolean))), [items]);
    const spend = useMemo(() => {
        const m = new Map<string, { orders: number; paid: number }>();
        (orders.items ?? []).forEach((o) => {
            const e = m.get(o.userId) ?? { orders: 0, paid: 0 };
            e.orders += 1;
            if (o.status === "paid") e.paid += o.total;
            m.set(o.userId, e);
        });
        return m;
    }, [orders.items]);

    const filtered = (items ?? []).filter(
        (s) => (!exam || s.exam === exam) && (!q || `${s.name} ${s.email} ${s.mobile} ${s.city ?? ""}`.toLowerCase().includes(q.toLowerCase()))
    );
    const open = (items ?? []).find((s) => s.id === openId) ?? null;
    const theirOrders = (orders.items ?? []).filter((o) => o.userId === openId);

    const products = [
        ...courses.items.map((c) => ({ key: `course:${c.id}`, label: `Course — ${c.title}` })),
        ...tests.items.map((t) => ({ key: `test:${t.id}`, label: `Test Series — ${t.title}` })),
        ...materials.items.map((m) => ({ key: `material:${m.id}`, label: `Material — ${m.title}` })),
    ];

    const enrol = async () => {
        if (!open || !enrolKey) return;
        const [kind, id] = enrolKey.split(":");
        setBusy(true);
        try {
            await adminApi("/api/admin/enroll", { method: "POST", json: { userId: open.id, items: [{ kind, id }], amount: Number(amount) || 0 } });
            toast("success", "Student enrolled.");
            setEnrolKey("");
            setAmount("");
            orders.reload();
        } catch (e) {
            toast("error", e instanceof Error ? e.message : "Failed");
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <PageHeader
                title="Students"
                description="Everyone who has signed up on the website (Firestore users collection)."
                actions={
                    <>
                        <Btn onClick={reload}><RefreshCcw size={15} /> Refresh</Btn>
                        <Btn onClick={() => downloadCsv("students.csv", filtered.map((s) => ({ name: s.name, email: s.email, mobile: s.mobile, exam: s.exam, city: s.city, joined: formatDate(s.createdAt), orders: spend.get(s.id)?.orders ?? 0, paid: spend.get(s.id)?.paid ?? 0, blocked: Boolean(s.blocked) })))}>
                            <Download size={15} /> Export CSV
                        </Btn>
                    </>
                }
            />
            <div className="mb-4 flex flex-wrap gap-3">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, mobile..." className={cn(inputCls, "w-72")} />
                <select value={exam} onChange={(e) => setExam(e.target.value)} className={cn(inputCls, "w-48")}>
                    <option value="">All exams</option>
                    {exams.map((e) => <option key={e}>{e}</option>)}
                </select>
                <span className="self-center text-[13px] font-semibold text-slate-500">{filtered.length} students</span>
            </div>
            {error ? (
                <ErrorBox message={error} onRetry={reload} />
            ) : !items ? (
                <Loading />
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-[14px]">
                            <thead className="bg-slate-50 text-[12px] font-bold uppercase text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Student</th>
                                    <th className="px-4 py-3">Mobile</th>
                                    <th className="px-4 py-3">Exam</th>
                                    <th className="px-4 py-3">Joined</th>
                                    <th className="px-4 py-3">Orders</th>
                                    <th className="px-4 py-3">Paid</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500">No students found.</td></tr>}
                                {filtered.map((s) => (
                                    <tr key={s.id} onClick={() => setOpenId(s.id)} className="cursor-pointer hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-slate-900">{s.name || "—"} {s.blocked && <Badge tone="red">Blocked</Badge>}</p>
                                            <p className="text-[12px] text-slate-400">{s.email}</p>
                                        </td>
                                        <td className="px-4 py-3">{s.mobile || "—"}</td>
                                        <td className="px-4 py-3">{s.exam || "—"}</td>
                                        <td className="px-4 py-3 text-slate-500">{formatDate(s.createdAt)}</td>
                                        <td className="px-4 py-3">{spend.get(s.id)?.orders ?? 0}</td>
                                        <td className="px-4 py-3 font-bold">{formatINR(spend.get(s.id)?.paid ?? 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal open={Boolean(open)} onClose={() => setOpenId(null)} title={open?.name || "Student"} wide>
                {open && (
                    <div className="space-y-6">
                        <div className="grid gap-3 text-[14px] sm:grid-cols-2">
                            <p><span className="text-slate-500">Email:</span> <a className="font-semibold text-brand" href={`mailto:${open.email}`}>{open.email}</a></p>
                            <p><span className="text-slate-500">Mobile:</span> <span className="font-semibold">{open.mobile || "—"}</span></p>
                            <p><span className="text-slate-500">Exam:</span> <span className="font-semibold">{open.exam || "—"}</span></p>
                            <p><span className="text-slate-500">City:</span> <span className="font-semibold">{open.city || "—"}</span></p>
                            <p><span className="text-slate-500">Joined:</span> <span className="font-semibold">{formatDate(open.createdAt, true)}</span></p>
                            <p><span className="text-slate-500">User ID:</span> <code className="text-[12px]">{open.id}</code></p>
                        </div>

                        <div>
                            <h3 className="mb-2 text-[14px] font-black text-slate-900">Orders</h3>
                            {theirOrders.length === 0 ? (
                                <p className="text-[14px] text-slate-500">No orders.</p>
                            ) : (
                                <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                                    {theirOrders.map((o) => (
                                        <li key={o.id} className="flex items-center justify-between gap-3 px-3 py-2 text-[14px]">
                                            <span className="min-w-0">
                                                <a href={`/admin/orders?open=${o.id}`} className="font-bold hover:text-brand">#{o.orderNumber}</a>
                                                <span className="block truncate text-[12px] text-slate-500">{o.items.map((i) => i.title).join(", ")}</span>
                                            </span>
                                            <span className="flex shrink-0 items-center gap-3">
                                                <strong>{formatINR(o.total)}</strong>
                                                <Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="rounded-xl border border-slate-200 p-4">
                            <h3 className="text-[14px] font-black text-slate-900">Enrol manually</h3>
                            <p className="text-[12px] text-slate-500">For cash / bank transfer payments. Creates a paid order and unlocks access.</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <select value={enrolKey} onChange={(e) => setEnrolKey(e.target.value)} className={cn(inputCls, "min-w-[260px] flex-1")}>
                                    <option value="">Choose a course / test / material</option>
                                    {products.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                                </select>
                                <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))} placeholder="Amount received ₹" className={cn(inputCls, "w-44")} />
                                <Btn variant="primary" onClick={enrol} loading={busy} disabled={!enrolKey}><Plus size={15} /> Enrol</Btn>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Btn
                                variant={open.blocked ? "secondary" : "danger"}
                                onClick={async () => {
                                    try {
                                        await update(open.id, { blocked: !open.blocked });
                                        toast("success", open.blocked ? "Student unblocked." : "Student blocked — they can no longer sign in.");
                                    } catch (e) {
                                        toast("error", e instanceof Error ? e.message : "Failed");
                                    }
                                }}
                            >
                                <Ban size={15} /> {open.blocked ? "Unblock student" : "Block student"}
                            </Btn>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
