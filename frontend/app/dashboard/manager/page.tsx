"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    DollarSign,
    Loader2,
    Search,
    Clock,
    CheckCircle2,
    Truck,
    ArrowUpRight,
    TrendingUp,
    Activity,
    Zap,
    Shield,
    BarChart3,
    FileText,
    Settings,
    User,
    Phone,
    MapPin,
    Save,
    RefreshCw,
    ChevronDown,
    AlertCircle,
    Eye
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

interface ManagerStats {
    totalOrders: number;
    pendingOrders: number;
    revenue: number;
    shippedOrders: number;
    processingOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
}

interface ManagerOrder {
    id: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    customer: { name: string; email: string };
}

interface ManagerMedicine {
    id: string;
    name: string;
    price: number;
    stock: number;
    seller: { name: string };
    category: { name: string };
}

type TabType = "overview" | "orders" | "inventory" | "reports" | "settings";

const STATUS_FLOW = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

const PIE_COLORS = ["#f59e0b", "#0ea5e9", "#6366f1", "#10b981", "#ef4444"];

const MONTHLY_ORDER_DATA = [
    { month: "Jan", orders: 45, revenue: 12400 },
    { month: "Feb", orders: 52, revenue: 15200 },
    { month: "Mar", orders: 61, revenue: 18700 },
    { month: "Apr", orders: 48, revenue: 14100 },
    { month: "May", orders: 73, revenue: 22300 },
    { month: "Jun", orders: 68, revenue: 19800 },
    { month: "Jul", orders: 82, revenue: 25600 },
    { month: "Aug", orders: 91, revenue: 28900 },
    { month: "Sep", orders: 77, revenue: 23400 },
    { month: "Oct", orders: 85, revenue: 26100 },
    { month: "Nov", orders: 94, revenue: 30200 },
    { month: "Dec", orders: 102, revenue: 34500 },
];

const TOP_CATEGORIES = [
    { name: "Antibiotics", sales: 340 },
    { name: "Pain Relief", sales: 280 },
    { name: "Vitamins", sales: 220 },
    { name: "Cardiac", sales: 180 },
    { name: "Dermatology", sales: 150 },
];

