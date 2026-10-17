"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound, X } from "lucide-react";
import { z } from "zod";
import { FirebaseError } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useContent } from "../../hooks/useContent";
import { useAuth } from "../providers/AuthProvider";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

export function authErrorMessage(error: unknown): string {
    if (error instanceof FirebaseError) {
        const map: Record<string, string> = {
            "auth/user-not-found": "No account found with this email. Please sign up.",
            "auth/wrong-password": "Incorrect password. Please try again.",
            "auth/invalid-credential": "Invalid email or password.",
            "auth/email-already-in-use": "This email is already registered. Please log in instead.",
            "auth/invalid-email": "The email address is invalid.",
            "auth/weak-password": "The password is too weak.",
            "auth/network-request-failed": "Network connection failed. Check your internet and try again.",
            "auth/too-many-requests": "Too many attempts. Please try again later.",
            "auth/popup-closed-by-user": "Google sign-in was cancelled.",
            "auth/popup-blocked": "Your browser blocked the Google sign-in popup. Allow popups and try again.",
            "auth/operation-not-allowed": "This sign-in method is disabled in Firebase Authentication.",
            "auth/unauthorized-domain": "This domain is not authorised in Firebase Authentication settings.",
            "auth/requires-recent-login": "Please log out and log in again, then retry.",
        };
        return map[error.code] || error.message;
    }
    return "Something went wrong. Please try again.";
}

/** Creates users/{uid} only if it does not exist yet, so Google login never wipes saved details. */
export async function ensureProfile(user: User, extra?: { name?: string; mobile?: string; exam?: string }) {
    const ref = doc(db, "users", user.uid);
    try {
        const snap = await getDoc(ref);
        if (snap.exists()) return;
        await setDoc(ref, {
            uid: user.uid,
            name: extra?.name || user.displayName || "Student",
            email: user.email || "",
            mobile: extra?.mobile || "",
            exam: extra?.exam || "",
            photoURL: user.photoURL || "",
            createdAt: serverTimestamp(),
        });
    } catch (err) {
        console.warn("Could not save the student profile:", err);
    }
}

