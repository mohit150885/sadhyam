"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
    ArrowRight,
    Award,
    BarChart3,
    BookOpen,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CirclePlay,
    ClipboardList,
    Diamond,
    Eye,
    FileText,
    GraduationCap,
    Heart,
    Lightbulb,
    Menu,
    Mic,
    Play,
    Quote,
    Search,
    Shield,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Star,
    Target,
    Trophy,
    UserCheck,
    UserRound,
    Users,
    Video,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const stats = [
    [Users, "50,000+", "Students Learning", "text-orange-500", "bg-orange-50"],
    [Play, "2,500+", "Video Lectures", "text-blue-500", "bg-blue-50"],
    [FileText, "1,000+", "Practice Tests", "text-amber-500", "bg-amber-50"],
    [Trophy, "500+", "Selections & Success Stories", "text-emerald-500", "bg-emerald-50"],
];

const whyChoose = [
    {
        icon: BookOpen,
        title: "Exam-Focused Content",
        desc: "Curated notes, PDFs and test series as per latest exam pattern.",
        color: "text-orange-500",
        bg: "bg-orange-50"
    },
    {
        icon: UserRound,
        title: "Expert Guidance",
        desc: "Learn from experienced faculty and toppers.",
        color: "text-purple-500",
        bg: "bg-purple-50"
    },
    {
        icon: BarChart3,
        title: "Practice & Performance",
        desc: "Regular tests with detailed analysis to track your growth.",
        color: "text-emerald-500",
        bg: "bg-emerald-50"
    },
    {
        icon: ShieldCheck,
        title: "Affordable & Accessible",
        desc: "High-quality resources at pocket-friendly prices.",
        color: "text-blue-500",
        bg: "bg-blue-50"
    },
    {
        icon: Users,
        title: "Community Support",
        desc: "Be a part of a motivated community of like-minded aspirants.",
        color: "text-rose-500",
        bg: "bg-rose-50"
    }
];

const timeline = [
    { year: "2020", title: "The Beginning", desc: "Started with handwritten notes and small test series for a few students." },
    { year: "2021", title: "Growing Community", desc: "Expanded to online platform with more subjects and practice tests." },
    { year: "2022", title: "Trusted by Thousands", desc: "Crossed 10,000+ students and introduced video lectures." },
    { year: "2024", title: "Pan India Reach", desc: "50,000+ students learning across India." },
    { year: "Future", title: "Bigger Impact", desc: "Continuing to innovate and support aspirants towards success." },
];

const values = [
    { icon: Heart, title: "Student First", desc: "Every decision is made with students in mind.", color: "text-rose-500", bg: "bg-rose-50" },
    { icon: Shield, title: "Integrity", desc: "Honest and transparent in everything we do.", color: "text-purple-500", bg: "bg-purple-50" },
    { icon: Diamond, title: "Quality", desc: "Commitment to high-quality content.", color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: Users, title: "Inclusivity", desc: "Equal opportunities for all aspirants.", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: Lightbulb, title: "Continuous Improvement", desc: "Always learning and evolving to serve better.", color: "text-orange-500", bg: "bg-orange-50" },
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
}: {
    title: ReactNode;
    description: string;
}) {
    return (
        <div className="mb-8 sm:mb-12">
            <h2 className="text-[28px] font-black leading-[1.15] tracking-tight text-slate-900 sm:text-[36px]">
                {title}
            </h2>
            <p className="mt-2 text-[15px] leading-[1.45] text-slate-500 sm:text-[16px]">
                {description}
            </p>
        </div>
    );
}

