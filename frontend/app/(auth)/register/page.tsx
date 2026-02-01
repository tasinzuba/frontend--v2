"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, UserCircle, ArrowRight, Loader2, Pill, Store } from "lucide-react";

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 px-4 py-24 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl -mr-80 -mt-80"></div>
            <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl -ml-80 -mb-80"></div>

            <div className="w-full max-w-[480px] bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="p-10 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                        <Pill className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h1>
                    <p className="text-slate-500 text-sm mt-2">Join MediStore and start shopping</p>
                </div>

                <form onSubmit={handleRegister} className="px-10 pb-10 space-y-5">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-50 rounded-xl border border-slate-100">
                        <button
                            type="button"
                            onClick={() => setRole("CUSTOMER")}
                            className={`py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${role === "CUSTOMER"
                                ? "bg-white text-sky-600 shadow-sm border border-slate-100"
                                : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <User className="w-4 h-4" />
                            Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("SELLER")}
                            className={`py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${role === "SELLER"
                                ? "bg-white text-emerald-600 shadow-sm border border-slate-100"
                                : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <Store className="w-4 h-4" />
                            Seller
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                            <div className="relative">
                                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none rounded-xl text-sm transition-all"
                                    required
                                />
                            </div>
                        </div>

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
                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none rounded-xl text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none rounded-xl text-sm transition-all"
                                    required
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1.5">Must be at least 8 characters</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                    </button>

                    <p className="text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-sky-600 hover:text-sky-700 font-semibold">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
