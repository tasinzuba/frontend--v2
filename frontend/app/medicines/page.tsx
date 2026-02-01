"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ShoppingCart, Star, ChevronRight, Loader2, Pill, SlidersHorizontal, Grid3X3, List, Sparkles, TrendingUp, Eye, Heart } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

interface Medicine {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    category: { name: string };
    seller: { name: string };
}

interface Category {
    id: string;
    name: string;
}

const getStatusColor = (stock: number) => {
    if (stock <= 0) return "bg-red-500/10 text-red-600 border-red-200";
    if (stock <= 10) return "bg-amber-500/10 text-amber-600 border-amber-200";
    return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
};

const getStatusText = (stock: number) => {
    if (stock <= 0) return "Out of Stock";
    if (stock <= 10) return `Only ${stock} left`;
    return "In Stock";
};

export default function MedicinesPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { addToCart } = useCart();

    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (selectedCategory) params.append("category", selectedCategory);
                if (searchQuery) params.append("search", searchQuery);
                if (minPrice) params.append("minPrice", minPrice);
                if (maxPrice) params.append("maxPrice", maxPrice);

                const [medRes, catRes] = await Promise.all([
                    fetch(`${backendUrl}/api/medicines?${params.toString()}`, { credentials: "include" }),
                    fetch(`${backendUrl}/api/medicines/categories`, { credentials: "include" })
                ]);

                const medData = await medRes.json();
                const catData = await catRes.json();

                if (medData.success) setMedicines(medData.data.medicines);
                if (catData.success) setCategories(catData.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedCategory, searchQuery, minPrice, maxPrice, backendUrl]);

    const handleCategoryChange = (catId: string) => {
        setSelectedCategory(catId);
        const params = new URLSearchParams(searchParams.toString());
        if (catId) {
            params.set("category", catId);
        } else {
            params.delete("category");
        }
        router.push(`/medicines?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24 pb-20">
            <div className="max-w-[1500px] mx-auto px-4 md:px-10">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4 border border-sky-100">
                                <Sparkles className="w-4 h-4" />
                                Premium Collection
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-3">
                                Our <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Medicines</span>
                            </h1>
                            <p className="text-slate-500 font-medium max-w-xl">
                                Explore our complete catalog of verified pharmaceutical products and healthcare essentials.
                            </p>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                <Grid3X3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-3 rounded-xl transition-all ${viewMode === "list" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-10">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search medicines, vitamins, supplements..."
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 transition-all font-medium text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Price Range */}
                        <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Price</span>
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-20 py-2 bg-white border border-slate-100 outline-none rounded-xl text-center text-sm font-semibold focus:ring-2 focus:ring-sky-500/20"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <span className="text-slate-300">—</span>
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-20 py-2 bg-white border border-slate-100 outline-none rounded-xl text-center text-sm font-semibold focus:ring-2 focus:ring-sky-500/20"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>

                        {/* Category */}
                        <div className="relative">
                            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full lg:w-56 pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-medium text-sm appearance-none cursor-pointer"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(searchQuery || selectedCategory || minPrice || maxPrice) && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active:</span>
                            {searchQuery && (
                                <span className="px-3 py-1.5 bg-sky-50 text-sky-600 text-[11px] font-bold rounded-lg border border-sky-100">
                                    Search: "{searchQuery}"
                                </span>
                            )}
                            {selectedCategory && (
                                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-lg border border-emerald-100">
                                    {categories.find(c => c.id === selectedCategory)?.name}
                                </span>
                            )}
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedCategory(""); setMinPrice(""); setMaxPrice(""); router.push("/medicines"); }}
                                className="ml-auto text-[11px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-8">
                    <p className="text-slate-500 font-medium">
                        Showing <span className="font-bold text-slate-900">{medicines.length}</span> products
                    </p>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse">
                                <div className="aspect-square bg-slate-100 rounded-2xl mb-6"></div>
                                <div className="h-6 bg-slate-100 rounded-lg w-3/4 mb-3"></div>
                                <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : medicines.length > 0 ? (
                    <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                        {medicines.map((med) => (
                            viewMode === "grid" ? (
                                <div key={med.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1">
                                    {/* Image */}
                                    <Link href={`/medicines/${med.id}`} className="relative block aspect-square overflow-hidden bg-slate-50">
                                        {med.image ? (
                                            <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Pill className="w-16 h-16 text-slate-200" />
                                            </div>
                                        )}

                                        {/* Overlays */}
                                        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                                            <span className="px-3 py-1.5 bg-white/95 backdrop-blur text-[10px] font-bold uppercase tracking-widest text-sky-600 rounded-xl shadow-sm">
                                                {med.category.name}
                                            </span>
                                            <button className="w-9 h-9 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm">
                                                <Heart className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Quick View */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Link href={`/medicines/${med.id}`} className="px-5 py-2.5 bg-white rounded-xl text-slate-900 text-sm font-semibold flex items-center gap-2 hover:bg-sky-500 hover:text-white transition-all">
                                                <Eye className="w-4 h-4" />
                                                Quick View
                                            </Link>
                                        </div>
                                    </Link>

                                    {/* Content */}
                                    <div className="p-5">
                                        {/* Status */}
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border mb-3 ${getStatusColor(med.stock)}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                            {getStatusText(med.stock)}
                                        </div>

                                        <Link href={`/medicines/${med.id}`}>
                                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1 mb-2">
                                                {med.name}
                                            </h3>
                                        </Link>
                                        <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                                            {med.description}
                                        </p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mb-5">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                                            ))}
                                            <span className="text-[11px] text-slate-400 font-medium ml-1">(4.0)</span>
                                        </div>

                                        {/* Price & Cart */}
                                        <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Price</p>
                                                <p className="text-2xl font-bold text-slate-900">
                                                    <span className="text-lg text-sky-600">৳</span>{med.price.toFixed(0)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => addToCart(med)}
                                                disabled={med.stock <= 0}
                                                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${med.stock <= 0 ? "bg-slate-100 text-slate-300 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-sky-600 hover:scale-110"}`}
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // List View
                                <div key={med.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all p-6 flex gap-6">
                                    <Link href={`/medicines/${med.id}`} className="relative w-40 h-40 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                                        {med.image ? (
                                            <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Pill className="w-12 h-12 text-slate-200" />
                                            </div>
                                        )}
                                    </Link>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-3 py-1 bg-sky-50 text-sky-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-sky-100">
                                                    {med.category.name}
                                                </span>
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(med.stock)}`}>
                                                    {getStatusText(med.stock)}
                                                </div>
                                            </div>
                                            <Link href={`/medicines/${med.id}`}>
                                                <h3 className="font-bold text-xl text-slate-900 group-hover:text-sky-600 transition-colors mb-2">{med.name}</h3>
                                            </Link>
                                            <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{med.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <p className="text-3xl font-bold text-slate-900">
                                                <span className="text-xl text-sky-600">৳</span>{med.price.toFixed(0)}
                                            </p>
                                            <button
                                                onClick={() => addToCart(med)}
                                                disabled={med.stock <= 0}
                                                className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${med.stock <= 0 ? "bg-slate-100 text-slate-300 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-sky-600"}`}
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No Medicines Found</h3>
                        <p className="text-slate-400 font-medium mb-8">Try adjusting your search or filters</p>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCategory(""); setMinPrice(""); setMaxPrice(""); router.push("/medicines"); }}
                            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-sky-600 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
