import { createElement } from "react";
import type { LucideProps } from "lucide-react";
import {
    Award,
    BookOpen,
    CheckCircle2,
    ClipboardList,
    FileText,
    GraduationCap,
    Headphones,
    Lightbulb,
    MonitorPlay,
    Play,
    PlayCircle,
    RefreshCcw,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Trophy,
    UserRound,
    Users,
    type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
    Award,
    BookOpen,
    CheckCircle2,
    ClipboardList,
    FileText,
    GraduationCap,
    Headphones,
    Lightbulb,
    MonitorPlay,
    Play,
    PlayCircle,
    RefreshCcw,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Trophy,
    UserRound,
    Users,
};

export const ICON_NAMES = Object.keys(ICONS);

export function getIcon(name?: string): LucideIcon {
    return (name && ICONS[name]) || Star;
}

/** Soft tinted backgrounds for icon tiles. */
export const TONE_SOFT: Record<string, string> = {
    red: "bg-red-50 text-red-500",
    blue: "bg-blue-50 text-blue-500",
    green: "bg-emerald-50 text-emerald-500",
    emerald: "bg-emerald-50 text-emerald-500",
    purple: "bg-violet-50 text-violet-500",
    teal: "bg-teal-50 text-teal-500",
    orange: "bg-brand-50 text-brand",
    amber: "bg-amber-50 text-amber-500",
    rose: "bg-rose-50 text-rose-500",
    slate: "bg-slate-100 text-slate-600",
};

/** Solid colours for accents (test-series stripes, rank rings). */
export const TONE_SOLID: Record<string, string> = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    emerald: "bg-emerald-500",
    purple: "bg-violet-500",
    teal: "bg-teal-500",
    orange: "bg-brand",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    slate: "bg-slate-500",
};

export const TONES = Object.keys(TONE_SOFT);

/** Renders an icon by name (names are stored in Firestore content). */
export function DynamicIcon({ name, ...props }: { name?: string } & LucideProps) {
    return createElement(getIcon(name), props);
}
