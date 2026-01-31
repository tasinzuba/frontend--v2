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
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-12">
            <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-100">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-400 text-sm mt-2 font-medium">Log in to your account</p>
                </div>

                <form onSubmit={handleLogin} className="px-8 pb-10 space-y-5">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded-2xl flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            {message}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-slate-100"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
                    </button>

                    <p className="text-center text-xs text-slate-400">
                        New to MediStore?{" "}
                        <Link href="/register" className="text-emerald-600 font-bold hover:underline">Register Now</Link>
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
