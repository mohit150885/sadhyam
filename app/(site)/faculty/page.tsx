import type { Metadata } from "next";
import { FacultyView } from "../../components/views/PeopleViews";

export const metadata: Metadata = { title: "Faculty" };

export default function FacultyPage() {
    return <FacultyView />;
}
