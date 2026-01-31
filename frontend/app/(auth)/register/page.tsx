"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, UserCircle, ArrowRight, Loader2 } from "lucide-react";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState<"CUSTOMER" | "SELLER">("CUSTOMER");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await authClient.signUp.email({
                email,
                password,
                name,
                image: undefined,
                role,
                phone,
                callbackURL: "/",
            }, {
                onResponse: () => setLoading(false),
                onError: (ctx) => setError(ctx.error.message || "Registration failed."),
                onSuccess: () => router.push("/login?message=Account created! Check email.")
            });
        } catch (e) {
            setError("Something went wrong.");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] px-4 py-24 animate-slide-up relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl -mr-80 -mt-80"></div>
            <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl -ml-80 -mb-80"></div>

            <div className="w-full max-w-[480px] glass-card rounded-[48px] overflow-hidden border-white/50 premium-shadow">
                <div className="p-10 text-center">
                    <div className="w-20 h-20 bg-slate-900 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-slate-200 -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Join <span className="text-sky-600">MediStore</span></h1>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-3">Create your healthcare account</p>
                </div>

                <form onSubmit={handleRegister} className="px-10 pb-12 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl animate-fade-in text-center">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-50/50 rounded-[20px] mb-4 border border-slate-100 shadow-inner">
                        <button
                            type="button"
                            onClick={() => setRole("CUSTOMER")}
                            className={`py-3 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${role === "CUSTOMER" ? "bg-white text-sky-600 shadow-xl" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("SELLER")}
                            className={`py-3 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${role === "SELLER" ? "bg-white text-emerald-600 shadow-xl" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            Pharmacist
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group">
                            <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-14 pr-6 py-4.5 bg-[#f8fafc] border-2 border-transparent focus:border-sky-500/10 focus:bg-white focus:ring-4 focus:ring-sky-500/5 outline-none rounded-2xl text-sm font-bold placeholder:text-slate-300 transition-all duration-300"
                                required
                            />
                        </div>

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
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-14 pr-6 py-4.5 bg-[#f8fafc] border-2 border-transparent focus:border-sky-500/10 focus:bg-white focus:ring-4 focus:ring-sky-500/5 outline-none rounded-2xl text-sm font-bold placeholder:text-slate-300 transition-all duration-300"
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-sky-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-slate-200 active:scale-95 group"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                    </button>

                    <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-sky-600 hover:text-sky-500 underline underline-offset-4">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
