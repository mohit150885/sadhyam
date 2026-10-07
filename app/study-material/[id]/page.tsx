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
    CloudDownload,
    Download,
    FileText,
    Menu,
    Mic,
    Network,
    Play,
    Quote,
    RefreshCw,
    Search,
    ShieldCheck,
    ShoppingCart,
    Smartphone,
    Star,
    Target,
    Timer,
    Trophy,
    X,
    Clock4,
    Files,
    PenTool,
    BarChart3
} from "lucide-react";
import Link from "next/link";

// --- Mock Database ---
const studyMaterials = [
    {
        id: 1,
        title: "Complete UPSC Study Material",
        category: "UPSC",
        pages: "12,000+",
        rating: 4.8,
        reviews: "4.2k",
        price: 2499,
        oldPrice: 3999,
        discount: 37,
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=85",
        tags: ["UPSC", "PDF Notes + Current Affairs"],
    },
    {
        id: 2,
        title: "UPPSC Complete Study Material",
        category: "UPPSC",
        pages: "9,500+",
        rating: 4.7,
        reviews: "2.1k",
        price: 1999,
        oldPrice: 3499,
        discount: 42,
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=85",
        tags: ["UPPSC", "State Specific + PDF Notes"],
    }
];

const subjectsData = [
    { id: 1, title: "Indian Polity", details: "12 PDFs • 850+ Pages" },
    { id: 2, title: "Modern History", details: "14 PDFs • 900+ Pages" },
    { id: 3, title: "Ancient & Medieval History", details: "12 PDFs • 780+ Pages" },
    { id: 4, title: "Geography", details: "16 PDFs • 950+ Pages" },
    { id: 5, title: "Indian Economy", details: "14 PDFs • 820+ Pages" },
    { id: 6, title: "Environment & Ecology", details: "10 PDFs • 600+ Pages" },
    { id: 7, title: "Science & Technology", details: "10 PDFs • 550+ Pages" },
    { id: 8, title: "Current Affairs", details: "Monthly PDFs • Year-wise Compilation" },
    { id: 9, title: "Ethics, Essay & Answer Writing", details: "12 PDFs • 700+ Pages" },
];

const samplePages = [
    { id: 1, title: "Polity - Sample Notes", details: "18 Pages • PDF", image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Economy - Sample Notes", details: "16 Pages • PDF", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "Geography - Sample Notes", details: "20 Pages • PDF", image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "Current Affairs - Sample", details: "12 Pages • PDF", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80" },
];

