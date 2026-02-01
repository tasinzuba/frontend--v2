"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Plus, Minus, Loader2, MapPin, Pill, ShieldCheck, CreditCard, Truck, Package, Sparkles, CheckCircle2 } from "lucide-react";
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

    const subtotal = totalPrice;
    const shipping = 0;
    const tax = totalPrice * 0.05;
    const grandTotal = subtotal + shipping + tax;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-28 pb-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <Link href="/medicines" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-500 rounded-xl text-[11px] font-bold uppercase tracking-widest mb-4 hover:text-sky-600 transition-colors border border-slate-100 shadow-sm">
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                            Shopping <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Cart</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-2">
                            {cart.length === 0 ? "Your cart is empty" : `${cart.length} item${cart.length > 1 ? 's' : ''} in your cart`}
                        </p>
                    </div>

                    {cart.length > 0 && (
                        <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                <Truck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-emerald-700">Free Shipping</p>
                                <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-widest">On all orders</p>
                            </div>
                        </div>
                    )}
                </div>

                {cart.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Table Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 rounded-2xl">
                                <div className="col-span-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Product</div>
                                <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Quantity</div>
                                <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Price</div>
                                <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Total</div>
                            </div>

                            {/* Items */}
                            {cart.map((item) => (
                                <div key={item.id} className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-lg transition-all group">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                        {/* Product */}
                                        <div className="md:col-span-6 flex items-center gap-5">
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Pill className="w-10 h-10 text-slate-200" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-sky-600 transition-colors truncate">{item.name}</h3>
                                                <p className="text-sm text-slate-400 mt-1">Unit Price: ৳{item.price.toFixed(0)}</p>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="mt-2 text-[11px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-1.5"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="md:col-span-2 flex items-center justify-center">
                                            <div className="flex items-center bg-slate-50 rounded-xl p-1.5 border border-slate-100">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-9 h-9 flex items-center justify-center bg-white rounded-lg text-slate-400 hover:text-slate-600 transition-colors shadow-sm"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-12 text-center font-bold text-slate-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-9 h-9 flex items-center justify-center bg-white rounded-lg text-slate-400 hover:text-slate-600 transition-colors shadow-sm"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="md:col-span-2 text-center">
                                            <p className="font-bold text-slate-900">৳{item.price.toFixed(0)}</p>
                                        </div>

                                        {/* Total */}
                                        <div className="md:col-span-2 text-right">
                                            <p className="text-xl font-bold text-slate-900">৳{(item.price * item.quantity).toFixed(0)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl border border-slate-100 p-8 sticky top-28 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>

                                {/* Shipping Address */}
                                <div className="mb-6">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                                        <MapPin className="w-4 h-4 text-sky-500" />
                                        Shipping Address
                                    </label>
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter your complete address..."
                                        className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-medium min-h-[120px] resize-none transition-all"
                                    />
                                </div>

                                {/* Summary Lines */}
                                <div className="space-y-4 py-6 border-y border-slate-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Subtotal</span>
                                        <span className="font-bold text-slate-900">৳{subtotal.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Shipping</span>
                                        <span className="font-bold text-emerald-600">FREE</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Tax (5%)</span>
                                        <span className="font-bold text-slate-900">৳{tax.toFixed(0)}</span>
                                    </div>
                                </div>

                                {/* Grand Total */}
                                <div className="flex justify-between items-center py-6">
                                    <span className="text-lg font-bold text-slate-900">Total</span>
                                    <span className="text-3xl font-bold text-slate-900">৳{grandTotal.toFixed(0)}</span>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={cart.length === 0 || loading}
                                    className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${cart.length === 0 || loading
                                        ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                                        : "bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-500/30"
                                        }`}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <CreditCard className="w-5 h-5" />
                                    )}
                                    {session ? "Place Order" : "Login to Checkout"}
                                </button>

                                {/* Security Badge */}
                                <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-slate-50">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                        Secure SSL Checkout
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="mt-6 space-y-3">
                                    {[
                                        { icon: Truck, text: "Fast Delivery", color: "text-sky-500" },
                                        { icon: Package, text: "Quality Guaranteed", color: "text-emerald-500" },
                                        { icon: CheckCircle2, text: "Easy Returns", color: "text-purple-500" }
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                            <feature.icon className={`w-5 h-5 ${feature.color}`} />
                                            <span className="text-sm font-medium text-slate-600">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty Cart State */
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 max-w-2xl mx-auto">
                        <div className="w-32 h-32 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <ShoppingBag className="w-16 h-16 text-slate-200" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Your Cart is Empty</h2>
                        <p className="text-slate-500 font-medium max-w-md mx-auto mb-10">
                            Looks like you haven't added anything yet. Explore our collection and find products you love!
                        </p>
                        <Link
                            href="/medicines"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:shadow-lg hover:shadow-sky-500/30 transition-all"
                        >
                            <Sparkles className="w-5 h-5" />
                            Browse Products
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
