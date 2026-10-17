"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, ChevronDown, Headphones, Mail, Phone, Star } from "lucide-react";
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useContent } from "../../hooks/useContent";
import { useAuth } from "../providers/AuthProvider";
import type { ProductKind, Review, Schedulable, Testimonial } from "../../lib/models";
import { cn, formatDate, toMillis } from "../../lib/utils";
import { TestimonialCard } from "./cards";
import { Breadcrumbs, Price, SmartImage } from "./ui";
import { ItemCountdown } from "./Countdown";

/* ------------------------------------------------------------------ */
/* Hero for course / test / material pages                             */
/* ------------------------------------------------------------------ */

export function DetailHero({
    breadcrumbs,
    label,
    title,
    subtitle,
    image,
    meta,
    children,
}: {
    breadcrumbs: { label: string; href?: string }[];
    label?: string;
    title: string;
    subtitle?: string;
    image?: string;
    meta?: ReactNode;
    children?: ReactNode;
}) {
    return (
        <section className="hero-shell bg-navy text-white">
            {image && (
                <>
                    <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40" />
                </>
            )}
            <div className="container-site hero-inner">
                <div className="hero-content">
                <Breadcrumbs items={breadcrumbs} />
                {label && (
                    <span className="t-hero-badge mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-bold uppercase tracking-wide text-white/90 backdrop-blur-md">
                        {label}
                    </span>
                )}
                <h1 className="t-hero-title font-black">{title}</h1>
                {subtitle && <p className="t-hero-desc mt-4 max-w-[37.5rem] font-medium text-white/85">{subtitle}</p>}
                {meta && <div className="t-hero-features mt-6 flex flex-wrap gap-x-6 gap-y-3 font-semibold text-white/90">{meta}</div>}
                {children}
                </div>
            </div>
        </section>
    );
}

export function HeroMeta({ icon, children }: { icon: ReactNode; children: ReactNode }) {
    return (
        <span className="flex items-center gap-2">
            <span className="text-brand">{icon}</span>
            {children}
        </span>
    );
}

/* ------------------------------------------------------------------ */
/* In-page anchor tabs                                                 */
/* ------------------------------------------------------------------ */

