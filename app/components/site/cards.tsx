"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    ArrowRight,
    BookOpen,
    Check,
    CheckCircle2,
    ChevronDown,
    ClipboardList,
    FileText,
    Play,
    Quote,
    ShoppingCart,
    Star,
} from "lucide-react";
import type { Course, FacultyMember, ProductKind, StudyMaterial, TestSeries, Testimonial, Topper } from "../../lib/models";
import { cn } from "../../lib/utils";
import { useCart } from "../providers/CartProvider";
import { DynamicIcon, TONE_SOFT, TONE_SOLID } from "./icons";
import { Badge, Price, Rating, SmartImage, Tag } from "./ui";
import { ItemCountdown } from "./Countdown";

const cardShell =
    "group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md";

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export function CourseCard({ course }: { course: Course }) {
    const href = `/courses/${course.id}`;
    const badge = course.badge || (course.bestseller ? "Bestseller" : "");
    return (
        <article className={cardShell}>
            <Link href={href} className="relative block h-44 overflow-hidden bg-slate-100">
                <SmartImage src={course.image} alt={course.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                {badge && <Badge className="absolute left-3 top-3">{badge}</Badge>}
            </Link>
            <div className="flex flex-1 flex-col p-5">
                <h3 className="t-card-title min-h-[2.625rem] font-extrabold text-slate-900">
                    <Link href={href} className="hover:text-brand">{course.title}</Link>
                </h3>
                <p className="t-meta mt-1 font-medium text-slate-500">
                    By <span className="font-bold text-slate-700">{course.instructor}</span>
                </p>
                <div className="t-meta mt-4 grid grid-cols-3 gap-2 font-medium text-slate-600">
                    {course.lectures && <span className="flex items-center gap-1.5"><Play size={14} className="shrink-0 text-brand" />{shortCount(course.lectures)}</span>}
                    {course.pdfs && <span className="flex items-center gap-1.5"><BookOpen size={14} className="shrink-0 text-brand" />{shortCount(course.pdfs)}</span>}
                    {course.tests && <span className="flex items-center gap-1.5"><ClipboardList size={14} className="shrink-0 text-brand" />{shortCount(course.tests)}</span>}
                </div>
                <div className="mt-4">
                    <Rating value={course.rating} reviews={course.reviews} />
                </div>
                <div className="mt-auto pt-4">
                    <ItemCountdown item={course} className="mb-3" />
                    <Price price={course.price} oldPrice={course.oldPrice} />
                </div>
                <Link href={href} className="t-button mt-5 flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-brand font-bold text-white transition hover:bg-brand-600">
                    View Details <ArrowRight size={16} />
                </Link>
            </div>
        </article>
    );
}

/** "500+ Lectures" → "500+" so the three meta items fit on one row. */
function shortCount(value: string) {
    return value.split(" ")[0];
}

export function TestSeriesCard({ item }: { item: TestSeries }) {
    const href = `/test-series/${item.id}`;
    const stripe = TONE_SOLID[item.tone || "orange"] ?? TONE_SOLID.orange;
    return (
        <article className={cn(cardShell, "relative")}>
            <span className={cn("absolute inset-x-0 top-0 z-10 h-1", stripe)} />
            <Link href={href} className="relative block h-36 overflow-hidden bg-slate-100">
                <SmartImage src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                {item.badge && <Badge className="absolute left-3 top-3">{item.badge}</Badge>}
                <span className="t-tag absolute bottom-3 left-3 rounded-md bg-white/90 px-2 py-0.5 font-bold text-slate-800">{item.category}</span>
            </Link>
            <div className="flex flex-1 flex-col p-5">
                <h3 className="t-card-title min-h-[2.625rem] font-extrabold text-slate-900">
                    <Link href={href} className="hover:text-brand">{item.title}</Link>
                </h3>
                <p className="t-meta mt-1.5 flex items-center gap-1.5 font-semibold text-slate-600">
                    <ClipboardList size={14} className="text-brand" />
                    {[item.tests, item.questions].filter(Boolean).join(" • ")}
                </p>
                {item.features.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.features.slice(0, 3).map((f) => (
                            <span key={f} className="t-tag-sm rounded bg-slate-50 px-1.5 py-0.5 font-semibold text-slate-500 ring-1 ring-slate-100">
                                {f}
                            </span>
                        ))}
                    </div>
                )}
                <div className="mt-4">
                    <Rating value={item.rating} reviews={item.reviews} />
                </div>
                <div className="mt-auto pt-4">
                    <ItemCountdown item={item} className="mb-3" />
                    <Price price={item.price} oldPrice={item.oldPrice} />
                </div>
                <Link href={href} className="t-button mt-5 flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border-2 border-brand font-bold text-brand transition hover:bg-brand hover:text-white">
                    View Details <ArrowRight size={16} />
                </Link>
            </div>
        </article>
    );
}

