"use client";

import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, Share2, Package, User, Tag, Wrench } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // Fix: Next.js 15 params is a Promise — must use React.use()
    const { id } = use(params);
    const { data: session } = useSession();
    const router = useRouter();
    const { toast } = useToast();

    const [item, setItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRequesting, setIsRequesting] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await fetch(`/api/items/${id}`);
                if (!res.ok) throw new Error("Failed to fetch item");
                const data = await res.json();
                // Handle both { item: {...} } and direct item object
                setItem(data.item || data);
            } catch (error) {
                console.error("Error fetching item:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const handleRequest = async () => {
        if (!session) {
            router.push("/auth/signin");
            return;
        }

        setIsRequesting(true);
        try {
            const ownerName = item.ownerId?.name || "the owner";
            const mode = item.mode || "borrow";

            // Fetch the current user's saved profile to attach to the request
            let requesterProfile = { college: "", department: "", year: "", contact: "" };
            try {
                const profileRes = await fetch("/api/user/profile");
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    requesterProfile = {
                        college: profileData.user?.college || "Meenakshi College of Engineering",
                        department: profileData.user?.department || "",
                        year: profileData.user?.year || "",
                        contact: profileData.user?.contact || "",
                    };
                }
            } catch { }

            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itemId: item._id || item.id,
                    itemName: item.name || "",
                    ownerId: item.ownerId?._id || item.ownerId?.email || "unknown",
                    ownerEmail: item.ownerId?._id?.includes("@")
                        ? item.ownerId._id
                        : item.ownerId?.email || "",
                    message: `Hi ${ownerName}, I would like to ${mode.toLowerCase()} this listing. Is it still available?`,
                    // Profile data auto-attached from saved profile
                    requesterCollege: requesterProfile.college,
                    requesterDept: requesterProfile.department,
                    requesterYear: requesterProfile.year,
                    requesterPhone: requesterProfile.contact,
                    // New: Include price and mode for notifications
                    itemPrice: item.price || "",
                    itemMode: item.mode || "Borrow",
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to submit request");
            }

            toast({
                title: "Request Sent!",
                description: `Your ${mode.toLowerCase()} request has been sent to ${ownerName}.`,
            });

            router.push("/requests");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsRequesting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <Package className="mx-auto h-16 w-16 text-neutral-300 mb-4" />
                <h1 className="text-2xl font-bold text-neutral-900">Item not found</h1>
                <p className="mt-2 text-neutral-500">The resource you are looking for might have been removed.</p>
                <Link href="/browse">
                    <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700">Back to Browse</Button>
                </Link>
            </div>
        );
    }
    const ownerIdStr = item.ownerId?._id || item.ownerId || "";
    const currentUserId = (session?.user as any)?.id || session?.user?.email;
    const isOwner = session && (ownerIdStr === currentUserId);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this resource? This action cannot be undone.")) return;

        setIsRequesting(true);
        try {
            const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete item");

            toast({
                title: "Resource Deleted",
                description: "The item has been successfully removed.",
            });
            router.push("/browse");
        } catch (error: any) {
            toast({
                title: "Deletion Failed",
                description: error.message || "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsRequesting(false);
        }
    };

    const ownerName = item.ownerId?.name || "Anonymous";
    const ownerCollege = item.ownerId?.college || "Campus Member";
    const ownerImage = item.ownerId?.profileImage || item.ownerId?.image || "";
    const ownerInitial = ownerName.charAt(0).toUpperCase();

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8">
            <Link href="/browse" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-emerald-600 mb-6 transition-colors font-student">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Resources
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Images Section */}
                <div className="space-y-4">
                    <div className="aspect-square rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-200 relative shadow-inner">
                        {item.images && item.images.length > 0 ? (
                            <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center flex-col gap-3 text-neutral-400">
                                <Package className="h-16 w-16" />
                                <span className="text-sm">No image provided</span>
                            </div>
                        )}
                        {item.mode && (
                            <Badge className="absolute top-4 left-4 bg-emerald-600/90 backdrop-blur-sm text-white border-0 shadow-lg capitalize px-4 py-1">
                                {item.mode}
                            </Badge>
                        )}
                    </div>

                    {item.images && item.images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {item.images.map((img: string, idx: number) => (
                                <div key={idx} className="h-20 w-20 flex-shrink-0 rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200 transition-transform hover:scale-105 cursor-pointer">
                                    <img src={img} alt={`${item.name} ${idx}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="flex flex-col gap-6">
                    {/* Title & Badges */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-0.5 rounded-full font-medium">
                                        {item.category || "General"}
                                    </Badge>
                                    <Badge variant="outline" className="bg-neutral-50 text-neutral-600 border-neutral-100 px-3 py-0.5 rounded-full font-medium">
                                        {item.condition || "Good"} Condition
                                    </Badge>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-0.5 rounded-full font-medium">
                                        {item.mode || "Borrow"}
                                    </Badge>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                                    {item.name || "Resource Item"}
                                </h1>
                            </div>

                        </div>
                        {(item.mode || item.availability) && (
                            <p className="text-neutral-500 capitalize flex items-center gap-2 font-medium">
                                {item.mode && `${item.mode}`}
                                {item.availability && (
                                    <>
                                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                                        Available for {item.availability}
                                    </>
                                )}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 text-neutral-100 group-hover:text-neutral-200 transition-colors">
                                <Package className="h-12 w-12" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
                                <Tag className="h-5 w-5 text-emerald-600" />
                                Description
                            </h3>
                            <p className="text-neutral-600 whitespace-pre-wrap leading-relaxed relative z-10 font-medium">
                                {item.description}
                            </p>
                        </div>
                    )}

                    {/* Owner Card */}
                    <Card className="border-neutral-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-5">
                                <Avatar className="h-14 w-14 border-2 border-emerald-100 shadow-sm">
                                    <AvatarImage src={ownerImage} />
                                    <AvatarFallback className="bg-emerald-100 text-emerald-800 font-bold text-xl">
                                        {ownerInitial}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <User className="h-4 w-4 text-emerald-600" />
                                        <p className="font-bold text-neutral-900 text-lg">{ownerName}</p>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-sm font-semibold text-neutral-700">{ownerCollege}</p>
                                        {(item.ownerId?.department || item.ownerId?.year) && (
                                            <p className="text-xs text-neutral-500 font-medium flex items-center gap-2">
                                                {item.ownerId?.department && `${item.ownerId.department}`}
                                                {item.ownerId?.department && item.ownerId?.year && <span className="h-1 w-1 rounded-full bg-neutral-300" />}
                                                {item.ownerId?.year && `Year ${item.ownerId.year}`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="space-y-4 pt-4 border-t border-neutral-100">
                        {isOwner ? (
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    onClick={() => router.push(`/item/${id}/edit`)}
                                    className="h-12 bg-white text-emerald-700 border-2 border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm font-bold rounded-xl"
                                >
                                    Edit Resource
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    variant="destructive"
                                    className="h-12 bg-rose-50 text-rose-600 border-2 border-rose-100 hover:bg-rose-100 hover:border-rose-200 shadow-sm font-bold rounded-xl"
                                    disabled={isRequesting}
                                >
                                    {isRequesting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Delete Listing"}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                                {item.mode === "Sell" && (
                                    <div className="flex-1 bg-emerald-50 border-2 border-emerald-100 rounded-2xl px-6 flex flex-col justify-center items-center sm:items-start group hover:bg-emerald-100/50 transition-colors py-3 sm:py-0">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70 mb-0.5">Price</span>
                                        <span className="text-2xl font-black text-emerald-900 leading-none">₹{item.price || item.itemPrice || "0"}</span>
                                    </div>
                                )}
                                <Button
                                    onClick={handleRequest}
                                    className={`h-14 text-lg font-black shadow-xl transition-all hover:-translate-y-1 active:scale-[0.98] rounded-2xl ${item.mode === "Sell" ? "flex-[1.5]" : "w-full"} ${
                                        item.mode === "Sell"
                                        ? "bg-emerald-700 hover:bg-emerald-800 shadow-emerald-900/20"
                                        : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                                    }`}
                                    disabled={isRequesting}
                                >
                                    {isRequesting ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        item.mode === "Sell" ? "Buy Resource" : `Request to ${item.mode || "Borrow"}`
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
