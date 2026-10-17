"use client";

import { useState, type FormEvent } from "react";
import { useContent } from "../../hooks/useContent";
import { Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";

export default function AdminLoginForm() {
    const { data: global } = useContent("global");
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id.trim(), password }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "Unable to sign in.");
            const next = new URLSearchParams(window.location.search).get("next");
            window.location.href = next && next.startsWith("/admin") ? next : "/admin";
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to sign in.");
            setBusy(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
            <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
            <form onSubmit={submit} className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 flex flex-col items-center text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={global.logoImage || "/logo.svg"} alt="" className="h-14 w-14 rounded-2xl object-contain shadow-lg shadow-brand/30" />
                    <h1 className="mt-4 text-[24px] font-black tracking-tight text-white">Admin Sign In</h1>
                    <p className="mt-1 text-[14px] text-slate-400">{global.siteName} control panel</p>
                </div>
                <label className="block">
                    <span className="mb-1.5 block text-[13px] font-bold text-slate-300">Admin ID or email</span>
                    <span className="flex h-12 items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 text-slate-400 focus-within:border-brand">
                        <UserRound size={18} />
                        <input value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" required className="h-full w-full bg-transparent text-[15px] text-white outline-none" />
                    </span>
                </label>
                <label className="mt-4 block">
                    <span className="mb-1.5 block text-[13px] font-bold text-slate-300">Password</span>
                    <span className="flex h-12 items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 text-slate-400 focus-within:border-brand">
                        <LockKeyhole size={18} />
                        <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className="h-full w-full bg-transparent text-[15px] text-white outline-none" />
                        <button type="button" onClick={() => setShow((v) => !v)} aria-label="Toggle password">
                            {show ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </span>
                </label>
                {error && <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2.5 text-[13px] font-semibold text-red-300">{error}</p>}
                <button type="submit" disabled={busy} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[15px] font-bold text-white shadow-lg shadow-brand/25 hover:bg-brand-600 disabled:opacity-60">
                    <ShieldCheck size={18} /> {busy ? "Signing in..." : "Sign In"}
                </button>
                <p className="mt-6 text-center text-[12px] text-slate-500">Sessions expire after 8 hours.</p>
            </form>
        </main>
    );
}
