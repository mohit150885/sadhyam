"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Clock,
    Download,
    FileText,
    Globe,
    Languages,
    Play,
    Star,
    UserRound,
} from "lucide-react";
import { useContent, useCourses, useFaculty, useStudyMaterials, useTestSeries } from "../../hooks/useContent";
import { useEnrollments } from "../../hooks/useOrders";
import type { ProductKind } from "../../lib/models";
import { formatDate, matchExam, youtubeEmbed } from "../../lib/utils";
import { Countdown } from "../site/Countdown";
import { CartButtons, CourseCard, FacultyCard, FaqList, MaterialCard, TestSeriesCard } from "../site/cards";
import CtaSection from "../site/CtaSection";
import {
    Accordion,
    AnchorTabs,
    CheckGrid,
    DetailBlock,
    DetailHero,
    HelpCard,
    HeroMeta,
    InfoTiles,
    NotFoundBlock,
    PriceCard,
    ReviewsSection,
} from "../site/details";
import { Section, SectionHeading, SmartImage, Spinner } from "../site/ui";

function EnrollBox({ kind, id, primary, secondary }: { kind: ProductKind; id: string; primary?: string; secondary?: string }) {
    const { owned, pending } = useEnrollments();
    const key = `${kind}:${id}`;
    if (owned.has(key)) {
        return (
            <div className="rounded-lg bg-emerald-50 p-4 text-emerald-800">
                <p className="t-search flex items-center gap-2 font-extrabold">
                    <CheckCircle2 size={18} /> You are enrolled
                </p>
                <Link href={kind === "test" ? "/my-tests" : "/my-courses"} className="t-search mt-3 flex h-11 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white hover:bg-emerald-700">
                    Go to {kind === "test" ? "My Test Series" : "My Courses"}
                </Link>
            </div>
        );
    }
    if (pending.has(key)) {
        return (
            <div className="rounded-lg bg-amber-50 p-4 text-amber-800">
                <p className="t-search flex items-center gap-2 font-extrabold">
                    <Clock size={18} /> Payment confirmation pending
                </p>
                <Link href="/orders" className="t-search mt-3 flex h-11 items-center justify-center rounded-lg bg-amber-500 font-bold text-white hover:bg-amber-600">
                    View My Orders
                </Link>
            </div>
        );
    }
    return <CartButtons kind={kind} id={id} primaryText={primary} secondaryText={secondary} />;
}

function Related({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Section tone="white">
            <SectionHeading title={title} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
        </Section>
    );
}

/* ================================================================== */
/* Course                                                              */
/* ================================================================== */

