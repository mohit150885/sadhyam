"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
    BookOpen,
    CheckCircle2,
    CirclePlay,
    Clock,
    Copy,
    ExternalLink,
    FileText,
    KeyRound,
    LogOut,
    Package,
    Settings,
    ShieldCheck,
    UserRound,
    XCircle,
} from "lucide-react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification, updatePassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { useContent } from "../../hooks/useContent";
import { useMyOrders } from "../../hooks/useOrders";
import { useAuth } from "../providers/AuthProvider";
import type { Order, OrderLine, ProductKind } from "../../lib/models";
import { cn, formatDate, formatINR } from "../../lib/utils";
import { authErrorMessage } from "./AuthViews";
import { EmptyState, SmartImage, Spinner } from "../site/ui";

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

const NAV = [
    { href: "/profile", label: "My Profile", icon: UserRound },
    { href: "/my-courses", label: "My Courses", icon: CirclePlay },
    { href: "/my-tests", label: "My Test Series", icon: FileText },
    { href: "/orders", label: "My Orders", icon: Package },
    { href: "/settings", label: "Settings", icon: Settings },
];

function AccountShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
    const { user, profile, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }, [loading, user, router, pathname]);

    if (loading || !user) return <Spinner />;

    return (
        <section className="container-site py-10">
            <div className="grid items-start gap-8 lg:grid-cols-[16.25rem_1fr]">
                <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky" style={{ top: "calc(var(--nav-offset, 0px) + 1.25rem)" }}>
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <img src={user.photoURL || profile?.photoURL || "/proflogo.jpg"} alt="" className="h-12 w-12 rounded-full object-cover" />
                        <div className="min-w-0">
                            <p className="t-search truncate font-black text-slate-900">{profile?.name || user.displayName || "Student"}</p>
                            <p className="t-profile-sub truncate text-slate-500">{user.email}</p>
                        </div>
                    </div>
                    <nav className="mt-3 flex gap-1 overflow-x-auto lg:flex-col">
                        {NAV.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "t-search flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 font-semibold transition",
                                    pathname === href || pathname.startsWith(`${href}/`) ? "bg-brand-50 text-brand" : "text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                <Icon size={16} /> {label}
                            </Link>
                        ))}
                        <button type="button" onClick={logout} className="t-search flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left font-semibold text-red-600 hover:bg-red-50">
                            <LogOut size={16} /> Sign out
                        </button>
                    </nav>
                </aside>
                <div className="min-w-0">
                    <h1 className="t-section-title font-black text-slate-900">{title}</h1>
                    {description && <p className="t-section-desc mt-2 text-slate-500">{description}</p>}
                    <div className="mt-8">{children}</div>
                </div>
            </div>
        </section>
    );
}

const input =
    "t-body h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50 disabled:text-slate-500";

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

export function ProfileView() {
    const { user, profile } = useAuth();
    // Re-create the form when the saved profile changes so it starts from the latest values.
    const key = JSON.stringify([user?.uid, profile?.name, profile?.mobile, profile?.exam, profile?.city]);
    return (
        <AccountShell title="My Profile" description="Keep your details up to date so we can reach you about your courses.">
            <ProfileForm key={key} />
        </AccountShell>
    );
}

