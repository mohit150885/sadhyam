"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
    ArrowRight,
    BarChart3,
    BookOpen,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Landmark,
    MapPin,
    Menu,
    Mic,
    Play,
    Quote,
    Search,
    ShoppingCart,
    Star,
    Trophy,
    UserRound,
    Users,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const examTabs = [
    "All Exams",
    "UPSC",
    "UPPSC",
    "UKPSC",
    "RAS",
    "SSC",
    "Banking",
    "Other Exams",
];

const toppers = [
    {
        id: 1,
        name: "Aditi Sharma",
        exam: "UPSC CSE 2023",
        rank: "AIR 45",
        quote: "SadhyamIAS test series helped me identify my weak areas.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80",
        color: "amber"
    },
    {
        id: 2,
        name: "Rohit Yadav",
        exam: "UPPSC 2023",
        rank: "Rank 12",
        quote: "Structured notes and tests made a huge difference.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80",
        color: "blue"
    },
    {
        id: 3,
        name: "Priya Singh",
        exam: "RAS 2022",
        rank: "Rank 8",
        quote: "The faculty guidance and current affairs material was excellent.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
        color: "emerald"
    },
    {
        id: 4,
        name: "Neha Joshi",
        exam: "UKPSC 2023",
        rank: "Rank 15",
        quote: "Regular practice tests gave me the confidence to succeed.",
        image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&h=300&q=80",
        color: "teal"
    },
    {
        id: 5,
        name: "Aman Verma",
        exam: "SSC CGL 2023",
        rank: "Rank 3",
        quote: "Quality content and analysis reports were really helpful.",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80",
        color: "purple"
    },
];

const successVideos = [
    {
        id: 1,
        title: "From College to AIR 45",
        exam: "UPSC 2023",
        duration: "3:42",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        title: "My Journey to Rank 12",
        exam: "UPPSC 2023",
        duration: "4:18",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        title: "How I Cracked RAS",
        exam: "RAS 2022",
        duration: "5:06",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        title: "Strategy That Worked",
        exam: "UKPSC 2023",
        duration: "4:21",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
    },
];

const yearlyResults = [
    { year: "2024", selections: "12", color: "bg-amber-50 text-amber-500", border: "border-amber-100" },
    { year: "2023", selections: "18", color: "bg-blue-50 text-blue-500", border: "border-blue-100" },
    { year: "2022", selections: "15", color: "bg-emerald-50 text-emerald-500", border: "border-emerald-100" },
    { year: "2021", selections: "11", color: "bg-purple-50 text-purple-500", border: "border-purple-100" },
    { year: "2020", selections: "9", color: "bg-rose-50 text-rose-500", border: "border-rose-100" },
    { year: "2019", selections: "7", color: "bg-orange-50 text-orange-500", border: "border-orange-100" },
];

