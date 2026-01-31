"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Pill, ShieldCheck, Truck, Headphones, ArrowRight, Star, Loader2, ShoppingCart } from "lucide-react";
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
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
        const [catRes, medRes] = await Promise.all([
          fetch(`${backendUrl}/api/medicines/categories`, { credentials: "include" }),
          fetch(`${backendUrl}/api/medicines?limit=8`, { credentials: "include" })
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

      <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 overflow-hidden animate-slide-up">
        <div className="absolute top-0 right-0 -z-10 w-[50%] h-[100%] bg-gradient-to-l from-sky-50/50 to-transparent rounded-l-[100px]"></div>
        <div className="max-w-[1300px] mx-auto px-4 md:px-10 grid lg:grid-cols-2 items-center gap-12">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-sky-100/50">
              <ShieldCheck className="w-4 h-4" />
              100% Authentic Medicines
            </div>
            <h1 className="text-5xl lg:text-7.5xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Your Health, <br />
              <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent italic">Simplified.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
              Order authentic medicines and healthcare products from the comfort of your home. Fast delivery and expert care, always.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-xl group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-sky-500 transition-all duration-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for medicines, vitamins..."
                className="w-full pl-16 pr-32 py-5.5 bg-white premium-shadow rounded-[32px] border-none focus:ring-4 focus:ring-sky-500/10 outline-none text-slate-700 font-semibold placeholder:text-slate-300 transition-all duration-300"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3.5 bg-slate-900 text-white rounded-[24px] font-black italic hover:bg-sky-600 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 shadow-lg shadow-slate-200">
                Search
              </button>
            </form>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-13 h-13 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-13 h-13 rounded-full border-4 border-white bg-sky-500 flex items-center justify-center text-white text-[10px] font-black shadow-xl shadow-sky-200">
                  +10k
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-400 mb-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm font-black text-slate-900 italic tracking-tight uppercase tracking-[0.05em]">Trusted by over 10,000 customers</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="relative z-10 w-full animate-float transition-all duration-700 group-hover:scale-[1.02]">
              <img
                src="https://images.unsplash.com/photo-1576091160550-217359f488d5?auto=format&fit=crop&q=80&w=1000"
                alt="Medical team"
                className="w-full h-auto rounded-[48px] shadow-[0_32px_64px_-16px_rgba(14,165,233,0.2)] object-cover aspect-[4/5] border-8 border-white"
              />
            </div>

            <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-sky-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 bg-white/80 backdrop-blur-2xl shadow-2xl rounded-3xl p-6 border border-white/50 space-y-3 z-20 hidden lg:block hover:scale-105 transition-transform duration-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Quality Assurance</p>
                  <p className="text-base font-black text-slate-900 italic">FDA Approved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-white/40 backdrop-blur-xl border-y border-slate-100 relative z-20">
        <div className="max-w-[1300px] mx-auto px-4 md:px-10 py-16 grid grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex items-start gap-6 group">
            <div className="w-16 h-16 bg-sky-50 rounded-[24px] flex items-center justify-center text-sky-600 flex-shrink-0 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-700 shadow-sm border border-white">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 tracking-tight">Lightning Fast</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widestAlpha">Global Logistics Hub</p>
            </div>
          </div>
          <div className="flex items-start gap-6 group">
            <div className="w-16 h-16 bg-emerald-50 rounded-[24px] flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-700 shadow-sm border border-white">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 tracking-tight">Safe Protocol</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">End-To-End Encryption</p>
            </div>
          </div>
          <div className="flex items-start gap-6 group">
            <div className="w-16 h-16 bg-purple-50 rounded-[24px] flex items-center justify-center text-purple-600 flex-shrink-0 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-700 shadow-sm border border-white">
              <Pill className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 tracking-tight">Prescription</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verified Fulfillment</p>
            </div>
          </div>
          <div className="flex items-start gap-6 group">
            <div className="w-16 h-16 bg-orange-50 rounded-[24px] flex items-center justify-center text-orange-600 flex-shrink-0 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-700 shadow-sm border border-white">
              <Headphones className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 tracking-tight">Direct Access</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">24/7 Support Terminal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why MediStore Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-[1300px] mx-auto px-4 md:px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-sky-100 rounded-full blur-[100px] -z-10 opacity-60"></div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-100 rounded-full blur-[100px] -z-10 opacity-60"></div>
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000"
                alt="Health care professional"
                className="w-full h-auto rounded-[48px] shadow-2xl z-10 relative object-cover aspect-[4/3] border-4 border-white"
              />
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[32px] shadow-2xl border border-slate-50 max-w-[280px] z-20 hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-slate-800 text-sm">Certified Safe</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">All medicines undergo rigorous 5-step quality verification before being listed on our platform.</p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-[0.3em]">The MediStore Advantage</span>
                <h2 className="text-5xl font-bold text-slate-900 leading-tight tracking-tight">Why Choose <span className="text-sky-600">MediStore?</span></h2>
                <p className="text-slate-500 text-lg leading-relaxed max-w-xl">We're not just an online pharmacy; we're your partner in health. Our ecosystem is built on transparency, speed, and uncompromising quality.</p>
              </div>

              <div className="space-y-8">
                {[
                  { title: "Direct Source Procurement", desc: "We skip middlemen and partner directly with certified manufacturers to ensure authenticity and lower costs.", color: "sky" },
                  { title: "Real-time Supply Chain Tracking", desc: "Monitor your order from our temperature-controlled hubs right to your doorstep with live GPS tracking.", color: "emerald" },
                  { title: "Pharmacist-Led Verification", desc: "Every prescription is double-checked by our licensed medical board before fulfillment.", color: "purple" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-white`}>
                      <div className={`w-2 h-2 rounded-full bg-${item.color}-500`}></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed max-w-md">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#f8fafc]">
        <div className="max-w-[1300px] mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-sky-600 uppercase tracking-[0.3em]">Curated Taxonomy</p>
              <h2 className="text-5xl font-bold text-slate-900 tracking-tight">Popular <span className="text-sky-600">Categories</span></h2>
            </div>
            <Link href="/categories" className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 hover:text-sky-600 transition-all group">
              Explore All Departments
              <div className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-all group-hover:scale-110">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
              {categories.map((cat, idx) => (
                <Link key={idx} href={`/medicines?category=${cat.id}`} className="group relative glass-card rounded-[40px] p-6 border-white hover:shadow-2xl hover:shadow-sky-100/30 transition-all duration-700 hover:-translate-y-2">
                  <div className="relative aspect-square rounded-[30px] overflow-hidden mb-8 shadow-inner bg-slate-100">
                    <img src={cat.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400"} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  </div>
                  <div className="space-y-1 text-center">
                    <h3 className="font-bold text-xl text-slate-800 tracking-tight group-hover:text-sky-600 transition-colors">{cat.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cat._count?.medicines || 0}+ Products</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Medicines Section */}
      <section className="py-32 bg-white">
        <div className="max-w-[1300px] mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em]">Prime Selection</p>
              <h2 className="text-5xl font-bold text-slate-900 tracking-tight">Featured <span className="text-emerald-600">Products</span></h2>
            </div>
            <Link href="/medicines" className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 hover:text-emerald-600 transition-all group">
              Access Full Catalog
              <div className="w-10 h-10 rounded-full bg-slate-50 shadow-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all group-hover:scale-110">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {medicines.map((med) => (
                <div key={med.id} className="group glass-card rounded-[40px] p-6 border-white hover:shadow-2xl hover:shadow-emerald-100/20 transition-all duration-700 flex flex-col h-full hover:-translate-y-2">
                  <Link href={`/medicines/${med.id}`} className="relative aspect-square rounded-[30px] overflow-hidden mb-8 bg-slate-50 flex items-center justify-center shadow-inner">
                    {med.image ? (
                      <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    ) : (
                      <Pill className="w-16 h-16 text-emerald-100" />
                    )}
                    <div className="absolute top-6 left-6 z-10">
                      <span className="px-4 py-2 bg-white/95 backdrop-blur-xl text-[9px] font-bold uppercase tracking-widest text-emerald-600 rounded-2xl shadow-sm border border-slate-50">
                        {med.category.name}
                      </span>
                    </div>
                  </Link>

                  <div className="px-2 space-y-3 flex-grow">
                    <Link href={`/medicines/${med.id}`}>
                      <h3 className="font-bold text-2xl text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1 tracking-tight">
                        {med.name}
                      </h3>
                    </Link>
                    <p className="text-slate-400 text-xs font-medium line-clamp-2 leading-relaxed">
                      {med.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-yellow-400 pt-2">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= 4 ? 'fill-current' : 'text-slate-100'}`} />)}
                      <span className="text-[9px] text-slate-400 font-bold ml-2 uppercase tracking-widest">12+ Reviews</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between px-2">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Pricing</p>
                      <p className="text-3xl font-bold text-slate-900 tracking-tighter">
                        <span className="text-lg text-emerald-500 mr-0.5">৳</span>{med.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => addToCart(med)}
                      className="w-14 h-14 bg-slate-900 text-white rounded-[20px] flex items-center justify-center shadow-lg hover:bg-emerald-600 hover:scale-110 transition-all active:scale-95 group/btn"
                    >
                      <ShoppingCart className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


