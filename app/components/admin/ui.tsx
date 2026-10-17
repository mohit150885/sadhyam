"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */

type Toast = { id: number; kind: "success" | "error"; text: string };
const ToastCtx = createContext<(kind: Toast["kind"], text: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const push = useCallback((kind: Toast["kind"], text: string) => {
        const id = Date.now() + Math.random();
        setToasts((t) => [...t, { id, kind, text }]);
        window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "error" ? 7000 : 3500);
    }, []);
    return (
        <ToastCtx.Provider value={push}>
            {children}
            <div className="fixed bottom-5 right-5 z-[300] flex w-[360px] max-w-[calc(100vw-40px)] flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={cn(
                            "flex items-start gap-3 rounded-xl px-4 py-3 text-[14px] font-semibold shadow-lg ring-1",
                            t.kind === "success" ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-red-50 text-red-800 ring-red-200"
                        )}
                    >
                        {t.kind === "success" ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <AlertTriangle size={18} className="mt-0.5 shrink-0" />}
                        <span className="flex-1">{t.text}</span>
                        <button type="button" onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))} aria-label="Dismiss">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastCtx.Provider>
    );
}

export function useToast() {
    return useContext(ToastCtx);
}

/* ------------------------------------------------------------------ */
/* Layout pieces                                                       */
/* ------------------------------------------------------------------ */

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
                <h1 className="text-[26px] font-black tracking-tight text-slate-900">{title}</h1>
                {description && <p className="mt-1 text-[14px] text-slate-500">{description}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}

export function Panel({ title, description, actions, children, className }: { title?: string; description?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
    return (
        <section className={cn("rounded-xl border border-slate-200 bg-white shadow-sm", className)}>
            {(title || actions) && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <div>
                        {title && <h2 className="text-[16px] font-black text-slate-900">{title}</h2>}
                        {description && <p className="mt-0.5 text-[13px] text-slate-500">{description}</p>}
                    </div>
                    {actions}
                </div>
            )}
            <div className="p-5">{children}</div>
        </section>
    );
}

type BtnVariant = "primary" | "secondary" | "danger" | "ghost" | "success";

export function Btn({
    children,
    variant = "secondary",
    loading,
    className,
    size = "md",
    ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; loading?: boolean; size?: "sm" | "md" }) {
    const styles: Record<BtnVariant, string> = {
        primary: "bg-brand text-white hover:bg-brand-600 shadow-sm",
        secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
        danger: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-emerald-600 text-white hover:bg-emerald-700",
        ghost: "text-slate-600 hover:bg-slate-100",
    };
    return (
        <button
            type="button"
            {...rest}
            disabled={rest.disabled || loading}
            className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-lg font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
                size === "sm" ? "h-8 px-3 text-[13px]" : "h-10 px-4 text-[14px]",
                styles[variant],
                className
            )}
        >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {children}
        </button>
    );
}

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "green" | "amber" | "red" | "blue" | "brand" | "violet" }) {
    const tones = {
        slate: "bg-slate-100 text-slate-600",
        green: "bg-emerald-50 text-emerald-700",
        amber: "bg-amber-50 text-amber-700",
        red: "bg-red-50 text-red-700",
        blue: "bg-blue-50 text-blue-700",
        brand: "bg-brand-50 text-brand-700",
        violet: "bg-violet-50 text-violet-700",
    };
    return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-bold", tones[tone])}>{children}</span>;
}

export const STATUS_TONE: Record<string, "slate" | "green" | "amber" | "red" | "blue"> = {
    pending: "amber",
    paid: "green",
    failed: "red",
    cancelled: "slate",
    refunded: "blue",
    approved: "green",
    rejected: "red",
    open: "amber",
    "in-progress": "blue",
    resolved: "green",
};

