import type { Metadata } from "next";
import { SignupView } from "../../components/views/AuthViews";

export const metadata: Metadata = { title: "Sign Up" };

export default function Page() {
    return <SignupView />;
}
