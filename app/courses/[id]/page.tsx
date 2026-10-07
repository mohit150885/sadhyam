"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useParams, usePathname } from "next/navigation";
import {
    ArrowRight,
    CalendarCheck,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Download,
    FileText,
    Menu,
    MessageCircle,
    Mic,
    MonitorPlay,
    Phone,
    Play,
    Quote,
    Search,
    ShieldCheck,
    ShoppingCart,
    Star,
    Target,
    UserRound,
    Users,
    X,
    Clock4,
    BarChart3
} from "lucide-react";
import Link from "next/link";

// --- Mock Database from Listing Page ---
const courses = [
    {
        id: 1,
        title: "UPSC Pre + Mains Complete Course 2025",
        category: "UPSC",
        instructor: "Expert Faculty Team",
        lectures: "500+ Lectures",
        pdfs: "200+ PDFs",
        validity: "1 Year Validity",
        rating: 4.8,
        reviews: "3.2k",
        price: 12999,
        oldPrice: 19999,
        discount: 35,
        image: "https://images.unsplash.com/photo-1585828068970-1b5e28230528?auto=format&fit=crop&w=1600&q=80",
        type: "Foundation Course",
    },
    {
        id: 2,
        title: "UPPSC Foundation Course 2025",
        category: "UPPSC",
        instructor: "Dr. A. Kumar & Team",
        lectures: "300+ Lectures",
        pdfs: "150+ PDFs",
        validity: "1 Year Validity",
        rating: 4.7,
        reviews: "1.8k",
        price: 8999,
        oldPrice: 14999,
        discount: 40,
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80",
        type: "Foundation Course",
    },
    {
        id: 3,
        title: "RAS Complete Course 2025",
        category: "RAS",
        instructor: "S. Sharma & Team",
        lectures: "350+ Lectures",
        pdfs: "180+ PDFs",
        validity: "1 Year Validity",
        rating: 4.6,
        reviews: "1.2k",
        price: 9999,
        oldPrice: 15999,
        discount: 37,
        image: "https://images.unsplash.com/photo-1596522513974-98da69389e7c?auto=format&fit=crop&w=1600&q=80",
        type: "Foundation Course",
    },
    {
        id: 4,
        title: "UPSC Optional (History) 2025",
        category: "UPSC",
        instructor: "Prof. N. Singh",
        lectures: "250+ Lectures",
        pdfs: "100+ PDFs",
        validity: "1 Year Validity",
        rating: 4.8,
        reviews: "980",
        price: 6999,
        oldPrice: 11999,
        discount: 42,
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80",
        type: "Optional Course",
    },
    {
        id: 5,
        title: "Current Affairs 2025 (Pre + Mains)",
        category: "Other Exams",
        instructor: "Editorial Team",
        lectures: "100+ Lectures",
        pdfs: "100+ PDFs",
        validity: "1 Year Validity",
        rating: 4.8,
        reviews: "2.1k",
        price: 4999,
        oldPrice: 7999,
        discount: 38,
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=80",
        type: "Current Affairs",
    },
    {
        id: 6,
        title: "UPPSC Mains Answer Writing Program",
        category: "UPPSC",
        instructor: "Dr. R. Verma",
        lectures: "200+ Lectures",
        pdfs: "50+ PDFs",
        validity: "1 Year Validity",
        rating: 4.7,
        reviews: "860",
        price: 3999,
        oldPrice: 6999,
        discount: 43,
        image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80",
        type: "Answer Writing",
    },
    {
        id: 7,
        title: "UKPSC Complete Course 2025",
        category: "UKPSC",
        instructor: "Expert Faculty Team",
        lectures: "250+ Lectures",
        pdfs: "120+ PDFs",
        validity: "1 Year Validity",
        rating: 4.6,
        reviews: "640",
        price: 7999,
        oldPrice: 12999,
        discount: 38,
        image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1600&q=80",
        type: "Foundation Course",
    },
    {
        id: 8,
        title: "SSC CGL Complete Course 2025",
        category: "SSC",
        instructor: "P. Mishra & Team",
        lectures: "300+ Lectures",
        pdfs: "150+ PDFs",
        validity: "1 Year Validity",
        rating: 4.8,
        reviews: "1.4k",
        price: 6499,
        oldPrice: 9999,
        discount: 35,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
        type: "Foundation Course",
    },
    {
        id: 9,
        title: "Banking (IBPS/IBPS PO) Complete Course",
        category: "Banking",
        instructor: "A. Gupta & Team",
        lectures: "400+ Lectures",
        pdfs: "200+ PDFs",
        validity: "1 Year Validity",
        rating: 4.7,
        reviews: "920",
        price: 5999,
        oldPrice: 9999,
        discount: 40,
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
        type: "Foundation Course",
    },
    {
        id: 10,
        title: "Ethics, Essay & GS IV Program",
        category: "UPSC",
        instructor: "Dr. P. Sharma",
        lectures: "150+ Lectures",
        pdfs: "80+ PDFs",
        validity: "1 Year Validity",
        rating: 4.6,
        reviews: "620",
        price: 4499,
        oldPrice: 7499,
        discount: 40,
        image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1600&q=80",
        type: "Foundation Course",
    },
    {
        id: 11,
        title: "Science & Tech for UPSC 2025",
        category: "UPSC",
        instructor: "Expert Faculty Team",
        lectures: "120+ Lectures",
        pdfs: "60+ PDFs",
        validity: "1 Year Validity",
        rating: 4.5,
        reviews: "480",
        price: 3999,
        oldPrice: 6999,
        discount: 43,
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80",
        type: "Optional Course",
    },
    {
        id: 12,
        title: "Environment & Ecology 2025",
        category: "Other Exams",
        instructor: "S. Tiwari",
        lectures: "100+ Lectures",
        pdfs: "50+ PDFs",
        validity: "1 Year Validity",
        rating: 4.6,
        reviews: "510",
        price: 3499,
        oldPrice: 5999,
        discount: 42,
        image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1600&q=80",
        type: "Current Affairs",
    }
];

