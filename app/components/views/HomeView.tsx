"use client";

import { pickFeatured, useContent, useCourses, useFaculty, useStudyMaterials, useTestSeries, useToppers } from "../../hooks/useContent";
import { HomeHero } from "../site/Hero";
import { CourseCard, FacultyCard, FeatureCard, MaterialCard, ResultCard, StatsBar, TestimonialCard, TestSeriesCard } from "../site/cards";
import CtaSection from "../site/CtaSection";
import { Section, SectionHeading, Spinner } from "../site/ui";

export default function HomeView() {
    const { data, loading } = useContent("home");
    const courses = useCourses();
    const tests = useTestSeries();
    const materials = useStudyMaterials();
    const faculty = useFaculty();
    const toppers = useToppers();

    if (loading) return <Spinner label="Loading website content..." />;

    const v = data.sectionVisibility;

    return (
        <>
            {v.hero && <HomeHero data={data.hero} />}

            {v.stats && (
                <StatsBar items={data.stats.items.map((s) => ({ icon: s.iconName, value: s.big, label: s.small }))} />
            )}

            {v.features && (
                <Section>
                    <SectionHeading
                        title={data.features.title}
                        description={data.features.description}
                        decoration={
                            data.features.decoration ? (
                                <div className="t-cta-tagline -rotate-3 font-script font-bold text-slate-800 opacity-80">
                                    {data.features.decoration}
                                    <div className="mx-auto mt-1 h-1 w-24 rounded-full bg-brand" />
                                </div>
                            ) : undefined
                        }
                    />
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-6">
                        {data.features.items.map((f, i) => (
                            <FeatureCard key={`${f.title}-${i}`} icon={f.iconName} tone={f.tone} title={f.title} text={f.text} />
                        ))}
                    </div>
                </Section>
            )}

            {v.courses && courses.items.length > 0 && (
                <Section tone="muted" id="courses">
                    <SectionHeading title={data.courses.title} description={data.courses.description} action={data.courses.actionText} actionHref={data.courses.actionLink} accent={false} />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {pickFeatured(courses.items, data.courses.count).map((c) => (
                            <CourseCard key={c.id} course={c} />
                        ))}
                    </div>
                </Section>
            )}

            {v.tests && tests.items.length > 0 && (
                <Section id="test-series">
                    <SectionHeading title={data.tests.title} description={data.tests.description} action={data.tests.actionText} actionHref={data.tests.actionLink} accent={false} />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {pickFeatured(tests.items, data.tests.count).map((t) => (
                            <TestSeriesCard key={t.id} item={t} />
                        ))}
                    </div>
                </Section>
            )}

            {v.materials && materials.items.length > 0 && (
                <Section tone="muted" id="study-material">
                    <SectionHeading title={data.materials.title} description={data.materials.description} action={data.materials.actionText} actionHref={data.materials.actionLink} accent={false} />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {pickFeatured(materials.items, data.materials.count).map((m) => (
                            <MaterialCard key={m.id} item={m} />
                        ))}
                    </div>
                </Section>
            )}

            {v.faculty && faculty.items.length > 0 && (
                <Section tone="muted" id="faculty">
                    <SectionHeading title={data.faculty.title} description={data.faculty.description} action={data.faculty.actionText} actionHref={data.faculty.actionLink} />
                    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                        {pickFeatured(faculty.items, data.faculty.count).map((f) => (
                            <FacultyCard key={f.id} member={f} />
                        ))}
                    </div>
                </Section>
            )}

            {v.results && toppers.items.length > 0 && (
                <Section id="results">
                    <SectionHeading title={data.results.title} description={data.results.description} action={data.results.actionText} actionHref={data.results.actionLink} />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {pickFeatured(toppers.items, data.results.count).map((t) => (
                            <ResultCard key={t.id} topper={t} />
                        ))}
                    </div>
                </Section>
            )}

            {v.testimonials && data.testimonials.items.length > 0 && (
                <Section tone="muted">
                    <SectionHeading title={data.testimonials.title} description={data.testimonials.description} />
                    <div className="grid gap-6 md:grid-cols-3">
                        {data.testimonials.items.map((t, i) => (
                            <TestimonialCard key={`${t.name}-${i}`} t={t} />
                        ))}
                    </div>
                </Section>
            )}

            {v.cta && <CtaSection />}
        </>
    );
}
