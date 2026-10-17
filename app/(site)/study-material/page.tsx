import type { Metadata } from "next";
import { StudyMaterialView } from "../../components/views/CatalogViews";

export const metadata: Metadata = { title: "Study Material" };

export default function StudyMaterialPage() {
    return <StudyMaterialView />;
}