export function Modal({
    open,
    onClose,
    title,
    children,
    footer,
    wide = false,
    onTop = false,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    wide?: boolean;
    /** Confirmation dialogs sit above every other modal. */
    onTop?: boolean;
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            // Only the top-most dialog reacts to Escape.
            const dialogs = document.querySelectorAll("[data-admin-modal]");
            const mine = dialogs[dialogs.length - 1];
            if (mine && mine.getAttribute("data-admin-modal") === (onTop ? "top" : "base")) onClose();
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose, onTop]);
    if (!open || typeof document === "undefined") return null;
    // Rendered into <body> so a dialog opened from inside another modal is never hidden behind it.
    return createPortal(
        <div
            data-admin-modal={onTop ? "top" : "base"}
            className={cn(
                "fixed inset-0 flex justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8",
                onTop ? "z-[400] items-center" : "z-[250] items-start"
            )}
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={cn("relative w-full rounded-2xl bg-white shadow-2xl", wide ? "max-w-4xl" : "max-w-xl")}>
                <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-100 bg-white px-6 py-4">
                    <h2 className="text-[18px] font-black text-slate-900">{title}</h2>
                    <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
                        <X size={20} />
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
                {footer && <div className="sticky bottom-0 flex justify-end gap-2 rounded-b-2xl border-t border-slate-100 bg-white px-6 py-4">{footer}</div>}
            </div>
        </div>,
        document.body
    );
}

export function useConfirm() {
    const [state, setState] = useState<{ text: string; resolve: (v: boolean) => void } | null>(null);
    const confirm = (text: string) => new Promise<boolean>((resolve) => setState({ text, resolve }));
    const dialog = state ? (
        <Modal
            open
            onTop
            title="Please confirm"
            onClose={() => {
                state.resolve(false);
                setState(null);
            }}
            footer={
                <>
                    <Btn
                        onClick={() => {
                            state.resolve(false);
                            setState(null);
                        }}
                    >
                        Cancel
                    </Btn>
                    <Btn
                        variant="danger"
                        onClick={() => {
                            state.resolve(true);
                            setState(null);
                        }}
                    >
                        Confirm
                    </Btn>
                </>
            }
        >
            <p className="text-[15px] text-slate-700">{state.text}</p>
        </Modal>
    ) : null;
    return { confirm, dialog };
}

export function StatCard({ label, value, hint, icon, tone = "brand" }: { label: string; value: string; hint?: string; icon: ReactNode; tone?: "brand" | "green" | "blue" | "amber" | "violet" }) {
    const tones = {
        brand: "bg-brand-50 text-brand",
        green: "bg-emerald-50 text-emerald-600",
        blue: "bg-blue-50 text-blue-600",
        amber: "bg-amber-50 text-amber-600",
        violet: "bg-violet-50 text-violet-600",
    };
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[13px] font-semibold text-slate-500">{label}</p>
                    <p className="mt-2 text-[26px] font-black leading-none text-slate-900">{value}</p>
                    {hint && <p className="mt-2 text-[12px] font-semibold text-slate-500">{hint}</p>}
                </div>
                <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", tones[tone])}>{icon}</span>
            </div>
        </div>
    );
}

/** Lightweight vertical bar chart (no chart library needed). */
export function BarChart({ labels, values, format = (n) => String(n), height = 180 }: { labels: string[]; values: number[]; format?: (n: number) => string; height?: number }) {
    const max = Math.max(1, ...values);
    return (
        <div className="flex items-end gap-1.5 sm:gap-2.5" style={{ height }}>
            {values.map((v, i) => (
                <div key={labels[i]} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 opacity-0 transition group-hover:opacity-100">{format(v)}</span>
                    <div className="w-full rounded-t-md bg-brand/85 transition group-hover:bg-brand" style={{ height: `${Math.max(2, (v / max) * (height - 40))}px` }} title={`${labels[i]}: ${format(v)}`} />
                    <span className="text-[10px] font-semibold text-slate-400">{labels[i]}</span>
                </div>
            ))}
        </div>
    );
}

export function Loading({ label = "Loading..." }: { label?: string }) {
    return (
        <div className="flex min-h-[240px] items-center justify-center gap-3 text-[14px] font-semibold text-slate-500">
            <Loader2 className="animate-spin text-brand" size={20} /> {label}
        </div>
    );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
    return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-[14px] text-red-800">
            <p className="flex items-center gap-2 font-black">
                <AlertTriangle size={18} /> Something went wrong
            </p>
            <p className="mt-1">{message}</p>
            {message.includes("FIREBASE_SERVICE_ACCOUNT_JSON") && (
                <p className="mt-2 text-red-700">Add your Firebase service-account key to <code>.env.local</code> and restart the server. See README → “Admin setup”.</p>
            )}
            {onRetry && (
                <Btn className="mt-3" size="sm" onClick={onRetry}>
                    Try again
                </Btn>
            )}
        </div>
    );
}

export const inputCls =
    "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50";

export function SearchInput({ value, onChange, placeholder = "Search..." }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
    return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn(inputCls, "w-64 max-w-full")} />;
}