function ProfileForm() {
    const { user, profile } = useAuth();
    const { data: global } = useContent("global");
    const [form, setForm] = useState(() => ({
        name: profile?.name || user?.displayName || "",
        mobile: profile?.mobile || "",
        exam: profile?.exam || "",
        city: profile?.city || "",
    }));
    const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

    const save = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setState("saving");
        try {
            const data = {
                uid: user.uid,
                email: user.email || "",
                name: form.name.trim().slice(0, 80),
                mobile: form.mobile.replace(/\D/g, "").slice(0, 10),
                exam: form.exam,
                city: form.city.trim().slice(0, 60),
            };
            await setDoc(doc(db, "users", user.uid), data, { merge: true });
            if (data.name && data.name !== user.displayName) await updateProfile(user, { displayName: data.name });
            setState("saved");
        } catch {
            setState("error");
        }
    };

    return (
        <>
            <form onSubmit={save} className="max-w-2xl space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                    <Labeled label="Full Name">
                        <input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} />
                    </Labeled>
                    <Labeled label="Email">
                        <input className={input} value={user?.email || ""} disabled />
                    </Labeled>
                    <Labeled label="Mobile Number">
                        <input className={input} inputMode="numeric" maxLength={10} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })} />
                    </Labeled>
                    <Labeled label="Target Exam">
                        <select className={input} value={form.exam} onChange={(e) => setForm({ ...form, exam: e.target.value })}>
                            <option value="">Select exam</option>
                            {global.exams.map((ex) => (
                                <option key={ex}>{ex}</option>
                            ))}
                        </select>
                    </Labeled>
                    <Labeled label="City">
                        <input className={input} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    </Labeled>
                </div>
                <div className="flex items-center gap-4">
                    <button type="submit" disabled={state === "saving"} className="t-button h-12 rounded-xl bg-brand px-6 font-bold text-white hover:bg-brand-600 disabled:opacity-60">
                        {state === "saving" ? "Saving..." : "Save Changes"}
                    </button>
                    {state === "saved" && <span className="t-small flex items-center gap-1.5 font-bold text-emerald-600"><CheckCircle2 size={16} /> Saved</span>}
                    {state === "error" && <span className="t-small font-bold text-red-600">Could not save. Check your connection.</span>}
                </div>
            </form>
        </>
    );
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="block">
            <span className="t-search mb-1.5 block font-bold text-slate-700">{label}</span>
            {children}
        </label>
    );
}

/* ------------------------------------------------------------------ */
/* Library (My Courses / My Test Series)                               */
/* ------------------------------------------------------------------ */

type Access = { url?: string; note?: string };