function AuthShell({ children }: { children: ReactNode }) {
    const { data: home } = useContent("home");
    const { data: cfg } = useContent("auth");
    const own = (cfg.sideImages ?? []).filter(Boolean);
    const banners = own.length ? own : (home.hero.banners ?? []).filter(Boolean);
    const showSide = cfg.showSideBanner !== false && banners.length > 0;
    const [slide, setSlide] = useState(0);
    useEffect(() => {
        if (banners.length <= 1) return;
        const t = window.setInterval(() => setSlide((s) => (s + 1) % banners.length), 5000);
        return () => window.clearInterval(t);
    }, [banners.length]);

    return (
        <section className={cn("grid min-h-[calc(100vh-4.375rem)]", showSide && "lg:grid-cols-[55%_45%]")}>
            {showSide && (
            <div className="relative hidden items-center justify-center border-r border-slate-200 bg-slate-100 p-10 lg:flex">
                <div className="relative w-full max-w-[50rem] overflow-hidden rounded-2xl bg-white shadow-[0_0.625rem_2.5rem_rgba(15,23,42,0.1)]">
                    <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${slide * 100}%)` }}>
                        {banners.map((b, i) => (
                            <img key={`${b}-${i}`} src={b} alt="" className="block h-auto w-full shrink-0 object-contain" />
                        ))}
                    </div>
                    {banners.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                            {banners.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setSlide(i)}
                                    aria-label={`Banner ${i + 1}`}
                                    className={cn("h-2 rounded-full transition-all", slide === i ? "w-8 bg-brand" : "w-2 bg-white/70")}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            )}
            <div className="flex items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
                <div className="w-full max-w-[32.5rem] rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_0.625rem_2.5rem_rgba(6,27,47,0.05)] sm:p-8 xl:p-10">
                    {children}
                </div>
            </div>
        </section>
    );
}

function Field({
    label,
    icon,
    error,
    children,
}: {
    label: string;
    icon?: ReactNode;
    error?: string;
    children: ReactNode;
}) {
    return (
        <label className="block">
            <span className="t-search mb-1.5 block font-bold text-slate-700">{label}</span>
            <span
                className={cn(
                    "t-body flex h-12 items-center gap-2.5 rounded-xl border bg-white px-3.5 transition focus-within:ring-2",
                    error ? "border-red-400 focus-within:ring-red-100" : "border-slate-300 focus-within:border-brand focus-within:ring-brand-100"
                )}
            >
                {icon && <span className="text-slate-400">{icon}</span>}
                {children}
            </span>
            {error && <span className="t-small mt-1 block font-medium text-red-600">{error}</span>}
        </label>
    );
}

const inputCls = "h-full w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400";

function GoogleButton({ onClick, disabled, label }: { onClick: () => void; disabled?: boolean; label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="t-button flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
            </svg>
            {label}
        </button>
    );
}

function Divider() {
    return (
        <div className="t-small my-6 flex items-center gap-3 font-semibold text-slate-400">
            <span className="h-px flex-1 bg-slate-200" /> OR <span className="h-px flex-1 bg-slate-200" />
        </div>
    );
}

function safeNext(value: string | null) {
    return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(1, "Password is required."),
});

/** Email/password + Google login. Calls onDone() after a successful sign-in. */
function LoginForm({ onDone, compact = false }: { onDone: () => void; compact?: boolean }) {
    const { data: cfg } = useContent("auth");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setServerError("");
        const parsed = loginSchema.safeParse({ email, password });
        if (!parsed.success) {
            setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
            return;
        }
        setErrors({});
        setBusy(true);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            onDone();
        } catch (err) {
            setServerError(authErrorMessage(err));
            setBusy(false);
        }
    };

    const google = async () => {
        setServerError("");
        setBusy(true);
        try {
            const res = await signInWithPopup(auth, new GoogleAuthProvider());
            await ensureProfile(res.user);
            onDone();
        } catch (err) {
            setServerError(authErrorMessage(err));
            setBusy(false);
        }
    };

    return (
        <>
            <form onSubmit={submit} className={cn("space-y-5", compact ? "mt-5" : "mt-7")} noValidate>
                <Field label="Email Address" icon={<Mail size={18} />} error={errors.email}>
                    <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
                </Field>
                <Field label="Password" icon={<LockKeyhole size={18} />} error={errors.password}>
                    <input type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className={inputCls} />
                    <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="text-slate-400 hover:text-slate-600">
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </Field>
                <div className="flex justify-end">
                    <Link href="/forgot-password" className="t-search font-bold text-brand hover:underline">
                        {cfg.login.forgotText}
                    </Link>
                </div>
                {serverError && <p className="t-small rounded-lg bg-red-50 px-3 py-2.5 font-medium text-red-700">{serverError}</p>}
                <button type="submit" disabled={busy} className="t-button flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-bold text-white shadow-md hover:bg-brand-600 disabled:opacity-60">
                    {busy ? "Logging in..." : cfg.login.buttonText} <ArrowRight size={16} />
                </button>
            </form>
            {cfg.showGoogle !== false && (
                <>
                    <Divider />
                    <GoogleButton onClick={google} disabled={busy} label={cfg.login.googleText} />
                </>
            )}
        </>
    );
}

export function LoginView() {
    const router = useRouter();
    const params = useSearchParams();
    const next = safeNext(params.get("next"));
    const { user, loading: authLoading } = useAuth();
    const { data: cfg } = useContent("auth");

    useEffect(() => {
        if (!authLoading && user) router.replace(next);
    }, [authLoading, user, router, next]);

    return (
        <AuthShell>
            <h1 className="t-section-title font-black text-slate-900">
                {cfg.login.title} <span className="text-brand">{cfg.login.highlight}</span>
            </h1>
            <p className="t-section-desc mt-2 text-slate-500">{cfg.login.subtitle}</p>
            <LoginForm onDone={() => router.replace(next)} />
            <p className="t-body mt-6 text-center text-slate-600">
                {cfg.login.signupPrompt}{" "}
                <Link href={`/signup${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-brand hover:underline">
                    {cfg.login.signupLinkText}
                </Link>
            </p>
        </AuthShell>
    );
}

/* ------------------------------------------------------------------ */
/* Signup                                                              */
/* ------------------------------------------------------------------ */

const passwordRule = z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[a-z]/, "Include at least one lowercase letter.")
    .regex(/[0-9]/, "Include at least one number.");

function signupSchema(askMobile: boolean, askExam: boolean) {
    return z
        .object({
            name: z.string().trim().min(2, "Name must be at least 2 characters."),
            mobile: askMobile ? z.string().regex(/^[6-9][0-9]{9}$/, "Enter a valid 10-digit mobile number.") : z.string(),
            email: z.string().email("Please enter a valid email address."),
            exam: askExam ? z.string().min(1, "Please select a target exam.") : z.string(),
            password: passwordRule,
            confirmPassword: z.string(),
            terms: z.boolean().refine((v) => v, { message: "Please accept the Terms & Conditions." }),
        })
        .refine((d) => d.password === d.confirmPassword, { message: "Passwords do not match.", path: ["confirmPassword"] });
}

/** Account creation form. Calls onDone() once the account exists. */
function SignupForm({ onDone, onBusyChange, compact = false }: { onDone: (isGoogle: boolean) => void; onBusyChange?: (busy: boolean) => void; compact?: boolean }) {
    const { data: global } = useContent("global");
    const { data: cfg } = useContent("auth");
    const askMobile = cfg.signup.askMobile !== false;
    const askExam = cfg.signup.askExam !== false;

    const [form, setForm] = useState({ name: "", mobile: "", email: "", exam: "", password: "", confirmPassword: "", terms: false });
    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState("");
    const [busy, setBusyState] = useState(false);
    const setBusy = (b: boolean) => {
        setBusyState(b);
        onBusyChange?.(b);
    };

    const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setServerError("");
        const parsed = signupSchema(askMobile, askExam).safeParse(form);
        if (!parsed.success) {
            setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
            return;
        }
        setErrors({});
        setBusy(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, parsed.data.email.trim(), parsed.data.password);
            await updateProfile(cred.user, { displayName: parsed.data.name }).catch(() => undefined);
            await ensureProfile(cred.user, { name: parsed.data.name, mobile: parsed.data.mobile, exam: parsed.data.exam });
            onDone(false);
        } catch (err) {
            setServerError(authErrorMessage(err));
            setBusy(false);
        }
    };

    const google = async () => {
        setServerError("");
        setBusy(true);
        try {
            const res = await signInWithPopup(auth, new GoogleAuthProvider());
            await ensureProfile(res.user);
            onDone(true);
        } catch (err) {
            setServerError(authErrorMessage(err));
            setBusy(false);
        }
    };

    return (
        <>
            {cfg.showGoogle !== false && (
                <>
                    <div className={compact ? "mt-5" : "mt-7"}>
                        <GoogleButton onClick={google} disabled={busy} label={cfg.signup.googleText} />
                    </div>
                    <Divider />
                </>
            )}

            <form onSubmit={submit} className={cn("space-y-4", cfg.showGoogle === false && (compact ? "mt-5" : "mt-7"))} noValidate>
                <Field label="Full Name" icon={<UserRound size={18} />} error={errors.name}>
                    <input autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" className={inputCls} />
                </Field>
                {(askMobile || askExam) && (
                    <div className={cn("grid gap-4", askMobile && askExam && "sm:grid-cols-2")}>
                        {askMobile && (
                            <Field label="Mobile Number" icon={<Phone size={18} />} error={errors.mobile}>
                                <input inputMode="numeric" autoComplete="tel" maxLength={10} value={form.mobile} onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))} placeholder="10-digit number" className={inputCls} />
                            </Field>
                        )}
                        {askExam && (
                            <Field label="Target Exam" error={errors.exam}>
                                <select value={form.exam} onChange={(e) => set("exam", e.target.value)} className={cn(inputCls, "cursor-pointer")}>
                                    <option value="">Select exam</option>
                                    {global.exams.map((ex) => (
                                        <option key={ex}>{ex}</option>
                                    ))}
                                </select>
                            </Field>
                        )}
                    </div>
                )}
                <Field label="Email Address" icon={<Mail size={18} />} error={errors.email}>
                    <input type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={inputCls} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Password" icon={<LockKeyhole size={18} />} error={errors.password}>
                        <input type={show ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min 8 characters" className={inputCls} />
                        <button type="button" onClick={() => setShow((v) => !v)} aria-label="Toggle password" className="text-slate-400">
                            {show ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </Field>
                    <Field label="Confirm Password" icon={<LockKeyhole size={18} />} error={errors.confirmPassword}>
                        <input type={show ? "text" : "password"} autoComplete="new-password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} placeholder="Re-enter password" className={inputCls} />
                    </Field>
                </div>
                <label className="t-small flex items-start gap-2.5 text-slate-600">
                    <input type="checkbox" checked={form.terms} onChange={(e) => set("terms", e.target.checked)} className="mt-0.5 h-4 w-4" />
                    <span>
                        I agree to the <Link href="/terms-and-conditions" className="font-bold text-brand">Terms & Conditions</Link> and{" "}
                        <Link href="/privacy-policy" className="font-bold text-brand">Privacy Policy</Link>.
                    </span>
                </label>
                {errors.terms && <p className="t-small -mt-2 font-medium text-red-600">{errors.terms}</p>}
                {serverError && <p className="t-small rounded-lg bg-red-50 px-3 py-2.5 font-medium text-red-700">{serverError}</p>}
                <button type="submit" disabled={busy} className="t-button flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-bold text-white shadow-md hover:bg-brand-600 disabled:opacity-60">
                    {busy ? "Creating account..." : cfg.signup.buttonText} <ArrowRight size={16} />
                </button>
            </form>
        </>
    );
}

