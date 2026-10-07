"use client";

import { useEffect, useState } from "react";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    UserRound,
    Phone,
    Mail,
    Search,
    ShoppingCart,
    Menu,
    X,
    Mic
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const exams = ["UPSC", "UPPSC", "UKPSC", "RAS", "SSC", "Defense", "Other Exams"];

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
                    className={`text-[26px] font-black leading-none tracking-tight sm:text-[30px] ${dark ? "text-white" : "text-slate-900"
                        }`}
                >
                    SadhyamIAS
                </strong>
            </span>
        </Link>
    );
}

function GoogleIcon() {
    return (
        <span className="flex h-6 w-6 items-center justify-center rounded-full text-[18px] font-black text-[#4285F4]">
            G
        </span>
    );
}

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [exam, setExam] = useState("UPSC");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const pathname = usePathname();

    // Carousel State for Left Side
    const [currentSlide, setCurrentSlide] = useState(0);
    const banners = ["/banner1.png", "/banner2.png"];

    // Auto-slide effect for the carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    // Navbar hide/show on scroll
    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 10 || currentScrollY < lastScrollY) {
                setShowNavbar(true);
            } else if (currentScrollY > lastScrollY) {
                setShowNavbar(false);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <main className="min-h-screen bg-white text-slate-900 pt-[70px] lg:pt-[84px]">
            {/* HEADER — Exact Match to Home Page */}
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
                        {/* <div className="flex h-10 w-[220px] items-center gap-2 rounded-lg bg-slate-50 px-3 text-left text-[14px] text-slate-400 ring-1 ring-slate-200 focus-within:ring-orange-500 transition">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent w-full outline-none text-slate-700"
                            />
                            <Mic size={16} className="cursor-pointer hover:text-orange-500" />
                        </div> */}
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

            {/* SIGNUP LAYOUT */}
            <section className="grid min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-84px)] lg:grid-cols-[55%_45%]">

                {/* LEFT SIDE — BANNERS CAROUSEL */}
                <div className="relative hidden items-center justify-center bg-slate-100 lg:flex p-10 border-r border-slate-200">
                    <div className="w-full max-w-[800px] relative overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(15,23,42,0.1)] group bg-white">
                        <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {banners.map((banner, index) => (
                                <div key={index} className="w-full shrink-0 relative">
                                    <img
                                        src={banner}
                                        alt={`SadhyamIAS Banner ${index + 1}`}
                                        className="w-full h-auto object-contain block"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Carousel Indicators */}
                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-300 shadow-sm ${currentSlide === index ? "w-8 bg-orange-500" : "w-2 bg-white/70 hover:bg-white"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE SIGNUP */}
                <div className="flex h-full items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
                    <div className="w-full max-w-[520px] rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_10px_40px_rgba(6,27,47,0.05)] sm:p-8 xl:p-10">
                        {/* Heading */}
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[28px] shadow-sm">
                                🔥
                            </div>

                            <h2 className="text-[28px] font-black tracking-tight text-slate-900 sm:text-[34px]">
                                Create Your Account
                            </h2>

                            <p className="mx-auto mt-2 max-w-[400px] text-[14px] leading-[1.6] text-slate-500 sm:text-[15px]">
                                Join SadhyamIAS and start your competitive exam preparation today.
                            </p>
                        </div>

                        {/* Signup form */}
                        <form className="mt-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-[13px] font-extrabold text-slate-800 sm:text-[14px]">
                                    Full Name
                                </label>
                                <div className="flex h-[48px] items-center rounded-xl border border-slate-300 bg-white px-3.5 transition focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10">
                                    <UserRound className="mr-3 h-5 w-5 shrink-0 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="h-full w-full bg-transparent text-[14px] font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Mobile */}
                            <div>
                                <label className="mb-2 block text-[13px] font-extrabold text-slate-800 sm:text-[14px]">
                                    Mobile Number
                                </label>
                                <div className="flex h-[48px] items-center rounded-xl border border-slate-300 bg-white px-3.5 transition focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10">
                                    <Phone className="mr-3 h-5 w-5 shrink-0 text-slate-400" />
                                    <input
                                        type="tel"
                                        placeholder="Enter your mobile number"
                                        className="h-full w-full bg-transparent text-[14px] font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-[13px] font-extrabold text-slate-800 sm:text-[14px]">
                                    Email Address
                                </label>
                                <div className="flex h-[48px] items-center rounded-xl border border-slate-300 bg-white px-3.5 transition focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10">
                                    <Mail className="mr-3 h-5 w-5 shrink-0 text-slate-400" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="h-full w-full bg-transparent text-[14px] font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-[13px] font-extrabold text-slate-800 sm:text-[14px]">
                                    Password
                                </label>
                                <div className="flex h-[48px] items-center rounded-xl border border-slate-300 bg-white px-3.5 transition focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10">
                                    <LockKeyhole className="mr-3 h-5 w-5 shrink-0 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        className="h-full w-full bg-transparent text-[14px] font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="ml-2 text-slate-400 transition hover:text-slate-700"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label className="mb-2 block text-[13px] font-extrabold text-slate-800 sm:text-[14px]">
                                    Confirm Password
                                </label>
                                <div className="flex h-[48px] items-center rounded-xl border border-slate-300 bg-white px-3.5 transition focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10">
                                    <LockKeyhole className="mr-3 h-5 w-5 shrink-0 text-slate-400" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        className="h-full w-full bg-transparent text-[14px] font-medium text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((v) => !v)}
                                        className="ml-2 text-slate-400 transition hover:text-slate-700"
                                        aria-label="Toggle confirm password visibility"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Exam */}
                            <div>
                                <label className="mb-2 block text-[13px] font-extrabold text-slate-800 sm:text-[14px]">
                                    Target Exam
                                </label>
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                    {exams.map((item) => (
                                        <button
                                            type="button"
                                            key={item}
                                            onClick={() => setExam(item)}
                                            className={`rounded-xl border px-2 py-2.5 text-[12px] font-extrabold transition sm:text-[13px] ${exam === item
                                                ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-orange-300 hover:text-orange-600"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Terms */}
                            <label className="flex cursor-pointer items-start gap-2.5 pt-2 text-[12px] leading-[1.5] text-slate-500 sm:text-[13px]">
                                <input
                                    type="checkbox"
                                    className="mt-0.5 h-4 w-4 shrink-0 accent-orange-500"
                                />
                                <span>
                                    I agree to the{" "}
                                    <Link href="#" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
                                        Terms & Conditions
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="#" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
                                        Privacy Policy
                                    </Link>
                                    .
                                </span>
                            </label>

                            {/* Create account */}
                            <button
                                type="submit"
                                className="mt-2 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-[15px] font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 hover:shadow-xl"
                            >
                                Create Account
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="h-px flex-1 bg-slate-200" />
                            <span className="text-[12px] font-bold text-slate-400">OR</span>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        {/* Google */}
                        <button
                            type="button"
                            className="flex h-[48px] w-full items-center justify-center gap-3 rounded-xl border-2 border-slate-200 bg-white text-[14px] font-extrabold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                            <GoogleIcon />
                            Continue with Google
                        </button>

                        {/* Login */}
                        <p className="mt-6 text-center text-[14px] font-medium text-slate-600">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-black text-orange-600 hover:text-orange-700 hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}