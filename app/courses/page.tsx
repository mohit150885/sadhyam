"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ArrowRight,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    FileText,
    GraduationCap,
    Headphones,
    Menu,
    Search,
    ShoppingCart,
    SlidersHorizontal,
    Star,
    UserRound,
    X,
    Mic
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Course = {
    id: number;
    title: string;
    category: string;
    instructor: string;
    lectures: string;
    pdfs: string;
    validity: string;
    rating: number;
    reviews: string;
    price: number;
    oldPrice: number;
    discount: number;
    image: string;
    bestseller?: boolean;
    type: string;
    language: string;
    features: string[];
};

const examTabs = [
    "All Courses",
    "UPSC",
    "UPPSC",
    "UKPSC",
    "RAS",
    "SSC",
    "Banking",
    "Other Exams",
];

const courses: Course[] = [
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
        image: "https://images.unsplash.com/photo-1585828068970-1b5e28230528?auto=format&fit=crop&w=600&q=80",
        bestseller: true,
        type: "Foundation Course",
        language: "English",
        features: ["Live Classes", "Recorded Lectures", "PDF Notes", "Test Series Included", "Doubt Support"],
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
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
        type: "Foundation Course",
        language: "Hindi",
        features: ["Live Classes", "Recorded Lectures", "PDF Notes", "Test Series Included", "Mentorship"],
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
        image: "https://images.unsplash.com/photo-1596522513974-98da69389e7c?auto=format&fit=crop&w=600&q=80",
        type: "Foundation Course",
        language: "Hindi",
        features: ["Live Classes", "Recorded Lectures", "PDF Notes", "Test Series Included", "Doubt Support"],
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
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
        type: "Optional Course",
        language: "English",
        features: ["Recorded Lectures", "PDF Notes", "Doubt Support"],
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
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80",
        type: "Current Affairs",
        language: "English",
        features: ["Recorded Lectures", "PDF Notes", "Test Series Included"],
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
        image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=600&q=80",
        type: "Answer Writing",
        language: "Hindi",
        features: ["Live Classes", "PDF Notes", "Mentorship"],
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
        image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=600&q=80",
        type: "Foundation Course",
        language: "Hindi",
        features: ["Live Classes", "Recorded Lectures", "PDF Notes", "Doubt Support"],
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
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
        type: "Foundation Course",
        language: "Hindi",
        features: ["Live Classes", "Recorded Lectures", "PDF Notes", "Test Series Included"],
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
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80",
        type: "Foundation Course",
        language: "English",
        features: ["Live Classes", "Recorded Lectures", "PDF Notes", "Test Series Included"],
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
        image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
        type: "Foundation Course",
        language: "English",
        features: ["Recorded Lectures", "PDF Notes", "Mentorship"],
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
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
        type: "Optional Course",
        language: "English",
        features: ["Recorded Lectures", "PDF Notes", "Doubt Support"],
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
        image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=600&q=80",
        type: "Current Affairs",
        language: "English",
        features: ["Recorded Lectures", "PDF Notes", "Test Series Included"],
    },
];

