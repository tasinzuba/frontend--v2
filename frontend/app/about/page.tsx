"use client";

import { ShieldCheck, Truck, Headphones, Users, Award, Target, Heart, ArrowRight, Star, Sparkles, Globe, TrendingUp } from "lucide-react";
import Link from "next/link";

const team = [
    { name: "Dr. Aminul Islam", role: "Chief Pharmacist", avatar: 10 },
    { name: "Tasin Ahmed", role: "Founder & CEO", avatar: 20 },
    { name: "Nusrat Jahan", role: "Operations Head", avatar: 30 },
    { name: "Rafiq Hossain", role: "Customer Support Lead", avatar: 40 },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Hero */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[150px] -mr-64 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -ml-32"></div>
                <div className="max-w-[1400px] mx-auto px-4 md:px-10">
                    <div className="max-w-3xl animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 border border-sky-100">
                            <Sparkles className="w-4 h-4" />
                            About MediStore
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                            Making Healthcare <br /><span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">Accessible</span> for Everyone
                        </h1>
                        <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
                            MediStore is Bangladesh&apos;s trusted online pharmacy, delivering authentic medicines and healthcare essentials to your doorstep since 2024.
                        </p>
                    </div>
                </div>
            </section>

            {/* Bento Mission / Vision / Values */}
            <section className="pb-20">
                <div className="max-w-[1400px] mx-auto px-4 md:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 stagger-children">
                        {/* Mission - Large */}
                        <div className="md:col-span-3 lg:col-span-7 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-sky-500/20 transition-all">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] -mr-12 -mt-12"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-6">
                                    <Target className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-bold mb-4">Our Mission</h3>
                                <p className="text-sky-100 leading-relaxed text-lg max-w-lg">
                                    To provide affordable, accessible, and authentic healthcare products to every household in Bangladesh through technology and reliable logistics.
                                </p>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="md:col-span-3 lg:col-span-5 bg-white rounded-3xl p-8 lg:p-10 border border-slate-100 group hover:shadow-xl transition-all">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Heart className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                            <p className="text-slate-500 leading-relaxed">
                                To become the most trusted and widely used online pharmacy platform in South Asia, setting the standard for quality, transparency, and customer care.
                            </p>
                        </div>

                        {/* Stats Row */}
                        <div className="md:col-span-2 lg:col-span-3 bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-center">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-3xl font-bold">10K+</p>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">Customers</p>
                                </div>
                                <div className="w-full h-px bg-slate-700"></div>
                                <div>
                                    <p className="text-3xl font-bold">5K+</p>
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">Products</p>
                                </div>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="md:col-span-2 lg:col-span-4.5 bg-gradient-to-br from-emerald-50 to-emerald-50/50 rounded-3xl p-8 border border-slate-100 group hover:shadow-xl transition-all lg:col-span-5">
                            <div className="flex items-start gap-5">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                                    <ShieldCheck className="w-7 h-7 text-emerald-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-2">100% Authentic</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">All medicines sourced from certified manufacturers and authorized distributors with full traceability.</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 lg:col-span-4 bg-white rounded-3xl p-8 border border-slate-100 group hover:shadow-xl transition-all">
                            <div className="flex items-start gap-5">
                                <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                    <Truck className="w-7 h-7 text-sky-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-2">Fast Delivery</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">Same-day delivery within Dhaka. 2-3 days for rest of Bangladesh.</p>
                                    <div className="mt-3 flex gap-2">
                                        <span className="px-2.5 py-1 bg-sky-50 rounded-lg text-[10px] font-bold text-sky-600 border border-sky-100">Same Day</span>
                                        <span className="px-2.5 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-100">Tracked</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 bg-white">
                <div className="max-w-[1400px] mx-auto px-4 md:px-10">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4 border border-sky-100">
                            <Users className="w-4 h-4" />
                            Our Team
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-4">Meet Our Team</h2>
                        <p className="text-slate-500 text-lg max-w-xl mx-auto">Dedicated professionals working to serve your healthcare needs.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                        {team.map((member, i) => (
                            <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-1">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mx-auto mb-5 overflow-hidden shadow-lg group-hover:scale-105 transition-transform rotate-3 group-hover:rotate-0">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar}`} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <h4 className="font-bold text-lg text-slate-900 mb-1">{member.name}</h4>
                                <p className="text-sm text-sky-600 font-medium">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-sky-50 via-white to-emerald-50">
                <div className="max-w-[700px] mx-auto px-4 md:px-10 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
                    <p className="text-slate-500 text-lg mb-8">Join thousands of satisfied customers who trust MediStore.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/medicines" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 active:scale-[0.97] transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
                            Browse Medicines <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/contact" className="px-8 py-4 bg-white text-slate-700 rounded-2xl font-semibold hover:bg-slate-50 active:scale-[0.97] transition-all border border-slate-200">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
