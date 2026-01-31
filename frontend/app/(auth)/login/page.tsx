"use client";

import { useState, useEffect, Suspense } from "react";
import { authClient } from "@/app/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const msg = searchParams.get("message");
        if (msg) setMessage(msg);
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            await authClient.signIn.email({
                email,
                password,
                callbackURL: "/",
            }, {
                onResponse: () => setLoading(false),
                onError: (ctx) => setError(ctx.error.message || "Invalid credentials."),
                onSuccess: () => {
                    router.push("/");
                    router.refresh();
                }
            });
        } catch (e) {
            setError("Something went wrong.");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] px-4 py-24 animate-slide-up relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-3xl -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -ml-64 -mb-64"></div>

            <div className="w-full max-w-[440px] glass-card rounded-[48px] overflow-hidden border-white/50 premium-shadow">
                <div className="p-10 text-center">
                    <div className="w-20 h-20 bg-slate-900 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-slate-200 rotate-3 group hover:rotate-0 transition-transform duration-500">
                        <LogIn className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Welcome <span className="text-sky-600">Back</span></h1>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-3">Access your pharmaceutical portal</p>
                </div>

                <form onSubmit={handleLogin} className="px-10 pb-12 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl animate-fade-in text-center">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 animate-fade-in">
                            <CheckCircle2 className="w-4 h-4" />
                            {message}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-14 pr-6 py-4.5 bg-[#f8fafc] border-2 border-transparent focus:border-sky-500/10 focus:bg-white focus:ring-4 focus:ring-sky-500/5 outline-none rounded-2xl text-sm font-bold placeholder:text-slate-300 transition-all duration-300"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-14 pr-6 py-4.5 bg-[#f8fafc] border-2 border-transparent focus:border-sky-500/10 focus:bg-white focus:ring-4 focus:ring-sky-500/5 outline-none rounded-2xl text-sm font-bold placeholder:text-slate-300 transition-all duration-300"
                                required
                            />
                        </div>
                    </div>

                    <div className="text-right">
                        <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-600 transition-colors">Forgot Password?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-sky-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-slate-200 active:scale-95 group"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                    </button>

                    <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                        New to MediStore?{" "}
                        <Link href="/register" className="text-emerald-600 hover:text-emerald-500 underline underline-offset-4">Register Now</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-sky-500" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
