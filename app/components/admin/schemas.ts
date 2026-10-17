import type { FieldDef } from "./fields";
import { ICON_NAMES, TONES } from "../site/icons";

/* ------------------------------------------------------------------ */
/* Catalog item forms                                                  */
/* ------------------------------------------------------------------ */

const faqList: FieldDef = {
    key: "faqs",
    label: "FAQs (leave empty to use the default FAQs)",
    type: "list",
    itemLabel: "question",
    fields: [
        { key: "question", label: "Question", type: "text", wide: true },
        { key: "answer", label: "Answer", type: "textarea" },
    ],
};

/** Scheduling + optional countdown, added to courses, test series and study material. */
const scheduling = (startLabel: string): FieldDef[] => [
    { key: "startsAt", label: startLabel, type: "datetime", help: "Optional. Leave empty if there is no fixed date." },
    { key: "endsAt", label: "Offer / enrolment ends", type: "datetime", help: "Optional. e.g. last date of the early-bird price." },
    { key: "showCountdown", label: "Show countdown timer", type: "toggle", help: "Live timer on the card and detail page; hides itself at zero" },
    { key: "countdownTo", label: "Count down to", type: "select", options: ["Start date", "End date"] },
    { key: "countdownLabel", label: "Countdown text", type: "text", placeholder: "Batch starts in / Offer ends in", wide: true },
];

const publishing: FieldDef[] = [
    { key: "published", label: "Published", type: "toggle", help: "Hidden from the website when off" },
    { key: "featured", label: "Featured on home page", type: "toggle", help: "Shown first in home page sections" },
];

export function courseSchema(exams: string[]): FieldDef[] {
    return [
        { key: "title", label: "Course title", type: "text", wide: true },
        { key: "category", label: "Exam", type: "select", options: exams },
        { key: "type", label: "Course type", type: "select", options: ["Foundation Course", "Optional Course", "Crash Course", "Current Affairs", "Answer Writing", "Live Course", "Recorded Course"] },
        { key: "language", label: "Language", type: "select", options: ["Hindi", "English", "Hinglish"] },
        { key: "instructor", label: "Taught by", type: "text" },
        { key: "price", label: "Price (₹)", type: "number" },
        { key: "oldPrice", label: "MRP / old price (₹)", type: "number", help: "Discount % is calculated automatically" },
        { key: "lectures", label: "Lectures", type: "text", placeholder: "500+ Lectures" },
        { key: "pdfs", label: "PDFs", type: "text", placeholder: "200+ PDFs" },
        { key: "tests", label: "Tests", type: "text", placeholder: "100+ Tests" },
        { key: "validity", label: "Validity", type: "text", placeholder: "1 Year Validity" },
        { key: "rating", label: "Rating", type: "number", step: 0.1 },
        { key: "reviews", label: "Review count", type: "text", placeholder: "3.2k" },
        { key: "badge", label: "Badge", type: "text", placeholder: "Most Popular / Bestseller / New" },
        ...publishing,
        ...scheduling("Batch starts on"),
        { key: "image", label: "Course image", type: "image", folder: "courses" },
        { key: "description", label: "Short description", type: "textarea" },
        { key: "features", label: "Features (used in filters)", type: "strings", placeholder: "Live Classes, PDF Notes..." },
        { key: "highlights", label: "Highlights", type: "strings" },
        { key: "previewVideo", label: "Preview video (YouTube link)", type: "text", wide: true },
        {
            key: "syllabus",
            label: "Syllabus (leave empty to use the default syllabus)",
            type: "list",
            fields: [
                { key: "title", label: "Subject / module", type: "text" },
                { key: "details", label: "Details", type: "text", placeholder: "68 Lectures • 20 PDFs • 15 Tests" },
            ],
        },
        faqList,
    ];
}

export function testSchema(exams: string[]): FieldDef[] {
    return [
        { key: "title", label: "Test series title", type: "text", wide: true },
        { key: "category", label: "Exam", type: "select", options: exams },
        { key: "type", label: "Type", type: "select", options: ["Full Length", "Sectional", "Current Affairs", "Mains Answer Writing", "Previous Year"] },
        { key: "language", label: "Language", type: "select", options: ["Hindi", "English", "Hinglish"] },
        { key: "instructor", label: "Prepared by", type: "text" },
        { key: "price", label: "Price (₹)", type: "number" },
        { key: "oldPrice", label: "MRP / old price (₹)", type: "number" },
        { key: "tests", label: "Number of tests", type: "text", placeholder: "50 Tests" },
        { key: "questions", label: "Questions", type: "text", placeholder: "10,000+ Questions" },
        { key: "validity", label: "Validity", type: "text" },
        { key: "rating", label: "Rating", type: "number", step: 0.1 },
        { key: "reviews", label: "Review count", type: "text" },
        { key: "badge", label: "Badge", type: "text" },
        { key: "tone", label: "Accent colour", type: "select", options: TONES },
        ...publishing,
        ...scheduling("Test series starts on"),
        { key: "image", label: "Image", type: "image", folder: "tests" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "features", label: "Features", type: "strings" },
        { key: "sampleUrl", label: "Sample test (PDF)", type: "file", folder: "samples", help: "PDF up to 10 MB" },
        {
            key: "structure",
            label: "Structure (leave empty for default)",
            type: "list",
            fields: [
                { key: "title", label: "Title", type: "text" },
                { key: "details", label: "Details", type: "text" },
            ],
        },
        {
            key: "schedule",
            label: "Test schedule",
            type: "list",
            fields: [
                { key: "date", label: "Date (as shown)", type: "text", placeholder: "12 Jan 2025" },
                { key: "title", label: "Test", type: "text" },
                { key: "startsAt", label: "Exact start time (for countdown)", type: "datetime" },
                { key: "showCountdown", label: "Show countdown for this test", type: "toggle" },
                { key: "topic", label: "Topics", type: "text", wide: true },
            ],
        },
        faqList,
    ];
}