export default function AboutPage() {
    const [showNavbar, setShowNavbar] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Carousel State for Hero
    const [currentSlide, setCurrentSlide] = useState(0);
    const banners = ["/banner1.png", "/banner2.png"];

    const pathname = "/about";

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
        <div className="min-h-screen bg-white text-slate-900 font-sans">
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
                                placeholder="Search courses, tests, notes..."
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
                <section className="relative min-h-[420px] overflow-hidden bg-slate-900 group">
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

                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#021424]/95 via-[#021424]/80 to-[#021424]/30" />

                    <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1400px] items-center px-6 py-12 lg:px-10">
                        <div className="max-w-[760px] text-white">
                            <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[13px] sm:text-[14px] font-bold text-white/90 shadow-sm backdrop-blur-md">
                                About SadhyamIAS
                            </div>

                            <h1 className="text-[44px] font-black leading-tight tracking-tight sm:text-[56px] lg:text-[68px]">
                                A Platform Built<br />
                                for <span className="text-orange-500">Every Aspirant</span>
                            </h1>

                            <p className="mt-5 max-w-[580px] text-[15px] sm:text-[17px] font-medium leading-relaxed text-white/90">
                                At SadhyamIAS, we believe that with the right guidance, quality content and consistent practice, every student can achieve their dream.
                            </p>

                            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-5 text-[13px] sm:text-[14px] font-bold text-white/90">
                                {[
                                    [UserRound, "Student First Approach"],
                                    [ShieldCheck, "Quality Content"],
                                    [Users, "Expert Faculty"],
                                    [BarChart3, "Results Driven"],
                                ].map(([Icon, label]) => {
                                    const ItemIcon = Icon as any;
                                    return (
                                        <div key={label as string} className="flex items-center gap-3">
                                            <div className="grid h-10 w-10 place-items-center rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                                <ItemIcon size={20} />
                                            </div>
                                            <span className="w-min sm:w-auto leading-tight">{label as string}</span>
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

                {/* Our Story */}
                <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-20 border-b border-slate-100">
                    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16 items-center">
                        <div>
                            <SectionHeading
                                title={<>Our <span className="text-orange-500">Story</span></>}
                                description="From a vision to a trusted learning platform."
                            />
                            <p className="mt-[-16px] text-[15px] leading-[1.7] text-slate-600 sm:text-[16px]">
                                SadhyamIAS was founded with a simple goal – to make high-quality, exam-focused content accessible to every aspirant, regardless of their background or location. What started as a small initiative to help friends with notes and test series has now grown into a comprehensive platform trusted by thousands of students across India.
                            </p>
                            <Link href="#journey" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-8 text-[15px] font-bold text-white shadow-md hover:bg-orange-600 transition">
                                Our Journey <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className="relative rounded-2xl bg-slate-50 p-6 sm:p-10 border border-slate-200">
                            <Quote className="h-10 w-10 text-slate-200 fill-current mb-4 absolute -top-4 -left-2 sm:-left-4 sm:-top-5" />
                            <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                                <div className="flex-1">
                                    <p className="text-[15px] leading-[1.6] text-slate-700 font-medium sm:text-[16px]">
                                        We started SadhyamIAS because we saw many talented students struggling due to lack of proper guidance and quality study material. Our mission is to bridge this gap and support every aspirant in their journey to success.
                                    </p>
                                    <div className="mt-6">
                                        <strong className="block text-[15px] font-black text-slate-900">Team SadhyamIAS</strong>
                                        <span className="text-[12px] font-semibold text-slate-500">Founders & Educators</span>
                                    </div>
                                </div>
                                <div className="h-[200px] w-full sm:h-[240px] sm:w-[200px] shrink-0 overflow-hidden rounded-xl">
                                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" alt="Students" className="h-full w-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision & Stats */}
                <section className="bg-slate-50/70 py-12 sm:py-16">
                    <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                        <SectionHeading
                            title={<>Our <span className="text-orange-500">Mission</span> & <span className="text-orange-500">Vision</span></>}
                            description="Guiding aspirants towards a brighter future."
                        />

                        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                                    <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-rose-50 text-rose-500">
                                        <Target size={24} />
                                    </div>
                                    <h3 className="mb-3 text-[18px] font-black text-slate-900">Our Mission</h3>
                                    <p className="text-[14px] leading-[1.6] text-slate-600 font-medium">
                                        To provide high-quality, structured and affordable study resources, expert guidance and consistent practice opportunities to help every aspirant achieve their dream.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                                    <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-500">
                                        <Eye size={24} />
                                    </div>
                                    <h3 className="mb-3 text-[18px] font-black text-slate-900">Our Vision</h3>
                                    <p className="text-[14px] leading-[1.6] text-slate-600 font-medium">
                                        To become India's most trusted and comprehensive platform for competitive exam preparation, empowering lakhs of students to succeed in their careers.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {stats.map(([Icon, value, label, textColor, bgColor], idx) => {
                                    const StatIcon = Icon as any;
                                    return (
                                        <div key={idx} className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${bgColor} ${textColor}`}>
                                                    <StatIcon size={20} />
                                                </div>
                                                <div>
                                                    <strong className="block text-[22px] font-black text-slate-900 leading-none">{value as string}</strong>
                                                </div>
                                            </div>
                                            <span className="mt-3 text-[12px] font-semibold text-slate-500 leading-snug">{label as string}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose SadhyamIAS */}
                <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-20 border-b border-slate-100">
                    <SectionHeading
                        title={<>Why Choose <span className="text-orange-500">SadhyamIAS?</span></>}
                        description="A complete ecosystem designed for your success."
                    />

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                        {whyChoose.map(({ icon: Icon, title, desc, color, bg }) => (
                            <div key={title} className="flex flex-col items-center text-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                                <div className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl ${bg} ${color}`}>
                                    <Icon size={28} />
                                </div>
                                <h3 className="mb-3 text-[16px] font-black leading-[1.3] text-slate-900">{title}</h3>
                                <p className="text-[13px] leading-[1.6] text-slate-500 font-medium">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Our Journey So Far */}
                <section id="journey" className="bg-white py-12 lg:py-20 border-b border-slate-100">
                    <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                        <SectionHeading
                            title={<>Our <span className="text-orange-500">Journey</span> So Far</>}
                            description="Key milestones in our journey."
                        />

                        <div className="relative mt-12 pb-6">
                            {/* Horizontal Line */}
                            <div className="absolute left-0 top-[22px] w-full h-[3px] bg-orange-100 hidden sm:block" />

                            <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-4 relative z-10">
                                {timeline.map((point, idx) => (
                                    <div key={idx} className="flex flex-col items-start sm:items-center text-left sm:text-center relative pl-8 sm:pl-0 sm:flex-1">
                                        {/* Mobile vertical line */}
                                        <div className="absolute left-3 top-6 h-full w-[3px] bg-orange-100 sm:hidden" />

                                        {/* Timeline Dot */}
                                        <div className="absolute left-0 sm:static sm:mb-4 h-6 w-6 rounded-full border-4 border-white bg-orange-500 shadow-md ring-1 ring-orange-200" />

                                        <span className="rounded bg-orange-50 px-2 py-1 text-[11px] font-black text-orange-600 border border-orange-100 mb-3">{point.year}</span>
                                        <h4 className="text-[15px] font-black text-slate-900 mb-2 leading-tight">{point.title}</h4>
                                        <p className="text-[12px] font-medium text-slate-500 sm:max-w-[200px] leading-relaxed">{point.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Core Values */}
                <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-20">
                    <SectionHeading
                        title={<>Our Core <span className="text-orange-500">Values</span></>}
                        description="Principles that drive everything we do."
                    />

                    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                            {values.map(({ icon: Icon, title, desc, color, bg }) => (
                                <div key={title} className="flex flex-col items-center text-center rounded-xl border border-slate-200 bg-slate-50 p-6 transition hover:shadow-md hover:bg-white">
                                    <div className={`mb-4 grid h-12 w-12 place-items-center rounded-xl ${bg} ${color}`}>
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="mb-2.5 text-[15px] font-black text-slate-900">{title}</h3>
                                    <p className="text-[12px] leading-[1.6] text-slate-500 font-medium">{desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col justify-center rounded-2xl border border-orange-200 bg-[#fff9f2] p-8 lg:p-10 relative overflow-hidden">
                            <Quote className="h-16 w-16 text-orange-500/10 fill-current absolute top-4 left-4" />
                            <p className="relative z-10 text-[16px] leading-[1.7] text-slate-800 font-bold italic">
                                "Success is not just about cracking an exam, it's about building a better future for yourself and for the society."
                            </p>
                            <div className="relative z-10 mt-6 flex items-center gap-2 text-orange-600 font-black">
                                <span className="h-px w-6 bg-orange-600"></span> Team SadhyamIAS
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="overflow-hidden bg-orange-50 py-10 sm:py-12 border-t border-orange-100">
                    <div className="mx-auto flex min-h-[140px] w-[calc(100%-32px)] max-w-[1400px] px-6 lg:px-10 lg:w-[calc(100%-40px)] items-center justify-between gap-8">
                        <div>
                            <h2 className="text-[28px] font-black leading-tight text-slate-900 sm:text-[36px]">
                                Join Thousands of Aspirants<br />
                                in Their <span className="text-orange-500">Success Journey</span>
                            </h2>
                            <p className="mt-3 max-w-[600px] text-[15px] leading-[1.6] text-slate-600 sm:text-[16px]">
                                Get access to our courses, test series, study material<br className="hidden sm:block" /> and expert guidance.
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