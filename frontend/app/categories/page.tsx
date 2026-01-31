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
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-v2-sb9v.vercel.app";
                const res = await fetch(`${backendUrl}/api/medicines/categories`, { credentials: "include" });
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
        <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 animate-slide-up">
            <div className="max-w-[1300px] mx-auto px-4 md:px-10">
                {/* Header */}
                <div className="text-center space-y-4 mb-24">
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest mx-auto border border-emerald-100/50 shadow-sm">
                        <LayoutGrid className="w-3.5 h-3.5" />
                        Explore Our Taxonomy
                    </div>
                    <h1 className="text-6xl font-bold text-slate-900 tracking-tight">Product <span className="text-emerald-600">Categories</span></h1>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
                        Find exactly what you need by browsing our specialized healthcare departments and trusted pharmaceutical product groups.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/medicines?category=${cat.id}`}
                            className="group relative bg-white rounded-[40px] p-8 border border-slate-50 hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 text-center"
                        >
                            <div className="relative w-36 h-36 mx-auto mb-10 rounded-[32px] overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-1000 bg-slate-50">
                                <img
                                    src={cat.image || "https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=400"}
                                    alt={cat.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <h3 className="font-bold text-2xl text-slate-900 mb-3 tracking-tight group-hover:text-emerald-600 transition-colors">
                                {cat.name}
                            </h3>
                            <div className="inline-block px-4 py-1 bg-slate-50 rounded-lg mb-6 border border-slate-100/50">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widestAlpha">
                                    {cat._count?.medicines || 0} Products
                                </p>
                            </div>
                            <p className="text-slate-500 text-sm font-medium line-clamp-2 px-2 h-10 mb-8 leading-relaxed">
                                {cat.description || "High quality products carefully selected for your health and wellbeing."}
                            </p>

                            <div className="inline-flex items-center gap-3 text-xs font-bold text-emerald-600 uppercase tracking-widest group-hover:gap-5 transition-all">
                                Explore Store <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-40 bg-white rounded-[60px] border-2 border-dashed border-slate-100">
                        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <LayoutGrid className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Catalog Under Construction</h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">We are currently organizing our healthcare departments.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