const testimonials = [
    {
        name: "Aditi Sharma",
        exam: "UPSC CSE 2023",
        quote: "The notes are concise, exam-oriented and cover all important topics. Helped me a lot in both Prelims and Mains.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    },
    {
        name: "Rohit Yadav",
        exam: "UPSC 2023",
        quote: "The current affairs compilation is excellent. The material is well-structured and easy to revise.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
    },
    {
        name: "Neha Joshi",
        exam: "UPSC CSE 2022",
        quote: "Best study material for serious aspirants. The diagrams, charts and examples make concepts very clear.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
    }
];

const faqs = [
    { q: "Is the study material updated regularly?", a: "Yes, the study material is updated monthly with the latest current affairs and syllabus changes." },
    { q: "Will I get access on mobile?", a: "Absolutely. You can access and read all PDFs seamlessly on our Web, Android, and iOS apps." },
    { q: "Is it enough for Prelims and Mains?", a: "Yes, the content is comprehensively designed to cover both Prelims and Mains examinations." },
    { q: "Can I download the PDFs?", a: "Yes, you can download the PDFs for offline reading within our application." },
    { q: "Is there any refund policy?", a: "We offer a 7-day refund policy if you are not completely satisfied with the material." },
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

function SectionHeading({ title, description, action }: { title: ReactNode; description: string; action?: ReactNode; }) {
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
                <div className="hidden sm:block shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
}

export default function StudyMaterialDetailsPage() {
    // Dynamic Routing Parameters
    const params = useParams();
    const currentId = Number(params?.id) || 1;
    const material = studyMaterials.find(m => m.id === currentId) || studyMaterials[0];

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

    return (
        <div className="relative min-h-screen w-full max-w-[100vw] flex flex-col overflow-x-clip bg-white text-slate-900 font-sans">
            {/* HEADER - Main Courses Page Navbar Format */}
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
                            src={material.image}
                            alt="Study Material Background"
                            className="block h-full w-full max-w-full object-cover object-center opacity-30 mix-blend-luminosity"
                        />
                    </div>
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#021424]/95 via-[#021424]/80 to-[#021424]/20" />

                    <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8 py-10">
                        <div className="max-w-[800px] text-white">
                            <div className="mb-5 flex flex-wrap gap-2 text-[12px] font-medium text-white/70">
                                {["Home", "Study Material", material.category, material.title].map((crumb, idx) => (
                                    <span key={idx} className="flex items-center gap-2">
                                        <span className={idx === 3 ? "text-white font-bold" : ""}>{crumb}</span>
                                        {idx < 3 && <span>›</span>}
                                    </span>
                                ))}
                            </div>

                            <div className="mb-5 flex flex-wrap gap-3">
                                <span className="inline-flex rounded-md bg-white px-2.5 py-1 text-[11px] font-black text-slate-800 shadow-sm">
                                    {material.category}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/20 px-2.5 py-1 text-[11px] font-bold text-red-100 shadow-sm backdrop-blur-md">
                                    <FileText size={12} className="text-red-400" fill="currentColor" />
                                    {material.tags[1]}
                                </span>
                            </div>

                            <h1 className="text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl lg:text-[56px] max-w-[750px] mb-4">
                                {material.title.replace("Study Material", "")}
                                <span className="text-orange-500 block sm:inline">Study Material</span>
                            </h1>

                            <p className="mt-4 max-w-[650px] text-[15px] sm:text-[17px] font-medium leading-relaxed text-white/90">
                                Comprehensive, updated and exam-focused study material curated by expert faculty to help you prepare smartly for {material.category} CSE.
                            </p>

                            <div className="mt-10 flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-6 text-[13px] font-semibold text-white/90">
                                {[
                                    [FileText, `${material.pages}`, "Pages of Notes"],
                                    [BookOpen, "Subject-wise", "PDFs"],
                                    [RefreshCw, "Regular", "Updates"],
                                    [CloudDownload, "Download &", "Read Offline"],
                                    [Target, `${material.category} Focused`, "& Exam-Oriented"],
                                ].map(([Icon, line1, line2], idx) => {
                                    const StatIcon = Icon as any;
                                    return (
                                        <div key={idx} className="flex items-center gap-3">
                                            <StatIcon className="h-7 w-7 text-orange-500 shrink-0" strokeWidth={1.5} />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[14px] font-black text-white leading-tight">{line1 as string}</span>
                                                <span className="text-[12px] font-medium text-white/70 leading-tight mt-0.5">{line2 as string}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Decor Image - Right Side */}
                        <div className="hidden lg:flex flex-col items-center absolute right-[5%] top-1/2 -translate-y-1/2 z-20 pointer-events-none opacity-90">
                            <div className="rotate-[-6deg] font-serif text-[42px] italic leading-[1.1] text-slate-200/90 text-right drop-shadow-xl mb-4">
                                Sapna <br /> Taiyaari <br /> Prayas <br />
                                <span className="text-orange-400">Seva</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STICKY NAV TABS */}
                <section className={`w-full border-b border-slate-200 bg-white/95 backdrop-blur-md sticky z-40 shadow-sm transition-[top] duration-300 ease-in-out ${showNavbar ? "top-[64px] sm:top-[70px]" : "top-0"}`}>
                    <div className="w-full max-w-[1400px] max-w-[100vw] mx-auto flex gap-6 overflow-x-auto px-4 sm:px-5 lg:px-6 2xl:px-8 no-scrollbar">
                        {["Overview", "Subjects", "Sample Notes", "Features", "Reviews", "FAQs"].map((tab) => (
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
                    <div className="flex flex-col lg:flex-row gap-8 2xl:gap-12 items-start w-full min-w-0">

                        {/* LEFT COLUMN - CONTENT */}
                        <div className="flex-1 w-full min-w-0 flex flex-col gap-12">

                            {/* Why Choose Our Study Material */}
                            <div className="w-full min-w-0 max-w-full">
                                <SectionHeading
                                    title={<>Why Choose Our <span className="text-orange-500">Study Material?</span></>}
                                    description="Well-structured, exam-oriented and regularly updated content to make your UPSC preparation more effective."
                                />

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {[
                                        [FileText, "Complete Coverage", "Detailed notes for Prelims, Mains & Essay", "orange"],
                                        [RefreshCw, "Regular Updates", "Current affairs and latest developments included", "blue"],
                                        [ShieldCheck, "Expert Verified", "Curated by experienced faculty and toppers", "emerald"],
                                        [Smartphone, "Easy to Access", "Download and read offline on any device", "red"],
                                    ].map(([Icon, title, desc, color], idx) => {
                                        const ItemIcon = Icon as any;
                                        return (
                                            <div key={idx} className="flex flex-col items-center text-center gap-3 rounded-xl border border-slate-200 bg-white p-6 transition hover:shadow-md">
                                                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-${color}-500 bg-${color}-50 mb-2`}>
                                                    <ItemIcon size={28} strokeWidth={1.5} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-[15px] font-black text-slate-900 mb-1.5">{title as string}</h3>
                                                    <p className="text-[13px] font-medium text-slate-500 leading-snug">{desc as string}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Subjects Covered Accordion */}
                            <div className="w-full min-w-0 max-w-full">
                                <div className="mb-6">
                                    <h2 className="text-[24px] font-black tracking-tight text-slate-900 sm:text-[28px]">
                                        Subjects <span className="text-orange-500">Covered</span>
                                    </h2>
                                    <p className="text-[15px] text-slate-500 mt-1">Get complete study material for all major {material.category} subjects.</p>
                                </div>

                                <div className="flex flex-col gap-3 w-full">
                                    {subjectsData.map((item) => {
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
                                                        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                                    </div>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Sample Pages Carousel */}
                            <div className="w-full min-w-0 max-w-full pt-4">
                                <SectionHeading
                                    title={<>Sample <span className="text-orange-500">Pages</span></>}
                                    description="Preview the quality and structure of our study material."
                                    action={
                                        <Link href="#" className="flex items-center gap-1 text-[14px] font-bold text-blue-600 hover:text-blue-700 transition">
                                            View More Samples <ArrowRight size={16} />
                                        </Link>
                                    }
                                />

                                <div className="relative w-full group mt-2">
                                    <button className="absolute left-0 lg:-left-5 top-1/2 -translate-y-1/2 z-10 hidden h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md lg:grid hover:bg-slate-50 transition">
                                        <ChevronLeft size={22} />
                                    </button>
                                    <button className="absolute right-0 lg:-right-5 top-1/2 -translate-y-1/2 z-10 hidden h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md lg:grid hover:bg-slate-50 transition">
                                        <ChevronRight size={22} />
                                    </button>

                                    <div className="flex max-w-full overflow-x-auto gap-5 pb-6 no-scrollbar snap-x w-full min-w-0">
                                        {samplePages.map((sample) => (
                                            <article key={sample.id} className="w-[260px] sm:w-[280px] shrink-0 snap-start flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm p-4 hover:-translate-y-1 hover:shadow-md transition">
                                                <div className="relative h-[180px] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 mb-4">
                                                    <img src={sample.image} alt={sample.title} className="h-full w-full object-cover object-top mix-blend-multiply opacity-90" />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <h4 className="text-[15px] font-black text-slate-900 leading-tight truncate mb-1">{sample.title}</h4>
                                                    <p className="text-[12px] font-medium text-slate-500 mb-4">{sample.details}</p>
                                                    <button className="mt-auto w-full py-2.5 rounded-lg border-2 border-orange-500 text-orange-500 text-[13px] font-bold hover:bg-orange-50 transition flex items-center justify-center gap-1.5">
                                                        View Sample <ArrowRight size={14} />
                                                    </button>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN - STICKY SIDEBAR */}
                        <div className="w-full lg:w-[340px] xl:w-[360px] 2xl:w-[380px] max-w-full shrink-0 relative">
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
                                                ₹{material.price.toLocaleString("en-IN")}
                                            </span>
                                            <del className="text-[15px] font-semibold text-slate-400 mb-1">
                                                ₹{material.oldPrice.toLocaleString("en-IN")}
                                            </del>
                                            <span className="rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-black text-emerald-700 mb-1 ml-auto shrink-0">
                                                {material.discount}% OFF
                                            </span>
                                        </div>

                                        <button className="w-full flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 text-[15px] font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 mb-4">
                                            Buy Now <ArrowRight size={16} />
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
                                                "12+ Months Validity",
                                                "Access on Web, Android & iOS",
                                                "Regular Content Updates",
                                                "Chapter-wise & Topic-wise PDFs",
                                                "Includes Current Affairs",
                                                "Download & Read Offline"
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

                                {/* Also Includes Grid */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm w-full">
                                    <div className="flex items-center gap-2 text-[16px] font-black text-slate-900 mb-4">
                                        Also Includes
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 w-full">
                                        {[
                                            [Network, "Mind Maps", "blue"],
                                            [FileText, "Quick Revision Notes", "emerald"],
                                            [Files, "Previous Year Compilations", "orange"],
                                            [PenTool, "Essay Material", "purple"]
                                        ].map(([Icon, label, color], idx) => {
                                            const ItemIcon = Icon as any;
                                            return (
                                                <div key={idx} className="flex flex-col items-center justify-center text-center p-4 rounded-xl border border-slate-100 bg-slate-50 group hover:border-slate-200 transition">
                                                    <div className={`text-${color}-500 mb-2 transition-transform group-hover:scale-110`}>
                                                        <ItemIcon size={24} strokeWidth={1.5} />
                                                    </div>
                                                    <span className="text-[12px] font-bold text-slate-700 leading-tight">{label as string}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Promo Banner */}
                                <div className="rounded-xl overflow-hidden bg-orange-50 border border-orange-100 shadow-sm w-full flex items-center p-5 relative min-h-[160px]">
                                    <div className="relative z-10 w-[60%]">
                                        <h4 className="text-[16px] font-black leading-tight text-slate-900 mb-2">
                                            Take Your Preparation Anywhere
                                        </h4>
                                        <p className="text-[12px] font-medium text-slate-600 mb-4">Access study material on web, Android & iOS with offline download.</p>
                                        <button className="h-9 rounded-md bg-orange-500 px-4 text-[12px] font-bold text-white shadow-sm hover:bg-orange-600 transition flex items-center gap-1.5">
                                            Get Started <ArrowRight size={14} />
                                        </button>
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=300&q=80" alt="App Preview" className="absolute right-[-10%] bottom-[-10%] h-[150px] w-auto object-contain mix-blend-multiply opacity-90 rounded-xl" />
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* FULL WIDTH SECTION: Key Benefits */}
                <section className="w-full bg-orange-50/50 py-12 border-y border-orange-100/50 relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                        <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80" alt="Mountain Decor" className="h-[200px] mix-blend-multiply" />
                    </div>
                    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8 relative z-10">
                        <div className="mb-10">
                            <h2 className="text-[24px] sm:text-[28px] font-black text-slate-900 leading-tight">Key <span className="text-orange-500">Benefits</span></h2>
                            <p className="text-[15px] font-medium text-slate-600 mt-2">Study material designed to help you prepare better, faster and smarter.</p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
                            {[
                                { icon: Target, title: "Exam-Oriented Content", desc: "Focus on what actually matters for UPSC.", color: "red" },
                                { icon: BarChart3, title: "Better Retention & Revision", desc: "Concise notes, mind maps and summary charts.", color: "emerald" },
                                { icon: Timer, title: "Saves Time", desc: "Well-structured material so you can focus on practice.", color: "indigo" },
                                { icon: Trophy, title: "Trusted by Toppers", desc: "Same study material used by successful aspirants.", color: "orange" }
                            ].map((item, idx) => {
                                const ItemIcon = item.icon as any;
                                return (
                                    <div key={idx} className="flex items-start gap-4 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
                                        <div className={`grid h-12 w-12 place-items-center rounded-full bg-${item.color}-50 text-${item.color}-500 shrink-0`}>
                                            <ItemIcon size={24} strokeWidth={2} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[15px] font-black text-slate-900 mb-1">{item.title}</h3>
                                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Bottom Section: Reviews & FAQs Split */}
                <section className="w-full bg-white py-16">
                    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start w-full min-w-0">

                            {/* Reviews - Left Side */}
                            <div className="w-full min-w-0 flex flex-col">
                                <SectionHeading
                                    title={<>Student <span className="text-orange-500">Reviews</span></>}
                                    description="See what our learners have to say about our study material."
                                    action={
                                        <Link href="#" className="flex items-center gap-1 text-[13px] font-bold text-blue-600 hover:text-blue-700 transition">
                                            View All Reviews <ArrowRight size={14} />
                                        </Link>
                                    }
                                />

                                <div className="grid gap-5 sm:grid-cols-2 w-full mt-2">
                                    {testimonials.slice(0, 4).map(({ name, exam, quote, image }, idx) => (
                                        <article
                                            className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm transition hover:shadow-md hover:bg-white w-full"
                                            key={idx}
                                        >
                                            <div className="flex gap-4">
                                                <Quote className="h-8 w-8 text-slate-300 fill-current shrink-0" />
                                                <p className="min-h-[70px] text-[13px] leading-[1.6] text-slate-600 italic font-medium">"{quote}"</p>
                                            </div>

                                            <div className="flex items-center gap-3 pt-5 mt-3 border-t border-slate-100 min-w-0">
                                                <img src={image} alt={name} className="h-10 w-10 shrink-0 rounded-full object-cover border border-slate-200" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex text-orange-400 mb-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={10} fill="currentColor" />
                                                        ))}
                                                    </div>
                                                    <strong className="block text-[14px] font-black text-slate-900 truncate leading-tight">{name}</strong>
                                                    <span className="block text-[11px] font-semibold text-slate-500 truncate">{exam}</span>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>

                            {/* FAQs - Right Side */}
                            <div className="w-full min-w-0 flex flex-col">
                                <SectionHeading
                                    title={<>Frequently <span className="text-orange-500">Asked Questions</span></>}
                                    description="Get answers to common questions about our study material."
                                />

                                <div className="flex flex-col gap-3 w-full mt-2">
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

                        </div>
                    </div>
                </section>

                {/* Bottom CTA Banner */}
                <section className="w-full bg-orange-50 border-t border-orange-100 overflow-hidden relative">
                    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8 py-10 lg:py-0 relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:min-h-[160px]">

                        <div className="lg:w-[250px] shrink-0 hidden lg:block self-end relative top-[20px]">
                            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80" alt="Students learning" className="w-full h-auto object-contain mix-blend-multiply opacity-90" />
                        </div>

                        <div className="flex-1 flex flex-col text-center lg:text-left py-6">
                            <h2 className="text-[24px] sm:text-[28px] font-black leading-tight text-slate-900 mb-2">
                                Start Your UPSC Preparation <span className="text-orange-500">Today</span>
                            </h2>
                            <p className="text-[14px] sm:text-[15px] text-slate-600 font-medium max-w-[500px] mx-auto lg:mx-0">
                                Get access to high-quality study material and join thousands of successful aspirants.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-end gap-4 shrink-0 lg:w-[400px] py-6">
                            <button className="flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 sm:px-8 text-[14px] sm:text-[15px] font-black text-white shadow-md hover:bg-orange-600 transition min-w-[160px]">
                                Buy Now <ArrowRight size={16} />
                            </button>
                            <button className="flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-slate-800 bg-transparent px-6 sm:px-8 text-[14px] sm:text-[15px] font-black text-slate-800 hover:bg-slate-800 hover:text-white transition min-w-[160px]">
                                <Download size={16} /> Download Brochure
                            </button>
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