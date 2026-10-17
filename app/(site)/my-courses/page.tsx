import type { Metadata } from "next";
import { MyCoursesView } from "../../components/views/AccountViews";

export const metadata: Metadata = { title: "My Courses", robots: { index: false } };

export default function Page() {
    return <MyCoursesView />;
}
