"use client";

import EntityManager, { useExams } from "../../../components/admin/EntityManager";
import { topperSchema } from "../../../components/admin/schemas";

export default function AdminResultsPage() {
    const exams = useExams();
    return (
        <EntityManager
            title="Results & Toppers"
            description="Toppers shown on the Results page and home page. Videos and yearly stats are in Website Settings → Results Page."
            contentKey="results"
            arrayPath="toppers"
            schema={topperSchema(exams)}
            noun="topper"
            idFrom="name"
            newItem={{ name: "", rank: "", exam: "", category: exams[0] ?? "UPSC", quote: "", image: "", color: "amber", featured: false }}
        />
    );
}
