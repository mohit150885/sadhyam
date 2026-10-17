"use client";

/* eslint-disable @next/next/no-img-element -- images come from admin-managed URLs on many hosts */

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowRight, ChevronRight, ImageOff, Loader2, Star } from "lucide-react";
import { useContent } from "../../hooks/useContent";
import { cn, discountPercent, formatINR } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

export function Brand({ dark = false }: { dark?: boolean }) {
    const { data } = useContent("global");
    const logo = data.logoImage || "/logo.svg";
    const height = Math.min(80, Math.max(24, Number(data.logoHeight) || 40));
    const showName = data.showSiteName !== false;
    return (
        <Link href="/" aria-label={`${data.siteName} home`} className="flex shrink-0 items-center gap-2.5 no-underline">
            <img
                src={logo}
                alt={showName ? "" : data.siteName}
                style={{ height: `${height / 16}rem` }}
                className="w-auto max-w-[11.25rem] shrink-0 rounded-lg object-contain"
            />
            {showName && (
                <strong className={cn("t-brand whitespace-nowrap font-black tracking-tight", dark ? "text-white" : "text-slate-900")}>
                    {data.siteName}
                </strong>
            )}
        </Link>
    );
}

/* ------------------------------------------------------------------ */
/* Section wrapper + heading                                           */
/* ------------------------------------------------------------------ */

export function Section({
    children,
    className,
    tone = "white",
    id,
}: {
    children: ReactNode;
    className?: string;
    tone?: "white" | "muted" | "navy" | "brand";
    id?: string;
}) {
    const bg = {
        white: "bg-white",
        muted: "bg-slate-50",
        navy: "bg-navy text-white",
        brand: "bg-brand-50",
    }[tone];
    return (
        <section id={id} className={cn("py-12 sm:py-16", bg, className)}>
            <div className="container-site">{children}</div>
        </section>
    );
}

/** Highlights the last word of a heading in the brand colour, like the home page. */
export function AccentTitle({ text, accentWords = 1 }: { text: string; accentWords?: number }) {
    const words = (text || "").trim().split(/\s+/);
    if (words.length <= accentWords) return <span className="text-brand">{text}</span>;
    const head = words.slice(0, -accentWords).join(" ");
    const tail = words.slice(-accentWords).join(" ");
    return (
        <>
            {head} <span className="text-brand">{tail}</span>
        </>
    );
}

export function SectionHeading({
    title,
    description,
    action,
    actionHref = "#",
    decoration,
    accent = true,
    align = "left",
    dark = false,
}: {
    title: string;
    description?: string;
    action?: string;
    actionHref?: string;
    decoration?: ReactNode;
    accent?: boolean;
    align?: "left" | "center";
    dark?: boolean;
}) {
    return (
        <div
            className={cn(
                "relative mb-8 flex gap-4 sm:mb-10",
                align === "center" ? "flex-col items-center text-center" : "items-end justify-between"
            )}
        >
            <div>
                <h2 className={cn("t-section-title font-black", dark ? "text-white" : "text-slate-900")}>
                    {accent ? <AccentTitle text={title} /> : title}
                </h2>
                {description && (
                    <p className={cn("t-section-desc mt-2", dark ? "text-white/70" : "text-slate-500")}>{description}</p>
                )}
            </div>
            {decoration && <div className="absolute right-0 top-0 hidden lg:block">{decoration}</div>}
            {action && align === "left" && (
                <Link
                    href={actionHref}
                    className="t-nav hidden shrink-0 items-center gap-1.5 font-bold text-brand transition hover:text-brand-700 sm:flex"
                >
                    {action}
                    <ArrowRight size={14} />
                </Link>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type BtnVariant = "primary" | "outline" | "ghost" | "dark" | "light" | "glass";

const BTN: Record<BtnVariant, string> = {
    primary: "bg-brand text-white shadow-md shadow-brand/20 hover:bg-brand-600",
    outline: "border-2 border-brand text-brand hover:bg-brand-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    dark: "border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white",
    light: "bg-white text-slate-900 hover:bg-slate-50",
    glass: "border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
};

export function buttonClass(variant: BtnVariant = "primary", size: "md" | "sm" | "lg" = "md", full = false) {
    const sizes = { sm: "h-10 px-4", md: "h-12 px-6", lg: "h-14 px-8" };
    return cn(
        "t-button inline-flex items-center justify-center gap-2 rounded-lg font-bold transition disabled:cursor-not-allowed disabled:opacity-60",
        sizes[size],
        BTN[variant],
        full && "w-full"
    );
}

export function LinkButton({
    href,
    children,
    variant = "primary",
    size = "md",
    full,
    className,
}: {
    href: string;
    children: ReactNode;
    variant?: BtnVariant;
    size?: "md" | "sm" | "lg";
    full?: boolean;
    className?: string;
}) {
    return (
        <Link href={href || "#"} className={cn(buttonClass(variant, size, full), className)}>
            {children}
        </Link>
    );
}

export function Button({
    children,
    variant = "primary",
    size = "md",
    full,
    className,
    loading,
    ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: BtnVariant;
    size?: "md" | "sm" | "lg";
    full?: boolean;
    loading?: boolean;
}) {
    return (
        <button
            type="button"
            {...rest}
            disabled={rest.disabled || loading}
            className={cn(buttonClass(variant, size, full), className)}
        >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {children}
        </button>
    );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

export function SmartImage({
    src,
    alt,
    className,
    fallbackClassName,
}: {
    src?: string;
    alt: string;
    className?: string;
    fallbackClassName?: string;
}) {
    const [failed, setFailed] = useState(false);
    if (!src || failed) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400",
                    className,
                    fallbackClassName
                )}
                aria-label={alt}
            >
                <ImageOff size={22} />
            </div>
        );
    }
    return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}

export function Rating({ value, reviews }: { value: number | string; reviews?: string }) {
    return (
        <div className="t-price-old flex items-center gap-1.5">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="font-extrabold text-slate-800">{value}</span>
            {reviews && <span className="text-slate-500">({reviews})</span>}
        </div>
    );
}

export function Price({ price, oldPrice, large = false }: { price: number; oldPrice?: number; large?: boolean }) {
    const off = discountPercent(price, oldPrice ?? 0);
    return (
        <div className="flex items-end gap-2.5">
            <strong className={cn("font-black leading-none text-slate-900", large ? "text-[2rem]" : "t-price")}>
                {price > 0 ? formatINR(price) : "Free"}
            </strong>
            {oldPrice && oldPrice > price ? (
                <del className="t-price-old mb-0.5 font-medium text-slate-400">{formatINR(oldPrice)}</del>
            ) : null}
            {off > 0 && (
                <small className="t-discount mb-0.5 ml-auto rounded-md bg-emerald-50 px-2 py-1 font-black text-emerald-600">
                    {off}% OFF
                </small>
            )}
        </div>
    );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <span className={cn("t-badge rounded-md bg-brand px-2.5 py-1 font-extrabold uppercase tracking-wide text-white shadow-sm", className)}>
            {children}
        </span>
    );
}

