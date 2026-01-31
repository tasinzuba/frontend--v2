"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import {
    Package,
    User,
    Mail,
    Phone,
    ShoppingBag,
    Clock,
    CheckCircle2,
    Truck,
    AlertCircle,
    ChevronRight,
    Loader2,
    Calendar,
    MapPin,
    ArrowRight,
    LayoutDashboard,
    ShieldAlert
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
    id: string;
    medicine: {
        name: string;
        image: string;
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

export default function DashboardPage() {
    const { data: session, isPending: authPending } = authClient.useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    useEffect(() => {
        if (!authPending && !session) {
            router.push("/login?message=Please login to access dashboard");
        }
    }, [session, authPending, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!session) return;
            try {
                const res = await fetch(`${backendUrl}/api/orders`, {
                    credentials: "include"
                });
                const json = await res.json();
                if (json.success) {
                    setOrders(json.data.orders);
                }
            } catch (e) {
                console.error("Failed to fetch orders", e);
            } finally {
                setLoading(false);
            }
        };

        if (session) fetchOrders();
    }, [session, backendUrl]);

    if (authPending || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
            </div>
        );
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "DELIVERED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "SHIPPED": return "bg-blue-50 text-blue-600 border-blue-100";
            case "PROCESSING": return "bg-orange-50 text-orange-600 border-orange-100";
            case "CANCELLED": return "bg-red-50 text-red-600 border-red-100";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DELIVERED": return <CheckCircle2 className="w-4 h-4" />;
            case "SHIPPED": return <Truck className="w-4 h-4" />;
            case "PROCESSING": return <Clock className="w-4 h-4" />;
            case "CANCELLED": return <AlertCircle className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 animate-slide-up">
            <div className="max-w-[1300px] mx-auto px-4 md:px-10">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-full w-fit border border-slate-50">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600">Secure Portal</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 italic tracking-tight">User <span className="bg-gradient-to-r from-sky-600 to-emerald-500 bg-clip-text text-transparent">Dashboard</span></h1>
                        <p className="text-base text-slate-500 font-medium">Manage your pharmaceutical orders and healthcare profile.</p>
                    </div>
                    {(session?.user as any).role === "SELLER" && (
                        <Link
                            href="/dashboard/seller"
                            className="px-10 py-4.5 bg-slate-900 text-white rounded-[24px] font-black italic flex items-center gap-3 hover:bg-sky-600 transition-all shadow-2xl shadow-slate-200 group hover:scale-[1.02] active:scale-95"
                        >
                            <LayoutDashboard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Seller Terminal
                        </Link>
                    )}
                    {(session?.user as any).role === "ADMIN" && (
                        <Link
                            href="/dashboard/admin"
                            className="px-10 py-4.5 bg-sky-600 text-white rounded-[24px] font-black italic flex items-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-sky-200 group hover:scale-[1.02] active:scale-95"
                        >
                            <ShieldAlert className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Admin Terminal
                        </Link>
                    )}
                </div>

                <div className="grid lg:grid-cols-4 gap-10 items-start">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1 space-y-8 sticky top-28">
                        <div className="glass-card rounded-[48px] p-10 border-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <div className="flex flex-col items-center text-center relative">
                                <div className="w-28 h-28 bg-white shadow-2xl rounded-full flex items-center justify-center mb-8 border-4 border-slate-50 overflow-hidden group">
                                    {session.user.image ? (
                                        <img src={session.user.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <User className="w-14 h-14 text-slate-200" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 italic tracking-tight mb-2">{session.user.name}</h3>
                                <div className="px-5 py-1.5 bg-sky-50/50 rounded-full border border-sky-100/50">
                                    <p className="text-[10px] font-black text-sky-600 uppercase tracking-[0.2em]">{(session.user as any).role || 'Customer'}</p>
                                </div>
                            </div>

                            <div className="mt-12 space-y-6">
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 bg-[#f8fafc] rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-sky-500 group-hover:bg-white group-hover:shadow-lg transition-all border border-transparent group-hover:border-slate-50">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Email</p>
                                        <p className="text-sm font-bold text-slate-900 truncate">{session.user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 bg-[#f8fafc] rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-sky-500 group-hover:bg-white group-hover:shadow-lg transition-all border border-transparent group-hover:border-slate-50">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Phone</p>
                                        <p className="text-sm font-bold text-slate-900">{(session.user as any).phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-12 py-4.5 bg-slate-900 text-white rounded-[20px] font-black italic text-xs uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-slate-100 hover:scale-[1.02] active:scale-95">
                                Edit Profile
                            </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-10 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl -mr-16 -mb-16"></div>
                            <p className="text-[10px] font-black opacity-50 uppercase tracking-[0.3em] mb-6">Total Deliveries</p>
                            <div className="flex items-end justify-between relative">
                                <h4 className="text-6xl font-black italic tracking-tighter group-hover:scale-110 transition-transform origin-left duration-500">{orders.length}</h4>
                                <div className="w-16 h-16 bg-white/5 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                                    <ShoppingBag className="w-8 h-8 text-sky-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Orders & Activity */}
                    <div className="lg:col-span-3 space-y-12">
                        <section>
                            <div className="flex items-center justify-between mb-10 px-4">
                                <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">Activity Log</h2>
                                <Link href="/medicines" className="text-xs font-black uppercase tracking-widest text-sky-600 hover:text-sky-700 transition-colors flex items-center gap-2 group">
                                    Shop More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {loading ? (
                                <div className="glass-card rounded-[48px] p-32 flex flex-col items-center justify-center text-center">
                                    <div className="relative mb-8">
                                        <div className="w-16 h-16 border-4 border-sky-100 rounded-full animate-spin border-t-sky-500"></div>
                                        <Package className="absolute inset-0 m-auto w-6 h-6 text-sky-500 animate-pulse" />
                                    </div>
                                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Retrieving secure history...</p>
                                </div>
                            ) : orders.length > 0 ? (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order.id} className="group glass-card rounded-[40px] p-8 hover:shadow-2xl hover:shadow-sky-100/50 transition-all duration-700 hover:-translate-y-2 border-white relative overflow-hidden">
                                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative z-10">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-20 h-20 bg-[#f8fafc] rounded-3xl flex items-center justify-center text-sky-600 border border-white shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                        <Package className="w-10 h-10" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex flex-wrap items-center gap-4">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shadow-sm">ID: #{order.id.slice(-8).toUpperCase()}</p>
                                                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-[0.15em] shadow-sm ${getStatusStyles(order.status)}`}>
                                                                {getStatusIcon(order.status)}
                                                                {order.status}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-sky-500/50" />
                                                                {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-emerald-500/50" />
                                                                <span className="truncate max-w-[200px]">{order.shippingAddress}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between xl:justify-end gap-12 pt-6 xl:pt-0 border-t xl:border-t-0 border-slate-100/50">
                                                    <div className="text-left xl:text-right">
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Total Amount</p>
                                                        <p className="text-4xl font-black text-slate-900 italic tracking-tighter"><span className="text-xl text-sky-600 font-bold">৳</span>{order.totalPrice.toFixed(2)}</p>
                                                    </div>
                                                    <Link href={`/dashboard/orders/${order.id}`} className="w-16 h-16 rounded-[24px] bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-200 hover:bg-sky-600 transition-all active:scale-95 group/btn">
                                                        <ChevronRight className="w-8 h-8 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Order Mini Details */}
                                            <div className="mt-8 pt-8 border-t border-slate-100/50 flex flex-wrap gap-4">
                                                {order.items.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all cursor-default group/item">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden border border-slate-50 flex-shrink-0">
                                                            <img src={item.medicine.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=100"} alt="" className="w-full h-full object-cover group-hover/item:scale-125 transition-transform duration-500" />
                                                        </div>
                                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.medicine.name} <span className="text-sky-500 ml-1">×{item.quantity}</span></p>
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="flex items-center px-4 py-2 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">+{order.items.length - 3} More items</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Subtle aesthetic background */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100/30 rounded-full blur-3xl -mr-32 -mt-32 -z-0"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card rounded-[60px] py-40 text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-sky-50/30 to-transparent -z-10"></div>
                                    <div className="w-32 h-32 bg-white shadow-2xl rounded-[40px] flex items-center justify-center mx-auto mb-10 border border-white">
                                        <ShoppingBag className="w-12 h-12 text-slate-200" />
                                    </div>
                                    <h3 className="text-4xl font-black text-slate-900 italic tracking-tight mb-4">No health orders yet</h3>
                                    <p className="text-slate-500 font-bold max-w-sm mx-auto mb-12 text-lg">Your purchase history will appear here once you start taking care of your health.</p>
                                    <Link href="/medicines" className="inline-flex px-12 py-5 bg-slate-900 text-white rounded-[24px] font-black italic tracking-widest uppercase text-xs hover:bg-sky-600 transition-all shadow-2xl shadow-slate-200 hover:scale-105 active:scale-95">
                                        Open Catalog
                                    </Link>
                                </div>
                            )}
                        </section>

                        <section className="glass-card rounded-[48px] p-12 border-white">
                            <h2 className="text-2xl font-black text-slate-900 italic mb-10 tracking-tight">Account Configuration</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <button className="flex items-center justify-between p-7 rounded-[32px] bg-[#f8fafc] hover:bg-white hover:shadow-2xl hover:shadow-sky-100 border border-transparent hover:border-slate-50 transition-all text-left group">
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Security Terminal</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Passwords & active sessions</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-sky-600 transition-all">
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                </button>
                                <button className="flex items-center justify-between p-7 rounded-[32px] bg-[#f8fafc] hover:bg-white hover:shadow-2xl hover:shadow-emerald-100 border border-transparent hover:border-slate-50 transition-all text-left group">
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Logistic Hub</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Shipping & delivery addresses</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-emerald-600 transition-all">
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
