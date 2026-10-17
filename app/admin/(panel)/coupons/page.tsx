"use client";

import RecordManager from "../../../components/admin/RecordManager";
import { Badge } from "../../../components/admin/ui";
import { formatINR } from "../../../lib/utils";

export default function CouponsPage() {
    return (
        <RecordManager
            title="Coupons & Offers"
            description="Students enter these codes in the cart. Discounts are checked and applied on the server."
            collection="coupons"
            noun="coupon"
            blank={{ code: "", description: "", type: "percent", value: 10, minAmount: 0, maxDiscount: 0, usageLimit: 0, validFrom: "", validTo: "", active: true, appliesTo: "all" }}
            validate={(r) => (!String(r.code || "").trim() ? "Enter a coupon code." : Number(r.value) <= 0 ? "Discount value must be more than 0." : r.type === "percent" && Number(r.value) > 100 ? "Percentage can't exceed 100." : null)}
            schema={[
                { key: "code", label: "Code", type: "text", placeholder: "WELCOME10" },
                { key: "description", label: "Description (internal)", type: "text" },
                { key: "type", label: "Discount type", type: "select", options: ["percent", "flat"] },
                { key: "value", label: "Value (% or ₹)", type: "number" },
                { key: "minAmount", label: "Minimum cart value ₹ (0 = none)", type: "number" },
                { key: "maxDiscount", label: "Maximum discount ₹ (0 = no cap)", type: "number" },
                { key: "usageLimit", label: "Usage limit (0 = unlimited)", type: "number" },
                { key: "appliesTo", label: "Applies to", type: "select", options: ["all", "course", "test", "material"] },
                { key: "validFrom", label: "Valid from", type: "date" },
                { key: "validTo", label: "Valid until", type: "date" },
                { key: "active", label: "Active", type: "toggle" },
            ]}
            columns={[
                { label: "Code", render: (r) => <span className="font-mono font-black">{String(r.code)}</span> },
                { label: "Discount", render: (r) => (r.type === "flat" ? formatINR(Number(r.value)) : `${r.value}%`) + (Number(r.maxDiscount) ? ` (max ${formatINR(Number(r.maxDiscount))})` : "") },
                { label: "Applies to", render: (r) => <span className="capitalize">{String(r.appliesTo || "all")}</span> },
                { label: "Used", render: (r) => `${Number(r.used ?? 0)}${Number(r.usageLimit) ? ` / ${r.usageLimit}` : ""}` },
                { label: "Validity", render: (r) => <span className="text-[13px] text-slate-500">{String(r.validFrom || "—")} → {String(r.validTo || "no end")}</span> },
                { label: "Status", render: (r) => (r.active ? <Badge tone="green">Active</Badge> : <Badge>Off</Badge>) },
            ]}
        />
    );
}
