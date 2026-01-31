"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Pill, Search, Filter, ShoppingCart, Star, ArrowRight, Loader2 } from "lucide-react";

interface Medicine {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: { name: string };
    manufacturer: string;
}

export default function MedicinesPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get("category");

    useEffect(() => {
        const fetchMedicines = async () => {
            setLoading(true);
            try {
                console.log("Fetching medicines from:", "https://backend-v2-sb9v.vercel.app/api/medicines");
                const res = await fetch("https://backend-v2-sb9v.vercel.app/api/medicines");

                if (!res.ok) {
                    const text = await res.text();
                    console.error("Response not OK:", res.status, text);
                    setError(`Server responded with ${res.status}`);
                    return;
                }

                const data = await res.json();
                console.log("API Response:", data);

                if (data.success) {
                    let filtered = data.data.medicines;
                    if (categoryQuery) {
                        filtered = filtered.filter((m: Medicine) =>
                            m.category?.name.toLowerCase() === categoryQuery.toLowerCase()
                        );
                    }
                    setMedicines(filtered);
                } else {
                    setError(data.error || "Failed to load medicines");
                }
            } catch (err) {
                console.error("Fetch encounter error:", err);
                setError("Network error or CORS issue. Check browser console.");
            } finally {
                setLoading(false);
            }
        };

        fetchMedicines();
    }, [categoryQuery]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-bold animate-pulse italic">Bringing the pharmacy to you...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
            <div className="max-w-[1300px] mx-auto px-4 md:px-10">
                {/* Header & Search */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Pill className="w-3 h-3" />
                            Premium Catalog
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 italic">Our Medicines</h1>
                        <p className="text-slate-400 text-sm font-medium">Browse thousands of authentic healthcare products</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:max-w-xl">
                        <div className="relative w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, generic or manufacturer..."
                                className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-sky-500/20 outline-none text-sm font-medium transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {error ? (
                    <div className="bg-red-50 border border-red-100 rounded-[32px] p-12 text-center max-w-2xl mx-auto mt-20">
                        <p className="text-red-500 font-bold mb-2">Oops! Something went wrong</p>
                        <p className="text-red-400 text-sm">{error}</p>
                        <button onClick={() => window.location.reload()} className="mt-6 px-8 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200">
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {medicines.map((med) => (
                            <div key={med.id} className="group relative bg-white rounded-[32px] p-4 border border-slate-50 hover:shadow-2xl hover:shadow-sky-100 transition-all duration-500 hover:-translate-y-2">
                                <Link href={`/medicines/${med.id}`} className="block relative aspect-square rounded-[24px] overflow-hidden mb-6 bg-slate-100">
                                    <img
                                        src={med.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400"}
                                        alt={med.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <div className="px-3 py-1 bg-white/90 backdrop-blur text-[10px] font-black text-sky-600 rounded-full shadow-sm uppercase">
                                            {med.category?.name || "Medicine"}
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
                                            <ArrowRight className="w-6 h-6" />
                                        </div>
                                    </div>
                                </Link>

                                <div className="space-y-3 px-2 pb-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{med.manufacturer}</p>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-[10px] font-black text-slate-900">4.8</span>
                                        </div>
                                    </div>
                                    <h3 className="font-black text-lg text-slate-900 tracking-tight leading-tight group-hover:text-sky-600 transition-colors line-clamp-1 italic">
                                        {med.name}
                                    </h3>
                                    <div className="flex items-end justify-between pt-2">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Price</p>
                                            <p className="text-xl font-black text-slate-900">
                                                <span className="text-sm font-bold mr-0.5">$</span>
                                                {med.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <button className="p-3.5 bg-slate-900 text-white rounded-2xl hover:bg-sky-500 transition-all shadow-xl shadow-slate-100 hover:shadow-sky-200">
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && medicines.length === 0 && !error && (
                    <div className="text-center py-40">
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Pill className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 italic">No medicines found</h3>
                        <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">We couldn't find any products in our catalog right now. Please check back later.</p>
                        <Link href="/" className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                            Return Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
