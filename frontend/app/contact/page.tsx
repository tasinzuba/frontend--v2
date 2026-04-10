"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, Headphones, ArrowRight } from "lucide-react";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Hero */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] -mr-64 -mt-32"></div>
                <div className="max-w-[1400px] mx-auto px-4 md:px-10 text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 border border-sky-100">
                        <MessageSquare className="w-4 h-4" />
                        Get in Touch
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                        Contact <span className="text-sky-600">Us</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto">
                        Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Bento Contact Info */}
            <section className="pb-16">
                <div className="max-w-[1400px] mx-auto px-4 md:px-10">
                    <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 stagger-children">
                        {/* Address - Wide */}
                        <div className="col-span-2 lg:col-span-5 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-7 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-sky-500/20 transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -mr-8 -mt-8"></div>
                            <div className="relative z-10 flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg mb-1">Visit Us</p>
                                    <p className="text-sky-100 text-sm leading-relaxed">Uttara Sector 4, Road 13, House 16<br />Dhaka, Bangladesh</p>
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="lg:col-span-3 bg-white rounded-3xl p-7 border border-slate-100 hover:shadow-lg transition-all group">
                            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Phone className="w-6 h-6 text-sky-600" />
                            </div>
                            <p className="font-bold text-slate-900 mb-1">Call Us</p>
                            <p className="text-slate-500 text-sm">+880 1732134482</p>
                        </div>

                        {/* Email + Hours Stack */}
                        <div className="lg:col-span-4 flex flex-col gap-4">
                            <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100 flex items-center gap-4 flex-1 hover:shadow-md transition-all">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-sky-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-sm text-slate-900">Email Us</p>
                                    <p className="text-xs text-slate-500 truncate">tasinahmed423@gmail.com</p>
                                </div>
                            </div>
                            <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100 flex items-center gap-4 flex-1 hover:shadow-md transition-all">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 text-sky-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-slate-900">Working Hours</p>
                                    <p className="text-xs text-slate-500">24/7 Support Available</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="pb-20">
                <div className="max-w-[1400px] mx-auto px-4 md:px-10">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Form */}
                        <div className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                                    <Send className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Send a Message</h3>
                                    <p className="text-sm text-slate-500">We typically respond within 2 hours</p>
                                </div>
                            </div>

                            {submitted && (
                                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 mb-6">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                    <p className="text-sm font-medium text-emerald-700">Message sent successfully! We will get back to you soon.</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Full Name</label>
                                        <input type="text" placeholder="Your full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-4 bg-slate-50/80 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500/30 text-sm transition-all duration-200" required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Email Address</label>
                                        <input type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-4 bg-slate-50/80 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500/30 text-sm transition-all duration-200" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Subject</label>
                                    <input type="text" placeholder="How can we help?" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-4 bg-slate-50/80 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500/30 text-sm transition-all duration-200" required />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Message</label>
                                    <textarea placeholder="Write your message here..." rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-4 bg-slate-50/80 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500/30 text-sm transition-all duration-200 resize-none" required />
                                </div>
                                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 active:scale-[0.97] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10">
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Map + Info */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm h-80">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.5459366789516!2d90.3916085!3d23.8759324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c5d05e17a59d%3A0x4660cf77fadc5fa7!2sUttara%20Sector%204!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="MediStore Location"></iframe>
                            </div>

                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/10 rounded-full blur-[60px] -mr-10 -mt-10"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
                                            <Headphones className="w-7 h-7 text-sky-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">Need Immediate Help?</h4>
                                            <p className="text-sm text-slate-400">We respond within 15 minutes</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <a href="tel:+8801732134482" className="px-5 py-3 bg-white text-slate-900 rounded-xl text-sm font-semibold hover:bg-sky-50 active:scale-95 transition-all duration-200 flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> Call Now
                                        </a>
                                        <a href="mailto:tasinahmed423@gmail.com" className="px-5 py-3 bg-white/10 backdrop-blur text-white rounded-xl text-sm font-semibold hover:bg-white/20 active:scale-95 transition-all duration-200 flex items-center gap-2 border border-white/10">
                                            <Mail className="w-4 h-4" /> Email Us
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