const testimonials = [
    {
        name: "Aditi Sharma",
        exam: "UPSC CSE 2023",
        quote: "The test series and detailed solutions helped me improve my answer writing dramatically.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    },
    {
        name: "Rohit Yadav",
        exam: "UPPSC 2023",
        quote: "The study material is concise, updated and exam-focused. Highly recommended!",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
    },
    {
        name: "Priya Singh",
        exam: "RAS 2022",
        quote: "Personal guidance from faculty gave me the right direction at every step.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
    }
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

export default function ResultsPage() {
    const [activeTab, setActiveTab] = useState("All Exams");
    const [showNavbar, setShowNavbar] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Carousel State for Hero
    const [currentSlide, setCurrentSlide] = useState(0);
    const banners = ["/banner1.png", "/banner2.png"];

    const pathname = "/results";

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
                                placeholder="Search results, toppers, exams..."
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
                                Our Students, Our Pride
                            </div>

                            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                Results <span className="text-orange-500">Speak</span><br />
                                for Themselves
                            </h1>

                            <p className="mt-4 max-w-[580px] text-[15px] sm:text-[17px] font-medium leading-relaxed text-white/90">
                                Thousands of aspirants have achieved their dreams with SadhyamIAS. Be the next success story.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-[13px] font-semibold text-white/90">
                                {[
                                    [Trophy, "Consistent Selections"],
                                    [BarChart3, "Year after Year Success"],
                                    [Users, "Students Across India"],
                                    [Star, "Real Stories, Real Inspiration"],
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
                            [Users, "5,000+", "Selections Till Now"],
                            [Trophy, "100+", "Ranks in Top 100"],
                            [Landmark, "500+", "Students in Govt. Services"],
                            [MapPin, "20+", "States Represented"],
                            [BarChart3, "95%+", "Students Recommend"],
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

                {/* Exam Tabs (Sticky Navigation) */}
                <section
                    className={`border-b border-slate-200 bg-white/95 backdrop-blur-md sticky z-40 shadow-sm transition-[top] duration-300 ease-in-out ${showNavbar ? "top-[64px] sm:top-[70px]" : "top-0"
                        }`}
                >
                    <div className="mx-auto flex max-w-[1400px] items-center gap-3 overflow-x-auto px-6 py-4 lg:px-10 no-scrollbar">
                        {examTabs.map((tab) => (
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

                {/* Our Toppers */}
                <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
                    <SectionHeading
                        title={
                            <>
                                Our <span className="text-orange-500">Toppers</span>
                            </>
                        }
                        description="Meet the students who made us proud with their outstanding performance."
                        action="View All Toppers"
                    />

                    <div className="relative">
                        <div className="flex overflow-x-auto gap-5 pb-6 no-scrollbar snap-x">
                            {toppers.map((topper) => (
                                <article key={topper.id} className="min-w-[260px] max-w-[280px] shrink-0 snap-start flex flex-col items-center p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
                                    <div className="relative mb-4">
                                        {/* Rank Badge */}
                                        <div className={`absolute -top-3 -left-3 z-10 rounded-lg bg-${topper.color}-50 border border-${topper.color}-200 px-3 py-1.5 shadow-sm text-center`}>
                                            <div className={`text-[10px] font-bold text-${topper.color}-700 leading-none`}>
                                                {topper.rank.split(' ')[0]}
                                            </div>
                                            <div className={`text-[18px] font-black text-${topper.color}-600 leading-none mt-0.5`}>
                                                {topper.rank.split(' ')[1] || topper.rank}
                                            </div>
                                        </div>
                                        {/* Profile Image with fake laurel wreath via golden border */}
                                        <div className="h-28 w-28 rounded-full border-4 border-amber-200 p-1 shadow-md bg-white">
                                            <img src={topper.image} alt={topper.name} className="h-full w-full rounded-full object-cover" />
                                        </div>
                                    </div>
                                    <h3 className="text-[18px] font-black text-slate-900">{topper.name}</h3>
                                    <p className="text-[13px] font-bold text-slate-500 mt-0.5">{topper.exam}</p>

                                    <div className={`mt-5 w-full rounded-xl bg-${topper.color}-50/50 p-4 text-center border border-${topper.color}-100/50`}>
                                        <Quote className={`mx-auto mb-2 h-5 w-5 text-${topper.color}-300 fill-current`} />
                                        <p className="text-[13px] font-medium text-slate-600 italic">
                                            "{topper.quote}"
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                        {/* Slide Arrows (Hidden on mobile for native scroll) */}
                        <button className="hidden lg:grid absolute -left-5 top-1/2 -translate-y-1/2 h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md hover:bg-slate-50 transition">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="hidden lg:grid absolute -right-5 top-1/2 -translate-y-1/2 h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md hover:bg-slate-50 transition">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </section>

                {/* Success Stories (Videos) */}
                <section className="bg-slate-50/50 py-12 lg:py-16 border-y border-slate-100">
                    <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                        <SectionHeading
                            title={
                                <>
                                    Success <span className="text-orange-500">Stories</span>
                                </>
                            }
                            description="Real journeys, real hard work, real results."
                            action="View All Success Stories"
                        />

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {successVideos.map((video) => (
                                <article key={video.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition cursor-pointer">
                                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                                        <img src={video.image} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

                                        <button className="absolute inset-0 m-auto grid h-12 w-12 place-items-center rounded-full border-2 border-white bg-slate-900/40 text-white backdrop-blur-md transition group-hover:scale-110 group-hover:bg-orange-500 group-hover:border-orange-500">
                                            <Play className="ml-1" fill="white" size={18} />
                                        </button>

                                        <div className="absolute left-3 top-3 rounded bg-white px-2 py-1 text-[10px] font-bold text-slate-900 shadow-sm">
                                            {video.exam}
                                        </div>

                                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                                            <h3 className="text-[14px] font-bold text-white leading-snug line-clamp-2">
                                                {video.title}
                                            </h3>
                                            <span className="shrink-0 text-[11px] font-bold text-white/80 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                                {video.duration}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Results Over the Years */}
                <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-[28px] font-black leading-[1.15] tracking-tight text-slate-900 sm:text-[36px]">
                                Results <span className="text-orange-500">Over the Years</span>
                            </h2>
                            <p className="mt-2 text-[15px] leading-[1.45] text-slate-500 sm:text-[16px]">
                                A consistent track record of excellence.
                            </p>
                        </div>
                        <div className="relative">
                            <select className="h-11 appearance-none rounded-lg border border-slate-300 bg-white pl-4 pr-10 text-[14px] font-bold text-slate-700 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-sm min-w-[160px]">
                                <option>UPSC CSE</option>
                                <option>UPPSC</option>
                                <option>RAS</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-[14px] h-4 w-4 text-slate-500" />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {yearlyResults.map((stat) => (
                            <div key={stat.year} className={`flex items-center gap-4 rounded-xl border p-5 transition hover:-translate-y-1 hover:shadow-md ${stat.border} ${stat.color.replace('text-', 'bg-').replace('50', '50/50')} bg-white`}>
                                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${stat.color}`}>
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <div className="text-[12px] font-bold text-slate-500">{stat.year}</div>
                                    <div className="text-[24px] font-black text-slate-900 leading-none mt-0.5">{stat.selections}</div>
                                    <div className="text-[11px] font-medium text-slate-500 mt-1">Selections</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* What Our Successful Students Say */}
                <section className="bg-slate-50/70 py-12 sm:py-16 border-t border-slate-100">
                    <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                        <div className="mb-8 flex items-end justify-between sm:mb-10">
                            <SectionHeading
                                title={
                                    <>
                                        What Our Successful Students <em className="not-italic text-orange-500">Say</em>
                                    </>
                                }
                                description="Hear from our toppers about their experience with SadhyamIAS."
                            />
                            <div className="hidden items-center gap-2 sm:flex">
                                <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 transition">
                                    <ChevronLeft size={20} />
                                </button>
                                <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 transition">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {testimonials.map(({ name, exam, quote, image }) => (
                                <article
                                    className="relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                                    key={name}
                                >
                                    <div>
                                        <Quote className="h-10 w-10 text-slate-200 fill-current mb-4" />
                                        <p className="min-h-[60px] text-[14px] leading-[1.6] text-slate-600 italic font-medium">"{quote}"</p>
                                    </div>

                                    <div className="flex items-center gap-3 pt-6 mt-4 border-t border-slate-100">
                                        <img src={image} alt={name} className="h-12 w-12 shrink-0 rounded-full object-cover border-2 border-slate-100" />
                                        <div className="flex-1 min-w-0">
                                            <strong className="block text-[15px] font-black text-slate-900 truncate">{name}</strong>
                                            <span className="block text-[12px] font-semibold text-slate-500 truncate">{exam}</span>
                                        </div>
                                        <div className="flex text-orange-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill="currentColor" />
                                            ))}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="overflow-hidden bg-orange-50 py-10 sm:py-12 border-t border-orange-100">
                    <div className="mx-auto flex min-h-[140px] w-[calc(100%-32px)] max-w-[1400px] px-6 lg:px-10 lg:w-[calc(100%-40px)] items-center justify-between gap-8">
                        <div>
                            <h2 className="text-[28px] font-black leading-tight text-slate-900 sm:text-[36px]">
                                Be the Next <span className="text-orange-500">Success Story</span>
                            </h2>
                            <p className="mt-3 max-w-[600px] text-[15px] leading-[1.6] text-slate-600 sm:text-[16px]">
                                Get access to the same courses, test series and study material
                                <br className="hidden sm:block" /> that helped thousands of students achieve their goals.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link href="/signup" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 text-[15px] font-black text-white shadow-md hover:bg-orange-600 transition">
                                    Create Free Account
                                    <ArrowRight size={16} />
                                </Link>
                                <Link href="/courses" className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-slate-800 bg-transparent px-6 text-[15px] font-black text-slate-800 hover:bg-slate-800 hover:text-white transition">
                                    <BookOpen size={16} className="mr-1" />
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
                    <Link key={x} href="#" className="block text-[14px] font-medium text-slate-400 transition hover:text-orange-400">
                        {x}
                    </Link>
                ))}
            </div>
        </div>
    );
}