"use client";

import EntityManager, { useExams } from "../../../components/admin/EntityManager";
import { materialSchema } from "../../../components/admin/schemas";

export default function AdminStudyMaterialPage() {
    const exams = useExams();
    return (
        <EntityManager
            title="Study Material"
            description="Notes, PDFs and books. Saved to site_content/studyMaterial."
            contentKey="studyMaterial"
            arrayPath="items"
            schema={materialSchema(exams)}
            noun="material"
            kind="material"
            previewBase="/study-material"
            newItem={{ title: "", category: exams[0] ?? "UPSC", subject: "", format: "PDF", language: "Hinglish", pages: "", rating: 4.5, reviews: "0", price: 0, oldPrice: 0, image: "", badge: "", published: true, featured: false, tags: [], description: "", samplePages: [], contents: [], faqs: [] }}
        />
    );
}
