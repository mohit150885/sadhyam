"use client";

import EntityManager from "../../../components/admin/EntityManager";
import { facultySchema } from "../../../components/admin/schemas";

export default function AdminFacultyPage() {
    return (
        <EntityManager
            title="Faculty"
            description="Teachers shown on the Faculty page, home page and course pages. Saved to site_content/faculty."
            contentKey="faculty"
            arrayPath="items"
            schema={facultySchema}
            noun="faculty member"
            idFrom="name"
            previewBase="/faculty"
            newItem={{ name: "", subject: "", experience: "", bullets: [], image: "", bio: "", quote: "", students: "", rating: "", videoUrl: "", published: true, featured: false }}
        />
    );
}
