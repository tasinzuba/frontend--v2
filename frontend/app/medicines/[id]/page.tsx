"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, Star, ShieldCheck, Truck, ArrowLeft, Loader2, Pill, User, ArrowRight, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { authClient } from "@/app/lib/auth-client";

interface Medicine {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    category: { name: string };
    seller: { name: string };
    reviews: any[];
}

export default function MedicineDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [medicine, setMedicine] = useState<Medicine | null>(null);
    const [relatedMedicines, setRelatedMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { data: session } = authClient.useSession();

    // Review states
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    const fetchMedicine = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/medicines/${id}`, { credentials: "include" });
            const json = await res.json();
            if (json.success) {
                setMedicine(json.data);
                // Fetch related products
                const relRes = await fetch(`${backendUrl}/api/medicines?category=${json.data.categoryId}&limit=4`, { credentials: "include" });
                const relJson = await relRes.json();
                if (relJson.success) {
                    setRelatedMedicines(relJson.data.medicines.filter((m: any) => m.id !== id));
                }
            }
        } catch (e) {
            console.error("Failed to fetch medicine", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchMedicine();
    }, [id, backendUrl]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return router.push("/login?callbackUrl=" + window.location.pathname);
        setIsSubmitting(true);
        try {
            const res = await fetch(`${backendUrl}/api/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ medicineId: id, rating, comment }),
                credentials: "include"
            });
            const json = await res.json();
            if (json.success) {
                setComment("");
                setRating(5);
                fetchMedicine(); // Refresh reviews
            }
        } catch (e) {
            console.error("Review failed", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
            </div>
        );
    }

    if (!medicine) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] text-center px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h2>
                <Link href="/medicines" className="text-sky-600 font-bold hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-32 pb-24 animate-slide-up">
            <div className="max-w-[1300px] mx-auto px-4 md:px-10">
                <Link
                    href="/medicines"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest mb-12 hover:text-sky-600 transition-all shadow-sm border border-slate-100/50 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Catalog
                </Link>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Image Section */}
                    <div className="sticky top-32">
                        <div className="relative group overflow-hidden bg-white rounded-[40px] border border-slate-100 shadow-sm aspect-square flex items-center justify-center p-12">
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            {medicine.image ? (
                                <img
                                    src={medicine.image}
                                    alt={medicine.name}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <Pill className="w-32 h-32 text-slate-100" />
                            )}

                            <div className="absolute top-8 right-8">
                                <div className="w-14 h-14 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg border border-white">
                                    <ShieldCheck className="w-7 h-7 text-emerald-500" />
                                </div>
                            </div>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm flex items-center gap-5 group">
                                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery</p>
                                    <p className="text-sm font-bold text-slate-800 tracking-tight">Express 24h</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm flex items-center gap-5 group">
                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quality</p>
                                    <p className="text-sm font-bold text-slate-800 tracking-tight">Certified Safe</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Section */}
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1.5 bg-sky-50 text-sky-600 text-[10px] font-bold rounded-lg uppercase tracking-widest border border-sky-100/50">
                                    {medicine.category.name}
                                </span>
                                <div className="flex items-center gap-1.5 text-yellow-400 bg-yellow-50/50 px-3 py-1.5 rounded-lg border border-yellow-100/50">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-[10px] text-yellow-700 font-bold uppercase tracking-widest">4.8 Rating</span>
                                </div>
                            </div>
                            <h1 className="text-6xl font-bold text-slate-900 tracking-tight leading-tight">{medicine.name}</h1>
                            <p className="text-lg text-slate-500 leading-relaxed max-w-xl font-medium">{medicine.description}</p>
                        </div>

                        <div className="flex items-end gap-6 text-slate-900">
                            <p className="text-6xl font-bold tracking-tighter">৳{medicine.price.toFixed(2)}</p>
                            <div className="mb-2 space-y-1">
                                <p className="text-lg text-slate-300 font-bold line-through decoration-red-500/30 decoration-2">৳{(medicine.price * 1.2).toFixed(2)}</p>
                                <span className="block px-2.5 py-1 bg-red-50 text-red-500 text-[9px] font-bold rounded-lg uppercase tracking-widest text-center shadow-sm">Save 20%</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 border-t border-slate-100">
                            <button
                                onClick={() => addToCart(medicine)}
                                className="w-full h-16 bg-slate-900 text-white rounded-[24px] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-sky-600 hover:shadow-xl transition-all shadow-lg flex items-center justify-center gap-4 active:scale-95 group"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                Buy Now
                            </button>
                            <div className="flex flex-col items-center sm:items-start flex-shrink-0 bg-slate-50 px-8 py-3 rounded-2xl border border-slate-100">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Availability</p>
                                <p className={`text-sm font-bold tracking-tight ${medicine.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {medicine.stock > 0 ? `${medicine.stock} Units in Hub` : 'Out of Inventory'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-[40px] p-8 border border-slate-100 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Verified Provider</p>
                                    <p className="text-xl font-bold text-slate-900 tracking-tight">{medicine.seller.name}</p>
                                </div>
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sky-600 shadow-sm border border-white">
                                    <User className="w-8 h-8" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/50">
                                <div>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Batch ID</p>
                                    <p className="text-xs font-bold text-slate-800">#MED-{medicine.id.slice(-6).toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Purity</p>
                                    <p className="text-xs font-bold text-slate-800">99.9% Cert</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Exp Date</p>
                                    <p className="text-xs font-bold text-slate-800">Dec 2026</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-32">
                    <div className="grid lg:grid-cols-3 gap-20">
                        {/* Review List */}
                        <div className="lg:col-span-2 space-y-12">
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-sky-600 uppercase tracking-[0.3em]">Patient Feedback</p>
                                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Clinical Reviews</h2>
                            </div>

                            {medicine.reviews?.length > 0 ? (
                                <div className="space-y-8">
                                    {medicine.reviews.map((rev, i) => (
                                        <div key={i} className="p-8 bg-white rounded-[32px] border border-slate-50 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                                                        {rev.customer.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{rev.customer.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed">{rev.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-20 bg-slate-50 rounded-[40px] text-center border border-dashed border-slate-200">
                                    <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No reviews recorded yet</p>
                                </div>
                            )}
                        </div>

                        {/* Leave a Review */}
                        <div className="lg:col-span-1">
                            <div className="bg-slate-900 rounded-[40px] p-10 text-white sticky top-32 shadow-2xl">
                                <h3 className="text-2xl font-bold tracking-tight mb-2">Submit Experience</h3>
                                <p className="text-slate-400 text-sm mb-10">Share your pharmaceutical experience with the community.</p>

                                <form onSubmit={handleReviewSubmit} className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency Rating</p>
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setRating(s)}
                                                    className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${rating >= s ? "bg-amber-400 text-amber-900" : "bg-white/5 text-slate-500 hover:bg-white/10"}`}
                                                >
                                                    <Star className={`w-5 h-5 ${rating >= s ? "fill-current" : ""}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Observations</p>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Describe the effects and quality..."
                                            className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500/50 transition-all resize-none"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        Broadcast Review
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedMedicines.length > 0 && (
                    <div className="mt-32 border-t border-slate-100 pt-20">
                        <div className="flex items-center justify-between mb-16 px-4">
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em]">Similar Assets</p>
                                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">People Also Viewed</h2>
                            </div>
                            <Link href="/medicines" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-sky-600 transition-colors flex items-center gap-2">
                                View Catalog <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedMedicines.map((med) => (
                                <Link key={med.id} href={`/medicines/${med.id}`} className="group bg-white p-6 rounded-[32px] border border-slate-50 hover:shadow-lg transition-all shadow-sm">
                                    <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-6">
                                        <img src={med.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400"} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-sky-600 transition-colors mb-2 line-clamp-1 truncate tracking-tight">{med.name}</h3>
                                    <p className="text-xl font-bold text-slate-900 tracking-tighter">৳{med.price.toFixed(2)}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
