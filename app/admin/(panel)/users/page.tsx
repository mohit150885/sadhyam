"use client";

import RecordManager from "../../../components/admin/RecordManager";
import { Badge } from "../../../components/admin/ui";
import { formatDate } from "../../../lib/utils";

export default function AdminUsersPage() {
    return (
        <>
            <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-[14px] text-blue-900">
                The <strong>owner</strong> account comes from <code>ADMIN_LOGIN_ID</code> / <code>ADMIN_LOGIN_PASSWORD</code> in your environment and always has full access.
                Add team members below: <strong>Admin</strong> can manage everything except admin users; <strong>Editor</strong> can edit website content, catalog, reviews and notifications only.
            </div>
            <RecordManager
                title="Users & Admins"
                description="People who can sign in to this admin panel."
                collection="admins"
                noun="admin"
                blank={{ name: "", email: "", role: "editor", active: true, password: "" }}
                validate={(r) => (!/^\S+@\S+\.\S+$/.test(String(r.email || "")) ? "Enter a valid email." : null)}
                schema={[
                    { key: "name", label: "Name", type: "text" },
                    { key: "email", label: "Email (used to sign in)", type: "text" },
                    { key: "role", label: "Role", type: "select", options: ["admin", "editor"] },
                    { key: "password", label: "Password (min 10 characters)", type: "text" },
                    { key: "active", label: "Can sign in", type: "toggle" },
                ]}
                editSchema={[
                    { key: "name", label: "Name", type: "text" },
                    { key: "email", label: "Email", type: "text" },
                    { key: "role", label: "Role", type: "select", options: ["admin", "editor"] },
                    { key: "password", label: "New password (leave empty to keep)", type: "text" },
                    { key: "active", label: "Can sign in", type: "toggle" },
                ]}
                columns={[
                    { label: "Name", render: (r) => <span className="font-bold">{String(r.name || "—")}</span> },
                    { label: "Email", render: (r) => String(r.email) },
                    { label: "Role", render: (r) => <Badge tone={r.role === "admin" ? "violet" : "blue"}>{String(r.role)}</Badge> },
                    { label: "Last sign-in", render: (r) => <span className="text-[13px] text-slate-500">{formatDate(r.lastLoginAt, true)}</span> },
                    { label: "Status", render: (r) => (r.active !== false ? <Badge tone="green">Active</Badge> : <Badge tone="red">Disabled</Badge>) },
                ]}
            />
        </>
    );
}
