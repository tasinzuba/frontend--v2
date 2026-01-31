"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { User, LogOut, ShoppingCart, Menu, X, LayoutDashboard } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const { cartCount } = useCart();

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
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/60 backdrop-blur-xl border-b border-slate-100 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-sky-500 blur-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center relative z-10 shadow-lg group-hover:-rotate-3 transition-transform duration-500">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold text-slate-900 tracking-tight">
                                Medi<span className="text-sky-600">Store</span>
                            </span>
                            <div className="flex items-center gap-1.5 -mt-0.5">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Precision Health</p>
                            </div>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-10">
                        {['Home', 'Medicines', 'Categories'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-sky-600 transition-all relative group/link"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-600 group-hover/link:w-full transition-all duration-300"></span>
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/cart" className="relative group/cart">
                            <div className="p-2.5 bg-slate-50 group-hover/cart:bg-white rounded-xl border border-transparent group-hover:border-slate-100 transition-all group-hover:shadow-md">
                                <ShoppingCart className="w-5 h-5 text-slate-400 group-hover:text-sky-600 transition-colors" />
                            </div>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 text-[8px] bg-slate-900 text-white rounded-full flex items-center justify-center font-bold shadow-sm border border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {isPending ? (
                            <div className="w-24 h-10 bg-slate-50 animate-pulse rounded-xl"></div>
                        ) : session?.user ? (
                            <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
                                <div className="text-right hidden lg:block">
                                    <p className="text-xs font-bold text-slate-900 leading-none mb-1 uppercase tracking-tight">{session.user.name}</p>
                                    <p className="text-[9px] text-sky-500 font-bold uppercase tracking-[0.1em]">{(session.user as any).role || 'Customer'}</p>
                                </div>
                                <div className="relative group">
                                    <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:shadow-lg transition-all overflow-hidden border border-slate-100">
                                        <div className="w-full h-full bg-sky-50 flex items-center justify-center">
                                            <User className="w-5 h-5 text-sky-600" />
                                        </div>
                                    </button>

                                    <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <div className="w-56 bg-white rounded-2xl border border-slate-100 p-2 shadow-xl shadow-slate-200/50">
                                            <div className="px-3 py-2 mb-1 border-b border-slate-50">
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Account</p>
                                                <p className="text-xs font-semibold text-slate-800 truncate">{session.user.email}</p>
                                            </div>
                                            <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-sky-600 rounded-xl transition-all">
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                                <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 px-3 py-2 transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-sky-600 hover:shadow-lg transition-all active:scale-95">
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 bg-slate-50 rounded-xl text-slate-900">
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden p-4 bg-white border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="flex flex-col gap-2">
                        {['Home', 'Medicines', 'Categories'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-sky-600 rounded-xl transition-all"
                            >
                                {item}
                            </Link>
                        ))}
                        <div className="h-px bg-slate-50 my-2"></div>
                        {session ? (
                            <>
                                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-sky-600 bg-sky-50 rounded-xl">Dashboard</Link>
                                <button onClick={handleLogout} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-500 text-left">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setIsOpen(false)} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">Login</Link>
                                <Link href="/register" onClick={() => setIsOpen(false)} className="px-4 py-3 text-center bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
