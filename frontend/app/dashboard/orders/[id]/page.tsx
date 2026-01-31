"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import {
    Package,
    ArrowLeft,
    Loader2,
    MapPin,
    Calendar,
    Clock,
    CheckCircle2,
    Truck,
    AlertCircle,
    ShoppingBag,
    ShieldCheck,
    CreditCard
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
    id: string;
    medicine: {
        id: string;
        name: string;
        image: string;
        price: number;
    };
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    totalPrice: number;
    status: string;
    shippingAddress: string;
    paymentStatus: string;
    createdAt: string;
    items: OrderItem[];
}

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session, isPending: authPending } = authClient.useSession();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    useEffect(() => {
        if (!authPending && !session) {
            router.push("/login?callbackUrl=/dashboard/orders/" + id);
        }
    }, [session, authPending, router, id]);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${backendUrl}/api/orders/${id}`, {
                    credentials: "include"
                });
                const json = await res.json();
                if (json.success) {
                    setOrder(json.data);
                }
            } catch (e) {
                console.error("Order fetch failed", e);
            } finally {
                setLoading(false);
            }
        };

        if (session) fetchOrder();
    }, [session, id, backendUrl]);

    if (loading || authPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] text-center px-4">
                <AlertCircle className="w-16 h-16 text-slate-200 mb-6" />
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Manifest Not Found</h2>
                <Link href="/dashboard" className="text-sky-600 font-bold hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Return to Command
                </Link>
            </div>
        );
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "DELIVERED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "SHIPPED": return "bg-blue-50 text-blue-600 border-blue-100";
            case "PROCESSING": return "bg-orange-50 text-orange-600 border-orange-100";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 animate-slide-up">
            <div className="max-w-[1000px] mx-auto px-4 md:px-10">
                <div className="flex items-center gap-6 mb-12">
                    <button onClick={() => router.back()} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-sky-600 shadow-sm border border-slate-50 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Order Transaction</p>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">#{order.id.slice(-12).toUpperCase()}</h1>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Status Card */}
                        <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm overflow-hidden relative">
                            <div className="flex items-center justify-between mb-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fulfillment Status</p>
                                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold border inline-block ${getStatusStyles(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Payload</p>
                                    <p className="text-3xl font-bold text-sky-600 italic tracking-tighter">৳{order.totalPrice.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-6 group">
                                        <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                                            <img src={item.medicine.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="text-base font-bold text-slate-800">{item.medicine.name}</h4>
                                            <p className="text-xs text-slate-400 font-medium">Qty: {item.quantity} × ৳{item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">৳{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-10 border-t border-slate-50 flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-400 uppercase tracking-widest">Subtotal Assets</span>
                                <span className="text-slate-900">৳{order.totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="mt-4 flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-400 uppercase tracking-widest">Logistics Fee</span>
                                <span className="text-emerald-500">FREE</span>
                            </div>
                            <div className="mt-8 pt-8 border-t-2 border-slate-900 flex justify-between items-end">
                                <span className="text-lg font-bold text-slate-900 uppercase tracking-tighter italic">Total Amount</span>
                                <span className="text-4xl font-bold text-slate-900 italic tracking-tighter">৳{order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Logistics info */}
                        <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm grid md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sky-600">
                                    <MapPin className="w-5 h-5" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Deployment Point</p>
                                </div>
                                <p className="text-sm font-medium text-slate-600 leading-relaxed">{order.shippingAddress}</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-emerald-600">
                                    <Calendar className="w-5 h-5" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Timestamp</p>
                                </div>
                                <p className="text-sm font-medium text-slate-600">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar info */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
                            <ShieldCheck className="w-12 h-12 text-sky-400 mb-6" />
                            <h3 className="text-xl font-bold mb-4">Secure Transaction</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 uppercase tracking-widest">Method</span>
                                    <span className="font-bold flex items-center gap-2 italic"><CreditCard className="w-3 h-3" /> Cash on Delivery</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 uppercase tracking-widest">Payment</span>
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${order.paymentStatus === "PAID" ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400"}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="bg-white rounded-[40px] p-8 border border-slate-50 shadow-sm space-y-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] px-2">Timeline</h3>
                            <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
                                <div className="flex gap-6 relative">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 border-4 border-white shadow-sm flex-shrink-0 z-10"></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Order Placed</p>
                                        <p className="text-[10px] text-slate-400 uppercase mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 relative">
                                    <div className={`w-6 h-6 rounded-full ${['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-sky-500' : 'bg-slate-100'} border-4 border-white shadow-sm flex-shrink-0 z-10`}></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Processing</p>
                                        <p className="text-[10px] text-slate-400 uppercase mt-1">Asset Verification</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 relative">
                                    <div className={`w-6 h-6 rounded-full ${['SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-sky-500' : 'bg-slate-100'} border-4 border-white shadow-sm flex-shrink-0 z-10`}></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Dispatched</p>
                                        <p className="text-[10px] text-slate-400 uppercase mt-1">In Transit</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 relative">
                                    <div className={`w-6 h-6 rounded-full ${order.status === 'DELIVERED' ? 'bg-emerald-500' : 'bg-slate-100'} border-4 border-white shadow-sm flex-shrink-0 z-10`}></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Delivered</p>
                                        <p className="text-[10px] text-slate-400 uppercase mt-1">Final Handover</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