const filterGroups = [
    {
        title: "Exam Category",
        items: [
            ["UPSC", "35"],
            ["UPPSC", "24"],
            ["UKPSC", "18"],
            ["RAS", "20"],
            ["SSC", "16"],
            ["Banking", "14"],
            ["Other Exams", "22"],
        ],
    },
    {
        title: "Course Type",
        items: [
            ["Live Course", "45"],
            ["Recorded Course", "38"],
            ["Crash Course", "12"],
            ["Foundation Course", "20"],
            ["Optional Course", "18"],
            ["Current Affairs", "10"],
            ["Answer Writing", "8"],
        ],
    },
    {
        title: "Language",
        items: [
            ["Hinglish", "62"],
            ["Hindi", "28"],
            ["English", "5"],
        ],
    },
    {
        title: "Features",
        items: [
            ["Live Classes", "42"],
            ["Recorded Lectures", "58"],
            ["PDF Notes", "65"],
            ["Test Series Included", "38"],
            ["Doubt Support", "46"],
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

function CourseCard({ course }: { course: Course }) {
    return (
        <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                {course.bestseller && (
                    <span className="absolute left-3 top-3 rounded-md bg-orange-500 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-sm tracking-wide">
                        BESTSELLER
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="min-h-[48px] text-[16px] font-extrabold leading-[1.3] text-slate-900">
                    {course.title}
                </h3>

                <p className="mt-1 text-[13px] text-slate-500">
                    By <span className="font-bold text-slate-700">{course.instructor}</span>
                </p>

                <div className="mt-4 space-y-2 text-[13px] text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-orange-500" />
                        {course.lectures}
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-orange-500" />
                        {course.pdfs}
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-orange-500" />
                        {course.validity}
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-[14px]">
                    <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                    <span className="font-extrabold text-slate-800">{course.rating}</span>
                    <span className="text-slate-500">({course.reviews})</span>
                </div>

                <div className="mt-auto pt-4 flex items-end gap-2.5">
                    <span className="text-[22px] font-black leading-none text-slate-900">
                        ₹{course.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[14px] font-medium text-slate-400 line-through mb-0.5">
                        ₹{course.oldPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="ml-auto rounded-md bg-emerald-50 px-2 py-1 text-[12px] font-black text-emerald-600">
                        {course.discount}% OFF
                    </span>
                </div>

                <a
                    href={`/courses/${course.id}`}
                    className="mt-5 flex h-11 items-center justify-center gap-1.5 rounded-lg bg-orange-500 text-[14px] font-bold text-white transition hover:bg-orange-600"
                >
                    View Details <ArrowRight className="h-4 w-4" />
                </a>
            </div>
        </article>
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
            <h3 className="mb-3.5 text-[14px] font-extrabold text-slate-800">{title}</h3>
            <div className="space-y-3">
                {items.map(([label, count]) => (
                    <label key={label} className="flex cursor-pointer items-center gap-3 text-[13px] text-slate-600 hover:text-slate-900">
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

export default function CoursesPage() {
    const [activeTab, setActiveTab] = useState("All Courses");
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [sort, setSort] = useState("Most Popular");
    const [search, setSearch] = useState("");
    const [maxPrice, setMaxPrice] = useState(25000);
    const [mobileFilters, setMobileFilters] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const [page, setPage] = useState(1);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Carousel State for Hero
    const [currentSlide, setCurrentSlide] = useState(0);
    const banners = ["/banner1.png", "/banner2.png"];

    // Defaulting to "courses" in path since this is the courses page
    const pathname = "/courses";

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
        setMaxPrice(25000);
        setSearch("");
        setPage(1);
    };

    const filteredCourses = useMemo(() => {
        let result = courses.filter((course) => {
            const tabMatch =
                activeTab === "All Courses" || course.category === activeTab;

            const searchMatch =
                !search.trim() ||
                `${course.title} ${course.instructor} ${course.category}`
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const priceMatch = course.price <= maxPrice;

            const filterMatch =
                selectedFilters.length === 0 ||
                selectedFilters.includes(course.category) ||
                selectedFilters.includes(course.type) ||
                selectedFilters.includes(course.language) ||
                selectedFilters.some((item) => course.features.includes(item));

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

    const displayedCourses = filteredCourses.slice((page - 1) * 12, page * 12);
    const totalPages = Math.max(1, Math.ceil(filteredCourses.length / 12));

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
                                Home <span className="mx-2">›</span> <span className="text-white">Courses</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                                All <span className="text-orange-500">Courses</span>
                            </h1>
                            <p className="mt-4 max-w-[620px] text-[15px] sm:text-[17px] font-medium leading-relaxed text-white/90">
                                Comprehensive, structured and exam-focused courses to help you achieve your goals.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4 text-[13px] font-semibold">
                                {[
                                    [UserRound, "Expert Faculty"],
                                    [GraduationCap, "Enhanced Learning"],
                                    [FileText, "Updated Content"],
                                    [Headphones, "Doubt Support"],
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

                {/* Exam tabs (Sticky Navigation) */}
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

                {/* Course catalog */}
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
                            Showing {filteredCourses.length || 0} courses
                        </div>

                        <div className="relative ml-auto flex items-center gap-3">
                            <span className="hidden text-[14px] font-medium text-slate-500 sm:inline">Sort by:</span>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-[14px] font-bold outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-sm"
                            >
                                <option>Most Popular</option>
                                <option>Rating</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
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
                                    max={25000}
                                    step={500}
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
                            {displayedCourses.length > 0 ? (
                                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                    {displayedCourses.map((course) => (
                                        <CourseCard key={course.id} course={course} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
                                    <Search className="h-12 w-12 text-slate-300" />
                                    <h3 className="mt-4 text-[20px] font-black text-slate-800">No courses found</h3>
                                    <p className="mt-2 text-[15px] text-slate-500">
                                        Try changing your filters or searching for something else.
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

                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`h-10 min-w-10 rounded-lg px-3 text-[14px] font-bold transition shadow-sm ${page === p
                                                ? "bg-orange-500 text-white border-transparent"
                                                : "border border-slate-200 bg-white text-slate-600 hover:border-orange-300"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}

                                    {totalPages > 5 && (
                                        <>
                                            <span className="px-2 text-slate-400 font-bold">...</span>
                                            <button
                                                onClick={() => setPage(totalPages)}
                                                className="h-10 min-w-10 rounded-lg border border-slate-200 bg-white px-3 text-[14px] font-bold transition shadow-sm hover:border-orange-300"
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
                    <button
                        aria-label="Close filters"
                        onClick={() => setMobileFilters(false)}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                    />
                    <aside className="absolute bottom-0 left-0 top-0 w-[320px] max-w-full overflow-y-auto bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                            <h2 className="text-[18px] font-black text-slate-900">Filters</h2>
                            <button onClick={() => setMobileFilters(false)} className="rounded-md bg-slate-100 p-2 text-slate-600">
                                <X className="h-5 w-5" />
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
                            <h3 className="mb-4 text-[14px] font-extrabold text-slate-800">Price Range</h3>
                            <input
                                type="range"
                                min={0}
                                max={25000}
                                step={500}
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
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
                                Apply
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
                    <a
                        key={link}
                        href="#"
                        className="block text-[14px] font-medium text-slate-400 transition hover:text-orange-400"
                    >
                        {link}
                    </a>
                ))}
            </div>
        </div>
    );
}