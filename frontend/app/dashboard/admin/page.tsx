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
    ArrowDownRight
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

export default function AdminDashboard() {
    const { data: session, isPending: authPending } = authClient.useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"overview" | "users" | "categories">("overview");
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
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
            const [statsRes, usersRes, catRes] = await Promise.all([
                fetch(`${backendUrl}/api/admin/stats`, { credentials: "include" }),
                fetch(`${backendUrl}/api/admin/users`, { credentials: "include" }),
                fetch(`${backendUrl}/api/medicines/categories`, { credentials: "include" })
            ]);

            const [statsJson, usersJson, catJson] = await Promise.all([
                statsRes.json(),
                usersRes.json(),
                catRes.json()
            ]);

            if (statsJson.success) setStats(statsJson.data);
            if (usersJson.success) setUsers(usersJson.data.users);
            if (catJson.success) setCategories(catJson.data);

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

    if (authPending || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 animate-slide-up">
            <div className="max-w-[1400px] mx-auto px-4 md:px-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit border border-sky-100/50">
                            Governance Terminal
                        </div>
                        <h1 className="text-5xl font-bold text-slate-900 tracking-tight">Admin <span className="text-sky-600">Control</span></h1>
                        <p className="text-slate-500 font-medium">Global oversight of the MediStore pharmaceutical ecosystem.</p>
                    </div>

                    <div className="flex items-center p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
                        {[
                            { id: "overview", label: "Intelligence", icon: BarChart3 },
                            { id: "users", label: "Registry", icon: Users },
                            { id: "categories", label: "Taxonomy", icon: LayoutGrid }
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
                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
                    </div>
                ) : (
                    <>
                        {activeTab === "overview" && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {[
                                        { label: "Global Revenue", val: `৳${stats?.revenue.toFixed(2)}`, icon: DollarSign, color: "emerald", trend: "+12.5%" },
                                        { label: "Active Nodes", val: stats?.users, icon: Users, color: "sky", trend: "+4 nodes" },
                                        { label: "Total Asset Class", val: stats?.medicines, icon: Package, color: "purple", trend: "0.0%" },
                                        { label: "Fulfilled Logs", val: stats?.orders, icon: ShoppingBag, color: "orange", trend: "+18%" }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white rounded-[40px] p-8 border border-slate-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden shadow-sm">
                                            <div className={`w-12 h-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center text-${stat.color}-600 mb-6 border border-${stat.color}-100/50`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.val}</h3>
                                                </div>
                                                <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'} px-2 py-1 bg-${stat.color}-50/50 rounded-lg`}>
                                                    {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                    {stat.trend}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Deep Dive Row */}
                                <div className="grid lg:grid-cols-2 gap-10">
                                    <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm relative overflow-hidden">
                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-8">Node Distribution</h3>
                                            <div className="space-y-6">
                                                {[
                                                    { label: "Healthcare Consumers", count: stats?.customers || 0, total: stats?.users || 1, color: "bg-sky-500" },
                                                    { label: "Certified Pharmacists", count: stats?.sellers || 0, total: stats?.users || 1, color: "bg-emerald-500" },
                                                    { label: "System Administrators", count: (stats?.users || 0) - (stats?.customers || 0) - (stats?.sellers || 0), total: stats?.users || 1, color: "bg-slate-900" }
                                                ].map((node, i) => (
                                                    <div key={i} className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-sm font-bold text-slate-800">{node.label}</p>
                                                            <p className="text-xs font-bold text-slate-400">{node.count} Nodes</p>
                                                        </div>
                                                        <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                                                            <div className={`h-full ${node.color} rounded-full transition-all duration-1000`} style={{ width: `${(node.count / node.total) * 100}%` }}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <BarChart3 className="absolute -bottom-10 -right-10 w-48 h-48 text-slate-50 -z-0" />
                                    </div>

                                    <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                                        <div className="relative z-10">
                                            <ShieldAlert className="w-12 h-12 text-sky-400 mb-8" />
                                            <h3 className="text-3xl font-bold tracking-tight mb-4">Security Protocol</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">All system activities are logged and encrypted. Admins have power to revoke access to compromised accounts instantly.</p>
                                            <button onClick={() => setActiveTab("users")} className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-sky-400 hover:text-white transition-all">
                                                Audit Registry
                                            </button>
                                        </div>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "users" && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                                        <div className="space-y-1">
                                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Active Registry</h2>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                                Global identity database
                                            </p>
                                        </div>
                                        <div className="relative flex-1 max-w-md">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input type="text" placeholder="Search identities..." className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl border-none outline-none text-sm font-bold focus:ring-2 focus:ring-sky-500/20 transition-all" />
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left border-b border-slate-50">
                                                    <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-16">Profile</th>
                                                    <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identify</th>
                                                    <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol</th>
                                                    <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                                    <th className="text-right px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operations</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {users.map(u => (
                                                    <tr key={u.id} className="group hover:bg-slate-50 transition-colors">
                                                        <td className="py-5 px-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 font-bold text-lg group-hover:bg-white transition-colors">
                                                                {u.name.charAt(0)}
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-4">
                                                            <div>
                                                                <p className="text-base font-bold text-slate-900 tracking-tight">{u.name}</p>
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{u.email}</p>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-4">
                                                            <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg ${u.role === "ADMIN" ? 'bg-slate-900 text-white' : u.role === "SELLER" ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${u.status === "ACTIVE" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"}`}></div>
                                                                <p className={`text-[10px] font-bold uppercase tracking-widest ${u.status === "ACTIVE" ? "text-emerald-500" : "text-red-500"}`}>{u.status}</p>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-4 text-right">
                                                            {u.role !== "ADMIN" && (
                                                                <div className="flex items-center justify-end gap-2">
                                                                    {u.status === "ACTIVE" ? (
                                                                        <button
                                                                            onClick={() => handleUserStatusUpdate(u.id, "BANNED")}
                                                                            title="Ban User"
                                                                            className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                                                                        >
                                                                            <UserX className="w-4 h-4" />
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleUserStatusUpdate(u.id, "ACTIVE")}
                                                                            title="Unban User"
                                                                            className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm"
                                                                        >
                                                                            <UserCheck className="w-4 h-4" />
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
                                <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                                        <div className="space-y-1">
                                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Department Taxonomy</h2>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                                <LayoutGrid className="w-4 h-4 text-emerald-500" />
                                                Classification management
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => { setEditingCategory(null); setCatFormData({ name: "", description: "", image: "" }); setIsCatModalOpen(true); }}
                                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-sky-600 transition-all shadow-lg active:scale-95 group"
                                        >
                                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                            Define Category
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {categories.map(cat => (
                                            <div key={cat.id} className="p-6 rounded-[32px] border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                                                <div className="flex items-center gap-6 mb-8">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white shadow-sm flex-shrink-0">
                                                        <img src={cat.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200"} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-slate-900 tracking-tight">{cat.name}</h4>
                                                        <p className="text-[10px] text-sky-600 font-bold uppercase tracking-widest">{cat._count?.medicines || 0} Assets</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8 line-clamp-2">{cat.description}</p>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => { setEditingCategory(cat); setCatFormData({ name: cat.name, description: cat.description || "", image: cat.image || "" }); setIsCatModalOpen(true); }}
                                                        className="flex-1 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-all"
                                                    >
                                                        Refine
                                                    </button>
                                                    <button
                                                        onClick={() => handleCatDelete(cat.id)}
                                                        className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Category Modal */}
            {isCatModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">{editingCategory ? "Refine Category" : "Define Category"}</h2>
                            <button onClick={() => setIsCatModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleCatSubmit} className="p-8 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Classification Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-bold"
                                    placeholder="Enter category name..."
                                    value={catFormData.name}
                                    onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Metadata Description</label>
                                <textarea
                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-bold min-h-[100px] resize-none"
                                    placeholder="Enter description..."
                                    value={catFormData.description}
                                    onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Image Reference URL</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-bold"
                                    placeholder="https://..."
                                    value={catFormData.image}
                                    onChange={(e) => setCatFormData({ ...catFormData, image: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCatModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    disabled={catFormLoading}
                                    className="flex-[2] py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    {catFormLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingCategory ? "Commit Sync" : "Deploy Class"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
