"use client";

import { useSyncExternalStore } from "react";
import { Timer } from "lucide-react";
import type { Schedulable } from "../../lib/models";
import { cn } from "../../lib/utils";

/* One shared 1-second clock for every countdown on the page. */
const listeners = new Set<() => void>();
let timer: number | undefined;
let now = 0;

function subscribe(l: () => void) {
    listeners.add(l);
    if (timer === undefined) {
        now = Date.now();
        timer = window.setInterval(() => {
            now = Date.now();
            listeners.forEach((fn) => fn());
        }, 1000);
    }
    return () => {
        listeners.delete(l);
        if (listeners.size === 0 && timer !== undefined) {
            window.clearInterval(timer);
            timer = undefined;
        }
    };
}
const getNow = () => now || Date.now();
// Rendering nothing on the server avoids hydration mismatches.
const getServerNow = () => 0;

function useNow() {
    return useSyncExternalStore(subscribe, getNow, getServerNow);
}

function parse(iso?: string) {
    if (!iso) return 0;
    const t = new Date(iso).getTime();
    return Number.isNaN(t) ? 0 : t;
}

/** Works out which date a catalog item counts down to, or null when it shouldn't show. */
export function countdownFor(item: Schedulable): { target: string; label: string } | null {
    if (!item.showCountdown) return null;
    const useEnd = item.countdownTo === "End date";
    const target = useEnd ? item.endsAt || item.startsAt : item.startsAt || item.endsAt;
    if (!target) return null;
    const isEnd = target === item.endsAt && (useEnd || !item.startsAt);
    return { target, label: item.countdownLabel || (isEnd ? "Offer ends in" : "Starts in") };
}

const pad = (n: number) => String(n).padStart(2, "0");

function split(ms: number) {
    const s = Math.floor(ms / 1000);
    return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/**
 * Live countdown. Hides itself once the target time has passed.
 *  - "chip": compact one-liner for product cards
 *  - "box":  large tiles for the detail-page price card
 *  - "inline": plain text for the announcement bar / schedule tables
 */
export function Countdown({
    target,
    label,
    variant = "chip",
    className,
}: {
    target?: string;
    label?: string;
    variant?: "chip" | "box" | "inline";
    className?: string;
}) {
    const current = useNow();
    const end = parse(target);
    if (!current || !end || end <= current) return null;
    const { d, h, m, s } = split(end - current);

    if (variant === "box") {
        const units = [
            { v: d, l: "Days" },
            { v: h, l: "Hours" },
            { v: m, l: "Mins" },
            { v: s, l: "Secs" },
        ];
        return (
            <div className={cn("rounded-xl bg-brand-50 p-4 ring-1 ring-brand-100", className)} role="timer" aria-live="off">
                {label && (
                    <p className="t-search flex items-center gap-1.5 font-extrabold text-brand-700">
                        <Timer size={16} /> {label}
                    </p>
                )}
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                    {units.map((u) => (
                        <div key={u.l} className="rounded-lg bg-white py-2 shadow-sm">
                            <span className="block text-[1.375rem] font-black tabular-nums leading-none text-slate-900">{pad(u.v)}</span>
                            <span className="t-tag-sm mt-1 block font-bold uppercase text-slate-500">{u.l}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const text = `${d > 0 ? `${d}d ` : ""}${pad(h)}h ${pad(m)}m ${pad(s)}s`;

    if (variant === "inline") {
        return (
            <span className={cn("inline-flex items-center gap-1 tabular-nums", className)} role="timer">
                {label && <span>{label}</span>}
                <strong className="font-black">{text}</strong>
            </span>
        );
    }

    return (
        <div className={cn("t-tag flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1.5 font-bold text-brand-700 ring-1 ring-brand-100", className)} role="timer">
            <Timer size={14} className="shrink-0" />
            {label && <span className="truncate">{label}</span>}
            <span className="ml-auto shrink-0 font-black tabular-nums">{text}</span>
        </div>
    );
}

/** Convenience wrapper for catalog items. */
export function ItemCountdown({ item, variant = "chip", className }: { item: Schedulable; variant?: "chip" | "box" | "inline"; className?: string }) {
    const c = countdownFor(item);
    if (!c) return null;
    return <Countdown target={c.target} label={c.label} variant={variant} className={className} />;
}
