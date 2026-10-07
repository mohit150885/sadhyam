"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
    ArrowRight,
    BookOpen,
    Check,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    FileText,
    GraduationCap,
    Menu,
    Mic,
    Play,
    Search,
    ShoppingCart,
    Star,
    Trophy,
    UserRound,
    Users,
    Video,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Faculty = {
    id: number;
    name: string;
    subject: string;
    experience: string;
    bullets: string[];
    image: string;
};

const subjects = [
    "All Faculty",
    "Polity",
    "Geography",
    "History",
    "Economy",
    "Environment",
    "Current Affairs",
    "Science & Tech",
    "Essay",
    "Ethics",
];

const facultyMembers: Faculty[] = [
    {
        id: 1,
        name: "Dr. A. Kumar",
        subject: "Polity & Governance",
        experience: "15+ Years Experience",
        bullets: [
            "Ex- Civil Servant",
            "5000+ Students Guided",
            "Specialist in Polity & Ethics",
            "Known for Concept Clarity",
        ],
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 2,
        name: "Prof. N. Singh",
        subject: "Geography",
        experience: "12+ Years Experience",
        bullets: [
            "NTA & State Exams Expert",
            "Maps & Diagrams Specialist",
            "Interactive Teaching Style",
            "Mentored Many Toppers",
        ],
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 3,
        name: "S. Sharma",
        subject: "History & Culture",
        experience: "10+ Years Experience",
        bullets: [
            "In-depth Subject Knowledge",
            "Story-based Learning",
            "Focus on PYQs & Trends",
            "Guided 1000+ Selections",
        ],
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 4,
        name: "R. Verma",
        subject: "Economy",
        experience: "14+ Years Experience",
        bullets: [
            "Concept-driven Approach",
            "Current Affairs Integration",
            "Simplified Economic Concepts",
            "Regular Answer Writing Practice",
        ],
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 5,
        name: "P. Mishra",
        subject: "Current Affairs",
        experience: "10+ Years Experience",
        bullets: [
            "Daily News Analysis",
            "Editorial Breakdown",
            "Exam Oriented Approach",
            "High Hit Rate in Exams",
        ],
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 6,
        name: "Dr. R. Kapoor",
        subject: "Science & Tech",
        experience: "11+ Years Experience",
        bullets: [
            "Ph.D. in Basic Sciences",
            "Simplifies Complex Tech Topics",
            "Current Affairs Linkage",
            "Focus on Mains Answer Writing",
        ],
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 7,
        name: "M. Tiwari",
        subject: "Environment",
        experience: "9+ Years Experience",
        bullets: [
            "Ecology Expert",
            "To-the-point Notes",
            "Extensive Diagram Usage",
            "Focus on Prelims MCQs",
        ],
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 8,
        name: "K. Reddy",
        subject: "Ethics & Essay",
        experience: "16+ Years Experience",
        bullets: [
            "Renowned Author",
            "Case Study Master",
            "Philosophical Approach",
            "Mentored AIR Top 10",
        ],
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    },
];

function Brand({ dark = false }: { dark?: boolean }) {
    return (
        <Link aria-label="SadhyamIAS home" className="flex shrink-0 items-center gap-2.5 no-underline" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-[26px] shadow-sm">
                🔥
            </span>
            <span className="flex flex-col">
                <strong
                    className={`text-[26px] font-black leading-none tracking-tight sm:text-[30px] ${dark ? "text-white" : "text-slate-900"
                        }`}
                >
                    SadhyamIAS
                </strong>
            </span>
        </Link>
    );
}

function SectionHeading({
    title,
    description,
    action,
}: {
    title: ReactNode;
    description: string;
    action?: string;
}) {
    return (
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
            <div>
                <h2 className="text-[28px] font-black leading-[1.15] tracking-tight text-slate-900 sm:text-[36px]">
                    {title}
                </h2>
                <p className="mt-2 text-[15px] leading-[1.45] text-slate-500 sm:text-[16px]">
                    {description}
                </p>
            </div>
            {action && (
                <Link className="hidden shrink-0 items-center gap-1.5 text-[15px] font-bold text-blue-700 sm:flex" href="#">
                    {action}
                    <ArrowRight size={14} />
                </Link>
            )}
        </div>
    );
}

