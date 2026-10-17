import type { Metadata } from "next";
import { ForgotPasswordView } from "../../components/views/AuthViews";

export const metadata: Metadata = { title: "Reset Password" };

export default function Page() {
    return <ForgotPasswordView />;
}
