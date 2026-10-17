import { FacultyDetailView } from "../../../components/views/PeopleViews";

export default async function FacultyProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <FacultyDetailView id={decodeURIComponent(id)} />;
}
