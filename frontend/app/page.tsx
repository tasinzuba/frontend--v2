import Link from "next/link";
import { Search, Pill, ShieldCheck, Truck, Headphones, ArrowRight, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">

      <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-[50%] h-[100%] bg-gradient-to-l from-sky-50 to-transparent rounded-l-[100px]"></div>
        <div className="max-w-[1300px] mx-auto px-4 md:px-10 grid lg:grid-cols-2 items-center gap-12">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              100% Authentic Medicines
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1]">
              Your Health, <br />
              <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent italic">Simplified.</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
              Order authentic medicines and healthcare products from the comfort of your home. Fast delivery and expert care, always.
            </p>

            <div className="relative max-w-xl group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-sky-500 transition-colors" />
              <input
                type="text"
                placeholder="Search for medicines, vitamins..."
                className="w-full pl-16 pr-32 py-5 bg-white shadow-2xl shadow-sky-100 rounded-[30px] border-none focus:ring-2 focus:ring-sky-500/20 outline-none text-gray-700 font-medium"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-gray-900 text-white rounded-[24px] font-bold hover:bg-sky-600 transition-all flex items-center gap-2">
                Search
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="user" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-sky-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                  +10k
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-500 mb-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm font-bold text-gray-900">Trusted by over 10,000 customers</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 w-full animate-float">
              <img
                src="https://images.unsplash.com/photo-1576091160550-217359f488d5?auto=format&fit=crop&q=80&w=1000"
                alt="Medical team"
                className="w-full h-auto rounded-[40px] shadow-3xl shadow-sky-200 object-cover aspect-[4/5]"
              />
            </div>

            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 bg-white/90 backdrop-blur shadow-xl rounded-3xl p-6 border border-white/50 space-y-3 z-20 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Quality Assurance</p>
                  <p className="text-sm font-black text-gray-900">FDA Approved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-white border-y border-gray-50 relative z-20">
        <div className="max-w-[1300px] mx-auto px-4 md:px-10 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm italic">Lightning Fast</h3>
              <p className="text-xs text-gray-400 font-medium">Delivery within 24 hours</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm italic">Safe Payment</h3>
              <p className="text-xs text-gray-400 font-medium">100% secure checkout</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 flex-shrink-0">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm italic">Prescription</h3>
              <p className="text-xs text-gray-400 font-medium">Easy upload & verify</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm italic">24/7 Support</h3>
              <p className="text-xs text-gray-400 font-medium">Ready to help you</p>
            </div>
          </div>
        </div>
      </section>


      <section className="py-24 bg-[#f8fafc]">
        <div className="max-w-[1300px] mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-2">
              <p className="text-xs font-black text-sky-600 uppercase tracking-[0.2em]">Our Collections</p>
              <h2 className="text-4xl font-black text-gray-900 italic">Popular Categories</h2>
            </div>
            <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-sky-600 transition-colors group">
              Browse All Categories
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Pain Relief", count: "120+ Products", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400", color: "sky" },
              { name: "Vitamins", count: "250+ Products", img: "https://images.unsplash.com/photo-1550572017-ed200f545dec?q=80&w=400", color: "emerald" },
              { name: "Personal Care", count: "400+ Products", img: "https://images.unsplash.com/photo-1556228515-ce1a910724c6?q=80&w=400", color: "purple" },
              { name: "Baby Care", count: "80+ Products", img: "https://images.unsplash.com/photo-1515488484392-4db23ff4f05c?q=80&w=400", color: "orange" },
            ].map((cat, idx) => (
              <Link key={idx} href={`/categories/${cat.name.toLowerCase()}`} className="group relative bg-white rounded-[32px] p-4 border border-gray-100 hover:shadow-2xl hover:shadow-sky-100 transition-all duration-500 hover:-translate-y-2">
                <div className="relative aspect-square rounded-[24px] overflow-hidden mb-6">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="space-y-1 px-2">
                  <h3 className="font-black text-xl text-gray-900 italic">{cat.name}</h3>
                  <p className="text-sm text-gray-400 font-bold tracking-tight">{cat.count}</p>
                </div>
                <div className="absolute top-8 right-8 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  <ArrowRight className="w-5 h-5 text-gray-900" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
