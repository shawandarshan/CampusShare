import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Cpu, Wrench, Search, FlaskConical, Users, Sprout } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-32 text-center bg-background px-4">
        {/* Abstract background blobs for premium aesthetic */}
        <div className="absolute top-0 -z-10 h-full w-full bg-background">
          <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(16,185,129,0.1)] opacity-50 blur-[80px]"></div>
          <div className="absolute bottom-auto left-0 right-auto top-0 h-[500px] w-[500px] translate-x-[20%] translate-y-[30%] rounded-full bg-[rgba(6,182,212,0.1)] opacity-50 blur-[80px]"></div>
        </div>

        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 pb-2">
          Share Resources. <br className="hidden sm:block" /> Save Money. Reduce Waste.
        </h1>
        <p className="max-w-2xl mt-6 text-lg text-neutral-600 sm:text-xl">
          Connect with students on your campus. Borrow books, find electronics, and share project components. Build a sustainable community.
        </p>

        <div className="flex flex-col sm:flex-row mt-10 gap-4">
          <Link href="/browse">
            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1">
              Browse Resources <Search className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/add-item">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all hover:-translate-y-1">
              List an Item <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features/Stats Section */}
      <section className="py-20 bg-muted/50 border-y border-border px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-border shadow-lg shadow-emerald-900/5 dark:shadow-none group hover:-translate-y-2 transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <div className="mx-auto bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
                  <Sprout className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800">Sustainability First</h3>
                <p className="text-neutral-600">Give unused items a second life and help promote a circular economy on your campus.</p>
              </CardContent>
            </Card>

            <Card className="bg-cyan-50/50 dark:bg-cyan-950/20 border-border shadow-lg shadow-cyan-900/5 dark:shadow-none group hover:-translate-y-2 transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <div className="mx-auto bg-cyan-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-cyan-600 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800">Community Driven</h3>
                <p className="text-neutral-600">Connect with peers securely, build trust through ratings, and collaborate on projects.</p>
              </CardContent>
            </Card>

            <Card className="bg-violet-50/50 dark:bg-violet-950/20 border-border shadow-lg shadow-violet-900/5 dark:shadow-none group hover:-translate-y-2 transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <div className="mx-auto bg-violet-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-violet-600 group-hover:scale-110 transition-transform">
                  <Wrench className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800">Save Money</h3>
                <p className="text-neutral-600">Borrow expensive textbooks and lab equipment instead of buying them brand new.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Explore by Category</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Find exactly what you need for this semester, from textbooks to microcontrollers.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Books", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
              { name: "Electronics", icon: Cpu, color: "text-amber-500", bg: "bg-amber-50" },
              { name: "Lab Materials", icon: FlaskConical, color: "text-rose-500", bg: "bg-rose-50" },
              { name: "Hardware Tools", icon: Wrench, color: "text-emerald-500", bg: "bg-emerald-50" },
            ].map((cat) => (
              <Link href={`/browse?category=${cat.name}`} key={cat.name}>
                <div className={`p-6 rounded-2xl ${cat.bg} border border-transparent hover:border-${cat.color.split("-")[1]}-200 cursor-pointer transition-all duration-300 hover:shadow-md group flex flex-col items-center dark:bg-muted dark:hover:bg-muted/80`}>
                  <cat.icon className={`w-10 h-10 ${cat.color} mb-3 group-hover:scale-110 transition-transform`} />
                  <span className="font-medium text-foreground">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