export function Tag({ children }: { children: ReactNode }) {
    return (
        <span className="t-tag rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-semibold text-slate-600">
            {children}
        </span>
    );
}

export function Breadcrumbs({ items, dark = true }: { items: { label: string; href?: string }[]; dark?: boolean }) {
    return (
        <nav aria-label="Breadcrumb" className={cn("t-small mb-5 flex flex-wrap items-center gap-1.5 font-medium", dark ? "text-white/70" : "text-slate-500")}>
            {items.map((item, i) => (
                <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight size={14} />}
                    {item.href ? (
                        <Link href={item.href} className={cn("transition", dark ? "hover:text-white" : "hover:text-brand")}>
                            {item.label}
                        </Link>
                    ) : (
                        <span className={dark ? "text-white" : "text-slate-800"}>{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}

export function Spinner({ label = "Loading..." }: { label?: string }) {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand" />
            <p className="t-small font-semibold text-slate-500">{label}</p>
        </div>
    );
}

export function EmptyState({
    icon,
    title,
    description,
    action,
}: {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex min-h-[20rem] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
            {icon && <div className="text-slate-300">{icon}</div>}
            <h3 className="t-subheading mt-4 font-black text-slate-800">{title}</h3>
            {description && <p className="t-body mt-2 max-w-md text-slate-500">{description}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn("rounded-xl border border-slate-200 bg-white p-6 shadow-sm", className)}>{children}</div>;
}

/** Very small markdown subset: "## heading", "### sub", "- bullet", blank-line paragraphs, [text](url). */
export function RichText({ text, className }: { text: string; className?: string }) {
    const blocks = (text || "").replace(/\r/g, "").split(/\n{2,}/);
    const inline = (s: string, key: string) => {
        const parts: ReactNode[] = [];
        const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
        let last = 0;
        let m: RegExpExecArray | null;
        let i = 0;
        while ((m = re.exec(s))) {
            if (m.index > last) parts.push(s.slice(last, m.index));
            if (m[1]) {
                const safe = /^(https?:|mailto:|tel:|\/)/.test(m[2]) ? m[2] : "#";
                parts.push(
                    <a key={`${key}-a${i++}`} href={safe}>
                        {m[1]}
                    </a>
                );
            } else {
                parts.push(<strong key={`${key}-b${i++}`}>{m[3]}</strong>);
            }
            last = m.index + m[0].length;
        }
        if (last < s.length) parts.push(s.slice(last));
        return parts;
    };

    return (
        <div className={cn("prose-site", className)}>
            {blocks.map((block, bi) => {
                const lines = block.split("\n").filter((l) => l.trim() !== "");
                if (lines.length === 0) return null;
                const out: ReactNode[] = [];
                let bullets: string[] = [];
                const flush = (k: string) => {
                    if (bullets.length) {
                        out.push(
                            <ul key={k}>
                                {bullets.map((b, i) => (
                                    <li key={i}>{inline(b, `${k}-${i}`)}</li>
                                ))}
                            </ul>
                        );
                        bullets = [];
                    }
                };
                let para: string[] = [];
                const flushPara = (k: string) => {
                    if (para.length) {
                        out.push(<p key={k}>{inline(para.join(" "), k)}</p>);
                        para = [];
                    }
                };
                lines.forEach((line, li) => {
                    const k = `${bi}-${li}`;
                    if (line.startsWith("## ") || line.startsWith("### ")) {
                        flush(`${k}-ul`);
                        flushPara(`${k}-p`);
                        out.push(
                            line.startsWith("### ") ? (
                                <h3 key={k}>{inline(line.slice(4), k)}</h3>
                            ) : (
                                <h2 key={k}>{inline(line.slice(3), k)}</h2>
                            )
                        );
                    } else if (/^[-*] /.test(line)) {
                        flushPara(`${k}-p`);
                        bullets.push(line.slice(2));
                    } else {
                        flush(`${k}-ul`);
                        para.push(line);
                    }
                });
                flush(`${bi}-end-ul`);
                flushPara(`${bi}-end-p`);
                return out;
            })}
        </div>
    );
}
