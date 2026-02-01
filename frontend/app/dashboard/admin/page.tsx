"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Package,
    DollarSign,
    Loader2,
    Search,
    UserX,
    UserCheck,
    Plus,
    Edit3,
    Trash2,
    X,
    Filter,
    BarChart3,
    ShieldAlert,
    LayoutGrid,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    TrendingUp,
    Globe,
    Zap,
    Shield,
    Clock,
    CheckCircle2,
    Truck,
    AlertTriangle,
    Eye,
    MoreHorizontal
} from "lucide-react";
import Link from "next/link";

interface Stats {
    users: number;
    customers: number;
    sellers: number;
    medicines: number;
    orders: number;
    revenue: number;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
}

interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
    _count?: { medicines: number };
}

interface AdminOrder {
    id: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    customer: { name: string; email: string };
}

interface AdminMedicine {
    id: string;
    name: string;
    price: number;
    stock: number;
    seller: { name: string };
    category: { name: string };
}

export default function AdminDashboard() {
    const { data: session, isPending: authPending } = authClient.useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"overview" | "users" | "categories" | "orders" | "medicines">("overview");
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
    const [allMedicines, setAllMedicines] = useState<AdminMedicine[]>([]);
    const [loading, setLoading] = useState(true);

    // Category Modal State
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [catFormData, setCatFormData] = useState({ name: "", description: "", image: "" });
    const [catFormLoading, setCatFormLoading] = useState(false);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    useEffect(() => {
        if (!authPending && (!session || (session.user as any).role !== "ADMIN")) {
            router.push("/dashboard?message=Unauthorized");
        }
    }, [session, authPending, router]);

    const fetchData = async () => {
        if (!session) return;
        setLoading(true);
        try {
            const [statsRes, usersRes, catRes, ordersRes, medsRes] = await Promise.all([
                fetch(`${backendUrl}/api/admin/stats`, { credentials: "include" }),
                fetch(`${backendUrl}/api/admin/users`, { credentials: "include" }),
                fetch(`${backendUrl}/api/medicines/categories`, { credentials: "include" }),
                fetch(`${backendUrl}/api/admin/orders`, { credentials: "include" }),
                fetch(`${backendUrl}/api/admin/medicines`, { credentials: "include" })
            ]);

            const [statsJson, usersJson, catJson, ordersJson, medsJson] = await Promise.all([
                statsRes.json(),
                usersRes.json(),
                catRes.json(),
                ordersRes.json(),
                medsRes.json()
            ]);

            if (statsJson.success) setStats(statsJson.data);
            if (usersJson.success) setUsers(usersJson.data.users);
            if (catJson.success) setCategories(catJson.data);
            if (ordersJson.success) setAllOrders(ordersJson.data.orders);
            if (medsJson.success) setAllMedicines(medsJson.data.medicines);

        } catch (e) {
            console.error("Failed to fetch admin data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchData();
    }, [session]);

    const handleUserStatusUpdate = async (userId: string, status: string) => {
        try {
            const res = await fetch(`${backendUrl}/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
                credentials: "include"
            });
            const json = await res.json();
            if (json.success) {
                setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
            }
        } catch (e) {
            console.error("User status update failed", e);
        }
    };

    const handleCatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCatFormLoading(true);
        try {
            const method = editingCategory ? "PUT" : "POST";
            const url = editingCategory
                ? `${backendUrl}/api/admin/categories/${editingCategory.id}`
                : `${backendUrl}/api/admin/categories`;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(catFormData),
                credentials: "include"
            });

            const json = await res.json();
            if (json.success) {
                setIsCatModalOpen(false);
                setEditingCategory(null);
                setCatFormData({ name: "", description: "", image: "" });
                fetchData();
            }
        } catch (e) {
            console.error("Category operation failed", e);
        } finally {
            setCatFormLoading(false);
        }
    };

    const handleCatDelete = async (id: string) => {
        if (!confirm("Are you sure? This will delete all medicines in this category.")) return;
        try {
            const res = await fetch(`${backendUrl}/api/admin/categories/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            const json = await res.json();
            if (json.success) {
                setCategories(categories.filter(c => c.id !== id));
            }
        } catch (e) {
            console.error("Category delete failed", e);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
            case "SHIPPED": return "bg-blue-500/10 text-blue-600 border-blue-200";
            case "PROCESSING": return "bg-amber-500/10 text-amber-600 border-amber-200";
            case "CANCELLED": return "bg-red-500/10 text-red-600 border-red-200";
            case "PENDING": return "bg-slate-500/10 text-slate-600 border-slate-200";
            default: return "bg-slate-100 text-slate-600 border-slate-200";
        }
    };

    if (authPending || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-sky-500 to-emerald-500 rounded-3xl flex items-center justify-center animate-pulse">
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

    const pendingOrders = allOrders.filter(o => o.status === "PENDING").length;
    const processingOrders = allOrders.filter(o => o.status === "PROCESSING").length;
    const deliveredOrders = allOrders.filter(o => o.status === "DELIVERED").length;
    const lowStockMedicines = allMedicines.filter(m => m.stock < 10).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-screen w-72 bg-slate-900 pt-24 pb-8 px-6 hidden lg:flex flex-col z-40">
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg tracking-tight">Admin Hub</h2>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Control Center</p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    {[
                        { id: "overview", label: "Dashboard", icon: LayoutDashboard, badge: null },
                        { id: "users", label: "User Registry", icon: Users, badge: users.length },
                        { id: "categories", label: "Categories", icon: LayoutGrid, badge: categories.length },
                        { id: "orders", label: "Order Logs", icon: ShoppingBag, badge: allOrders.length },
                        { id: "medicines", label: "Inventory", icon: Package, badge: allMedicines.length }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full px-4 py-3.5 rounded-2xl text-left flex items-center gap-4 transition-all duration-300 group ${activeTab === tab.id
                                ? "bg-gradient-to-r from-sky-500/20 to-emerald-500/10 text-white"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTab === tab.id
                                ? "bg-gradient-to-br from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/20"
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
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 to-emerald-500/10 border border-sky-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">System Active</span>
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
                        {[
                            { id: "overview", label: "Dashboard", icon: LayoutDashboard },
                            { id: "users", label: "Users", icon: Users },
                            { id: "categories", label: "Categories", icon: LayoutGrid },
                            { id: "orders", label: "Orders", icon: ShoppingBag },
                            { id: "medicines", label: "Inventory", icon: Package }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
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
                                <div className="px-4 py-1.5 bg-gradient-to-r from-sky-500/10 to-emerald-500/10 rounded-full border border-sky-500/20">
                                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Enterprise Access</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-500">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Live</span>
                                </div>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-2">
                                {activeTab === "overview" && "Command Center"}
                                {activeTab === "users" && "User Management"}
                                {activeTab === "categories" && "Category Taxonomy"}
                                {activeTab === "orders" && "Order Fulfillment"}
                                {activeTab === "medicines" && "Asset Inventory"}
                            </h1>
                            <p className="text-slate-500 font-medium">
                                {activeTab === "overview" && "Real-time oversight of your pharmaceutical ecosystem"}
                                {activeTab === "users" && "Manage identities and access control across the platform"}
                                {activeTab === "categories" && "Organize and structure your product classifications"}
                                {activeTab === "orders" && "Track and monitor all fulfillment operations"}
                                {activeTab === "medicines" && "Complete inventory visibility and stock management"}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-5 py-3 bg-white rounded-2xl border border-slate-200 text-slate-600 font-semibold text-sm hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm">
                                <Clock className="w-4 h-4" />
                                Last 30 Days
                            </button>
                            <button className="px-5 py-3 bg-gradient-to-r from-sky-600 to-emerald-600 text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-sky-500/20 transition-all flex items-center gap-2">
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
                        {activeTab === "overview" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                    {[
                                        { label: "Total Revenue", val: `৳${stats?.revenue.toFixed(0)}`, icon: DollarSign, color: "from-emerald-500 to-teal-600", bgColor: "emerald", trend: "+12.5%", trendUp: true },
                                        { label: "Active Users", val: stats?.users, icon: Users, color: "from-sky-500 to-blue-600", bgColor: "sky", trend: "+8 new", trendUp: true },
                                        { label: "Total Products", val: stats?.medicines, icon: Package, color: "from-purple-500 to-violet-600", bgColor: "purple", trend: "Stable", trendUp: false },
                                        { label: "Total Orders", val: stats?.orders, icon: ShoppingBag, color: "from-orange-500 to-amber-600", bgColor: "orange", trend: "+18%", trendUp: true }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity rounded-full -mr-10 -mt-10" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>
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

                                {/* Quick Stats Row */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: "Pending Orders", val: pendingOrders, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                                        { label: "Processing", val: processingOrders, icon: Truck, color: "text-sky-500", bg: "bg-sky-50" },
                                        { label: "Delivered", val: deliveredOrders, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
                                        { label: "Low Stock Items", val: lowStockMedicines, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" }
                                    ].map((item, i) => (
                                        <div key={i} className={`${item.bg} rounded-2xl p-5 flex items-center gap-4 border border-white`}>
                                            <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center ${item.color} shadow-sm`}>
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-slate-900">{item.val}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Analytics Row */}
                                <div className="grid lg:grid-cols-3 gap-6">
                                    {/* User Distribution */}
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">User Distribution</h3>
                                                <p className="text-slate-400 text-xs font-medium mt-1">By role type</p>
                                            </div>
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                                <BarChart3 className="w-5 h-5 text-slate-400" />
                                            </div>
                                        </div>
                                        <div className="space-y-5">
                                            {[
                                                { label: "Customers", count: stats?.customers || 0, total: stats?.users || 1, color: "bg-sky-500" },
                                                { label: "Sellers", count: stats?.sellers || 0, total: stats?.users || 1, color: "bg-emerald-500" },
                                                { label: "Admins", count: (stats?.users || 0) - (stats?.customers || 0) - (stats?.sellers || 0), total: stats?.users || 1, color: "bg-slate-900" }
                                            ].map((node, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-sm font-semibold text-slate-700">{node.label}</p>
                                                        <p className="text-sm font-bold text-slate-900">{node.count}</p>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className={`h-full ${node.color} rounded-full transition-all duration-1000`} style={{ width: `${Math.max((node.count / node.total) * 100, 5)}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Orders */}
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Orders</h3>
                                                <p className="text-slate-400 text-xs font-medium mt-1">Latest transactions</p>
                                            </div>
                                            <button onClick={() => setActiveTab("orders")} className="text-[10px] font-bold text-sky-600 uppercase tracking-widest hover:text-sky-700">View All</button>
                                        </div>
                                        <div className="space-y-4">
                                            {allOrders.slice(0, 4).map(order => (
                                                <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100">
                                                            <ShoppingBag className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">#{order.id.slice(-6).toUpperCase()}</p>
                                                            <p className="text-[10px] text-slate-400 font-medium">{order.customer.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-slate-900">৳{order.totalPrice.toFixed(0)}</p>
                                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${getStatusColor(order.status)}`}>{order.status}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Security Panel */}
                                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
                                        <div className="relative z-10">
                                            <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-sky-500/20">
                                                <ShieldAlert className="w-7 h-7 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold tracking-tight mb-3">Security Status</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed mb-8">All systems protected. Real-time monitoring active across all nodes.</p>
                                            <div className="space-y-3 mb-8">
                                                <div className="flex items-center gap-3 text-sm">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-slate-300">SSL Encryption Active</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-slate-300">Database Secured</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-slate-300">Auth Protocols Verified</span>
                                                </div>
                                            </div>
                                            <button onClick={() => setActiveTab("users")} className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-sm transition-all border border-white/10">
                                                Audit Users
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "users" && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-8 border-b border-slate-100">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">User Registry</h2>
                                                <p className="text-slate-400 text-sm mt-1">Manage all platform identities</p>
                                            </div>
                                            <div className="relative w-full lg:w-80">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input type="text" placeholder="Search users..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-sky-500/20 transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">User</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Role</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Status</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Joined</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {users.map(u => (
                                                    <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 text-lg group-hover:border-sky-200 transition-colors">
                                                                    {u.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-slate-900">{u.name}</p>
                                                                    <p className="text-xs text-slate-400">{u.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg ${u.role === "ADMIN" ? 'bg-slate-900 text-white' : u.role === "SELLER" ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-sky-50 text-sky-600 border border-sky-100'}`}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-2 h-2 rounded-full ${u.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"}`}></span>
                                                                <span className={`text-sm font-medium ${u.status === "ACTIVE" ? "text-emerald-600" : "text-red-600"}`}>{u.status}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className="text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</p>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            {u.role !== "ADMIN" && (
                                                                <div className="flex items-center justify-end gap-2">
                                                                    {u.status === "ACTIVE" ? (
                                                                        <button
                                                                            onClick={() => handleUserStatusUpdate(u.id, "BANNED")}
                                                                            className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-2"
                                                                        >
                                                                            <UserX className="w-4 h-4" />
                                                                            Suspend
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleUserStatusUpdate(u.id, "ACTIVE")}
                                                                            className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center gap-2"
                                                                        >
                                                                            <UserCheck className="w-4 h-4" />
                                                                            Activate
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "categories" && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Product Categories</h2>
                                        <p className="text-slate-400 text-sm mt-1">Organize your pharmaceutical taxonomy</p>
                                    </div>
                                    <button
                                        onClick={() => { setEditingCategory(null); setCatFormData({ name: "", description: "", image: "" }); setIsCatModalOpen(true); }}
                                        className="px-6 py-3 bg-gradient-to-r from-sky-600 to-emerald-600 text-white rounded-2xl font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-sky-500/20 transition-all"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add Category
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {categories.map(cat => (
                                        <div key={cat.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group">
                                            <div className="relative h-40 overflow-hidden">
                                                <img src={cat.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400"} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <h4 className="text-xl font-bold text-white">{cat.name}</h4>
                                                    <p className="text-white/80 text-sm">{cat._count?.medicines || 0} products</p>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">{cat.description || "No description available"}</p>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => { setEditingCategory(cat); setCatFormData({ name: cat.name, description: cat.description || "", image: cat.image || "" }); setIsCatModalOpen(true); }}
                                                        className="flex-1 py-3 bg-slate-50 rounded-xl text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleCatDelete(cat.id)}
                                                        className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-8 border-b border-slate-100">
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Order Management</h2>
                                        <p className="text-slate-400 text-sm mt-1">Complete fulfillment history</p>
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
                                                {allOrders.map(order => (
                                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-5">
                                                            <p className="font-mono font-bold text-slate-900">#{order.id.slice(-8).toUpperCase()}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className="font-semibold text-slate-900">{order.customer.name}</p>
                                                            <p className="text-xs text-slate-400">{order.customer.email}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className="font-bold text-slate-900 text-lg">৳{order.totalPrice.toFixed(0)}</p>
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

                        {activeTab === "medicines" && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-8 border-b border-slate-100">
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Global Inventory</h2>
                                        <p className="text-slate-400 text-sm mt-1">All products across sellers</p>
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
                                                {allMedicines.map(med => (
                                                    <tr key={med.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-5">
                                                            <p className="font-semibold text-slate-900">{med.name}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className="text-sm text-slate-600">{med.seller.name}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="px-3 py-1.5 bg-sky-50 text-sky-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-sky-100">
                                                                {med.category.name}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className="font-bold text-slate-900">৳{med.price.toFixed(0)}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-2 h-2 rounded-full ${med.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                                                <span className={`font-semibold ${med.stock < 10 ? 'text-red-600' : 'text-slate-900'}`}>{med.stock} units</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Category Modal */}
            {isCatModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{editingCategory ? "Edit Category" : "Create Category"}</h2>
                                <p className="text-slate-400 text-sm mt-0.5">Define product classification</p>
                            </div>
                            <button onClick={() => setIsCatModalOpen(false)} className="w-10 h-10 rounded-xl bg-white text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCatSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-medium transition-all"
                                    placeholder="e.g. Pain Relief"
                                    value={catFormData.name}
                                    onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <textarea
                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-medium min-h-[100px] resize-none transition-all"
                                    placeholder="Brief description of the category..."
                                    value={catFormData.description}
                                    onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Image URL</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-medium transition-all"
                                    placeholder="https://..."
                                    value={catFormData.image}
                                    onChange={(e) => setCatFormData({ ...catFormData, image: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCatModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={catFormLoading}
                                    className="flex-[2] py-4 bg-gradient-to-r from-sky-600 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {catFormLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {editingCategory ? "Save Changes" : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
