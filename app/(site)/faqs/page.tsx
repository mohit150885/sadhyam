import type { Metadata } from "next";
import { FaqsView } from "../../components/views/InfoViews";

export const metadata: Metadata = { title: "FAQs" };

export default function Page() {
    return <FaqsView />;
}
