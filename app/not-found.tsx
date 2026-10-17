import Link from "next/link";
import SiteLayout from "./(site)/layout";

export default function NotFound() {
    return (
        <SiteLayout>
        <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
            <p className="t-hero-title font-black text-brand">404</p>
            <h1 className="t-section-title mt-2 font-black text-slate-900">Page not found</h1>
            <p className="t-body mt-3 text-slate-500">The page you are looking for doesn&apos;t exist or has moved.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/" className="t-button inline-flex h-12 items-center rounded-lg bg-brand px-6 font-bold text-white hover:bg-brand-600">Go Home</Link>
                <Link href="/courses" className="t-button inline-flex h-12 items-center rounded-lg border-2 border-brand px-6 font-bold text-brand hover:bg-brand-50">Browse Courses</Link>
            </div>
        </div>
        </SiteLayout>
    );
}
