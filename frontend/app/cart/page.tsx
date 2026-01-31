"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Plus, Minus, Loader2, MapPin, Pill, ShieldCheck } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");
    const { data: session } = authClient.useSession();
    const router = useRouter();

    const handleCheckout = async () => {
        if (!session) {
            router.push("/login?callbackUrl=/cart");
            return;
        }

        if (!address.trim()) {
            alert("Please provide a shipping address.");
            return;
        }

        setLoading(true);
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
            const res = await fetch(`${backendUrl}/api/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        medicineId: item.id,
                        quantity: item.quantity
                    })),
                    shippingAddress: address
                }),
                credentials: "include"
            });

            const json = await res.json();
            if (json.success) {
                clearCart();
                router.push("/dashboard?orderSuccess=true");
            } else {
                alert(json.error || "Failed to place order");
            }
        } catch (e) {
            console.error("Order failed", e);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 animate-slide-up">
            <div className="max-w-[1300px] mx-auto px-4 md:px-10">
                <div className="flex items-center gap-6 mb-16">
                    <Link href="/medicines" className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-sky-600 hover:shadow-2xl transition-all border border-slate-50 premium-shadow">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-5xl font-black text-slate-900 italic tracking-tight">Your <span className="bg-gradient-to-r from-sky-600 to-emerald-500 bg-clip-text text-transparent">Cart</span></h1>
                        <p className="text-slate-400 text-sm font-black uppercase tracking-widest">Review your items before checkout</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-8">
                        {cart.length > 0 ? (
                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="glass-card rounded-[40px] p-8 hover:shadow-2xl hover:shadow-sky-100/50 transition-all duration-500 flex flex-col sm:flex-row items-center gap-8 group">
                                        <div className="w-28 h-28 rounded-3xl overflow-hidden bg-[#f8fafc] flex-shrink-0 flex items-center justify-center border border-white">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <Pill className="w-12 h-12 text-sky-100" />
                                            )}
                                        </div>
                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight mb-2 group-hover:text-sky-600 transition-colors">{item.name}</h3>
                                            <p className="text-sky-600 font-black text-xl italic">৳{item.price.toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center bg-slate-50 shadow-inner rounded-[20px] p-2 border border-white">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white shadow-sm rounded-xl text-slate-400 hover:text-sky-600 transition-all active:scale-90"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-12 text-center font-black text-slate-900 text-lg">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white shadow-sm rounded-xl text-slate-400 hover:text-sky-600 transition-all active:scale-90"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                                            >
                                                <Trash2 className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card rounded-[48px] p-24 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-sky-50/30 to-transparent p-10 -z-10"></div>
                                <div className="w-32 h-32 bg-white shadow-2xl rounded-[40px] flex items-center justify-center mx-auto mb-10 border border-white">
                                    <ShoppingBag className="w-12 h-12 text-slate-200" />
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 italic leading-tight tracking-tight">Your cart is empty</h2>
                                <p className="text-slate-500 font-bold mt-6 max-w-sm mx-auto mb-12 text-lg">Looks like you haven't added anything to your cart yet. Let's start shopping!</p>
                                <Link href="/medicines" className="inline-flex items-center gap-4 px-12 py-5 bg-slate-900 text-white rounded-[24px] font-black italic shadow-2xl shadow-slate-200 hover:bg-sky-600 transition-all hover:scale-105 active:scale-95 group">
                                    Start Shopping
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-8 sticky top-32">
                        <div className="glass-card rounded-[48px] p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <h3 className="text-2xl font-black text-slate-900 italic mb-10 tracking-tight">Order Summary</h3>

                            {cart.length > 0 && (
                                <div className="mb-10 space-y-6">
                                    <label className="block">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-3 px-1">
                                            <MapPin className="w-4 h-4 text-sky-500" /> Shipping Address
                                        </span>
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Enter your full address (Street, House, Area)..."
                                            className="w-full p-5 bg-[#f8fafc] rounded-3xl border-2 border-transparent focus:border-sky-500/10 focus:bg-white focus:ring-4 focus:ring-sky-500/5 outline-none text-sm font-bold placeholder:text-slate-300 min-h-[140px] resize-none transition-all duration-300 shadow-inner"
                                        />
                                    </label>
                                </div>
                            )}

                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Subtotal</span>
                                    <span className="text-lg font-black text-slate-900">৳{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Shipping</span>
                                    <span className="text-sm font-black text-emerald-500 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100/50 uppercase tracking-widest">FREE</span>
                                </div>
                                <div className="h-px bg-slate-100/50 my-8"></div>
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-xl font-black text-slate-900 italic tracking-tight">Total Payment</span>
                                    <span className="text-3xl font-black text-sky-600 tracking-tighter italic">৳{totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || loading}
                                className={`w-full py-5 rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 ${cart.length === 0 || loading
                                    ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                                    : "bg-slate-900 text-white hover:bg-sky-600 hover:scale-[1.02] shadow-sky-100"
                                    }`}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5 mb-0.5" />}
                                {session ? "Place Secure Order" : "Login to Checkout"}
                            </button>

                            <div className="flex items-center justify-center gap-3 mt-8">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                                    Secure SSL Checkout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
