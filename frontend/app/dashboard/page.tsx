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
    ShieldAlert,
    Settings,
    Bell,
    CreditCard,
    Heart,
    Star,
    TrendingUp,
    Shield,
    Sparkles,
    Eye,
    LogOut,
    Edit3
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
    const [activeTab, setActiveTab] = useState<"orders" | "settings">("orders");

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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl flex items-center justify-center animate-pulse shadow-lg shadow-sky-500/20">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Loader2 className="w-6 h-6 animate-spin text-sky-500 mx-auto" />
                        <p className="text-slate-400 text-sm font-medium">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "DELIVERED": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
            case "SHIPPED": return "bg-blue-500/10 text-blue-600 border-blue-200";
            case "PROCESSING": return "bg-amber-500/10 text-amber-600 border-amber-200";
            case "CANCELLED": return "bg-red-500/10 text-red-600 border-red-200";
            default: return "bg-slate-500/10 text-slate-600 border-slate-200";
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

    const pendingOrders = orders.filter(o => o.status === "PENDING").length;
    const deliveredOrders = orders.filter(o => o.status === "DELIVERED").length;
    const totalSpent = orders.reduce((acc, o) => acc + o.totalPrice, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-screen w-72 bg-white pt-24 pb-8 px-6 hidden lg:flex flex-col z-40 border-r border-slate-100">
                {/* Profile Section */}
                <div className="mb-8 pb-8 border-b border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 overflow-hidden">
                            {session.user.image ? (
                                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-8 h-8 text-white" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold text-slate-900 truncate">{session.user.name}</h2>
                            <span className="inline-flex items-center px-2.5 py-0.5 bg-sky-50 text-sky-600 text-[10px] font-bold uppercase tracking-widest rounded-md border border-sky-100">
                                {(session.user as any).role || 'Customer'}
                            </span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{session.user.email}</p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 flex-1">
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`w-full px-4 py-3.5 rounded-2xl text-left flex items-center gap-4 transition-all ${activeTab === "orders"
                            ? "bg-slate-900 text-white shadow-lg"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === "orders" ? "bg-white/20" : "bg-slate-100"}`}>
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <span className="font-semibold text-sm">My Orders</span>
                            <p className={`text-[10px] ${activeTab === "orders" ? "text-white/60" : "text-slate-400"}`}>{orders.length} total orders</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`w-full px-4 py-3.5 rounded-2xl text-left flex items-center gap-4 transition-all ${activeTab === "settings"
                            ? "bg-slate-900 text-white shadow-lg"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === "settings" ? "bg-white/20" : "bg-slate-100"}`}>
                            <Settings className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-sm">Account Settings</span>
                    </button>

                    {/* Role-specific links */}
                    {(session?.user as any).role === "SELLER" && (
                        <Link
                            href="/dashboard/seller"
                            className="w-full px-4 py-3.5 rounded-2xl text-left flex items-center gap-4 transition-all text-emerald-600 hover:bg-emerald-50"
                        >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100">
                                <LayoutDashboard className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-sm">Seller Dashboard</span>
                            <ChevronRight className="w-5 h-5 ml-auto" />
                        </Link>
                    )}

                    {(session?.user as any).role === "ADMIN" && (
                        <Link
                            href="/dashboard/admin"
                            className="w-full px-4 py-3.5 rounded-2xl text-left flex items-center gap-4 transition-all text-purple-600 hover:bg-purple-50"
                        >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-sm">Admin Panel</span>
                            <ChevronRight className="w-5 h-5 ml-auto" />
                        </Link>
                    )}
                </nav>

                {/* Quick Actions */}
                <div className="pt-6 border-t border-slate-100 space-y-2">
                    <Link href="/medicines" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-sky-600 transition-colors">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm font-medium">Browse Medicines</span>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:text-red-600 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-72 pt-24 pb-16 px-6 lg:px-12">
                {/* Mobile Header */}
                <div className="lg:hidden mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                            {session.user.image ? (
                                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-7 h-7 text-white" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{session.user.name}</h2>
                            <p className="text-sm text-slate-500">{session.user.email}</p>
                        </div>
                    </div>

                    {/* Mobile Nav */}
                    <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === "orders" ? "bg-slate-900 text-white" : "text-slate-500"}`}
                        >
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === "settings" ? "bg-slate-900 text-white" : "text-slate-500"}`}
                        >
                            Settings
                        </button>
                    </div>
                </div>

                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="px-4 py-1.5 bg-gradient-to-r from-sky-500/10 to-blue-500/10 rounded-full border border-sky-500/20">
                            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Personal Dashboard</span>
                        </div>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-2">
                        {activeTab === "orders" ? "My Orders" : "Account Settings"}
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {activeTab === "orders" ? "Track and manage your pharmaceutical orders" : "Manage your account preferences and security"}
                    </p>
                </div>

                {activeTab === "orders" && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                            {[
                                { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "from-sky-500 to-blue-600", bgColor: "sky" },
                                { label: "Total Spent", value: `৳${totalSpent.toFixed(0)}`, icon: CreditCard, color: "from-emerald-500 to-teal-600", bgColor: "emerald" },
                                { label: "Pending", value: pendingOrders, icon: Clock, color: "from-amber-500 to-orange-600", bgColor: "amber" },
                                { label: "Delivered", value: deliveredOrders, icon: CheckCircle2, color: "from-purple-500 to-violet-600", bgColor: "purple" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Orders List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Recent Orders</h3>
                                <Link href="/medicines" className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-2">
                                    Shop More <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {loading ? (
                                <div className="bg-white rounded-3xl p-16 border border-slate-100 text-center">
                                    <Loader2 className="w-10 h-10 text-sky-500 animate-spin mx-auto mb-4" />
                                    <p className="text-slate-400 font-medium">Loading your orders...</p>
                                </div>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <div key={order.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all group">
                                        <div className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                                {/* Order Info */}
                                                <div className="flex items-start gap-5">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                                                        <Package className="w-8 h-8 text-slate-300 group-hover:text-sky-500 transition-colors" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <p className="font-mono font-bold text-slate-900">#{order.id.slice(-8).toUpperCase()}</p>
                                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${getStatusStyles(order.status)}`}>
                                                                {getStatusIcon(order.status)}
                                                                {order.status}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                                            <span className="flex items-center gap-1.5">
                                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                                {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                                <span className="truncate max-w-[200px]">{order.shippingAddress}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Price & Action */}
                                                <div className="flex items-center gap-6 lg:gap-10">
                                                    <div className="text-right">
                                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                                        <p className="text-2xl font-bold text-slate-900">
                                                            <span className="text-lg text-sky-600">৳</span>{order.totalPrice.toFixed(0)}
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href={`/dashboard/orders/${order.id}`}
                                                        className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white hover:bg-sky-600 transition-all shadow-lg"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Order Items Preview */}
                                            <div className="mt-6 pt-6 border-t border-slate-50 flex flex-wrap gap-3">
                                                {order.items.slice(0, 4).map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl">
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-slate-100">
                                                            <img
                                                                src={item.medicine.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=100"}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-700 line-clamp-1">{item.medicine.name}</p>
                                                            <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.items.length > 4 && (
                                                    <div className="flex items-center px-4 py-2 bg-slate-50 rounded-xl">
                                                        <p className="text-sm font-semibold text-slate-500">+{order.items.length - 4} more</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-3xl p-16 border border-slate-100 text-center">
                                    <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <ShoppingBag className="w-12 h-12 text-slate-200" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No Orders Yet</h3>
                                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Start shopping and your order history will appear here.</p>
                                    <Link href="/medicines" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-sky-500/20 transition-all">
                                        <Sparkles className="w-5 h-5" />
                                        Browse Medicines
                                    </Link>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === "settings" && (
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                            <div className="p-8 border-b border-slate-100">
                                <h3 className="text-xl font-bold text-slate-900 mb-1">Profile Information</h3>
                                <p className="text-slate-500 text-sm">Manage your personal details</p>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden">
                                        {session.user.image ? (
                                            <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-12 h-12 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">{session.user.name}</h4>
                                        <p className="text-slate-500">{session.user.email}</p>
                                        <button className="mt-3 text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-2">
                                            <Edit3 className="w-4 h-4" />
                                            Change Photo
                                        </button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue={session.user.name || ""}
                                            className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 text-sm font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue={session.user.email || ""}
                                            className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 text-sm font-medium"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="Add phone number"
                                            defaultValue={(session.user as any).phone || ""}
                                            className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 text-sm font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Role</label>
                                        <input
                                            type="text"
                                            value={(session.user as any).role || "Customer"}
                                            className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 outline-none text-sm font-medium"
                                            disabled
                                        />
                                    </div>
                                </div>

                                <button className="mt-8 px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-sky-500/20 transition-all">
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-lg transition-all cursor-pointer group">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Shield className="w-7 h-7 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 mb-1">Security Settings</h4>
                                        <p className="text-sm text-slate-500">Password & authentication</p>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-lg transition-all cursor-pointer group">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <MapPin className="w-7 h-7 text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 mb-1">Saved Addresses</h4>
                                        <p className="text-sm text-slate-500">Manage delivery locations</p>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-lg transition-all cursor-pointer group">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Bell className="w-7 h-7 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 mb-1">Notifications</h4>
                                        <p className="text-sm text-slate-500">Email & push preferences</p>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-lg transition-all cursor-pointer group">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Heart className="w-7 h-7 text-sky-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 mb-1">Wishlist</h4>
                                        <p className="text-sm text-slate-500">Your saved items</p>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
