"use client";

import { useState, useEffect } from "react";
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
    availability: string;
    ownerId: {
        _id?: string;
        name: string;
        college?: string;
        profileImage?: string;
    } | null;
    createdAt: string;
}

export default function BrowsePage() {
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600">
                        Browse Resources
                    </h1>
                    <p className="text-neutral-500 mt-1">Find the equipment and materials you need.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Input
                        placeholder="Search items, books, tools..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full md:w-64 space-y-6">
                    <div>
                        <h3 className="font-semibold mb-3 text-lg">Categories</h3>
                        <div className="flex flex-col space-y-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === cat
                                        ? "bg-emerald-600 text-white font-medium shadow-sm"
                                        : "text-neutral-800 hover:bg-neutral-200"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-neutral-300">
                            <h3 className="text-xl font-medium text-neutral-800">No resources found</h3>
                            <p className="text-neutral-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((item) => (
                                <Card key={item._id} className="group overflow-hidden flex flex-col hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 border-neutral-200">
                                    <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                                        {item.images && item.images.length > 0 ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.name}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-neutral-300 flex-col gap-2">
                                                <span className="text-4xl">📦</span>
                                                <span className="text-sm">No Image</span>
                                            </div>
                                        )}
                                        <Badge className="absolute top-3 right-3 bg-white/90 text-emerald-700 hover:bg-white backdrop-blur-sm border-0 font-medium shadow-sm">
                                            {item.mode}
                                        </Badge>
                                    </div>

                                    <CardHeader className="p-4 pb-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                                {item.name}
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 font-normal">
                                                {item.category}
                                            </Badge>
                                            <Badge variant="outline" className="text-neutral-500 font-normal">
                                                {item.condition}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-4 flex-1">
                                        <div className="flex items-center gap-2 mt-2 pt-4 border-t border-neutral-100">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={item.ownerId?.profileImage || ""} />
                                                <AvatarFallback className="text-[10px] bg-emerald-100 text-emerald-800">
                                                    {item.ownerId?.name?.charAt(0) || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="text-sm text-neutral-600 truncate flex-1 flex flex-col">
                                                <span className="font-medium text-neutral-800">{item.ownerId?.name || "Unknown"}</span>
                                                {item.ownerId?.college && <span className="text-xs text-neutral-500">{item.ownerId.college}</span>}
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-4 pt-0">
                                        <Link href={`/item/${item._id || item.id}`} className="w-full">
                                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                                                View Details
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
