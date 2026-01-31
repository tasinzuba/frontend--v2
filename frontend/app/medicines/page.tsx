"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ShoppingCart, Star, ChevronRight, Loader2, Pill } from "lucide-react";
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
    if (stock <= 0) return "bg-red-50 text-red-600 border-red-100";
    if (stock <= 10) return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
};

const getStatusText = (stock: number) => {
    if (stock <= 0) return "Out of Stock";
    if (stock <= 10) return `Low Stock: ${stock} left`;
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
        <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 animate-slide-up">
            <div className="max-w-[1300px] mx-auto px-4 md:px-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit border border-sky-100/50">
                            Pharmacy Catalog
                        </div>
                        <h1 className="text-5xl font-bold text-slate-900 tracking-tight">Our <span className="text-sky-600">Medicines</span></h1>
                        <p className="text-slate-500 font-medium max-w-lg">Access our complete inventory of verified pharmaceutical products and healthcare essentials.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="flex flex-col md:flex-row gap-4 flex-1">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-sky-500/5 transition-all font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-100 rounded-3xl">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Range</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    className="w-20 py-2 bg-slate-50 border-none outline-none rounded-xl text-center text-xs font-bold"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                                <span className="text-slate-300">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    className="w-20 py-2 bg-slate-50 border-none outline-none rounded-xl text-center text-xs font-bold"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full sm:w-56 pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500/30 transition-all font-medium text-sm appearance-none shadow-sm cursor-pointer"
                            >
                                <option value="">All Departments</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white rounded-[32px] p-6 border border-slate-50 space-y-6 animate-pulse shadow-sm">
                                <div className="aspect-square bg-slate-50 rounded-2xl"></div>
                                <div className="space-y-3">
                                    <div className="h-6 bg-slate-50 rounded-lg w-3/4"></div>
                                    <div className="h-4 bg-slate-50 rounded-lg w-1/2"></div>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <div className="h-8 bg-slate-50 rounded-lg w-1/3"></div>
                                    <div className="h-12 w-12 bg-slate-50 rounded-xl"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : medicines.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {medicines.map((med) => (
                            <div key={med.id} className="group bg-white rounded-[32px] p-6 border border-slate-50 hover:shadow-xl transition-all duration-500 flex flex-col h-full hover:-translate-y-1.5 shadow-sm relative overflow-hidden">
                                <Link href={`/medicines/${med.id}`} className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-slate-50 flex items-center justify-center shadow-inner">
                                    {med.image ? (
                                        <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <Pill className="w-12 h-12 text-slate-200" />
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 bg-white/95 backdrop-blur text-[9px] font-bold uppercase tracking-widest text-sky-600 rounded-xl shadow-sm border border-slate-50">
                                            {med.category.name}
                                        </span>
                                    </div>
                                </Link>

                                <div className="px-1 space-y-3 flex-grow">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border shadow-sm ${getStatusColor(med.stock)}`}>
                                        <div className="w-1 h-1 rounded-full bg-current"></div>
                                        {getStatusText(med.stock)}
                                    </div>
                                    <Link href={`/medicines/${med.id}`}>
                                        <h3 className="font-bold text-xl text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-1 tracking-tight">
                                            {med.name}
                                        </h3>
                                    </Link>
                                    <p className="text-slate-400 text-xs font-medium line-clamp-2 leading-relaxed">
                                        {med.description}
                                    </p>
                                    <div className="flex items-center gap-1 text-yellow-400 pt-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'fill-current' : 'text-slate-100'}`} />)}
                                        <span className="text-[10px] text-slate-300 font-bold ml-1">4.2 (12)</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between px-1">
                                    <div>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Pricing</p>
                                        <p className="text-2xl font-bold text-slate-900 tracking-tighter">
                                            <span className="text-lg text-sky-600 mr-0.5">৳</span>{med.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => addToCart(med)}
                                        className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-sky-600 hover:scale-110 transition-all active:scale-95 group/btn"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 bg-white rounded-[48px] border border-slate-50 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No medicines found</h3>
                        <p className="text-slate-400 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCategory(""); router.push("/medicines"); }}
                            className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-sky-600 transition-colors shadow-lg"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