export function materialSchema(exams: string[]): FieldDef[] {
    return [
        { key: "title", label: "Title", type: "text", wide: true },
        { key: "category", label: "Exam", type: "select", options: exams },
        { key: "subject", label: "Subject", type: "text" },
        { key: "format", label: "Format", type: "select", options: ["PDF", "Printed", "PDF + Printed"] },
        { key: "language", label: "Language", type: "select", options: ["Hindi", "English", "Hinglish"] },
        { key: "pages", label: "Pages", type: "text", placeholder: "850+ Pages" },
        { key: "price", label: "Price (₹)", type: "number" },
        { key: "oldPrice", label: "MRP / old price (₹)", type: "number" },
        { key: "rating", label: "Rating", type: "number", step: 0.1 },
        { key: "reviews", label: "Review count", type: "text" },
        { key: "badge", label: "Badge", type: "text" },
        ...publishing,
        ...scheduling("Available from / launch date"),
        { key: "image", label: "Cover image", type: "image", folder: "materials" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "tags", label: "Tags", type: "strings" },
        { key: "samplePages", label: "Sample page images", type: "images", folder: "materials" },
        { key: "sampleUrl", label: "Free sample (PDF)", type: "file", folder: "samples" },
        {
            key: "contents",
            label: "Subjects covered (leave empty for default)",
            type: "list",
            fields: [
                { key: "title", label: "Subject", type: "text" },
                { key: "details", label: "Topics", type: "text" },
            ],
        },
        faqList,
    ];
}

export const facultySchema: FieldDef[] = [
    { key: "name", label: "Name", type: "text" },
    { key: "subject", label: "Subject", type: "text" },
    { key: "experience", label: "Experience", type: "text", placeholder: "15+ Years" },
    { key: "students", label: "Students taught", type: "text", placeholder: "50,000+" },
    { key: "rating", label: "Rating", type: "text", placeholder: "4.9" },
    { key: "videoUrl", label: "Intro video (YouTube link)", type: "text" },
    ...publishing,
    { key: "image", label: "Photo", type: "image", folder: "faculty" },
    { key: "bullets", label: "Highlights", type: "strings" },
    { key: "bio", label: "About", type: "textarea" },
    { key: "quote", label: "Quote", type: "textarea" },
];

export function topperSchema(exams: string[]): FieldDef[] {
    return [
        { key: "name", label: "Name", type: "text" },
        { key: "rank", label: "Rank", type: "text", placeholder: "AIR 45" },
        { key: "exam", label: "Exam & year", type: "text", placeholder: "UPSC CSE 2023" },
        { key: "category", label: "Exam tab", type: "select", options: exams },
        { key: "color", label: "Ring colour", type: "select", options: TONES },
        { key: "featured", label: "Featured on home page", type: "toggle" },
        { key: "image", label: "Photo", type: "image", folder: "results" },
        { key: "quote", label: "Quote", type: "textarea" },
    ];
}

export const testimonialSchema: FieldDef[] = [
    { key: "name", label: "Name", type: "text" },
    { key: "role", label: "Role", type: "text", placeholder: "UPSC Aspirant / Selected - UPPSC" },
    { key: "rating", label: "Stars (1–5)", type: "number" },
    { key: "image", label: "Photo", type: "image", folder: "testimonials" },
    { key: "quote", label: "Quote", type: "textarea" },
];

/* ------------------------------------------------------------------ */
/* Website settings: page → sections → fields                          */
/* ------------------------------------------------------------------ */

export type SettingsSection = { id: string; title: string; description?: string; fields: FieldDef[] };
export type SettingsPage = { key: string; title: string; description: string; preview?: string; sections: SettingsSection[] };

const heroFields = (folder: string, extra: FieldDef[] = []): FieldDef[] => [
    { key: "hero.eyebrow", label: "Small label", type: "text" },
    { key: "hero.title", label: "Title (last word is highlighted)", type: "text" },
    { key: "hero.description", label: "Description", type: "textarea" },
    ...extra,
    { key: "hero.bannerImages", label: "Banner images (empty = use home page banners)", type: "images", folder },
];

const visibility = (keys: string[]): FieldDef[] =>
    keys.map((k) => ({ key: `sectionVisibility.${k}`, label: `Show “${k.replace(/([A-Z])/g, " $1").toLowerCase()}” section`, type: "toggle" as const, wide: false }));

const sectionTitle = (key: string, name: string): FieldDef[] => [
    { key: `sections.${key}.title`, label: `${name} — heading`, type: "text" },
    { key: `sections.${key}.visible`, label: `Show ${name.toLowerCase()}`, type: "toggle" },
];

