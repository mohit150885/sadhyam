import type { Metadata } from "next";
import { TestSeriesView } from "../../components/views/CatalogViews";

export const metadata: Metadata = { title: "Test Series" };

export default function TestSeriesPage() {
    return <TestSeriesView />;
}
