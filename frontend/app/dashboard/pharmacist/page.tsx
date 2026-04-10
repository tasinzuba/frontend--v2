"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ShieldCheck,
    MessageSquare,
    FileBarChart,
    Settings,
    Search,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Loader2,
    ArrowUpRight,
    User,
    LogOut,
    Pill,
    Star,
    Package,
    Eye,
    BarChart3
} from "lucide-react";
import Link from "next/link";
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

interface Medicine {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    isActive: boolean;
    category: { name: string };
    seller?: { name: string };
}

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    customer: { name: string };
    medicine: { name: string };
}

interface Stats {
    totalMedicines: number;
    verifiedMedicines: number;
    unverifiedMedicines: number;
    lowStockMedicines: number;
    categoryDistribution: { name: string; count: number }[];
}

export default function PharmacistDashboard() {
    const { data: session, isPending: authPending } = authClient.useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"overview" | "verification" | "reviews" | "reports" | "settings">("overview");
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [togglingId, setTogglingId] = useState<string | null>(null);

    // Settings form state
    const [profileForm, setProfileForm] = useState({ name: "", email: "" });
    const [profileSaving, setProfileSaving] = useState(false);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    useEffect(() => {
        if (!authPending && (!session || (session.user as any).role !== "PHARMACIST")) {
            router.push("/dashboard?message=Unauthorized");
        }
    }, [session, authPending, router]);

    useEffect(() => {
        if (session) {
            setProfileForm({
                name: session.user.name || "",
                email: session.user.email || ""
            });
        }
    }, [session]);

    const fetchData = async () => {
        if (!session) return;
        setLoading(true);
        try {
            const [statsRes, medRes, revRes] = await Promise.all([
                fetch(`${backendUrl}/api/pharmacist/stats`, { credentials: "include" }),
                fetch(`${backendUrl}/api/pharmacist/medicines`, { credentials: "include" }),
                fetch(`${backendUrl}/api/pharmacist/reviews`, { credentials: "include" })
            ]);

            const [statsJson, medJson, revJson] = await Promise.all([
                statsRes.json(),
                medRes.json(),
                revRes.json()
            ]);

            if (statsJson.success) setStats(statsJson.data);
            if (medJson.success) setMedicines(medJson.data.medicines || medJson.data);
            if (revJson.success) setReviews(revJson.data.reviews || revJson.data);
        } catch (e) {
            console.error("Failed to fetch dashboard data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchData();
    }, [session]);

    const handleToggleVerify = async (med: Medicine) => {
        setTogglingId(med.id);
        try {
            const res = await fetch(`${backendUrl}/api/pharmacist/medicines/${med.id}/verify`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !med.isActive }),
                credentials: "include"
            });
            const json = await res.json();
            if (json.success) {
                setMedicines(medicines.map(m => m.id === med.id ? { ...m, isActive: !med.isActive } : m));
            }
        } catch (e) {
            console.error("Toggle verify failed", e);
        } finally {
            setTogglingId(null);
        }
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

    const handleProfileSave = async () => {
        setProfileSaving(true);
        try {
            await authClient.updateUser({
                name: profileForm.name
            });
        } catch (e) {
            console.error("Profile update failed", e);
        } finally {
            setProfileSaving(false);
        }
    };

    if (authPending || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-900 via-sky-800 to-sky-900">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-sky-500 to-sky-600 rounded-3xl flex items-center justify-center animate-pulse">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Loader2 className="w-6 h-6 animate-spin text-sky-400 mx-auto" />
                        <p className="text-slate-400 text-sm font-medium">Loading pharmacist portal...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Computed values
    const totalMedicines = stats?.totalMedicines ?? medicines.length;
    const verifiedCount = stats?.verifiedMedicines ?? medicines.filter(m => m.isActive).length;
    const unverifiedCount = stats?.unverifiedMedicines ?? medicines.filter(m => !m.isActive).length;
    const lowStockCount = stats?.lowStockMedicines ?? medicines.filter(m => m.stock < 10).length;

    const categoryDistribution = stats?.categoryDistribution ?? (() => {
        const map: Record<string, number> = {};
        medicines.forEach(m => {
            const cat = m.category?.name || "Uncategorized";
            map[cat] = (map[cat] || 0) + 1;
        });
        return Object.entries(map).map(([name, count]) => ({ name, count }));
    })();

    const pieData = [
        { name: "Verified", value: verifiedCount },
        { name: "Unverified", value: unverifiedCount }
    ];
    const PIE_COLORS = ["#0284c7", "#f97316"];

    const filteredMedicines = medicines.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return "text-emerald-500";
        if (rating >= 3) return "text-amber-500";
        return "text-red-500";
    };

    const getRatingBg = (rating: number) => {
        if (rating >= 4) return "bg-emerald-50 border-emerald-200";
        if (rating >= 3) return "bg-amber-50 border-amber-200";
        return "bg-red-50 border-red-200";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-sky-900 via-sky-800 to-sky-900 pt-24 pb-8 px-6 hidden lg:flex flex-col z-40">
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/30">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg tracking-tight">Pharma Hub</h2>
                            <p className="text-sky-300/60 text-[10px] font-bold uppercase tracking-widest">Pharmacist Portal</p>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-8 border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center overflow-hidden">
                            {session.user.image ? (
                                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-6 h-6 text-white" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">{session.user.name}</p>
                            <p className="text-sky-300/60 text-xs truncate">{session.user.email}</p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    {[
                        { id: "overview", label: "Dashboard", icon: LayoutDashboard, badge: null },
                        { id: "verification", label: "Verification", icon: ShieldCheck, badge: medicines.length },
                        { id: "reviews", label: "Reviews Monitor", icon: MessageSquare, badge: reviews.length },
                        { id: "reports", label: "Reports", icon: FileBarChart, badge: null },
                        { id: "settings", label: "Settings", icon: Settings, badge: null }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full px-4 py-3.5 rounded-2xl text-left flex items-center gap-4 transition-all duration-300 group ${activeTab === tab.id
                                ? "bg-white/20 text-white"
                                : "text-sky-200/60 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTab === tab.id
                                ? "bg-gradient-to-br from-sky-400 to-sky-500 shadow-lg shadow-sky-500/30"
                                : "bg-white/10 group-hover:bg-white/20"
                                }`}>
                                <tab.icon className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-sm">{tab.label}</span>
                            {tab.badge !== null && (
                                <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-lg ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-white/10 text-sky-300/60"
                                    }`}>{tab.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Quick Actions */}
                <div className="space-y-2 pt-6 border-t border-white/10">
                    <Link href="/dashboard" className="w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 text-sky-200/60 hover:text-white hover:bg-white/5 transition-all">
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
                            { id: "verification", label: "Verification", icon: ShieldCheck },
                            { id: "reviews", label: "Reviews", icon: MessageSquare },
                            { id: "reports", label: "Reports", icon: FileBarChart },
                            { id: "settings", label: "Settings", icon: Settings }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? "bg-sky-600 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
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
                                <div className="px-4 py-1.5 bg-gradient-to-r from-sky-500/10 to-sky-500/10 rounded-full border border-sky-500/20">
                                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Pharmacist Portal</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-500">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
                                </div>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-2">
                                {activeTab === "overview" && "Dashboard Overview"}
                                {activeTab === "verification" && "Medicine Verification"}
                                {activeTab === "reviews" && "Reviews Monitor"}
                                {activeTab === "reports" && "Reports & Analytics"}
                                {activeTab === "settings" && "Settings"}
                            </h1>
                            <p className="text-slate-500 font-medium">
                                {activeTab === "overview" && "Monitor medicine verification status and platform health"}
                                {activeTab === "verification" && "Verify or unverify medicines in the catalog"}
                                {activeTab === "reviews" && "Monitor all customer reviews across the platform"}
                                {activeTab === "reports" && "Detailed reports on categories, stock, and alerts"}
                                {activeTab === "settings" && "Manage your profile and preferences"}
                            </p>
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
                        {/* ==================== OVERVIEW TAB ==================== */}
                        {activeTab === "overview" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                    {[
                                        { label: "Total Medicines", val: totalMedicines, icon: Package, color: "from-sky-500 to-sky-600", trend: `${categoryDistribution.length} categories`, trendUp: false },
                                        { label: "Verified", val: verifiedCount, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600", trend: `${totalMedicines > 0 ? ((verifiedCount / totalMedicines) * 100).toFixed(0) : 0}%`, trendUp: true },
                                        { label: "Unverified", val: unverifiedCount, icon: XCircle, color: "from-orange-500 to-orange-600", trend: "Needs review", trendUp: false },
                                        { label: "Low Stock", val: lowStockCount, icon: AlertTriangle, color: "from-red-500 to-red-600", trend: "Below 10 units", trendUp: false }
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

                                {/* Charts Row */}
                                <div className="grid lg:grid-cols-2 gap-6">
                                    {/* Bar Chart - Medicines per Category */}
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <div className="mb-8">
                                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Medicines per Category</h3>
                                            <p className="text-slate-400 text-xs font-medium mt-1">Distribution across categories</p>
                                        </div>
                                        {categoryDistribution.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={categoryDistribution}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                                                    />
                                                    <Bar dataKey="count" fill="#0284c7" radius={[8, 8, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex items-center justify-center h-[300px]">
                                                <p className="text-slate-400 text-sm">No category data available</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Pie Chart - Verified vs Unverified */}
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <div className="mb-8">
                                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Verification Status</h3>
                                            <p className="text-slate-400 text-xs font-medium mt-1">Verified vs unverified medicines</p>
                                        </div>
                                        {totalMedicines > 0 ? (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <PieChart>
                                                    <Pie
                                                        data={pieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={70}
                                                        outerRadius={110}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {pieData.map((_, index) => (
                                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                                                    <Legend
                                                        verticalAlign="bottom"
                                                        iconType="circle"
                                                        formatter={(value: string) => <span className="text-sm font-medium text-slate-600">{value}</span>}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex items-center justify-center h-[300px]">
                                                <p className="text-slate-400 text-sm">No medicine data available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Stats Row */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: "Total Reviews", val: reviews.length, icon: MessageSquare, color: "text-sky-500", bg: "bg-sky-50" },
                                        { label: "Avg Rating", val: reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "N/A", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
                                        { label: "Verified", val: verifiedCount, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
                                        { label: "Low Stock", val: lowStockCount, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" }
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
                            </div>
                        )}

                        {/* ==================== VERIFICATION TAB ==================== */}
                        {activeTab === "verification" && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-8 border-b border-slate-100">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">All Medicines</h2>
                                                <p className="text-slate-400 text-sm mt-1">Verify or unverify medicines in the catalog</p>
                                            </div>
                                            <div className="relative w-full lg:w-80">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Search by name, category, seller..."
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-sky-500/20 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Medicine</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Category</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Seller</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Price</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Stock</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">Status</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {filteredMedicines.map(med => (
                                                    <tr key={med.id} className="group hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-100 overflow-hidden">
                                                                    <img
                                                                        src={med.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=100"}
                                                                        alt={med.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-900">{med.name}</p>
                                                                    <p className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">{med.description}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">{med.category?.name}</span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className="text-sm font-medium text-slate-600">{med.seller?.name || "N/A"}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className="text-sm font-bold text-slate-900">&#2547;{med.price.toFixed(0)}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className={`text-sm font-bold ${med.stock < 10 ? 'text-red-600' : 'text-slate-900'}`}>{med.stock}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${med.isActive
                                                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                                                                : "bg-orange-500/10 text-orange-600 border-orange-200"
                                                                }`}>
                                                                {med.isActive ? (
                                                                    <><CheckCircle2 className="w-3.5 h-3.5" /> Active</>
                                                                ) : (
                                                                    <><XCircle className="w-3.5 h-3.5" /> Inactive</>
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <button
                                                                onClick={() => handleToggleVerify(med)}
                                                                disabled={togglingId === med.id}
                                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${med.isActive
                                                                    ? "bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200"
                                                                    : "bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-200"
                                                                    } ${togglingId === med.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                {togglingId === med.id ? (
                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                ) : med.isActive ? (
                                                                    <XCircle className="w-3.5 h-3.5" />
                                                                ) : (
                                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                                )}
                                                                {med.isActive ? "Unverify" : "Verify"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {filteredMedicines.length === 0 && (
                                        <div className="text-center py-20">
                                            <Package className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                                            <p className="text-lg font-semibold text-slate-400">No medicines found</p>
                                            <p className="text-sm text-slate-300 mt-1">Try adjusting your search query</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ==================== REVIEWS TAB ==================== */}
                        {activeTab === "reviews" && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Reviews</h3>
                                            <p className="text-slate-400 text-sm mt-1">All reviews across the platform</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                            <MessageSquare className="w-4 h-4" />
                                            {reviews.length} total reviews
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {reviews.map(review => (
                                            <div key={review.id} className={`rounded-2xl p-6 border transition-colors hover:shadow-md ${getRatingBg(review.rating)}`}>
                                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                                                                <User className="w-5 h-5 text-slate-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900">{review.customer?.name || "Anonymous"}</p>
                                                                <p className="text-[10px] text-slate-400 font-medium">
                                                                    Reviewed <span className="font-bold text-slate-600">{review.medicine?.name}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-slate-600 leading-relaxed ml-[52px]">{review.comment}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                                                        <div className={`flex items-center gap-1 ${getRatingColor(review.rating)}`}>
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-slate-200'}`}
                                                                />
                                                            ))}
                                                            <span className="text-sm font-bold ml-1">{review.rating}.0</span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 font-medium">
                                                            {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric"
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {reviews.length === 0 && (
                                            <div className="text-center py-20">
                                                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                                                <p className="text-lg font-semibold text-slate-400">No reviews yet</p>
                                                <p className="text-sm text-slate-300 mt-1">Reviews will appear here once customers leave feedback</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ==================== REPORTS TAB ==================== */}
                        {activeTab === "reports" && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
                                {/* Category Distribution Chart */}
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Category Distribution</h3>
                                        <p className="text-slate-400 text-xs font-medium mt-1">Number of medicines per category</p>
                                    </div>
                                    {categoryDistribution.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={350}>
                                            <BarChart data={categoryDistribution}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} />
                                                <Bar dataKey="count" fill="#0284c7" radius={[8, 8, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-[350px]">
                                            <p className="text-slate-400 text-sm">No category data available</p>
                                        </div>
                                    )}
                                </div>

                                {/* Stock Level Summary */}
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Stock Level Summary</h3>
                                        <p className="text-slate-400 text-xs font-medium mt-1">Overview of inventory health</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { label: "Well Stocked", desc: "50+ units", val: medicines.filter(m => m.stock >= 50).length, color: "from-emerald-500 to-emerald-600", icon: CheckCircle2, bg: "bg-emerald-50" },
                                            { label: "Moderate Stock", desc: "10-49 units", val: medicines.filter(m => m.stock >= 10 && m.stock < 50).length, color: "from-amber-500 to-amber-600", icon: Package, bg: "bg-amber-50" },
                                            { label: "Low Stock", desc: "Below 10 units", val: medicines.filter(m => m.stock < 10).length, color: "from-red-500 to-red-600", icon: AlertTriangle, bg: "bg-red-50" }
                                        ].map((item, i) => (
                                            <div key={i} className={`${item.bg} rounded-2xl p-6 border border-white`}>
                                                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                                                    <item.icon className="w-6 h-6" />
                                                </div>
                                                <p className="text-3xl font-bold text-slate-900 mb-1">{item.val}</p>
                                                <p className="text-sm font-bold text-slate-700">{item.label}</p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Low Stock Alerts */}
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Low Stock Alerts</h3>
                                            <p className="text-slate-400 text-xs font-medium mt-1">Medicines requiring immediate attention</p>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-200">
                                            <AlertTriangle className="w-4 h-4" />
                                            <span className="text-[11px] font-bold">{lowStockCount} alerts</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {medicines.filter(m => m.stock < 10).map(med => (
                                            <div key={med.id} className="flex items-center justify-between p-4 rounded-2xl bg-red-50/50 hover:bg-red-50 transition-colors border border-red-100">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-white border border-red-100 overflow-hidden">
                                                        <img
                                                            src={med.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=100"}
                                                            alt={med.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{med.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium">{med.category?.name} &middot; {med.seller?.name || "Unknown Seller"}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-red-600">{med.stock} left</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">&#2547;{med.price.toFixed(0)}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {medicines.filter(m => m.stock < 10).length === 0 && (
                                            <div className="text-center py-16">
                                                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-emerald-200" />
                                                <p className="text-lg font-semibold text-slate-400">All products well stocked</p>
                                                <p className="text-sm text-slate-300 mt-1">No low stock alerts at this time</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ==================== SETTINGS TAB ==================== */}
                        {activeTab === "settings" && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <div className="max-w-2xl">
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Profile Information</h3>
                                            <p className="text-slate-400 text-sm mt-1">Update your account details</p>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Avatar */}
                                            <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center overflow-hidden shadow-lg shadow-sky-500/20">
                                                    {session.user.image ? (
                                                        <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-10 h-10 text-white" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold text-slate-900">{session.user.name}</p>
                                                    <p className="text-sm text-slate-400">Pharmacist</p>
                                                </div>
                                            </div>

                                            {/* Name Field */}
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={profileForm.name}
                                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                                                />
                                            </div>

                                            {/* Email Field */}
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={profileForm.email}
                                                    disabled
                                                    className="w-full px-4 py-3 bg-slate-100 rounded-xl border border-slate-200 text-sm font-medium text-slate-400 cursor-not-allowed"
                                                />
                                                <p className="text-[10px] text-slate-400 mt-1.5">Email cannot be changed</p>
                                            </div>

                                            {/* Role Field */}
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Role</label>
                                                <div className="w-full px-4 py-3 bg-slate-100 rounded-xl border border-slate-200 text-sm font-medium text-slate-400 flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4 text-sky-500" />
                                                    Pharmacist
                                                </div>
                                            </div>

                                            {/* Save Button */}
                                            <div className="pt-4">
                                                <button
                                                    onClick={handleProfileSave}
                                                    disabled={profileSaving}
                                                    className="px-8 py-3 bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-2xl font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-sky-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {profileSaving ? (
                                                        <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                                    ) : (
                                                        "Save Changes"
                                                    )}
                                                </button>
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