export function AnchorTabs({ tabs }: { tabs: { id: string; label: string }[] }) {
    const [active, setActive] = useState(tabs[0]?.id);
    useEffect(() => {
        const onScroll = () => {
            let current = tabs[0]?.id;
            for (const t of tabs) {
                const el = document.getElementById(t.id);
                if (el && el.getBoundingClientRect().top < 200) current = t.id;
            }
            setActive(current);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [tabs]);

    return (
        <div className="sticky z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md transition-[top] duration-300" style={{ top: "var(--nav-offset, 0px)" }}>
            <div className="container-site no-scrollbar flex gap-6 overflow-x-auto">
                {tabs.map((t) => (
                    <a
                        key={t.id}
                        href={`#${t.id}`}
                        className={cn(
                            "t-search whitespace-nowrap border-b-2 py-4 font-bold transition",
                            active === t.id ? "border-brand text-brand" : "border-transparent text-slate-600 hover:text-brand"
                        )}
                    >
                        {t.label}
                    </a>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Content blocks                                                      */
/* ------------------------------------------------------------------ */

export function DetailBlock({ id, title, children, action }: { id?: string; title: string; children: ReactNode; action?: ReactNode }) {
    const words = title.trim().split(/\s+/);
    return (
        <section id={id} className="scroll-mt-40 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="t-subheading font-black text-slate-900">
                    {words.slice(0, -1).join(" ")} <span className="text-brand">{words.slice(-1)}</span>
                </h2>
                {action}
            </div>
            {children}
        </section>
    );
}

export function CheckGrid({ items }: { items: readonly string[] }) {
    return (
        <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((i) => (
                <li key={i} className="t-body flex items-start gap-2.5 font-medium text-slate-700">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" />
                    {i}
                </li>
            ))}
        </ul>
    );
}

export function InfoTiles({ items }: { items: readonly { title: string; text: string }[] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {items.map((w, i) => (
                <div key={`${w.title}-${i}`} className="flex gap-3 rounded-lg bg-slate-50 p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand">
                        <CheckCircle2 size={18} />
                    </span>
                    <div>
                        <h3 className="t-card-title font-extrabold text-slate-900">{w.title}</h3>
                        <p className="t-card-text mt-1 text-slate-500">{w.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function Accordion({ items }: { items: readonly { title: string; details: string }[] }) {
    const [open, setOpen] = useState<number | null>(0);
    return (
        <div className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200">
            {items.map((s, i) => (
                <div key={`${s.title}-${i}`}>
                    <button
                        type="button"
                        onClick={() => setOpen(open === i ? null : i)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
                    >
                        <span className="flex items-center gap-3">
                            <span className="t-small grid h-7 w-7 place-items-center rounded-full bg-brand-50 font-black text-brand">{i + 1}</span>
                            <span className="t-card-title font-extrabold text-slate-900">{s.title}</span>
                        </span>
                        <ChevronDown size={18} className={cn("shrink-0 text-slate-400 transition", open === i && "rotate-180")} />
                    </button>
                    {open === i && <p className="t-card-text bg-slate-50/50 px-5 pb-4 pl-[3.75rem] text-slate-600">{s.details}</p>}
                </div>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Sidebar price card                                                  */
/* ------------------------------------------------------------------ */

export function PriceCard({
    image,
    price,
    oldPrice,
    includes,
    children,
    schedule,
}: {
    image?: string;
    price: number;
    oldPrice: number;
    includes: string[];
    children: ReactNode;
    /** Optional scheduling settings; shows a countdown above the buttons. */
    schedule?: Schedulable;
}) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {image && <SmartImage src={image} alt="" className="h-44 w-full object-cover" />}
            <div className="p-6">
                <Price price={price} oldPrice={oldPrice} large />
                {schedule && <ItemCountdown item={schedule} variant="box" className="mt-5" />}
                <div className="mt-5">{children}</div>
                {includes.length > 0 && (
                    <>
                        <p className="t-search mt-6 font-extrabold text-slate-900">This includes:</p>
                        <ul className="mt-3 space-y-2.5">
                            {includes.map((f) => (
                                <li key={f} className="t-card-text flex items-center gap-2 font-medium text-slate-600">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

export function HelpCard({ title, text }: { title?: string; text?: string }) {
    const { data } = useContent("global");
    return (
        <div className="rounded-xl bg-navy p-6 text-white">
            <Headphones className="text-brand" size={28} />
            <h3 className="t-card-title mt-3 font-extrabold">{title || "Need help?"}</h3>
            <p className="t-card-text mt-1 text-white/70">{text || "Our team is happy to answer your questions."}</p>
            <div className="t-small mt-4 space-y-2 font-semibold">
                {data.contact.phone && (
                    <a href={`tel:${data.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-brand-300">
                        <Phone size={15} /> {data.contact.phone}
                    </a>
                )}
                {data.contact.email && (
                    <a href={`mailto:${data.contact.email}`} className="flex items-center gap-2 hover:text-brand-300">
                        <Mail size={15} /> {data.contact.email}
                    </a>
                )}
            </div>
            <Link href="/contact" className="t-small mt-5 inline-flex rounded-lg bg-brand px-4 py-2 font-bold text-white hover:bg-brand-600">
                Contact Us
            </Link>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Reviews: approved Firestore reviews + submit form + fallback        */
/* ------------------------------------------------------------------ */

export function ReviewsSection({
    id,
    title,
    kind,
    itemId,
    itemTitle,
    fallback,
}: {
    id?: string;
    title: string;
    kind: ProductKind | "faculty";
    itemId: string;
    itemTitle: string;
    fallback: readonly Testimonial[];
}) {
    const { user, profile } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

    useEffect(() => {
        if (!itemId) return;
        const q = query(collection(db, "reviews"), where("itemId", "==", itemId), where("status", "==", "approved"));
        return onSnapshot(
            q,
            (snap) =>
                setReviews(
                    snap.docs
                        .map((d) => ({ id: d.id, ...d.data() }) as Review)
                        .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
                ),
            () => setReviews([])
        );
    }, [itemId]);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user || comment.trim().length < 10) return;
        setStatus("saving");
        try {
            await addDoc(collection(db, "reviews"), {
                kind,
                itemId,
                itemTitle,
                userId: user.uid,
                userName: profile?.name || user.displayName || "Student",
                rating,
                comment: comment.trim().slice(0, 1000),
                status: "pending",
                createdAt: serverTimestamp(),
            });
            setStatus("done");
            setComment("");
        } catch {
            setStatus("error");
        }
    };

    const cards: Testimonial[] =
        reviews.length > 0
            ? reviews.map((r) => ({ name: r.userName, role: formatDate(r.createdAt), quote: r.comment, image: "", rating: r.rating }))
            : [...fallback];

    return (
        <section id={id} className="scroll-mt-40">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <h2 className="t-section-title font-black text-slate-900">
                    {title.split(" ").slice(0, -1).join(" ")} <span className="text-brand">{title.split(" ").slice(-1)}</span>
                </h2>
                <button type="button" onClick={() => setFormOpen((v) => !v)} className="t-search rounded-lg border-2 border-brand px-4 py-2 font-bold text-brand hover:bg-brand-50">
                    Write a Review
                </button>
            </div>

            {formOpen && (
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    {!user ? (
                        <p className="t-body text-slate-600">
                            Please <Link href="/login" className="font-bold text-brand">log in</Link> to write a review.
                        </p>
                    ) : status === "done" ? (
                        <p className="t-body font-semibold text-emerald-600">Thank you! Your review will appear after it is approved.</p>
                    ) : (
                        <form onSubmit={submit} className="space-y-4">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                                        <Star size={24} className={n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                minLength={10}
                                maxLength={1000}
                                required
                                placeholder="Share your experience (at least 10 characters)"
                                className="t-body w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand"
                            />
                            {status === "error" && <p className="t-small text-red-600">Could not submit your review. Please try again.</p>}
                            <button type="submit" disabled={status === "saving"} className="t-search rounded-lg bg-brand px-5 py-2.5 font-bold text-white hover:bg-brand-600 disabled:opacity-60">
                                {status === "saving" ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    )}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
                {cards.slice(0, 6).map((t, i) => (
                    <TestimonialCard key={`${t.name}-${i}`} t={t} />
                ))}
            </div>
        </section>
    );
}

export function NotFoundBlock({ title, href, label }: { title: string; href: string; label: string }) {
    return (
        <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
            <p className="t-section-title font-black text-slate-900">{title}</p>
            <p className="t-body mt-3 text-slate-500">It may have been removed or the link is incorrect.</p>
            <Link href={href} className="t-button mt-6 rounded-lg bg-brand px-6 py-3 font-bold text-white hover:bg-brand-600">
                {label}
            </Link>
        </div>
    );
}