export function SignupView() {
    const router = useRouter();
    const params = useSearchParams();
    const next = safeNext(params.get("next"));
    const { user, loading: authLoading } = useAuth();
    const { data: cfg } = useContent("auth");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!authLoading && user && !busy) router.replace(next);
    }, [authLoading, user, router, next, busy]);

    return (
        <AuthShell>
            <h1 className="t-section-title font-black text-slate-900">
                {cfg.signup.title} <span className="text-brand">{cfg.signup.highlight}</span>
            </h1>
            <p className="t-section-desc mt-2 text-slate-500">{cfg.signup.subtitle}</p>
            <SignupForm onBusyChange={setBusy} onDone={(isGoogle) => router.replace(isGoogle && next === "/" ? "/profile" : next)} />
            <p className="t-body mt-6 text-center text-slate-600">
                {cfg.signup.loginPrompt}{" "}
                <Link href={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-brand hover:underline">
                    {cfg.signup.loginLinkText}
                </Link>
            </p>
        </AuthShell>
    );
}

/* ------------------------------------------------------------------ */
/* Login / signup popup (used at checkout)                             */
/* ------------------------------------------------------------------ */

/**
 * Pops up over the page when a guest tries to place an order. They can log in
 * or create an account without leaving the cart; onSuccess runs afterwards.
 */