const titledList = (key: string, label: string, a = "title", b = "text"): FieldDef => ({
    key,
    label,
    type: "list",
    fields: [
        { key: a, label: "Title", type: "text" },
        { key: b, label: "Text", type: "textarea" },
    ],
});

const faqsField = (key = "faqs", label = "FAQs"): FieldDef => ({
    key,
    label,
    type: "list",
    itemLabel: "question",
    fields: [
        { key: "question", label: "Question", type: "text", wide: true },
        { key: "answer", label: "Answer", type: "textarea" },
    ],
});

export const TYPOGRAPHY_TOKENS: { group: string; tokens: { key: string; label: string; def: string }[] }[] = [
    {
        group: "Header",
        tokens: [
            { key: "--fs-brand", label: "Logo text (mobile)", def: "26px" },
            { key: "--fs-brand-d", label: "Logo text (desktop)", def: "28px" },
            { key: "--fs-nav-link", label: "Desktop menu links & Login/Sign Up", def: "14px" },
            { key: "--fs-nav", label: "Mobile menu links", def: "15px" },
            { key: "--fs-search", label: "Search & profile menu", def: "14px" },
        ],
    },
    {
        group: "Hero",
        tokens: [
            { key: "--fs-hero-h", label: "Hero height — all pages (mobile)", def: "590px" },
            { key: "--fs-hero-h-t", label: "Hero height — all pages (tablet)", def: "560px" },
            { key: "--fs-hero-h-d", label: "Hero height — all pages (desktop)", def: "580px" },
            { key: "--fs-hero-badge", label: "Badge (mobile)", def: "12px" },
            { key: "--fs-hero-badge-d", label: "Badge (desktop)", def: "13px" },
            { key: "--fs-hero-title", label: "Title (mobile)", def: "36px" },
            { key: "--fs-hero-title-t", label: "Title (tablet)", def: "48px" },
            { key: "--fs-hero-title-d", label: "Title (desktop)", def: "60px" },
            { key: "--fs-hero-features", label: "Features line (mobile)", def: "13px" },
            { key: "--fs-hero-features-d", label: "Features line (desktop)", def: "15px" },
            { key: "--fs-hero-desc", label: "Description (mobile)", def: "15px" },
            { key: "--fs-hero-desc-d", label: "Description (desktop)", def: "17px" },
            { key: "--fs-hero-tab", label: "Exam tabs (mobile)", def: "12px" },
            { key: "--fs-hero-tab-d", label: "Exam tabs (desktop)", def: "13px" },
        ],
    },
    {
        group: "Stats & headings",
        tokens: [
            { key: "--fs-stat-num", label: "Stat number (mobile)", def: "24px" },
            { key: "--fs-stat-num-d", label: "Stat number (desktop)", def: "28px" },
            { key: "--fs-stat-label", label: "Stat label (mobile)", def: "14px" },
            { key: "--fs-stat-label-d", label: "Stat label (desktop)", def: "15px" },
            { key: "--fs-section-title", label: "Section title (mobile)", def: "28px" },
            { key: "--fs-section-title-d", label: "Section title (desktop)", def: "36px" },
            { key: "--fs-section-desc", label: "Section description (mobile)", def: "15px" },
            { key: "--fs-section-desc-d", label: "Section description (desktop)", def: "16px" },
        ],
    },
    {
        group: "Cards",
        tokens: [
            { key: "--fs-card-title", label: "Card title", def: "16px" },
            { key: "--fs-card-text", label: "Card text", def: "13px" },
            { key: "--fs-badge", label: "Badge", def: "11px" },
            { key: "--fs-meta", label: "Meta (faculty / icons)", def: "13px" },
            { key: "--fs-price", label: "Price", def: "22px" },
            { key: "--fs-price-old", label: "Old price / rating", def: "14px" },
            { key: "--fs-discount", label: "Discount badge", def: "12px" },
            { key: "--fs-tag", label: "Tags", def: "12px" },
            { key: "--fs-tag-sm", label: "Small tags", def: "10px" },
        ],
    },
    {
        group: "People",
        tokens: [
            { key: "--fs-faculty-name", label: "Faculty name", def: "16px" },
            { key: "--fs-faculty-subject", label: "Faculty subject", def: "13px" },
            { key: "--fs-exp-badge", label: "Experience badge", def: "11px" },
            { key: "--fs-rank", label: "Result rank", def: "18px" },
            { key: "--fs-result-name", label: "Result name", def: "14px" },
            { key: "--fs-result-exam", label: "Result exam", def: "12px" },
            { key: "--fs-quote", label: "Testimonial quote", def: "14px" },
            { key: "--fs-author", label: "Author name", def: "15px" },
            { key: "--fs-author-role", label: "Author role", def: "12px" },
        ],
    },
    {
        group: "CTA & footer",
        tokens: [
            { key: "--fs-cta-title", label: "CTA title (mobile)", def: "32px" },
            { key: "--fs-cta-title-d", label: "CTA title (desktop)", def: "40px" },
            { key: "--fs-cta-desc", label: "CTA description (mobile)", def: "15px" },
            { key: "--fs-cta-desc-d", label: "CTA description (desktop)", def: "16px" },
            { key: "--fs-cta-tagline", label: "“Ek Behtar Kal Ke Liye”", def: "32px" },
            { key: "--fs-footer-title", label: "Footer column titles", def: "16px" },
            { key: "--fs-footer-link", label: "Footer links / text", def: "14px" },
            { key: "--fs-store-sub", label: "App store subtext", def: "9px" },
        ],
    },
];

