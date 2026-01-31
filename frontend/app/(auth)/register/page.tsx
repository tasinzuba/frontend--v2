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
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-12">
            <div className="w-full max-w-[450px] bg-white rounded-[32px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-100">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
                    <p className="text-slate-400 text-sm mt-2 font-medium">Join MediStore online pharmacy</p>
                </div>

                <form onSubmit={handleRegister} className="px-8 pb-10 space-y-5">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 p-1 bg-slate-50 rounded-2xl mb-2">
                        <button
                            type="button"
                            onClick={() => setRole("CUSTOMER")}
                            className={`py-2.5 rounded-xl text-xs font-bold transition-all ${role === "CUSTOMER" ? "bg-white text-sky-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("SELLER")}
                            className={`py-2.5 rounded-xl text-xs font-bold transition-all ${role === "SELLER" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            Seller
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                                required
                            />
                        </div>

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
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="tel"
                                placeholder="Phone (Optional)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
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
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
                    </button>

                    <p className="text-center text-xs text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-sky-600 font-bold hover:underline">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
