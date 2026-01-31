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
    Pill,
    X,
    Filter,
    DollarSign,
    Box,
    User,
    ShoppingCart,
    MapPin
} from "lucide-react";
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

    if (authPending || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
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

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 animate-slide-up">
            <div className="max-w-[1400px] mx-auto px-4 md:px-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit border border-sky-100/50">
                            Enterprise Mode
                        </div>
                        <h1 className="text-5xl font-bold text-slate-900 tracking-tight">Seller <span className="text-sky-600">Dashboard</span></h1>
                        <p className="text-slate-500 font-medium">Coordinate your pharmaceutical inventory and track commercial performance.</p>
                    </div>

                    <div className="flex items-center p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
                        {[
                            { id: "overview", label: "Overview", icon: LayoutDashboard },
                            { id: "medicines", label: "Inventory", icon: Package },
                            { id: "orders", label: "Operations", icon: ShoppingBag }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {activeTab === "overview" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: "Gross Revenue", val: `৳${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "emerald" },
                                { label: "Total Orders", val: orders.length, icon: ShoppingBag, color: "sky" },
                                { label: "Catalog Size", val: `${medicines.length} Units`, icon: Package, color: "purple" },
                                { label: "Equity Value", val: `৳${(medicines.reduce((sum, m) => sum + (m.price * m.stock), 0)).toFixed(0)}`, icon: Box, color: "orange" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white rounded-[32px] p-8 border border-slate-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden shadow-sm">
                                    <div className={`w-12 h-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center text-${stat.color}-600 mb-6 border border-${stat.color}-100/50`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.val}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-10">
                            <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Sales</h3>
                                    <button onClick={() => setActiveTab("orders")} className="text-[10px] font-bold uppercase tracking-widest text-sky-600 hover:text-sky-700 transition-colors">View All</button>
                                </div>
                                <div className="space-y-4">
                                    {orders.slice(0, 4).map(order => (
                                        <div key={order.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                                                    <ShoppingBag className="w-5 h-5 text-sky-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">#{order.id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-bold text-slate-900 tracking-tight">৳{order.totalPrice.toFixed(2)}</p>
                                                <p className="text-[9px] text-sky-500 font-bold uppercase tracking-widest">{order.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {orders.length === 0 && (
                                        <div className="text-center py-20 opacity-40">
                                            <ShoppingBag className="w-10 h-10 mx-auto mb-4 text-slate-200" />
                                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No active orders</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Stock Alerts</h3>
                                    <button onClick={() => setActiveTab("medicines")} className="text-[10px] font-bold uppercase tracking-widest text-sky-600 hover:text-sky-700 transition-colors">Manage</button>
                                </div>
                                <div className="space-y-4">
                                    {medicines.slice(0, 4).map(med => (
                                        <div key={med.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-xl overflow-hidden border border-slate-100 group-hover:scale-110 transition-transform">
                                                    <img src={med.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=100"} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{med.name}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{med.category.name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-bold text-slate-900 tracking-tight">৳{med.price.toFixed(2)}</p>
                                                <p className={`text-[9px] font-bold uppercase tracking-widest ${med.stock < 10 ? 'text-red-500' : 'text-emerald-500'}`}>{med.stock} In Stock</p>
                                            </div>
                                        </div>
                                    ))}
                                    {medicines.length === 0 && (
                                        <div className="text-center py-20 opacity-40">
                                            <Package className="w-10 h-10 mx-auto mb-4 text-slate-200" />
                                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Inventory is empty</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "medicines" && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Master Inventory</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                        Live product database
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setEditingMedicine(null); setFormData({ name: "", description: "", price: "", stock: "", image: "", categoryId: "" }); setIsModalOpen(true); }}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-sky-600 transition-all shadow-lg active:scale-95 group"
                                >
                                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                    Add New Product
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b border-slate-50">
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Details</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="text-right px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operations</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {medicines.map(med => (
                                            <tr key={med.id} className="group hover:bg-slate-50 transition-colors">
                                                <td className="py-5 px-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 shrink-0">
                                                            <img src={med.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=100"} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="text-base font-bold text-slate-900 tracking-tight">{med.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {med.id.slice(-6).toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-4">
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-widest rounded-lg">{med.category.name}</span>
                                                </td>
                                                <td className="py-5 px-4">
                                                    <p className="text-base font-bold text-slate-900 tracking-tight">৳{med.price.toFixed(2)}</p>
                                                </td>
                                                <td className="py-5 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${med.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                                        <p className={`text-xs font-bold tracking-tight ${med.stock < 10 ? 'text-red-500' : 'text-slate-900'}`}>{med.stock} Units</p>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-4">
                                                    <button
                                                        onClick={() => toggleStatus(med)}
                                                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${med.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
                                                    >
                                                        {med.isActive ? 'Visible' : 'Hidden'}
                                                    </button>
                                                </td>
                                                <td className="py-5 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditModal(med)}
                                                            className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-sky-50 hover:text-sky-600 transition-all shadow-sm"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(med.id)}
                                                            className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
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
                                    <div className="py-20 text-center border-t border-slate-50 mt-4">
                                        <Package className="w-12 h-12 mx-auto mb-4 text-slate-100" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Inventory is empty</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm">
                            <div className="mb-12">
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Operational Logs</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                                    <ShoppingCart className="w-4 h-4" />
                                    Active order distribution
                                </p>
                            </div>

                            <div className="space-y-6">
                                {orders.map(order => (
                                    <div key={order.id} className="p-8 rounded-[32px] border border-slate-50 hover:bg-slate-50 transition-all group relative overflow-hidden">
                                        <div className="flex flex-col lg:flex-row justify-between gap-10">
                                            <div className="lg:w-1/4 space-y-6">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Order Tracking</p>
                                                    <p className="text-sm font-bold text-slate-900 font-mono tracking-tight bg-white px-3 py-1.5 rounded-lg border border-slate-100 w-fit">#{order.id.slice(-10).toUpperCase()}</p>
                                                </div>

                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status Control</p>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                        className={`w-full px-4 py-2.5 rounded-xl text-[10px] font-bold outline-none border transition-all appearance-none cursor-pointer uppercase tracking-widest ${order.status === "DELIVERED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                            order.status === "SHIPPED" ? "bg-sky-50 text-sky-600 border-sky-100" :
                                                                order.status === "CANCELLED" ? "bg-red-50 text-red-600 border-red-100" :
                                                                    "bg-amber-50 text-amber-600 border-amber-100"
                                                            }`}
                                                    >
                                                        <option value="PROCESSING">Processing</option>
                                                        <option value="SHIPPED">Shipped</option>
                                                        <option value="DELIVERED">Delivered</option>
                                                        <option value="CANCELLED">Cancelled</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-3 pt-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                                                            <User className="w-4 h-4 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-900">{order.customer.name}</p>
                                                            <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="lg:w-2/5 space-y-4">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Manifest</p>
                                                <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-3 max-h-[200px] overflow-y-auto">
                                                    {order.items.map(item => (
                                                        <div key={item.id} className="flex justify-between items-center text-xs">
                                                            <p className="font-bold text-slate-800">{item.medicine.name} <span className="text-slate-400 font-medium">x{item.quantity}</span></p>
                                                            <p className="font-bold text-slate-900">৳{(item.price * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center px-2 pt-2">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Revenue</p>
                                                    <p className="text-xl font-bold text-slate-900 tracking-tight">৳{order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}</p>
                                                </div>
                                            </div>

                                            <div className="lg:w-1/3">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Destination</p>
                                                <div className="bg-slate-900 p-6 rounded-2xl group/address transition-all relative overflow-hidden shadow-xl shadow-slate-200">
                                                    <div className="flex gap-4 relative z-10">
                                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                                                            <Truck className="w-5 h-5" />
                                                        </div>
                                                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                                            {order.shippingAddress}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {orders.length === 0 && (
                                    <div className="py-20 text-center">
                                        <Truck className="w-12 h-12 mx-auto mb-4 text-slate-100" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No active distribution</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for Add/Edit Medicine */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">{editingMedicine ? "Edit Product" : "Add New Product"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-8 space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-bold"
                                        placeholder="Enter medicine name..."
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-bold appearance-none cursor-pointer"
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

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    required
                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-bold min-h-[100px] resize-none"
                                    placeholder="Enter product description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price (৳)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-bold"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Stock</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-bold"
                                        placeholder="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-bold"
                                    placeholder="https://..."
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-[2] py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg flex items-center justify-center gap-2"
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
