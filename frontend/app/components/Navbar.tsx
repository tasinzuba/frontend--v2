"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { User, LogOut, ShoppingCart, Menu, X, LayoutDashboard } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                    router.refresh();
                }
            }
        });
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-[1300px] mx-auto px-4 md:px-10">
                <div className="h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-100 group-hover:scale-105 transition-transform">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                                MediStore
                            </span>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest -mt-1 font-bold">
                                Pharmacy
                            </p>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-sky-600 transition-colors">Home</Link>
                        <Link href="/medicines" className="text-sm font-semibold text-gray-600 hover:text-sky-600 transition-colors">Medicines</Link>
                        <Link href="/categories" className="text-sm font-semibold text-gray-600 hover:text-sky-600 transition-colors">Categories</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/cart" className="relative p-2.5 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-all">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white">0</span>
                        </Link>

                        {isPending ? (
                            <div className="w-24 h-9 bg-gray-100 animate-pulse rounded-full"></div>
                        ) : session?.user ? (
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                                <div className="text-right hidden lg:block">
                                    <p className="text-xs font-bold text-gray-900 leading-none mb-0.5">{session.user.name}</p>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{(session.user as any).role || 'Customer'}</p>
                                </div>
                                <div className="relative group">
                                    <button className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center hover:ring-2 hover:ring-sky-200 transition-all overflow-hidden border border-sky-100">
                                        <User className="w-5 h-5 text-sky-600" />
                                    </button>

                                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <div className="w-48 bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-50 p-2 overflow-hidden">
                                            <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-colors">
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-1 text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 pl-4 border-l border-gray-100">
                                <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-sky-600 px-4 py-2 transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg shadow-sky-100 hover:opacity-90 hover:scale-[1.02] transition-all">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden p-4 bg-white border-t border-gray-50 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="flex flex-col gap-2">
                        <Link href="/" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-colors">Home</Link>
                        <Link href="/medicines" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-colors">Medicines</Link>
                        <Link href="/categories" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-colors">Categories</Link>
                        <div className="h-px bg-gray-50 my-2"></div>
                        {session ? (
                            <>
                                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-semibold text-sky-600 bg-sky-50 rounded-xl">Dashboard</Link>
                                <button onClick={handleLogout} className="px-4 py-3 text-sm font-semibold text-red-500 text-left">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-semibold text-gray-600">Sign In</Link>
                                <Link href="/register" onClick={() => setIsOpen(false)} className="px-4 py-3 text-center bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl font-bold">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
