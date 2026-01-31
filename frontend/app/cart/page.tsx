"use client";

import Link from "next/link";
import { ShoppingCart, ShoppingBag, ArrowLeft, ArrowRight, Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
            <div className="max-w-[1300px] mx-auto px-4 md:px-10">
                <div className="flex items-center gap-4 mb-12">
                    <Link href="/medicines" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-sky-600 hover:shadow-lg transition-all border border-slate-50">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 italic tracking-tight">Your Cart</h1>
                        <p className="text-slate-400 text-sm font-medium">Review your items before checkout</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Empty State for now */}
                        <div className="bg-white rounded-[40px] p-20 text-center border border-slate-50 shadow-2xl shadow-slate-100">
                            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                                <ShoppingBag className="w-10 h-10 text-slate-300" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 italic leading-tight">Your cart is empty</h2>
                            <p className="text-slate-400 text-sm mt-4 max-w-xs mx-auto mb-10">Looks like you haven't added anything to your cart yet. Let's start shopping!</p>
                            <Link href="/medicines" className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-[24px] font-bold shadow-xl shadow-slate-200 hover:bg-sky-500 transition-all hover:scale-105 group">
                                Start Shopping
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[40px] p-8 border border-slate-50 shadow-2xl shadow-slate-100 sticky top-28">
                            <h3 className="text-xl font-black text-slate-900 italic mb-8 tracking-tight">Order Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-slate-400 uppercase tracking-widest">Subtotal</span>
                                    <span className="text-slate-900">$0.00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-slate-400 uppercase tracking-widest">Shipping</span>
                                    <span className="text-emerald-500">FREE</span>
                                </div>
                                <div className="h-px bg-slate-50 my-6"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-black text-slate-900 italic">Total</span>
                                    <span className="text-2xl font-black text-sky-600">$0.00</span>
                                </div>
                            </div>

                            <button disabled className="w-full py-5 bg-slate-100 text-slate-300 rounded-[24px] font-black uppercase tracking-widest text-xs cursor-not-allowed">
                                Checkout
                            </button>

                            <p className="text-[10px] text-center text-slate-400 font-bold mt-6 uppercase tracking-[0.2em]">
                                Secure Checkout Guaranteed
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
