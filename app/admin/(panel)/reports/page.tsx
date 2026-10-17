"use client";

import { useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { adminApi } from "../../../components/admin/api";
import { downloadCsv } from "../../../components/admin/useAdminList";
import { Btn, PageHeader, Panel, useToast } from "../../../components/admin/ui";
import { formatDate } from "../../../lib/utils";

type Row = Record<string, unknown>;

const REPORTS: { id: string; title: string; description: string; collection: string; map: (r: Row) => Row }[] = [
    {
        id: "orders",
        title: "Orders & payments",
        description: "Every order with student, items, coupon, amount and status.",
        collection: "orders",
        map: (o) => ({
            order: o.orderNumber,
            date: formatDate(o.createdAt, true),
            student: o.userName,
            email: o.userEmail,
            mobile: o.userMobile,
            items: ((o.items as { title: string }[]) ?? []).map((i) => i.title).join(" | "),
            subtotal: o.subtotal,
            discount: o.discount,
            coupon: o.couponCode,
            total: o.total,
            status: o.status,
            payment_reference: o.paymentReference,
        }),
    },
    {
        id: "students",
        title: "Students",
        description: "All registered students with contact details and target exam.",
        collection: "users",
        map: (u) => ({ name: u.name, email: u.email, mobile: u.mobile, exam: u.exam, city: u.city, joined: formatDate(u.createdAt), blocked: Boolean(u.blocked) }),
    },
    {
        id: "support",
        title: "Support queries",
        description: "Messages received from the Contact page.",
        collection: "support_queries",
        map: (q) => ({ date: formatDate(q.createdAt, true), name: q.name, email: q.email, mobile: q.mobile, subject: q.subject, message: q.message, status: q.status }),
    },
    {
        id: "reviews",
        title: "Reviews",
        description: "All student reviews and their moderation status.",
        collection: "reviews",
        map: (r) => ({ date: formatDate(r.createdAt, true), student: r.userName, item: r.itemTitle, type: r.kind, rating: r.rating, comment: r.comment, status: r.status }),
    },
    {
        id: "coupons",
        title: "Coupons",
        description: "Coupon codes with usage counts.",
        collection: "coupons",
        map: (c) => ({ code: c.code, type: c.type, value: c.value, used: c.used, limit: c.usageLimit, valid_from: c.validFrom, valid_to: c.validTo, active: c.active }),
    },
];

export default function ReportsPage() {
    const toast = useToast();
    const [busy, setBusy] = useState("");
    const run = async (r: (typeof REPORTS)[number]) => {
        setBusy(r.id);
        try {
            const { items } = await adminApi<{ items: Row[] }>(`/api/admin/data/${r.collection}`);
            if (!items.length) toast("error", "Nothing to export yet.");
            else {
                downloadCsv(`${r.id}-${new Date().toISOString().slice(0, 10)}.csv`, items.map(r.map));
                toast("success", `${items.length} rows exported.`);
            }
        } catch (e) {
            toast("error", e instanceof Error ? e.message : "Export failed");
        } finally {
            setBusy("");
        }
    };
    return (
        <>
            <PageHeader title="Reports" description="Download CSV files that open in Excel or Google Sheets." />
            <div className="grid gap-4 md:grid-cols-2">
                {REPORTS.map((r) => (
                    <Panel key={r.id}>
                        <div className="flex items-start gap-4">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><FileSpreadsheet size={20} /></span>
                            <div className="flex-1">
                                <h3 className="text-[16px] font-black text-slate-900">{r.title}</h3>
                                <p className="mt-1 text-[13px] text-slate-500">{r.description}</p>
                                <Btn className="mt-4" onClick={() => run(r)} loading={busy === r.id}><Download size={15} /> Download CSV</Btn>
                            </div>
                        </div>
                    </Panel>
                ))}
            </div>
        </>
    );
}
