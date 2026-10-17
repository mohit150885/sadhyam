"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BookOpen, FileText } from "lucide-react";
import { useCourses, useStudyMaterials, useTestSeries } from "../../hooks/useContent";
import type { Course, StudyMaterial, TestSeries } from "../../lib/models";
import { Catalog, type FilterDef } from "../site/Catalog";
import { CourseCard, MaterialCard, TestSeriesCard } from "../site/cards";
import CtaSection from "../site/CtaSection";
import { PageHero } from "../site/Hero";
import { InfoTiles } from "../site/details";
import { Section, SectionHeading, Spinner } from "../site/ui";

const crumbs = (label: string) => [{ label: "Home", href: "/" }, { label }];

/* ------------------------------------------------------------------ */

const courseFilters: FilterDef<Course>[] = [
    { title: "Course Type", values: (c) => [c.type] },
    { title: "Language", values: (c) => [c.language] },
    { title: "Features", values: (c) => c.features },
];

export function CoursesView() {
    const { items, page, loading } = useCourses();
    const search = useMemo(() => (c: Course) => `${c.title} ${c.instructor} ${c.category} ${c.type}`, []);
    if (loading) return <Spinner />;
    const v = page.sectionVisibility;
    return (
        <>
            {v.hero && (
                <PageHero
                    breadcrumbs={crumbs("Courses")}
                    title={page.hero.title}
                    description={page.hero.description}
                    banners={page.hero.bannerImages}
                    highlights={page.hero.highlights}
                />
            )}
            {v.items && (
                <Catalog
                    items={items}
                    tabs={page.examTabs}
                    filters={courseFilters}
                    searchText={search}
                    noun="courses"
                    showFilters={v.filters}
                    renderCard={(c) => <CourseCard course={c} />}
                />
            )}
            {v.cta && <CtaSection />}
        </>
    );
}

/* ------------------------------------------------------------------ */

const testFilters: FilterDef<TestSeries>[] = [
    { title: "Test Type", values: (t) => [t.type] },
    { title: "Language", values: (t) => [t.language] },
    { title: "Features", values: (t) => t.features },
];

export function TestSeriesView() {
    const { items, page, loading } = useTestSeries();
    const search = useMemo(() => (t: TestSeries) => `${t.title} ${t.instructor} ${t.category} ${t.type}`, []);
    if (loading) return <Spinner />;
    const v = page.sectionVisibility;
    return (
        <>
            {v.hero && (
                <PageHero
                    breadcrumbs={crumbs("Test Series")}
                    title={page.hero.title}
                    description={page.hero.description}
                    banners={page.hero.bannerImages}
                    highlights={page.hero.highlights}
                />
            )}
            {v.items && (
                <Catalog
                    items={items}
                    tabs={page.examTabs}
                    filters={testFilters}
                    searchText={search}
                    noun="test series"
                    showFilters={v.filters}
                    renderCard={(t) => <TestSeriesCard item={t} />}
                />
            )}
            {v.cta && <CtaSection />}
        </>
    );
}

/* ------------------------------------------------------------------ */

const materialFilters: FilterDef<StudyMaterial>[] = [
    { title: "Subject", values: (m) => [m.subject || ""] },
    { title: "Format", values: (m) => [m.format || ""] },
    { title: "Language", values: (m) => [m.language || ""] },
];

export function StudyMaterialView() {
    const { items, page, loading } = useStudyMaterials();
    const search = useMemo(() => (m: StudyMaterial) => `${m.title} ${m.category} ${m.subject ?? ""} ${m.tags.join(" ")}`, []);
    if (loading) return <Spinner />;
    const v = page.sectionVisibility;
    return (
        <>
            {v.hero && (
                <PageHero
                    breadcrumbs={crumbs("Study Material")}
                    title={page.hero.title}
                    description={page.hero.description}
                    banners={page.hero.bannerImages}
                    highlights={page.hero.highlights}
                />
            )}

            {v.subjects && page.subjects.length > 0 && (
                <Section>
                    <SectionHeading title="Browse by Subject" description="Subject-wise notes and PDFs for focused preparation." />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {page.subjects.map((s) => (
                            <Link
                                key={s.id}
                                href={`/study-material?q=${encodeURIComponent(s.title)}`}
                                className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
                            >
                                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand">
                                    <BookOpen size={20} />
                                </span>
                                <span>
                                    <span className="t-card-title block font-extrabold text-slate-900 group-hover:text-brand">{s.title}</span>
                                    <span className="t-card-text block text-slate-500">{s.details}</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </Section>
            )}

            {v.items && (
                <Catalog
                    items={items}
                    tabs={page.examTabs}
                    filters={materialFilters}
                    searchText={search}
                    noun="study material"
                    showFilters={v.filters}
                    renderCard={(m) => <MaterialCard item={m} />}
                />
            )}

            {v.whyChoose && page.whyChoose.length > 0 && (
                <Section tone="muted">
                    <SectionHeading title="Why Choose Our Study Material?" description="Notes built for the way the exam is actually asked." />
                    <InfoTiles items={page.whyChoose} />
                    <div className="mt-8 flex items-center gap-2 text-slate-500">
                        <FileText size={16} className="text-brand" />
                        <span className="t-small">Purchased PDFs are available in My Courses after payment confirmation.</span>
                    </div>
                </Section>
            )}

            {v.cta && <CtaSection />}
        </>
    );
}
