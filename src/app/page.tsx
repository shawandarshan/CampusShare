import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Cpu, Wrench, Search, FlaskConical, Users, Sprout } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-32 text-center px-4 overflow-hidden">
        {/* Floating Student Doodles (Decorative Icons) */}
        <div className="absolute inset-0 pointer-events-none -z-5 overflow-hidden">
          <BookOpen className="absolute top-20 left-[10%] text-emerald-100 w-12 h-12 floating opacity-50" />
          <Cpu className="absolute bottom-20 left-[15%] text-cyan-100 w-16 h-16 floating opacity-50 [animation-delay:-1s]" />
          <Wrench className="absolute top-40 right-[12%] text-amber-100 w-14 h-14 floating opacity-50 [animation-delay:-2s]" />
          <FlaskConical className="absolute bottom-40 right-[18%] text-rose-100 w-20 h-20 floating opacity-50 [animation-delay:-3s]" />
          <Sprout className="absolute top-[60%] left-[5%] text-emerald-50 w-10 h-10 floating opacity-60 [animation-delay:-4s]" />
        </div>

        {/* Abstract background blobs */}
        <div className="absolute top-0 -z-10 h-full w-full">
          <div className="absolute bottom-auto left-auto right-0 top-0 h-[600px] w-[600px] -translate-x-[20%] translate-y-[10%] rounded-full bg-emerald-50 opacity-40 blur-[100px]"></div>
          <div className="absolute bottom-auto left-0 right-auto top-0 h-[600px] w-[600px] translate-x-[10%] translate-y-[20%] rounded-full bg-cyan-50 opacity-40 blur-[100px]"></div>
        </div>

        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-emerald-700 uppercase bg-emerald-100/50 rounded-full border border-emerald-200/50 backdrop-blur-sm">
            ✨ Exclusive for MCE Students
          </div>
          <h1 className="max-w-5xl text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-neutral-900 pb-4">
            Share Resources. <br className="hidden sm:block" /> 
            <span className="text-emerald-600 highlight-emerald">Save Money.</span>
          </h1>
          <p className="max-w-2xl mt-8 mx-auto text-lg text-neutral-600 sm:text-xl font-medium leading-relaxed">
            The ultimate student marketplace. Borrow books, share electronics, and swap project gear with your peers.
          </p>

          <div className="flex flex-col sm:flex-row mt-12 gap-5 justify-center">
            <Link href="/browse">
              <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-2xl shadow-emerald-500/30 transition-all hover:-translate-y-1.5 active:scale-95 group rounded-2xl">
                Browse Items <Search className="ml-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
            <Link href="/add-item">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-10 text-xl font-bold border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all hover:-translate-y-1.5 active:scale-95 bg-white/80 backdrop-blur-sm rounded-2xl">
                List Your Gear <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>      {/* Features/Stats Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="bg-white p-10 rounded-3xl border-2 border-emerald-100/50 paper-shadow group hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-8 text-emerald-600 group-hover:scale-110 transition-transform">
                <Sprout className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-800">Eco-Friendly</h3>
              <p className="text-neutral-600 leading-relaxed font-medium">Reduce your carbon footprint. Give unused items a second life and help promote a circular campus economy.</p>
            </div>

            <div className="bg-white p-10 rounded-3xl border-2 border-cyan-100/50 paper-shadow group hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-8 text-cyan-600 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-800">MCE Community</h3>
              <p className="text-neutral-600 leading-relaxed font-medium">Verify your peers. Connect with trusted students securely and collaborate on exciting campus projects.</p>
            </div>

            <div className="bg-white p-10 rounded-3xl border-2 border-amber-100/50 paper-shadow group hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-8 text-amber-600 group-hover:scale-110 transition-transform">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-800">Smart Savings</h3>
              <p className="text-neutral-600 leading-relaxed font-medium">Stop overspending. Borrow expensive textbooks and lab equipment instead of buying brand new gear.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-black mb-4 text-neutral-900">Explore <span className="highlight-cyan">by Category</span></h2>
          <p className="text-neutral-500 mb-16 max-w-xl mx-auto font-medium">Find exactly what you need for this semester, from textbooks to microcontrollers.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Books", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50/50", border: "border-blue-100" },
              { name: "Electronics", icon: Cpu, color: "text-emerald-500", bg: "bg-emerald-50/50", border: "border-emerald-100" },
              { name: "Lab Gear", icon: FlaskConical, color: "text-rose-500", bg: "bg-rose-50/50", border: "border-rose-100" },
              { name: "Hand Tools", icon: Wrench, color: "text-amber-500", bg: "bg-amber-50/50", border: "border-amber-100" },
            ].map((cat) => (
              <Link href={`/browse?category=${cat.name}`} key={cat.name}>
                <div className={`p-8 rounded-3xl ${cat.bg} border-2 ${cat.border} cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group flex flex-col items-center bg-white/50 backdrop-blur-sm`}>
                  <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <cat.icon className={`w-10 h-10 ${cat.color}`} />
                  </div>
                  <span className="font-bold text-neutral-800 text-lg">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
