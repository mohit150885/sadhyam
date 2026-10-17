import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminIdentity } from "../../lib/admin-session";
import AdminLoginForm from "../../components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Sign In", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
    if (await getAdminIdentity()) redirect("/admin");
    return <AdminLoginForm />;
}
