import type { Metadata } from "next";
import { AboutView } from "../../components/views/PeopleViews";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
    return <AboutView />;
}
