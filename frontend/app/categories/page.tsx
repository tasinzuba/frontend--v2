"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, ArrowRight, Loader2, Sparkles, TrendingUp, Package, Pill } from "lucide-react";

interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
    _count?: { medicines: number };
}

const categoryColors = [
    "from-sky-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-purple-500 to-violet-600",
    "from-orange-500 to-amber-600",
    "from-pink-500 to-rose-600",
    "from-cyan-500 to-sky-600",
    "from-indigo-500 to-purple-600",
    "from-lime-500 to-green-600"
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const rawUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
                const cleanBackendUrl = rawUrl.replace(/\/$/, "");
                const response = await fetch(`${cleanBackendUrl}/api/medicines/categories`, {
                    credentials: "include"
                });
                const data = await response.json();
                if (data.success) {
                    setCategories(data.data);
                } else {
                    setError("Failed to load categories");
                }
            } catch (err) {
                setError("An error occurred while fetching categories");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center animate-pulse shadow-lg shadow-emerald-500/20">
                        <LayoutGrid className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
                        <p className="text-slate-400 text-sm font-medium">Loading categories...</p>
                    </div>
                </div>
            </div>
        );
    }

    const totalProducts = categories.reduce((acc, cat) => acc + (cat._count?.medicines || 0), 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-28 pb-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-10">
                {/* Hero Section */}
                <div className="relative mb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5 rounded-[60px]"></div>
                    <div className="relative z-10 text-center py-16 px-8">
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 border border-emerald-100">
                            <Sparkles className="w-4 h-4" />
                            Explore Our Collection
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6">
                            Product <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Categories</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed mb-10">
                            Browse our carefully curated healthcare departments. Find exactly what you need from our comprehensive range of pharmaceutical products.
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-8">
                            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                    <LayoutGrid className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categories</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                                <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
                                    <Package className="w-5 h-5 text-sky-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-2xl font-bold text-slate-900">{totalProducts}+</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Products</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categories.map((cat, idx) => (
                        <Link
                            key={cat.id}
                            href={`/medicines?category=${cat.id}`}
                            className="group relative bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700 hover:-translate-y-2"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={cat.image || "https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=400"}
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                                {/* Floating Badge */}
                                <div className="absolute top-4 right-4">
                                    <div className={`px-3 py-1.5 bg-gradient-to-r ${categoryColors[idx % categoryColors.length]} rounded-full text-white text-[10px] font-bold uppercase tracking-widest shadow-lg`}>
                                        {cat._count?.medicines || 0} Items
                                    </div>
                                </div>

                                {/* Title on Image */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-2xl font-bold text-white tracking-tight mb-1">{cat.name}</h3>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                    {cat.description || "Discover our selection of high-quality healthcare products."}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest">Popular</span>
                                    </div>
                                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:bg-emerald-600 transition-colors">
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            {/* Hover Gradient Border */}
                            <div className={`absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} style={{ background: `linear-gradient(to bottom right, transparent 60%, rgba(16, 185, 129, 0.1))` }}></div>
                        </Link>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-32 bg-white rounded-[48px] border border-slate-100 shadow-sm">
                        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Pill className="w-12 h-12 text-slate-200" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">No Categories Found</h3>
                        <p className="text-slate-400 font-medium max-w-md mx-auto">We're currently setting up our product categories. Please check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
