"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, CirclePlay } from "lucide-react";
import { useContent } from "../../hooks/useContent";
import { AccentTitle, Breadcrumbs } from "./ui";
import { cn } from "../../lib/utils";

function useBanners(own?: readonly string[]) {
    const { data: home } = useContent("home");
    const clean = (list: unknown) =>
        Array.isArray(list) ? list.filter((b): b is string => typeof b === "string" && b.trim() !== "") : [];
    const mine = clean(own);
    return mine.length > 0 ? mine : clean(home.hero.banners);
}

/** Full-bleed sliding banner background with optional arrows and dots. */
function BannerCarousel({
    banners,
    interval = 5,
    showArrows = true,
    showIndicators = true,
}: {
    banners: string[];
    interval?: number;
    showArrows?: boolean;
    showIndicators?: boolean;
}) {
    const [rawSlide, setSlide] = useState(0);
    const count = banners.length;
    const slide = count ? rawSlide % count : 0;

    useEffect(() => {
        if (count <= 1) return;
        const t = window.setInterval(() => setSlide((s) => (s + 1) % count), Math.max(2, interval) * 1000);
        return () => window.clearInterval(t);
    }, [count, interval]);

    return (
        <>
            <div className="absolute inset-0 z-0 overflow-hidden">
                {count > 0 ? (
                    <div className="flex h-full w-full transition-transform duration-700 ease-in-out" style={{ transform: `translate3d(-${slide * 100}%,0,0)` }}>
                        {banners.map((src, i) => (
                            <div key={`${src}-${i}`} className="relative h-full w-full shrink-0 bg-navy">
                                <img src={src} alt="" className="h-full w-full object-cover object-center opacity-60 mix-blend-luminosity" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-navy via-slate-900 to-slate-800" />
                )}
            </div>
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-navy/95 via-navy/70 to-navy/20" />

            {count > 1 && showArrows && (
                <>
                    <button
                        type="button"
                        onClick={() => setSlide((s) => (s - 1 + count) % count)}
                        aria-label="Previous banner"
                        className="absolute left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-white/10 text-white opacity-0 backdrop-blur-md transition hover:bg-brand group-hover:opacity-100 sm:grid"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setSlide((s) => (s + 1) % count)}
                        aria-label="Next banner"
                        className="absolute right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-white/10 text-white opacity-0 backdrop-blur-md transition hover:bg-brand group-hover:opacity-100 sm:grid"
                    >
                        <ChevronRight size={20} />
                    </button>
                </>
            )}
            {count > 1 && showIndicators && (
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setSlide(i)}
                            aria-label={`Go to banner ${i + 1}`}
                            className={cn("h-2 rounded-full transition-all", slide === i ? "w-8 bg-brand" : "w-2 bg-white/40 hover:bg-white")}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

/* ------------------------------------------------------------------ */
/* Home hero                                                           */
/* ------------------------------------------------------------------ */

type HomeHeroData = {
    badge?: string;
    headingLine1?: string;
    headingLine2?: string;
    featuresLine?: string;
    description?: string;
    primaryBtnText?: string;
    primaryBtnLink?: string;
    secondaryBtnText?: string;
    secondaryBtnLink?: string;
    banners?: readonly string[];
    examTabs?: readonly { id?: string | number; name: string; link?: string; active?: boolean }[];
    settings?: { autoSlideInterval?: number; showArrows?: boolean; showIndicators?: boolean };
};

export function HomeHero({ data }: { data: HomeHeroData }) {
    const banners = useBanners(data.banners);
    const tabs = (Array.isArray(data.examTabs) ? data.examTabs : []).filter((t) => t && typeof t.name === "string");
    const [selected, setSelected] = useState<string>("");

    // Older content stored "features | line\n\ndescription" in one field.
    let features = data.featuresLine?.trim() || "";
    let description = data.description?.trim() || "";
    if (features && description.startsWith(features)) {
        description = description.slice(features.length).trim();
    } else if (!features && description.includes("\n\n")) {
        const [first, ...rest] = description.split(/\n\n+/);
        if (first.includes("|")) {
            features = first;
            description = rest.join("\n\n");
        }
    }
    const featureList = features.split("|").map((f) => f.trim()).filter(Boolean);
    const activeTab = selected || tabs.find((t) => t.active)?.name || tabs[0]?.name;

    return (
        <section className="hero-shell group bg-navy">
            <BannerCarousel
                banners={banners}
                interval={data.settings?.autoSlideInterval ?? 5}
                showArrows={data.settings?.showArrows !== false}
                showIndicators={data.settings?.showIndicators !== false}
            />
            <div className="container-site hero-inner">
                <div className="hero-content">
                    {data.badge && (
                        <div className="t-hero-badge mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-bold text-white/90 backdrop-blur-md">
                            {data.badge}
                        </div>
                    )}
                    <h1 className="t-hero-title font-black text-white">
                        {data.headingLine1}
                        <br />
                        <span className="text-brand">{data.headingLine2}</span>
                    </h1>

                    {featureList.length > 0 && (
                        <ul className="t-hero-features mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-bold text-white">
                            {featureList.map((f) => (
                                <li key={f} className="flex items-center gap-1.5">
                                    <CheckCircle2 size={16} className="text-brand" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    )}

                    {description && (
                        <p className="t-hero-desc mt-4 max-w-[37.5rem] whitespace-pre-line font-medium text-white/85">{description}</p>
                    )}

                    <div className="mt-8 flex flex-wrap gap-4">
                        {data.primaryBtnText && (
                            <Link
                                href={data.primaryBtnLink || "/signup"}
                                className="t-button inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand px-6 font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-600"
                            >
                                {data.primaryBtnText}
                                <ArrowRight size={16} />
                            </Link>
                        )}
                        {data.secondaryBtnText && (
                            <Link
                                href={data.secondaryBtnLink || "/courses"}
                                className="t-button inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                            >
                                <CirclePlay size={16} />
                                {data.secondaryBtnText}
                            </Link>
                        )}
                    </div>

                    {tabs.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-2.5">
                            {tabs.map((t, i) => (
                                <Link
                                    key={t.id ?? `${t.name}-${i}`}
                                    href={t.link || `/courses?exam=${encodeURIComponent(t.name)}`}
                                    onClick={() => setSelected(t.name)}
                                    className={cn(
                                        "t-hero-tab rounded-lg border px-3.5 py-2 font-bold transition",
                                        activeTab === t.name
                                            ? "border-brand bg-brand text-white shadow-md shadow-brand/25"
                                            : "border-white/20 bg-white/10 text-white/80 backdrop-blur-sm hover:bg-white/20 hover:text-white"
                                    )}
                                >
                                    {t.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Inner-page hero (courses, test series, faculty, results, ...)       */
/* ------------------------------------------------------------------ */

export function PageHero({
    eyebrow,
    title,
    description,
    banners,
    highlights,
    breadcrumbs,
    children,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    banners?: readonly string[];
    highlights?: readonly string[];
    breadcrumbs?: { label: string; href?: string }[];
    children?: ReactNode;
    /** @deprecated heroes are always home-page size now */
    compact?: boolean;
}) {
    const list = useBanners(banners);
    const hl = (highlights ?? []).filter(Boolean);
    return (
        <section className="hero-shell group bg-navy">
            <BannerCarousel banners={list} showArrows={list.length > 1} />
            <div className="container-site hero-inner">
                <div className="hero-content text-white">
                    {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
                    {eyebrow && (
                        <div className="t-hero-badge mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-bold uppercase tracking-wide text-white/90 backdrop-blur-md">
                            {eyebrow}
                        </div>
                    )}
                    <h1 className="t-hero-title font-black">
                        <AccentTitle text={title} />
                    </h1>
                    {description && <p className="t-hero-desc mt-4 max-w-[37.5rem] whitespace-pre-line font-medium text-white/85">{description}</p>}
                    {hl.length > 0 && (
                        <ul className="t-hero-features mt-7 flex flex-wrap gap-x-6 gap-y-3 font-semibold">
                            {hl.map((h) => (
                                <li key={h} className="flex items-center gap-2">
                                    <span className="grid h-7 w-7 place-items-center rounded bg-white/10 text-brand backdrop-blur-sm">
                                        <CheckCircle2 size={15} />
                                    </span>
                                    {h}
                                </li>
                            ))}
                        </ul>
                    )}
                    {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
                </div>
            </div>
        </section>
    );
}
