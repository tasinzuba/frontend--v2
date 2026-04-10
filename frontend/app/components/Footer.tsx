"use client";

import Link from "next/link";
import { Pill, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowRight, ShieldCheck, Heart, ExternalLink } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-white pt-20 pb-8 overflow-hidden relative">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[120px]"></div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-10 relative z-10">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center">
                                <Pill className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">MediStore</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            Your trusted online pharmacy. Authentic medicines and healthcare essentials delivered to your doorstep with care.
                        </p>
                        <div className="flex items-center gap-2">
                            {[
                                { Icon: Facebook, label: "Facebook" },
                                { Icon: Twitter, label: "Twitter" },
                                { Icon: Instagram, label: "Instagram" },
                                { Icon: Youtube, label: "YouTube" }
                            ].map(({ Icon, label }, i) => (
                                <Link key={i} href="#" aria-label={label} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all border border-white/5 hover:border-sky-500">
                                    <Icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2 space-y-5">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Browse Medicines", href: "/medicines" },
                                { label: "Categories", href: "/categories" },
                                { label: "About Us", href: "/about" },
                                { label: "Contact", href: "/contact" },
                                { label: "FAQ", href: "/faq" },
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors font-medium flex items-center gap-1.5 group">
                                        <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-3 space-y-5">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-sky-400 flex-shrink-0 border border-white/5 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Uttara Sector 4, Road 13, House 16<br />Dhaka, Bangladesh
                                </p>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-sky-400 flex-shrink-0 border border-white/5">
                                    <Phone className="w-3.5 h-3.5" />
                                </div>
                                <p className="text-slate-400 text-sm">+880 1732134482</p>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-sky-400 flex-shrink-0 border border-white/5">
                                    <Mail className="w-3.5 h-3.5" />
                                </div>
                                <p className="text-slate-400 text-sm">tasinahmed423@gmail.com</p>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-3 space-y-5">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Newsletter</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Get updates on new products and health tips.
                        </p>
                        <form className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full pl-4 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none text-white text-sm placeholder:text-slate-500 focus:border-sky-500/50 transition-all focus:ring-2 focus:ring-sky-500/10"
                                />
                                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-sky-500/30 transition-all">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                        <div className="flex items-center gap-2 text-sky-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-medium">SSL Secured & HIPAA Compliant</span>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        &copy; 2026 MediStore. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <Link href="/faq" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/faq" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
