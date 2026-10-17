import type { Metadata } from "next";
import { LegalView } from "../../components/views/InfoViews";

export const metadata: Metadata = { title: "Refund Policy" };

export default function Page() {
    return <LegalView doc="refund" />;
}
