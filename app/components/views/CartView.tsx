"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgePercent, Lock, ShieldCheck, ShoppingCart, Trash2, X } from "lucide-react";
import { auth } from "../../lib/firebase";
import { useContent, useCourses, useStudyMaterials, useTestSeries } from "../../hooks/useContent";
import { useAuth } from "../providers/AuthProvider";
import { useCart } from "../providers/CartProvider";
import type { ProductKind } from "../../lib/models";
import { formatINR } from "../../lib/utils";
import { CourseCard, TestSeriesCard } from "../site/cards";
import CtaSection from "../site/CtaSection";
import { PageHero } from "../site/Hero";
import { AuthPromptModal } from "./AuthViews";
import { Section, SectionHeading, SmartImage, Spinner } from "../site/ui";

type Line = { kind: ProductKind; id: string; title: string; image: string; price: number; oldPrice: number; href: string; label: string; meta: string };

export function useCartLines() {
    const cart = useCart();
    const courses = useCourses();
    const tests = useTestSeries();
    const materials = useStudyMaterials();
    const loading = courses.loading || tests.loading || materials.loading;

    const lines = useMemo<Line[]>(() => {
        return cart.lines
            .map((l): Line | null => {
                if (l.kind === "course") {
                    const c = courses.items.find((x) => x.id === l.id);
                    return c ? { kind: l.kind, id: c.id, title: c.title, image: c.image, price: c.price, oldPrice: c.oldPrice, href: `/courses/${c.id}`, label: "Course", meta: [c.lectures, c.validity].filter(Boolean).join(" • ") } : null;
                }
                if (l.kind === "test") {
                    const t = tests.items.find((x) => x.id === l.id);
                    return t ? { kind: l.kind, id: t.id, title: t.title, image: t.image, price: t.price, oldPrice: t.oldPrice, href: `/test-series/${t.id}`, label: "Test Series", meta: [t.tests, t.questions].filter(Boolean).join(" • ") } : null;
                }
                const m = materials.items.find((x) => x.id === l.id);
                return m ? { kind: l.kind, id: m.id, title: m.title, image: m.image, price: m.price, oldPrice: m.oldPrice, href: `/study-material/${m.id}`, label: "Study Material", meta: [m.pages, m.format].filter(Boolean).join(" • ") } : null;
            })
            .filter((l): l is Line => l !== null);
    }, [cart.lines, courses.items, tests.items, materials.items]);

    return { lines, loading, courses: courses.items, tests: tests.items };
}

