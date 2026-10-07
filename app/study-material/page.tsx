"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    FileText,
    GraduationCap,
    Menu,
    Search,
    ShoppingCart,
    SlidersHorizontal,
    Star,
    UserRound,
    X,
    Mic,
    Clock,
    List,
    Target,
    BookMarked,
    RefreshCcw,
    Layers,
    BadgeIndianRupee
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type StudyMaterial = {
    id: number;
    title: string;
    category: string;
    subject: string;
    instructor: string;
    pages: string;
    updated: string;
    format: string;
    focus: string;
    rating: number;
    reviews: string;
    price: number;
    oldPrice: number;
    discount: number;
    image: string;
    badge?: string;
    type: string;
};

const examTabs = [
    "All Study Material",
    "UPSC",
    "UPPSC",
    "UKPSC",
    "RAS",
    "SSC",
    "Banking",
    "Other Exams",
];

const studyMaterials: StudyMaterial[] = [
    {
        id: 1,
        title: "Indian Polity Complete Notes (Handwritten Style)",
        category: "UPSC",
        subject: "Polity",
        instructor: "Expert Faculty Team",
        pages: "250+ Pages",
        updated: "Updated 2025",
        format: "Chapter-wise",
        focus: "Exam Focused",
        rating: 4.8,
        reviews: "3.2k",
        price: 299,
        oldPrice: 499,
        discount: 40,
        image: "https://images.unsplash.com/photo-1585828068970-1b5e28230528?auto=format&fit=crop&w=600&q=80",
        badge: "Bestseller",
        type: "Notes",
    },
    {
        id: 2,
        title: "Geography Handwritten Notes 2025",
        category: "UPSC",
        subject: "Geography",
        instructor: "Dr. A. Kumar & Team",
        pages: "300+ Pages",
        updated: "Updated 2025",
        format: "Maps & Diagrams",
        focus: "Exam Focused",
        rating: 4.7,
        reviews: "1.8k",
        price: 249,
        oldPrice: 449,
        discount: 44,
        image: "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&w=600&q=80",
        badge: "New",
        type: "Notes",
    },
    {
        id: 3,
        title: "Modern History Short Notes",
        category: "UPPSC",
        subject: "History",
        instructor: "S. Sharma & Team",
        pages: "200+ Pages",
        updated: "Updated 2025",
        format: "Timeline & Charts",
        focus: "Quick Revision",
        rating: 4.6,
        reviews: "1.2k",
        price: 199,
        oldPrice: 349,
        discount: 43,
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
        type: "Short Notes",
    },
    {
        id: 4,
        title: "Current Affairs Magazine (2025)",
        category: "Other Exams",
        subject: "Current Affairs",
        instructor: "Editorial Team",
        pages: "Monthly PDFs",
        updated: "Topic-wise Coverage",
        format: "MCQs Included",
        focus: "Exam Focused",
        rating: 4.8,
        reviews: "2.1k",
        price: 99,
        oldPrice: 199,
        discount: 50,
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80",
        type: "Current Affairs",
    },
    {
        id: 5,
        title: "Economy Short Notes & Revision PDFs",
        category: "UPSC",
        subject: "Economy",
        instructor: "R. Verma",
        pages: "180+ Pages",
        updated: "Concepts & Charts",
        format: "Updated 2025",
        focus: "Easy Language",
        rating: 4.7,
        reviews: "980",
        price: 199,
        oldPrice: 349,
        discount: 43,
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80",
        type: "Short Notes",
    },
    {
        id: 6,
        title: "Environment & Ecology Handwritten Notes",
        category: "UKPSC",
        subject: "Environment",
        instructor: "P. Mishra",
        pages: "150+ Pages",
        updated: "Diagrams & Maps",
        format: "Updated 2025",
        focus: "PYQ Analysis",
        rating: 4.6,
        reviews: "860",
        price: 179,
        oldPrice: 299,
        discount: 40,
        image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=600&q=80",
        type: "Notes",
    },
    {
        id: 7,
        title: "Answer Writing Material (UPSC Mains)",
        category: "UPSC",
        subject: "Ethics",
        instructor: "Expert Faculty Team",
        pages: "Model Answers",
        updated: "Structure & Strategy",
        format: "Topic-wise Compilation",
        focus: "Exam Oriented",
        rating: 4.7,
        reviews: "1.1k",
        price: 249,
        oldPrice: 449,
        discount: 44,
        image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=600&q=80",
        type: "Answer Writing",
    },
    {
        id: 8,
        title: "NCERT Summary Notes (Class 6-12)",
        category: "SSC",
        subject: "Geography",
        instructor: "Academic Team",
        pages: "Complete Summary",
        updated: "Chapter-wise",
        format: "Important Points",
        focus: "Exam Oriented",
        rating: 4.8,
        reviews: "1.5k",
        price: 149,
        oldPrice: 299,
        discount: 50,
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
        type: "NCERT",
    },
];

