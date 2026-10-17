import type { Metadata } from "next";
import { ResultsView } from "../../components/views/PeopleViews";

export const metadata: Metadata = { title: "Results" };

export default function ResultsPage() {
    return <ResultsView />;
}
