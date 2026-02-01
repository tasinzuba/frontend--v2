"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Plus,
    Search,
    Edit3,
    Trash2,
    ShoppingBag,
    Clock,
    CheckCircle2,
    Truck,
    AlertCircle,
    ChevronRight,
    Loader2,
    Calendar,
    ArrowUpRight,
    DollarSign,
    Box,
    User,
    LogOut,
    Menu,
    X,
    Filter,
    MoreVertical,
    Pill,
    ShoppingCart,
    MapPin,
    TrendingUp,
    Activity,
    Zap,
    BarChart3,
    Eye,
    AlertTriangle,
    Store,
    Settings
} from "lucide-react";
import ImageUpload from "@/app/components/ImageUpload";
import Link from "next/link";

interface Category {
    id: string;
    name: string;
}

interface Medicine {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    categoryId: string;
    isActive: boolean;
    category: { name: string };
}

interface Order {
    id: string;
    totalPrice: number;
    status: string;
    shippingAddress: string;
    createdAt: string;
    customer: { name: string; email: string };
    items: {
        id: string;
        medicine: { name: string; image: string };
        quantity: number;
        price: number;
    }[];
}

export default function SellerDashboard() {
    const { data: session, isPending: authPending } = authClient.useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"overview" | "medicines" | "orders">("overview");
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state for adding/editing medicine
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
        categoryId: ""
    });
    const [formLoading, setFormLoading] = useState(false);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    useEffect(() => {
        if (!authPending && (!session || (session.user as any).role !== "SELLER")) {
            router.push("/dashboard?message=Unauthorized");
        }
    }, [session, authPending, router]);

    const fetchData = async () => {
        if (!session) return;
        setLoading(true);
        try {
            const [medRes, orderRes, catRes] = await Promise.all([
                fetch(`${backendUrl}/api/seller/medicines`, { credentials: "include" }),
                fetch(`${backendUrl}/api/seller/orders`, { credentials: "include" }),
                fetch(`${backendUrl}/api/medicines/categories`, { credentials: "include" })
            ]);

            const [medJson, orderJson, catJson] = await Promise.all([
                medRes.json(),
                orderRes.json(),
                catRes.json()
            ]);

            if (medJson.success) setMedicines(medJson.data.medicines);
            if (orderJson.success) setOrders(orderJson.data.orders);
            if (catJson.success) setCategories(catJson.data);

        } catch (e) {
            console.error("Failed to fetch dashboard data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchData();
    }, [session]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const method = editingMedicine ? "PUT" : "POST";
            const url = editingMedicine
                ? `${backendUrl}/api/seller/medicines/${editingMedicine.id}`
                : `${backendUrl}/api/seller/medicines`;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock)
                }),
                credentials: "include"
            });

            const json = await res.json();
            if (json.success) {
                setIsModalOpen(false);
                setEditingMedicine(null);
                setFormData({ name: "", description: "", price: "", stock: "", image: "", categoryId: "" });
                fetchData();
            } else {
                alert(json.error || "Operation failed");
            }
        } catch (e) {
            console.error("Form submission failed", e);
            alert("Something went wrong");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this medicine?")) return;
        try {
            const res = await fetch(`${backendUrl}/api/seller/medicines/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            const json = await res.json();
            if (json.success) {
                setMedicines(medicines.filter(m => m.id !== id));
            }
        } catch (e) {
            console.error("Delete failed", e);
        }
    };

    const toggleStatus = async (med: any) => {
        try {
            const res = await fetch(`${backendUrl}/api/seller/medicines/${med.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !med.isActive }),
                credentials: "include"
            });
            const json = await res.json();
            if (json.success) {
                setMedicines(medicines.map(m => m.id === med.id ? { ...m, isActive: !med.isActive } : m));
            }
        } catch (e) {
            console.error("Toggle status failed", e);
        }
    };

    const handleStatusUpdate = async (orderId: string, status: string) => {
        try {
            const res = await fetch(`${backendUrl}/api/seller/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
                credentials: "include"
            });
            const json = await res.json();
            if (json.success) {
                setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
            }
        } catch (e) {
            console.error("Status update failed", e);
        }
    };

    const openEditModal = (med: Medicine) => {
        setEditingMedicine(med);
        setFormData({
            name: med.name,
            description: med.description,
            price: med.price.toString(),
            stock: med.stock.toString(),
            image: med.image,
            categoryId: med.categoryId
        });
        setIsModalOpen(true);
    };

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                    router.refresh();
                }
            }
        });
    };

    if (authPending || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center animate-pulse">
                        <Store className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mx-auto" />
                        <p className="text-slate-400 text-sm font-medium">Loading seller portal...</p>
                    </div>
                </div>
            </div>
        );
    }

    const totalRevenue = orders.reduce((acc, order) => {
        if (order.status !== "CANCELLED") {
            const sellerTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return acc + sellerTotal;
        }
        return acc;
    }, 0);

    const pendingOrders = orders.filter(o => o.status === "PENDING" || o.status === "PROCESSING").length;
    const shippedOrders = orders.filter(o => o.status === "SHIPPED").length;
    const deliveredOrders = orders.filter(o => o.status === "DELIVERED").length;
    const lowStockItems = medicines.filter(m => m.stock < 10).length;
    const totalInventoryValue = medicines.reduce((sum, m) => sum + (m.price * m.stock), 0);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 pt-24 pb-8 px-6 hidden lg:flex flex-col z-40">
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg tracking-tight">Seller Hub</h2>
                            <p className="text-emerald-300/60 text-[10px] font-bold uppercase tracking-widest">Commerce Portal</p>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-8 border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center overflow-hidden">
                            {session.user.image ? (
                                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-6 h-6 text-white" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">{session.user.name}</p>
                            <p className="text-emerald-300/60 text-xs truncate">{session.user.email}</p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    {[
                        { id: "overview", label: "Dashboard", icon: LayoutDashboard, badge: null },
                        { id: "medicines", label: "Inventory", icon: Package, badge: medicines.length },
                        { id: "orders", label: "Orders", icon: ShoppingBag, badge: orders.length }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full px-4 py-3.5 rounded-2xl text-left flex items-center gap-4 transition-all duration-300 group ${activeTab === tab.id
                                ? "bg-white/20 text-white"
                                : "text-emerald-200/60 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTab === tab.id
                                ? "bg-gradient-to-br from-emerald-400 to-teal-400 shadow-lg shadow-emerald-500/30"
                                : "bg-white/10 group-hover:bg-white/20"
                                }`}>
                                <tab.icon className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-sm">{tab.label}</span>
                            {tab.badge !== null && (
                                <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-lg ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-white/10 text-emerald-300/60"
                                    }`}>{tab.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Quick Actions */}
                <div className="space-y-2 pt-6 border-t border-white/10">
                    <Link href="/dashboard" className="w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 text-emerald-200/60 hover:text-white hover:bg-white/5 transition-all">
                        <User className="w-5 h-5" />
                        <span className="text-sm font-medium">My Account</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-72 pt-24 pb-16 px-6 lg:px-12">
                {/* Mobile Nav */}
                <div className="lg:hidden mb-8 overflow-x-auto pb-2">
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-slate-100 w-max">
                        {[
                            { id: "overview", label: "Dashboard", icon: LayoutDashboard },
                            { id: "medicines", label: "Inventory", icon: Package },
                            { id: "orders", label: "Orders", icon: ShoppingBag }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
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
                                <div className="px-4 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full border border-emerald-500/20">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Seller Portal</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-500">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
                                </div>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-2">
                                {activeTab === "overview" && "Dashboard Overview"}
                                {activeTab === "medicines" && "Product Inventory"}
                                {activeTab === "orders" && "Order Management"}
                            </h1>
                            <p className="text-slate-500 font-medium">
                                {activeTab === "overview" && "Monitor your sales performance and inventory health"}
                                {activeTab === "medicines" && "Manage your product catalog and stock levels"}
                                {activeTab === "orders" && "Track and fulfill customer orders"}
                            </p>
                        </div>
                        {activeTab === "medicines" && (
                            <button
                                onClick={() => { setEditingMedicine(null); setFormData({ name: "", description: "", price: "", stock: "", image: "", categoryId: "" }); setIsModalOpen(true); }}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Add Product
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <div className="text-center space-y-4">
                            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
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
                                        { label: "Total Revenue", val: `৳${totalRevenue.toFixed(0)}`, icon: DollarSign, color: "from-emerald-500 to-teal-600", trend: "+12.5%", trendUp: true },
                                        { label: "Total Orders", val: orders.length, icon: ShoppingBag, color: "from-sky-500 to-blue-600", trend: `${pendingOrders} pending`, trendUp: false },
                                        { label: "Total Products", val: medicines.length, icon: Package, color: "from-purple-500 to-violet-600", trend: `${lowStockItems} low stock`, trendUp: false },
                                        { label: "Inventory Value", val: `৳${totalInventoryValue.toFixed(0)}`, icon: Box, color: "from-orange-500 to-amber-600", trend: "Total worth", trendUp: false }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                                    <stat.icon className="w-7 h-7" />
                                                </div>
                                                <div className={`flex items-center gap-1 text-[11px] font-bold ${stat.trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-50'} px-2.5 py-1 rounded-lg`}>
                                                    {stat.trendUp && <ArrowUpRight className="w-3 h-3" />}
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
                                        { label: "Pending", val: pendingOrders, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                                        { label: "Shipped", val: shippedOrders, icon: Truck, color: "text-sky-500", bg: "bg-sky-50" },
                                        { label: "Delivered", val: deliveredOrders, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
                                        { label: "Low Stock", val: lowStockItems, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" }
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

                                {/* Recent Orders & Low Stock */}
                                <div className="grid lg:grid-cols-2 gap-6">
                                    {/* Recent Orders */}
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Orders</h3>
                                                <p className="text-slate-400 text-xs font-medium mt-1">Latest transactions</p>
                                            </div>
                                            <button onClick={() => setActiveTab("orders")} className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700">View All</button>
                                        </div>
                                        <div className="space-y-4">
                                            {orders.slice(0, 4).map(order => (
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
                                                        <p className="text-sm font-bold text-slate-900">৳{order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(0)}</p>
                                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${getStatusColor(order.status)}`}>{order.status}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {orders.length === 0 && (
                                                <div className="text-center py-12">
                                                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                                                    <p className="text-sm text-slate-400">No orders yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Low Stock Alert */}
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Low Stock Alert</h3>
                                                <p className="text-slate-400 text-xs font-medium mt-1">Products needing restock</p>
                                            </div>
                                            <button onClick={() => setActiveTab("medicines")} className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700">Manage</button>
                                        </div>
                                        <div className="space-y-4">
                                            {medicines.filter(m => m.stock < 20).slice(0, 4).map(med => (
                                                <div key={med.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 overflow-hidden">
                                                            <img src={med.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=100"} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{med.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-medium">{med.category.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-sm font-bold ${med.stock < 10 ? 'text-red-600' : 'text-amber-600'}`}>{med.stock} left</p>
                                                        <p className="text-[10px] text-slate-400 font-medium">৳{med.price.toFixed(0)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {medicines.filter(m => m.stock < 20).length === 0 && (
                                                <div className="text-center py-12">
                                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-200" />
                                                    <p className="text-sm text-slate-400">All products well stocked</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "medicines" && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-8 border-b border-slate-100">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Product Catalog</h2>
                                                <p className="text-slate-400 text-sm mt-1">Manage your medicine inventory</p>
                                            </div>
                                            <div className="relative w-full lg:w-80">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input type="text" placeholder="Search products..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Product</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Category</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Price</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Stock</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Status</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {medicines.map(med => (
                                                    <tr key={med.id} className="group hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-100 overflow-hidden">
                                                                    <img src={med.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=100"} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-slate-900">{med.name}</p>
                                                                    <p className="text-xs text-slate-400">ID: {med.id.slice(-6).toUpperCase()}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-emerald-100">
                                                                {med.category.name}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className="font-bold text-slate-900 text-lg">৳{med.price.toFixed(0)}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-2 h-2 rounded-full ${med.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                                                <span className={`font-semibold ${med.stock < 10 ? 'text-red-600' : 'text-slate-900'}`}>{med.stock} units</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <button
                                                                onClick={() => toggleStatus(med)}
                                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${med.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400'
                                                                    }`}
                                                            >
                                                                {med.isActive ? 'Active' : 'Hidden'}
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => openEditModal(med)}
                                                                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                                                                >
                                                                    <Edit3 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(med.id)}
                                                                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {medicines.length === 0 && (
                                            <div className="py-20 text-center">
                                                <Package className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                                                <p className="text-slate-400 font-medium">No products in inventory</p>
                                                <button
                                                    onClick={() => { setEditingMedicine(null); setFormData({ name: "", description: "", price: "", stock: "", image: "", categoryId: "" }); setIsModalOpen(true); }}
                                                    className="mt-4 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
                                                >
                                                    Add First Product
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
                                {orders.map(order => (
                                    <div key={order.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all">
                                        <div className="p-6 lg:p-8">
                                            <div className="flex flex-col lg:flex-row justify-between gap-8">
                                                {/* Order Info */}
                                                <div className="lg:w-1/4 space-y-6">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Order ID</p>
                                                        <p className="text-sm font-bold text-slate-900 font-mono bg-slate-50 px-3 py-2 rounded-lg w-fit">#{order.id.slice(-10).toUpperCase()}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Update Status</p>
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold outline-none border transition-all cursor-pointer ${getStatusColor(order.status)}`}
                                                        >
                                                            <option value="PENDING">Pending</option>
                                                            <option value="PROCESSING">Processing</option>
                                                            <option value="SHIPPED">Shipped</option>
                                                            <option value="DELIVERED">Delivered</option>
                                                            <option value="CANCELLED">Cancelled</option>
                                                        </select>
                                                    </div>

                                                    <div className="flex items-center gap-3 pt-2">
                                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                                            <User className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{order.customer.name}</p>
                                                            <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Items */}
                                                <div className="lg:w-2/5 space-y-4">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Items</p>
                                                    <div className="bg-slate-50 p-4 rounded-2xl space-y-3 max-h-[180px] overflow-y-auto">
                                                        {order.items.map(item => (
                                                            <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded-xl">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                                                                        <img src={item.medicine.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=100"} alt="" className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-semibold text-slate-900">{item.medicine.name}</p>
                                                                        <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                                                                    </div>
                                                                </div>
                                                                <p className="font-bold text-slate-900">৳{(item.price * item.quantity).toFixed(0)}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-between items-center pt-2 px-1">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Earnings</p>
                                                        <p className="text-xl font-bold text-emerald-600">৳{order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(0)}</p>
                                                    </div>
                                                </div>

                                                {/* Shipping */}
                                                <div className="lg:w-1/3">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Shipping Address</p>
                                                    <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-5 rounded-2xl text-white">
                                                        <div className="flex gap-3">
                                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                                                <MapPin className="w-5 h-5" />
                                                            </div>
                                                            <p className="text-sm leading-relaxed opacity-90">{order.shippingAddress}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {orders.length === 0 && (
                                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-20 text-center">
                                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Orders Yet</h3>
                                        <p className="text-slate-400">Orders will appear here when customers purchase your products</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal for Add/Edit Medicine */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{editingMedicine ? "Edit Product" : "Add New Product"}</h2>
                                <p className="text-slate-400 text-sm mt-0.5">Fill in the product details below</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl bg-white text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium transition-all"
                                        placeholder="e.g. Paracetamol 500mg"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Category</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium transition-all"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <textarea
                                    required
                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium min-h-[100px] resize-none transition-all"
                                    placeholder="Enter product description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Price (৳)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium transition-all"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Stock Quantity</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-medium transition-all"
                                        placeholder="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Product Image</label>
                                <ImageUpload
                                    value={formData.image}
                                    onChange={(url) => setFormData({ ...formData, image: url as string })}
                                    maxFiles={1}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-[2] py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingMedicine ? "Save Changes" : "Create Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