export function MaterialCard({ item }: { item: StudyMaterial }) {
    const href = `/study-material/${item.id}`;
    return (
        <article className={cardShell}>
            <Link href={href} className="relative block h-44 overflow-hidden bg-slate-100">
                <SmartImage src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                {item.badge && <Badge className="absolute left-3 top-3">{item.badge}</Badge>}
            </Link>
            <div className="flex flex-1 flex-col p-5">
                <h3 className="t-card-title min-h-[2.625rem] font-extrabold text-slate-900">
                    <Link href={href} className="hover:text-brand">{item.title}</Link>
                </h3>
                <p className="t-meta mt-1.5 flex items-center gap-1.5 font-semibold text-slate-600">
                    <FileText size={14} className="text-brand" />
                    {[item.pages, item.format].filter(Boolean).join(" • ")}
                </p>
                {item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 3).map((t) => (
                            <Tag key={t}>{t}</Tag>
                        ))}
                    </div>
                )}
                <div className="mt-4">
                    <Rating value={item.rating} reviews={item.reviews} />
                </div>
                <div className="mt-auto pt-4">
                    <ItemCountdown item={item} className="mb-3" />
                    <Price price={item.price} oldPrice={item.oldPrice} />
                </div>
                <Link href={href} className="t-button mt-5 flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-brand font-bold text-white transition hover:bg-brand-600">
                    View Details <ArrowRight size={16} />
                </Link>
            </div>
        </article>
    );
}

/* ------------------------------------------------------------------ */
/* People                                                              */
/* ------------------------------------------------------------------ */

export function FacultyCard({ member, detailed = false }: { member: FacultyMember; detailed?: boolean }) {
    const href = `/faculty/${member.id}`;
    return (
        <article className={cardShell}>
            <Link href={href} className="relative block h-[12.5rem] overflow-hidden bg-slate-100">
                <SmartImage src={member.image} alt={member.name} className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full border-2 border-white/80 bg-slate-900/70 text-white transition group-hover:border-brand group-hover:bg-brand">
                    <Play size={12} fill="white" />
                </span>
            </Link>
            <div className="flex flex-1 flex-col p-5">
                <h3 className="t-faculty-name font-extrabold text-slate-900">
                    <Link href={href} className="hover:text-brand">{member.name}</Link>
                </h3>
                <p className="t-faculty-subject mt-1 font-medium text-slate-600">{member.subject}</p>
                {member.experience && (
                    <span className="t-exp-badge mt-3 inline-block self-start rounded-md border border-slate-100 bg-slate-50 px-2 py-1 font-semibold text-slate-500">
                        {member.experience}
                    </span>
                )}
                {detailed && member.bullets.length > 0 && (
                    <ul className="t-card-text mt-4 space-y-1.5 text-slate-600">
                        {member.bullets.slice(0, 4).map((b) => (
                            <li key={b} className="flex items-start gap-2">
                                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand" />
                                {b}
                            </li>
                        ))}
                    </ul>
                )}
                {detailed && (
                    <Link href={href} className="t-meta mt-auto flex items-center gap-1 pt-4 font-bold text-brand hover:text-brand-700">
                        View Profile <ArrowRight size={14} />
                    </Link>
                )}
            </div>
        </article>
    );
}

export function ResultCard({ topper }: { topper: Topper }) {
    return (
        <article className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:shadow-md">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-brand-100">
                <SmartImage src={topper.image} alt={topper.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
                <small className="t-result-exam block font-bold text-slate-500">{topper.exam}</small>
                <strong className="t-rank block font-black text-brand">{topper.rank}</strong>
                <span className="t-result-name block truncate font-semibold text-slate-800">{topper.name}</span>
            </div>
        </article>
    );
}

const RING: Record<string, string> = {
    amber: "from-amber-300 to-amber-500",
    blue: "from-sky-300 to-blue-500",
    emerald: "from-emerald-300 to-emerald-500",
    green: "from-emerald-300 to-emerald-500",
    teal: "from-teal-300 to-teal-500",
    purple: "from-violet-300 to-violet-500",
    rose: "from-rose-300 to-rose-500",
    red: "from-red-300 to-red-500",
    orange: "from-brand-300 to-brand",
};

export function TopperCard({ topper }: { topper: Topper }) {
    return (
        <article className="flex w-full flex-col items-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className={cn("rounded-full bg-gradient-to-br p-1", RING[topper.color || "amber"] ?? RING.amber)}>
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white">
                    <SmartImage src={topper.image} alt={topper.name} className="h-full w-full object-cover" />
                </div>
            </div>
            <span className="t-rank mt-4 rounded-full bg-brand-50 px-3 py-1 font-black text-brand">{topper.rank}</span>
            <h3 className="t-card-title mt-3 font-extrabold text-slate-900">{topper.name}</h3>
            <p className="t-result-exam mt-0.5 font-bold text-slate-500">{topper.exam}</p>
            {topper.quote && <p className="t-card-text mt-3 italic text-slate-600">&ldquo;{topper.quote}&rdquo;</p>}
        </article>
    );
}

export function TestimonialCard({ t }: { t: Testimonial }) {
    return (
        <article className="relative flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <Quote size={36} className="absolute left-5 top-5 text-brand-100" />
            {t.rating ? (
                <div className="relative z-10 flex justify-end gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={14} className={i < (t.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                    ))}
                </div>
            ) : null}
            <p className="t-quote relative z-10 my-4 min-h-[3.75rem] flex-1 italic text-slate-600">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-slate-100">
                    <SmartImage src={t.image} alt={t.name} className="h-full w-full object-cover" />
                </div>
                <div>
                    <strong className="t-author block font-black text-slate-900">{t.name}</strong>
                    <span className="t-author-role block font-semibold text-slate-500">{t.role}</span>
                </div>
            </div>
        </article>
    );
}

/* ------------------------------------------------------------------ */
/* Features / stats                                                    */
/* ------------------------------------------------------------------ */

export function FeatureCard({ icon, tone = "orange", title, text }: { icon?: string; tone?: string; title: string; text: string }) {
    return (
        <article className="min-h-[8.75rem] rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-lg", TONE_SOFT[tone] ?? TONE_SOFT.orange)}>
                <DynamicIcon name={icon} size={20} />
            </div>
            <h3 className="t-card-title font-black text-slate-900">{title}</h3>
            <p className="t-card-text mt-2.5 text-slate-500">{text}</p>
        </article>
    );
}

