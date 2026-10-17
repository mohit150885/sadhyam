"use client";

import EntityManager, { useExams } from "../../../components/admin/EntityManager";
import { testSchema } from "../../../components/admin/schemas";

export default function AdminTestSeriesPage() {
    const exams = useExams();
    return (
        <EntityManager
            title="Test Series"
            description="Shown on the Test Series page and home page. Saved to site_content/testSeries."
            contentKey="testSeries"
            arrayPath="items"
            schema={testSchema(exams)}
            noun="test series"
            kind="test"
            previewBase="/test-series"
            newItem={{ title: "", category: exams[0] ?? "UPSC", type: "Full Length", language: "Hinglish", instructor: "Expert Faculty Team", tests: "", questions: "", validity: "1 Year Validity", rating: 4.5, reviews: "0", price: 0, oldPrice: 0, image: "", badge: "", tone: "orange", published: true, featured: false, features: [], description: "", structure: [], schedule: [], faqs: [] }}
        />
    );
}
