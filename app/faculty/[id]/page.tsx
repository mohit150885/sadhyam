"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useParams, usePathname } from "next/navigation";
import {
    ArrowRight,
    Award,
    BookOpen,
    Check,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Download,
    FileText,
    GraduationCap,
    Menu,
    Mic,
    MonitorPlay,
    Play,
    Quote,
    Search,
    ShieldCheck,
    ShoppingCart,
    Star,
    Target,
    Trophy,
    UserRound,
    Users,
    Video,
    X,
    Clock4,
    PenTool,
    BarChart3
} from "lucide-react";
import Link from "next/link";

// --- Mock Database from Listing Page ---
const facultyMembers = [
    {
        id: 1,
        name: "Dr. A. Kumar",
        subject: "Polity & Governance",
        experience: "15+ Years",
        bullets: [
            "Ex-Civil Servant",
            "Specialist in Polity & Ethics",
            "Simplified Conceptual Approach",
            "Focus on PYQs & Current Affairs",
            "Regular Answer Writing Guidance"
        ],
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80",
        stats: { students: "5,000+", rating: 4.9, hours: "700+" },
        quote: "My goal is to make Polity not just a subject, but a perspective to understand our democracy better.",
        about: "Dr. A. Kumar has over 15 years of rich experience in teaching and mentoring UPSC aspirants. As an ex-civil servant, he brings real-world administrative insights into the classroom, making Polity and Governance easy to understand and deeply interesting. His teaching is known for clarity, structured notes, regular current affairs integration and strong focus on answer writing. Thousands of students have benefited from his guidance and secured top ranks in UPSC CSE."
    },
    {
        id: 2,
        name: "Prof. N. Singh",
        subject: "Geography",
        experience: "12+ Years",
        bullets: [
            "NTA & State Exams Expert",
            "Maps & Diagrams Specialist",
            "Interactive Teaching Style",
            "Focus on PYQs & Current Affairs",
            "Mentored Many Toppers",
        ],
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
        stats: { students: "4,000+", rating: 4.8, hours: "600+" },
        quote: "Geography is not just about maps; it's the canvas on which human history is drawn.",
        about: "Prof. N. Singh is a renowned Geography expert with a unique interactive teaching style. Specializing in Maps and Diagrams, she simplifies complex geographical phenomena."
    }
];

const facultyCourses = [
    {
        id: 1,
        title: "Complete Polity Course",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
        tag: "Best Seller",
        type: "UPSC • Live + Recorded",
        stats: "120+ Lectures • 25 PDFs • 20 Tests",
        price: 12999,
        oldPrice: 18999,
        discount: 32
    },
    {
        id: 2,
        title: "Indian Constitution Course",
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
        tag: "",
        type: "UPSC • Live + Recorded",
        stats: "80+ Lectures • 18 PDFs • 15 Tests",
        price: 9999,
        oldPrice: 14999,
        discount: 33
    },
    {
        id: 3,
        title: "Ethics, Essay & Case Studies",
        image: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=600&q=80",
        tag: "",
        type: "UPSC • Live + Recorded",
        stats: "60+ Lectures • 25 PDFs • 20 Tests",
        price: 8999,
        oldPrice: 14999,
        discount: 31
    }
];

