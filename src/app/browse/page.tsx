"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";

interface Item {
    _id: string;
    id?: string; // Supabase may use 'id' instead of '_id'
    name: string;
    category: string;
    condition: string;
    images: string[] | null;
    mode: string;
    price?: string;
    ownerId: {
        _id?: string;
        name: string;
        college?: string;
        profileImage?: string;
    } | null;
    createdAt: string;
}

function BrowseContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "All";

    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState(initialCategory);

    const categories = ["All", "Books", "Electronics", "Tools", "Lab Materials", "Project Components", "Gadgets", "Other"];

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const qs = new URLSearchParams();
            if (activeCategory !== "All") qs.append("category", activeCategory);
            if (searchQuery) qs.append("q", searchQuery);

            const res = await fetch(`/api/items?${qs.toString()}`);
            const data = await res.json();
            if (data.items) {
                // Normalize items: handle both _id (legacy) and id (Supabase)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const normalized = data.items.map((item: any) => ({
                    ...item,
                    _id: item._id || item.id,
                    images: Array.isArray(item.images) ? item.images : [],
                    ownerId: item.ownerId || { name: "Unknown", college: "", profileImage: "" },
                }));
                setItems(normalized);
            }
        } catch (error) {
            console.error("Failed to fetch items:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchItems();
        }, 300); // debounce API requests for search

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, activeCategory]);

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="flex flex-col gap-3 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600">
                        Browse Resources
                    </h1>
                    <p className="text-neutral-500 mt-1 text-sm">Find the equipment and materials you need.</p>
                </div>

                <div className="relative w-full">
                    <Input
                        placeholder="Search items, books, tools..."
                        className="pl-10 text-neutral-900 placeholder:text-neutral-400 bg-white border-neutral-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters — horizontal pills on mobile, vertical list on desktop */}
                <div className="w-full md:w-56 shrink-0">
                    <h3 className="font-semibold mb-2 text-sm text-neutral-900 md:text-base md:mb-3">Categories</h3>
                    {/* Mobile: horizontal scroll */}
                    <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm transition-colors shrink-0 ${
                                    activeCategory === cat
                                        ? "bg-emerald-600 text-white font-medium shadow-sm"
                                        : "text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    {/* Desktop: vertical list */}
                    <div className="hidden md:flex flex-col space-y-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                    activeCategory === cat
                                        ? "bg-emerald-600 text-white font-medium shadow-sm"
                                        : "text-neutral-800 bg-transparent hover:bg-neutral-100"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-neutral-300">
                            <h3 className="text-xl font-medium text-neutral-800">No resources found</h3>
                            <p className="text-neutral-500 mt-2">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        /* Mobile: 2-col compact cards | sm+: 2-col | lg: 3-col tall cards */
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                            {items.map((item) => (
                                <Link key={item._id} href={`/item/${item._id || item.id}`}>
                                    {/* ── Mobile card: compact vertical with small image ── */}
                                    <div className="sm:hidden group rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] h-full flex flex-col">
                                        {/* Image — fixed small height */}
                                        <div className="relative w-full h-28 bg-neutral-100 overflow-hidden">
                                            {item.images && item.images.length > 0 ? (
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-neutral-300 flex-col gap-1">
                                                    <span className="text-2xl">📦</span>
                                                </div>
                                            )}
                                            <span className="absolute top-1.5 right-1.5 text-[10px] font-semibold bg-white/90 text-emerald-700 px-1.5 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                                                {item.mode}
                                            </span>
                                            {item.mode === "Sell" && item.price && (
                                                <div className="absolute bottom-1.5 left-1.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                                    ₹{item.price}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-2.5 flex flex-col flex-1">
                                            <p className="font-semibold text-neutral-900 text-xs leading-tight line-clamp-2 mb-1.5">
                                                {item.name}
                                            </p>
                                            <div className="flex flex-wrap gap-1 mb-auto">
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                                                    {item.category}
                                                </span>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-neutral-200 text-neutral-500">
                                                    {item.condition}
                                                </span>
                                            </div>
                                            <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center gap-1.5">
                                                <Avatar className="h-4 w-4 shrink-0">
                                                    <AvatarImage src={item.ownerId?.profileImage || ""} />
                                                    <AvatarFallback className="text-[8px] bg-emerald-100 text-emerald-800">
                                                        {item.ownerId?.name?.charAt(0) || "?"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-[10px] text-neutral-500 truncate">
                                                    {item.ownerId?.name || "Unknown"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Desktop card: compact tall card with smaller image ── */}
                                    <div className="hidden sm:flex group rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 h-full flex-col">
                                        {/* Image — fixed height to make it smaller than before */}
                                        <div className="relative w-full h-48 bg-neutral-100 overflow-hidden">
                                            {item.images && item.images.length > 0 ? (
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-neutral-300 flex-col gap-2">
                                                    <span className="text-4xl">📦</span>
                                                    <span className="text-sm">No Image</span>
                                                </div>
                                            )}
                                            <span className="absolute top-3 right-3 text-xs font-semibold bg-white/95 text-emerald-700 px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm border border-neutral-100">
                                                {item.mode}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 flex flex-col flex-1">
                                            <h3 className="font-bold text-neutral-900 text-lg leading-tight line-clamp-1 group-hover:text-emerald-600 transition-colors mb-2">
                                                {item.name}
                                            </h3>
                                            
                                            <div className="flex flex-wrap gap-2 mb-auto">
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                                                    {item.category}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 rounded-full border border-neutral-200 text-neutral-500">
                                                    {item.condition}
                                                </span>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-7 w-7 shrink-0 border border-neutral-200">
                                                        <AvatarImage src={item.ownerId?.profileImage || ""} />
                                                        <AvatarFallback className="text-[10px] bg-emerald-100 text-emerald-800">
                                                            {item.ownerId?.name?.charAt(0) || "?"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-neutral-800 truncate max-w-[100px]">
                                                        {item.ownerId?.name || "Unknown"}
                                                    </span>
                                                    <span className="text-[10px] text-neutral-500 truncate max-w-[100px]">
                                                        {item.ownerId?.college || "Meenakshi College of Engineering"}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {item.mode === "Sell" && item.price ? (
                                                <div className="text-emerald-700 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shadow-sm">
                                                    ₹{item.price}
                                                </div>
                                            ) : (
                                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-8 px-3 rounded-lg text-xs">
                                                    View Details
                                                </Button>
                                            )}
                                        </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function BrowsePage() {
    return (
        <Suspense fallback={
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            </div>
        }>
            <BrowseContent />
        </Suspense>
    );
}