export default function ManagerDashboard() {
    const { data: session, isPending: authPending } = authClient.useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [stats, setStats] = useState<ManagerStats | null>(null);
    const [allOrders, setAllOrders] = useState<ManagerOrder[]>([]);
    const [allMedicines, setAllMedicines] = useState<ManagerMedicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [orderSearchQuery, setOrderSearchQuery] = useState("");
    const [orderFilterStatus, setOrderFilterStatus] = useState<string>("ALL");
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    // Settings state
    const [profilePhone, setProfilePhone] = useState("");
    const [profileAddress, setProfileAddress] = useState("");
    const [savingProfile, setSavingProfile] = useState(false);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    useEffect(() => {
        if (!authPending && (!session || (session.user as any).role !== "MANAGER")) {
            router.push("/dashboard?message=Unauthorized");
        }
    }, [session, authPending, router]);

    const fetchData = async () => {
        if (!session) return;
        setLoading(true);
        try {
            const [statsRes, ordersRes, medsRes] = await Promise.all([
                fetch(`${backendUrl}/api/manager/stats`, { credentials: "include" }),
                fetch(`${backendUrl}/api/manager/orders`, { credentials: "include" }),
                fetch(`${backendUrl}/api/manager/medicines`, { credentials: "include" })
            ]);

            const [statsJson, ordersJson, medsJson] = await Promise.all([
                statsRes.json(),
                ordersRes.json(),
                medsRes.json()
            ]);

            if (statsJson.success) setStats(statsJson.data);
            if (ordersJson.success) setAllOrders(ordersJson.data.orders || ordersJson.data);
            if (medsJson.success) setAllMedicines(medsJson.data.medicines || medsJson.data);
        } catch (e) {
            console.error("Failed to fetch manager data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchData();
    }, [session]);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdatingOrderId(orderId);
        try {
            const res = await fetch(`${backendUrl}/api/manager/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
                credentials: "include"
            });
            const json = await res.json();
            if (json.success) {
                setAllOrders(prev =>
                    prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
                );
            }
        } catch (e) {
            console.error("Order status update failed", e);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const getNextStatus = (current: string): string | null => {
        const idx = STATUS_FLOW.indexOf(current as any);
        if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null;
        return STATUS_FLOW[idx + 1];
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
            case "SHIPPED": return "bg-indigo-500/10 text-indigo-600 border-indigo-200";
            case "PROCESSING": return "bg-amber-500/10 text-amber-600 border-amber-200";
            case "CANCELLED": return "bg-red-500/10 text-red-600 border-red-200";
            case "PENDING": return "bg-slate-500/10 text-slate-600 border-slate-200";
            default: return "bg-slate-100 text-slate-600 border-slate-200";
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case "DELIVERED": return "bg-emerald-500";
            case "SHIPPED": return "bg-indigo-500";
            case "PROCESSING": return "bg-amber-500";
            case "CANCELLED": return "bg-red-500";
            case "PENDING": return "bg-slate-400";
            default: return "bg-slate-300";
        }
    };

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        try {
            // Simulated save - connect to your actual profile endpoint
            await new Promise(r => setTimeout(r, 800));
        } finally {
            setSavingProfile(false);
        }
    };

    // Derived data
    const pendingOrders = allOrders.filter(o => o.status === "PENDING").length;
    const processingOrders = allOrders.filter(o => o.status === "PROCESSING").length;
    const shippedOrders = allOrders.filter(o => o.status === "SHIPPED").length;
    const deliveredOrders = allOrders.filter(o => o.status === "DELIVERED").length;
    const cancelledOrders = allOrders.filter(o => o.status === "CANCELLED").length;
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    const orderStatusPieData = [
        { name: "Pending", value: pendingOrders },
        { name: "Processing", value: processingOrders },
        { name: "Shipped", value: shippedOrders },
        { name: "Delivered", value: deliveredOrders },
        { name: "Cancelled", value: cancelledOrders },
    ].filter(d => d.value > 0);

    const filteredOrders = allOrders.filter(o => {
        const matchesSearch =
            o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
            o.customer.name.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
            o.customer.email.toLowerCase().includes(orderSearchQuery.toLowerCase());
        const matchesFilter = orderFilterStatus === "ALL" || o.status === orderFilterStatus;
        return matchesSearch && matchesFilter;
    });

    const filteredMedicines = allMedicines.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (authPending || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-sky-500 to-sky-700 rounded-3xl flex items-center justify-center animate-pulse">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Loader2 className="w-6 h-6 animate-spin text-sky-400 mx-auto" />
                        <p className="text-slate-400 text-sm font-medium">Authenticating...</p>
                    </div>
                </div>
            </div>
        );
    }

    const sidebarTabs = [
        { id: "overview" as TabType, label: "Dashboard", icon: LayoutDashboard, badge: null },
        { id: "orders" as TabType, label: "Order Management", icon: ShoppingBag, badge: allOrders.length },
        { id: "inventory" as TabType, label: "Inventory View", icon: Package, badge: allMedicines.length },
        { id: "reports" as TabType, label: "Reports", icon: BarChart3, badge: null },
        { id: "settings" as TabType, label: "Settings", icon: Settings, badge: null },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-screen w-72 bg-slate-900 pt-24 pb-8 px-6 hidden lg:flex flex-col z-40">
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-700 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg tracking-tight">Manager Hub</h2>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Order Center</p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    {sidebarTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full px-4 py-3.5 rounded-2xl text-left flex items-center gap-4 transition-all duration-300 group ${activeTab === tab.id
                                ? "bg-gradient-to-r from-sky-500/20 to-sky-600/10 text-white"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTab === tab.id
                                ? "bg-gradient-to-br from-sky-500 to-sky-700 shadow-lg shadow-sky-500/20"
                                : "bg-slate-800 group-hover:bg-slate-700"
                                }`}>
                                <tab.icon className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-sm">{tab.label}</span>
                            {tab.badge !== null && (
                                <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-lg ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                                    }`}>{tab.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t border-slate-800">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 to-sky-700/10 border border-sky-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sky-400 text-xs font-bold uppercase tracking-wider">System Active</span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed">All services operational. Last sync: just now</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-72 pt-24 pb-16 px-6 lg:px-12">
                {/* Mobile Nav */}
                <div className="lg:hidden mb-8 overflow-x-auto pb-2">
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-slate-100 w-max">
                        {sidebarTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Header */}
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="px-4 py-1.5 bg-gradient-to-r from-sky-500/10 to-sky-700/10 rounded-full border border-sky-500/20">
                                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Manager Access</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sky-500">
                                    <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Live</span>
                                </div>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-2">
                                {activeTab === "overview" && "Order Command Center"}
                                {activeTab === "orders" && "Order Management"}
                                {activeTab === "inventory" && "Inventory Overview"}
                                {activeTab === "reports" && "Analytics & Reports"}
                                {activeTab === "settings" && "Account Settings"}
                            </h1>
                            <p className="text-slate-500 font-medium">
                                {activeTab === "overview" && "Real-time oversight of all order operations"}
                                {activeTab === "orders" && "Manage, track, and update order fulfillment status"}
                                {activeTab === "inventory" && "Browse complete medicine inventory across all sellers"}
                                {activeTab === "reports" && "Revenue analytics and order performance insights"}
                                {activeTab === "settings" && "Manage your profile and account preferences"}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => fetchData()}
                                className="px-5 py-3 bg-white rounded-2xl border border-slate-200 text-slate-600 font-semibold text-sm hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </button>
                            <button className="px-5 py-3 bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-sky-500/20 transition-all flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Export Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <div className="text-center space-y-4">
                            <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto" />
                            <p className="text-slate-400 font-medium">Loading dashboard data...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* ===== OVERVIEW TAB ===== */}
                        {activeTab === "overview" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Stat Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                    {[
                                        { label: "Total Orders", val: stats?.totalOrders ?? allOrders.length, icon: ShoppingBag, color: "from-sky-500 to-sky-600", trend: "+18%", trendUp: true },
                                        { label: "Pending Orders", val: stats?.pendingOrders ?? pendingOrders, icon: Clock, color: "from-amber-500 to-amber-600", trend: `${pendingOrders} active`, trendUp: false },
                                        { label: "Total Revenue", val: `৳${(stats?.revenue ?? totalRevenue).toLocaleString()}`, icon: DollarSign, color: "from-emerald-500 to-emerald-600", trend: "+12.5%", trendUp: true },
                                        { label: "Shipped Orders", val: stats?.shippedOrders ?? shippedOrders, icon: Truck, color: "from-indigo-500 to-indigo-600", trend: "On track", trendUp: true }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity rounded-full -mr-10 -mt-10"></div>
                                            <div className="flex items-start justify-between mb-6">
                                                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                                    <stat.icon className="w-7 h-7" />
                                                </div>
                                                <div className={`flex items-center gap-1 text-[11px] font-bold ${stat.trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-50'} px-2.5 py-1 rounded-lg`}>
                                                    {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                                                    {stat.trend}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.val}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Charts Row */}
                                <div className="grid lg:grid-cols-2 gap-6">
                                    {/* Monthly Order Trends - Bar Chart */}
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Monthly Order Trends</h3>
                                                <p className="text-slate-400 text-xs font-medium mt-1">Orders over the past 12 months</p>
                                            </div>
                                            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
                                                <BarChart3 className="w-5 h-5 text-sky-500" />
                                            </div>
                                        </div>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={MONTHLY_ORDER_DATA}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: "#0f172a",
                                                            border: "none",
                                                            borderRadius: "12px",
                                                            color: "#fff",
                                                            fontSize: "12px",
                                                        }}
                                                    />
                                                    <Bar dataKey="orders" fill="#0284c7" radius={[8, 8, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Order Status Distribution - Pie Chart */}
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Status Distribution</h3>
                                                <p className="text-slate-400 text-xs font-medium mt-1">Current order status breakdown</p>
                                            </div>
                                            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-sky-500" />
                                            </div>
                                        </div>
                                        <div className="h-64">
                                            {orderStatusPieData.length > 0 ? (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={orderStatusPieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={55}
                                                            outerRadius={90}
                                                            paddingAngle={4}
                                                            dataKey="value"
                                                        >
                                                            {orderStatusPieData.map((_, index) => (
                                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: "#0f172a",
                                                                border: "none",
                                                                borderRadius: "12px",
                                                                color: "#fff",
                                                                fontSize: "12px",
                                                            }}
                                                        />
                                                        <Legend
                                                            verticalAlign="bottom"
                                                            iconType="circle"
                                                            iconSize={8}
                                                            formatter={(value: string) => (
                                                                <span className="text-xs font-semibold text-slate-600">{value}</span>
                                                            )}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-slate-400">
                                                    <p className="text-sm">No order data available</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Orders Table */}
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Orders</h3>
                                            <p className="text-slate-400 text-xs font-medium mt-1">Latest incoming orders</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab("orders")}
                                            className="text-[10px] font-bold text-sky-600 uppercase tracking-widest hover:text-sky-700"
                                        >
                                            View All
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Order ID</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Customer</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Amount</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Status</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {allOrders.slice(0, 6).map(order => (
                                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-5">
                                                            <p className="font-mono font-bold text-slate-900">#{order.id.slice(-8).toUpperCase()}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className="font-semibold text-slate-900">{order.customer.name}</p>
                                                            <p className="text-xs text-slate-400">{order.customer.email}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className="font-bold text-slate-900">৳{order.totalPrice.toFixed(0)}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg border ${getStatusColor(order.status)}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== ORDERS TAB ===== */}
                        {activeTab === "orders" && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-8 border-b border-slate-100">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">All Orders</h2>
                                                <p className="text-slate-400 text-sm mt-1">Manage and update order fulfillment status</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-full lg:w-72">
                                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search orders..."
                                                        value={orderSearchQuery}
                                                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-sky-500/20 transition-all"
                                                    />
                                                </div>
                                                <select
                                                    value={orderFilterStatus}
                                                    onChange={(e) => setOrderFilterStatus(e.target.value)}
                                                    className="px-4 py-3 bg-slate-50 rounded-xl border-none outline-none text-sm font-semibold text-slate-600 focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
                                                >
                                                    <option value="ALL">All Status</option>
                                                    <option value="PENDING">Pending</option>
                                                    <option value="PROCESSING">Processing</option>
                                                    <option value="SHIPPED">Shipped</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                    <option value="CANCELLED">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Order ID</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Customer</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Amount</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Status</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Date</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {filteredOrders.map(order => {
                                                    const nextStatus = getNextStatus(order.status);
                                                    return (
                                                        <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-5">
                                                                <p className="font-mono font-bold text-slate-900">#{order.id.slice(-8).toUpperCase()}</p>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 text-sm">
                                                                        {order.customer.name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-slate-900">{order.customer.name}</p>
                                                                        <p className="text-xs text-slate-400">{order.customer.email}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <p className="font-bold text-slate-900 text-lg">৳{order.totalPrice.toFixed(0)}</p>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`w-2 h-2 rounded-full ${getStatusDot(order.status)}`}></span>
                                                                    <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg border ${getStatusColor(order.status)}`}>
                                                                        {order.status}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                            </td>
                                                            <td className="px-6 py-5 text-right">
                                                                {nextStatus ? (
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(order.id, nextStatus)}
                                                                        disabled={updatingOrderId === order.id}
                                                                        className="px-4 py-2 rounded-xl bg-sky-50 text-sky-600 text-xs font-bold hover:bg-sky-100 transition-all flex items-center gap-2 ml-auto disabled:opacity-50"
                                                                    >
                                                                        {updatingOrderId === order.id ? (
                                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                                        ) : (
                                                                            <ArrowUpRight className="w-4 h-4" />
                                                                        )}
                                                                        Move to {nextStatus}
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-xs font-semibold text-slate-400">
                                                                        {order.status === "DELIVERED" ? "Completed" : "No action"}
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                        {filteredOrders.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                                <AlertCircle className="w-12 h-12 mb-4 text-slate-300" />
                                                <p className="text-lg font-semibold text-slate-500">No orders found</p>
                                                <p className="text-sm">Try adjusting your search or filter criteria</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== INVENTORY TAB ===== */}
                        {activeTab === "inventory" && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-8 border-b border-slate-100">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Medicine Inventory</h2>
                                                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-slate-100 text-slate-500 border border-slate-200">
                                                        <Eye className="w-3 h-3 inline mr-1" />
                                                        Read Only
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 text-sm mt-1">Browse all products across sellers</p>
                                            </div>
                                            <div className="relative w-full lg:w-80">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search medicines, categories, sellers..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-sky-500/20 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Product</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Seller</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Category</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Price</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {filteredMedicines.map(med => (
                                                    <tr key={med.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-100 flex items-center justify-center">
                                                                    <Package className="w-5 h-5 text-sky-500" />
                                                                </div>
                                                                <p className="font-semibold text-slate-900">{med.name}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className="text-sm text-slate-600 font-medium">{med.seller.name}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                                                                {med.category.name}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className="font-bold text-slate-900">৳{med.price.toFixed(0)}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-2.5 h-2.5 rounded-full ${med.stock < 10 ? 'bg-red-500' : med.stock < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                                                <span className={`text-sm font-bold ${med.stock < 10 ? 'text-red-600' : 'text-slate-900'}`}>
                                                                    {med.stock}
                                                                </span>
                                                                {med.stock < 10 && (
                                                                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Low</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {filteredMedicines.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                                <Package className="w-12 h-12 mb-4 text-slate-300" />
                                                <p className="text-lg font-semibold text-slate-500">No medicines found</p>
                                                <p className="text-sm">Try a different search term</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== REPORTS TAB ===== */}
                        {activeTab === "reports" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                                {/* Order Status Summary Cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                    {[
                                        { label: "Pending", val: pendingOrders, icon: Clock, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
                                        { label: "Processing", val: processingOrders, icon: RefreshCw, color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-100" },
                                        { label: "Shipped", val: shippedOrders, icon: Truck, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" },
                                        { label: "Delivered", val: deliveredOrders, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
                                        { label: "Cancelled", val: cancelledOrders, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" }
                                    ].map((item, i) => (
                                        <div key={i} className={`${item.bg} rounded-2xl p-5 border ${item.border}`}>
                                            <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center ${item.color} shadow-sm mb-3`}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <p className="text-2xl font-bold text-slate-900">{item.val}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Revenue Bar Chart */}
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Revenue Overview</h3>
                                            <p className="text-slate-400 text-xs font-medium mt-1">Monthly revenue trend analysis</p>
                                        </div>
                                        <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                                            <span className="text-sm font-bold text-emerald-600">
                                                ৳{MONTHLY_ORDER_DATA.reduce((s, d) => s + d.revenue, 0).toLocaleString()} Total
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={MONTHLY_ORDER_DATA}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "#0f172a",
                                                        border: "none",
                                                        borderRadius: "12px",
                                                        color: "#fff",
                                                        fontSize: "12px",
                                                    }}
                                                    formatter={(value: number) => [`৳${value.toLocaleString()}`, "Revenue"]}
                                                />
                                                <Bar dataKey="revenue" fill="#0284c7" radius={[8, 8, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Top Selling Categories */}
                                <div className="grid lg:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Top Selling Categories</h3>
                                                <p className="text-slate-400 text-xs font-medium mt-1">By units sold</p>
                                            </div>
                                            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
                                                <TrendingUp className="w-5 h-5 text-sky-500" />
                                            </div>
                                        </div>
                                        <div className="space-y-5">
                                            {TOP_CATEGORIES.map((cat, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm font-bold text-slate-500 w-6">#{i + 1}</span>
                                                            <p className="text-sm font-semibold text-slate-700">{cat.name}</p>
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-900">{cat.sales} units</p>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-sky-500 to-sky-600 rounded-full transition-all duration-1000"
                                                            style={{ width: `${(cat.sales / TOP_CATEGORIES[0].sales) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Status Pie for Reports */}
                                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-sky-700/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
                                        <div className="relative z-10">
                                            <h3 className="text-xl font-bold tracking-tight mb-2">Order Performance</h3>
                                            <p className="text-slate-400 text-sm mb-6">Quick snapshot of fulfillment metrics</p>

                                            <div className="space-y-4 mb-6">
                                                {[
                                                    { label: "Fulfillment Rate", value: allOrders.length > 0 ? `${((deliveredOrders / allOrders.length) * 100).toFixed(1)}%` : "0%", color: "text-emerald-400" },
                                                    { label: "Active Pipeline", value: `${pendingOrders + processingOrders + shippedOrders}`, color: "text-sky-400" },
                                                    { label: "Avg Order Value", value: allOrders.length > 0 ? `৳${(totalRevenue / allOrders.length).toFixed(0)}` : "৳0", color: "text-amber-400" },
                                                    { label: "Total Revenue", value: `৳${totalRevenue.toLocaleString()}`, color: "text-white" },
                                                ].map((metric, i) => (
                                                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                                                        <span className="text-slate-400 text-sm">{metric.label}</span>
                                                        <span className={`font-bold text-lg ${metric.color}`}>{metric.value}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setActiveTab("orders")}
                                                className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-sm transition-all border border-white/10"
                                            >
                                                View All Orders
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== SETTINGS TAB ===== */}
                        {activeTab === "settings" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                                {/* Profile Info */}
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-8 border-b border-slate-100">
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Profile Information</h2>
                                        <p className="text-slate-400 text-sm mt-1">Your account details and preferences</p>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex flex-col lg:flex-row gap-8">
                                            {/* Avatar & Basic Info */}
                                            <div className="flex flex-col items-center lg:items-start gap-6 lg:w-1/3">
                                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-sky-500/20">
                                                    {session.user?.name?.charAt(0) || "M"}
                                                </div>
                                                <div className="text-center lg:text-left">
                                                    <h3 className="text-xl font-bold text-slate-900">{session.user?.name}</h3>
                                                    <p className="text-slate-400 text-sm">{session.user?.email}</p>
                                                    <span className="inline-block mt-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                                                        Manager
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Editable Fields */}
                                            <div className="flex-1 space-y-6">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                                                        <div className="px-4 py-3.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 border border-slate-100">
                                                            {session.user?.name}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                                                        <div className="px-4 py-3.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 border border-slate-100">
                                                            {session.user?.email}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Role</label>
                                                        <div className="px-4 py-3.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 border border-slate-100">
                                                            Manager
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                                            <Phone className="w-3 h-3 inline mr-1" />
                                                            Phone Number
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            placeholder="Enter phone number"
                                                            value={profilePhone}
                                                            onChange={(e) => setProfilePhone(e.target.value)}
                                                            className="w-full px-4 py-3.5 bg-white rounded-xl text-sm font-medium text-slate-700 border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-300 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                                        <MapPin className="w-3 h-3 inline mr-1" />
                                                        Address
                                                    </label>
                                                    <textarea
                                                        placeholder="Enter your address"
                                                        value={profileAddress}
                                                        onChange={(e) => setProfileAddress(e.target.value)}
                                                        rows={3}
                                                        className="w-full px-4 py-3.5 bg-white rounded-xl text-sm font-medium text-slate-700 border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-300 transition-all resize-none"
                                                    />
                                                </div>
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={handleSaveProfile}
                                                        disabled={savingProfile}
                                                        className="px-8 py-3.5 bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-sky-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                                                    >
                                                        {savingProfile ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Save className="w-4 h-4" />
                                                        )}
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