export default function CartView() {
    const { data: page } = useContent("cart");
    const cart = useCart();
    const { user, profile } = useAuth();
    const router = useRouter();
    const { lines, loading, courses, tests } = useCartLines();

    const [code, setCode] = useState("");
    const [coupon, setCoupon] = useState<{ code: string; discount: number; message: string } | null>(null);
    const [couponError, setCouponError] = useState("");
    const [checking, setChecking] = useState(false);
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState("");
    const [authOpen, setAuthOpen] = useState(false);

    const subtotal = lines.reduce((s, l) => s + l.price, 0);
    const mrp = lines.reduce((s, l) => s + Math.max(l.oldPrice, l.price), 0);
    const discount = coupon ? Math.min(coupon.discount, subtotal) : 0;
    const total = Math.max(0, subtotal - discount);

    const applyCoupon = async (e?: FormEvent) => {
        e?.preventDefault();
        setCouponError("");
        if (!code.trim()) return;
        setChecking(true);
        try {
            const res = await fetch("/api/coupon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: code.trim(), items: lines.map((l) => ({ kind: l.kind, id: l.id })) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Invalid coupon");
            setCoupon({ code: data.code, discount: data.discount, message: data.message });
        } catch (err) {
            setCoupon(null);
            setCouponError(err instanceof Error ? err.message : "Invalid coupon");
        } finally {
            setChecking(false);
        }
    };

    const checkout = async () => {
        setError("");
        // Guests must log in or sign up first. The popup keeps them on the cart
        // and places the order automatically once they are signed in.
        const current = auth.currentUser;
        if (!current) {
            setAuthOpen(true);
            return;
        }
        setPlacing(true);
        try {
            const token = await current.getIdToken();
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    items: lines.map((l) => ({ kind: l.kind, id: l.id })),
                    couponCode: coupon?.code,
                    name: profile?.name || current.displayName,
                    mobile: profile?.mobile,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Could not place the order");
            cart.clear();
            router.push(`/orders/${data.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not place the order");
            setPlacing(false);
        }
    };

    const recommended = [
        ...courses.filter((c) => !cart.has("course", c.id)).slice(0, 2).map((c) => <CourseCard key={`c-${c.id}`} course={c} />),
        ...tests.filter((t) => !cart.has("test", t.id)).slice(0, 2).map((t) => <TestSeriesCard key={`t-${t.id}`} item={t} />),
    ];

    return (
        <>
            <PageHero breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]} title={page.title} description={page.description} />

            <section className="container-site py-10">
                {loading ? (
                    <Spinner label="Loading your cart..." />
                ) : lines.length === 0 ? (
                    <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
                        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand">
                            <ShoppingCart size={28} />
                        </span>
                        <h2 className="t-subheading mt-5 font-black text-slate-900">{page.emptyState.title}</h2>
                        <p className="t-body mt-2 text-slate-500">{page.emptyState.description}</p>
                        <Link href={page.emptyState.buttonLink} className="t-button mt-6 inline-flex h-12 items-center gap-2 rounded-lg bg-brand px-6 font-bold text-white hover:bg-brand-600">
                            {page.emptyState.buttonText} <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid items-start gap-8 lg:grid-cols-[1fr_23.75rem]">
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                                <h2 className="t-subheading font-black text-slate-900">Cart Items ({lines.length})</h2>
                                <button type="button" onClick={cart.clear} className="t-small font-bold text-red-600 hover:underline">
                                    Remove all
                                </button>
                            </div>
                            <ul className="divide-y divide-slate-100">
                                {lines.map((l) => (
                                    <li key={`${l.kind}-${l.id}`} className="flex gap-4 p-5 sm:p-6">
                                        <Link href={l.href} className="shrink-0">
                                            <SmartImage src={l.image} alt={l.title} className="h-20 w-28 rounded-lg object-cover sm:h-24 sm:w-36" />
                                        </Link>
                                        <div className="min-w-0 flex-1">
                                            <span className="t-badge rounded bg-brand-50 px-2 py-0.5 font-extrabold uppercase text-brand">{l.label}</span>
                                            <Link href={l.href} className="t-card-title mt-1.5 block font-extrabold text-slate-900 hover:text-brand">
                                                {l.title}
                                            </Link>
                                            <p className="t-meta mt-1 text-slate-500">{l.meta}</p>
                                            <div className="mt-2 flex items-baseline gap-2 sm:hidden">
                                                <strong className="t-card-title font-black">{formatINR(l.price)}</strong>
                                                {l.oldPrice > l.price && <del className="t-small text-slate-400">{formatINR(l.oldPrice)}</del>}
                                            </div>
                                        </div>
                                        <div className="hidden text-right sm:block">
                                            <strong className="t-price block font-black text-slate-900">{formatINR(l.price)}</strong>
                                            {l.oldPrice > l.price && <del className="t-price-old text-slate-400">{formatINR(l.oldPrice)}</del>}
                                        </div>
                                        <button type="button" onClick={() => cart.remove(l.kind, l.id)} aria-label={`Remove ${l.title}`} className="self-start rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                                            <Trash2 size={18} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <aside className="space-y-5 lg:sticky" style={{ top: "calc(var(--nav-offset, 0px) + 1.25rem)" }}>
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="t-subheading font-black text-slate-900">Order Summary</h2>

                                {coupon ? (
                                    <div className="t-small mt-5 flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3 font-semibold text-emerald-700">
                                        <span className="flex items-center gap-2">
                                            <BadgePercent size={16} /> {coupon.code} — {coupon.message}
                                        </span>
                                        <button type="button" onClick={() => setCoupon(null)} aria-label="Remove coupon">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={applyCoupon} className="mt-5 flex gap-2">
                                        <input
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                                            placeholder="Coupon code"
                                            className="t-search h-11 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 font-semibold uppercase outline-none focus:border-brand"
                                        />
                                        <button type="submit" disabled={checking} className="t-search h-11 rounded-lg border-2 border-brand px-4 font-bold text-brand hover:bg-brand-50 disabled:opacity-50">
                                            {checking ? "..." : "Apply"}
                                        </button>
                                    </form>
                                )}
                                {couponError && <p className="t-small mt-2 text-red-600">{couponError}</p>}

                                <dl className="t-body mt-5 space-y-3 border-t border-slate-100 pt-5">
                                    <Row label="Total MRP" value={formatINR(mrp)} />
                                    {mrp > subtotal && <Row label="Discount on MRP" value={`− ${formatINR(mrp - subtotal)}`} green />}
                                    {discount > 0 && <Row label={`Coupon (${coupon?.code})`} value={`− ${formatINR(discount)}`} green />}
                                    <div className="flex justify-between border-t border-slate-100 pt-3">
                                        <dt className="t-card-title font-black text-slate-900">Total Amount</dt>
                                        <dd className="t-price font-black text-slate-900">{formatINR(total)}</dd>
                                    </div>
                                </dl>
                                {mrp > total && (
                                    <p className="t-small mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-center font-bold text-emerald-700">
                                        You save {formatINR(mrp - total)} on this order
                                    </p>
                                )}
                                {error && <p className="t-small mt-3 rounded-lg bg-red-50 px-3 py-2 text-red-700">{error}</p>}
                                <button
                                    type="button"
                                    onClick={checkout}
                                    disabled={placing}
                                    className="t-button mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand font-bold text-white shadow-md hover:bg-brand-600 disabled:opacity-60"
                                >
                                    <Lock size={16} />
                                    {placing ? "Placing order..." : user ? "Place Order" : "Login / Sign Up to Place Order"}
                                </button>
                                <Link href="/courses" className="t-search mt-3 flex h-11 w-full items-center justify-center rounded-lg border-2 border-slate-200 font-bold text-brand hover:border-brand">
                                    Continue Shopping
                                </Link>
                            </div>
                            <ul className="t-small grid grid-cols-2 gap-3">
                                {page.trustBadges.map((b) => (
                                    <li key={b} className="flex items-center gap-2 rounded-lg bg-white p-3 font-semibold text-slate-600 ring-1 ring-slate-200">
                                        <ShieldCheck size={16} className="shrink-0 text-emerald-500" /> {b}
                                    </li>
                                ))}
                            </ul>
                        </aside>
                    </div>
                )}
            </section>

            {recommended.length > 0 && (
                <Section tone="muted">
                    <SectionHeading title="Recommended For You" />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{recommended}</div>
                </Section>
            )}
            <CtaSection />
            <AuthPromptModal
                open={authOpen}
                onClose={() => setAuthOpen(false)}
                onSuccess={() => {
                    setAuthOpen(false);
                    void checkout();
                }}
            />
        </>
    );
}

function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
    return (
        <div className="flex justify-between">
            <dt className="text-slate-600">{label}</dt>
            <dd className={green ? "font-bold text-emerald-600" : "font-bold text-slate-900"}>{value}</dd>
        </div>
    );
}
