"use client";

import Link from "next/link";
import { Pill, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowRight, ShieldCheck, Heart } from "lucide-react";

import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="bg-white pt-20 pb-10 overflow-hidden relative border-t border-slate-100">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

            <div className="max-w-[1300px] mx-auto px-4 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-10">
                    <div className="space-y-6">
                        <Logo />
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Your trusted online pharmacy. We provide authentic medicines and healthcare essentials with fast delivery and excellent customer service.
                        </p>
                        <div className="flex items-center gap-3">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <Link key={i} href="#" className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all border border-slate-100 hover:border-sky-500">
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-slate-900 font-bold text-sm">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Browse Medicines", href: "/medicines" },
                                { label: "View Categories", href: "/categories" },
                                { label: "Become a Seller", href: "/register" },
                                { label: "Privacy Policy", href: "#" }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-slate-500 hover:text-sky-600 text-sm transition-colors font-medium">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-slate-900 font-bold text-sm">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-sky-600 flex-shrink-0 border border-slate-100">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    Uttara Sector 4, Road 13, House 16<br />Dhaka, Bangladesh
                                </p>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0 border border-slate-100">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <p className="text-slate-500 text-sm font-medium">+880 1732134482</p>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0 border border-slate-100">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <p className="text-slate-500 text-sm font-medium">tasinahmed423@gmail.com</p>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-slate-900 font-bold text-sm">Newsletter</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Subscribe to get updates on new products and health tips.
                        </p>
                        <form className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm placeholder:text-slate-400 focus:border-sky-500 transition-all focus:ring-2 focus:ring-sky-500/10"
                            />
                            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-sky-500/30 transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                    <p className="text-slate-500 text-sm font-medium">
                        © 2026 MediStore. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
