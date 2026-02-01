"use client";

import { useState, useEffect, Suspense } from "react";
import { authClient } from "@/app/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Mail, Lock, ArrowRight, Loader2, CheckCircle2, Pill } from "lucide-react";

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 px-4 py-24 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-3xl -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -ml-64 -mb-64"></div>

            <div className="w-full max-w-[440px] bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="p-10 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-500/20">
                        <Pill className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 text-sm mt-2">Sign in to your MediStore account</p>
                </div>

                <form onSubmit={handleLogin} className="px-10 pb-10 space-y-5">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium rounded-xl flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            {message}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none rounded-xl text-sm transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none rounded-xl text-sm transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                            <span className="text-sm text-slate-600">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-sm text-sky-600 hover:text-sky-700 font-medium">Forgot Password?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-slate-400">or</span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-slate-600">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-sky-600 hover:text-sky-700 font-semibold">Create Account</Link>
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
