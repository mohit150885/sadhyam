"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone, Search, Send } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useContent, useCourses, useFaculty, useStudyMaterials, useTestSeries } from "../../hooks/useContent";
import { useAuth } from "../providers/AuthProvider";
import { cn } from "../../lib/utils";
import { CourseCard, FacultyCard, FaqList, MaterialCard, TestSeriesCard } from "../site/cards";
import CtaSection from "../site/CtaSection";
import { PageHero } from "../site/Hero";
import { DynamicIcon } from "../site/icons";
import { EmptyState, RichText, Section, SectionHeading, Spinner } from "../site/ui";

const input = "t-body h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-100";

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export function ContactView() {
    const { data: page, loading } = useContent("contact");
    const { data: global } = useContent("global");
    const { user, profile } = useAuth();
    const [form, setForm] = useState({ name: "", email: "", mobile: "", subject: "", message: "" });
    const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const name = form.name || profile?.name || user?.displayName || "";
    const email = form.email || user?.email || "";

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setState("sending");
        try {
            await addDoc(collection(db, "support_queries"), {
                name: name.trim().slice(0, 80),
                email: email.trim().slice(0, 120),
                mobile: form.mobile.replace(/\D/g, "").slice(0, 10),
                subject: (form.subject || page.subjects[0] || "General").slice(0, 80),
                message: form.message.trim().slice(0, 2000),
                userId: user?.uid ?? null,
                status: "open",
                createdAt: serverTimestamp(),
            });
            setState("sent");
            setForm({ name: "", email: "", mobile: "", subject: "", message: "" });
        } catch {
            setState("error");
        }
    };

    if (loading) return <Spinner />;
    const c = global.contact;
    const cards = [
        c.phone && { icon: Phone, title: "Call Us", text: c.phone, href: `tel:${c.phone.replace(/\s/g, "")}` },
        c.email && { icon: Mail, title: "Email Us", text: c.email, href: `mailto:${c.email}` },
        c.whatsapp && { icon: MessageCircle, title: "WhatsApp", text: "Chat with us", href: `https://wa.me/${c.whatsapp.replace(/\D/g, "")}` },
        c.address && { icon: MapPin, title: "Visit Us", text: c.address },
    ].filter(Boolean) as { icon: typeof Phone; title: string; text: string; href?: string }[];

    return (
        <>
            <PageHero breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} title={page.hero.title} description={page.hero.description} banners={page.hero.bannerImages} />
            <Section tone="muted">
                <div className="grid items-start gap-8 lg:grid-cols-[1fr_26.25rem]">
                    <form onSubmit={submit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="t-subheading font-black text-slate-900">{page.formTitle}</h2>
                        {state === "sent" ? (
                            <div className="rounded-xl bg-emerald-50 p-6 text-emerald-800">
                                <CheckCircle2 size={28} />
                                <p className="t-card-title mt-2 font-black">Message sent!</p>
                                <p className="t-body mt-1">Our team will reply to your email within 24 hours.</p>
                                <button type="button" onClick={() => setState("idle")} className="t-search mt-4 font-bold text-emerald-700 underline">Send another message</button>
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <input className={input} placeholder="Your name" value={name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} />
                                    <input className={input} type="email" placeholder="Email address" value={email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                                    <input className={input} inputMode="numeric" maxLength={10} placeholder="Mobile (optional)" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })} />
                                    <select className={input} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                                        {page.subjects.map((s) => (
                                            <option key={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <textarea className={cn(input, "h-auto py-3")} rows={6} placeholder="How can we help you?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required minLength={10} maxLength={2000} />
                                {state === "error" && <p className="t-small font-semibold text-red-600">Could not send your message. Please try again or email us directly.</p>}
                                <button type="submit" disabled={state === "sending"} className="t-button flex h-12 items-center gap-2 rounded-xl bg-brand px-6 font-bold text-white hover:bg-brand-600 disabled:opacity-60">
                                    <Send size={16} /> {state === "sending" ? "Sending..." : "Send Message"}
                                </button>
                            </>
                        )}
                    </form>
                    <div className="space-y-4">
                        {cards.map((card) => {
                            const Icon = card.icon;
                            const body = (
                                <>
                                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand"><Icon size={20} /></span>
                                    <span>
                                        <span className="t-card-title block font-extrabold text-slate-900">{card.title}</span>
                                        <span className="t-card-text block text-slate-600">{card.text}</span>
                                    </span>
                                </>
                            );
                            return card.href ? (
                                <a key={card.title} href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200">
                                    {body}
                                </a>
                            ) : (
                                <div key={card.title} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">{body}</div>
                            );
                        })}
                        {c.hours && (
                            <p className="t-small flex items-center gap-2 px-1 font-semibold text-slate-500"><Clock size={15} /> {c.hours}</p>
                        )}
                        {page.mapEmbedUrl && page.mapEmbedUrl.startsWith("https://") && (
                            <iframe src={page.mapEmbedUrl} title="Map" className="h-64 w-full rounded-xl border-0" loading="lazy" />
                        )}
                    </div>
                </div>
            </Section>
        </>
    );
}

/* ------------------------------------------------------------------ */
/* Help center                                                         */
/* ------------------------------------------------------------------ */

export function HelpView() {
    const { data, loading } = useContent("help");
    const { data: faqs } = useContent("faqs");
    if (loading) return <Spinner />;
    return (
        <>
            <PageHero breadcrumbs={[{ label: "Home", href: "/" }, { label: "Help Center" }]} title={data.hero.title} description={data.hero.description} banners={data.hero.bannerImages} />
            <Section tone="muted">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {data.topics.map((t) => {
                        return (
                            <Link key={t.title} href={t.link || "/faqs"} className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md">
                                <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-50 text-brand"><DynamicIcon name={t.iconName} size={20} /></span>
                                <h3 className="t-card-title mt-4 font-extrabold text-slate-900 group-hover:text-brand">{t.title}</h3>
                                <p className="t-card-text mt-1 text-slate-500">{t.text}</p>
                            </Link>
                        );
                    })}
                </div>
            </Section>
            <Section>
                <div className="mx-auto max-w-3xl">
                    <SectionHeading title="Popular Questions" align="center" />
                    <FaqList items={faqs.items.slice(0, 5)} />
                    <div className="mt-8 text-center">
                        <Link href="/contact" className="t-button inline-flex h-12 items-center gap-2 rounded-lg bg-brand px-6 font-bold text-white hover:bg-brand-600">
                            Still need help? Contact us <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </Section>
        </>
    );
}

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */

export function FaqsView() {
    const { data, loading } = useContent("faqs");
    const [q, setQ] = useState("");
    const [cat, setCat] = useState("All");
    const cats = useMemo(() => ["All", ...Array.from(new Set(data.items.map((f) => f.category).filter(Boolean)))], [data.items]);
    const shown = data.items.filter(
        (f) => (cat === "All" || f.category === cat) && (!q || `${f.question} ${f.answer}`.toLowerCase().includes(q.toLowerCase()))
    );
    if (loading) return <Spinner />;
    return (
        <>
            <PageHero breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQs" }]} title={data.hero.title} description={data.hero.description} banners={data.hero.bannerImages} />
            <Section tone="muted">
                <div className="mx-auto max-w-3xl">
                    <label className="t-body flex h-12 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-slate-400 focus-within:border-brand">
                        <Search size={18} />
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions..." className="w-full bg-transparent text-slate-800 outline-none" />
                    </label>
                    <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto">
                        {cats.map((c) => (
                            <button key={c} type="button" onClick={() => setCat(c)} className={cn("t-search whitespace-nowrap rounded-lg border px-4 py-2 font-bold", cat === c ? "border-brand bg-brand text-white" : "border-slate-200 bg-white text-slate-600")}>
                                {c}
                            </button>
                        ))}
                    </div>
                    <div className="mt-6">
                        {shown.length ? <FaqList items={shown} /> : <EmptyState title="No matching questions" description="Try a different search or contact us." />}
                    </div>
                </div>
            </Section>
            <CtaSection />
        </>
    );
}

/* ------------------------------------------------------------------ */
/* Legal pages                                                         */
/* ------------------------------------------------------------------ */

export function LegalView({ doc: key }: { doc: "refund" | "terms" | "privacy" }) {
    const { data, loading } = useContent("legal");
    if (loading) return <Spinner />;
    const page = data[key];
    return (
        <>
            <PageHero breadcrumbs={[{ label: "Home", href: "/" }, { label: page.title }]} title={page.title} description={page.updatedOn ? `Last updated: ${page.updatedOn}` : undefined} />
            <Section tone="muted">
                <article className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                    <RichText text={page.content} />
                </article>
            </Section>
        </>
    );
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

export function SearchView() {
    const params = useSearchParams();
    const [q, setQ] = useState(params.get("q") ?? "");
    const courses = useCourses();
    const tests = useTestSeries();
    const materials = useStudyMaterials();
    const faculty = useFaculty();

    const term = q.trim().toLowerCase();
    const match = (s: string) => term.length > 0 && s.toLowerCase().includes(term);
    const rc = courses.items.filter((c) => match(`${c.title} ${c.category} ${c.instructor} ${c.type}`));
    const rt = tests.items.filter((t) => match(`${t.title} ${t.category} ${t.type}`));
    const rm = materials.items.filter((m) => match(`${m.title} ${m.category} ${m.subject ?? ""} ${m.tags.join(" ")}`));
    const rf = faculty.items.filter((f) => match(`${f.name} ${f.subject}`));
    const total = rc.length + rt.length + rm.length + rf.length;

    return (
        <>
            <section className="hero-shell bg-navy">
                <div className="container-site hero-inner">
                <div className="hero-content">
                    <h1 className="t-hero-title font-black text-white">Search <span className="text-brand">Everything</span></h1>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            window.history.replaceState(null, "", `/search?q=${encodeURIComponent(q)}`);
                        }}
                        className="t-body mt-5 flex h-14 max-w-2xl items-center gap-3 rounded-xl bg-white px-4 text-slate-400"
                    >
                        <Search size={20} />
                        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses, test series, notes, faculty..." className="w-full bg-transparent text-slate-900 outline-none" />
                    </form>
                    {term && <p className="t-small mt-3 font-semibold text-white/70">{total} result(s) for &ldquo;{q}&rdquo;</p>}
                </div>
                </div>
            </section>
            <div className="container-site space-y-12 py-10">
                {!term && <EmptyState icon={<Search size={44} />} title="What are you looking for?" description="Try “UPSC”, “Polity”, “Prelims test” or a faculty name." />}
                {term && total === 0 && <EmptyState icon={<Search size={44} />} title="No results found" description="Try a shorter or different keyword." />}
                <ResultGroup title="Courses" count={rc.length}>{rc.map((c) => <CourseCard key={c.id} course={c} />)}</ResultGroup>
                <ResultGroup title="Test Series" count={rt.length}>{rt.map((t) => <TestSeriesCard key={t.id} item={t} />)}</ResultGroup>
                <ResultGroup title="Study Material" count={rm.length}>{rm.map((m) => <MaterialCard key={m.id} item={m} />)}</ResultGroup>
                <ResultGroup title="Faculty" count={rf.length}>{rf.map((f) => <FacultyCard key={f.id} member={f} />)}</ResultGroup>
            </div>
        </>
    );
}

function ResultGroup({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
    if (!count) return null;
    return (
        <section>
            <h2 className="t-subheading mb-5 font-black text-slate-900">
                {title} <span className="text-brand">({count})</span>
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
        </section>
    );
}