export function StatsBar({ items }: { items: readonly { icon?: string; value: string; label: string }[] }) {
    const defaults = ["Award", "GraduationCap", "Play", "BookOpen", "Trophy"];
    const cols = items.length >= 5 ? "lg:grid-cols-5" : items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
    return (
        <section className="border-b border-slate-100 bg-white py-8 sm:py-10">
            <div className={cn("container-site grid grid-cols-2 gap-6 sm:grid-cols-3", cols)}>
                {items.map((s, i) => {
                    return (
                        <div key={`${s.label}-${i}`} className="flex items-center gap-3.5">
                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
                                <DynamicIcon name={s.icon || defaults[i % defaults.length]} className="h-6 w-6" />
                            </div>
                            <div>
                                <strong className="t-stat-num block font-black text-slate-900">{s.value}</strong>
                                <span className="t-stat-label mt-1.5 block font-semibold text-slate-500">{s.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Sticky exam tabs                                                    */
/* ------------------------------------------------------------------ */

export function ExamTabs({ tabs, active, onChange }: { tabs: readonly string[]; active: string; onChange: (tab: string) => void }) {
    return (
        <div className="sticky z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md transition-[top] duration-300" style={{ top: "var(--nav-offset, 0px)" }}>
            <div className="container-site no-scrollbar flex gap-3 overflow-x-auto py-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => onChange(tab)}
                        className={cn(
                            "t-search whitespace-nowrap rounded-lg border px-5 py-2.5 font-bold transition",
                            active === tab
                                ? "border-brand bg-brand text-white shadow-md shadow-brand/20"
                                : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* FAQ accordion                                                       */
/* ------------------------------------------------------------------ */

export function FaqList({ items }: { items: readonly { question: string; answer: string }[] }) {
    const [open, setOpen] = useState<number | null>(0);
    return (
        <div className="space-y-3">
            {items.map((f, i) => (
                <div key={`${f.question}-${i}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <button
                        type="button"
                        onClick={() => setOpen(open === i ? null : i)}
                        aria-expanded={open === i}
                        className="t-card-title flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-extrabold text-slate-900"
                    >
                        {f.question}
                        <ChevronDown size={18} className={cn("shrink-0 text-slate-400 transition", open === i && "rotate-180 text-brand")} />
                    </button>
                    {open === i && <p className="t-body border-t border-slate-100 px-5 py-4 text-slate-600">{f.answer}</p>}
                </div>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Cart button                                                         */
/* ------------------------------------------------------------------ */

export function CartButtons({
    kind,
    id,
    primaryText = "Enroll Now",
    secondaryText = "Add to Cart",
}: {
    kind: ProductKind;
    id: string;
    primaryText?: string;
    secondaryText?: string;
}) {
    const cart = useCart();
    const router = useRouter();
    const inCart = cart.has(kind, id);
    return (
        <div className="grid gap-3">
            <button
                type="button"
                onClick={() => {
                    cart.add(kind, id);
                    router.push("/cart");
                }}
                className="t-button flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-600"
            >
                {primaryText} <ArrowRight size={16} />
            </button>
            <button
                type="button"
                onClick={() => (inCart ? router.push("/cart") : cart.add(kind, id))}
                className={cn(
                    "t-button flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 font-bold transition",
                    inCart ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-brand text-brand hover:bg-brand-50"
                )}
            >
                {inCart ? <Check size={16} /> : <ShoppingCart size={16} />}
                {inCart ? "Added — View Cart" : secondaryText}
            </button>
        </div>
    );
}
