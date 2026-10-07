"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
    ArrowRight,
    Award,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    CirclePlay,
    ClipboardList,
    GraduationCap,
    Menu,
    Play,
    Search,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Star,
    Target,
    Trophy,
    Users,
    X,
    Mic
} from "lucide-react";
import Link from "next/link";

const exams = ["UPSC", "UPPSC", "UKPSC", "RAS", "SSC", "Defense", "Other Exams"];

const features = [
    { icon: ClipboardList, tone: "red", title: "Exam-Focused Content", text: "Designed by experts as per latest pattern" },
    { icon: BookOpen, tone: "blue", title: "Real Exam Tests", text: "Chapter-wise, sectional and full-length tests" },
    { icon: Users, tone: "green", title: "Expert Faculty", text: "Learn from experienced mentors" },
    { icon: Sparkles, tone: "purple", title: "Detailed Solutions", text: "Step-by-step explanations" },
    { icon: ShieldCheck, tone: "teal", title: "Performance Analysis", text: "AI-powered insights to track your growth" },
    { icon: BookOpen, tone: "orange", title: "Study Material", text: "High-quality PDFs, notes and resources" },
];

const courses = [
    { image: "https://images.unsplash.com/photo-1585828068970-1b5e28230528?auto=format&fit=crop&q=80&w=400&h=200", badge: "Most Popular", title: "UPSC Pre + Mains Complete Course 2025", faculty: "Expert Faculty Team", lectures: "500+", pdfs: "200+", tests: "100+", price: "₹12,999", old: "₹19,999", off: "35% OFF", rating: "4.8", reviews: "3.2k" },
    { image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=400&h=200", title: "UPPSC Foundation Course 2025", faculty: "Dr. A. Kumar & Team", lectures: "300+", pdfs: "150+", tests: "80+", price: "₹8,999", old: "₹14,999", off: "40% OFF", rating: "4.7", reviews: "1.8k" },
    { image: "https://images.unsplash.com/photo-1596522513974-98da69389e7c?auto=format&fit=crop&q=80&w=400&h=200", title: "RAS Complete Course 2025", faculty: "S. Sharma & Team", lectures: "350+", pdfs: "180+", tests: "90+", price: "₹9,999", old: "₹15,999", off: "37% OFF", rating: "4.6", reviews: "1.2k" },
    { image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400&h=200", title: "Current Affairs 2025 (Pre + Mains)", faculty: "Editorial Team", lectures: "100+", pdfs: "100+", tests: "50+", price: "₹4,999", old: "₹7,999", off: "30% OFF", rating: "4.8", reviews: "2.1k" },
];

const tests = [
    ["red", "UPSC CSE Prelims Test Series 2025", "50 Tests • 10,000+ Questions", "₹2,999", "₹4,999", "40% OFF"],
    ["green", "UPPSC Prelims Test Series 2025", "40 Tests • 8,000+ Questions", "₹1,999", "₹3,499", "43% OFF"],
    ["orange", "RAS Prelims Test Series 2025", "40 Tests • 8,000+ Questions", "₹1,999", "₹3,499", "43% OFF"],
    ["blue", "Current Affairs Test Series 2025", "30 Tests • 6,000+ Questions", "₹999", "₹1,999", "50% OFF"],
];

const faculty = [
    { name: "Dr. A. Kumar", subject: "Polity & Governance", exp: "15+ Years Experience", image: "https://i.pravatar.cc/150?img=11" },
    { name: "Prof. N. Singh", subject: "Geography", exp: "12+ Years Experience", image: "https://i.pravatar.cc/150?img=5" },
    { name: "S. Sharma", subject: "History & Culture", exp: "10+ Years Experience", image: "https://i.pravatar.cc/150?img=8" },
    { name: "R. Verma", subject: "Economy", exp: "14+ Years Experience", image: "https://i.pravatar.cc/150?img=12" },
    { name: "P. Mishra", subject: "Current Affairs", exp: "10+ Years Experience", image: "https://i.pravatar.cc/150?img=9" },
];

const results = [
    { rank: "AIR 45", name: "Aditya Singh", exam: "UPSC 2023", image: "https://i.pravatar.cc/150?img=11" },
    { rank: "Rank 12", name: "Priya Sharma", exam: "UPPSC 2023", image: "https://i.pravatar.cc/150?img=5" },
    { rank: "Rank 8", name: "Rahul Meena", exam: "RAS 2022", image: "https://i.pravatar.cc/150?img=8" },
    { rank: "Rank 15", name: "Neha Joshi", exam: "UKPSC 2023", image: "https://i.pravatar.cc/150?img=9" },
];

const testimonials = [
    { name: "Rohit Yadav", role: "UPSC Aspirant", quote: "SadhyamIAS test series really helped me understand my weak areas. The solutions are detailed and easy to understand.", image: "https://i.pravatar.cc/150?img=12" },
    { name: "Neha Tiwari", role: "Selected - UPPSC 2023", quote: "Best platform for UPPSC preparation. The video lectures and PDF notes are excellent.", image: "https://i.pravatar.cc/150?img=5" },
    { name: "Aman Verma", role: "RAS Aspirant", quote: "The current affairs series is amazing. Highly recommended for all competitive exam aspirants.", image: "https://i.pravatar.cc/150?img=11" },
];

const toneClasses: Record<string, string> = {
    red: "bg-red-50 text-red-500",
    blue: "bg-blue-50 text-blue-500",
    green: "bg-emerald-50 text-emerald-500",
    purple: "bg-violet-50 text-violet-500",
    teal: "bg-teal-50 text-teal-500",
    orange: "bg-orange-50 text-orange-500",
};

const testToneClasses: Record<string, string> = {
    red: "bg-red-500",
    green: "bg-emerald-500",
    orange: "bg-orange-500",
    blue: "bg-blue-500",
};

function Brand({ dark = false }: { dark?: boolean }) {
    return (
        <Link
            href="/"
            aria-label="SadhyamIAS home"
            className="flex shrink-0 items-center gap-2.5 no-underline"
        >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-[26px] shadow-sm">
                🔥
            </span>
            <span className="flex flex-col">
                <strong
                    className={`text-[26px] font-black leading-none tracking-tight sm:text-[28px] ${dark ? "text-white" : "text-slate-900"
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
    decoration,
}: {
    title: ReactNode;
    description: string;
    action?: string;
    decoration?: ReactNode;
}) {
    return (
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10 relative">
            <div>
                <h2 className="text-[28px] font-black leading-[1.15] tracking-tight text-slate-900 sm:text-[36px]">
                    {title}
                </h2>
                <p className="mt-2 text-[15px] leading-[1.45] text-slate-500 sm:text-[16px]">
                    {description}
                </p>
            </div>
            {decoration && (
                <div className="hidden absolute right-0 top-0 lg:block">
                    {decoration}
                </div>
            )}
            {action && (
                <Link
                    href="#"
                    className="hidden shrink-0 items-center gap-1.5 text-[15px] font-bold text-blue-700 sm:flex"
                >
                    {action}
                    <ArrowRight size={14} />
                </Link>
            )}
        </div>
    );
}

export default function Home() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [exam, setExam] = useState("UPSC");
    const [showNavbar, setShowNavbar] = useState(true);
    const pathname = usePathname();

    // Carousel State
    const [currentSlide, setCurrentSlide] = useState(0);
    const banners = ["/banner1.png", "/banner2.png"];

    // Auto-slide effect for the carousel
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

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 10) {
                setShowNavbar(true);
            } else if (currentScrollY < lastScrollY) {
                setShowNavbar(true);
            } else if (currentScrollY > lastScrollY) {
                setShowNavbar(false);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <main className="min-h-screen overflow-hidden bg-slate-50/50 pt-[64px] sm:pt-[70px] font-sans text-slate-900">
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
                                const isActive = pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
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
                            <input type="text" placeholder="Search tests, courses..." className="bg-transparent w-full outline-none text-slate-700" />
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

            {/* HERO SECTION */}
            <section className="relative min-h-[400px] overflow-hidden bg-slate-900 group">
                {/* Carousel Background */}
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
                                    className="h-full w-full object-cover object-center opacity-60 mix-blend-luminosity"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gradient Overlay for Text Visibility */}
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#021424]/95 via-[#021424]/70 to-[#021424]/20" />

                {/* Content Overlay */}
                <div className="relative z-10 mx-auto grid min-h-[400px] w-[calc(100%-32px)] max-w-[1400px] grid-cols-1 items-center px-6 lg:px-10 lg:w-[calc(100%-40px)]">
                    <div className="relative z-10 py-12 sm:py-16 max-w-[760px]">
                        <div className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[12px] sm:text-[13px] font-bold text-white/90 shadow-sm backdrop-blur-md">
                            India&apos;s Trusted Platform for Competitive Exam Preparation
                        </div>

                        <h1 className="text-4xl font-black leading-[1.05] tracking-[-1.5px] text-white sm:text-5xl lg:text-6xl">
                            Prepare. Practice.
                            <br />
                            <span className="text-orange-500">Perform.</span>
                        </h1>

                        <div className="mt-6 flex items-center gap-3 text-[13px] sm:text-[15px] font-bold text-white">
                            <span>Structured Courses</span>
                            <i className="h-4 w-px bg-white/40" />
                            <span>Real Exam Tests</span>
                            <i className="h-4 w-px bg-white/40" />
                            <span>Expert Guidance</span>
                        </div>

                        <p className="mt-5 max-w-[600px] text-[15px] sm:text-[17px] font-medium leading-[1.6] text-white/90">
                            Your one-stop platform for UPSC, UPPSC, UKPSC, RAS, SSC and other competitive examinations.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link href="/signup" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 text-[14px] sm:text-[15px] font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition">
                                Start Free Test
                                <ArrowRight size={16} />
                            </Link>
                            <Link href="/courses" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white/10 backdrop-blur-md px-6 text-[14px] sm:text-[15px] font-bold text-white border border-white/20 hover:bg-white/20 transition">
                                <CirclePlay size={16} />
                                Explore Courses
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-2.5">
                            {exams.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setExam(item)}
                                    className={`rounded-lg px-3.5 py-2 text-[12px] sm:text-[13px] font-bold transition border ${exam === item
                                        ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/25"
                                        : "border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white backdrop-blur-sm"
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons for Carousel */}
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

                {/* Carousel Indicators */}
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

            {/* STATS */}
            <section className="border-b border-slate-100 bg-white py-8 sm:py-10">
                <div className="mx-auto grid w-[calc(100%-32px)] max-w-[1400px] grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 px-6 lg:px-10 lg:w-[calc(100%-40px)]">
                    {[
                        [Award, "50,000+", "Students Learning"],
                        [GraduationCap, "10,000+", "Practice Tests"],
                        [Play, "2,500+", "Video Lectures"],
                        [BookOpen, "5,000+", "Study Materials"],
                        [Trophy, "500+", "Selections & Counting"],
                    ].map(([Icon, big, small]) => {
                        const StatIcon = Icon as typeof Award;
                        return (
                            <div className="flex items-center gap-3.5" key={small as string}>
                                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-500">
                                    <StatIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <strong className="block text-[24px] font-black leading-none text-slate-900 sm:text-[28px]">
                                        {big as string}
                                    </strong>
                                    <span className="mt-1.5 block text-[14px] font-semibold text-slate-500 sm:text-[15px]">
                                        {small as string}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section id="about" className="py-12 sm:py-16 bg-white">
                <div className="mx-auto w-[calc(100%-32px)] max-w-[1400px] px-6 lg:px-10 lg:w-[calc(100%-40px)]">
                    <SectionHeading
                        title={
                            <>
                                Why Choose <em className="not-italic text-orange-500">SadhyamIAS?</em>
                            </>
                        }
                        description="A complete ecosystem to help you crack your dream exam."
                        decoration={
                            <div className="font-serif text-[32px] italic text-slate-800 rotate-[-4deg] opacity-80">
                                Sapna Taiyaari Prayas Seva
                                <div className="h-1 w-24 bg-orange-500 mt-1 rounded-full mx-auto" />
                            </div>
                        }
                    />

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
                        {features.map(({ icon: Icon, tone, title, text }) => (
                            <article
                                key={title}
                                className="min-h-[140px] rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
                                    <Icon size={20} />
                                </div>
                                <h3 className="text-[16px] font-black leading-[1.3] text-slate-900">{title}</h3>
                                <p className="mt-2.5 text-[13px] leading-[1.5] text-slate-500">{text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* COURSES */}
            <section id="courses" className="bg-slate-50/70 py-12 sm:py-16">
                <div className="mx-auto w-[calc(100%-32px)] max-w-[1400px] px-6 lg:px-10 lg:w-[calc(100%-40px)]">
                    <SectionHeading
                        title="Popular Courses"
                        description="Comprehensive courses designed for your exam success."
                        action="View All Courses"
                    />

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {courses.map((c) => (
                            <article
                                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
                                key={c.title}
                            >
                                <div className="relative h-44 overflow-hidden bg-slate-100">
                                    <img src={c.image} alt={c.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                                    {c.badge && (
                                        <span className="absolute left-3 top-3 rounded-md bg-orange-500 px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-white shadow-sm">
                                            {c.badge.toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col flex-1 p-5">
                                    <h3 className="min-h-[48px] text-[16px] font-extrabold leading-[1.3] text-slate-900">
                                        {c.title}
                                    </h3>
                                    <p className="mt-1 flex items-center gap-1.5 text-[13px] font-medium text-slate-500">
                                        By <span className="font-bold text-slate-700">{c.faculty}</span>
                                    </p>

                                    <div className="mt-4 grid grid-cols-3 gap-2 text-[13px] text-slate-600 font-medium">
                                        <span className="flex items-center gap-1.5"><Play className="text-orange-500" size={14} /> {c.lectures}</span>
                                        <span className="flex items-center gap-1.5"><BookOpen className="text-orange-500" size={14} /> {c.pdfs}</span>
                                        <span className="flex items-center gap-1.5"><ClipboardList className="text-orange-500" size={14} /> {c.tests}</span>
                                    </div>

                                    <div className="mt-4 flex items-center gap-1.5 text-[14px]">
                                        <Star size={14} fill="currentColor" className="text-orange-400" />
                                        <span className="font-extrabold text-slate-800">{c.rating}</span>
                                        <span className="text-slate-500">({c.reviews})</span>
                                    </div>

                                    <div className="mt-auto pt-4 flex items-end gap-2.5">
                                        <strong className="text-[22px] font-black leading-none text-slate-900">{c.price}</strong>
                                        <del className="text-[14px] font-medium text-slate-400 mb-0.5">{c.old}</del>
                                        <small className="rounded-md bg-emerald-50 px-2 py-1 text-[12px] font-black text-emerald-600 mb-0.5 ml-auto">
                                            {c.off}
                                        </small>
                                    </div>

                                    <button className="mt-5 flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-orange-500 text-[14px] font-bold text-white hover:bg-orange-600 transition">
                                        View Details <ArrowRight size={16} />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* TEST SERIES */}
            <section id="test-series" className="py-12 sm:py-16 bg-white">
                <div className="mx-auto w-[calc(100%-32px)] max-w-[1400px] px-6 lg:px-10 lg:w-[calc(100%-40px)]">
                    <SectionHeading
                        title="Test Series"
                        description="Practice with real exam level questions and improve your rank."
                        action="View All Test Series"
                    />

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {tests.map(([tone, title, count, price, old, off]) => (
                            <article
                                className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col"
                                key={title}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg text-white shadow-sm ${testToneClasses[tone]}`}>
                                        <ClipboardList size={22} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-[16px] font-extrabold leading-[1.3] text-slate-900">{title}</h3>
                                        <p className="mt-1.5 text-[13px] font-medium text-slate-500">{count}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="rounded-md bg-slate-50 border border-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">Full Length</span>
                                    <span className="rounded-md bg-slate-50 border border-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">Sectional</span>
                                </div>

                                <div className="mt-auto pt-5 flex items-end gap-2.5">
                                    <strong className="text-[22px] font-black leading-none text-slate-900">{price}</strong>
                                    <del className="text-[14px] font-medium text-slate-400 mb-0.5">{old}</del>
                                    <small className="rounded-md bg-emerald-50 px-2 py-1 text-[12px] font-black text-emerald-600 mb-0.5 ml-auto">{off}</small>
                                </div>

                                <a href="#" className="mt-5 flex items-center justify-center gap-1.5 text-[14px] font-bold text-orange-500 bg-orange-50 py-2.5 rounded-lg hover:bg-orange-100 transition">
                                    View Details <ArrowRight size={16} />
                                </a>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* FACULTY */}
            <section id="faculty" className="bg-slate-50/50 py-12 sm:py-16">
                <div className="mx-auto w-[calc(100%-32px)] max-w-[1400px] px-6 lg:px-10 lg:w-[calc(100%-40px)]">
                    <SectionHeading
                        title={
                            <>
                                Learn from the Best <em className="not-italic text-orange-500">Faculty</em>
                            </>
                        }
                        description="Experienced mentors to guide you at every step."
                        action="View All Faculty"
                    />

                    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                        {faculty.map((f) => (
                            <article
                                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
                                key={f.name}
                            >
                                <div className="relative h-[180px] bg-slate-100 group">
                                    <img src={f.image} alt={f.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <button className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full border-2 border-white/80 bg-slate-900/70 text-white hover:bg-orange-500 hover:border-orange-500 transition">
                                        <Play size={12} fill="white" />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-[16px] font-extrabold text-slate-900">{f.name}</h3>
                                    <p className="mt-1 text-[13px] font-medium text-slate-600">{f.subject}</p>
                                    <span className="mt-3 inline-block rounded-md bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500 border border-slate-100">{f.exp}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* RESULTS */}
            <section id="results" className="py-12 sm:py-16 bg-white">
                <div className="mx-auto w-[calc(100%-32px)] max-w-[1400px] px-6 lg:px-10 lg:w-[calc(100%-40px)]">
                    <SectionHeading
                        title={
                            <>
                                Our Results <em className="not-italic text-orange-500">Speak for Themselves</em>
                            </>
                        }
                        description="Join thousands of successful students."
                        action="View Success Stories"
                    />

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {results.map(({ rank, name, exam, image }) => (
                            <article
                                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition"
                                key={name}
                            >
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-orange-100 shadow-sm">
                                    <img src={image} alt={name} className="h-full w-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                    <small className="block text-[12px] font-bold text-slate-500">{exam}</small>
                                    <strong className="block text-[18px] font-black text-orange-500">{rank}</strong>
                                    <span className="block text-[14px] font-semibold text-slate-800">{name}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="bg-slate-50/70 py-12 sm:py-16">
                <div className="mx-auto w-[calc(100%-32px)] max-w-[1400px] px-6 lg:px-10 lg:w-[calc(100%-40px)]">
                    <div className="mb-8 flex items-end justify-between sm:mb-10">
                        <SectionHeading
                            title={
                                <>
                                    What Our Students <em className="not-italic text-orange-500">Say</em>
                                </>
                            }
                            description="Real stories from real aspirants."
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
                        {testimonials.map(({ name, role, quote, image }) => (
                            <article
                                className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                                key={name}
                            >
                                <span className="absolute top-4 left-4 block text-[60px] font-serif leading-[0.6] text-blue-100 opacity-50">“</span>
                                <p className="relative z-10 my-4 min-h-[60px] text-[14px] leading-[1.6] text-slate-600 italic">"{quote}"</p>

                                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-slate-100">
                                        <img src={image} alt={name} className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <strong className="block text-[15px] font-black text-slate-900">{name}</strong>
                                        <span className="block text-[12px] font-semibold text-slate-500">{role}</span>
                                    </div>
                                    <div className="ml-auto text-[14px] tracking-[2px] text-orange-400">★★★★★</div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="overflow-hidden bg-orange-50 py-10 sm:py-12">
                <div className="mx-auto flex min-h-[160px] w-[calc(100%-32px)] max-w-[1400px] px-6 lg:px-10 lg:w-[calc(100%-40px)] items-center justify-between gap-8">
                    <div>
                        <h2 className="text-[32px] font-black leading-tight text-slate-900 sm:text-[40px]">
                            Start Your Preparation Today
                        </h2>
                        <p className="mt-3 max-w-[600px] text-[15px] leading-[1.6] text-slate-600 sm:text-[16px]">
                            Join SadhyamIAS and get access to premium courses, test series,
                            <br className="hidden sm:block" /> study material and expert guidance.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href="/signup" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 text-[15px] font-black text-white shadow-md hover:bg-orange-600 transition">
                                Create Free Account
                                <ArrowRight size={16} />
                            </Link>
                            <Link href="/courses" className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-slate-800 bg-transparent px-6 text-[15px] font-black text-slate-800 hover:bg-slate-800 hover:text-white transition">
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
                        <img src="/parliament.jpg" alt="Parliament" className="w-[280px] rounded-xl mix-blend-multiply" />
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#021424] py-12 text-white">
                <div className="mx-auto grid w-[calc(100%-32px)] max-w-[1400px] px-6 lg:px-10 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr] lg:w-[calc(100%-40px)]">
                    <div>
                        <Brand dark />
                        <p className="mt-5 max-w-[300px] text-[14px] leading-[1.6] font-medium text-slate-400">
                            Your trusted partner for competitive exam preparation. Quality content, expert guidance and real practice for your success.
                        </p>
                        <div className="mt-6 flex gap-3 text-[18px] text-slate-400">
                            <span className="cursor-pointer rounded-full bg-white/5 p-2.5 hover:bg-orange-500 hover:text-white transition">▶</span>
                            <span className="cursor-pointer rounded-full bg-white/5 p-2.5 hover:bg-orange-500 hover:text-white transition">✈</span>
                            <span className="cursor-pointer rounded-full bg-white/5 p-2.5 hover:bg-orange-500 hover:text-white transition">◎</span>
                            <span className="cursor-pointer rounded-full bg-white/5 p-2.5 hover:bg-orange-500 hover:text-white transition">𝕏</span>
                            <span className="cursor-pointer rounded-full bg-white/5 p-2.5 hover:bg-orange-500 hover:text-white transition">in</span>
                        </div>
                    </div>

                    <FooterColumn title="Quick Links" links={["About Us", "Courses", "Test Series", "Study Material", "Faculty", "Results", "Contact Us"]} />
                    <FooterColumn title="Popular Exams" links={["UPSC", "UPPSC", "UKPSC", "RAS", "SSC", "Defense", "Other Exams"]} />
                    <FooterColumn title="Support" links={["Help Center", "FAQs", "Refund Policy", "Terms & Conditions", "Privacy Policy"]} />

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
        </main>
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