"use client";

import { useEffect, useState } from "react";
import { GraduationCap, IndianRupee, Percent, ShoppingCart } from "lucide-react";
import { adminApi } from "../../../components/admin/api";
import { Badge, BarChart, ErrorBox, Loading, PageHeader, Panel, StatCard, STATUS_TONE } from "../../../components/admin/ui";
import { formatINR } from "../../../lib/utils";

type Stats = {
    totals: Record<string, number>;
    months: string[];
    revenueByMonth: Record<string, number>;
    ordersByMonth: Record<string, number>;
    signupsByMonth: Record<string, number>;
    statusCounts: Record<string, number>;
    topProducts: { title: string; kind: string; sales: number; revenue: number }[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const label = (m: string) => MONTHS[Number(m.slice(5)) - 1] ?? m;

export default function AnalyticsPage() {
    const [s, setS] = useState<Stats | null>(null);
    const [error, setError] = useState("");
    useEffect(() => {
        adminApi<Stats>("/api/admin/stats").then(setS).catch((e: Error) => setError(e.message));
    }, []);

    if (error) return <ErrorBox message={error} />;
    if (!s) return <Loading />;

    const conversion = s.totals.orders ? Math.round((s.totals.paidOrders / s.totals.orders) * 100) : 0;
    const aov = s.totals.paidOrders ? s.totals.revenue / s.totals.paidOrders : 0;
    const growth = s.totals.revenueLastMonth ? Math.round(((s.totals.revenueThisMonth - s.totals.revenueLastMonth) / s.totals.revenueLastMonth) * 100) : 0;

    return (
        <>
            <PageHeader title="Analytics" description="Calculated live from your orders and student accounts." />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Revenue this month" value={formatINR(s.totals.revenueThisMonth)} hint={s.totals.revenueLastMonth ? `${growth >= 0 ? "+" : ""}${growth}% vs last month` : "No sales last month"} icon={<IndianRupee size={20} />} />
                <StatCard label="Average order value" value={formatINR(aov)} icon={<ShoppingCart size={20} />} tone="blue" />
                <StatCard label="Payment completion" value={`${conversion}%`} hint="Paid orders ÷ all orders" icon={<Percent size={20} />} tone="violet" />
                <StatCard label="New students this month" value={String(s.totals.studentsThisMonth)} icon={<GraduationCap size={20} />} tone="green" />
            </div>
            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <Panel title="Revenue by month">
                    <BarChart labels={s.months.map(label)} values={s.months.map((m) => s.revenueByMonth[m])} format={formatINR} />
                </Panel>
                <Panel title="Orders by month">
                    <BarChart labels={s.months.map(label)} values={s.months.map((m) => s.ordersByMonth[m])} />
                </Panel>
                <Panel title="Student sign-ups by month">
                    <BarChart labels={s.months.map(label)} values={s.months.map((m) => s.signupsByMonth[m])} />
                </Panel>
                <Panel title="Orders by status">
                    <ul className="space-y-3">
                        {Object.entries(s.statusCounts).map(([status, n]) => (
                            <li key={status} className="flex items-center gap-3">
                                <span className="w-24"><Badge tone={STATUS_TONE[status]}>{status}</Badge></span>
                                <span className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                                    <span className="block h-full rounded-full bg-brand" style={{ width: `${(n / Math.max(1, s.totals.orders)) * 100}%` }} />
                                </span>
                                <span className="w-10 text-right text-[14px] font-bold">{n}</span>
                            </li>
                        ))}
                        {Object.keys(s.statusCounts).length === 0 && <p className="text-[14px] text-slate-500">No orders yet.</p>}
                    </ul>
                </Panel>
            </div>
            <Panel title="Top selling products" className="mt-6">
                {s.topProducts.length === 0 ? (
                    <p className="py-6 text-center text-[14px] text-slate-500">No paid orders yet.</p>
                ) : (
                    <table className="w-full text-left text-[14px]">
                        <thead className="text-[12px] font-bold uppercase text-slate-500">
                            <tr>
                                <th className="pb-2">Product</th>
                                <th className="pb-2">Type</th>
                                <th className="pb-2 text-right">Sales</th>
                                <th className="pb-2 text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {s.topProducts.map((p) => (
                                <tr key={p.title}>
                                    <td className="py-2.5 font-semibold">{p.title}</td>
                                    <td className="py-2.5 capitalize text-slate-500">{p.kind}</td>
                                    <td className="py-2.5 text-right">{p.sales}</td>
                                    <td className="py-2.5 text-right font-bold">{formatINR(p.revenue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Panel>
        </>
    );
}
