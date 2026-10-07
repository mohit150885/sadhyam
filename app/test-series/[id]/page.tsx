"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useParams, usePathname } from "next/navigation";
import {
    ArrowRight,
    BookOpen,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Clock4,
    FileText,
    Menu,
    MessageCircle,
    Mic,
    Phone,
    Play,
    Quote,
    Search,
    ShoppingCart,
    Star,
    Target,
    Trophy,
    UserRound,
    X,
    BarChart3,
    Calendar,
    ShieldCheck,
    Download,
    LayoutDashboard,
    Flame
} from "lucide-react";
import Link from "next/link";

// --- Mock Database from Listing Page ---
const testSeries = [
    {
        id: 1,
        title: "UPSC CSE Prelims Test Series 2025",
        category: "UPSC",
        instructor: "Expert Faculty Team",
        tests: "50 Tests",
        questions: "10,000+ Questions",
        validity: "1 Year Validity",
        rating: 4.8,
        reviews: "3.2k",
        price: 1499,
        oldPrice: 2499,
        discount: 40,
        image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1600&q=85",
        badge: "Most Popular",
        type: "Full Length",
    },
    {
        id: 2,
        title: "UPPSC Prelims Test Series 2025",
        category: "UPPSC",
        instructor: "Dr. A. Kumar & Team",
        tests: "40 Tests",
        questions: "8,000+ Questions",
        validity: "1 Year Validity",
        rating: 4.7,
        reviews: "1.8k",
        price: 1999,
        oldPrice: 3499,
        discount: 43,
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=85",
        badge: "New",
        type: "Full Length",
    }
];

const facultyMembers = [
    {
        id: 1,
        name: "Dr. A. Kumar",
        subject: "Polity",
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 2,
        name: "Prof. N. Singh",
        subject: "Geography",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 3,
        name: "S. Sharma",
        subject: "History",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 4,
        name: "R. Verma",
        subject: "Economy",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    },
];

const testStructureData = [
    { id: 1, title: "Full-Length Tests", details: "15 Tests • 100 Questions • 2 Hours" },
    { id: 2, title: "Sectional Tests", details: "20 Tests • Subject-wise • 100 Questions" },
    { id: 3, title: "Topic-wise Tests", details: "15 Tests • Chapter-wise • 50 Questions" },
    { id: 4, title: "Current Affairs Tests", details: "12 Tests • Monthly • 100 Questions" },
    { id: 5, title: "Previous Year Papers", details: "10 Tests • 2014-2024 • 100 Questions" },
];

const scheduleData = [
    { id: 1, title: "Full-Length Test 1", subtitle: "General Studies", date: "12 Oct 2025 (Sun)", time: "10:00 AM - 12:00 PM", status: "Upcoming" },
    { id: 2, title: "Polity Sectional Test", subtitle: "Indian Constitution", date: "15 Oct 2025 (Wed)", time: "10:00 AM - 12:00 PM", status: "Upcoming" },
    { id: 3, title: "Current Affairs Test", subtitle: "September 2025", date: "18 Oct 2025 (Sat)", time: "10:00 AM - 12:00 PM", status: "Upcoming" },
    { id: 4, title: "Full-Length Test 2", subtitle: "General Studies", date: "22 Oct 2025 (Wed)", time: "10:00 AM - 12:00 PM", status: "Upcoming" },
    { id: 5, title: "Economy Sectional Test", subtitle: "Indian Economy", date: "25 Oct 2025 (Sat)", time: "10:00 AM - 12:00 PM", status: "Upcoming" },
];

