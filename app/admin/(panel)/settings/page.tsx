import { Suspense } from "react";
import ContentEditor from "../../../components/admin/ContentEditor";

export default function AdminSettingsPage() {
    return (
        <Suspense fallback={null}>
            <ContentEditor />
        </Suspense>
    );
}