const syllabusData = [
    { id: 1, title: "Indian Polity", details: "68 Lectures • 20 PDFs • 15 Tests" },
    { id: 2, title: "Modern History", details: "72 Lectures • 18 PDFs • 20 Tests" },
    { id: 3, title: "Ancient & Medieval History", details: "60 Lectures • 16 PDFs • 12 Tests" },
    { id: 4, title: "Geography", details: "80 Lectures • 25 PDFs • 18 Tests" },
    { id: 5, title: "Indian Economy", details: "65 Lectures • 20 PDFs • 15 Tests" },
    { id: 6, title: "Environment & Ecology", details: "40 Lectures • 14 PDFs • 12 Tests" },
];

const facultyMembers = [
    {
        id: 1,
        name: "Dr. A. Kumar",
        subject: "Polity",
        experience: "15+ Years Experience",
        bullets: ["Ex- Civil Servant", "5000+ Students Guided", "Specialist in Polity & Ethics"],
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 2,
        name: "Prof. N. Singh",
        subject: "Geography",
        experience: "12+ Years Experience",
        bullets: ["NTA & State Exams Expert", "Maps & Diagrams Specialist", "Interactive Teaching Style"],
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 3,
        name: "S. Sharma",
        subject: "History",
        experience: "10+ Years Experience",
        bullets: ["In-depth Subject Knowledge", "Story-based Learning", "Focus on PYQs & Trends"],
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 4,
        name: "R. Verma",
        subject: "Economy",
        experience: "14+ Years Experience",
        bullets: ["Concept-driven Approach", "Current Affairs Integration", "Simplified Economic Concepts"],
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    },
];

