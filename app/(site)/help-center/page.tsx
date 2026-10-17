import type { Metadata } from "next";
import { HelpView } from "../../components/views/InfoViews";

export const metadata: Metadata = { title: "Help Center" };

export default function Page() {
    return <HelpView />;
}
