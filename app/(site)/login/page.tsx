import type { Metadata } from "next";
import { LoginView } from "../../components/views/AuthViews";

export const metadata: Metadata = { title: "Login" };

export default function Page() {
    return <LoginView />;
}
