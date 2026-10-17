"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Award, BookOpen, CheckCircle2, Play, Quote, Star, Users } from "lucide-react";
import { useContent, useCourses, useFaculty, useToppers } from "../../hooks/useContent";
import { youtubeEmbed } from "../../lib/utils";
import { CourseCard, ExamTabs, FacultyCard, StatsBar, TestimonialCard, TopperCard } from "../site/cards";
import CtaSection from "../site/CtaSection";
import { AnchorTabs, DetailBlock, InfoTiles, NotFoundBlock, ReviewsSection } from "../site/details";
import { PageHero } from "../site/Hero";
import { Breadcrumbs, EmptyState, Section, SectionHeading, SmartImage, Spinner } from "../site/ui";
import { DynamicIcon, TONE_SOFT } from "../site/icons";

/* ================================================================== */
/* Faculty list                                                        */
/* ================================================================== */

export function FacultyView() {
    const { items, page, loading } = useFaculty();
    const tabs = useMemo(() => (page.subjects.length ? page.subjects : ["All Faculty"]), [page.subjects]);
    const [tab, setTab] = useState(tabs[0]);

    const shown = useMemo(() => {
        if (tab === tabs[0]) return items;
        const t = tab.toLowerCase();
        return items.filter((f) => f.subject.toLowerCase().includes(t));
    }, [items, tab, tabs]);

    if (loading) return <Spinner />;
    const v = page.sectionVisibility;

    return (
        <>
            {v.hero && (
                <PageHero
                    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Faculty" }]}
                    title={page.hero.title}
                    description={page.hero.description}
                    banners={page.hero.bannerImages}
                    highlights={page.hero.highlights}
                />
            )}
            {v.stats && <StatsBar items={page.stats.map((s, i) => ({ ...s, icon: ["Users", "Award", "GraduationCap", "Trophy"][i % 4] }))} />}
            {v.subjects && tabs.length > 1 && <ExamTabs tabs={tabs} active={tab} onChange={setTab} />}
            {v.items && (
                <Section tone="muted">
                    <SectionHeading title="Meet Our Faculty" description="Learn from subject experts with a passion for teaching." />
                    {shown.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {shown.map((f) => (
                                <FacultyCard key={f.id} member={f} detailed />
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={<Users size={44} />} title="No faculty in this subject yet" />
                    )}
                </Section>
            )}
            {v.intro && page.intro.title && (
                <Section>
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        <div>
                            <SectionHeading title={page.intro.title} />
                            <p className="t-body -mt-4 text-slate-600">{page.intro.text}</p>
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                {page.stats.slice(0, 2).map((s) => (
                                    <div key={s.label} className="rounded-xl bg-brand-50 p-4">
                                        <p className="t-stat-num font-black text-brand">{s.value}</p>
                                        <p className="t-stat-label mt-1 font-semibold text-slate-600">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <SmartImage src={page.intro.image} alt="" className="h-[20rem] w-full rounded-2xl object-cover shadow-lg" />
                            {page.intro.badge && (
                                <span className="t-search absolute bottom-4 left-4 rounded-lg bg-white/95 px-4 py-2 font-extrabold text-slate-900 shadow">
                                    {page.intro.badge}
                                </span>
                            )}
                        </div>
                    </div>
                </Section>
            )}
            {v.cta && <CtaSection />}
        </>
    );
}

/* ================================================================== */
/* Faculty profile                                                     */
/* ================================================================== */

export function FacultyDetailView({ id }: { id: string }) {
    const { items, loading } = useFaculty();
    const { data: cfg } = useContent("facultyDetails");
    const { data: home } = useContent("home");
    const courses = useCourses();

    if (loading) return <Spinner />;
    const f = items.find((m) => m.id === id);
    if (!f) return <NotFoundBlock title="Faculty member not found" href="/faculty" label="View All Faculty" />;

    const s = cfg.sections;
    const theirCourses = courses.items.filter(
        (c) => c.facultyIds?.includes(f.id) || c.instructor.toLowerCase().includes(f.name.toLowerCase().replace(/^(dr|prof)\.?\s*/i, ""))
    );
    const video = youtubeEmbed(f.videoUrl);
    const others = items.filter((m) => m.id !== f.id).slice(0, 4);

    const tabs = [
        s.profile.visible && { id: "about", label: "About" },
        s.approach.visible && { id: "approach", label: "Teaching Approach" },
        s.courses.visible && theirCourses.length > 0 && { id: "courses", label: "Courses" },
        s.testimonials.visible && { id: "reviews", label: "Reviews" },
    ].filter(Boolean) as { id: string; label: string }[];

    return (
        <>
            <section className="hero-shell bg-gradient-to-br from-brand-50 via-white to-slate-50">
                <div className="container-site hero-inner flex-col items-stretch justify-center">
                    <Breadcrumbs dark={false} items={[{ label: "Home", href: "/" }, { label: "Faculty", href: "/faculty" }, { label: f.name }]} />
                    <div className="grid items-center gap-6 sm:grid-cols-[11.25rem_1fr] sm:gap-8 lg:grid-cols-[20rem_1fr] lg:gap-10">
                        <div className="relative mx-auto w-full max-w-[10rem] sm:max-w-[11.25rem] lg:max-w-[20rem]">
                            <div className="absolute -inset-3 rounded-[1.75rem] bg-brand-100" />
                            <SmartImage src={f.image} alt={f.name} className="relative aspect-[4/5] w-full rounded-2xl object-cover object-top shadow-xl" />
                            {f.experience && (
                                <span className="t-badge absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1.5 font-extrabold text-white shadow-lg lg:-bottom-4 lg:px-4 lg:py-2">
                                    {f.experience} Experience
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="t-hero-title font-black text-slate-900">{f.name}</h1>
                            <p className="t-subheading mt-2 font-black text-slate-600">{f.subject}</p>
                            <div className="mt-6 flex flex-wrap gap-4">
                                {f.students && <Stat icon={<Users size={18} />} value={f.students} label="Students" />}
                                {f.rating && <Stat icon={<Star size={18} />} value={f.rating} label="Rating" />}
                                <Stat icon={<BookOpen size={18} />} value={String(theirCourses.length)} label="Courses" />
                            </div>
                            {f.bullets.length > 0 && (
                                <ul className="mt-6 hidden gap-2.5 lg:grid lg:grid-cols-2">
                                    {f.bullets.map((b) => (
                                        <li key={b} className="t-body flex items-start gap-2 font-medium text-slate-700">
                                            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" /> {b}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {f.quote && (
                                <blockquote className="t-quote mt-6 hidden lg:flex gap-3 rounded-xl border-l-4 border-brand bg-white p-4 italic text-slate-600 shadow-sm">
                                    <Quote size={20} className="shrink-0 text-brand" /> {f.quote}
                                </blockquote>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <AnchorTabs tabs={tabs} />

            <div className="container-site space-y-8 py-10">
                {s.profile.visible && (
                    <DetailBlock id="about" title={s.profile.title}>
                        {video && (
                            <div className="mb-6 aspect-video overflow-hidden rounded-lg">
                                <iframe src={video} title={`${f.name} introduction`} className="h-full w-full" allowFullScreen />
                            </div>
                        )}
                        {f.bullets.length > 0 && (
                            <ul className="mb-5 grid gap-2.5 sm:grid-cols-2 lg:hidden">
                                {f.bullets.map((b) => (
                                    <li key={b} className="t-body flex items-start gap-2 font-medium text-slate-700">
                                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" /> {b}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <p className="t-body text-slate-600">
                            {f.bio || `${f.name} teaches ${f.subject} at SadhyamIAS with ${f.experience || "years of"} experience guiding aspirants.`}
                        </p>
                    </DetailBlock>
                )}
                {s.approach.visible && cfg.approach.length > 0 && (
                    <DetailBlock id="approach" title={s.approach.title}>
                        <InfoTiles items={cfg.approach} />
                    </DetailBlock>
                )}
                {s.courses.visible && theirCourses.length > 0 && (
                    <section id="courses" className="scroll-mt-40">
                        <SectionHeading title={s.courses.title} />
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {theirCourses.slice(0, 8).map((c) => (
                                <CourseCard key={c.id} course={c} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {s.testimonials.visible && (
                <Section tone="muted">
                    <ReviewsSection id="reviews" title={s.testimonials.title} kind="faculty" itemId={f.id} itemTitle={f.name} fallback={home.testimonials.items} />
                </Section>
            )}

            {others.length > 0 && (
                <Section>
                    <SectionHeading title="Other Faculty" action="View All Faculty" actionHref="/faculty" />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {others.map((m) => (
                            <FacultyCard key={m.id} member={m} />
                        ))}
                    </div>
                </Section>
            )}
            <CtaSection />
        </>
    );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand">{icon}</span>
            <span>
                <span className="t-card-title block font-black text-slate-900">{value}</span>
                <span className="t-small block text-slate-500">{label}</span>
            </span>
        </div>
    );
}

/* ================================================================== */
/* Results                                                             */
/* ================================================================== */

export function ResultsView() {
    const { items: toppers, page, loading } = useToppers();
    const { data: home } = useContent("home");
    const [tab, setTab] = useState(page.examTabs[0]);
    const [playing, setPlaying] = useState<string | null>(null);

    const shown = useMemo(
        () => (tab === page.examTabs[0] ? toppers : toppers.filter((t) => t.category === tab || t.exam.toLowerCase().includes(tab.toLowerCase()))),
        [toppers, tab, page.examTabs]
    );

    if (loading) return <Spinner />;
    const v = page.sectionVisibility;

    return (
        <>
            {v.hero && (
                <PageHero
                    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Results" }]}
                    title={page.hero.title}
                    description={page.hero.description}
                    banners={page.hero.bannerImages}
                    highlights={page.hero.highlights}
                />
            )}
            {v.stats && <StatsBar items={page.stats.map((s, i) => ({ ...s, icon: ["Trophy", "Award", "GraduationCap", "Users"][i % 4] }))} />}
            {v.toppers && (
                <>
                    <ExamTabs tabs={page.examTabs} active={tab} onChange={setTab} />
                    <Section tone="muted">
                        <SectionHeading title="Our Toppers" description="Celebrating the hard work and success of our students." />
                        {shown.length > 0 ? (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                                {shown.map((t) => (
                                    <TopperCard key={t.id} topper={t} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState icon={<Award size={44} />} title="Results coming soon" description="Toppers for this exam will be added shortly." />
                        )}
                    </Section>
                </>
            )}
            {v.videos && page.videos.length > 0 && (
                <Section>
                    <SectionHeading title="Success Stories" description="Hear directly from our achievers." />
                    <div className="grid gap-6 md:grid-cols-3">
                        {page.videos.map((vid, i) => {
                            const embed = youtubeEmbed(vid.videoUrl);
                            const key = `${vid.title}-${i}`;
                            return (
                                <article key={key} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                    <div className="relative aspect-video bg-slate-900">
                                        {playing === key && embed ? (
                                            <iframe src={`${embed}?autoplay=1`} title={vid.title} className="h-full w-full" allow="autoplay" allowFullScreen />
                                        ) : (
                                            <button type="button" onClick={() => embed && setPlaying(key)} className="group block h-full w-full" aria-label={`Play ${vid.title}`}>
                                                <SmartImage src={vid.thumbnail} alt="" className="h-full w-full object-cover opacity-80" />
                                                <span className="absolute inset-0 grid place-items-center">
                                                    <span className="grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-lg transition group-hover:scale-110">
                                                        <Play size={22} fill="white" />
                                                    </span>
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="t-card-title font-extrabold text-slate-900">{vid.title}</h3>
                                        <p className="t-meta mt-1 font-semibold text-slate-500">
                                            {vid.name} • <span className="text-brand">{vid.rank}</span>
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </Section>
            )}
            {v.yearlyResults && page.yearly.length > 0 && (
                <Section tone="navy">
                    <SectionHeading title="Results Over the Years" dark />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {page.yearly.map((y) => (
                            <div key={y.year} className="rounded-xl border border-white/10 bg-white/5 p-6">
                                <p className="t-small font-bold text-white/60">{y.year}</p>
                                <p className="t-stat-num mt-2 font-black text-brand">{y.selections}</p>
                                <p className="t-card-text mt-2 text-white/75">{y.note}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}
            {v.testimonials && home.testimonials.items.length > 0 && (
                <Section tone="muted">
                    <SectionHeading title="What Our Successful Students Say" />
                    <div className="grid gap-6 md:grid-cols-3">
                        {home.testimonials.items.map((t, i) => (
                            <TestimonialCard key={`${t.name}-${i}`} t={t} />
                        ))}
                    </div>
                </Section>
            )}
            {v.cta && <CtaSection />}
        </>
    );
}

/* ================================================================== */
/* About                                                               */
/* ================================================================== */

export function AboutView() {
    const { data, loading } = useContent("about");
    if (loading) return <Spinner />;
    const v = data.sectionVisibility;
    const ICONS = ["Target", "Users", "TrendingUp", "Award", "Sparkles"];

    return (
        <>
            {v.hero && (
                <PageHero
                    breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
                    eyebrow={data.hero.eyebrow}
                    title={data.hero.title}
                    description={data.hero.description}
                    banners={data.hero.bannerImages}
                >
                    {data.hero.primaryButton?.text && (
                        <Link href={data.hero.primaryButton.link} className="t-button inline-flex h-12 items-center rounded-lg bg-brand px-6 font-bold text-white shadow-lg shadow-brand/25 hover:bg-brand-600">
                            {data.hero.primaryButton.text}
                        </Link>
                    )}
                    {data.hero.secondaryButton?.text && (
                        <Link href={data.hero.secondaryButton.link} className="t-button inline-flex h-12 items-center rounded-lg border border-white/20 bg-white/10 px-6 font-bold text-white backdrop-blur-md hover:bg-white/20">
                            {data.hero.secondaryButton.text}
                        </Link>
                    )}
                </PageHero>
            )}

            {v.story && (
                <Section>
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        <div>
                            <SectionHeading title={data.story.title} />
                            <div className="-mt-4 space-y-4">
                                {data.story.paragraphs.map((p, i) => (
                                    <p key={i} className="t-body text-slate-600">{p}</p>
                                ))}
                            </div>
                        </div>
                        <SmartImage src={data.story.image} alt="" className="h-[21.25rem] w-full rounded-2xl object-cover shadow-lg" />
                    </div>
                </Section>
            )}

            {v.stats && (
                <Section tone="muted">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {[data.mission, data.vision].map((m, i) => (
                            <div key={m.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <span className={`grid h-11 w-11 place-items-center rounded-lg ${i === 0 ? TONE_SOFT.orange : TONE_SOFT.blue}`}>
                                    <DynamicIcon name={i === 0 ? "Target" : "Lightbulb"} size={22} />
                                </span>
                                <h3 className="t-subheading mt-4 font-black text-slate-900">{m.title}</h3>
                                <p className="t-body mt-2 text-slate-600">{m.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
                        {data.stats.map((s) => (
                            <div key={s.label} className="rounded-xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
                                <p className="t-stat-num font-black text-brand">{s.value}</p>
                                <p className="t-stat-label mt-2 font-semibold text-slate-500">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {v.whyChoose && (
                <Section>
                    <SectionHeading title="Why Choose SadhyamIAS?" description="A complete ecosystem to help you crack your dream exam." />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                        {data.whyChoose.map((w, i) => {
                            return (
                                <article key={w.title} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                                    <span className={`grid h-10 w-10 place-items-center rounded-lg ${TONE_SOFT[w.tone] ?? TONE_SOFT.orange}`}>
                                        <DynamicIcon name={ICONS[i % ICONS.length]} size={20} />
                                    </span>
                                    <h3 className="t-card-title mt-4 font-black text-slate-900">{w.title}</h3>
                                    <p className="t-card-text mt-2 text-slate-500">{w.description}</p>
                                </article>
                            );
                        })}
                    </div>
                </Section>
            )}

            {v.timeline && (
                <Section tone="muted">
                    <SectionHeading title="Our Journey So Far" align="center" />
                    <ol className="relative grid gap-6 md:grid-cols-5">
                        <span className="absolute left-0 right-0 top-[1.375rem] hidden h-0.5 bg-brand-200 md:block" />
                        {data.timeline.map((t) => (
                            <li key={t.year} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
                                <span className="t-small relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand font-black text-white shadow-md ring-4 ring-white">
                                    {t.year.slice(-2)}
                                </span>
                                <div>
                                    <p className="t-small font-black text-brand">{t.year}</p>
                                    <h3 className="t-card-title font-extrabold text-slate-900">{t.title}</h3>
                                    <p className="t-card-text mt-1 text-slate-500">{t.description}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </Section>
            )}

            {v.values && (
                <Section>
                    <SectionHeading title="Our Core Values" />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {data.values.map((val) => (
                            <div key={val.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <CheckCircle2 className="text-brand" size={24} />
                                <h3 className="t-card-title mt-3 font-extrabold text-slate-900">{val.title}</h3>
                                <p className="t-card-text mt-1 text-slate-500">{val.description}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}
            {v.cta && <CtaSection />}
        </>
    );
}