export function AuthPromptModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
    const { data: cfg } = useContent("auth");
    const [tab, setTab] = useState<"login" | "signup">("login");

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    if (!open || typeof document === "undefined") return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[500] flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center sm:p-8"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-prompt-title"
        >
            <div className="relative w-full max-w-[32.5rem] rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
                <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                    <X size={20} />
                </button>
                <h2 id="auth-prompt-title" className="t-subheading pr-8 font-black text-slate-900">
                    {cfg.checkoutPrompt.title}
                </h2>
                <p className="t-body mt-1.5 text-slate-500">{cfg.checkoutPrompt.description}</p>

                <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1" role="tablist">
                    {(["login", "signup"] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            role="tab"
                            aria-selected={tab === t}
                            onClick={() => setTab(t)}
                            className={cn("t-search h-10 rounded-lg font-bold transition", tab === t ? "bg-white text-brand shadow-sm" : "text-slate-600 hover:text-slate-900")}
                        >
                            {t === "login" ? "Log In" : "Sign Up"}
                        </button>
                    ))}
                </div>

                {tab === "login" ? <LoginForm compact onDone={onSuccess} /> : <SignupForm compact onDone={onSuccess} />}
            </div>
        </div>,
        document.body
    );
}

/* ------------------------------------------------------------------ */
/* Forgot password                                                     */
/* ------------------------------------------------------------------ */

export function ForgotPasswordView() {
    const { data: cfg } = useContent("auth");
    const [email, setEmail] = useState("");
    const [state, setState] = useState<"idle" | "busy" | "sent">("idle");
    const [error, setError] = useState("");

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        if (!z.string().email().safeParse(email.trim()).success) {
            setError("Please enter a valid email address.");
            return;
        }
        setState("busy");
        try {
            await sendPasswordResetEmail(auth, email.trim());
            setState("sent");
        } catch (err) {
            // Don't reveal whether an account exists.
            if (err instanceof FirebaseError && err.code === "auth/user-not-found") setState("sent");
            else {
                setError(authErrorMessage(err));
                setState("idle");
            }
        }
    };

    return (
        <AuthShell>
            <h1 className="t-section-title font-black text-slate-900">
                {cfg.forgot.title} <span className="text-brand">{cfg.forgot.highlight}</span>
            </h1>
            {state === "sent" ? (
                <>
                    <p className="t-body mt-4 rounded-xl bg-emerald-50 p-4 font-medium text-emerald-800">
                        {cfg.forgot.successText} <strong>({email})</strong>
                    </p>
                    <Link href="/login" className="t-button mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-brand font-bold text-white hover:bg-brand-600">
                        Back to Login
                    </Link>
                </>
            ) : (
                <>
                    <p className="t-section-desc mt-2 text-slate-500">{cfg.forgot.subtitle}</p>
                    <form onSubmit={submit} className="mt-7 space-y-5" noValidate>
                        <Field label="Email Address" icon={<Mail size={18} />} error={error}>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
                        </Field>
                        <button type="submit" disabled={state === "busy"} className="t-button flex h-12 w-full items-center justify-center rounded-xl bg-brand font-bold text-white hover:bg-brand-600 disabled:opacity-60">
                            {state === "busy" ? "Sending..." : cfg.forgot.buttonText}
                        </button>
                    </form>
                    <p className="t-body mt-6 text-center">
                        <Link href="/login" className="font-bold text-brand hover:underline">
                            Back to Login
                        </Link>
                    </p>
                </>
            )}
        </AuthShell>
    );
}
