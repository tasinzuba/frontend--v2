"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ShoppingCart, Star, ChevronRight, Loader2, Pill } from "lucide-react";
import Link from "next/link";

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

export default function MedicinesPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-v2-sb9v.vercel.app";

    const fetchMedicines = async () => {
        setLoading(true);
        try {
            const url = new URL(`${backendUrl}/api/medicines`);
            if (search) url.searchParams.set("search", search);
            if (selectedCategory) url.searchParams.set("category", selectedCategory);

            const res = await fetch(url.toString());
            const json = await res.json();
            if (json.success) {
                setMedicines(json.data.medicines);
            }
        } catch (e) {
            console.error("Failed to fetch medicines", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/medicines/categories`);
            const json = await res.json();
            if (json.success) {
                setCategories(json.data);
            }
        } catch (e) {
            console.error("Failed to fetch categories", e);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMedicines();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, selectedCategory]);

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20">
            <div className="max-w-[1300px] mx-auto px-4 md:px-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sky-600 mb-1">
                            <Link href="/" className="text-xs font-bold hover:underline">Home</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-xs font-bold text-gray-400">Medicines</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 italic">Available Medicines</h1>
                        <p className="text-sm text-gray-500 font-medium">Browse thousands of authentic products</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-sky-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search medicine..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white shadow-xl shadow-sky-100/50 rounded-2xl border-none focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-medium"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="pl-10 pr-10 py-3.5 bg-white shadow-xl shadow-sky-100/50 rounded-2xl border-none focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-bold appearance-none cursor-pointer text-gray-700 min-w-[160px]"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
                        <p className="text-gray-400 font-bold italic animate-pulse">Filtering best results for you...</p>
                    </div>
                ) : medicines.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {medicines.map((med) => (
                            <div key={med.id} className="group bg-white rounded-[32px] p-4 border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-sky-100 transition-all duration-500 flex flex-col h-full hover:-translate-y-1">
                                <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden mb-6 bg-gray-50 flex items-center justify-center">
                                    {med.image ? (
                                        <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <Pill className="w-16 h-16 text-sky-200" />
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-wider text-sky-600 rounded-full shadow-sm">
                                            {med.category.name}
                                        </span>
                                    </div>
                                </div>

                                <div className="px-2 space-y-2 flex-grow">
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-1 italic">
                                        {med.name}
                                    </h3>
                                    <p className="text-gray-400 text-xs font-medium line-clamp-2 leading-relaxed">
                                        {med.description}
                                    </p>
                                    <div className="flex items-center gap-1 text-yellow-500 pt-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'fill-current' : ''}`} />)}
                                        <span className="text-[10px] text-gray-400 font-bold ml-1">(12+ reviews)</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between px-2">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Price</p>
                                        <p className="text-2xl font-black text-gray-900 italic">
                                            ${med.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <button className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-sky-600 hover:scale-110 transition-all active:scale-95 group/btn">
                                        <ShoppingCart className="w-5 h-5 group-hover/btn:animate-bounce" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] py-32 text-center border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 italic">Oops! No results found</h3>
                        <p className="text-gray-400 mt-2 font-medium">Try searching for something else or change filters</p>
                        <button
                            onClick={() => { setSearch(""); setSelectedCategory(""); }}
                            className="mt-8 px-8 py-3 bg-sky-50 text-sky-600 rounded-full font-bold hover:bg-sky-100 transition-all"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
