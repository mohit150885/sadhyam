import type { Metadata, Viewport } from "next";
import "./globals.css";
import { readContent } from "./lib/serverContent";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
    const global = await readContent("global");
    const seo = global.seo;
    return {
        title: { default: seo.title, template: `%s | ${global.siteName}` },
        description: seo.description,
        keywords: seo.keywords,
        icons: global.favicon ? [{ url: global.favicon }] : undefined,
        openGraph: { title: seo.title, description: seo.description, siteName: global.siteName, type: "website" },
    };
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#021424",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                {/* eslint-disable-next-line @next/next/no-page-custom-font -- fonts are shared by every page via the root layout */}
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Kalam:wght@700&display=swap"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
