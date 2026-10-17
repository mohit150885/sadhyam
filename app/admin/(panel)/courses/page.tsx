"use client";

import EntityManager, { useExams } from "../../../components/admin/EntityManager";
import { courseSchema } from "../../../components/admin/schemas";

export default function AdminCoursesPage() {
    const exams = useExams();
    return (
        <EntityManager
            title="Courses"
            description="Shown on the Courses page, the home page (featured first), search and cart. Saved to site_content/courses."
            contentKey="courses"
            arrayPath="items"
            schema={courseSchema(exams)}
            noun="course"
            kind="course"
            previewBase="/courses"
            newItem={{ title: "", category: exams[0] ?? "UPSC", type: "Foundation Course", language: "Hinglish", instructor: "Expert Faculty Team", lectures: "", pdfs: "", tests: "", validity: "1 Year Validity", rating: 4.5, reviews: "0", price: 0, oldPrice: 0, image: "", badge: "", published: true, featured: false, features: [], highlights: [], description: "", syllabus: [], faqs: [] }}
        />
    );
}
