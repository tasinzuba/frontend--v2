"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Pill, ShieldCheck, Truck, Headphones, ArrowRight, Star, Loader2, ShoppingCart, Sparkles, Zap, Heart, Clock, CheckCircle2, Package, TrendingUp, ChevronDown, Quote, Users, Award, ThumbsUp, MessageSquare, HelpCircle, ChevronRight, Mail } from "lucide-react";
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
  "from-sky-500 to-sky-600",
  "from-sky-400 to-sky-500",
  "from-sky-600 to-sky-700",
  "from-sky-500 to-blue-600"
];

const heroSlides = [
  { title: "Your Health,", highlight: "Delivered.", desc: "Order authentic medicines and healthcare products from verified pharmacies. Fast delivery, expert care, and 100% genuine products." },
  { title: "Trusted", highlight: "Pharmacy.", desc: "We partner with certified manufacturers to ensure every product meets the highest quality standards." },
  { title: "Fast &", highlight: "Reliable.", desc: "Same-day delivery available across Dhaka. Temperature-controlled logistics for sensitive medicines." },
];

const testimonials = [
  { name: "Rafiq Ahmed", role: "Regular Customer", text: "MediStore has been my go-to pharmacy for over a year. The delivery is always on time and the medicines are genuine. Highly recommended!", rating: 5, avatar: 1 },
  { name: "Fatima Begum", role: "Healthcare Professional", text: "As a nurse, I need reliable medicine sources. MediStore provides authentic products with proper documentation every time.", rating: 5, avatar: 2 },
  { name: "Karim Hossain", role: "Senior Citizen", text: "Being elderly, I can't visit pharmacies often. MediStore delivers my monthly medicines right to my doorstep. Excellent service!", rating: 4, avatar: 3 },
  { name: "Nusrat Jahan", role: "Mother of Two", text: "I trust MediStore for my children's medicines. Their customer support helped me find the right vitamins for my kids.", rating: 5, avatar: 4 },
];

