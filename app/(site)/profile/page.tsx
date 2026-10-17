import type { Metadata } from "next";
import { ProfileView } from "../../components/views/AccountViews";

export const metadata: Metadata = { title: "My Profile", robots: { index: false } };

export default function Page() {
    return <ProfileView />;
}
