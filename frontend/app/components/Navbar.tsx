"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-sky-50 via-white to-emerald-50 border-b border-gray-100">
            <div className="max-w-[1300px] mx-auto px-4">
                <div className="h-16 grid grid-cols-3 items-center">
                    <Link href="/" className="flex items-center gap-2 pl-10 justify-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                                MediStore
                            </span>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider -mt-1 font-medium">
                                Online Pharmacy
                            </p>
                        </div>
                    </Link>

                    <div className="hidden md:flex justify-center gap-10">
                        <Link href="/" className="font-medium text-gray-700 hover:text-sky-600 transition-colors">Home</Link>
                        <Link href="/medicines" className="font-medium text-gray-700 hover:text-sky-600 transition-colors">Medicines</Link>
                        <Link href="/categories" className="font-medium text-gray-700 hover:text-sky-600 transition-colors">Categories</Link>
                        <Link href="/about" className="font-medium text-gray-700 hover:text-sky-600 transition-colors">About</Link>
                    </div>

                    <div className="hidden md:flex justify-center items-center gap-5 pr-4">
                        <Link href="/cart" className="relative text-gray-700 hover:text-sky-600 text-xl transition-transform hover:scale-110">
                            🛒
                            <span className="absolute -top-2 -right-3 w-5 h-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center font-bold shadow-sm">0</span>
                        </Link>
                        <Link href="/login" className="font-medium text-gray-700 hover:text-sky-600 transition-colors">
                            Sign In
                        </Link>
                        <Link href="/register" className="inline-flex items-center justify-center px-8 py-2.5 bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-sky-200 hover:opacity-90 hover:scale-[1.02] transition-all whitespace-nowrap">
                            Get Started
                        </Link>
                    </div>

                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden justify-self-end text-gray-700 text-2xl">
                        {isOpen ? "✕" : "☰"}
                    </button>
                </div>

                {isOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
                        <div className="flex flex-col gap-3">
                            <Link href="/" className="py-2 text-gray-700 hover:text-sky-600 font-medium">Home</Link>
                            <Link href="/medicines" className="py-2 text-gray-700 hover:text-sky-600 font-medium">Medicines</Link>
                            <Link href="/categories" className="py-2 text-gray-700 hover:text-sky-600 font-medium">Categories</Link>
                            <Link href="/about" className="py-2 text-gray-700 hover:text-sky-600 font-medium">About</Link>
                            <div className="h-px bg-gray-100 my-2"></div>
                            <Link href="/login" className="py-2 text-gray-700 hover:text-sky-600 font-medium">Sign In</Link>
                            <Link href="/register" className="py-3 text-center bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl font-semibold shadow-md">Get Started</Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
