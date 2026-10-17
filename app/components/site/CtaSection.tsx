"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useContent } from "../../hooks/useContent";

type CtaData = {
    title?: string;
    description?: string;
    btnText?: string;
    btnLink?: string;
    secondaryBtnText?: string;
    secondaryBtnLink?: string;
    tagline?: string;
    image?: string;
};

/** Bottom call-to-action, shared by every page. Content comes from Home → CTA unless overridden. */
export default function CtaSection({ override }: { override?: CtaData }) {
    const { data: home } = useContent("home");
    const cta: CtaData = { ...home.cta, ...(override ?? {}) };

    return (
        <section className="overflow-hidden bg-brand-50 py-10 sm:py-12">
            <div className="container-site flex min-h-[10rem] flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div>
                    <h2 className="t-cta-title font-black text-slate-900">{cta.title}</h2>
                    {cta.description && <p className="t-cta-desc mt-3 max-w-[37.5rem] whitespace-pre-line text-slate-600">{cta.description}</p>}
                    <div className="mt-6 flex flex-wrap gap-3">
                        {cta.btnText && (
                            <Link href={cta.btnLink || "/signup"} className="t-button inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand px-6 font-black text-white shadow-md transition hover:bg-brand-600">
                                {cta.btnText} <ArrowRight size={16} />
                            </Link>
                        )}
                        {cta.secondaryBtnText && (
                            <Link href={cta.secondaryBtnLink || "/courses"} className="t-button inline-flex h-12 items-center justify-center rounded-lg border-2 border-slate-800 px-6 font-black text-slate-800 transition hover:bg-slate-800 hover:text-white">
                                {cta.secondaryBtnText}
                            </Link>
                        )}
                    </div>
                </div>
                {(cta.tagline || cta.image) && (
                    <div className="relative flex items-center gap-6 self-stretch lg:self-auto">
                        {cta.tagline && (
                            <p className="t-cta-tagline -rotate-3 font-script font-bold text-slate-800">
                                {cta.tagline}
                                <span className="mx-auto mt-1 block h-1 w-24 rounded-full bg-brand" />
                            </p>
                        )}
                        {cta.image && (
                            <img src={cta.image} alt="" className="hidden h-36 w-56 rounded-xl object-cover shadow-md sm:block" />
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
