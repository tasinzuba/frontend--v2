"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { User, LogOut, ShoppingCart, Menu, X, LayoutDashboard, Pill, ChevronDown, Heart, Package, Settings, Bell, Search } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import Logo from "./Logo";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const pathname = usePathname();
    const { cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/medicines?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowSearch(false);
            setSearchQuery("");
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Medicines", href: "/medicines" },
        { name: "Categories", href: "/categories" }
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
                ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/20 border-b border-slate-100"
                : "bg-white/80 backdrop-blur-lg"
                }`}>
                <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                    <div className="h-20 flex items-center justify-between gap-8">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Logo />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1 bg-slate-50/80 backdrop-blur rounded-2xl p-1.5">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive(link.href)
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className="hidden md:flex items-center gap-3">
                            {/* Search Button */}
                            <button
                                onClick={() => setShowSearch(true)}
                                className="w-10 h-10 bg-slate-50 hover:bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-sky-600 transition-all hover:shadow-md border border-transparent hover:border-slate-100"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Cart */}
                            <Link href="/cart" className="relative group">
                                <div className="w-10 h-10 bg-slate-50 group-hover:bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-sky-600 transition-all group-hover:shadow-md border border-transparent group-hover:border-slate-100">
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 text-[10px] bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-sky-500/30 border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Divider */}
                            <div className="w-px h-8 bg-slate-200 mx-2"></div>

                            {/* Auth Section */}
                            {isPending ? (
                                <div className="w-32 h-10 bg-slate-50 animate-pulse rounded-xl"></div>
                            ) : session?.user ? (
                                <div className="relative group">
                                    <button className="flex items-center gap-3 pl-3 pr-2 py-2 rounded-xl hover:bg-slate-50 transition-all">
                                        <div className="text-right hidden lg:block">
                                            <p className="text-sm font-semibold text-slate-900 leading-tight">{session.user.name}</p>
                                            <p className="text-[10px] text-sky-600 font-medium">{(session.user as any).role || 'Customer'}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center overflow-hidden shadow-lg shadow-sky-500/20">
                                            {session.user.image ? (
                                                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-white" />
                                            )}
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:rotate-180" />
                                    </button>

                                    {/* Dropdown */}
                                    <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="w-64 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                                            {/* User Info */}
                                            <div className="p-4 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center overflow-hidden">
                                                        {session.user.image ? (
                                                            <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="w-6 h-6 text-white" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-slate-900 truncate">{session.user.name}</p>
                                                        <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="p-2">
                                                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all">
                                                    <LayoutDashboard className="w-5 h-5 text-slate-400" />
                                                    Dashboard
                                                </Link>
                                                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all">
                                                    <Package className="w-5 h-5 text-slate-400" />
                                                    My Orders
                                                </Link>
                                                <Link href="/cart" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all">
                                                    <Heart className="w-5 h-5 text-slate-400" />
                                                    Wishlist
                                                </Link>
                                            </div>

                                            {/* Logout */}
                                            <div className="p-2 border-t border-slate-100">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <LogOut className="w-5 h-5" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href="/login"
                                        className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-sky-500/30 transition-all"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center gap-3 md:hidden">
                            <Link href="/cart" className="relative">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[9px] bg-sky-600 text-white rounded-full flex items-center justify-center font-bold border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600"
                            >
                                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="max-w-[1400px] mx-auto px-4 py-4">
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="relative mb-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search medicines..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline-none text-sm font-medium focus:ring-2 focus:ring-sky-500/20 border border-slate-100"
                                />
                            </form>

                            {/* Nav Links */}
                            <div className="space-y-1 mb-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive(link.href)
                                            ? "bg-sky-50 text-sky-600"
                                            : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Auth Section */}
                            <div className="pt-4 border-t border-slate-100">
                                {session ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center overflow-hidden">
                                                {session.user.image ? (
                                                    <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-5 h-5 text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{session.user.name}</p>
                                                <p className="text-xs text-slate-500">{session.user.email}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-sky-600 bg-sky-50 rounded-xl"
                                        >
                                            <LayoutDashboard className="w-5 h-5" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="px-4 py-3 text-center text-sm font-semibold text-slate-600 bg-slate-50 rounded-xl"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="px-4 py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Search Modal */}
            {showSearch && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32 animate-in fade-in duration-200" onClick={() => setShowSearch(false)}>
                    <div className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search for medicines, vitamins, supplements..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="w-full pl-16 pr-6 py-6 text-lg outline-none font-medium"
                            />
                        </form>
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                            <p className="text-xs text-slate-400 font-medium">Press <kbd className="px-2 py-1 bg-white rounded border border-slate-200 text-slate-600 font-mono text-[10px]">ESC</kbd> to close or <kbd className="px-2 py-1 bg-white rounded border border-slate-200 text-slate-600 font-mono text-[10px]">ENTER</kbd> to search</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
