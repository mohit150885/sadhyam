import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminIdentity } from "../../lib/admin-session";
import AdminShell from "../../components/admin/AdminShell";
import { ensureSiteContent } from "../../lib/autoSeed";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

/** Every page under /admin (except /admin/login) requires a valid admin session. */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
    const admin = await getAdminIdentity();
    if (!admin) redirect("/admin/login");
    // Creates any missing site_content pages in Firestore with default content.
    await ensureSiteContent();
    return (
        <AdminShell name={admin.name} role={admin.role}>
            {children}
        </AdminShell>
    );
}