export default function FacultyPage() {
    const [activeTab, setActiveTab] = useState("All Faculty");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("Experience");
    const [showNavbar, setShowNavbar] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Carousel State for Hero
    const [currentSlide, setCurrentSlide] = useState(0);
    const banners = ["/banner1.png", "/banner2.png"];

    const pathname = "/faculty";

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

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

    const filteredFaculty = useMemo(() => {
        let result = facultyMembers.filter((item) => {
            const tabMatch = activeTab === "All Faculty" || item.subject.includes(activeTab) || item.bullets.some(b => b.includes(activeTab));
            const searchMatch = !search.trim() || `${item.name} ${item.subject}`.toLowerCase().includes(search.toLowerCase());
            return tabMatch && searchMatch;
        });
        return result;
    }, [activeTab, search]);

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans">
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
                                        href={path}
                                        key={item}
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
                                placeholder="Search faculty, subjects..."
                                className="bg-transparent w-full outline-none text-slate-700"
                            />
                            <Mic className="cursor-pointer hover:text-orange-500" size={16} />
                        </div>
                        <button className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-50 transition relative">
                            <ShoppingCart size={18} />
                        </button>
                        <Link href="/login">
                            <button className="h-10 rounded-lg border-2 border-orange-500 px-5 text-[15px] font-bold text-orange-500 hover:bg-orange-50 transition">
                                Login
                            </button>
                        </Link>
                        <Link href="/signup">
                            <button className="h-10 rounded-lg bg-orange-500 px-5 text-[15px] font-bold text-white shadow-sm hover:bg-orange-600 transition">
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

            <main className="pt-[64px] sm:pt-[70px]">
                {/* Hero Section */}
                <section className="relative min-h-[350px] overflow-hidden bg-slate-900 group">
                    <div className="absolute inset-0 z-0">
                        <div
                            className="flex h-full w-full transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {banners.map((banner, index) => (
                                <div key={index} className="h-full w-full shrink-0 relative bg-[#021424]">
                                    <img
                                        src={banner}
                                        alt={`SadhyamIAS Banner ${index + 1}`}
                                        className="h-full w-full object-cover object-center opacity-50 mix-blend-luminosity"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#021424]/95 via-[#021424]/80 to-[#021424]/30" />

                    <div className="relative z-10 mx-auto flex min-h-[350px] max-w-[1400px] items-center px-6 py-10 lg:px-10">
                        <div className="max-w-[760px] text-white">
                            <div className="mb-5 inline-flex rounded-full border border-orange-500/30 bg-orange-500/20 px-3.5 py-1.5 text-[12px] sm:text-[13px] font-bold text-orange-300 shadow-sm backdrop-blur-md">
                                Learn from the Best
                            </div>

                            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                Expert <span className="text-orange-500">Faculty</span>
                            </h1>

                            <p className="mt-4 max-w-[580px] text-[15px] sm:text-[17px] font-medium leading-relaxed text-white/90">
                                Learn from experienced mentors who have guided thousands of students to success in UPSC, UPPSC and other competitive exams.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-[13px] font-semibold text-white/90">
                                {[
                                    [Users, "Experienced Mentors"],
                                    [Trophy, "Exam-Focused Teaching"],
                                    [BookOpen, "Concept Clarity & Practice Strategy"],
                                    [UserRound, "Personalised Guidance"],
                                ].map(([Icon, label]) => {
                                    const ItemIcon = Icon as any;
                                    return (
                                        <div key={label as string} className="flex items-center gap-2">
                                            <ItemIcon className="h-5 w-5 text-orange-500" />
                                            {label as string}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-orange-500 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-orange-500 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={20} />
                    </button>

                    <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 rounded-full transition-all duration-300 shadow-sm ${currentSlide === index ? "w-8 bg-orange-500" : "w-2 bg-white/40 hover:bg-white"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="border-b border-slate-100 bg-white">
                    <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-6 divide-x divide-slate-200 px-6 py-6 sm:grid-cols-3 lg:grid-cols-5 lg:px-10 lg:py-8">
                        {[
                            [Users, "50,000+", "Students Guided"],
                            [GraduationCap, "15+", "Years of Experience (Avg.)"],
                            [FileText, "1000+", "Classes Delivered"],
                            [Star, "4.8/5", "Student Rating"],
                            [Trophy, "500+", "Selections & Success Stories"],
                        ].map(([Icon, value, label]) => {
                            const StatIcon = Icon as any;
                            return (
                                <div
                                    key={label as string}
                                    className="flex min-w-0 items-center gap-3.5 px-4 first:pl-0 sm:px-6"
                                >
                                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-orange-100 bg-orange-50 text-orange-500">
                                        <StatIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="text-[20px] font-black text-slate-900 leading-none sm:text-[24px]">
                                            {value as string}
                                        </div>
                                        <div className="mt-1.5 text-[12px] font-medium text-slate-500 sm:text-[13px] leading-tight">
                                            {label as string}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Material Tabs (Sticky Navigation) */}
                <section
                    className={`border-b border-slate-200 bg-white/95 backdrop-blur-md sticky z-40 shadow-sm transition-[top] duration-300 ease-in-out ${showNavbar ? "top-[64px] sm:top-[70px]" : "top-0"
                        }`}
                >
                    <div className="mx-auto flex max-w-[1400px] items-center gap-3 overflow-x-auto px-6 py-4 lg:px-10 no-scrollbar">
                        {subjects.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap rounded-lg border px-6 py-2.5 text-[14px] font-bold transition ${activeTab === tab
                                    ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-orange-300 hover:text-orange-500"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                        <button className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 sm:hidden">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </section>

                {/* Faculty Catalog */}
                <section className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
                    <div className="mb-8 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
                        <div>
                            <h2 className="text-[28px] font-black leading-[1.15] tracking-tight text-slate-900 sm:text-[36px]">
                                Our Expert <span className="text-orange-500">Faculty</span>
                            </h2>
                            <p className="mt-2 text-[15px] leading-[1.45] text-slate-500 sm:text-[16px]">
                                Learn from highly experienced and dedicated mentors.
                            </p>
                        </div>
                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                            <div className="flex h-11 w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-left text-[14px] text-slate-600 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 shadow-sm sm:w-[280px]">
                                <Search className="text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search faculty by name or subject..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-transparent w-full outline-none placeholder:text-slate-400"
                                />
                            </div>
                            <div className="relative w-full sm:w-auto">
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white pl-4 pr-10 text-[14px] font-bold text-slate-700 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-sm"
                                >
                                    <option>Sort by: Experience</option>
                                    <option>Sort by: Popularity</option>
                                    <option>Sort by: Name (A-Z)</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-[14px] h-4 w-4 text-slate-500" />
                            </div>
                        </div>
                    </div>

                    {filteredFaculty.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {filteredFaculty.map((item) => (
                                <article
                                    className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                                    key={item.id}
                                >
                                    <div className="relative h-[220px] overflow-hidden bg-slate-100">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105 object-top"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                        <button className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-slate-900/40 text-white backdrop-blur-md transition hover:scale-110 hover:bg-orange-500 hover:border-orange-500">
                                            <Play className="ml-1" fill="white" size={16} />
                                        </button>
                                    </div>

                                    <div className="flex flex-1 flex-col p-5">
                                        <h3 className="text-[18px] font-black leading-[1.3] text-slate-900">
                                            {item.name}
                                        </h3>
                                        <p className="text-[13px] font-medium text-slate-500 mt-0.5">
                                            {item.subject}
                                        </p>
                                        <div className="mt-1.5 text-[14px] font-bold text-slate-800">
                                            {item.experience}
                                        </div>

                                        <div className="mt-4 space-y-2 text-[13px] text-slate-600 font-medium border-t border-slate-100 pt-4">
                                            {item.bullets.map((bullet, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <CheckCircle className="h-4 w-4 shrink-0 text-orange-500 mt-0.5" />
                                                    <span className="leading-snug">{bullet}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Link
                                            href={`/faculty/${item.id}`}
                                            className="mt-6 flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-orange-500 text-[14px] font-bold text-white transition hover:bg-orange-600"
                                        >
                                            View Profile <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
                            <UserRound className="h-12 w-12 text-slate-300" />
                            <h3 className="mt-4 text-[20px] font-black text-slate-800">No faculty found</h3>
                            <p className="mt-2 text-[15px] text-slate-500">Try adjusting your search or filters.</p>
                            <button
                                onClick={() => { setSearch(""); setActiveTab("All Faculty"); }}
                                className="mt-6 rounded-lg bg-orange-500 px-6 py-3 text-[14px] font-bold text-white hover:bg-orange-600 transition"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </section>

                {/* Mid Page Info Section */}
                <section className="border-y border-orange-100 bg-[#fff9f2] overflow-hidden">
                    <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center lg:grid-cols-2">
                        <div className="p-8 sm:p-12 lg:pl-10 lg:pr-16">
                            <h2 className="text-[28px] font-black leading-[1.15] tracking-tight text-slate-900 sm:text-[36px]">
                                Guidance <span className="text-slate-900">Beyond</span><br />
                                Classroom Teaching
                            </h2>
                            <p className="mt-4 text-[15px] leading-[1.6] text-slate-600 sm:text-[16px] max-w-[480px]">
                                Our faculty not only teach concepts but also provide personal guidance, answer writing support, and strategy to help you in every stage of your preparation.
                            </p>
                            <div className="mt-6 space-y-3">
                                {[
                                    "Live Doubt Clearing Sessions",
                                    "Personal Mentorship",
                                    "Answer Writing Feedback",
                                    "Exam Strategy & Guidance",
                                    "Motivation & Regular Support",
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-2.5 text-[15px] font-bold text-slate-800">
                                        <div className="grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-white shrink-0 shadow-sm">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative h-[400px] lg:h-full min-h-[400px]">
                            <img
                                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"
                                alt="Mentorship session"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            {/* Overlay text / badge from the design */}
                            <div className="absolute right-8 top-12 rotate-[4deg] font-serif text-[32px] sm:text-[38px] italic leading-[1.1] text-slate-900 drop-shadow-xl text-center">
                                Mentorship<br />
                                today,<br />
                                Success<br />
                                tomorrow.
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Mentors Horizontal Cards */}
                <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
                    <SectionHeading
                        title={
                            <>
                                Featured <span className="text-orange-500">Mentors</span>
                            </>
                        }
                        description="Meet some of our most popular and highly rated faculty members."
                        action="View All Faculty"
                    />

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {facultyMembers.slice(0, 4).map((f) => (
                            <div key={f.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md flex flex-col">
                                <div className="relative h-[160px] bg-slate-100 overflow-hidden">
                                    <img src={f.image} alt={f.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105 object-top" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                    <button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white bg-slate-900/40 text-white backdrop-blur-md transition hover:scale-110 hover:bg-orange-500 hover:border-orange-500">
                                        <Play size={14} fill="white" className="ml-0.5" />
                                    </button>
                                </div>
                                <div className="p-4 flex items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[15px] font-black text-slate-900 truncate">{f.name}</h4>
                                        <p className="text-[12px] font-semibold text-slate-500 mt-0.5 truncate">{f.subject}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">{f.experience.split(" ")[0]}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="overflow-hidden bg-orange-50 py-10 sm:py-12 border-t border-orange-100">
                    <div className="mx-auto flex min-h-[140px] w-[calc(100%-32px)] max-w-[1400px] px-6 lg:px-10 lg:w-[calc(100%-40px)] items-center justify-between gap-8">
                        <div>
                            <h2 className="text-[28px] font-black leading-tight text-slate-900 sm:text-[36px]">
                                Learn from the <span className="text-orange-500">Best Faculty</span>
                            </h2>
                            <p className="mt-3 max-w-[600px] text-[15px] leading-[1.6] text-slate-600 sm:text-[16px]">
                                Get access to live classes, recorded lectures, study material and
                                <br className="hidden sm:block" /> personal guidance from our expert mentors.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 text-[15px] font-black text-white shadow-md hover:bg-orange-600 transition" href="/signup">
                                    Create Free Account
                                    <ArrowRight size={16} />
                                </Link>
                                <Link className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-slate-800 bg-transparent px-6 text-[15px] font-black text-slate-800 hover:bg-slate-800 hover:text-white transition" href="/courses">
                                    <Video className="mr-1" size={16} />
                                    Explore Courses
                                </Link>
                            </div>
                        </div>

                        <div className="hidden items-center gap-8 lg:flex relative">
                            <div className="rotate-[-6deg] font-serif text-[32px] italic leading-[1.2] text-slate-800 relative z-10">
                                Ek <br />
                                Behtar <br />
                                Kal Ke Liye
                                <div className="absolute -bottom-2 left-0 h-1 w-24 rotate-[-2deg] bg-orange-500 rounded-full" />
                            </div>
                            <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=300&h=200" alt="Books" className="w-[280px] rounded-xl shadow-lg opacity-90 mix-blend-multiply" />
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-0 bg-[#021424] py-12 text-white">
                <div className="mx-auto grid w-[calc(100%-32px)] max-w-[1400px] px-6 lg:px-10 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr] lg:w-[calc(100%-40px)]">
                    <div>
                        <Brand dark />
                        <p className="mt-5 max-w-[300px] text-[14px] leading-[1.6] font-medium text-slate-400">
                            Your trusted partner for competitive exam preparation. Quality content, expert guidance and real practice for your success.
                        </p>
                        <div className="mt-6 flex gap-3 text-[18px] text-slate-400">
                            <span className="cursor-pointer rounded-full bg-white/5 p-2.5 hover:bg-orange-500 hover:text-white transition">▶</span>
                            <span className="cursor-pointer rounded-full bg-white/5 p-2.5 hover:bg-orange-500 hover:text-white transition">➤</span>
                            <span className="cursor-pointer rounded-full bg-white/5 p-2.5 hover:bg-orange-500 hover:text-white transition">◎</span>
                            <span className="cursor-pointer rounded-full bg-white/5 p-2.5 hover:bg-orange-500 hover:text-white transition">𝕏</span>
                            <span className="cursor-pointer rounded-full bg-white/5 p-2.5 hover:bg-orange-500 hover:text-white transition">in</span>
                        </div>
                    </div>

                    <FooterColumn links={["About Us", "Courses", "Test Series", "Study Material", "Faculty", "Results", "Contact Us"]} title="Quick Links" />
                    <FooterColumn links={["UPSC", "UPPSC", "UKPSC", "RAS", "SSC", "Defense", "Other Exams"]} title="Popular Exams" />
                    <FooterColumn links={["Help Center", "FAQs", "Refund Policy", "Terms & Conditions", "Privacy Policy"]} title="Support" />

                    <div>
                        <h4 className="text-[16px] font-extrabold text-white">Download Our App</h4>
                        <p className="mt-3 text-[13px] font-medium text-slate-400">Learn anytime, anywhere.</p>
                        <div className="mt-5 flex flex-col sm:flex-row lg:flex-col gap-3">
                            <div className="flex w-[160px] cursor-pointer items-center gap-3 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 transition hover:bg-white/10">
                                <span className="text-[22px]">▶</span>
                                <div>
                                    <div className="text-[9px] uppercase tracking-wider text-slate-400">GET IT ON</div>
                                    <div className="text-[14px] font-bold text-white">Google Play</div>
                                </div>
                            </div>
                            <div className="flex w-[160px] cursor-pointer items-center gap-3 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 transition hover:bg-white/10">
                                <span className="text-[22px]"></span>
                                <div>
                                    <div className="text-[9px] uppercase tracking-wider text-slate-400">Download on the</div>
                                    <div className="text-[14px] font-bold text-white">App Store</div>
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
        <div>
            <h4 className="text-[16px] font-extrabold text-white">{title}</h4>
            <div className="mt-5 space-y-3">
                {links.map((x) => (
                    <Link className="block text-[14px] font-medium text-slate-400 transition hover:text-orange-400" href="#" key={x}>
                        {x}
                    </Link>
                ))}
            </div>
        </div>
    );
}