export function CourseDetailView({ id }: { id: string }) {
    const router = useRouter();
    const { items, page, loading } = useCourses();
    const { data: cfg } = useContent("courseDetails");
    const { data: home } = useContent("home");
    const faculty = useFaculty();

    // Old links like /courses/upsc → filtered course list.
    const exam = matchExam(id, page.examTabs.slice(1));
    useEffect(() => {
        if (exam) router.replace(`/courses?exam=${encodeURIComponent(exam)}`);
    }, [exam, router]);

    if (loading || exam) return <Spinner />;
    const course = items.find((c) => c.id === id);
    if (!course) return <NotFoundBlock title="Course not found" href="/courses" label="Browse Courses" />;

    const s = cfg.sections;
    const syllabus = course.syllabus?.length ? course.syllabus : cfg.defaultSyllabus;
    const faqs = course.faqs?.length ? course.faqs : cfg.faqs;
    const teachers = course.facultyIds?.length
        ? faculty.items.filter((f) => course.facultyIds?.includes(f.id))
        : faculty.items.slice(0, 4);
    const video = youtubeEmbed(course.previewVideo);
    const related = items.filter((c) => c.id !== course.id && c.category === course.category).slice(0, 4);

    const tabs = [
        s.overview.visible && { id: "overview", label: "Overview" },
        s.syllabus.visible && { id: "syllabus", label: "Syllabus" },
        s.faculty.visible && teachers.length > 0 && { id: "faculty", label: "Faculty" },
        s.testimonials.visible && { id: "reviews", label: "Reviews" },
        s.faqs.visible && { id: "faqs", label: "FAQs" },
    ].filter(Boolean) as { id: string; label: string }[];

    return (
        <>
            <DetailHero
                breadcrumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: course.title }]}
                label={course.badge || cfg.heroLabel}
                title={course.title}
                subtitle={course.description}
                image={course.image}
                meta={
                    <>
                        <HeroMeta icon={<UserRound size={16} />}>{course.instructor}</HeroMeta>
                        <HeroMeta icon={<Star size={16} className="fill-amber-400 text-amber-400" />}>
                            {course.rating} ({course.reviews} reviews)
                        </HeroMeta>
                        {course.lectures && <HeroMeta icon={<Play size={16} />}>{course.lectures}</HeroMeta>}
                        <HeroMeta icon={<CalendarDays size={16} />}>{course.validity}</HeroMeta>
                        <HeroMeta icon={<Languages size={16} />}>{course.language}</HeroMeta>
                    </>
                }
            />
            <AnchorTabs tabs={tabs} />

            <div className="container-site py-10">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                    <div className="min-w-0 flex-1 space-y-8">
                        {s.overview.visible && (
                            <DetailBlock id="overview" title={s.overview.title}>
                                {video && (
                                    <div className="mb-6 aspect-video overflow-hidden rounded-lg">
                                        <iframe src={video} title="Course preview" className="h-full w-full" allowFullScreen />
                                    </div>
                                )}
                                <InfoTiles items={cfg.whyChoose} />
                                {course.highlights && course.highlights.length > 0 && (
                                    <div className="mt-6">
                                        <CheckGrid items={course.highlights} />
                                    </div>
                                )}
                            </DetailBlock>
                        )}

                        {s.includes.visible && (
                            <DetailBlock title={s.includes.title}>
                                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {[
                                        [Play, course.lectures],
                                        [FileText, course.pdfs],
                                        [ClipboardList, course.tests],
                                        [CalendarDays, course.validity],
                                    ]
                                        .filter(([, v]) => v)
                                        .map(([Icon, v]) => {
                                            const I = Icon as typeof Play;
                                            return (
                                                <div key={v as string} className="rounded-lg bg-brand-50 p-4 text-center">
                                                    <I className="mx-auto text-brand" size={22} />
                                                    <p className="t-search mt-2 font-extrabold text-slate-900">{v as string}</p>
                                                </div>
                                            );
                                        })}
                                </div>
                                <CheckGrid items={course.features} />
                            </DetailBlock>
                        )}

                        {s.syllabus.visible && syllabus.length > 0 && (
                            <DetailBlock id="syllabus" title={s.syllabus.title}>
                                <Accordion items={syllabus} />
                            </DetailBlock>
                        )}

                        {s.faculty.visible && teachers.length > 0 && (
                            <DetailBlock id="faculty" title={s.faculty.title}>
                                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                    {teachers.map((f) => (
                                        <FacultyCard key={f.id} member={f} />
                                    ))}
                                </div>
                            </DetailBlock>
                        )}
                    </div>

                    <aside className="w-full shrink-0 space-y-6 lg:sticky lg:w-[22.5rem]" style={{ top: "calc(var(--nav-offset, 0px) + 4.5rem)" }}>
                        <PriceCard image={course.image} price={course.price} oldPrice={course.oldPrice} includes={course.features} schedule={course}>
                            <EnrollBox kind="course" id={course.id} primary={cfg.primaryButtonText} secondary={cfg.secondaryButtonText} />
                        </PriceCard>
                        <HelpCard title={cfg.help.title} text={cfg.help.text} />
                    </aside>
                </div>
            </div>

            {s.testimonials.visible && (
                <Section tone="muted">
                    <ReviewsSection id="reviews" title={s.testimonials.title} kind="course" itemId={course.id} itemTitle={course.title} fallback={home.testimonials.items} />
                </Section>
            )}

            {s.faqs.visible && faqs.length > 0 && (
                <Section>
                    <div id="faqs" className="mx-auto max-w-3xl scroll-mt-40">
                        <SectionHeading title={s.faqs.title} align="center" />
                        <FaqList items={faqs} />
                    </div>
                </Section>
            )}

            {related.length > 0 && (
                <Related title="Related Courses">
                    {related.map((c) => (
                        <CourseCard key={c.id} course={c} />
                    ))}
                </Related>
            )}

            <CtaSection />
        </>
    );
}

