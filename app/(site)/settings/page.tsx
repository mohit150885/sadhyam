import type { Metadata } from "next";
import { SettingsView } from "../../components/views/AccountViews";

export const metadata: Metadata = { title: "Account Settings", robots: { index: false } };

export default function Page() {
    return <SettingsView />;
}