const filterGroups = [
    {
        title: "Material Type",
        items: [
            ["Notes", "45"],
            ["NCERT", "32"],
            ["Standard Book", "28"],
            ["Short Notes", "36"],
            ["Current Affairs", "42"],
            ["Previous Year Papers", "26"],
            ["Mind Maps", "18"],
            ["Answer Writing", "12"],
        ],
    },
    {
        title: "Exam Category",
        items: [
            ["UPSC", "120"],
            ["UPPSC", "84"],
            ["UKPSC", "62"],
            ["RAS", "68"],
            ["SSC", "50"],
            ["Banking", "46"],
            ["Other Exams", "70"],
        ],
    },
    {
        title: "Subject",
        items: [
            ["Polity", "85"],
            ["Geography", "72"],
            ["History", "64"],
            ["Economy", "68"],
            ["Environment", "48"],
            ["Current Affairs", "56"],
            ["Science & Tech", "42"],
            ["Ethics", "38"],
        ],
    },
];

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
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8 relative">
            <div>
                <h2 className="text-[24px] font-black leading-[1.15] tracking-tight text-slate-900 sm:text-[28px]">
                    {title}
                </h2>
                <p className="mt-1.5 text-[14px] leading-[1.45] text-slate-500 sm:text-[15px]">
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
                    className="hidden shrink-0 items-center gap-1.5 text-[14px] font-bold text-blue-700 sm:flex"
                >
                    {action}
                    <ArrowRight size={14} />
                </Link>
            )}
        </div>
    );
}

