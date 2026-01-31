"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Search, ArrowRight, Loader2 } from "lucide-react";

interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
    _count?: { medicines: number };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("https://backend-v2-sb9v.vercel.app/api/medicines/categories");
                const data = await res.json();
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-bold animate-pulse italic">Sorting catalog...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
            <div className="max-w-[1300px] mx-auto px-4 md:px-10">
                {/* Header */}
                <div className="text-center space-y-4 mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mx-auto">
                        <LayoutGrid className="w-3 h-3" />
                        Our Taxonomy
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 italic tracking-tight">Product Categories</h1>
                    <p className="text-slate-400 text-sm font-medium max-w-lg mx-auto leading-relaxed">
                        Find exactly what you need by browsing our specialized healthcare departments and product groups.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/medicines?category=${cat.name}`}
                            className="group relative bg-white rounded-[40px] p-6 border border-slate-50 hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500 hover:-translate-y-2 text-center"
                        >
                            <div className="relative w-32 h-32 mx-auto mb-8 rounded-[32px] overflow-hidden shadow-xl shadow-slate-100 group-hover:scale-110 transition-transform duration-500">
                                <img
                                    src={cat.image || "https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=400"}
                                    alt={cat.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-transparent transition-colors"></div>
                            </div>

                            <h3 className="font-black text-2xl text-slate-900 italic mb-2 tracking-tight group-hover:text-emerald-600 transition-colors">
                                {cat.name}
                            </h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                                {cat._count?.medicines || 0} Products
                            </p>
                            <p className="text-slate-500 text-sm line-clamp-2 px-4 h-10 mb-6">
                                {cat.description || "High quality products carefully selected for your health and wellbeing."}
                            </p>

                            <div className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest group-hover:gap-4 transition-all">
                                Explore <ArrowRight className="w-4 h-4" />
                            </div>

                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 -z-10 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-40 border-2 border-dashed border-slate-100 rounded-[50px]">
                        <h3 className="text-2xl font-black text-slate-900 italic opacity-50">Coming Soon</h3>
                        <p className="text-slate-400 text-sm mt-2">We are currently organizing our product catalog.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
