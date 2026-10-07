"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ArrowRight,
    BookOpen,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    FileText,
    GraduationCap,
    Headphones,
    Menu,
    Search,
    ShoppingCart,
    SlidersHorizontal,
    Star,
    Target,
    Trophy,
    UserRound,
    X,
    BarChart3,
    Mic
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type TestSeries = {
    id: number;
    title: string;
    category: string;
    instructor: string;
    tests: string;
    questions: string;
    validity: string;
    rating: number;
    reviews: string;
    price: number;
    oldPrice: number;
    discount: number;
    image: string;
    badge?: string;
    type: string;
    language: string;
    features: string[];
};

const examTabs = [
    "All Test Series",
    "UPSC",
    "UPPSC",
    "UKPSC",
    "RAS",
    "SSC",
    "Banking",
    "Other Exams",
];

const testSeries: TestSeries[] = [
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
        price: 2999,
        oldPrice: 4999,
        discount: 40,
        image:
            "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=900&q=85",
        badge: "Bestseller",
        type: "Full Length",
        language: "Hinglish",
        features: [
            "Detailed Solutions",
            "All India Ranking",
            "Performance Analysis",
            "Timer & Exam Interface",
        ],
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
        image:
            "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85",
        badge: "New",
        type: "Full Length",
        language: "Hindi",
        features: [
            "Detailed Solutions",
            "Performance Analysis",
            "All India Ranking",
            "Previous Year",
        ],
    },
    {
        id: 3,
        title: "RAS Prelims Test Series 2025",
        category: "RAS",
        instructor: "S. Sharma & Team",
        tests: "40 Tests",
        questions: "8,000+ Questions",
        validity: "1 Year Validity",
        rating: 4.6,
        reviews: "1.2k",
        price: 1999,
        oldPrice: 3499,
        discount: 43,
        image:
            "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=85",
        badge: "Popular",
        type: "Full Length",
        language: "Hindi",
        features: [
            "Detailed Solutions",
            "All India Ranking",
            "Performance Analysis",
            "Previous Year",
        ],
    },
    {
        id: 4,
        title: "Current Affairs Test Series 2025",
        category: "Other Exams",
        instructor: "Editorial Team",
        tests: "30 Tests",
        questions: "6,000+ Questions",
        validity: "1 Year Validity",
        rating: 4.8,
        reviews: "980",
        price: 999,
        oldPrice: 1999,
        discount: 50,
        image:
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=85",
        type: "Monthly",
        language: "English",
        features: [
            "Detailed Explanations",
            "Exam Focused",
            "Performance Analysis",
            "All India Ranking",
        ],
    },
    {
        id: 5,
        title: "Banking (IBPS/IBPS PO) Test Series 2025",
        category: "Banking",
        instructor: "A. Gupta & Team",
        tests: "40 Tests",
        questions: "8,000+ Questions",
        validity: "1 Year Validity",
        rating: 4.7,
        reviews: "920",
        price: 1499,
        oldPrice: 2999,
        discount: 50,
        image:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
        type: "Full Length",
        language: "English",
        features: [
            "Detailed Solutions",
            "Performance Analysis",
            "All India Ranking",
            "Timer & Exam Interface",
        ],
    },
    {
        id: 6,
        title: "SSC CGL Test Series 2025",
        category: "SSC",
        instructor: "P. Mishra & Team",
        tests: "30 Tests",
        questions: "6,000+ Questions",
        validity: "1 Year Validity",
        rating: 4.6,
        reviews: "840",
        price: 1299,
        oldPrice: 2499,
        discount: 48,
        image:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
        type: "Full Length",
        language: "Hindi",
        features: [
            "Detailed Solutions",
            "All India Ranking",
            "Performance Analysis",
            "Previous Year",
        ],
    },
    {
        id: 7,
        title: "UKPSC Prelims Test Series 2025",
        category: "UKPSC",
        instructor: "Expert Faculty Team",
        tests: "30 Tests",
        questions: "6,000+ Questions",
        validity: "1 Year Validity",
        rating: 4.6,
        reviews: "640",
        price: 1299,
        oldPrice: 2499,
        discount: 48,
        image:
            "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=900&q=85",
        type: "Full Length",
        language: "Hindi",
        features: [
            "Detailed Solutions",
            "Performance Analysis",
            "All India Ranking",
            "Previous Year",
        ],
    },
    {
        id: 8,
        title: "UPPSC Mains Answer Writing Test Series",
        category: "UPPSC",
        instructor: "Dr. R. Verma",
        tests: "25 Tests",
        questions: "1,500+ Questions",
        validity: "1 Year Validity",
        rating: 4.7,
        reviews: "860",
        price: 2499,
        oldPrice: 3999,
        discount: 38,
        image:
            "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=900&q=85",
        type: "Subject-wise",
        language: "Hindi",
        features: [
            "Detailed Evaluation",
            "Model Answers",
            "Mentorship",
            "Performance Analysis",
        ],
    },
    {
        id: 9,
        title: "UPSC Mains GS Test Series 2025",
        category: "UPSC",
        instructor: "Dr. P. Sharma",
        tests: "30 Tests",
        questions: "3,000+ Questions",
        validity: "1 Year Validity",
        rating: 4.6,
        reviews: "620",
        price: 2499,
        oldPrice: 4499,
        discount: 44,
        image:
            "https://images.unsplash.com/photo-1457369804613-52c61a468e41?auto=format&fit=crop&w=900&q=85",
        type: "Subject-wise",
        language: "English",
        features: [
            "Detailed Solutions",
            "Model Answers",
            "Performance Analysis",
            "Mentorship",
        ],
    },
    {
        id: 10,
        title: "70 Tests Mega Practice Series",
        category: "UPPSC",
        instructor: "Test World Faculty Team",
        tests: "70 Tests",
        questions: "12,000+ Questions",
        validity: "1 Year Validity",
        rating: 4.8,
        reviews: "2.4k",
        price: 2999,
        oldPrice: 4999,
        discount: 40,
        image:
            "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=85",
        badge: "Best Value",
        type: "Mixed",
        language: "Hinglish",
        features: [
            "Mini Tests",
            "Section Tests",
            "Full Length Tests",
            "Performance Analysis",
        ],
    },
    {
        id: 11,
        title: "UPPSC Foundation Practice Series",
        category: "UPPSC",
        instructor: "Expert Faculty Team",
        tests: "50 Tests",
        questions: "7,500+ Questions",
        validity: "1 Year Validity",
        rating: 4.7,
        reviews: "1.1k",
        price: 1799,
        oldPrice: 2999,
        discount: 40,
        image:
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=85",
        type: "Foundation",
        language: "Hindi",
        features: [
            "Basic to Advanced",
            "Detailed Solutions",
            "Section Tests",
            "Performance Analysis",
        ],
    },
    {
        id: 12,
        title: "Other State PSC Combined Test Series",
        category: "Other Exams",
        instructor: "Expert Faculty Team",
        tests: "25 Tests",
        questions: "5,000+ Questions",
        validity: "1 Year Validity",
        rating: 4.5,
        reviews: "520",
        price: 1099,
        oldPrice: 1999,
        discount: 45,
        image:
            "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=85",
        type: "Full Length",
        language: "Hinglish",
        features: [
            "Detailed Solutions",
            "All India Ranking",
            "Performance Analysis",
            "Previous Year",
        ],
    },
];

