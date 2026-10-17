import { Suspense } from "react";
import { AuthProvider } from "../components/providers/AuthProvider";
import { CartProvider } from "../components/providers/CartProvider";
import Navbar from "../components/site/Navbar";
import Footer from "../components/site/Footer";
import ThemeStyle from "../components/site/ThemeStyle";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CartProvider>
                <ThemeStyle />
                <div className="site-root flex min-h-screen flex-col bg-slate-50/50 text-slate-900">
                    <Navbar />
                    <main className="flex-1">
                        <Suspense fallback={null}>{children}</Suspense>
                    </main>
                    <Footer />
                </div>
            </CartProvider>
        </AuthProvider>
    );
}