function FilterSection({
    title,
    items,
    selected,
    onToggle,
}: {
    title: string;
    items: string[][];
    selected: string[];
    onToggle: (item: string) => void;
}) {
    return (
        <div className="border-b border-slate-100 py-5 first:pt-0">
            <h3 className="mb-3.5 text-[14px] font-extrabold text-slate-800">
                {title}
            </h3>
            <div className="space-y-3">
                {items.map(([label, count]) => (
                    <label
                        key={label}
                        className="flex cursor-pointer items-center gap-3 text-[13px] text-slate-600 hover:text-slate-900"
                    >
                        <input
                            type="checkbox"
                            checked={selected.includes(label)}
                            onChange={() => onToggle(label)}
                            className="h-4 w-4 rounded border-slate-300 accent-orange-500"
                        />
                        <span className="flex-1 font-medium">{label}</span>
                        <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold text-slate-400">
                            {count}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}

function StudyMaterialCard({ item }: { item: StudyMaterial }) {
    return (
        <article className="group w-full min-w-0 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="relative h-40 overflow-hidden bg-slate-100">
                <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                {item.badge && (
                    <span
                        className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[11px] font-extrabold text-white shadow-sm tracking-wide ${item.badge === "New"
                            ? "bg-emerald-500"
                            : "bg-orange-500"
                            }`}
                    >
                        {item.badge}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="min-h-[48px] text-[15px] font-extrabold leading-[1.3] text-slate-900">
                    {item.title}
                </h3>

                <p className="mt-1 text-[12px] text-slate-500">
                    By <span className="font-bold text-slate-700">{item.instructor}</span>
                </p>

                <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-2 text-[11px] text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        {item.pages}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <List className="h-3.5 w-3.5 text-slate-400" />
                        {item.format}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {item.updated}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Target className="h-3.5 w-3.5 text-slate-400" />
                        {item.focus}
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-[13px]">
                    <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                    <span className="font-extrabold text-slate-800">{item.rating}</span>
                    <span className="text-slate-500">({item.reviews})</span>
                </div>

                <div className="mt-auto pt-4 flex items-end gap-2.5 border-t border-slate-100 mt-4">
                    <span className="text-[20px] font-black leading-none text-slate-900">
                        ₹{item.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[13px] font-medium text-slate-400 line-through mb-0.5">
                        ₹{item.oldPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="ml-auto rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600">
                        {item.discount}% OFF
                    </span>
                </div>

                <Link
                    href={`/study-material/${item.id}`}
                    className="mt-5 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-orange-500 text-[13px] font-bold text-white transition hover:bg-orange-600"
                >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </article>
    );
}

export default function StudyMaterialPage() {
    const [activeTab, setActiveTab] = useState("All Study Material");
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [sort, setSort] = useState("Most Popular");
    const [search, setSearch] = useState("");
    const [showNavbar, setShowNavbar] = useState(true);
    const [page, setPage] = useState(1);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileFilters, setMobileFilters] = useState(false);

    // Carousel State for Hero
    const [currentSlide, setCurrentSlide] = useState(0);
    const banners = ["/banner1.png", "/banner2.png"];

    const pathname = "/study-material";

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

    const toggleFilter = (value: string) => {
        setSelectedFilters((current) =>
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
        );
        setPage(1);
    };

    const clearFilters = () => {
        setSelectedFilters([]);
        setSearch("");
        setPage(1);
    };

    const filteredMaterials = useMemo(() => {
        let result = studyMaterials.filter((item) => {
            const tabMatch =
                activeTab === "All Study Material" || item.category === activeTab;

            const searchMatch =
                !search.trim() ||
                `${item.title} ${item.instructor} ${item.category} ${item.subject} ${item.type}`
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const filterMatch =
                selectedFilters.length === 0 ||
                selectedFilters.includes(item.category) ||
                selectedFilters.includes(item.type) ||
                selectedFilters.includes(item.subject);

            return tabMatch && searchMatch && filterMatch;
        });

        if (sort === "Price: Low to High") {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sort === "Price: High to Low") {
            result = [...result].sort((a, b) => b.price - a.price);
        } else if (sort === "Rating") {
            result = [...result].sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [activeTab, search, selectedFilters, sort]);

    const displayedMaterials = filteredMaterials.slice((page - 1) * 8, page * 8);
    const totalPages = Math.max(1, Math.ceil(filteredMaterials.length / 8));

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
                                placeholder="Search materials..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent w-full outline-none text-slate-700"
                            />
                            <Mic size={16} className="cursor-pointer hover:text-orange-500" />
                        </div>

                        <button className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-50 transition relative">
                            <ShoppingCart size={18} />
                        </button>

                        <Link
                            href="/login"
                            className="flex h-10 items-center rounded-lg border-2 border-orange-500 px-5 text-[14px] font-bold text-orange-500 hover:bg-orange-50 transition"
                        >
                            Login
                        </Link>

                        <Link
                            href="/signup"
                            className="flex h-10 items-center rounded-lg bg-orange-500 px-5 text-[14px] font-bold text-white shadow-sm hover:bg-orange-600 transition"
                        >
                            Sign Up
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
                <section className="relative min-h-[300px] overflow-hidden bg-slate-900 group">
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

                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#021424]/95 via-[#021424]/70 to-[#021424]/20" />

                    <div className="relative z-10 mx-auto flex min-h-[300px] max-w-[1400px] items-center px-6 py-10 lg:px-10">
                        <div className="max-w-[760px] text-white">
                            <div className="mb-5 text-[13px] font-medium text-white/70">
                                Home <span className="mx-2">›</span> <span className="text-white">Study Material</span>
                            </div>

                            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                Study <span className="text-orange-500">Material</span>
                            </h1>

                            <p className="mt-4 max-w-[550px] text-[15px] sm:text-[17px] font-medium leading-relaxed text-white/90">
                                High-quality PDFs, notes, and resources to strengthen your preparation.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4 text-[13px] font-semibold">
                                {[
                                    [FileText, "Exam-wise Notes"],
                                    [BookOpen, "Chapter-wise PDFs"],
                                    [RefreshCcw, "Updated Content"],
                                    [GraduationCap, "Expert Prepared"],
                                ].map(([Icon, label]) => {
                                    const ItemIcon = Icon as any;
                                    return (
                                        <div key={label as string} className="flex items-center gap-2">
                                            <div className="grid h-8 w-8 place-items-center rounded bg-white/10 text-orange-400 backdrop-blur-sm shadow-sm">
                                                <ItemIcon className="h-4 w-4" />
                                            </div>
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
                    <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-slate-200 px-6 py-4 sm:grid-cols-3 lg:grid-cols-5 lg:px-10">
                        {[
                            [FileText, "5,000+", "Study Materials"],
                            [GraduationCap, "100+", "NCERT Notes"],
                            [BookOpen, "500+", "Standard Book Summaries"],
                            [FileText, "250+", "Current Affairs PDFs"],
                            [CheckCircle2, "50+", "Previous Year Papers"],
                        ].map(([Icon, value, label]) => {
                            const StatIcon = Icon as any;
                            return (
                                <div
                                    key={label as string}
                                    className="flex min-w-0 items-center gap-3 px-4 py-3 first:pl-0 sm:px-6"
                                >
                                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-orange-50 text-orange-500 shrink-0">
                                        <StatIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-[14px] font-black text-slate-900 leading-tight">
                                            {value as string}
                                        </div>
                                        <div className="text-[11px] font-medium text-slate-500 mt-0.5">
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
                    <div className="mx-auto flex max-w-[1400px] gap-3 overflow-x-auto px-6 py-4 lg:px-10 no-scrollbar">
                        {examTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setPage(1);
                                }}
                                className={`whitespace-nowrap rounded-lg border px-6 py-2.5 text-[14px] font-bold transition ${activeTab === tab
                                    ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-500"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <button
                            onClick={() => setMobileFilters(true)}
                            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-[14px] font-bold lg:hidden shadow-sm"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </button>

                        <div className="text-[16px] font-extrabold text-slate-800 hidden lg:block">
                            Showing {filteredMaterials.length || 0} study materials
                        </div>

                        <div className="relative ml-auto flex items-center gap-3">
                            <span className="hidden text-[14px] font-medium text-slate-500 sm:inline">Sort by:</span>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-[14px] font-bold outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-sm"
                            >
                                <option>Most Popular</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Rating</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
                        {/* Desktop filters */}
                        <aside className="hidden lg:block bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-[180px]">
                            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                                <h2 className="text-[18px] font-black text-slate-900">Filters</h2>
                                <button
                                    onClick={clearFilters}
                                    className="text-[13px] font-bold text-orange-600 hover:underline"
                                >
                                    Reset All
                                </button>
                            </div>

                            {filterGroups.map((group) => (
                                <FilterSection
                                    key={group.title}
                                    title={group.title}
                                    items={group.items}
                                    selected={selectedFilters}
                                    onToggle={toggleFilter}
                                />
                            ))}

                            <button
                                onClick={clearFilters}
                                className="mt-6 w-full rounded-lg border-2 border-orange-500 py-3 text-[14px] font-bold text-orange-500 hover:bg-orange-50 transition"
                            >
                                Clear All Filters
                            </button>
                        </aside>

                        {/* Cards */}
                        <div>
                            {displayedMaterials.length > 0 ? (
                                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                    {displayedMaterials.map((item) => (
                                        <StudyMaterialCard key={item.id} item={item} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
                                    <Search className="h-12 w-12 text-slate-300" />
                                    <h3 className="mt-4 text-[20px] font-black text-slate-800">
                                        No materials found
                                    </h3>
                                    <p className="mt-2 text-[15px] text-slate-500">
                                        Try changing your search or filters.
                                    </p>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-6 rounded-lg bg-orange-500 px-6 py-3 text-[14px] font-bold text-white hover:bg-orange-600 transition"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-10 flex items-center justify-center gap-2">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white shadow-sm"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>

                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => index + 1
                                    )
                                        .slice(0, 5)
                                        .map((number) => (
                                            <button
                                                key={number}
                                                onClick={() => setPage(number)}
                                                className={`grid h-10 min-w-10 place-items-center rounded-lg px-3 text-[14px] font-bold transition shadow-sm ${page === number
                                                    ? "bg-orange-500 text-white border-transparent"
                                                    : "border border-slate-200 bg-white text-slate-600 hover:border-orange-300"
                                                    }`}
                                            >
                                                {number}
                                            </button>
                                        ))}

                                    {totalPages > 5 && (
                                        <>
                                            <span className="px-2 text-slate-400 font-bold">...</span>
                                            <button
                                                onClick={() => setPage(totalPages)}
                                                className="grid h-10 min-w-10 place-items-center rounded-lg border border-slate-200 bg-white px-3 text-[14px] font-bold transition shadow-sm hover:border-orange-300"
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}

                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white shadow-sm"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Study Resources by Exam */}
                <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
                    <SectionHeading
                        title={
                            <>
                                Study Resources <em className="not-italic text-orange-500">by Exam</em>
                            </>
                        }
                        description="Find subject-wise notes, PDFs and resources for your exam."
                        action="View All Study Material"
                    />

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                        {[
                            ["UPSC", "120+ Materials", "🏛️", "bg-amber-50 text-amber-900 border-amber-100"],
                            ["UPPSC", "84+ Materials", "🏛️", "bg-red-50 text-red-900 border-red-100"],
                            ["UKPSC", "62+ Materials", "🏔️", "bg-blue-50 text-blue-900 border-blue-100"],
                            ["RAS", "68+ Materials", "🏰", "bg-orange-50 text-orange-900 border-orange-100"],
                            ["SSC", "50+ Materials", "🏅", "bg-emerald-50 text-emerald-900 border-emerald-100"],
                            ["Banking", "46+ Materials", "🏦", "bg-purple-50 text-purple-900 border-purple-100"],
                            ["Other Exams", "70+ Materials", "📚", "bg-slate-100 text-slate-900 border-slate-200"],
                        ].map(([name, count, icon, colorClass]) => (
                            <Link
                                href="#"
                                key={name}
                                className={`rounded-xl border p-4 text-center transition hover:-translate-y-1 hover:shadow-md ${colorClass}`}
                            >
                                <div className="text-3xl mb-2">{icon}</div>
                                <div className="text-[14px] font-black">{name}</div>
                                <div className="mt-1 text-[11px] font-medium opacity-70">{count}</div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Why Choose SadhyamIAS Study Material? */}
                <section className="border-t border-slate-200 bg-white py-12 sm:py-16">
                    <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                        <h2 className="mb-8 text-[24px] font-black tracking-tight text-slate-900 sm:text-[28px]">
                            Why Choose <span className="text-orange-500">SadhyamIAS</span> Study Material?
                        </h2>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                            {[
                                [FileText, "Exam Focused Content", "Designed by experts as per latest pattern"],
                                [RefreshCcw, "Updated & Relevant", "Regularly updated with latest syllabus"],
                                [BookOpen, "Easy to Understand", "Handwritten style notes with clear explanation"],
                                [Layers, "Comprehensive Coverage", "From basics to advanced level"],
                                [BadgeIndianRupee, "Affordable & Accessible", "High-quality PDFs at pocket-friendly prices"],
                            ].map(([Icon, title, desc]) => {
                                const FeatureIcon = Icon as any;
                                return (
                                    <div key={title as string} className="flex gap-4 sm:flex-col sm:gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                                            <FeatureIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-[15px] font-black text-slate-900 leading-tight mb-1.5">{title as string}</h3>
                                            <p className="text-[13px] text-slate-500 leading-relaxed">{desc as string}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="overflow-hidden bg-orange-50 py-10 sm:py-12">
                    <div className="mx-auto flex min-h-[160px] w-[calc(100%-32px)] max-w-[1400px] px-6 lg:px-10 lg:w-[calc(100%-40px)] items-center justify-between gap-8">
                        <div>
                            <h2 className="text-[28px] font-black leading-tight text-slate-900 sm:text-[36px]">
                                Get the Right Study Material Today
                            </h2>
                            <p className="mt-3 max-w-[600px] text-[15px] leading-[1.6] text-slate-600 sm:text-[16px]">
                                Access high-quality notes, PDFs, short notes and more to strengthen
                                <br className="hidden sm:block" /> your preparation with expert guidance.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link href="/signup" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 text-[15px] font-black text-white shadow-md hover:bg-orange-600 transition">
                                    Create Free Account
                                    <ArrowRight size={16} />
                                </Link>
                                <Link href="/study-material" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-slate-800 bg-transparent px-6 text-[15px] font-black text-slate-800 hover:bg-slate-800 hover:text-white transition">
                                    <BookMarked size={16} />
                                    Explore Study Material
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

            {/* Mobile filter drawer */}
            {mobileFilters && (
                <div className="fixed inset-0 z-[200] lg:hidden">
                    <div
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileFilters(false)}
                    />
                    <aside className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                            <h3 className="text-[18px] font-black text-slate-900">Filters</h3>
                            <button
                                onClick={() => setMobileFilters(false)}
                                className="rounded-md bg-slate-100 p-2 text-slate-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {filterGroups.map((group) => (
                            <FilterSection
                                key={group.title}
                                title={group.title}
                                items={group.items}
                                selected={selectedFilters}
                                onToggle={toggleFilter}
                            />
                        ))}

                        <div className="mt-6 flex gap-3 sticky bottom-0 bg-white pt-4 pb-2 border-t border-slate-100">
                            <button
                                onClick={clearFilters}
                                className="flex-1 rounded-lg border-2 border-orange-500 py-3 text-[14px] font-bold text-orange-500"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setMobileFilters(false)}
                                className="flex-1 rounded-lg bg-orange-500 py-3 text-[14px] font-bold text-white shadow-md"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </aside>
                </div>
            )}

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
                            <span className="cursor-pointer rounded-full bg-white/5 p-2.5 hover:bg-orange-500 hover:text-white transition">✈</span>
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