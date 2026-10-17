"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import {
    Bell,
    CirclePlay,
    FileText,
    LogOut,
    Megaphone,
    Menu,
    Mic,
    Package,
    Search,
    Settings,
    ShoppingCart,
    UserRound,
    X,
} from "lucide-react";
import { collection, limit, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useContent } from "../../hooks/useContent";
import { useAuth } from "../providers/AuthProvider";
import { useCart } from "../providers/CartProvider";
import { Brand } from "./ui";
import { Countdown } from "./Countdown";
import { cn, formatDate, toMillis } from "../../lib/utils";
import type { SiteNotification } from "../../lib/models";

type SpeechRecognitionLike = {
    lang: string;
    interimResults: boolean;
    onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    start: () => void;
};

function useNotifications() {
    const [items, setItems] = useState<SiteNotification[]>([]);
    useEffect(() => {
        const q = query(collection(db, "notifications"), where("published", "==", true), limit(20));
        return onSnapshot(
            q,
            (snap) => {
                const list = snap.docs
                    .map((d) => ({ id: d.id, ...d.data() }) as SiteNotification)
                    .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
                setItems(list.slice(0, 8));
            },
            () => setItems([])
        );
    }, []);
    return items;
}

const SEEN_KEY = "sadhyam_notifications_seen";
const seenListeners = new Set<() => void>();
function readSeen() {
    try {
        return Number(window.localStorage.getItem(SEEN_KEY) || 0);
    } catch {
        return 0;
    }
}
function subscribeSeen(l: () => void) {
    seenListeners.add(l);
    return () => seenListeners.delete(l);
}

