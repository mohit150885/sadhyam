"use client";

import RecordManager from "../../../components/admin/RecordManager";
import { Badge } from "../../../components/admin/ui";
import { formatDate } from "../../../lib/utils";

export default function NotificationsPage() {
    return (
        <RecordManager
            title="Notifications"
            description="Published notifications appear in the bell icon in the website header, live."
            collection="notifications"
            noun="notification"
            blank={{ title: "", message: "", link: "", type: "info", published: true }}
            validate={(r) => (!String(r.title || "").trim() ? "Enter a title." : null)}
            schema={[
                { key: "title", label: "Title", type: "text" },
                { key: "type", label: "Type", type: "select", options: ["info", "offer", "exam", "result"] },
                { key: "message", label: "Message", type: "textarea" },
                { key: "link", label: "Link (optional)", type: "text", placeholder: "/courses/upsc-pre-mains" },
                { key: "published", label: "Published", type: "toggle" },
            ]}
            columns={[
                { label: "Title", render: (r) => <span className="font-bold">{String(r.title)}</span> },
                { label: "Message", render: (r) => <span className="line-clamp-1 max-w-[340px] text-slate-600">{String(r.message ?? "")}</span> },
                { label: "Type", render: (r) => <span className="capitalize">{String(r.type ?? "info")}</span> },
                { label: "Created", render: (r) => <span className="text-[13px] text-slate-500">{formatDate(r.createdAt, true)}</span> },
                { label: "Status", render: (r) => (r.published ? <Badge tone="green">Live</Badge> : <Badge>Draft</Badge>) },
            ]}
        />
    );
}
