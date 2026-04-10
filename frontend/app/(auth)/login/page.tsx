"use client";

import { useState, useEffect, Suspense } from "react";
import { authClient } from "@/app/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, CheckCircle2, Pill, ShieldCheck, Truck, Star, Users } from "lucide-react";

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
        <div className="flex min-h-screen bg-white">
            {/* Left side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-12 flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-sky-500 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-sky-500 rounded-full blur-[150px]"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center">
                            <Pill className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">MediStore</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-8">
                    <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                        Your Health,<br />
                        <span className="bg-gradient-to-r from-sky-400 to-sky-300 bg-clip-text text-transparent">Our Priority.</span>
                    </h2>
                    <p className="text-sky-200/80 text-lg max-w-md leading-relaxed">
                        Access 5,000+ verified medicines and healthcare products delivered to your doorstep.
                    </p>

                    {/* Bento Feature Cards */}
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
                            <p className="text-white font-semibold text-sm">100% Verified</p>
                            <p className="text-sky-300/60 text-xs mt-0.5">Certified medicines</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                            <Truck className="w-6 h-6 text-sky-400 mb-2" />
                            <p className="text-white font-semibold text-sm">Fast Delivery</p>
                            <p className="text-sky-300/60 text-xs mt-0.5">Same day in Dhaka</p>
                        </div>
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-9 h-9 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-700">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 77}`} alt="" className="w-full h-full" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="flex items-center gap-1 mb-0.5">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                            </div>
                            <p className="text-xs text-sky-300/60">Trusted by 10,000+ customers</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-sky-300/40 text-xs">&copy; 2026 MediStore. All rights reserved.</p>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
                <div className="w-full max-w-[420px]">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <Pill className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-slate-900">MediStore</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome back</h1>
                        <p className="text-slate-500">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-2xl">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium rounded-2xl flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                {message}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50/80 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 outline-none rounded-2xl text-sm transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-slate-700">Password</label>
                                <Link href="/forgot-password" className="text-xs text-sky-600 hover:text-sky-700 font-semibold">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50/80 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 outline-none rounded-2xl text-sm transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded-lg border-slate-300 text-sky-600 focus:ring-sky-500" />
                            <label htmlFor="remember" className="text-sm text-slate-500 cursor-pointer">Remember me for 30 days</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-slate-400 text-xs font-medium">or continue with</span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" className="flex items-center justify-center gap-2.5 px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all">
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                Google
                            </button>
                            <button type="button" className="flex items-center justify-center gap-2.5 px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all">
                                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                Facebook
                            </button>
                        </div>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-sky-600 hover:text-sky-700 font-semibold">Create free account</Link>
                        </p>
                    </form>
                </div>
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