export function settingsPages(): SettingsPage[] {
    return [
        {
            key: "global",
            title: "General & Header/Footer",
            description: "Site name, logo, navigation, footer, contact details and SEO.",
            preview: "/",
            sections: [
                {
                    id: "brand",
                    title: "Brand",
                    fields: [
                        { key: "siteName", label: "Site name", type: "text" },
                        { key: "tagline", label: "Tagline", type: "text" },
                        { key: "logoImage", label: "Logo image", type: "image", folder: "brand", help: "PNG, SVG or WEBP. Square or wide logos both work. Leave empty to use the default logo." },
                        { key: "logoHeight", label: "Logo height (px)", type: "number", help: "24–80 px. Default 40." },
                        { key: "showSiteName", label: "Show site name next to logo", type: "toggle", help: "Turn off if your logo image already contains the name" },
                        { key: "favicon", label: "Favicon", type: "image", folder: "brand" },
                    ],
                },
                {
                    id: "announcement",
                    title: "Announcement bar",
                    description: "A thin strip above the navbar on every page.",
                    fields: [
                        { key: "announcement.enabled", label: "Show announcement", type: "toggle" },
                        { key: "announcement.link", label: "Link", type: "text" },
                        { key: "announcement.text", label: "Text", type: "text", wide: true },
                        { key: "announcement.showCountdown", label: "Show countdown in the bar", type: "toggle" },
                        { key: "announcement.countdownAt", label: "Count down to", type: "datetime" },
                    ],
                },
                {
                    id: "nav",
                    title: "Navigation menu",
                    fields: [
                        { key: "showSearch", label: "Show search box", type: "toggle" },
                        { key: "navLinks", label: "Menu links", type: "links" },
                        { key: "exams", label: "Exams (used in footer, filters and forms)", type: "strings" },
                    ],
                },
                {
                    id: "footer",
                    title: "Footer",
                    fields: [
                        { key: "footerDescription", label: "About text", type: "textarea" },
                        { key: "footerQuickLinks", label: "Quick links", type: "links" },
                        { key: "footerSupportLinks", label: "Support links", type: "links" },
                        { key: "copyright", label: "Copyright line ({year} = current year)", type: "text", wide: true },
                        { key: "apps.title", label: "App section title", type: "text" },
                        { key: "apps.subtitle", label: "App section subtitle", type: "text" },
                        { key: "apps.playStore", label: "Google Play link", type: "text" },
                        { key: "apps.appStore", label: "App Store link", type: "text" },
                    ],
                },
                {
                    id: "contact",
                    title: "Contact details",
                    fields: [
                        { key: "contact.phone", label: "Phone", type: "text" },
                        { key: "contact.email", label: "Email", type: "text" },
                        { key: "contact.whatsapp", label: "WhatsApp number (with country code)", type: "text" },
                        { key: "contact.hours", label: "Office hours", type: "text" },
                        { key: "contact.address", label: "Address", type: "textarea" },
                    ],
                },
                {
                    id: "social",
                    title: "Social links",
                    fields: ["youtube", "telegram", "instagram", "twitter", "facebook", "linkedin"].map((s) => ({ key: `socials.${s}`, label: s[0].toUpperCase() + s.slice(1), type: "text" as const })),
                },
                {
                    id: "payment",
                    title: "Payment (UPI)",
                    description: "Shown to students after they place an order.",
                    fields: [
                        { key: "payment.upiId", label: "UPI ID", type: "text", placeholder: "yourname@okhdfcbank" },
                        { key: "payment.payeeName", label: "Payee name", type: "text" },
                        { key: "payment.instructions", label: "Instructions", type: "textarea" },
                        { key: "payment.qrImage", label: "UPI QR code image", type: "image", folder: "brand" },
                    ],
                },
                {
                    id: "seo",
                    title: "SEO & Meta",
                    fields: [
                        { key: "seo.title", label: "Default page title", type: "text", wide: true },
                        { key: "seo.description", label: "Meta description", type: "textarea" },
                        { key: "seo.keywords", label: "Keywords", type: "text", wide: true },
                    ],
                },
            ],
        },
        {
            key: "home",
            title: "Home Page",
            description: "Hero carousel, stats, features and all home sections.",
            preview: "/",
            sections: [
                {
                    id: "hero",
                    title: "Hero section",
                    fields: [
                        { key: "hero.badge", label: "Top badge", type: "text", wide: true },
                        { key: "hero.headingLine1", label: "Heading line 1", type: "text" },
                        { key: "hero.headingLine2", label: "Heading line 2 (highlighted)", type: "text" },
                        { key: "hero.featuresLine", label: "Features line (separate with |)", type: "text", wide: true },
                        { key: "hero.description", label: "Description", type: "textarea" },
                        { key: "hero.primaryBtnText", label: "Primary button text", type: "text" },
                        { key: "hero.primaryBtnLink", label: "Primary button link", type: "text" },
                        { key: "hero.secondaryBtnText", label: "Secondary button text", type: "text" },
                        { key: "hero.secondaryBtnLink", label: "Secondary button link", type: "text" },
                        { key: "hero.banners", label: "Banner images (carousel)", type: "images", folder: "banners" },
                        { key: "hero.settings.autoSlideInterval", label: "Auto-slide every (seconds)", type: "number" },
                        { key: "hero.settings.showArrows", label: "Show arrows", type: "toggle" },
                        { key: "hero.settings.showIndicators", label: "Show dots", type: "toggle" },
                        {
                            key: "hero.examTabs",
                            label: "Exam tabs",
                            type: "list",
                            itemLabel: "name",
                            fields: [
                                { key: "name", label: "Name", type: "text" },
                                { key: "link", label: "Link", type: "text", placeholder: "/courses?exam=UPSC" },
                                { key: "active", label: "Selected by default", type: "toggle" },
                            ],
                        },
                    ],
                },
                {
                    id: "stats",
                    title: "Statistics",
                    fields: [
                        {
                            key: "stats.items",
                            label: "Stats",
                            type: "list",
                            itemLabel: "small",
                            fields: [
                                { key: "big", label: "Number", type: "text" },
                                { key: "small", label: "Label", type: "text" },
                                { key: "iconName", label: "Icon", type: "select", options: ICON_NAMES },
                            ],
                        },
                    ],
                },
                {
                    id: "features",
                    title: "Why choose us",
                    fields: [
                        { key: "features.title", label: "Title", type: "text" },
                        { key: "features.decoration", label: "Handwritten note", type: "text" },
                        { key: "features.description", label: "Description", type: "text", wide: true },
                        {
                            key: "features.items",
                            label: "Feature cards",
                            type: "list",
                            fields: [
                                { key: "title", label: "Title", type: "text" },
                                { key: "text", label: "Text", type: "text" },
                                { key: "iconName", label: "Icon", type: "select", options: ICON_NAMES },
                                { key: "tone", label: "Colour", type: "select", options: TONES },
                            ],
                        },
                    ],
                },
                ...(["courses", "tests", "materials", "faculty", "results"] as const).map((k) => ({
                    id: k,
                    title: { courses: "Popular courses", tests: "Test series", materials: "Study material", faculty: "Faculty", results: "Results" }[k],
                    description: "Cards come from the catalog. Mark items as “Featured” to show them first.",
                    fields: [
                        { key: `${k}.title`, label: "Title", type: "text" as const },
                        { key: `${k}.description`, label: "Description", type: "text" as const },
                        { key: `${k}.actionText`, label: "Link text", type: "text" as const },
                        { key: `${k}.actionLink`, label: "Link", type: "text" as const },
                        { key: `${k}.count`, label: "How many cards", type: "number" as const },
                    ],
                })),
                {
                    id: "testimonials",
                    title: "Testimonials heading",
                    description: "Manage the testimonials themselves in Catalog → Testimonials.",
                    fields: [
                        { key: "testimonials.title", label: "Title", type: "text" },
                        { key: "testimonials.description", label: "Description", type: "text" },
                    ],
                },
                {
                    id: "cta",
                    title: "Call to action (bottom of every page)",
                    fields: [
                        { key: "cta.title", label: "Title", type: "text" },
                        { key: "cta.tagline", label: "Handwritten tagline", type: "text" },
                        { key: "cta.description", label: "Description", type: "textarea" },
                        { key: "cta.btnText", label: "Button text", type: "text" },
                        { key: "cta.btnLink", label: "Button link", type: "text" },
                        { key: "cta.secondaryBtnText", label: "Second button text", type: "text" },
                        { key: "cta.secondaryBtnLink", label: "Second button link", type: "text" },
                        { key: "cta.image", label: "Image", type: "image", folder: "banners" },
                    ],
                },
                { id: "visibility", title: "Show / hide sections", fields: visibility(["hero", "stats", "features", "courses", "tests", "materials", "faculty", "results", "testimonials", "cta"]) },
            ],
        },
        {
            key: "about",
            title: "About Page",
            description: "Story, mission, timeline and values.",
            preview: "/about",
            sections: [
                { id: "hero", title: "Hero", fields: [...heroFields("about"), { key: "hero.primaryButton.text", label: "Button 1 text", type: "text" }, { key: "hero.primaryButton.link", label: "Button 1 link", type: "text" }, { key: "hero.secondaryButton.text", label: "Button 2 text", type: "text" }, { key: "hero.secondaryButton.link", label: "Button 2 link", type: "text" }] },
                { id: "story", title: "Our story", fields: [{ key: "story.title", label: "Title", type: "text" }, { key: "story.paragraphs", label: "Paragraphs", type: "strings" }, { key: "story.image", label: "Image", type: "image", folder: "about" }] },
                { id: "mission", title: "Mission & vision", fields: [{ key: "mission.title", label: "Mission title", type: "text" }, { key: "mission.text", label: "Mission text", type: "textarea" }, { key: "vision.title", label: "Vision title", type: "text" }, { key: "vision.text", label: "Vision text", type: "textarea" }] },
                { id: "stats", title: "Stats", fields: [{ key: "stats", label: "Stats", type: "list", itemLabel: "label", fields: [{ key: "value", label: "Number", type: "text" }, { key: "label", label: "Label", type: "text" }] }] },
                { id: "why", title: "Why choose us", fields: [{ key: "whyChoose", label: "Cards", type: "list", fields: [{ key: "title", label: "Title", type: "text" }, { key: "tone", label: "Colour", type: "select", options: TONES }, { key: "description", label: "Text", type: "textarea" }] }] },
                { id: "timeline", title: "Journey timeline", fields: [{ key: "timeline", label: "Milestones", type: "list", itemLabel: "year", fields: [{ key: "year", label: "Year", type: "text" }, { key: "title", label: "Title", type: "text" }, { key: "description", label: "Text", type: "textarea" }] }] },
                { id: "values", title: "Core values", fields: [titledList("values", "Values", "title", "description")] },
                { id: "visibility", title: "Show / hide sections", fields: visibility(["hero", "story", "stats", "whyChoose", "timeline", "values", "cta"]) },
            ],
        },
        {
            key: "courses",
            title: "Courses Page",
            description: "Hero and exam tabs. Add or edit courses under Catalog → Courses.",
            preview: "/courses",
            sections: [
                { id: "hero", title: "Hero", fields: heroFields("courses", [{ key: "hero.highlights", label: "Highlights", type: "strings" }]) },
                { id: "tabs", title: "Exam tabs", fields: [{ key: "examTabs", label: "Tabs (first tab shows everything)", type: "strings" }] },
                { id: "visibility", title: "Show / hide sections", fields: visibility(["hero", "filters", "items", "cta"]) },
            ],
        },
        {
            key: "courseDetails",
            title: "Course Detail Pages",
            description: "Shared text for every course page.",
            sections: [
                { id: "labels", title: "Buttons & labels", fields: [{ key: "heroLabel", label: "Hero label", type: "text" }, { key: "primaryButtonText", label: "Primary button", type: "text" }, { key: "secondaryButtonText", label: "Secondary button", type: "text" }, { key: "help.title", label: "Help box title", type: "text" }, { key: "help.text", label: "Help box text", type: "text" }] },
                { id: "sections", title: "Sections", fields: [...sectionTitle("overview", "Overview"), ...sectionTitle("includes", "What you get"), ...sectionTitle("syllabus", "Syllabus"), ...sectionTitle("faculty", "Faculty"), ...sectionTitle("testimonials", "Reviews"), ...sectionTitle("faqs", "FAQs")] },
                { id: "why", title: "Why choose this course", fields: [titledList("whyChoose", "Points")] },
                { id: "syllabus", title: "Default syllabus", fields: [{ key: "defaultSyllabus", label: "Modules", type: "list", fields: [{ key: "title", label: "Title", type: "text" }, { key: "details", label: "Details", type: "text" }] }] },
                { id: "faqs", title: "Default FAQs", fields: [faqsField()] },
            ],
        },
        {
            key: "testSeries",
            title: "Test Series Page",
            description: "Hero and exam tabs. Manage tests under Catalog → Test Series.",
            preview: "/test-series",
            sections: [
                { id: "hero", title: "Hero", fields: heroFields("tests", [{ key: "hero.highlights", label: "Highlights", type: "strings" }]) },
                { id: "tabs", title: "Exam tabs", fields: [{ key: "examTabs", label: "Tabs", type: "strings" }] },
                { id: "visibility", title: "Show / hide sections", fields: visibility(["hero", "filters", "items", "cta"]) },
            ],
        },
        {
            key: "testSeriesDetails",
            title: "Test Series Detail Pages",
            description: "Shared text for every test series page.",
            sections: [
                { id: "labels", title: "Buttons", fields: [{ key: "primaryButtonText", label: "Primary button", type: "text" }, { key: "secondaryButtonText", label: "Secondary button", type: "text" }] },
                { id: "sections", title: "Sections", fields: [...sectionTitle("overview", "Overview"), ...sectionTitle("structure", "Structure"), ...sectionTitle("whyTake", "Why take"), ...sectionTitle("schedule", "Schedule"), ...sectionTitle("testimonials", "Reviews"), ...sectionTitle("faqs", "FAQs")] },
                { id: "why", title: "Why take this test series", fields: [titledList("whyTake", "Points")] },
                { id: "structure", title: "Default structure", fields: [{ key: "defaultStructure", label: "Parts", type: "list", fields: [{ key: "title", label: "Title", type: "text" }, { key: "details", label: "Details", type: "text" }] }] },
                { id: "faqs", title: "Default FAQs", fields: [faqsField()] },
            ],
        },
        {
            key: "studyMaterial",
            title: "Study Material Page",
            description: "Hero, subjects and tabs. Manage products under Catalog → Study Material.",
            preview: "/study-material",
            sections: [
                { id: "hero", title: "Hero", fields: heroFields("materials", [{ key: "hero.highlights", label: "Highlights", type: "strings" }]) },
                { id: "tabs", title: "Exam tabs", fields: [{ key: "examTabs", label: "Tabs", type: "strings" }] },
                { id: "subjects", title: "Browse by subject", fields: [{ key: "subjects", label: "Subjects", type: "list", fields: [{ key: "id", label: "ID", type: "text" }, { key: "title", label: "Title", type: "text" }, { key: "details", label: "Details", type: "text", wide: true }] }] },
                { id: "why", title: "Why choose our material", fields: [titledList("whyChoose", "Points")] },
                { id: "visibility", title: "Show / hide sections", fields: visibility(["hero", "subjects", "filters", "items", "whyChoose", "cta"]) },
            ],
        },
        {
            key: "studyMaterialDetails",
            title: "Study Material Detail Pages",
            description: "Shared text for every study material page.",
            sections: [
                { id: "labels", title: "Buttons", fields: [{ key: "primaryButtonText", label: "Primary button", type: "text" }, { key: "secondaryButtonText", label: "Secondary button", type: "text" }] },
                { id: "sections", title: "Sections", fields: [...sectionTitle("overview", "Overview"), ...sectionTitle("contents", "Subjects"), ...sectionTitle("samplePages", "Sample pages"), ...sectionTitle("benefits", "Benefits"), ...sectionTitle("testimonials", "Reviews"), ...sectionTitle("faqs", "FAQs")] },
                { id: "benefits", title: "Key benefits", fields: [titledList("benefits", "Benefits")] },
                { id: "contents", title: "Default subjects", fields: [{ key: "defaultContents", label: "Subjects", type: "list", fields: [{ key: "title", label: "Title", type: "text" }, { key: "details", label: "Details", type: "text" }] }] },
                { id: "faqs", title: "Default FAQs", fields: [faqsField()] },
            ],
        },
        {
            key: "faculty",
            title: "Faculty Page",
            description: "Hero, stats and subject tabs. Manage teachers under Catalog → Faculty.",
            preview: "/faculty",
            sections: [
                { id: "hero", title: "Hero", fields: heroFields("faculty", [{ key: "hero.highlights", label: "Highlights", type: "strings" }]) },
                { id: "stats", title: "Stats", fields: [{ key: "stats", label: "Stats", type: "list", itemLabel: "label", fields: [{ key: "value", label: "Number", type: "text" }, { key: "label", label: "Label", type: "text" }] }] },
                { id: "tabs", title: "Subject tabs", fields: [{ key: "subjects", label: "Tabs (matched against faculty subject)", type: "strings" }] },
                { id: "intro", title: "Intro block", fields: [{ key: "intro.title", label: "Title", type: "text" }, { key: "intro.badge", label: "Badge", type: "text" }, { key: "intro.text", label: "Text", type: "textarea" }, { key: "intro.image", label: "Image", type: "image", folder: "faculty" }] },
                { id: "visibility", title: "Show / hide sections", fields: visibility(["hero", "stats", "subjects", "items", "intro", "cta"]) },
            ],
        },
        {
            key: "facultyDetails",
            title: "Faculty Profile Pages",
            description: "Shared text for every faculty profile.",
            sections: [
                { id: "sections", title: "Sections", fields: [...sectionTitle("profile", "About"), ...sectionTitle("approach", "Teaching approach"), ...sectionTitle("courses", "Courses"), ...sectionTitle("testimonials", "Reviews")] },
                { id: "approach", title: "Teaching approach", fields: [titledList("approach", "Points")] },
            ],
        },
        {
            key: "results",
            title: "Results Page",
            description: "Hero, stats, videos and yearly results. Manage toppers under Catalog → Results & Toppers.",
            preview: "/results",
            sections: [
                { id: "hero", title: "Hero", fields: heroFields("results", [{ key: "hero.highlights", label: "Highlights", type: "strings" }]) },
                { id: "stats", title: "Stats", fields: [{ key: "stats", label: "Stats", type: "list", itemLabel: "label", fields: [{ key: "value", label: "Number", type: "text" }, { key: "label", label: "Label", type: "text" }] }] },
                { id: "tabs", title: "Exam tabs", fields: [{ key: "examTabs", label: "Tabs", type: "strings" }] },
                { id: "videos", title: "Success story videos", fields: [{ key: "videos", label: "Videos", type: "list", fields: [{ key: "title", label: "Title", type: "text", wide: true }, { key: "name", label: "Student", type: "text" }, { key: "rank", label: "Rank", type: "text" }, { key: "videoUrl", label: "YouTube link", type: "text", wide: true }, { key: "thumbnail", label: "Thumbnail", type: "image", folder: "results" }] }] },
                { id: "yearly", title: "Results over the years", fields: [{ key: "yearly", label: "Years", type: "list", itemLabel: "year", fields: [{ key: "year", label: "Year", type: "text" }, { key: "selections", label: "Selections", type: "text" }, { key: "note", label: "Note", type: "text", wide: true }] }] },
                { id: "visibility", title: "Show / hide sections", fields: visibility(["hero", "stats", "toppers", "videos", "yearlyResults", "testimonials", "cta"]) },
            ],
        },
        {
            key: "cart",
            title: "Cart Page",
            description: "Cart heading, empty state and trust badges.",
            preview: "/cart",
            sections: [
                {
                    id: "cart",
                    title: "Cart",
                    fields: [
                        { key: "title", label: "Title", type: "text" },
                        { key: "description", label: "Description", type: "text" },
                        { key: "emptyState.title", label: "Empty cart title", type: "text" },
                        { key: "emptyState.description", label: "Empty cart text", type: "text" },
                        { key: "emptyState.buttonText", label: "Empty cart button", type: "text" },
                        { key: "emptyState.buttonLink", label: "Empty cart link", type: "text" },
                        { key: "trustBadges", label: "Trust badges", type: "strings" },
                    ],
                },
            ],
        },
        {
            key: "auth",
            title: "Login & Signup Pages",
            description: "Headings, buttons, side banner and form options for Login, Sign Up, Forgot Password and the checkout login popup.",
            preview: "/login",
            sections: [
                {
                    id: "general",
                    title: "General",
                    fields: [
                        { key: "showGoogle", label: "Show “Continue with Google” button", type: "toggle", help: "Google sign-in must be enabled in Firebase Authentication" },
                        { key: "showSideBanner", label: "Show banner on the left (desktop)", type: "toggle" },
                        { key: "sideImages", label: "Side banner images (empty = home page banners)", type: "images", folder: "auth" },
                    ],
                },
                {
                    id: "login",
                    title: "Login page",
                    fields: [
                        { key: "login.title", label: "Heading", type: "text" },
                        { key: "login.highlight", label: "Highlighted word", type: "text" },
                        { key: "login.subtitle", label: "Subtitle", type: "text", wide: true },
                        { key: "login.buttonText", label: "Login button", type: "text" },
                        { key: "login.googleText", label: "Google button", type: "text" },
                        { key: "login.forgotText", label: "Forgot password link", type: "text" },
                        { key: "login.signupPrompt", label: "Sign-up prompt", type: "text" },
                        { key: "login.signupLinkText", label: "Sign-up link text", type: "text" },
                    ],
                },
                {
                    id: "signup",
                    title: "Sign Up page",
                    fields: [
                        { key: "signup.title", label: "Heading", type: "text" },
                        { key: "signup.highlight", label: "Highlighted word", type: "text" },
                        { key: "signup.subtitle", label: "Subtitle", type: "text", wide: true },
                        { key: "signup.buttonText", label: "Create account button", type: "text" },
                        { key: "signup.googleText", label: "Google button", type: "text" },
                        { key: "signup.askMobile", label: "Ask for mobile number", type: "toggle" },
                        { key: "signup.askExam", label: "Ask for target exam", type: "toggle", help: "Options come from General → Exams" },
                        { key: "signup.loginPrompt", label: "Login prompt", type: "text" },
                        { key: "signup.loginLinkText", label: "Login link text", type: "text" },
                    ],
                },
                {
                    id: "forgot",
                    title: "Forgot password page",
                    fields: [
                        { key: "forgot.title", label: "Heading", type: "text" },
                        { key: "forgot.highlight", label: "Highlighted word", type: "text" },
                        { key: "forgot.subtitle", label: "Subtitle", type: "text", wide: true },
                        { key: "forgot.buttonText", label: "Button", type: "text" },
                        { key: "forgot.successText", label: "Message after sending", type: "textarea" },
                    ],
                },
                {
                    id: "checkout",
                    title: "Checkout login popup",
                    description: "Shown when a visitor who isn’t logged in clicks Place Order.",
                    fields: [
                        { key: "checkoutPrompt.title", label: "Title", type: "text", wide: true },
                        { key: "checkoutPrompt.description", label: "Text", type: "textarea" },
                    ],
                },
            ],
        },
        {
            key: "contact",
            title: "Contact Page",
            description: "Contact form and map. Phone/email come from General settings.",
            preview: "/contact",
            sections: [
                { id: "hero", title: "Hero", fields: heroFields("contact") },
                { id: "form", title: "Form", fields: [{ key: "formTitle", label: "Form title", type: "text" }, { key: "subjects", label: "Subject options", type: "strings" }, { key: "mapEmbedUrl", label: "Google Maps embed URL", type: "text", wide: true, help: "Google Maps → Share → Embed a map → copy the src link" }] },
            ],
        },
        {
            key: "help",
            title: "Help Center",
            description: "Help topics.",
            preview: "/help-center",
            sections: [
                { id: "hero", title: "Hero", fields: heroFields("help") },
                { id: "topics", title: "Topics", fields: [{ key: "topics", label: "Topics", type: "list", fields: [{ key: "title", label: "Title", type: "text" }, { key: "iconName", label: "Icon", type: "select", options: ICON_NAMES }, { key: "link", label: "Link", type: "text" }, { key: "text", label: "Text", type: "textarea" }] }] },
            ],
        },
        {
            key: "faqs",
            title: "FAQs Page",
            description: "All frequently asked questions.",
            preview: "/faqs",
            sections: [
                { id: "hero", title: "Hero", fields: heroFields("faqs") },
                { id: "items", title: "Questions", fields: [{ key: "items", label: "FAQs", type: "list", itemLabel: "question", fields: [{ key: "category", label: "Category", type: "text" }, { key: "question", label: "Question", type: "text", wide: true }, { key: "answer", label: "Answer", type: "textarea" }] }] },
            ],
        },
        {
            key: "legal",
            title: "Legal Pages",
            description: "Refund, terms and privacy policy.",
            preview: "/privacy-policy",
            sections: (["refund", "terms", "privacy"] as const).map((k) => ({
                id: k,
                title: { refund: "Refund policy", terms: "Terms & conditions", privacy: "Privacy policy" }[k],
                fields: [
                    { key: `${k}.title`, label: "Title", type: "text" as const },
                    { key: `${k}.updatedOn`, label: "Last updated", type: "text" as const },
                    { key: `${k}.content`, label: "Content", type: "richtext" as const },
                ],
            })),
        },
    ];
}