const faqItems = [
  { q: "How do I place an order?", a: "Simply browse our catalog, add items to your cart, and proceed to checkout. You can pay via cash on delivery or online payment methods." },
  { q: "Are all medicines genuine?", a: "Yes, we source all medicines directly from certified manufacturers and authorized distributors. Every product comes with proper batch numbers and expiry dates." },
  { q: "What is your delivery time?", a: "We offer same-day delivery within Dhaka city for orders placed before 2 PM. For other areas, delivery takes 2-3 business days." },
  { q: "Can I return a medicine?", a: "Yes, we accept returns within 7 days of delivery if the product is unopened and in its original packaging. Contact our support team to initiate a return." },
  { q: "Do you need a prescription?", a: "For prescription medicines, you need to upload a valid prescription during checkout. Over-the-counter medicines can be ordered without a prescription." },
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
          <div className="space-y-8 animate-slide-up animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500/10 to-emerald-500/10 rounded-full border border-sky-200/50">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-widest">Trusted Online Pharmacy</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight transition-all duration-500">
              {heroSlides[currentSlide].title}<br />
              <span className="bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent">{heroSlides[currentSlide].highlight}</span>
            </h1>

            <p className="text-lg text-slate-500 max-w-lg leading-relaxed transition-all duration-500">
              {heroSlides[currentSlide].desc}
            </p>

            {/* Slide Indicators */}
            <div className="flex items-center gap-2">
              {heroSlides.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-sky-600" : "w-2 bg-slate-300 hover:bg-slate-400"}`} />
              ))}
            </div>

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

        {/* Scroll Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scroll Down</span>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </div>
      </section>

      {/* Bento Trust Grid */}
      <section className="bg-white border-y border-slate-100 relative z-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-2xl p-6 border border-sky-100 group hover:shadow-lg transition-all hover:-translate-y-0.5">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Free Delivery</h3>
              <p className="text-xs text-slate-500 mt-1">On orders over ৳500</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 border border-emerald-100 group hover:shadow-lg transition-all hover:-translate-y-0.5">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Verified Products</h3>
              <p className="text-xs text-slate-500 mt-1">100% authentic medicines</p>
            </div>
            <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-2xl p-6 border border-sky-100 group hover:shadow-lg transition-all hover:-translate-y-0.5">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">24/7 Support</h3>
              <p className="text-xs text-slate-500 mt-1">Expert pharmacist help</p>
            </div>
            <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-2xl p-6 border border-sky-100 group hover:shadow-lg transition-all hover:-translate-y-0.5">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Fast Processing</h3>
              <p className="text-xs text-slate-500 mt-1">Quick order fulfillment</p>
            </div>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/medicines?category=${cat.id}`}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cat.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400"}
                      alt={cat.name}
                      className="w-full h-full object-cover img-zoom"
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

      {/* Bento Why Choose Us */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              Why Choose Us
            </div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Your Trusted <span className="text-sky-600">Healthcare Partner</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">We&apos;re committed to making healthcare accessible, affordable, and reliable for everyone.</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
            {/* Large Card - Verified */}
            <div className="md:col-span-3 lg:col-span-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px] -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-2">100% Verified Products</h3>
                <p className="text-emerald-100 leading-relaxed max-w-sm">Every medicine is sourced directly from certified manufacturers and authorized distributors with full traceability.</p>
              </div>
            </div>

            {/* Medium Card - Delivery */}
            <div className="md:col-span-3 lg:col-span-4 bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all group hover:-translate-y-1">
              <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Truck className="w-7 h-7 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Fast & Safe Delivery</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Temperature-controlled logistics ensures medicines reach your doorstep in perfect condition.</p>
              <div className="mt-5 flex items-center gap-2">
                <div className="px-3 py-1.5 bg-sky-50 rounded-lg text-xs font-bold text-sky-600 border border-sky-100">Same Day</div>
                <div className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 border border-slate-100">Tracked</div>
              </div>
            </div>

            {/* Image Card */}
            <div className="md:col-span-3 lg:col-span-3 bg-white rounded-3xl border border-slate-100 overflow-hidden relative group hover:shadow-xl transition-all hover:-translate-y-1">
              <img src="/second.jpg" alt="Healthcare" className="w-full h-full object-cover min-h-[220px] group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">99%</p>
                    <p className="text-white/70 text-xs">Customer Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Card - Support */}
            <div className="md:col-span-3 lg:col-span-4 bg-gradient-to-br from-sky-50 to-sky-50 rounded-3xl p-8 border border-sky-100 hover:shadow-xl transition-all group hover:-translate-y-1">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                  <Headphones className="w-7 h-7 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Expert Support 24/7</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Licensed pharmacists available round the clock to help with your queries.</p>
                </div>
              </div>
            </div>

            {/* Small Card - Returns */}
            <div className="md:col-span-3 lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all group hover:-translate-y-1">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Easy Returns & Refunds</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Hassle-free return policy within 7 days. Your peace of mind is our priority.</p>
                </div>
              </div>
            </div>

            {/* Wide Stats Bar */}
            <div className="md:col-span-6 lg:col-span-3 bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-center hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Products</span>
                  <span className="text-xl font-bold">5,000+</span>
                </div>
                <div className="w-full h-px bg-slate-700"></div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Sellers</span>
                  <span className="text-xl font-bold">50+</span>
                </div>
                <div className="w-full h-px bg-slate-700"></div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Rating</span>
                  <span className="text-xl font-bold flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
                <TrendingUp className="w-4 h-4" />
                Best Sellers
              </div>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                Featured <span className="text-sky-600">Products</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
              {medicines.slice(0, 8).map((med) => (
                <div key={med.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1">
                  <Link href={`/medicines/${med.id}`} className="relative block aspect-square overflow-hidden bg-slate-50">
                    {med.image ? (
                      <img src={med.image} alt={med.name} className="w-full h-full object-cover img-zoom" />
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

      {/* Bento Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-sky-500 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]"></div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-4">
            {/* Large stat */}
            <div className="col-span-2 lg:col-span-4 bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/5 group hover:bg-white/10 transition-all duration-300">
              <div className="w-14 h-14 bg-sky-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-sky-400" />
              </div>
              <p className="text-5xl font-bold text-white mb-1">10,000+</p>
              <p className="text-sm text-slate-400 font-medium">Happy Customers Nationwide</p>
            </div>
            {/* Stack */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="bg-emerald-500/10 backdrop-blur rounded-2xl p-6 border border-emerald-500/10 flex-1 group hover:bg-emerald-500/20 transition-all duration-300 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Package className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">5,000+</p>
                  <p className="text-xs text-slate-400 font-medium">Products</p>
                </div>
              </div>
              <div className="bg-sky-500/10 backdrop-blur rounded-2xl p-6 border border-sky-500/10 flex-1 group hover:bg-sky-500/20 transition-all duration-300 flex items-center gap-4">
                <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Award className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">50+</p>
                  <p className="text-xs text-slate-400 font-medium">Verified Sellers</p>
                </div>
              </div>
            </div>
            {/* Satisfaction */}
            <div className="col-span-2 lg:col-span-5 bg-gradient-to-br from-sky-500/20 to-emerald-500/20 backdrop-blur rounded-3xl p-8 border border-white/5 group hover:from-sky-500/30 hover:to-emerald-500/30 transition-all duration-300 flex items-center gap-6">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <ThumbsUp className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <p className="text-5xl font-bold text-white mb-1">99%</p>
                <p className="text-sm text-slate-400 font-medium">Customer Satisfaction Rate</p>
                <div className="mt-3 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                  <span className="text-xs text-slate-400 ml-1">4.9 average</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Bento Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              <MessageSquare className="w-4 h-4" />
              Testimonials
            </div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
              What Our <span className="text-sky-600">Customers Say</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Real feedback from real customers who trust MediStore for their healthcare needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 stagger-children">
            {/* Featured Testimonial - Large */}
            <div className="md:col-span-6 lg:col-span-5 bg-gradient-to-br from-sky-500 to-sky-600 rounded-3xl p-8 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-500">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px] -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <Quote className="w-10 h-10 text-white/20 mb-4" />
                <p className="text-lg leading-relaxed text-sky-100 mb-6">{testimonials[0].text}</p>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-4 h-4 ${s <= testimonials[0].rating ? 'text-yellow-300 fill-yellow-300' : 'text-white/20'}`} />)}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonials[0].avatar * 50}`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold">{testimonials[0].name}</p>
                    <p className="text-sky-200 text-sm">{testimonials[0].role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Testimonials */}
            {testimonials.slice(1).map((t, i) => (
              <div key={i} className={`${i === 0 ? 'md:col-span-3 lg:col-span-4' : i === 1 ? 'md:col-span-3 lg:col-span-3' : 'md:col-span-6 lg:col-span-4'} bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-xl transition-all group hover:-translate-y-1`}>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.avatar * 50}`} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{t.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-4 md:px-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Frequently Asked <span className="text-sky-600">Questions</span>
            </h2>
            <p className="text-slate-500 text-lg">Find answers to common questions about our service.</p>
          </div>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                  <ChevronRight className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 -mt-1">
                    <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
        </div>
        <div className="max-w-[700px] mx-auto px-4 md:px-10 text-center relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Stay Updated on Health Tips</h2>
          <p className="text-sky-100 text-lg mb-8">Subscribe to our newsletter and get the latest health tips, product updates, and exclusive offers.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input type="email" placeholder="Enter your email address" className="flex-1 px-6 py-4 rounded-xl bg-white/20 backdrop-blur text-white placeholder:text-sky-200 outline-none border border-white/30 focus:border-white/60 transition-all font-medium" />
            <button type="submit" className="px-8 py-4 bg-white text-sky-700 rounded-xl font-bold hover:bg-sky-50 transition-all shadow-lg whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-sky-50 via-white to-emerald-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-10 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur rounded-full text-sky-600 text-[11px] font-bold uppercase tracking-widest mb-6 border border-sky-100">
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
              <Link href="/medicines" className="px-8 py-4 bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-sky-500/30 transition-all flex items-center gap-3">
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