const filterGroups = [
    {
        title: "Exam Category",
        items: [
            ["UPSC", "12"],
            ["UPPSC", "18"],
            ["UKPSC", "10"],
            ["RAS", "14"],
            ["SSC", "12"],
            ["Banking", "12"],
            ["Other Exams", "20"],
        ],
    },
    {
        title: "Test Type",
        items: [
            ["Full Length", "45"],
            ["Sectional", "36"],
            ["Subject-wise", "28"],
            ["Previous Year", "24"],
            ["Current Affairs", "18"],
            ["Monthly", "12"],
            ["Mixed", "10"],
        ],
    },
    {
        title: "Language",
        items: [
            ["Hinglish", "52"],
            ["Hindi", "28"],
            ["English", "20"],
        ],
    },
    {
        title: "Features",
        items: [
            ["Detailed Solutions", "68"],
            ["All India Ranking", "50"],
            ["Performance Analysis", "48"],
            ["Timer & Exam Interface", "60"],
            ["Mentorship", "22"],
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
                        <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-400">
                            {count}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}

function TestSeriesCard({ item }: { item: TestSeries }) {
    return (
        <article className="group w-full min-w-0 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="relative h-44 overflow-hidden bg-slate-100">
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
                            : item.badge === "Popular"
                                ? "bg-red-500"
                                : "bg-orange-500"
                            }`}
                    >
                        {item.badge}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="min-h-[48px] text-[16px] font-extrabold leading-[1.3] text-slate-900">
                    {item.title}
                </h3>

                <p className="mt-1 text-[13px] text-slate-500">
                    By{" "}
                    <span className="font-bold text-slate-700">
                        {item.instructor}
                    </span>
                </p>

                <div className="mt-4 space-y-2 text-[13px] text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-orange-500" />
                        {item.tests}
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-orange-500" />
                        {item.questions}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-orange-500" />
                        {item.validity}
                    </div>
                    <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-orange-500" />
                        {item.type}
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.features.slice(0, 2).map((feature) => (
                        <span
                            key={feature}
                            className="rounded bg-slate-50 border border-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500"
                        >
                            {feature}
                        </span>
                    ))}
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-[14px]">
                    <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                    <span className="font-extrabold text-slate-800">{item.rating}</span>
                    <span className="text-slate-500">({item.reviews})</span>
                </div>

                <div className="mt-auto pt-4 flex items-end gap-2.5">
                    <span className="text-[22px] font-black leading-none text-slate-900">
                        ₹{item.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[14px] font-medium text-slate-400 line-through mb-0.5">
                        ₹{item.oldPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="ml-auto rounded-md bg-emerald-50 px-2 py-1 text-[12px] font-black text-emerald-600">
                        {item.discount}% OFF
                    </span>
                </div>

                <Link
                    href={`/test-series/${item.id}`}
                    className="mt-5 flex h-11 items-center justify-center gap-1.5 rounded-lg bg-orange-500 text-[14px] font-bold text-white transition hover:bg-orange-600"
                >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </article>
    );
}

export default function TestSeriesPage() {
    const [activeTab, setActiveTab] = useState("All Test Series");
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [sort, setSort] = useState("Most Popular");
    const [search, setSearch] = useState("");
    const [maxPrice, setMaxPrice] = useState(5000);
    const [showNavbar, setShowNavbar] = useState(true);
    const [page, setPage] = useState(1);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileFilters, setMobileFilters] = useState(false);

    // Carousel State for Hero
    const [currentSlide, setCurrentSlide] = useState(0);
    const banners = ["/banner1.png", "/banner2.png"];

    const pathname = "/test-series";

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
        setMaxPrice(5000);
        setSearch("");
        setPage(1);
    };

    const filteredSeries = useMemo(() => {
        let result = testSeries.filter((item) => {
            const tabMatch =
                activeTab === "All Test Series" || item.category === activeTab;

            const searchMatch =
                !search.trim() ||
                `${item.title} ${item.instructor} ${item.category} ${item.type} ${item.language}`
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const priceMatch = item.price <= maxPrice;

            const filterMatch =
                selectedFilters.length === 0 ||
                selectedFilters.includes(item.category) ||
                selectedFilters.includes(item.type) ||
                selectedFilters.includes(item.language) ||
                selectedFilters.some((filter) => item.features.includes(filter));

            return tabMatch && searchMatch && priceMatch && filterMatch;
        });

        if (sort === "Price: Low to High") {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sort === "Price: High to Low") {
            result = [...result].sort((a, b) => b.price - a.price);
        } else if (sort === "Rating") {
            result = [...result].sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [activeTab, maxPrice, search, selectedFilters, sort]);

    const displayedSeries = filteredSeries.slice((page - 1) * 8, page * 8);
    const totalPages = Math.max(1, Math.ceil(filteredSeries.length / 8));

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

            <main className="pt-[64px] sm:pt-[70px]">
                {/* Hero Section with Carousel Background and Overlay Details */}
                <section className="relative min-h-[300px] overflow-hidden bg-slate-900 group">
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

                    {/* Content overlay */}
                    <div className="relative z-10 mx-auto flex min-h-[300px] max-w-[1400px] items-center px-6 py-10 lg:px-10">
                        <div className="max-w-[760px] text-white">
                            <div className="mb-5 text-[13px] font-medium text-white/70">
                                Home <span className="mx-2">›</span> <span className="text-white">Test Series</span>
                            </div>

                            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                Test <span className="text-orange-500">Series</span>
                            </h1>

                            <h2 className="mt-2 text-lg font-extrabold sm:text-2xl md:text-3xl text-white/90">
                                Practice Like the Real Exam
                            </h2>

                            <p className="mt-4 max-w-[650px] text-[15px] sm:text-[17px] font-medium leading-relaxed text-white/80">
                                Full length tests, sectional tests and topic-wise mocks with
                                detailed solutions, performance analysis and All India Ranking.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    href="/test-series"
                                    className="flex h-12 items-center gap-2 rounded-lg bg-orange-500 px-6 text-[15px] font-bold text-white transition hover:bg-orange-600 shadow-lg shadow-orange-500/25"
                                >
                                    Start Free Test <ArrowRight size={18} />
                                </Link>
                                <button className="flex h-12 items-center gap-2 rounded-lg bg-white/10 backdrop-blur-md px-6 text-[15px] font-bold text-white border border-white/20 hover:bg-white/20 transition">
                                    <Target size={18} /> Watch Demo
                                </button>
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

                <section className="border-b border-slate-100 bg-white">
                    <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-slate-200 px-6 py-4 sm:grid-cols-3 lg:grid-cols-6 lg:px-10">
                        {[
                            [BookOpen, "10,000+", "Exam Level Questions"],
                            [Trophy, "All India", "Ranking"],
                            [FileText, "Detailed", "Solutions"],
                            [Clock3, "Real Exam", "Interface"],
                            [BarChart3, "Performance", "Analysis"],
                            [UserRound, "50,000+", "Students"],
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

                {/* Exam tabs (Sticky Navigation) */}
                <section
                    className={`border-b border-slate-200 bg-white/95 backdrop-blur-md sticky z-40 shadow-sm transition-[top] duration-300 ease-in-out mt-6 ${showNavbar ? "top-[64px] sm:top-[70px]" : "top-0"
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
                            Showing {filteredSeries.length || 0} test series
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

                            <div className="border-t border-slate-100 pt-5 mt-2">
                                <h3 className="mb-4 text-[14px] font-extrabold text-slate-800">Price Range</h3>
                                <input
                                    type="range"
                                    min={0}
                                    max={5000}
                                    step={100}
                                    value={maxPrice}
                                    onChange={(e) => {
                                        setMaxPrice(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="w-full accent-orange-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="mt-2 flex justify-between text-[12px] font-bold text-slate-500">
                                    <span>₹0</span>
                                    <span>₹{maxPrice.toLocaleString("en-IN")}+</span>
                                </div>
                            </div>

                            <button
                                onClick={clearFilters}
                                className="mt-6 w-full rounded-lg border-2 border-orange-500 py-3 text-[14px] font-bold text-orange-500 hover:bg-orange-50 transition"
                            >
                                Clear All Filters
                            </button>
                        </aside>

                        {/* Cards */}
                        <div>
                            {displayedSeries.length > 0 ? (
                                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                    {displayedSeries.map((item) => (
                                        <TestSeriesCard key={item.id} item={item} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
                                    <Search className="h-12 w-12 text-slate-300" />
                                    <h3 className="mt-4 text-[20px] font-black text-slate-800">
                                        No test series found
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

                        <div className="py-5">
                            <h3 className="mb-4 text-[14px] font-extrabold text-slate-800">
                                Price Range
                            </h3>
                            <input
                                type="range"
                                min={0}
                                max={5000}
                                step={100}
                                value={maxPrice}
                                onChange={(e) => {
                                    setMaxPrice(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="w-full accent-orange-500 h-2 bg-slate-200 rounded-lg appearance-none"
                            />
                            <div className="mt-2 flex justify-between text-[12px] font-bold text-slate-500">
                                <span>₹0</span>
                                <span>₹{maxPrice.toLocaleString("en-IN")}+</span>
                            </div>
                        </div>

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
            <footer className="mt-12 bg-[#021424] text-white">
                <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr] lg:px-10">
                    <div>
                        <Brand dark />
                        <p className="mt-5 max-w-[300px] text-[14px] leading-relaxed text-slate-400 font-medium">
                            Your trusted partner in competitive exam preparation. Quality content,
                            expert guidance and real practice for your success.
                        </p>
                        <div className="mt-6 flex gap-3 text-slate-400">
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
                        links={["UPSC", "UPPSC", "UKPSC", "RAS", "SSC", "Banking", "Other Exams"]}
                    />
                    <FooterColumn
                        title="Support"
                        links={["Help Center", "FAQs", "Refund Policy", "Terms & Conditions", "Privacy Policy"]}
                    />

                    <div>
                        <h3 className="text-[16px] font-extrabold text-white">Download Our App</h3>
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
            <h3 className="text-[16px] font-extrabold text-white">{title}</h3>
            <div className="mt-5 space-y-3">
                {links.map((link) => (
                    <Link
                        key={link}
                        href="#"
                        className="block text-[14px] font-medium text-slate-400 transition hover:text-orange-400"
                    >
                        {link}
                    </Link>
                ))}
            </div>
        </div>
    );
}