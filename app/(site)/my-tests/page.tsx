import type { Metadata } from "next";
import { MyTestsView } from "../../components/views/AccountViews";

export const metadata: Metadata = { title: "My Test Series", robots: { index: false } };

export default function Page() {
    return <MyTestsView />;
}
