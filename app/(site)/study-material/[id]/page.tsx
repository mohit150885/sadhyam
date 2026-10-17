import { StudyMaterialDetailView } from "../../../components/views/DetailViews";

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <StudyMaterialDetailView id={decodeURIComponent(id)} />;
}
