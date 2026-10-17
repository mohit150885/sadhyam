"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Play, Send } from "lucide-react";
import { useContent } from "../../hooks/useContent";
import { Brand } from "./ui";

function SocialGlyph({ name }: { name: string }) {
    const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
    switch (name) {
        case "youtube":
            return (
                <svg {...common}>
                    <rect x="2" y="5" width="20" height="14" rx="4" />
                    <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
                </svg>
            );
        case "instagram":
            return (
                <svg {...common}>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
            );
        case "twitter":
            return (
                <svg {...common}>
                    <path d="M4 4l16 16M20 4L4 20" />
                </svg>
            );
        case "facebook":
            return (
                <svg {...common}>
                    <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z" />
                </svg>
            );
        case "linkedin":
            return (
                <svg {...common}>
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
                </svg>
            );
        default:
            return <Send size={16} />;
    }
}

export default function Footer() {
    const { data } = useContent("global");
    const year = new Date().getFullYear();

    const socials = Object.entries(data.socials ?? {}).filter(([, url]) => typeof url === "string" && url.trim());
    const exams = Array.isArray(data.exams) ? data.exams : [];

    return (
        <footer className="bg-navy text-white">
            <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
                <div>
                    <Brand dark />
                    <p className="t-footer-link mt-5 max-w-[18.75rem] font-medium leading-[1.6] text-slate-400">{data.footerDescription}</p>

                    {socials.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2.5">
                            {socials.map(([name, url]) => (
                                <a
                                    key={name}
                                    href={url as string}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={name}
                                    className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-slate-300 transition hover:bg-brand hover:text-white"
                                >
                                    <SocialGlyph name={name} />
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <FooterColumn title="Quick Links" links={data.footerQuickLinks} />
                <FooterColumn
                    title="Popular Exams"
                    links={exams.map((e) => ({ label: e, href: `/courses?exam=${encodeURIComponent(e)}` }))}
                />
                <FooterColumn title="Support" links={data.footerSupportLinks} />

                <div>
                    <h4 className="t-footer-title font-extrabold text-white">{data.apps?.title || "Download Our App"}</h4>
                    <p className="t-footer-link mt-3 font-medium text-slate-400">{data.apps?.subtitle}</p>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col">
                        <StoreBadge href={data.apps?.playStore} sub="GET IT ON" name="Google Play" icon={<Play size={20} className="fill-current" />} />
                        <StoreBadge href={data.apps?.appStore} sub="Download on the" name="App Store" icon={<AppleGlyph />} />
                    </div>

                    <ul className="t-footer-link mt-6 space-y-2.5 text-slate-400">
                        {data.contact?.phone && (
                            <li className="flex items-start gap-2">
                                <Phone size={15} className="mt-0.5 shrink-0 text-brand" />
                                <a href={`tel:${data.contact.phone.replace(/\s/g, "")}`} className="hover:text-brand-300">{data.contact.phone}</a>
                            </li>
                        )}
                        {data.contact?.email && (
                            <li className="flex items-start gap-2">
                                <Mail size={15} className="mt-0.5 shrink-0 text-brand" />
                                <a href={`mailto:${data.contact.email}`} className="break-all hover:text-brand-300">{data.contact.email}</a>
                            </li>
                        )}
                        {data.contact?.address && (
                            <li className="flex items-start gap-2">
                                <MapPin size={15} className="mt-0.5 shrink-0 text-brand" />
                                <span>{data.contact.address}</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="container-site t-footer-link flex flex-col items-center justify-between gap-2 py-5 text-slate-500 sm:flex-row">
                    <span>{(data.copyright || "").replace("{year}", String(year))}</span>
                    <span className="flex gap-4">
                        <Link href="/privacy-policy" className="hover:text-brand-300">Privacy</Link>
                        <Link href="/terms-and-conditions" className="hover:text-brand-300">Terms</Link>
                        <Link href="/refund-policy" className="hover:text-brand-300">Refunds</Link>
                    </span>
                </div>
            </div>
        </footer>
    );
}

function AppleGlyph() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.7zM14.1 5.8c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z" />
        </svg>
    );
}

function StoreBadge({ href, sub, name, icon }: { href?: string; sub: string; name: string; icon: React.ReactNode }) {
    const inner = (
        <>
            <span className="text-white">{icon}</span>
            <span>
                <span className="t-store-sub block uppercase tracking-wider text-slate-400">{sub}</span>
                <span className="t-footer-link block font-bold text-white">{name}</span>
            </span>
        </>
    );
    const cls = "flex w-[10.625rem] items-center gap-3 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 transition hover:bg-white/10";
    return href ? (
        <a href={href} target="_blank" rel="noreferrer" className={cls}>
            {inner}
        </a>
    ) : (
        <span className={`${cls} cursor-default opacity-80`} title="Coming soon">
            {inner}
        </span>
    );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
    return (
        <div>
            <h4 className="t-footer-title font-extrabold text-white">{title}</h4>
            <ul className="mt-5 space-y-3">
                {(links ?? []).map((link) => (
                    <li key={`${title}-${link.label}`}>
                        <Link href={link.href || "#"} className="t-footer-link block font-medium text-slate-400 transition hover:text-brand-300">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
