"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useContent } from "../../hooks/useContent";
import {
    Award,
    BarChart2,
    Bell,
    BookOpen,
    ExternalLink,
    FileBox,
    FileCheck,
    FileText,
    GraduationCap,
    HelpCircle,
    Image as ImageIcon,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquareQuote,
    Percent,
    Settings,
    Shield,
    ShoppingCart,
    Star,
    Users,
    X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { ToastProvider } from "./ui";
import ThemeStyle from "../site/ThemeStyle";

export type AdminRole = "owner" | "admin" | "editor";

const GROUPS: { title: string; items: { href: string; label: string; icon: typeof LayoutDashboard; roles?: AdminRole[] }[] }[] = [
    {
        title: "Overview",
        items: [
            { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["owner", "admin"] },
            { href: "/admin/analytics", label: "Analytics", icon: BarChart2, roles: ["owner", "admin"] },
        ],
    },
    {
        title: "Catalog",
        items: [
            { href: "/admin/courses", label: "Courses", icon: BookOpen },
            { href: "/admin/test-series", label: "Test Series", icon: FileCheck },
            { href: "/admin/study-material", label: "Study Material", icon: FileText },
            { href: "/admin/faculty", label: "Faculty", icon: Users },
            { href: "/admin/results", label: "Results & Toppers", icon: Award },
            { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
        ],
    },
    {
        title: "Sales & Students",
        items: [
            { href: "/admin/orders", label: "Orders & Payments", icon: ShoppingCart, roles: ["owner", "admin"] },
            { href: "/admin/students", label: "Students", icon: GraduationCap, roles: ["owner", "admin"] },
            { href: "/admin/coupons", label: "Coupons & Offers", icon: Percent, roles: ["owner", "admin"] },
            { href: "/admin/reviews", label: "Reviews", icon: Star },
            { href: "/admin/support", label: "Support & Queries", icon: HelpCircle, roles: ["owner", "admin"] },
        ],
    },
    {
        title: "Website",
        items: [
            { href: "/admin/settings", label: "Website Settings", icon: Settings },
            { href: "/admin/banners", label: "Banners & Media", icon: ImageIcon },
            { href: "/admin/notifications", label: "Notifications", icon: Bell },
        ],
    },
    {
        title: "System",
        items: [
            { href: "/admin/users", label: "Users & Admins", icon: Shield, roles: ["owner"] },
            { href: "/admin/reports", label: "Reports", icon: FileBox, roles: ["owner", "admin"] },
        ],
    },
];

export default function AdminShell({ children, name, role }: { children: ReactNode; name: string; role: AdminRole }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const router = useRouter();
    const [routeKey, setRouteKey] = useState(pathname);
    if (routeKey !== pathname) {
        setRouteKey(pathname);
        setOpen(false);
    }

    const logout = async () => {
        setLoggingOut(true);
        await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
        router.replace("/admin/login");
        router.refresh();
    };

    const { data: global } = useContent("global");
    const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`));
    const current = GROUPS.flatMap((g) => g.items).find((i) => isActive(i.href));

    const sidebar = (
        <nav className="flex h-full flex-col">
            <Link href="/admin" className="flex h-[64px] shrink-0 items-center gap-2.5 bg-[#020617] px-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={global.logoImage || "/logo.svg"} alt="" className="h-9 w-9 shrink-0 rounded-lg bg-white/5 object-contain" />
                <span>
                    <strong className="block text-[18px] font-black leading-none text-white">{global.siteName}</strong>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Admin Panel</span>
                </span>
            </Link>
            <div className="flex-1 overflow-y-auto px-3 py-4">
                {GROUPS.map((g) => {
                    const items = g.items.filter((i) => !i.roles || i.roles.includes(role));
                    if (!items.length) return null;
                    return (
                        <div key={g.title} className="mb-5">
                            <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{g.title}</p>
                            {items.map(({ href, label, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-semibold transition",
                                        isActive(href) ? "bg-brand text-white shadow" : "text-slate-300 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <Icon size={17} /> {label}
                                </Link>
                            ))}
                        </div>
                    );
                })}
            </div>
            <div className="border-t border-white/10 p-3">
                <button type="button" onClick={logout} disabled={loggingOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-semibold text-slate-300 hover:bg-white/5 hover:text-white">
                    <LogOut size={17} /> {loggingOut ? "Signing out..." : "Sign out"}
                </button>
            </div>
        </nav>
    );

    return (
        <ToastProvider>
            <ThemeStyle />
            <div className="flex min-h-screen bg-slate-100 text-slate-900">
                <aside className="fixed inset-y-0 left-0 z-40 hidden w-[256px] bg-[#0f172a] lg:block">{sidebar}</aside>
                {open && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
                        <aside className="absolute inset-y-0 left-0 w-[270px] bg-[#0f172a]">
                            <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-4 text-slate-300" aria-label="Close">
                                <X size={20} />
                            </button>
                            {sidebar}
                        </aside>
                    </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col lg:pl-[256px]">
                    <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open menu">
                                <Menu size={20} />
                            </button>
                            <span className="text-[15px] font-bold text-slate-500">{current?.label ?? "Admin"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <a href="/" target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 sm:inline-flex">
                                View website <ExternalLink size={14} />
                            </a>
                            <div className="flex items-center gap-2">
                                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-[14px] font-black text-brand-700">{name.slice(0, 1).toUpperCase()}</span>
                                <span className="hidden leading-tight sm:block">
                                    <span className="block text-[13px] font-bold text-slate-900">{name}</span>
                                    <span className="block text-[11px] font-semibold capitalize text-slate-500">{role}</span>
                                </span>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </ToastProvider>
    );
}