const videoLectures = [
    { id: 1, title: "Introduction to Indian Constitution", duration: "42:15", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Fundamental Rights - Detailed Analysis", duration: "38:20", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Directive Principles of State Policy", duration: "35:10", image: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=600&q=80" },
];

const testimonials = [
    {
        name: "Aditi Sharma",
        exam: "UPSC CSE 2023",
        quote: "Dr. A. Kumar's way of teaching Polity is simply exceptional. Complex topics become easy to understand with real-life examples. His notes are gold!",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        rating: 5
    }
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
                <h2 className="text-[24px] font-black leading-[1.2] tracking-tight text-slate-900 sm:text-[28px]">
                    {title}
                </h2>
                <p className="mt-2 text-[14px] leading-[1.5] text-slate-500 sm:text-[15px] max-w-[800px]">
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

export default function FacultyProfilePage() {
    const params = useParams();
    const currentId = Number(params?.id) || 1;
    const faculty = facultyMembers.find(f => f.id === currentId) || facultyMembers[0];

    const [showNavbar, setShowNavbar] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Overview");
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

    return (
        <div className="relative min-h-screen w-full max-w-[100vw] flex flex-col overflow-x-clip bg-slate-50/50 text-slate-900 font-sans">
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

            <main className="pt-[64px] sm:pt-[70px] w-full max-w-[100vw] overflow-x-clip">
                {/* HERO SECTION */}
                <section className="relative w-full bg-[#fdfaf6] border-b border-orange-100 overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-[40%] bg-orange-50/50 mix-blend-multiply rounded-bl-[100%]" />

                    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8 py-10 lg:py-16 relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

                        {/* Profile Image - Left Side */}
                        <div className="relative w-[280px] h-[320px] shrink-0 mx-auto lg:mx-0">
                            {/* Decorative Blob Background */}
                            <div className="absolute inset-0 bg-orange-100 rounded-full blur-xl opacity-60 mix-blend-multiply" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-orange-50 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-[spin_10s_linear_infinite] opacity-50" />
                            <img
                                src={faculty.image}
                                alt={faculty.name}
                                className="relative z-10 w-full h-full object-cover object-top drop-shadow-xl"
                                style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)", borderRadius: "20px" }}
                            />

                            {/* Experience Badge */}
                            <div className="absolute -bottom-4 -left-4 z-20 flex items-center gap-3 bg-white rounded-xl shadow-xl border border-slate-100 p-3 pr-5">
                                <div className="grid h-10 w-10 place-items-center rounded-full bg-orange-50 text-orange-500 shrink-0">
                                    <Trophy size={20} />
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-[18px] font-black text-slate-900">{faculty.experience}</span>
                                    <span className="text-[11px] font-bold text-slate-500">Experience</span>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details - Right Side */}
                        <div className="flex-1 w-full min-w-0 flex flex-col items-center lg:items-start text-center lg:text-left">
                            <div className="mb-4 flex flex-wrap gap-2 text-[12px] font-medium text-slate-500 justify-center lg:justify-start w-full">
                                {["Home", "Faculty", faculty.name].map((crumb, idx) => (
                                    <span key={idx} className="flex items-center gap-2">
                                        <span className={idx === 2 ? "text-slate-900 font-bold" : ""}>{crumb}</span>
                                        {idx < 2 && <span>›</span>}
                                    </span>
                                ))}
                            </div>

                            <span className="inline-flex rounded-md bg-orange-100 px-2.5 py-1 text-[11px] font-black text-orange-700 shadow-sm mb-3">
                                UPSC Faculty
                            </span>

                            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-[56px] text-slate-900 mb-2">
                                {faculty.name}
                            </h1>
                            <h2 className="text-[20px] sm:text-[24px] font-black text-slate-700 mb-4">
                                {faculty.subject}
                            </h2>

                            <p className="text-[15px] font-bold text-slate-600 mb-6">
                                Ex-Civil Servant | UPSC Mentor | Polity & Ethics Expert
                            </p>

                            <p className="max-w-[700px] text-[14px] sm:text-[15px] font-medium leading-relaxed text-slate-600 mb-8">
                                {faculty.about.split('.')[0]}. {faculty.about.split('.')[1]}.
                            </p>

                            {/* Stats Row */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 w-full border-t border-slate-200/60 pt-6">
                                {[
                                    [Users, faculty.stats.students, "Students Guided"],
                                    [Star, `${faculty.stats.rating}/5`, "Student Rating"],
                                    [MonitorPlay, faculty.stats.hours, "Hours of Lectures"],
                                ].map(([Icon, value, label], idx) => {
                                    const StatIcon = Icon as any;
                                    return (
                                        <div key={idx} className="flex items-center gap-3">
                                            <StatIcon className="h-8 w-8 text-orange-500 shrink-0" strokeWidth={1.5} />
                                            <div className="flex flex-col min-w-0 text-left">
                                                <span className="text-[18px] font-black text-slate-900 leading-none mb-1">{value as string}</span>
                                                <span className="text-[12px] font-medium text-slate-500 truncate leading-none">{label as string}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bullets & Quote - Far Right */}
                        <div className="hidden xl:flex flex-col gap-8 w-[320px] shrink-0 border-l border-slate-200/60 pl-8 self-stretch justify-center">
                            <div className="space-y-3">
                                {faculty.bullets.map((bullet, idx) => (
                                    <div key={idx} className="flex items-start gap-3 min-w-0">
                                        <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-orange-500 text-white mt-0.5 shadow-sm">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                        <span className="text-[14px] font-bold text-slate-700 leading-snug">{bullet}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative">
                                <Quote className="absolute top-4 left-4 h-6 w-6 text-slate-200 fill-current" />
                                <p className="text-[13px] leading-[1.6] text-slate-600 italic font-medium relative z-10 pl-6 mb-3">
                                    "{faculty.quote}"
                                </p>
                                <p className="text-right text-[12px] font-black text-slate-900">— {faculty.name}</p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* STICKY NAV TABS */}
                <section className={`w-full border-b border-slate-200 bg-white/95 backdrop-blur-md sticky z-40 shadow-sm transition-[top] duration-300 ease-in-out ${showNavbar ? "top-[64px] sm:top-[70px]" : "top-0"}`}>
                    <div className="w-full max-w-[1400px] max-w-[100vw] mx-auto flex gap-6 overflow-x-auto px-4 sm:px-5 lg:px-6 2xl:px-8 no-scrollbar">
                        {["Overview", "Courses", "Approach", "Video Lectures", "Student Reviews", "FAQs"].map((tab) => (
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

                            {/* About Section */}
                            <div className="w-full min-w-0 max-w-full">
                                <SectionHeading
                                    title={`About ${faculty.name}`}
                                    description={faculty.about}
                                />

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-2">
                                    {[
                                        [GraduationCap, faculty.experience, "Teaching Experience", "orange"],
                                        [ShieldCheck, "Ex-Civil Servant", "Administrative Experience", "blue"],
                                        [BookOpen, "Polity & Ethics", "Subject Specialization", "emerald"],
                                        [Users, faculty.stats.students, "Students Guided", "red"],
                                    ].map(([Icon, title, desc, color], idx) => {
                                        const ItemIcon = Icon as any;
                                        return (
                                            <div key={idx} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition">
                                                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-${color}-500 bg-${color}-50 border border-${color}-100`}>
                                                    <ItemIcon size={20} strokeWidth={2} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-[14px] font-black text-slate-900 truncate">{title as string}</h3>
                                                    <p className="text-[11px] font-medium text-slate-500 truncate">{desc as string}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Teaching Approach */}
                            <div className="w-full min-w-0 max-w-full">
                                <SectionHeading
                                    title="Teaching Approach"
                                    description={`${faculty.name}'s teaching methodology is designed to build strong conceptual clarity with practical examples and continuous practice.`}
                                />

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-2">
                                    {[
                                        [ShieldCheck, "Concept Clarity", "Simplified explanations with real-life examples"],
                                        [Target, "Current Affairs Integration", "Regular linkage with current events"],
                                        [FileText, "PYQ Focus", "In-depth analysis of previous year questions"],
                                        [PenTool, "Answer Writing", "Structured guidance and regular evaluation"],
                                    ].map(([Icon, title, desc], idx) => {
                                        const ItemIcon = Icon as any;
                                        return (
                                            <div key={idx} className="flex flex-col items-start text-left gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-5 transition hover:bg-white hover:shadow-md">
                                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-orange-500 bg-orange-50 border border-orange-100 mb-1">
                                                    <ItemIcon size={20} strokeWidth={2} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-[14px] font-black text-slate-900 mb-1">{title as string}</h3>
                                                    <p className="text-[12px] font-medium text-slate-500 leading-relaxed">{desc as string}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Courses by Faculty */}
                            <div className="w-full min-w-0 max-w-full">
                                <SectionHeading
                                    title={`Courses by ${faculty.name}`}
                                    description={`Learn from ${faculty.name}'s specially designed courses for UPSC CSE.`}
                                    action={
                                        <Link href="/courses" className="flex items-center gap-1 text-[13px] font-bold text-blue-600 hover:text-blue-700 transition">
                                            View All Courses <ArrowRight size={14} />
                                        </Link>
                                    }
                                />

                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-2">
                                    {facultyCourses.map((course) => (
                                        <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md w-full min-w-0" key={course.id}>
                                            <div className="relative h-[160px] overflow-hidden bg-slate-100">
                                                <img src={course.image} alt={course.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105 mix-blend-multiply opacity-90" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                                                {course.tag && (
                                                    <span className="absolute left-3 top-3 rounded-md bg-emerald-500 px-2 py-1 text-[10px] font-extrabold text-white shadow-sm uppercase tracking-wide">
                                                        {course.tag}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-col flex-1 p-5">
                                                <h3 className="min-h-[44px] text-[15px] font-black leading-[1.3] text-slate-900 mb-2">
                                                    {course.title}
                                                </h3>

                                                <div className="flex gap-2 mb-3">
                                                    <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{course.type.split("•")[0].trim()}</span>
                                                    <span className="inline-flex rounded bg-red-50 text-red-600 px-2 py-0.5 text-[10px] font-bold border border-red-100">🔥 {course.type.split("•")[1].trim()}</span>
                                                </div>

                                                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mb-4 divide-x divide-slate-200">
                                                    <div className="flex items-center gap-1 pr-2"><MonitorPlay size={12} /> {course.stats.split("•")[0].trim()}</div>
                                                    <div className="flex items-center gap-1 px-2"><FileText size={12} /> {course.stats.split("•")[1].trim()}</div>
                                                    <div className="flex items-center gap-1 pl-2"><PenTool size={12} /> {course.stats.split("•")[2].trim()}</div>
                                                </div>

                                                <div className="mt-auto flex items-end gap-2.5 mb-4">
                                                    <span className="text-[20px] font-black leading-none text-slate-900">₹{course.price.toLocaleString("en-IN")}</span>
                                                    <del className="text-[13px] font-medium text-slate-400 line-through mb-0.5">₹{course.oldPrice.toLocaleString("en-IN")}</del>
                                                    <span className="ml-auto rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-black text-emerald-600 border border-emerald-100">{course.discount}% OFF</span>
                                                </div>

                                                <button className="w-full flex h-10 items-center justify-center gap-1.5 rounded-lg bg-orange-500 text-[13px] font-bold text-white transition hover:bg-orange-600">
                                                    View Course <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Video Lectures */}
                            <div className="w-full min-w-0 max-w-full">
                                <SectionHeading
                                    title="Popular Video Lectures"
                                    description={`Watch some of ${faculty.name}'s free lectures to understand his teaching style.`}
                                    action={
                                        <Link href="#" className="flex items-center gap-1 text-[13px] font-bold text-blue-600 hover:text-blue-700 transition">
                                            View All Lectures <ArrowRight size={14} />
                                        </Link>
                                    }
                                />

                                <div className="relative w-full group mt-2">
                                    <button className="absolute left-0 lg:-left-5 top-1/2 -translate-y-1/2 z-10 hidden h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md lg:grid hover:bg-slate-50 transition">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button className="absolute right-0 lg:-right-5 top-1/2 -translate-y-1/2 z-10 hidden h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md lg:grid hover:bg-slate-50 transition">
                                        <ChevronRight size={20} />
                                    </button>

                                    <div className="flex max-w-full overflow-x-auto gap-5 pb-4 no-scrollbar snap-x w-full min-w-0">
                                        {videoLectures.map((video) => (
                                            <article key={video.id} className="w-[280px] sm:w-[300px] shrink-0 snap-start flex flex-col group cursor-pointer min-w-0">
                                                <div className="relative h-[160px] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 mb-3 shadow-sm">
                                                    <img src={video.image} alt={video.title} className="h-full w-full object-cover opacity-60 mix-blend-luminosity group-hover:scale-105 transition duration-500" />
                                                    <div className="absolute inset-0 grid place-items-center">
                                                        <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-white bg-transparent text-white backdrop-blur-sm transition group-hover:bg-orange-500 group-hover:border-orange-500 shadow-lg">
                                                            <Play className="ml-1" fill="white" size={20} />
                                                        </div>
                                                    </div>
                                                    <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
                                                        {video.duration}
                                                    </span>
                                                </div>
                                                <h4 className="text-[14px] font-black text-slate-900 leading-snug truncate">{video.title}</h4>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN - STICKY SIDEBAR */}
                        <div className="w-full 2xl:w-[360px] max-w-full shrink-0 relative">
                            <div className="sticky top-[100px] flex flex-col gap-6 w-full max-w-full min-w-0">

                                {/* Top Course Promo Card */}
                                <div className="rounded-2xl border border-orange-200 bg-[#fff9f2] shadow-xl shadow-orange-100/50 overflow-hidden w-full max-w-full min-w-0">
                                    <div className="bg-orange-100 px-5 py-3 flex items-center justify-center border-b border-orange-200 gap-2 text-center">
                                        <div className="grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-white shrink-0">
                                            <Award size={12} />
                                        </div>
                                        <div className="text-[13px] font-black text-orange-800">
                                            Learn from India's Top {faculty.subject.split("&")[0].trim()} Faculty
                                        </div>
                                    </div>

                                    <div className="p-5 sm:p-6 w-full bg-white">
                                        <div className="flex flex-wrap items-end gap-x-3 gap-y-1 mb-6 w-full">
                                            <span className="text-[36px] font-black leading-none text-slate-900">
                                                ₹12,999
                                            </span>
                                            <del className="text-[15px] font-semibold text-slate-400 mb-1">
                                                ₹18,999
                                            </del>
                                            <span className="rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-black text-emerald-700 mb-1 ml-auto shrink-0">
                                                32% OFF
                                            </span>
                                        </div>

                                        <button className="w-full flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 text-[15px] font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 mb-4">
                                            Enroll in {faculty.subject.split("&")[0].trim()} Course <ArrowRight size={16} />
                                        </button>

                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <button className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-[12px] sm:text-[13px] font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 min-w-0 px-2 shadow-sm">
                                                <ShoppingCart size={16} className="shrink-0" /> <span className="truncate">Add to Cart</span>
                                            </button>
                                            <button className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-[12px] sm:text-[13px] font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 min-w-0 px-2 shadow-sm">
                                                <Download size={16} className="shrink-0" /> <span className="truncate">Brochure</span>
                                            </button>
                                        </div>

                                        <div className="space-y-3 pt-5 border-t border-slate-100">
                                            {[
                                                "Live + Recorded Classes",
                                                "12+ Months Validity",
                                                "Access on Web, Android & iOS",
                                                "Certificate of Completion",
                                                "Doubt Clearing Support",
                                                "30 Days Money Back Guarantee"
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

                                {/* What Students Say */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm w-full mt-2">
                                    <div className="flex items-center justify-between gap-4 mb-4">
                                        <h3 className="text-[18px] font-black text-slate-900 leading-tight">What Students Say</h3>
                                        <Link href="#" className="flex items-center gap-1 text-[12px] font-bold text-blue-600 hover:text-blue-700 transition shrink-0">
                                            View All Reviews <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                    <p className="text-[13px] text-slate-500 mb-6 font-medium">Reviews and feedback from aspirants who learned from {faculty.name}.</p>

                                    <div className="relative group">
                                        <button className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md hover:bg-slate-50 transition">
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md hover:bg-slate-50 transition">
                                            <ChevronRight size={16} />
                                        </button>

                                        <article className="flex min-w-0 max-w-full flex-col rounded-xl border border-slate-100 bg-slate-50 p-5 w-full relative">
                                            <Quote className="absolute top-4 left-4 h-6 w-6 text-slate-200 fill-current" />
                                            <p className="min-h-[60px] text-[13px] leading-[1.6] text-slate-600 italic font-medium relative z-10 pl-5 mb-4">"{testimonials[0].quote}"</p>

                                            <div className="flex items-center gap-3 border-t border-slate-200/60 pt-4 min-w-0">
                                                <img src={testimonials[0].image} alt={testimonials[0].name} className="h-10 w-10 shrink-0 rounded-full object-cover border border-slate-200" />
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <div className="flex text-orange-400 mb-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={10} fill="currentColor" />
                                                        ))}
                                                    </div>
                                                    <strong className="block text-[13px] font-black text-slate-900 truncate leading-tight">{testimonials[0].name}</strong>
                                                    <span className="block text-[11px] font-semibold text-slate-500 truncate">{testimonials[0].exam}</span>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                </div>

                                {/* More From Faculty Resource List */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm w-full mt-2">
                                    <h3 className="text-[18px] font-black text-slate-900 mb-5">More from {faculty.name}</h3>

                                    <div className="flex flex-col gap-3">
                                        {[
                                            [MonitorPlay, "Free Demo Lecture", "Introduction to Polity", "blue"],
                                            [FileText, "Study Notes Sample", "Fundamental Rights PDF", "emerald"],
                                            [PenTool, "Answer Writing Session", "UPSC Mains Strategy", "orange"],
                                            [BarChart3, "Current Affairs Discussion", "Recent Constitutional Amendments", "red"]
                                        ].map(([Icon, title, desc, color], idx) => {
                                            const ItemIcon = Icon as any;
                                            return (
                                                <Link href="#" key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition group">
                                                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-${color}-500 bg-${color}-50 border border-${color}-100 transition-transform group-hover:scale-105`}>
                                                        <ItemIcon size={18} strokeWidth={2} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-[13px] font-black text-slate-900 truncate">{title as string}</h4>
                                                        <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">{desc as string}</p>
                                                    </div>
                                                    <ChevronRight size={16} className="text-slate-400 group-hover:text-orange-500 transition-colors shrink-0" />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA Banner */}
                <section className="w-full bg-orange-50 border-t border-orange-100 overflow-hidden relative">
                    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8 py-10 lg:py-0 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:min-h-[160px]">

                        <div className="flex items-center gap-6 lg:gap-10 w-full min-w-0">
                            <div className="w-[180px] lg:w-[220px] shrink-0 hidden sm:block self-end relative top-[20px]">
                                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80" alt="Students learning" className="w-full h-auto object-contain mix-blend-multiply opacity-90" />
                            </div>

                            <div className="flex-1 flex flex-col text-center sm:text-left py-6 min-w-0">
                                <h2 className="text-[24px] sm:text-[28px] font-black leading-tight text-slate-900 mb-2 truncate">
                                    Learn <span className="text-orange-500">{faculty.subject.split("&")[0].trim()}</span> from the Best
                                </h2>
                                <h3 className="text-[18px] sm:text-[20px] font-black leading-tight text-slate-800 mb-3 truncate">
                                    Start your UPSC journey with {faculty.name}
                                </h3>
                                <p className="text-[14px] sm:text-[15px] text-slate-600 font-medium truncate">
                                    Join thousands of aspirants and build a strong foundation in {faculty.subject.split("&")[0].trim()}.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center sm:justify-start gap-4 shrink-0 lg:w-auto py-6">
                            <button className="flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 sm:px-8 text-[14px] sm:text-[15px] font-black text-white shadow-md hover:bg-orange-600 transition min-w-[160px]">
                                Enroll Now <ArrowRight size={16} />
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