export default function Navbar() {
    const { data: global } = useContent("global");
    const { user, profile, logout } = useAuth();
    const { count } = useCart();
    const pathname = usePathname();
    const router = useRouter();
    const notifications = useNotifications();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [bellOpen, setBellOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const [search, setSearch] = useState("");
    const [listening, setListening] = useState(false);
    const seenAt = useSyncExternalStore(subscribeSeen, readSeen, () => Number.MAX_SAFE_INTEGER);
    const [routeKey, setRouteKey] = useState(pathname);

    const headerRef = useRef<HTMLElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const bellRef = useRef<HTMLDivElement>(null);

    const announcement = global.announcement;
    const showAnnouncement = Boolean(announcement?.enabled && announcement.text);

    const unread = notifications.filter((n) => toMillis(n.createdAt) > seenAt).length;

    // Close menus on route change.
    if (routeKey !== pathname) {
        setRouteKey(pathname);
        setMobileOpen(false);
        setProfileOpen(false);
        setBellOpen(false);
    }

    // Close dropdowns on outside click.
    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            const t = e.target as Node;
            if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false);
            if (bellRef.current && !bellRef.current.contains(t)) setBellOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    // Hide on scroll down, show on scroll up. Publishes the header offset as a
    // CSS variable so sticky tab bars on other pages can sit right below it.
    useEffect(() => {
        let last = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            if (y <= 10 || y < last) setVisible(true);
            else if (y > last + 4 && !mobileOpen) {
                setVisible(false);
                setProfileOpen(false);
                setBellOpen(false);
            }
            last = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [mobileOpen]);

    useEffect(() => {
        const h = headerRef.current?.offsetHeight ?? 70;
        document.documentElement.style.setProperty("--nav-offset", visible ? `${h}px` : "0px");
    }, [visible, showAnnouncement]);

    const submitSearch = (e?: FormEvent) => {
        e?.preventDefault();
        const q = search.trim();
        router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
        setMobileOpen(false);
    };

    const startVoice = () => {
        const w = window as unknown as {
            SpeechRecognition?: new () => SpeechRecognitionLike;
            webkitSpeechRecognition?: new () => SpeechRecognitionLike;
        };
        const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
        if (!Ctor) {
            alert("Voice search is not supported in this browser.");
            return;
        }
        const rec = new Ctor();
        rec.lang = "en-IN";
        rec.interimResults = false;
        rec.onresult = (e) => {
            const text = e.results[0]?.[0]?.transcript ?? "";
            setSearch(text);
            if (text) router.push(`/search?q=${encodeURIComponent(text)}`);
        };
        rec.onend = () => setListening(false);
        rec.onerror = () => setListening(false);
        setListening(true);
        rec.start();
    };

    const openBell = () => {
        setBellOpen((v) => !v);
        try {
            window.localStorage.setItem(SEEN_KEY, String(Date.now()));
        } catch {
            /* ignore */
        }
        seenListeners.forEach((l) => l());
    };

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

    const displayName = profile?.name || user?.displayName || "Student";
    const avatar = user?.photoURL || profile?.photoURL || "/proflogo.jpg";

    const accountLinks = [
        { href: "/profile", label: "My Profile", icon: UserRound },
        { href: "/my-courses", label: "My Courses", icon: CirclePlay },
        { href: "/my-tests", label: "My Test Series", icon: FileText },
        { href: "/orders", label: "My Orders", icon: Package },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <header
            ref={headerRef}
            className={cn(
                "sticky top-0 z-[100] w-full border-b border-slate-200 bg-white/95 shadow-[0_0.0625rem_0.625rem_rgba(15,23,42,0.06)] backdrop-blur-md transition-transform duration-300",
                visible ? "translate-y-0" : "-translate-y-full"
            )}
        >
            {showAnnouncement && (
                <Link
                    href={announcement.link || "#"}
                    className="t-small flex items-center justify-center gap-2 bg-navy px-4 py-2 text-center font-semibold text-white"
                >
                    <Megaphone size={14} className="shrink-0 text-brand" />
                    <span className="truncate">{announcement.text}</span>
                    {announcement.showCountdown && announcement.countdownAt && (
                        <Countdown target={announcement.countdownAt} variant="inline" className="shrink-0 rounded bg-white/10 px-2 py-0.5 text-brand" />
                    )}
                </Link>
            )}

            <div className="container-site flex min-h-[4rem] max-w-[105rem] items-center justify-between gap-2 sm:min-h-[4.375rem] sm:gap-4">
                <Brand />

                <nav className="hidden shrink-0 grow items-center justify-center gap-0.5 xl:flex 2xl:gap-1" aria-label="Main">
                    {global.navLinks.map((item) => (
                        <Link
                            key={item.href + item.label}
                            href={item.href}
                            className={cn(
                                "t-nav-link whitespace-nowrap rounded-md px-2.5 py-2 font-bold transition 2xl:px-3",
                                isActive(item.href) ? "text-brand" : "text-slate-600 hover:text-brand"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex min-w-0 items-center justify-end gap-0.5 sm:gap-1.5 [&>*]:shrink-0">
                    {global.showSearch && (
                        <form
                            onSubmit={submitSearch}
                            className="t-search hidden h-10 w-[15rem] min-w-[9.375rem] !shrink items-center gap-2 rounded-lg bg-slate-50 px-3 text-slate-400 ring-1 ring-slate-200 transition focus-within:ring-brand 3xl:flex"
                            role="search"
                        >
                            <Search size={16} />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search tests, courses..."
                                aria-label="Search tests and courses"
                                className="w-full bg-transparent text-slate-700 outline-none"
                            />
                            <button
                                type="button"
                                onClick={startVoice}
                                aria-label="Voice search"
                                className={cn("shrink-0 transition hover:text-brand", listening && "animate-pulse text-brand")}
                            >
                                <Mic size={16} />
                            </button>
                        </form>
                    )}

                    {global.showSearch && (
                        <Link
                            href="/search"
                            aria-label="Search"
                            className="hidden h-10 w-10 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-50 sm:grid 3xl:hidden"
                        >
                            <Search size={18} />
                        </Link>
                    )}

                    <div className="relative" ref={bellRef}>
                        <button
                            type="button"
                            onClick={openBell}
                            aria-label="Notifications"
                            className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-50"
                        >
                            <Bell size={18} />
                            {unread > 0 && (
                                <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[0.625rem] font-black text-white">
                                    {unread}
                                </span>
                            )}
                        </button>
                        {bellOpen && (
                            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl">
                                <div className="t-search border-b border-slate-100 px-4 py-3 font-black text-slate-900">Notifications</div>
                                {notifications.length === 0 ? (
                                    <p className="t-small px-4 py-6 text-center text-slate-500">You&apos;re all caught up.</p>
                                ) : (
                                    <ul className="max-h-80 overflow-y-auto">
                                        {notifications.map((n) => (
                                            <li key={n.id} className="border-b border-slate-50 last:border-0">
                                                <Link href={n.link || "#"} className="block px-4 py-3 transition hover:bg-slate-50">
                                                    <p className="t-search font-bold text-slate-900">{n.title}</p>
                                                    <p className="t-profile-sub mt-0.5 line-clamp-2 text-slate-500">{n.message}</p>
                                                    <p className="mt-1 text-[0.6875rem] font-semibold text-slate-400">{formatDate(n.createdAt)}</p>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    <Link
                        href="/cart"
                        aria-label="Shopping cart"
                        className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-50"
                    >
                        <ShoppingCart size={18} />
                        {count > 0 && (
                            <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[0.625rem] font-black text-white">
                                {count}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="relative hidden xl:block" ref={profileRef}>
                            <button
                                type="button"
                                onClick={() => setProfileOpen((v) => !v)}
                                aria-label="Open profile menu"
                                aria-expanded={profileOpen}
                                className="ml-1 flex items-center rounded-full border-2 border-transparent transition hover:border-brand-200"
                            >
                                <img src={avatar} alt="" className="h-10 w-10 rounded-full bg-brand-100 object-cover" />
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-100 bg-white py-2 shadow-xl">
                                    <div className="border-b border-slate-100 px-4 py-3">
                                        <p className="t-search truncate font-bold text-slate-900">{displayName}</p>
                                        <p className="t-profile-sub truncate font-medium text-slate-500">{user.email}</p>
                                    </div>
                                    {accountLinks.map(({ href, label, icon: Icon }) => (
                                        <Link
                                            key={href}
                                            href={href}
                                            className="t-search flex items-center gap-3 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 hover:text-brand"
                                        >
                                            <Icon size={16} />
                                            {label}
                                        </Link>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="t-search mt-1 flex w-full items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-left font-medium text-red-600 transition hover:bg-red-50"
                                    >
                                        <LogOut size={16} />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden items-center gap-2 xl:flex">
                            <Link href="/login" className="t-nav-link flex h-10 items-center whitespace-nowrap rounded-lg border-2 border-brand px-4 font-bold text-brand transition hover:bg-brand-50">
                                Login
                            </Link>
                            <Link href="/signup" className="t-nav-link flex h-10 items-center whitespace-nowrap rounded-lg bg-brand px-4 font-bold text-white shadow-sm transition hover:bg-brand-600">
                                Sign Up
                            </Link>
                        </div>
                    )}

                    <button
                        type="button"
                        className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 xl:hidden"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="border-t border-slate-100 bg-white xl:hidden">
                    <div className="container-site flex max-h-[calc(100vh-5rem)] flex-col gap-1 overflow-y-auto py-4">
                        {global.showSearch && (
                            <form onSubmit={submitSearch} className="t-search mb-3 flex h-11 items-center gap-2 rounded-lg bg-slate-50 px-3 text-slate-400 ring-1 ring-slate-200" role="search">
                                <Search size={16} />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search tests, courses..."
                                    aria-label="Search"
                                    className="w-full bg-transparent text-slate-700 outline-none"
                                />
                                <button type="button" onClick={startVoice} aria-label="Voice search">
                                    <Mic size={16} />
                                </button>
                            </form>
                        )}
                        {global.navLinks.map((item) => (
                            <Link
                                key={item.href + item.label}
                                href={item.href}
                                className={cn(
                                    "t-nav rounded-md px-3 py-2.5 font-bold",
                                    isActive(item.href) ? "bg-brand-50 text-brand" : "text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="mt-3 border-t border-slate-100 pt-3">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 px-3 pb-3">
                                        <img src={avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                                        <div className="min-w-0">
                                            <p className="t-search truncate font-bold text-slate-900">{displayName}</p>
                                            <p className="t-profile-sub truncate text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    {accountLinks.map(({ href, label, icon: Icon }) => (
                                        <Link key={href} href={href} className="t-search flex items-center gap-3 rounded-md px-3 py-2.5 font-medium text-slate-700 hover:bg-slate-50">
                                            <Icon size={16} /> {label}
                                        </Link>
                                    ))}
                                    <button type="button" onClick={logout} className="t-search flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left font-medium text-red-600 hover:bg-red-50">
                                        <LogOut size={16} /> Sign out
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href="/login" className="t-nav flex h-11 items-center justify-center rounded-lg border-2 border-brand font-bold text-brand">
                                        Login
                                    </Link>
                                    <Link href="/signup" className="t-nav flex h-11 items-center justify-center rounded-lg bg-brand font-bold text-white">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
