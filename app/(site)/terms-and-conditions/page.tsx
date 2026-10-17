import type { Metadata } from "next";
import { LegalView } from "../../components/views/InfoViews";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function Page() {
    return <LegalView doc="terms" />;
}
