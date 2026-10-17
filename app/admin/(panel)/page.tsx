"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, GraduationCap, HelpCircle, IndianRupee, Settings, ShoppingCart, Star } from "lucide-react";
import { adminApi } from "../../components/admin/api";
import { Badge, BarChart, ErrorBox, Loading, PageHeader, Panel, StatCard, STATUS_TONE } from "../../components/admin/ui";
import { formatDate, formatINR } from "../../lib/utils";

type Stats = {
    totals: Record<string, number>;
    months: string[];
    revenueByMonth: Record<string, number>;
    recentOrders: { id: string; orderNumber: string; userName: string; userEmail: string; total: number; status: string; createdAt: number; items: string[] }[];
};

type Health = {
    serviceAccount: boolean;
    firestore: { ok: boolean; error: string };
    storage: { ok: boolean; error: string; bucket: string };
    content: Record<string, boolean>;
    role: string;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [health, setHealth] = useState<Health | null>(null);
    const [error, setError] = useState("");
    const [forbidden, setForbidden] = useState(false);

    useEffect(() => {
        adminApi<Health>("/api/admin/health").then(setHealth).catch(() => undefined);
        adminApi<Stats>("/api/admin/stats")
            .then(setStats)
            .catch((e: Error) => (e.message.includes("role") ? setForbidden(true) : setError(e.message)));
    }, []);

    const missing = health?.firestore.ok ? Object.entries(health.content).filter(([, v]) => !v).map(([k]) => k) : [];

    return (
        <>
            <PageHeader title="Dashboard" description="An overview of sales, students and website setup." />

            {health && (!health.firestore.ok || !health.storage.ok || missing.length > 0) && (
                <Panel title="Setup checklist" className="mb-6">
                    <ul className="space-y-2.5 text-[14px]">
                        <Check ok={health.serviceAccount && health.firestore.ok} label="Firebase Admin connected (service account)" detail={health.firestore.error} />
                        <Check
                            ok={health.storage.ok}
                            label={`Firebase Storage for images${health.storage.bucket ? ` (${health.storage.bucket})` : ""}`}
                            detail={health.storage.ok ? "" : "Optional — without it, images and PDFs (up to 10 MB) are stored in Firestore (site_media) automatically."}
                            optional
                        />
                        {health.firestore.ok && <Check ok={missing.length === 0} label="All website pages saved in Firestore" detail={missing.length ? `Using built-in defaults for: ${missing.join(", ")}. Open Website Settings → Theme → Import missing pages.` : ""} optional />}
                    </ul>
                </Panel>
            )}

            {forbidden ? (
                <Panel title="Welcome">
                    <p className="text-[14px] text-slate-600">Your editor account can manage content. Start with:</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {[["/admin/settings", "Website Settings"], ["/admin/courses", "Courses"], ["/admin/banners", "Banners & Media"]].map(([href, label]) => (
                            <Link key={href} href={href} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] font-bold text-slate-700 hover:border-brand hover:text-brand">
                                {label}
                            </Link>
                        ))}
                    </div>
                </Panel>
            ) : error ? (
                <ErrorBox message={error} onRetry={() => window.location.reload()} />
            ) : !stats ? (
                <Loading />
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard label="Revenue (all time)" value={formatINR(stats.totals.revenue)} hint={`${formatINR(stats.totals.revenueThisMonth)} this month`} icon={<IndianRupee size={20} />} />
                        <StatCard label="Orders" value={String(stats.totals.orders)} hint={`${stats.totals.paidOrders} paid`} icon={<ShoppingCart size={20} />} tone="blue" />
                        <StatCard label="Awaiting confirmation" value={String(stats.totals.pendingOrders)} hint={`${stats.totals.awaitingVerification} with payment reference`} icon={<Clock size={20} />} tone="amber" />
                        <StatCard label="Students" value={String(stats.totals.students)} hint={`+${stats.totals.studentsThisMonth} this month`} icon={<GraduationCap size={20} />} tone="green" />
                    </div>

                    <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                        <Panel title="Revenue — last 12 months" actions={<Link href="/admin/analytics" className="text-[13px] font-bold text-brand">Analytics →</Link>}>
                            <BarChart labels={stats.months.map((m) => m.slice(5))} values={stats.months.map((m) => stats.revenueByMonth[m] ?? 0)} format={(n) => formatINR(n)} />
                        </Panel>
                        <Panel title="Needs attention">
                            <ul className="space-y-3">
                                <Todo href="/admin/orders?status=pending" icon={<Clock size={18} />} label="Orders to confirm" count={stats.totals.pendingOrders} />
                                <Todo href="/admin/reviews" icon={<Star size={18} />} label="Reviews to moderate" count={stats.totals.pendingReviews} />
                                <Todo href="/admin/support" icon={<HelpCircle size={18} />} label="Open support queries" count={stats.totals.openQueries} />
                                <Todo href="/admin/settings" icon={<Settings size={18} />} label="Update website content" />
                            </ul>
                        </Panel>
                    </div>

                    <Panel title="Recent orders" className="mt-6" actions={<Link href="/admin/orders" className="text-[13px] font-bold text-brand">All orders →</Link>}>
                        {stats.recentOrders.length === 0 ? (
                            <p className="py-6 text-center text-[14px] text-slate-500">No orders yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px] text-left text-[14px]">
                                    <thead className="text-[12px] font-bold uppercase text-slate-500">
                                        <tr>
                                            <th className="pb-2">Order</th>
                                            <th className="pb-2">Student</th>
                                            <th className="pb-2">Items</th>
                                            <th className="pb-2">Total</th>
                                            <th className="pb-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {stats.recentOrders.map((o) => (
                                            <tr key={o.id}>
                                                <td className="py-2.5">
                                                    <Link href={`/admin/orders?open=${o.id}`} className="font-bold text-slate-900 hover:text-brand">#{o.orderNumber}</Link>
                                                    <p className="text-[12px] text-slate-400">{formatDate(o.createdAt, true)}</p>
                                                </td>
                                                <td className="py-2.5">
                                                    <p className="font-semibold">{o.userName}</p>
                                                    <p className="text-[12px] text-slate-400">{o.userEmail}</p>
                                                </td>
                                                <td className="max-w-[260px] truncate py-2.5 text-slate-600">{o.items.join(", ")}</td>
                                                <td className="py-2.5 font-bold">{formatINR(o.total)}</td>
                                                <td className="py-2.5"><Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Panel>
                </>
            )}
        </>
    );
}

function Check({ ok, label, detail, optional }: { ok: boolean; label: string; detail?: string; optional?: boolean }) {
    return (
        <li className="flex items-start gap-3">
            {ok ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" /> : <AlertTriangle size={18} className={`mt-0.5 shrink-0 ${optional ? "text-amber-500" : "text-red-600"}`} />}
            <span>
                <span className="font-bold text-slate-800">{label}</span>
                {detail && <span className="block text-[13px] text-slate-500">{detail}</span>}
            </span>
        </li>
    );
}

function Todo({ href, icon, label, count }: { href: string; icon: React.ReactNode; label: string; count?: number }) {
    return (
        <li>
            <Link href={href} className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 transition hover:border-brand-200 hover:bg-brand-50/40">
                <span className="text-brand">{icon}</span>
                <span className="flex-1 text-[14px] font-bold text-slate-800">{label}</span>
                {count !== undefined && <Badge tone={count ? "amber" : "slate"}>{count}</Badge>}
                <ArrowRight size={15} className="text-slate-400" />
            </Link>
        </li>
    );
}