/* ================================================================== */
/* Test series                                                         */
/* ================================================================== */

export function TestSeriesDetailView({ id }: { id: string }) {
    const router = useRouter();
    const { items, page, loading } = useTestSeries();
    const { data: cfg } = useContent("testSeriesDetails");
    const { data: home } = useContent("home");

    const exam = matchExam(id, page.examTabs.slice(1));
    useEffect(() => {
        if (exam) router.replace(`/test-series?exam=${encodeURIComponent(exam)}`);
    }, [exam, router]);

    if (loading || exam) return <Spinner />;
    const item = items.find((t) => t.id === id);
    if (!item) return <NotFoundBlock title="Test series not found" href="/test-series" label="Browse Test Series" />;

    const s = cfg.sections;
    const structure = item.structure?.length ? item.structure : cfg.defaultStructure;
    const faqs = item.faqs?.length ? item.faqs : cfg.faqs;
    const schedule = item.schedule ?? [];
    const related = items.filter((t) => t.id !== item.id).slice(0, 4);

    const tabs = [
        s.overview.visible && { id: "overview", label: "Overview" },
        s.structure.visible && { id: "structure", label: "Structure" },
        s.schedule.visible && schedule.length > 0 && { id: "schedule", label: "Schedule" },
        s.testimonials.visible && { id: "reviews", label: "Reviews" },
        s.faqs.visible && { id: "faqs", label: "FAQs" },
    ].filter(Boolean) as { id: string; label: string }[];

    return (
        <>
            <DetailHero
                breadcrumbs={[{ label: "Home", href: "/" }, { label: "Test Series", href: "/test-series" }, { label: item.title }]}
                label={item.badge || item.category}
                title={item.title}
                subtitle={item.description}
                image={item.image}
                meta={
                    <>
                        <HeroMeta icon={<ClipboardList size={16} />}>{item.tests}</HeroMeta>
                        <HeroMeta icon={<FileText size={16} />}>{item.questions}</HeroMeta>
                        <HeroMeta icon={<Star size={16} className="fill-amber-400 text-amber-400" />}>
                            {item.rating} ({item.reviews})
                        </HeroMeta>
                        <HeroMeta icon={<Languages size={16} />}>{item.language}</HeroMeta>
                        <HeroMeta icon={<CalendarDays size={16} />}>{item.validity}</HeroMeta>
                    </>
                }
            />
            <AnchorTabs tabs={tabs} />

            <div className="container-site py-10">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                    <div className="min-w-0 flex-1 space-y-8">
                        {s.overview.visible && (
                            <DetailBlock id="overview" title={s.overview.title}>
                                {item.description && <p className="t-body mb-6 text-slate-600">{item.description}</p>}
                                <CheckGrid items={item.features} />
                            </DetailBlock>
                        )}
                        {s.structure.visible && structure.length > 0 && (
                            <DetailBlock id="structure" title={s.structure.title}>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {structure.map((st, i) => (
                                        <div key={`${st.title}-${i}`} className="rounded-lg border border-slate-200 p-5">
                                            <span className="t-small grid h-8 w-8 place-items-center rounded-full bg-brand-50 font-black text-brand">{i + 1}</span>
                                            <h3 className="t-card-title mt-3 font-extrabold text-slate-900">{st.title}</h3>
                                            <p className="t-card-text mt-1 text-slate-500">{st.details}</p>
                                        </div>
                                    ))}
                                </div>
                            </DetailBlock>
                        )}
                        {s.schedule.visible && schedule.length > 0 && (
                            <DetailBlock id="schedule" title={s.schedule.title}>
                                <div className="overflow-x-auto">
                                    <table className="t-card-text w-full min-w-[30rem] text-left">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-slate-500">
                                                <th className="py-3 pr-4 font-bold">Date</th>
                                                <th className="py-3 pr-4 font-bold">Test</th>
                                                <th className="py-3 font-bold">Topics</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedule.map((r, i) => (
                                                <tr key={i} className="border-b border-slate-100">
                                                    <td className="py-3 pr-4 font-bold text-slate-900">
                                                        {r.date || (r.startsAt ? formatDate(r.startsAt, true) : "")}
                                                        {r.showCountdown && r.startsAt && (
                                                            <Countdown target={r.startsAt} label="in" variant="inline" className="t-tag-sm mt-1 block font-semibold text-brand-700" />
                                                        )}
                                                    </td>
                                                    <td className="py-3 pr-4 font-semibold text-slate-800">{r.title}</td>
                                                    <td className="py-3 text-slate-600">{r.topic}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </DetailBlock>
                        )}
                    </div>

                    <aside className="w-full shrink-0 space-y-6 lg:sticky lg:w-[22.5rem]" style={{ top: "calc(var(--nav-offset, 0px) + 4.5rem)" }}>
                        <PriceCard image={item.image} price={item.price} oldPrice={item.oldPrice} includes={item.features} schedule={item}>
                            <EnrollBox kind="test" id={item.id} primary={cfg.primaryButtonText} secondary={cfg.secondaryButtonText} />
                            {item.sampleUrl && (
                                <a href={item.sampleUrl} target="_blank" rel="noreferrer" className="t-search mt-3 flex items-center justify-center gap-2 font-bold text-brand hover:underline">
                                    <Download size={16} /> Download Sample Test
                                </a>
                            )}
                        </PriceCard>
                        <HelpCard />
                    </aside>
                </div>
            </div>

            {s.whyTake.visible && (
                <Section tone="navy">
                    <SectionHeading title={s.whyTake.title} dark />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {cfg.whyTake.map((w, i) => (
                            <div key={`${w.title}-${i}`} className="rounded-xl border border-white/10 bg-white/5 p-5">
                                <CheckCircle2 className="text-brand" size={24} />
                                <h3 className="t-card-title mt-3 font-extrabold text-white">{w.title}</h3>
                                <p className="t-card-text mt-1 text-white/70">{w.text}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {s.testimonials.visible && (
                <Section tone="muted">
                    <ReviewsSection id="reviews" title={s.testimonials.title} kind="test" itemId={item.id} itemTitle={item.title} fallback={home.testimonials.items} />
                </Section>
            )}

            {s.faqs.visible && faqs.length > 0 && (
                <Section>
                    <div id="faqs" className="mx-auto max-w-3xl scroll-mt-40">
                        <SectionHeading title={s.faqs.title} align="center" />
                        <FaqList items={faqs} />
                    </div>
                </Section>
            )}

            {related.length > 0 && (
                <Related title="More Test Series">
                    {related.map((t) => (
                        <TestSeriesCard key={t.id} item={t} />
                    ))}
                </Related>
            )}
            <CtaSection />
        </>
    );
}

/* ================================================================== */
/* Study material                                                      */
/* ================================================================== */

export function StudyMaterialDetailView({ id }: { id: string }) {
    const router = useRouter();
    const { items, page, loading } = useStudyMaterials();
    const { data: cfg } = useContent("studyMaterialDetails");
    const { data: home } = useContent("home");

    const exam = matchExam(id, page.examTabs.slice(1));
    useEffect(() => {
        if (exam) router.replace(`/study-material?exam=${encodeURIComponent(exam)}`);
    }, [exam, router]);

    if (loading || exam) return <Spinner />;
    const item = items.find((m) => m.id === id);
    if (!item) return <NotFoundBlock title="Study material not found" href="/study-material" label="Browse Study Material" />;

    const s = cfg.sections;
    const contents = item.contents?.length ? item.contents : cfg.defaultContents;
    const faqs = item.faqs?.length ? item.faqs : cfg.faqs;
    const samples = item.samplePages ?? [];
    const related = items.filter((m) => m.id !== item.id).slice(0, 4);
    const includes = [item.pages, item.format, item.language, ...item.tags].filter(Boolean) as string[];

    const tabs = [
        s.overview.visible && { id: "overview", label: "Overview" },
        s.contents.visible && { id: "contents", label: "Subjects" },
        s.samplePages.visible && samples.length > 0 && { id: "samples", label: "Sample Pages" },
        s.testimonials.visible && { id: "reviews", label: "Reviews" },
        s.faqs.visible && { id: "faqs", label: "FAQs" },
    ].filter(Boolean) as { id: string; label: string }[];

    return (
        <>
            <DetailHero
                breadcrumbs={[{ label: "Home", href: "/" }, { label: "Study Material", href: "/study-material" }, { label: item.title }]}
                label={item.badge || item.category}
                title={item.title}
                subtitle={item.description}
                image={item.image}
                meta={
                    <>
                        <HeroMeta icon={<FileText size={16} />}>{item.pages}</HeroMeta>
                        {item.format && <HeroMeta icon={<BookOpen size={16} />}>{item.format}</HeroMeta>}
                        {item.language && <HeroMeta icon={<Globe size={16} />}>{item.language}</HeroMeta>}
                        <HeroMeta icon={<Star size={16} className="fill-amber-400 text-amber-400" />}>
                            {item.rating} ({item.reviews})
                        </HeroMeta>
                    </>
                }
            />
            <AnchorTabs tabs={tabs} />

            <div className="container-site py-10">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                    <div className="min-w-0 flex-1 space-y-8">
                        {s.overview.visible && (
                            <DetailBlock id="overview" title={s.overview.title}>
                                {item.description && <p className="t-body mb-6 text-slate-600">{item.description}</p>}
                                <CheckGrid items={includes} />
                            </DetailBlock>
                        )}
                        {s.contents.visible && contents.length > 0 && (
                            <DetailBlock id="contents" title={s.contents.title}>
                                <Accordion items={contents} />
                            </DetailBlock>
                        )}
                        {s.samplePages.visible && samples.length > 0 && (
                            <DetailBlock id="samples" title={s.samplePages.title}>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {samples.map((src, i) => (
                                        <a key={`${src}-${i}`} href={src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-slate-200 shadow-sm transition hover:shadow-md">
                                            <SmartImage src={src} alt={`Sample page ${i + 1}`} className="aspect-[3/4] w-full object-cover" />
                                        </a>
                                    ))}
                                </div>
                            </DetailBlock>
                        )}
                    </div>

                    <aside className="w-full shrink-0 space-y-6 lg:sticky lg:w-[22.5rem]" style={{ top: "calc(var(--nav-offset, 0px) + 4.5rem)" }}>
                        <PriceCard image={item.image} price={item.price} oldPrice={item.oldPrice} includes={includes.slice(0, 5)} schedule={item}>
                            <EnrollBox kind="material" id={item.id} primary={cfg.primaryButtonText} secondary={cfg.secondaryButtonText} />
                            {item.sampleUrl && (
                                <a href={item.sampleUrl} target="_blank" rel="noreferrer" className="t-search mt-3 flex items-center justify-center gap-2 font-bold text-brand hover:underline">
                                    <Download size={16} /> Download Free Sample
                                </a>
                            )}
                        </PriceCard>
                        <HelpCard />
                    </aside>
                </div>
            </div>

            {s.benefits.visible && cfg.benefits.length > 0 && (
                <Section tone="white">
                    <SectionHeading title={s.benefits.title} />
                    <InfoTiles items={cfg.benefits} />
                </Section>
            )}

            {s.testimonials.visible && (
                <Section tone="muted">
                    <ReviewsSection id="reviews" title={s.testimonials.title} kind="material" itemId={item.id} itemTitle={item.title} fallback={home.testimonials.items} />
                </Section>
            )}

            {s.faqs.visible && faqs.length > 0 && (
                <Section>
                    <div id="faqs" className="mx-auto max-w-3xl scroll-mt-40">
                        <SectionHeading title={s.faqs.title} align="center" />
                        <FaqList items={faqs} />
                    </div>
                </Section>
            )}

            {related.length > 0 && (
                <Related title="You May Also Like">
                    {related.map((m) => (
                        <MaterialCard key={m.id} item={m} />
                    ))}
                </Related>
            )}
            <CtaSection />
        </>
    );
}
