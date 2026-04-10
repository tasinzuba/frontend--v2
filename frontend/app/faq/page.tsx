"use client";

import { useState } from "react";
import { HelpCircle, ChevronRight, Search, Pill, Truck, CreditCard, RotateCcw, ShieldCheck, MessageSquare } from "lucide-react";
import Link from "next/link";

const faqCategories = [
    {
        title: "Ordering & Products",
        icon: Pill,
        color: "sky",
        questions: [
            { q: "How do I place an order on MediStore?", a: "Browse our product catalog, add items to your cart, and proceed to checkout. You can search for specific medicines or browse by category. Once you have added items to your cart, click on the cart icon and follow the checkout process." },
            { q: "Are all medicines on MediStore genuine?", a: "Yes, we source all medicines directly from certified manufacturers and authorized distributors. Every product undergoes quality verification and comes with proper batch numbers, manufacturing dates, and expiry information." },
            { q: "Do I need a prescription to order medicines?", a: "For prescription medicines (Rx), you need to upload a valid prescription from a registered doctor during the checkout process. Over-the-counter (OTC) medicines, vitamins, and supplements can be ordered without a prescription." },
            { q: "Can I order medicines for someone else?", a: "Yes, you can place orders on behalf of others. Simply enter the recipient's delivery address during checkout. For prescription medicines, you will need to provide a valid prescription for the patient." },
        ]
    },
    {
        title: "Delivery & Shipping",
        icon: Truck,
        color: "sky",
        questions: [
            { q: "What are the delivery charges?", a: "We offer free delivery on orders above ৳500 within Dhaka city. For orders below ৳500, a delivery charge of ৳60 applies. For deliveries outside Dhaka, a flat rate of ৳120 is charged regardless of order value." },
            { q: "How long does delivery take?", a: "Within Dhaka city, we offer same-day delivery for orders placed before 2 PM. For orders placed after 2 PM, delivery is next business day. Outside Dhaka, delivery typically takes 2-3 business days." },
            { q: "Can I track my order?", a: "Yes, once your order is shipped, you will receive a tracking notification. You can track your order status from the 'My Orders' section in your dashboard. We also send SMS and email updates at each stage of delivery." },
            { q: "What if I am not available to receive the delivery?", a: "Our delivery partner will attempt delivery twice. If you are unavailable both times, the order will be held at the nearest hub for 3 days. You can also reschedule delivery by contacting our support team." },
        ]
    },
    {
        title: "Payment",
        icon: CreditCard,
        color: "sky",
        questions: [
            { q: "What payment methods do you accept?", a: "We accept Cash on Delivery (COD), bKash, Nagad, Rocket, and major credit/debit cards (Visa, Mastercard). For online payments, we use secure SSL encryption to protect your financial information." },
            { q: "Is online payment safe on MediStore?", a: "Absolutely. We use industry-standard SSL encryption and never store your card details on our servers. All online transactions are processed through certified payment gateways with multiple layers of security." },
            { q: "Can I get an invoice for my order?", a: "Yes, a digital invoice is automatically generated for every order and sent to your registered email. You can also download invoices from the order details page in your dashboard." },
        ]
    },
    {
        title: "Returns & Refunds",
        icon: RotateCcw,
        color: "sky",
        questions: [
            { q: "What is your return policy?", a: "We accept returns within 7 days of delivery for unopened products in their original packaging. Prescription medicines cannot be returned due to regulatory requirements unless there is a quality issue or wrong product was delivered." },
            { q: "How do I initiate a return?", a: "Go to 'My Orders' in your dashboard, select the order, and click 'Request Return.' Our team will review your request and arrange a pickup within 24-48 hours. You can also contact our support team for assistance." },
            { q: "How long do refunds take?", a: "Once we receive and verify the returned product, refunds are processed within 3-5 business days. For COD orders, refunds are credited to your MediStore wallet or bank account. For online payments, refunds go back to the original payment method." },
        ]
    },
];

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState("");

    const toggleItem = (key: string) => {
        setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const filteredCategories = faqCategories.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Hero */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] -mr-64 -mt-32"></div>
                <div className="max-w-[800px] mx-auto px-4 md:px-10 text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 border border-sky-100">
                        <HelpCircle className="w-4 h-4" />
                        Help Center
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                        Frequently Asked <span className="text-sky-600">Questions</span>
                    </h1>
                    <p className="text-lg text-slate-500 mb-8">
                        Find answers to common questions about our service, delivery, payments, and more.
                    </p>

                    {/* Search */}
                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 text-sm font-medium shadow-sm transition-all duration-300"
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="pb-20">
                <div className="max-w-[900px] mx-auto px-4 md:px-10">
                    <div className="space-y-10">
                        {filteredCategories.map((cat, catIdx) => (
                            <div key={catIdx}>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className={`w-10 h-10 bg-${cat.color}-50 rounded-xl flex items-center justify-center`}>
                                        <cat.icon className={`w-5 h-5 text-${cat.color}-600`} />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">{cat.title}</h2>
                                </div>
                                <div className="space-y-3">
                                    {cat.questions.map((faq, i) => {
                                        const key = `${catIdx}-${i}`;
                                        return (
                                            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300">
                                                <button
                                                    onClick={() => toggleItem(key)}
                                                    className="w-full flex items-center justify-between p-5 text-left"
                                                >
                                                    <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                                                    <ChevronRight className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openItems[key] ? "rotate-90" : ""}`} />
                                                </button>
                                                {openItems[key] && (
                                                    <div className="px-5 pb-5 -mt-1">
                                                        <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                            <HelpCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
                            <p className="text-slate-500">Try a different search term</p>
                        </div>
                    )}

                    {/* Still need help */}
                    <div className="mt-16 bg-gradient-to-br from-sky-50 to-sky-50/50 rounded-3xl p-10 border border-sky-100 text-center">
                        <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <MessageSquare className="w-8 h-8 text-sky-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Still Have Questions?</h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">
                            Can&apos;t find the answer you are looking for? Our support team is here to help you.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-500/20 active:scale-[0.97] transition-all"
                        >
                            <MessageSquare className="w-5 h-5" />
                            Contact Support
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
