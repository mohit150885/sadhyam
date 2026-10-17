import { TestSeriesDetailView } from "../../../components/views/DetailViews";

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <TestSeriesDetailView id={decodeURIComponent(id)} />;
}