function useLibraryAccess(enabled: boolean) {
    const [access, setAccess] = useState<Record<string, Access>>({});
    useEffect(() => {
        if (!enabled) return;
        let cancelled = false;
        (async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) return;
                const res = await fetch("/api/my/library", { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled) setAccess(data.access ?? {});
            } catch {
                /* access links are optional */
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [enabled]);
    return access;
}

function LibraryView({ kinds, title, description, emptyHref, emptyLabel }: { kinds: ProductKind[]; title: string; description: string; emptyHref: string; emptyLabel: string }) {
    const { orders, loading } = useMyOrders();
    const paid = orders.filter((o) => o.status === "paid");
    const pending = orders.filter((o) => o.status === "pending");
    const items: (OrderLine & { orderedAt: unknown })[] = [];
    const seen = new Set<string>();
    paid.forEach((o) =>
        o.items.forEach((i) => {
            const k = `${i.kind}:${i.id}`;
            if (kinds.includes(i.kind) && !seen.has(k)) {
                seen.add(k);
                items.push({ ...i, orderedAt: o.createdAt });
            }
        })
    );
    const access = useLibraryAccess(items.length > 0);
    const pendingCount = pending.reduce((n, o) => n + o.items.filter((i) => kinds.includes(i.kind)).length, 0);

    const hrefFor = (i: OrderLine) => (i.kind === "course" ? `/courses/${i.id}` : i.kind === "test" ? `/test-series/${i.id}` : `/study-material/${i.id}`);

    return (
        <AccountShell title={title} description={description}>
            {pendingCount > 0 && (
                <Link href="/orders" className="t-search mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-800">
                    <Clock size={18} /> {pendingCount} item(s) are waiting for payment confirmation. View orders →
                </Link>
            )}
            {loading ? (
                <Spinner />
            ) : items.length === 0 ? (
                <EmptyState
                    icon={<BookOpen size={44} />}
                    title="Nothing here yet"
                    description="Items you purchase appear here once your payment is confirmed."
                    action={
                        <Link href={emptyHref} className="t-button inline-flex h-12 items-center rounded-lg bg-brand px-6 font-bold text-white hover:bg-brand-600">
                            {emptyLabel}
                        </Link>
                    }
                />
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((i) => {
                        const a = access[`${i.kind}:${i.id}`];
                        return (
                            <article key={`${i.kind}-${i.id}`} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <SmartImage src={i.image} alt={i.title} className="h-36 w-full object-cover" />
                                <div className="flex flex-1 flex-col p-5">
                                    <span className="t-badge self-start rounded bg-emerald-50 px-2 py-0.5 font-extrabold uppercase text-emerald-700">Enrolled</span>
                                    <h3 className="t-card-title mt-2 font-extrabold text-slate-900">{i.title}</h3>
                                    <p className="t-meta mt-1 text-slate-500">Purchased {formatDate(i.orderedAt)}</p>
                                    {a?.note && <p className="t-card-text mt-3 rounded-lg bg-slate-50 p-3 text-slate-600">{a.note}</p>}
                                    <div className="mt-auto flex gap-2 pt-4">
                                        {a?.url ? (
                                            <a href={a.url} target="_blank" rel="noreferrer" className="t-search flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand font-bold text-white hover:bg-brand-600">
                                                {i.kind === "test" ? "Start Tests" : i.kind === "material" ? "Download" : "Start Learning"} <ExternalLink size={14} />
                                            </a>
                                        ) : (
                                            <span className="t-small flex h-10 flex-1 items-center justify-center rounded-lg bg-slate-100 px-2 text-center font-semibold text-slate-500">
                                                Access details will be shared soon
                                            </span>
                                        )}
                                        <Link href={hrefFor(i)} className="t-search flex h-10 items-center rounded-lg border border-slate-200 px-3 font-bold text-slate-600 hover:border-brand hover:text-brand">
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </AccountShell>
    );
}

export function MyCoursesView() {
    return <LibraryView kinds={["course", "material"]} title="My Courses" description="Your enrolled courses and study material." emptyHref="/courses" emptyLabel="Explore Courses" />;
}

export function MyTestsView() {
    return <LibraryView kinds={["test"]} title="My Test Series" description="Your enrolled test series." emptyHref="/test-series" emptyLabel="Explore Test Series" />;
}

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

const STATUS: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
    pending: { label: "Awaiting payment", cls: "bg-amber-50 text-amber-700", icon: Clock },
    paid: { label: "Paid", cls: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
    failed: { label: "Failed", cls: "bg-red-50 text-red-700", icon: XCircle },
    cancelled: { label: "Cancelled", cls: "bg-slate-100 text-slate-600", icon: XCircle },
    refunded: { label: "Refunded", cls: "bg-blue-50 text-blue-700", icon: CheckCircle2 },
};

function StatusPill({ status }: { status: string }) {
    const s = STATUS[status] ?? STATUS.pending;
    const Icon = s.icon;
    return (
        <span className={cn("t-small inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-bold", s.cls)}>
            <Icon size={14} /> {s.label}
        </span>
    );
}

export function OrdersView() {
    const { orders, loading } = useMyOrders();
    return (
        <AccountShell title="My Orders" description="Track your purchases and payment status.">
            {loading ? (
                <Spinner />
            ) : orders.length === 0 ? (
                <EmptyState icon={<Package size={44} />} title="No orders yet" action={<Link href="/courses" className="t-button inline-flex h-12 items-center rounded-lg bg-brand px-6 font-bold text-white">Explore Courses</Link>} />
            ) : (
                <div className="space-y-4">
                    {orders.map((o) => (
                        <Link key={o.id} href={`/orders/${o.id}`} className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="t-card-title font-black text-slate-900">Order #{o.orderNumber}</p>
                                    <p className="t-meta text-slate-500">{formatDate(o.createdAt, true)} • {o.items.length} item(s)</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <strong className="t-price font-black">{formatINR(o.total)}</strong>
                                    <StatusPill status={o.status} />
                                </div>
                            </div>
                            <p className="t-card-text mt-3 truncate text-slate-600">{o.items.map((i) => i.title).join(", ")}</p>
                        </Link>
                    ))}
                </div>
            )}
        </AccountShell>
    );
}

export function OrderDetailView({ id }: { id: string }) {
    const { user } = useAuth();
    const { data: global } = useContent("global");
    const [order, setOrder] = useState<Order | null | undefined>(undefined);
    const [reference, setReference] = useState("");
    const [state, setState] = useState<"idle" | "saving" | "error">("idle");
    const [message, setMessage] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!user) return;
        return onSnapshot(
            doc(db, "orders", id),
            (snap) => setOrder(snap.exists() ? ({ id: snap.id, ...snap.data() } as Order) : null),
            () => setOrder(null)
        );
    }, [user, id]);

    const submitRef = async (e: FormEvent) => {
        e.preventDefault();
        setState("saving");
        setMessage("");
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch(`/api/orders/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ reference }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setState("idle");
            setMessage("Thanks! We'll confirm your payment shortly.");
        } catch (err) {
            setState("error");
            setMessage(err instanceof Error ? err.message : "Could not submit.");
        }
    };

    const pay = global.payment;
    const upiLink =
        order && pay.upiId
            ? `upi://pay?pa=${encodeURIComponent(pay.upiId)}&pn=${encodeURIComponent(pay.payeeName || global.siteName)}&am=${order.total}&cu=INR&tn=${encodeURIComponent(`Order ${order.orderNumber}`)}`
            : "";

    return (
        <AccountShell title={order ? `Order #${order.orderNumber}` : "Order"}>
            {order === undefined ? (
                <Spinner />
            ) : order === null ? (
                <EmptyState title="Order not found" action={<Link href="/orders" className="t-search font-bold text-brand">Back to My Orders</Link>} />
            ) : (
                <div className="grid items-start gap-6 xl:grid-cols-[1fr_23.75rem]">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
                            <p className="t-meta text-slate-500">Placed on {formatDate(order.createdAt, true)}</p>
                            <StatusPill status={order.status} />
                        </div>
                        <ul className="divide-y divide-slate-100">
                            {order.items.map((i) => (
                                <li key={`${i.kind}-${i.id}`} className="flex items-center gap-4 p-5">
                                    <SmartImage src={i.image} alt="" className="h-16 w-24 rounded-lg object-cover" />
                                    <p className="t-card-title flex-1 font-extrabold text-slate-900">{i.title}</p>
                                    <strong className="t-card-title font-black">{formatINR(i.price)}</strong>
                                </li>
                            ))}
                        </ul>
                        <dl className="t-body space-y-2 border-t border-slate-100 p-5">
                            <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd className="font-bold">{formatINR(order.subtotal)}</dd></div>
                            {order.discount > 0 && (
                                <div className="flex justify-between"><dt className="text-slate-500">Coupon {order.couponCode}</dt><dd className="font-bold text-emerald-600">− {formatINR(order.discount)}</dd></div>
                            )}
                            <div className="flex justify-between border-t border-slate-100 pt-2"><dt className="t-card-title font-black">Total</dt><dd className="t-price font-black">{formatINR(order.total)}</dd></div>
                        </dl>
                    </div>

                    {order.status === "pending" ? (
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="t-subheading font-black text-slate-900">Complete Your Payment</h2>
                            <p className="t-card-text mt-2 text-slate-600">{pay.instructions}</p>
                            {pay.qrImage && <img src={pay.qrImage} alt="UPI QR code" className="mx-auto mt-5 h-48 w-48 rounded-lg border border-slate-200 object-contain p-2" />}
                            {pay.upiId ? (
                                <>
                                    <div className="mt-5 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                                        <div>
                                            <p className="t-small text-slate-500">UPI ID</p>
                                            <p className="t-card-title font-black text-slate-900">{pay.upiId}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard?.writeText(pay.upiId);
                                                setCopied(true);
                                            }}
                                            className="t-small flex items-center gap-1 font-bold text-brand"
                                        >
                                            <Copy size={14} /> {copied ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                    <a href={upiLink} className="t-button mt-3 flex h-12 items-center justify-center rounded-lg bg-brand font-bold text-white hover:bg-brand-600 sm:hidden">
                                        Pay {formatINR(order.total)} with UPI app
                                    </a>
                                </>
                            ) : (
                                <p className="t-small mt-4 rounded-lg bg-amber-50 p-3 font-semibold text-amber-800">
                                    Our team will contact you at {order.userEmail} with payment details.
                                </p>
                            )}
                            <form onSubmit={submitRef} className="mt-5 space-y-3">
                                <label className="t-search block font-bold text-slate-700">
                                    UPI transaction ID
                                    <input
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        placeholder={order.paymentReference || "e.g. 412345678901"}
                                        className={cn(input, "mt-1.5")}
                                        minLength={6}
                                        required
                                    />
                                </label>
                                <button type="submit" disabled={state === "saving"} className="t-button h-12 w-full rounded-lg border-2 border-brand font-bold text-brand hover:bg-brand-50 disabled:opacity-60">
                                    {state === "saving" ? "Submitting..." : order.paymentReference ? "Update Transaction ID" : "I Have Paid"}
                                </button>
                                {message && <p className={cn("t-small font-semibold", state === "error" ? "text-red-600" : "text-emerald-600")}>{message}</p>}
                                {order.paymentReference && !message && (
                                    <p className="t-small font-semibold text-emerald-600">Transaction ID received: {order.paymentReference}. Awaiting confirmation.</p>
                                )}
                            </form>
                        </div>
                    ) : order.status === "paid" ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                            <ShieldCheck className="text-emerald-600" size={28} />
                            <h2 className="t-subheading mt-3 font-black text-emerald-900">Payment confirmed</h2>
                            <p className="t-card-text mt-1 text-emerald-800">Your items are ready to use.</p>
                            <Link href="/my-courses" className="t-button mt-4 flex h-12 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white hover:bg-emerald-700">
                                Go to My Courses
                            </Link>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <p className="t-body text-slate-600">{order.note || "This order is closed. Contact support if you have questions."}</p>
                            <Link href="/contact" className="t-search mt-3 inline-block font-bold text-brand">Contact Support</Link>
                        </div>
                    )}
                </div>
            )}
        </AccountShell>
    );
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export function SettingsView() {
    const { user, logout } = useAuth();
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
    const [busy, setBusy] = useState(false);
    const [verifySent, setVerifySent] = useState(false);

    const hasPassword = user?.providerData.some((p) => p.providerId === "password");

    const changePassword = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.email) return;
        setMsg(null);
        if (next.length < 8) {
            setMsg({ ok: false, text: "New password must be at least 8 characters." });
            return;
        }
        setBusy(true);
        try {
            await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, current));
            await updatePassword(user, next);
            setMsg({ ok: true, text: "Password updated." });
            setCurrent("");
            setNext("");
        } catch (err) {
            setMsg({ ok: false, text: authErrorMessage(err) });
        } finally {
            setBusy(false);
        }
    };

    return (
        <AccountShell title="Settings" description="Manage your sign-in and security.">
            <div className="max-w-2xl space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="t-card-title flex items-center gap-2 font-black text-slate-900"><ShieldCheck size={18} className="text-brand" /> Email</h2>
                    <p className="t-body mt-2 text-slate-600">
                        {user?.email} — {user?.emailVerified ? <span className="font-bold text-emerald-600">verified</span> : <span className="font-bold text-amber-600">not verified</span>}
                    </p>
                    {!user?.emailVerified && (
                        <button
                            type="button"
                            onClick={async () => {
                                if (user) {
                                    await sendEmailVerification(user).catch(() => undefined);
                                    setVerifySent(true);
                                }
                            }}
                            className="t-search mt-3 rounded-lg border-2 border-brand px-4 py-2 font-bold text-brand hover:bg-brand-50"
                        >
                            {verifySent ? "Verification email sent" : "Send verification email"}
                        </button>
                    )}
                </div>

                {hasPassword && (
                    <form onSubmit={changePassword} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="t-card-title flex items-center gap-2 font-black text-slate-900"><KeyRound size={18} className="text-brand" /> Change Password</h2>
                        <input type="password" className={input} placeholder="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} required autoComplete="current-password" />
                        <input type="password" className={input} placeholder="New password (min 8 characters)" value={next} onChange={(e) => setNext(e.target.value)} required autoComplete="new-password" />
                        {msg && <p className={cn("t-small font-semibold", msg.ok ? "text-emerald-600" : "text-red-600")}>{msg.text}</p>}
                        <button type="submit" disabled={busy} className="t-button h-12 rounded-xl bg-brand px-6 font-bold text-white hover:bg-brand-600 disabled:opacity-60">
                            {busy ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                )}

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="t-card-title font-black text-slate-900">Account</h2>
                    <p className="t-body mt-2 text-slate-600">
                        To delete your account and data, <Link href="/contact" className="font-bold text-brand">contact support</Link>.
                    </p>
                    <button type="button" onClick={logout} className="t-search mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 font-bold text-red-600 hover:bg-red-100">
                        <LogOut size={16} /> Sign out of this device
                    </button>
                </div>
            </div>
        </AccountShell>
    );
}