const testimonials = [
    {
        name: "Aditi Sharma",
        exam: "Selected Candidate",
        quote: "The structured notes and regular tests helped me build a strong foundation. The faculty explains every concept so clearly.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    },
    {
        name: "Rohit Yadav",
        exam: "Top Scorer",
        quote: "The current affairs coverage and answer writing practice was excellent. SadhyamIAS truly understands the needs of aspirants.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
    },
    {
        name: "Priya Singh",
        exam: "Selected Candidate",
        quote: "Mentorship sessions gave me the confidence to keep going. Highly recommended for serious aspirants.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
    }
];

const faqs = [
    { q: "What is the validity of this course?", a: "The course is valid as per the duration mentioned in the course highlights from the date of purchase." },
    { q: "Will I get access to all subjects?", a: "Yes, this course covers the complete syllabus for the topics mentioned." },
    { q: "Are the lectures live or recorded?", a: "This course offers a mix of Live Interactive classes and Recorded video lectures depending on the subject." },
    { q: "Is there any doubt clearing support?", a: "Yes, you get access to dedicated doubt-clearing sessions and a private community." },
    { q: "Can I get a refund if not satisfied?", a: "We offer a 30-day money-back guarantee if you are not satisfied with the course content." },
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

export default function CourseDetailsPage() {
    // Dynamic Routing Parameters
    const params = useParams();
    const currentId = Number(params?.id) || 1; // Extracts the ID from /courses/1

    // Find the specific course from the combined database
    const baseCourse = courses.find(c => c.id === currentId) || courses[0];

    // Generate Dynamic Course Details
    const courseData = {
        title: baseCourse.title,
        category: baseCourse.category,
        breadcrumbs: ["Home", "Courses", baseCourse.category, baseCourse.title],
        tags: [baseCourse.category, baseCourse.type],
        description: `A comprehensive, structured and exam-focused course to help you build a strong foundation for ${baseCourse.category} exams with expert guidance, detailed notes, practice tests and personal mentorship by ${baseCourse.instructor}.`,
        stats: [
            { icon: Users, value: baseCourse.reviews, label: "Students Enrolled" },
            { icon: MonitorPlay, value: baseCourse.lectures, label: "Video Lectures" },
            { icon: CalendarCheck, value: baseCourse.validity, label: "Validity" },
            { icon: Star, value: `${baseCourse.rating}/5`, label: "Student Rating" },
        ],
        price: baseCourse.price,
        oldPrice: baseCourse.oldPrice,
        discount: baseCourse.discount,
        image: baseCourse.image,
        features: [
            baseCourse.validity,
            "Access on Web, Android & iOS",
            "Certificate of Completion",
            "Doubt Clearing Support",
            "30 Days Money Back Guarantee",
        ],
        whatYouGet: [
            `${baseCourse.lectures} of high-quality video lectures`,
            `${baseCourse.pdfs} of comprehensive notes`,
            "Chapter-wise & subject-wise tests",
            "Current affairs integration",
            "Answer writing practice with evaluation",
            "Mentorship and doubt clearing sessions",
            "Access on web, Android & iOS",
            baseCourse.validity,
        ],
    };

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
        if (openSyllabus.length === syllabusData.length) setOpenSyllabus([]);
        else setOpenSyllabus(syllabusData.map(s => s.id));
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
                        {/* Dynamic Background Image */}
                        <img
                            src={courseData.image}
                            alt="Course Background"
                            className="block h-full w-full max-w-full object-cover object-center opacity-40 mix-blend-luminosity"
                        />
                    </div>
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#021424]/95 via-[#021424]/80 to-[#021424]/30" />

                    <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8 py-10">
                        <div className="max-w-[760px] text-white">
                            <div className="mb-5 flex flex-wrap gap-2 text-[12px] font-medium text-white/70">
                                {courseData.breadcrumbs.map((crumb, idx) => (
                                    <span key={idx} className="flex items-center gap-2">
                                        <span className={idx === courseData.breadcrumbs.length - 1 ? "text-white font-bold" : ""}>{crumb}</span>
                                        {idx < courseData.breadcrumbs.length - 1 && <span>›</span>}
                                    </span>
                                ))}
                            </div>

                            <div className="mb-5 flex flex-wrap gap-3">
                                {courseData.tags.map((tag, i) => (
                                    <span key={i} className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-black shadow-sm ${i === 0 ? "bg-white text-slate-800" : "border border-red-500/30 bg-red-500/20 text-red-200 backdrop-blur-md items-center gap-1.5"}`}>
                                        {i === 1 && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Dynamic Title */}
                            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-[46px] max-w-[650px]">
                                {courseData.title}
                            </h1>

                            <p className="mt-4 max-w-[600px] text-[15px] sm:text-[16px] font-medium leading-relaxed text-white/90">
                                {courseData.description}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-5 text-[13px] font-semibold text-white/90">
                                {courseData.stats.map((stat, idx) => {
                                    const StatIcon = stat.icon as any;
                                    return (
                                        <div key={idx} className="flex items-center gap-3">
                                            <StatIcon className="h-6 w-6 text-orange-500 shrink-0" />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[16px] font-black text-white leading-none mb-1">{stat.value}</span>
                                                <span className="text-[11px] text-white/70 truncate">{stat.label}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Video Preview Play Button - Right Side */}
                        <div className="hidden 2xl:flex flex-col items-center justify-center absolute right-[15%] top-1/2 -translate-y-1/2 z-20 cursor-pointer group/play">
                            <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-slate-900 transition-all group-hover/play:scale-110 group-hover/play:text-orange-500 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                                <Play size={26} fill="currentColor" className="ml-1.5" />
                            </div>
                            <span className="mt-4 text-[14px] font-bold text-white shadow-sm text-center">Watch Preview</span>
                        </div>

                        {/* Background Decor */}
                        <div className="hidden items-center gap-8 2xl:flex absolute right-[5%] top-[20%] opacity-80 pointer-events-none">
                            <div className="rotate-[-6deg] font-serif text-[42px] italic leading-[1.1] text-slate-200/90 text-right drop-shadow-xl">
                                Sapna <br /> Taiyaari <br /> Prayas <br />
                                <span className="text-orange-400">Seva</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STICKY NAV TABS */}
                <section className={`w-full border-b border-slate-200 bg-white/95 backdrop-blur-md sticky z-40 shadow-sm transition-[top] duration-300 ease-in-out ${showNavbar ? "top-[64px] sm:top-[70px]" : "top-0"}`}>
                    <div className="w-full max-w-[1400px] max-w-[100vw] mx-auto flex gap-5 overflow-x-auto px-4 sm:px-5 lg:px-6 2xl:px-8 no-scrollbar">
                        {["Overview", "Syllabus", "Faculty", "Batch Details", "Reviews", "FAQs"].map((tab) => (
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

                {/* MAIN CONTENT 2-COLUMN LAYOUT (FLEXBOX FOR SAFE FIT) */}
                <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8 py-10 lg:py-12 bg-slate-50/20">
                    <div className="flex flex-col 2xl:flex-row gap-8 2xl:gap-10 items-start w-full min-w-0">

                        {/* LEFT COLUMN - CONTENT */}
                        <div className="flex-1 w-full min-w-0 flex flex-col gap-10">

                            {/* Why Choose This Course */}
                            <div className="w-full min-w-0 max-w-full">
                                <SectionHeading
                                    title={<>Why Choose <span className="text-orange-500">This Course?</span></>}
                                    description={`This ${courseData.title} is designed for aspirants at all stages of their preparation. It covers the entire syllabus in a structured manner with concept clarity, current affairs integration, answer writing practice and regular tests.`}
                                />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {[
                                        [ShieldCheck, "Structured Learning", "Complete syllabus coverage", "red"],
                                        [UserRound, "Expert Faculty", `Learn from ${baseCourse.instructor}`, "orange"],
                                        [ClipboardList, "Regular Tests", "Chapter-wise & full-length", "orange"],
                                        [Users, "Personal Guidance", "Doubt support & mentorship", "orange"],
                                    ].map(([Icon, title, desc, color], idx) => {
                                        const ItemIcon = Icon as any;
                                        return (
                                            <div key={idx} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                                                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-${color}-500 bg-${color}-50 border border-${color}-100`}>
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

                            {/* What You Will Get */}
                            <div className="w-full min-w-0 max-w-full">
                                <h2 className="text-[24px] font-black tracking-tight text-slate-900 sm:text-[28px] mb-6">
                                    What You Will Get
                                </h2>
                                <div className="grid gap-y-4 gap-x-6 sm:grid-cols-2">
                                    {courseData.whatYouGet.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3 min-w-0">
                                            <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-orange-500 text-white mt-0.5 shadow-sm">
                                                <Check size={12} strokeWidth={4} />
                                            </div>
                                            <span className="text-[14px] font-medium text-slate-600 leading-snug">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Course Syllabus */}
                            <div className="w-full min-w-0 max-w-full">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                    <h2 className="text-[24px] font-black tracking-tight text-slate-900 sm:text-[28px]">
                                        Course Syllabus
                                    </h2>
                                    <button
                                        onClick={expandAllSyllabus}
                                        className="text-[13px] font-bold text-blue-600 hover:text-blue-700 hover:underline transition"
                                    >
                                        {openSyllabus.length === syllabusData.length ? "Collapse All" : "Expand All"}
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3 w-full">
                                    {syllabusData.map((item) => {
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
                                                        <div className="min-w-0">
                                                            <h3 className="text-[15px] font-black text-slate-900 truncate">{item.title}</h3>
                                                            <p className="mt-1 text-[13px] font-medium text-slate-500 truncate">{item.details}</p>
                                                        </div>
                                                    </div>
                                                    <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                                </button>
                                                {isOpen && (
                                                    <div className="border-t border-slate-100 bg-slate-50 p-5 text-[14px] text-slate-600">
                                                        <ul className="list-inside list-disc space-y-2 font-medium">
                                                            <li>Detailed breakdown of {item.title} topics.</li>
                                                            <li>Coverage of previous year questions.</li>
                                                            <li>Live answer writing and discussion.</li>
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
                                            <Clock4 size={14} /> Offer ends in 3 days
                                        </div>
                                    </div>

                                    <div className="p-5 sm:p-6 w-full">
                                        <div className="flex flex-wrap items-end gap-x-3 gap-y-1 mb-6 w-full">
                                            <span className="text-[32px] sm:text-[36px] font-black leading-none text-slate-900">
                                                ₹{courseData.price.toLocaleString("en-IN")}
                                            </span>
                                            <del className="text-[14px] sm:text-[15px] font-semibold text-slate-400 mb-1">
                                                ₹{courseData.oldPrice.toLocaleString("en-IN")}
                                            </del>
                                            <span className="rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-black text-emerald-700 mb-1 ml-auto shrink-0">
                                                {courseData.discount}% OFF
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
                                            {courseData.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-2.5 min-w-0">
                                                    <div className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-slate-300 text-slate-400 mt-0.5">
                                                        <Check size={10} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-[12px] font-medium text-slate-600 leading-tight">{feature}</span>
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

                                {/* Start Journey Banner */}
                                <div className="rounded-xl overflow-hidden bg-orange-50/80 border border-orange-100 shadow-sm w-full flex items-center p-4 gap-4">
                                    <div className="w-[100px] shrink-0">
                                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80" alt="Student" className="block w-full max-w-full h-auto object-contain rounded-md mix-blend-multiply opacity-90" />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col items-start">
                                        <h4 className="text-[14px] font-black leading-tight text-slate-900 mb-3">
                                            Start Your {baseCourse.category} Journey with SadhyamIAS
                                        </h4>
                                        <button className="h-8 rounded-md bg-orange-500 px-4 text-[12px] font-bold text-white shadow-sm hover:bg-orange-600 transition">
                                            Get Started
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* FULL WIDTH SECTION: Learn from India's Best Faculty */}
                <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8 pb-12 lg:pb-16 relative">
                    <SectionHeading
                        title={<>Learn from India's <span className="text-orange-500">Best Faculty</span></>}
                        description="Our experienced mentors bring years of teaching and mentoring experience to help you succeed in your exams."
                        action="View All Faculty"
                    />

                    <div className="relative w-full group">
                        <button className="absolute left-0 lg:-left-5 top-1/2 -translate-y-[calc(50%+12px)] z-10 hidden h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md 2xl:grid hover:bg-slate-50 transition">
                            <ChevronLeft size={22} />
                        </button>
                        <button className="absolute right-0 lg:-right-5 top-1/2 -translate-y-[calc(50%+12px)] z-10 hidden h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md 2xl:grid hover:bg-slate-50 transition">
                            <ChevronRight size={22} />
                        </button>

                        <div className="flex max-w-full overflow-x-auto gap-5 pb-6 no-scrollbar snap-x w-full min-w-0">
                            {facultyMembers.map((f) => (
                                <article key={f.id} className="w-[260px] sm:w-[280px] shrink-0 snap-start flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                    <div className="relative h-[160px] bg-slate-100 overflow-hidden">
                                        <img src={f.image} alt={f.name} className="block h-full w-full max-w-full object-cover object-top" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                        <button className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full border border-white bg-slate-900/40 text-white backdrop-blur-md transition hover:scale-110 hover:bg-orange-500 hover:border-orange-500">
                                            <Play className="ml-0.5" fill="white" size={14} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col flex-1 p-5">
                                        <h4 className="text-[16px] font-black text-slate-900">{f.name}</h4>
                                        <p className="text-[12px] font-semibold text-slate-500 mt-0.5">{f.subject}</p>
                                        <div className="mt-2 text-[13px] font-bold text-slate-800">{f.experience}</div>

                                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                                            {f.bullets.slice(0, 3).map((bullet, i) => (
                                                <div key={i} className="flex items-start gap-2 text-[11px] font-medium text-slate-600">
                                                    <div className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border border-orange-400 text-orange-500 mt-0.5">
                                                        <Check size={8} strokeWidth={3} />
                                                    </div>
                                                    <span className="leading-tight">{bullet}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Course Highlights Banner (Full Width Dark Section) */}
                <section className="w-full bg-slate-950 text-white overflow-hidden relative">
                    <div className="absolute inset-0 z-0">
                        <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=80" alt="Books overlay" className="block h-full w-full max-w-full object-cover opacity-20 mix-blend-luminosity" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
                    </div>

                    <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-16 lg:px-10">
                        <h2 className="text-[28px] font-black tracking-tight sm:text-[36px] mb-10">
                            Course <span className="text-orange-500">Highlights</span><br />
                            <span className="text-[15px] font-medium text-slate-300 mt-2 block sm:text-[16px]">A complete ecosystem to support your {baseCourse.category} journey.</span>
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 max-w-[1000px]">
                            {[
                                [MonitorPlay, baseCourse.lectures.split(" ")[0], "Video Lectures"],
                                [FileText, baseCourse.pdfs.split(" ")[0], "PDF Notes"],
                                [ClipboardList, "50+", "Chapter-wise Tests"],
                                [Target, "20+", "Full Length Tests"],
                                [Users, "Live Doubt", "Clearing Sessions"],
                                [BarChart3, "Performance", "Analytics"],
                            ].map(([Icon, title, desc], idx) => {
                                const ItemIcon = Icon as any;
                                return (
                                    <div key={idx} className="flex flex-col gap-3 sm:gap-4 min-w-0">
                                        <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 shrink-0">
                                            <ItemIcon size={24} className="sm:h-7 sm:w-7" />
                                        </div>
                                        <div className="min-w-0">
                                            <strong className="block text-[18px] sm:text-[20px] font-black leading-tight text-white mb-1 truncate">{title as string}</strong>
                                            <span className="block text-[12px] sm:text-[13px] font-medium text-slate-400 truncate">{desc as string}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Student Reviews (Full Width Container) */}
                <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8 py-16">
                    <SectionHeading
                        title={<>Student <span className="text-orange-500">Reviews</span></>}
                        description="See what our learners have to say about their experience with SadhyamIAS."
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

                {/* FAQs and Help (2 Columns) */}
                <section className="w-full bg-slate-50/70 border-t border-slate-200 py-16">
                    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 2xl:px-8">
                        <div className="flex flex-col 2xl:flex-row gap-12 items-start w-full min-w-0">

                            {/* FAQ Accordion */}
                            <div className="flex-1 w-full min-w-0">
                                <SectionHeading
                                    title={<>Frequently <span className="text-orange-500">Asked Questions</span></>}
                                    description="Get answers to common questions about this course."
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

                            {/* Help Box */}
                            <div className="w-full 2xl:w-[360px] 2xl:mt-[96px] flex flex-col gap-6 shrink-0 relative">
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm w-full">
                                    <h3 className="text-[18px] sm:text-[20px] font-black text-slate-900 mb-2 sm:mb-3">Need More Information?</h3>
                                    <p className="text-[13px] sm:text-[14px] text-slate-500 mb-6 font-medium leading-relaxed">
                                        Talk to our counsellors and get personalised guidance for your preparation.
                                    </p>
                                    <div className="flex flex-col sm:flex-row 2xl:flex-col gap-3 w-full">
                                        <button className="flex flex-1 h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 text-[14px] sm:text-[15px] font-bold text-white shadow-md hover:bg-orange-600 transition min-w-0">
                                            <Phone size={18} className="shrink-0" /> <span className="truncate">Talk to Expert</span>
                                        </button>
                                        <button className="flex flex-1 h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-emerald-500 text-[14px] sm:text-[15px] font-bold text-emerald-600 hover:bg-emerald-50 transition min-w-0">
                                            <MessageCircle size={18} className="shrink-0" /> <span className="truncate">Chat on WhatsApp</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-2xl overflow-hidden relative bg-slate-900 p-6 sm:p-8 flex flex-col justify-center h-[140px] sm:h-[160px] shadow-sm w-full">
                                    <div className="relative z-10">
                                        <h4 className="text-[18px] sm:text-[20px] font-black leading-tight text-white mb-1">
                                            Your Journey
                                        </h4>
                                        <h4 className="text-[18px] sm:text-[20px] font-black leading-tight text-white">
                                            to {baseCourse.category} Starts Here
                                        </h4>
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80" alt="Journey" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="w-full bg-orange-50 py-10 sm:py-12 border-t border-orange-100 overflow-hidden relative">
                    <div className="absolute left-[5%] bottom-0 h-[180px] w-auto hidden lg:block opacity-90 mix-blend-multiply">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80" alt="Students learning" className="h-full object-contain" />
                    </div>

                    <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center text-center px-4 sm:px-6 lg:px-10 relative z-10">
                        <h2 className="text-[28px] sm:text-[36px] font-black leading-tight text-slate-900">
                            Ready to Start <span className="text-orange-500">Your Journey?</span>
                        </h2>
                        <p className="mt-3 max-w-[600px] text-[15px] sm:text-[16px] leading-[1.6] text-slate-600 font-medium">
                            Join thousands of aspirants who trust SadhyamIAS for their preparation.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 sm:px-8 text-[14px] sm:text-[15px] font-black text-white shadow-md hover:bg-orange-600 transition">
                                Enroll Now <ArrowRight size={16} />
                            </button>
                            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-slate-800 bg-transparent px-6 sm:px-8 text-[14px] sm:text-[15px] font-black text-slate-800 hover:bg-slate-800 hover:text-white transition">
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