const testimonials = [
    {
        name: "Aditi Sharma",
        exam: "UPSC CSE 2023",
        quote: "The test series helped me understand my weak areas and improve my time management. The detailed solutions are excellent.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    },
    {
        name: "Rohit Yadav",
        exam: "UPSC CSE 2022",
        quote: "Very close to actual UPSC pattern. The analytics and ranking system is really motivating.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
    },
    {
        name: "Neha Joshi",
        exam: "UPSC CSE 2023",
        quote: "Best test series for serious aspirants. The topic-wise tests are very useful for revision.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
    }
];

const faqs = [
    { q: "How many tests are included in this test series?", a: "This series includes 50+ total tests, including full-length, sectional, and topic-wise tests." },
    { q: "What is the validity period?", a: "The test series is valid for 12 months from the date of enrollment." },
    { q: "Will I get detailed solutions?", a: "Yes, every test comes with comprehensive text and video solutions." },
    { q: "Can I attempt tests on mobile?", a: "Yes, you can access the tests seamlessly on our Web, Android, and iOS applications." },
    { q: "Is there any refund policy?", a: "We offer a 7-day refund policy if you are not satisfied with the content." },
];

function Brand({ dark = false }: { dark?: boolean }) {
    return (
        <Link aria-label="SadhyamIAS home" className="flex shrink-0 items-center gap-2.5 no-underline" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-[26px] shadow-sm">
                🔥
            </span>
            <span className="flex flex-col">
                <strong className={`text-[26px] font-black leading-none tracking-tight sm:text-[28px] ${dark ? "text-white" : "text-slate-900"}`}>
                    SadhyamIAS
                </strong>
            </span>
        </Link>
    );
}

function SectionHeading({ title, description, action }: { title: ReactNode; description: string; action?: string; }) {
    return (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:mb-8">
            <div className="min-w-0">
                <h2 className="text-[24px] font-black leading-[1.2] tracking-tight text-slate-900 sm:text-[32px]">
                    {title}
                </h2>
                <p className="mt-2 text-[14px] leading-[1.5] text-slate-500 sm:text-[16px] max-w-[800px]">
                    {description}
                </p>
            </div>
            {action && (
                <Link className="hidden shrink-0 items-center gap-1.5 text-[14px] font-bold text-blue-600 sm:flex hover:text-blue-700 transition" href="#">
                    {action} <ArrowRight size={16} />
                </Link>
            )}
        </div>
    );
}

export default function TestSeriesDetailsPage() {
    // Dynamic Routing Parameters
    const params = useParams();
    const currentId = Number(params?.id) || 1;
    const baseSeries = testSeries.find(ts => ts.id === currentId) || testSeries[0];

    const [showNavbar, setShowNavbar] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Overview");
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [openSyllabus, setOpenSyllabus] = useState<number[]>([1, 2]);
    const [search, setSearch] = useState("");
    const pathname = usePathname();

    useEffect(() => {
        let lastScrollY = window.scrollY;
        const onScroll = () => {
            const current = window.scrollY;
            if (current <= 10 || current < lastScrollY) setShowNavbar(true);
            else if (current > lastScrollY) setShowNavbar(false);
            lastScrollY = current;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const toggleSyllabus = (id: number) => {
        setOpenSyllabus(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const expandAllSyllabus = () => {
        if (openSyllabus.length === testStructureData.length) setOpenSyllabus([]);
        else setOpenSyllabus(testStructureData.map(s => s.id));
    };

    return (
        <div className="relative min-h-screen w-full max-w-[100vw] flex flex-col overflow-x-clip bg-white text-slate-900 font-sans">
            {/* HEADER */}
            <header
                className={`fixed left-0 top-0 z-[100] w-full border-b border-slate-200 bg-white/95 shadow-[0_1px_10px_rgba(15,23,42,0.06)] backdrop-blur-md transition-transform duration-300 ease-in-out ${showNavbar ? "translate-y-0" : "-translate-y-full"
                    }`}
            >
                <div className="mx-auto flex min-h-[64px] w-[calc(100%-32px)] max-w-[1400px] items-center justify-between gap-4 sm:min-h-[70px] lg:w-[calc(100%-40px)]">
                    <Brand />

                    <nav
                        className={`${mobileOpen ? "flex" : "hidden"
                            } absolute left-3 right-3 top-[68px] flex-col gap-1 rounded-xl border border-slate-200 bg-white p-3 shadow-xl xl:static xl:flex xl:flex-row xl:items-center xl:gap-2 xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none`}
                    >
                        {["Home", "Courses", "Test Series", "Study Material", "Faculty", "Results", "About"].map(
                            (item) => {
                                const path = item === "Home" ? "/" : `/${item.toLowerCase().replaceAll(" ", "-")}`;
                                const isActive = pathname === path || pathname.startsWith(`${path}/`);
                                return (
                                    <Link
                                        key={item}
                                        href={path}
                                        onClick={() => setMobileOpen(false)}
                                        className={`rounded-md px-3 py-2 text-[15px] font-bold transition sm:text-[15px] ${isActive
                                            ? "text-orange-500 bg-orange-50 xl:bg-transparent"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-orange-500"
                                            }`}
                                    >
                                        {item}
                                    </Link>
                                );
                            }
                        )}
                    </nav>

                    <div className="hidden items-center gap-3 xl:flex">
                        <div className="flex h-10 w-[220px] items-center gap-2 rounded-lg bg-slate-50 px-3 text-left text-[14px] text-slate-400 ring-1 ring-slate-200 focus-within:ring-orange-500 transition">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent w-full outline-none text-slate-700"
                            />
                            <Mic size={16} className="cursor-pointer hover:text-orange-500" />
                        </div>
                        <button className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-50 transition relative">
                            <ShoppingCart size={18} />
                        </button>
                        <Link href='/login'>
                            <button className="h-10 rounded-lg border-2 border-orange-500 px-5 text-[14px] font-bold text-orange-500 hover:bg-orange-50 transition">
                                Login
                            </button>
                        </Link>
                        <Link href='/signup'>
                            <button className="h-10 rounded-lg bg-orange-500 px-5 text-[14px] font-bold text-white shadow-sm hover:bg-orange-600 transition">
                                Sign Up
                            </button>
                        </Link>
                    </div>

                    <button
                        className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 xl:hidden"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Toggle navigation"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            <main className="pt-[64px] sm:pt-[70px] w-full max-w-[100vw] overflow-x-clip">
                {/* HERO SECTION */}
                <section className="relative w-full min-h-[420px] bg-slate-900 group flex items-center">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80"
                            alt="Test Series Background"
                            className="block h-full w-full max-w-full object-cover object-center opacity-30 mix-blend-luminosity"
                        />
                    </div>
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#021424]/95 via-[#021424]/80 to-[#021424]/20" />

                    <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8 py-10">
                        <div className="max-w-[760px] text-white">
                            <div className="mb-5 flex flex-wrap gap-2 text-[12px] font-medium text-white/70">
                                {["Home", "Test Series", baseSeries.category, baseSeries.title].map((crumb, idx) => (
                                    <span key={idx} className="flex items-center gap-2">
                                        <span className={idx === 3 ? "text-white font-bold" : ""}>{crumb}</span>
                                        {idx < 3 && <span>›</span>}
                                    </span>
                                ))}
                            </div>

                            <div className="mb-5 flex flex-wrap gap-3">
                                <span className="inline-flex rounded-md bg-white px-2.5 py-1 text-[11px] font-black text-slate-800 shadow-sm">
                                    {baseSeries.category}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-orange-500/30 bg-orange-500/20 px-2.5 py-1 text-[11px] font-bold text-orange-200 shadow-sm backdrop-blur-md">
                                    <Flame size={12} className="text-orange-500" fill="currentColor" />
                                    {baseSeries.badge || "Popular"}
                                </span>
                            </div>

                            <h1 className="text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl lg:text-[52px] max-w-[700px] mb-4">
                                {baseSeries.title.replace("Test Series 2025", "")}
                                <span className="text-orange-500 block sm:inline">Test Series 2025</span>
                            </h1>

                            <p className="mt-4 max-w-[600px] text-[15px] sm:text-[16px] font-medium leading-relaxed text-white/90">
                                Experience real exam environment with our comprehensive test series, designed by expert faculty to help you crack {baseSeries.category} Prelims with confidence.
                            </p>

                            <div className="mt-10 flex flex-wrap gap-x-6 sm:gap-x-10 gap-y-6 text-[13px] font-semibold text-white/90">
                                {[
                                    [LayoutDashboard, "Full-Length", "Tests"],
                                    [FileText, "Sectional", "Tests"],
                                    [BarChart3, "Detailed", "Analytics"],
                                    [Trophy, "All India", "Ranking"],
                                    [MessageCircle, "Expert", "Discussion"],
                                ].map(([Icon, line1, line2], idx) => {
                                    const StatIcon = Icon as any;
                                    return (
                                        <div key={idx} className="flex items-center gap-3">
                                            <StatIcon className="h-7 w-7 text-orange-500 shrink-0" strokeWidth={1.5} />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[13px] font-black text-white leading-tight">{line1 as string}</span>
                                                <span className="text-[13px] font-black text-white leading-tight">{line2 as string}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Decor Image - Right Side */}
                        <div className="hidden lg:block absolute right-[5%] top-1/2 -translate-y-1/2 z-20 pointer-events-none opacity-90">
                            <div className="rotate-[-6deg] font-serif text-[46px] italic leading-[1.1] text-slate-200/90 text-right drop-shadow-xl">
                                Sapna <br /> Taiyaari <br /> Prayas <br />
                                <span className="text-orange-400">Seva</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STICKY NAV TABS */}
                <section className={`w-full border-b border-slate-200 bg-white/95 backdrop-blur-md sticky z-40 shadow-sm transition-[top] duration-300 ease-in-out ${showNavbar ? "top-[64px] sm:top-[70px]" : "top-0"}`}>
                    <div className="w-full max-w-[1400px] max-w-[100vw] mx-auto flex gap-6 overflow-x-auto px-4 sm:px-5 lg:px-6 2xl:px-8 no-scrollbar">
                        {["Overview", "Tests", "Syllabus", "Features", "Reviews", "FAQs"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap border-b-2 px-1 py-4 text-[15px] font-bold transition ${activeTab === tab
                                    ? "border-orange-500 text-orange-600"
                                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </section>

                {/* MAIN CONTENT 2-COLUMN LAYOUT */}
                <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8 py-10 lg:py-12 bg-white">
                    <div className="flex flex-col 2xl:flex-row gap-8 2xl:gap-12 items-start w-full min-w-0">

                        {/* LEFT COLUMN - CONTENT */}
                        <div className="flex-1 w-full min-w-0 flex flex-col gap-12">

                            {/* About This Test Series */}
                            <div className="w-full min-w-0 max-w-full">
                                <SectionHeading
                                    title={<>About This <span className="text-orange-500">Test Series</span></>}
                                    description={`Our ${baseSeries.title} is designed to simulate the actual exam environment and help you assess your preparation level. The test series includes full-length tests, sectional tests, and topic-wise tests with detailed performance analysis and expert discussion.`}
                                />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {[
                                        [BookOpen, "50+ Tests", "Full-Length, Sectional & Topic-wise"],
                                        [Target, "Real Exam Pattern", `Based on latest ${baseSeries.category} syllabus`],
                                        [BarChart3, "Detailed Analytics", "Question-wise analysis & performance tracking"],
                                        [Trophy, "All India Ranking", "Compare with aspirants across the country"],
                                        [ShieldCheck, "Expert Solutions", "Detailed video & text explanations"],
                                        [Clock3, "Flexible Schedule", "Attempt tests anytime, anywhere"],
                                    ].map(([Icon, title, desc], idx) => {
                                        const ItemIcon = Icon as any;
                                        return (
                                            <div key={idx} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-5 transition hover:shadow-md hover:bg-white hover:border-slate-200">
                                                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-orange-500 bg-orange-50 border border-orange-100">
                                                    <ItemIcon size={24} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-[15px] font-black text-slate-900 truncate">{title as string}</h3>
                                                    <p className="mt-1 text-[13px] font-medium text-slate-500 leading-snug">{desc as string}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Test Series Structure */}
                            <div className="w-full min-w-0 max-w-full">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                                    <div>
                                        <h2 className="text-[24px] font-black tracking-tight text-slate-900 sm:text-[28px]">
                                            Test Series Structure
                                        </h2>
                                        <p className="text-[15px] text-slate-500 mt-1">A carefully planned test series to cover the entire {baseSeries.category} Prelims syllabus.</p>
                                    </div>
                                    <button
                                        onClick={expandAllSyllabus}
                                        className="text-[13px] font-bold text-blue-600 hover:text-blue-700 hover:underline transition"
                                    >
                                        {openSyllabus.length === testStructureData.length ? "Collapse All" : "Expand All"}
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3 w-full mt-6">
                                    {testStructureData.map((item) => {
                                        const isOpen = openSyllabus.includes(item.id);
                                        return (
                                            <div key={item.id} className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white transition-all shadow-sm hover:border-slate-300">
                                                <button
                                                    onClick={() => toggleSyllabus(item.id)}
                                                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left transition"
                                                >
                                                    <div className="flex items-center gap-4 min-w-0 pr-4">
                                                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50/80 text-[14px] font-black text-blue-600 border border-blue-100">
                                                            {item.id}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="text-[15px] font-black text-slate-900 truncate">{item.title}</h3>
                                                            <p className="mt-1 text-[13px] font-medium text-slate-500 truncate">{item.details}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <span className="hidden sm:block text-[13px] font-bold text-blue-600">View Tests</span>
                                                        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                                    </div>
                                                </button>
                                                {isOpen && (
                                                    <div className="border-t border-slate-100 bg-slate-50 p-5 text-[14px] text-slate-600">
                                                        <ul className="list-inside list-disc space-y-2 font-medium pl-2">
                                                            <li>Detailed coverage of {item.title.toLowerCase()}.</li>
                                                            <li>Performance analytics and all-India ranking included.</li>
                                                            <li>Video discussions for complex topics.</li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - STICKY SIDEBAR */}
                        <div className="w-full 2xl:w-[360px] max-w-full shrink-0 relative">
                            <div className="sticky top-[100px] flex flex-col gap-6 w-full max-w-full min-w-0">

                                {/* Pricing Card */}
                                <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 overflow-hidden w-full max-w-full min-w-0">
                                    <div className="bg-red-50 px-5 py-3 flex items-center justify-between border-b border-red-100 flex-wrap gap-2">
                                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-red-600">
                                            🔥 Limited Time Offer
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-500">
                                            <Clock4 size={14} /> Offer ends in 5 days
                                        </div>
                                    </div>

                                    <div className="p-5 sm:p-6 w-full">
                                        <div className="flex flex-wrap items-end gap-x-3 gap-y-1 mb-6 w-full">
                                            <span className="text-[36px] font-black leading-none text-slate-900">
                                                ₹{baseSeries.price.toLocaleString("en-IN")}
                                            </span>
                                            <del className="text-[15px] font-semibold text-slate-400 mb-1">
                                                ₹{baseSeries.oldPrice.toLocaleString("en-IN")}
                                            </del>
                                            <span className="rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-black text-emerald-700 mb-1 ml-auto shrink-0">
                                                {baseSeries.discount}% OFF
                                            </span>
                                        </div>

                                        <button className="w-full flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 text-[15px] font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 mb-4">
                                            Enroll Now <ArrowRight size={16} />
                                        </button>

                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <button className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-[12px] sm:text-[13px] font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 min-w-0 px-2">
                                                <ShoppingCart size={16} className="shrink-0" /> <span className="truncate">Add to Cart</span>
                                            </button>
                                            <button className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-[12px] sm:text-[13px] font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 min-w-0 px-2">
                                                <Download size={16} className="shrink-0" /> <span className="truncate">Brochure</span>
                                            </button>
                                        </div>

                                        <div className="space-y-3 pt-5 border-t border-slate-100">
                                            {[
                                                "Access for 12 Months",
                                                `${baseSeries.tests} (Full-length + Sectional)`,
                                                "Detailed Solutions (Video + PDF)",
                                                "All India Ranking",
                                                "Performance Analytics",
                                                "Access on Web, Android & iOS",
                                                "Certificate of Completion"
                                            ].map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-2.5 min-w-0">
                                                    <div className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-slate-300 text-slate-400 mt-0.5">
                                                        <Check size={10} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-[13px] font-medium text-slate-600 leading-tight">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Mini Faculty Grid */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm w-full">
                                    <div className="flex items-center gap-2 text-[14px] font-bold text-slate-800 mb-5">
                                        Course by <span className="text-orange-600 text-[15px]">🔥</span> SadhyamIAS
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
                                        {facultyMembers.map((f) => (
                                            <div key={f.id} className="flex flex-col items-center text-center group cursor-pointer w-full min-w-0">
                                                <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-slate-200 overflow-hidden mb-2 group-hover:border-orange-400 transition shrink-0">
                                                    <img src={f.image} alt={f.name} className="block h-full w-full max-w-full object-cover object-top" />
                                                    <div className="absolute bottom-0 right-0 grid h-[18px] w-[18px] place-items-center rounded-full bg-slate-900 border-2 border-white z-10 transition group-hover:bg-orange-500">
                                                        <Play size={8} fill="white" className="text-white ml-0.5" />
                                                    </div>
                                                </div>
                                                <span className="text-[10px] sm:text-[11px] font-black text-slate-900 leading-tight mb-0.5 truncate w-full">{f.name}</span>
                                                <span className="text-[9px] font-medium text-slate-500 truncate w-full">{f.subject.split('&')[0]}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/faculty" className="mt-5 flex items-center justify-center gap-1.5 text-[12px] font-bold text-orange-500 border border-orange-200 rounded-lg py-2 hover:bg-orange-50 transition">
                                        View All Faculty <ArrowRight size={14} />
                                    </Link>
                                </div>

                                {/* Need Help Block */}
                                <div className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm w-full flex items-stretch min-h-[140px]">
                                    <div className="w-[120px] shrink-0 bg-slate-50 relative overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80" alt="Support Agent" className="absolute inset-0 h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0 p-5 flex flex-col justify-center bg-slate-50/50">
                                        <h4 className="text-[16px] font-black leading-tight text-slate-900 mb-1">
                                            Need Help?
                                        </h4>
                                        <p className="text-[12px] font-medium text-slate-500 mb-4">Talk to our counsellors for personalised guidance.</p>
                                        <div className="flex flex-col gap-2">
                                            <button className="flex h-9 items-center justify-center gap-1.5 rounded-md bg-orange-500 text-[12px] font-bold text-white shadow-sm hover:bg-orange-600 transition min-w-0">
                                                <Phone size={14} className="shrink-0" /> Talk to Expert
                                            </button>
                                            <button className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-emerald-500 text-[12px] font-bold text-emerald-600 hover:bg-emerald-50 transition min-w-0 bg-white">
                                                <MessageCircle size={14} className="shrink-0" /> Chat on WhatsApp
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* FULL WIDTH SECTION: Why Take This Test Series? */}
                <section className="w-full bg-orange-50/50 py-16 border-y border-orange-100/50">
                    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8">
                        <SectionHeading
                            title={<>Why Take <span className="text-orange-500">This Test Series?</span></>}
                            description="Get the most out of your preparation with features designed for success."
                        />

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full mt-10">
                            {[
                                {
                                    icon: Target,
                                    title: "Real Exam Experience",
                                    desc: `Same pattern, difficulty level and interface as actual ${baseSeries.category} Prelims.`,
                                    color: "blue"
                                },
                                {
                                    icon: BarChart3,
                                    title: "Performance Analytics",
                                    desc: "Detailed analysis with strengths, weaknesses and subject-wise breakdown.",
                                    color: "emerald"
                                },
                                {
                                    icon: Trophy,
                                    title: "All India Ranking",
                                    desc: "Compare your performance with thousands of aspirants across India.",
                                    color: "orange"
                                },
                                {
                                    icon: MessageCircle,
                                    title: "Expert Discussion",
                                    desc: "Detailed video solutions and live doubt clearing sessions.",
                                    color: "indigo"
                                }
                            ].map((item, idx) => {
                                const ItemIcon = item.icon as any;
                                return (
                                    <div key={idx} className="flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition group">
                                        <div className={`h-32 w-full bg-${item.color}-50 flex items-center justify-center relative overflow-hidden group-hover:bg-${item.color}-100 transition-colors`}>
                                            <ItemIcon size={48} className={`text-${item.color}-500/80 drop-shadow-sm transition-transform duration-500 group-hover:scale-110`} strokeWidth={1.5} />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-[16px] font-black text-slate-900 mb-2">{item.title}</h3>
                                            <p className="text-[14px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* FULL WIDTH SECTION: Test Schedule Carousel */}
                <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8 py-16 relative">
                    <SectionHeading
                        title="Test Schedule"
                        description="Check the complete schedule of upcoming tests."
                        action="View Full Schedule"
                    />

                    <div className="relative w-full group mt-6">
                        <button className="absolute left-0 lg:-left-5 top-1/2 -translate-y-1/2 z-10 hidden h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md 2xl:grid hover:bg-slate-50 transition">
                            <ChevronLeft size={22} />
                        </button>
                        <button className="absolute right-0 lg:-right-5 top-1/2 -translate-y-1/2 z-10 hidden h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md 2xl:grid hover:bg-slate-50 transition">
                            <ChevronRight size={22} />
                        </button>

                        <div className="flex max-w-full overflow-x-auto gap-5 pb-6 no-scrollbar snap-x w-full min-w-0">
                            {scheduleData.map((schedule) => (
                                <article key={schedule.id} className="w-[280px] shrink-0 snap-start flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm p-6 hover:-translate-y-1 hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-600">
                                            {schedule.status}
                                        </span>
                                    </div>
                                    <h4 className="text-[16px] font-black text-slate-900 leading-tight mb-1">{schedule.title}</h4>
                                    <p className="text-[13px] font-medium text-slate-500 mb-6">{schedule.subtitle}</p>

                                    <div className="space-y-3 mb-6 mt-auto">
                                        <div className="flex items-center gap-2.5 text-[13px] font-bold text-slate-700">
                                            <Calendar size={16} className="text-orange-500" />
                                            {schedule.date}
                                        </div>
                                        <div className="flex items-center gap-2.5 text-[13px] font-bold text-slate-700">
                                            <Clock3 size={16} className="text-orange-500" />
                                            {schedule.time}
                                        </div>
                                    </div>

                                    <button className="w-full py-2.5 rounded-lg bg-orange-500 text-white text-[13px] font-bold hover:bg-orange-600 transition shadow-sm">
                                        View Details
                                    </button>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Student Reviews (Full Width Container) */}
                <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8 pb-16">
                    <SectionHeading
                        title={<>Student <span className="text-orange-500">Reviews</span></>}
                        description="See what our learners have to say about this test series."
                        action="View All Reviews"
                    />

                    <div className="relative w-full group">
                        <button className="absolute left-0 lg:-left-5 top-1/2 -translate-y-1/2 z-10 hidden h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md 2xl:grid hover:bg-slate-50 transition">
                            <ChevronLeft size={22} />
                        </button>
                        <button className="absolute right-0 lg:-right-5 top-1/2 -translate-y-1/2 z-10 hidden h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md 2xl:grid hover:bg-slate-50 transition">
                            <ChevronRight size={22} />
                        </button>

                        <div className="grid gap-6 md:grid-cols-3 w-full min-w-0">
                            {testimonials.map(({ name, exam, quote, image }) => (
                                <article
                                    className="flex min-w-0 max-w-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition w-full"
                                    key={name}
                                >
                                    <div className="flex gap-4">
                                        <Quote className="h-8 w-8 text-slate-200 fill-current shrink-0" />
                                        <p className="min-h-[60px] text-[13px] sm:text-[14px] leading-[1.6] text-slate-600 italic font-medium">"{quote}"</p>
                                    </div>

                                    <div className="flex items-center gap-3 sm:gap-4 pt-6 mt-4 border-t border-slate-100 min-w-0">
                                        <img src={image} alt={name} className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full object-cover border border-slate-200" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex text-orange-400 mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} fill="currentColor" />
                                                ))}
                                            </div>
                                            <strong className="block text-[14px] sm:text-[15px] font-black text-slate-900 truncate leading-tight">{name}</strong>
                                            <span className="block text-[11px] sm:text-[12px] font-semibold text-slate-500 truncate">{exam}</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bottom Section: FAQs & Sample Test/Banner Split */}
                <section className="w-full bg-slate-50/70 border-t border-slate-200 py-16">
                    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8">
                        <div className="flex flex-col lg:flex-row gap-12 items-start w-full min-w-0">

                            {/* FAQ Accordion - Left Side */}
                            <div className="flex-1 w-full min-w-0">
                                <SectionHeading
                                    title={<>Frequently <span className="text-orange-500">Asked Questions</span></>}
                                    description="Get answers to common questions about this test series."
                                    action="View All FAQs"
                                />

                                <div className="flex flex-col gap-3 w-full">
                                    {faqs.map((faq, index) => {
                                        const isOpen = openFaq === index;
                                        return (
                                            <div key={index} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all w-full">
                                                <button
                                                    onClick={() => setOpenFaq(isOpen ? null : index)}
                                                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left transition hover:bg-slate-50"
                                                >
                                                    <div className="flex items-center gap-4 min-w-0 pr-4">
                                                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-[13px] font-black text-blue-600">
                                                            {index + 1}
                                                        </div>
                                                        <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-900 pr-2">{faq.q}</h3>
                                                    </div>
                                                    <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                                </button>
                                                {isOpen && (
                                                    <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-5 pl-[64px] sm:pl-[68px] text-[13px] sm:text-[14px] text-slate-600 font-medium w-full">
                                                        {faq.a}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Download Sample & Journey Banner - Right Side */}
                            <div className="w-full lg:w-[380px] xl:w-[420px] lg:mt-[96px] flex flex-col gap-6 shrink-0 relative">

                                {/* Download Sample Test Card */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm w-full">
                                    <h3 className="text-[18px] sm:text-[20px] font-black text-slate-900 mb-2">Download Free Sample Test</h3>
                                    <p className="text-[13px] sm:text-[14px] text-slate-500 mb-6 font-medium leading-relaxed">
                                        Get a feel of our test series quality with a free sample test.
                                    </p>
                                    <button className="flex w-full h-12 items-center justify-center gap-2 rounded-lg border-2 border-orange-500 text-[14px] sm:text-[15px] font-bold text-orange-500 hover:bg-orange-50 transition min-w-0">
                                        <Download size={18} className="shrink-0" /> <span className="truncate">Download Sample Test</span>
                                    </button>
                                </div>

                                {/* Journey Banner */}
                                <div className="rounded-2xl overflow-hidden relative bg-orange-50 border border-orange-100 shadow-sm w-full min-h-[180px] flex items-center p-6">
                                    <div className="relative z-10 w-[65%] pr-4">
                                        <h4 className="text-[18px] sm:text-[22px] font-black leading-tight text-slate-900 mb-4">
                                            Join Thousands of Aspirants in Their <span className="text-orange-500">Success Journey</span>
                                        </h4>
                                        <button className="h-10 rounded-lg bg-orange-500 px-6 text-[14px] font-bold text-white shadow-sm hover:bg-orange-600 transition flex items-center gap-2">
                                            Enroll Now <ArrowRight size={16} />
                                        </button>
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80" alt="Students" className="absolute right-[-10%] bottom-0 h-[140px] w-auto object-contain mix-blend-multiply opacity-90" />
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="w-full bg-[#021424] py-12 text-white shrink-0 mt-0">
                <div className="w-full max-w-[1400px] mx-auto grid gap-10 px-4 sm:px-6 lg:px-10 sm:grid-cols-2 2xl:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
                    <div className="min-w-0">
                        <Brand dark />
                        <p className="mt-5 max-w-[300px] text-[14px] leading-[1.6] font-medium text-slate-400">
                            Your trusted partner for competitive exam preparation. Quality content, expert guidance and real practice for your success.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-4 text-slate-400">
                            <a href="#" aria-label="YouTube" className="hover:text-white transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1c.1-1.4 1.2-2.6 2.7-2.7C8.6 4 12 4 12 4s3.4 0 6.8.4c1.5.1 2.6 1.3 2.7 2.7.4 3.2.4 4.9.4 4.9s0 1.7-.4 4.9c-.1 1.4-1.2 2.6-2.7 2.7-3.4.4-6.8.4-6.8.4s-3.4 0-6.8-.4c-1.5-.1-2.6-1.3-2.7-2.7C2 13.8 2 12.1 2 12.1s0-1.7.5-4.9z" /><path d="M9.8 15.5l5.5-3.4-5.5-3.4v6.8z" /></svg>
                            </a>
                            <a href="#" aria-label="Telegram" className="hover:text-white transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" /></svg>
                            </a>
                            <a href="#" aria-label="Instagram" className="hover:text-white transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                            </a>
                            <a href="#" aria-label="Twitter" className="hover:text-white transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                            </a>
                            <a href="#" aria-label="Facebook" className="hover:text-white transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                            <a href="#" aria-label="LinkedIn" className="hover:text-white transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                            </a>
                        </div>
                    </div>

                    <FooterColumn
                        title="Quick Links"
                        links={["About Us", "Courses", "Test Series", "Study Material", "Faculty", "Results", "Contact Us"]}
                    />
                    <FooterColumn
                        title="Popular Exams"
                        links={["UPSC", "UPPSC", "UKPSC", "RAS", "SSC", "Defense", "Other Exams"]}
                    />
                    <FooterColumn
                        title="Support"
                        links={["Help Center", "FAQs", "Refund Policy", "Terms & Conditions", "Privacy Policy"]}
                    />

                    <div className="min-w-0">
                        <h4 className="text-[16px] font-extrabold text-white">Download Our App</h4>
                        <p className="mt-3 text-[13px] font-medium text-slate-400">Learn anytime, anywhere.</p>
                        <div className="mt-5 flex flex-col sm:flex-row lg:flex-col gap-3">
                            <div className="flex w-full max-w-[160px] cursor-pointer items-center gap-3 rounded-lg border border-slate-800 bg-black px-4 py-2.5 transition hover:bg-slate-900">
                                <Play className="h-6 w-6 text-white shrink-0" fill="currentColor" />
                                <div className="min-w-0">
                                    <div className="text-[9px] uppercase tracking-wider text-slate-400 truncate">GET IT ON</div>
                                    <div className="text-[14px] font-bold text-white truncate">Google Play</div>
                                </div>
                            </div>
                            <div className="flex w-full max-w-[160px] cursor-pointer items-center gap-3 rounded-lg border border-slate-800 bg-black px-4 py-2.5 transition hover:bg-slate-900">
                                <span className="text-[24px] leading-none mb-1.5 shrink-0"></span>
                                <div className="min-w-0">
                                    <div className="text-[9px] uppercase tracking-wider text-slate-400 truncate">Download on the</div>
                                    <div className="text-[14px] font-bold text-white truncate">App Store</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
    return (
        <div className="min-w-0">
            <h4 className="text-[16px] font-extrabold text-white truncate">{title}</h4>
            <div className="mt-5 space-y-3">
                {links.map((x) => (
                    <Link key={x} href="#" className="block text-[14px] font-medium text-slate-400 transition hover:text-white truncate">
                        {x}
                    </Link>
                ))}
            </div>
        </div>
    );
}