"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Pill, ShieldCheck, Truck, Headphones, ArrowRight, Star, Loader2, ShoppingCart, Sparkles, Zap, Heart, Clock, CheckCircle2, Package, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "./context/CartContext";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  _count?: { medicines: number };
}

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: { name: string };
}

const categoryColors = [
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-purple-500 to-violet-600",
  "from-orange-500 to-amber-600"
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { addToCart } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/medicines?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/medicines');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
        const cleanBackendUrl = rawUrl.replace(/\/$/, "");
        const [catRes, medRes] = await Promise.all([
          fetch(`${cleanBackendUrl}/api/medicines/categories`, { credentials: "include" }),
          fetch(`${cleanBackendUrl}/api/medicines?limit=8`, { credentials: "include" })
        ]);

        const catJson = await catRes.json();
        const medJson = await medRes.json();

        if (catJson.success) setCategories(catJson.data.slice(0, 4));
        if (medJson.success) setMedicines(medJson.data.medicines);

      } catch (e) {
        console.error("Failed to fetch data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full">

      <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-sky-100/40 to-transparent rounded-l-[200px] -z-10"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-sky-500/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-10 grid lg:grid-cols-2 items-center gap-16 w-full">
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500/10 to-emerald-500/10 rounded-full border border-sky-200/50">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-widest">Trusted Online Pharmacy</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Your Health,<br />
              <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">Delivered.</span>
            </h1>

            <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
              Order authentic medicines and healthcare products from verified pharmacies. Fast delivery, expert care, and 100% genuine products.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-xl">
              <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden group focus-within:shadow-2xl focus-within:shadow-sky-100/50 focus-within:border-sky-200 transition-all">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medicines, vitamins, supplements..."
                  className="w-full pl-14 pr-36 py-5 bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-sky-500/30 transition-all flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-3 border-white bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden shadow-lg">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-3 border-white bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                  +10k
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-400 mb-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  <span className="text-sm font-bold text-slate-900 ml-2">4.9</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Trusted by 10,000+ customers</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 animate-float">
              <img
                src="/hero.jpg"
                alt="Medical team"
                className="w-full h-auto rounded-[48px] shadow-2xl shadow-sky-200/40 object-cover aspect-[4/5] border-8 border-white"
              />
            </div>

            <div className="absolute top-10 -left-10 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 z-20 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verified</p>
                  <p className="font-bold text-slate-900">100% Authentic</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-20 -right-5 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 z-20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Delivery</p>
                  <p className="font-bold text-slate-900">Same Day</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-sky-500/20 rounded-full blur-[80px] -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-gradient-to-br from-sky-500/20 to-blue-500/20 rounded-full blur-[80px] -z-10"></div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-slate-100 relative z-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Free Delivery", desc: "On orders over ৳500", color: "sky" },
              { icon: ShieldCheck, title: "Verified Products", desc: "100% authentic medicines", color: "emerald" },
              { icon: Clock, title: "24/7 Support", desc: "Expert pharmacist help", color: "purple" },
              { icon: Zap, title: "Fast Processing", desc: "Quick order fulfillment", color: "orange" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className={`w-14 h-14 bg-${item.color}-50 rounded-2xl flex items-center justify-center text-${item.color}-600 group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
                <Sparkles className="w-4 h-4" />
                Browse Categories
              </div>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                Shop by <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Category</span>
              </h2>
            </div>
            <Link href="/categories" className="inline-flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors group">
              View All Categories
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/medicines?category=${cat.id}`}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cat.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400"}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 bg-gradient-to-r ${categoryColors[idx % 4]} rounded-full text-white text-[10px] font-bold shadow-lg`}>
                        {cat._count?.medicines || 0}+ Items
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                    </div>
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium">Browse products</span>
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-sky-600 group-hover:text-white transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="/second.jpg"
                alt="Healthcare"
                className="w-full h-auto rounded-3xl shadow-2xl object-cover aspect-[4/3] border-4 border-white"
              />

              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">99%</p>
                    <p className="text-sm text-slate-500">Customer Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
                  Why Choose Us
                </div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
                  Your Trusted <span className="text-emerald-600">Healthcare Partner</span>
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  We're committed to making healthcare accessible, affordable, and reliable for everyone.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { icon: ShieldCheck, title: "100% Verified Products", desc: "Every medicine is sourced directly from certified manufacturers", color: "emerald" },
                  { icon: Truck, title: "Fast & Safe Delivery", desc: "Temperature-controlled logistics to your doorstep", color: "sky" },
                  { icon: Headphones, title: "Expert Support 24/7", desc: "Licensed pharmacists available round the clock", color: "purple" },
                  { icon: CheckCircle2, title: "Easy Returns", desc: "Hassle-free return policy for your peace of mind", color: "orange" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                    <div className={`w-12 h-12 bg-${item.color}-50 rounded-xl flex items-center justify-center text-${item.color}-600 group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
                <TrendingUp className="w-4 h-4" />
                Best Sellers
              </div>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                Featured <span className="text-emerald-600">Products</span>
              </h2>
            </div>
            <Link href="/medicines" className="inline-flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors group">
              View All Products
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {medicines.slice(0, 8).map((med) => (
                <div key={med.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1">
                  <Link href={`/medicines/${med.id}`} className="relative block aspect-square overflow-hidden bg-slate-50">
                    {med.image ? (
                      <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Pill className="w-16 h-16 text-slate-200" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <span className="px-3 py-1.5 bg-white/95 backdrop-blur text-[10px] font-bold uppercase tracking-widest text-emerald-600 rounded-xl shadow-sm">
                        {med.category.name}
                      </span>
                      <button className="w-9 h-9 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${med.stock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${med.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {med.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <Link href={`/medicines/${med.id}`}>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 mb-2">
                        {med.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                      ))}
                      <span className="text-[11px] text-slate-400 font-medium ml-1">(4.0)</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Price</p>
                        <p className="text-2xl font-bold text-slate-900">
                          <span className="text-lg text-emerald-600">৳</span>{med.price.toFixed(0)}
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(med)}
                        disabled={med.stock <= 0}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${med.stock <= 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-emerald-600 hover:scale-110'}`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-sky-50 via-white to-emerald-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-10 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur rounded-full text-emerald-600 text-[11px] font-bold uppercase tracking-widest mb-6 border border-emerald-100">
              <Sparkles className="w-4 h-4" />
              Get Started Today
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Ready to Order Your Medicines?
            </h2>
            <p className="text-slate-500 text-lg mb-10">
              Join thousands of satisfied customers who trust MediStore for their healthcare needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/medicines" className="px-8 py-4 bg-gradient-to-r from-sky-600 to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-3">
                <Package className="w-5 h-5" />
                Browse Medicines
              </Link>
              <Link href="/categories" className="px-8 py-4 bg-white text-slate-700 rounded-2xl font-semibold hover:bg-slate-50 transition-all flex items-center gap-3 border border-slate-200 shadow-sm">
                View Categories
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
