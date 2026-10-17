"use client";

import EntityManager from "../../../components/admin/EntityManager";
import { testimonialSchema } from "../../../components/admin/schemas";

export default function AdminTestimonialsPage() {
    return (
        <EntityManager
            title="Testimonials"
            description="Student quotes shown on the home, results and detail pages (when an item has no approved reviews yet)."
            contentKey="home"
            arrayPath="testimonials.items"
            schema={testimonialSchema}
            noun="testimonial"
            idFrom="name"
            hasId={false}
            newItem={{ name: "", role: "", quote: "", image: "", rating: 5 }}
        />
    );
}
