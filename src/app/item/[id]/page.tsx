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

    const ownerName = item.ownerId?.name || "Anonymous";
    const ownerCollege = item.ownerId?.college || "Campus Member";
    const ownerImage = item.ownerId?.profileImage || item.ownerId?.image || "";
    const ownerInitial = ownerName.charAt(0).toUpperCase();

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8">
            <Link href="/browse" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-emerald-600 mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Resources
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Images Section */}
                <div className="space-y-4">
                    <div className="aspect-square rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-200 relative">
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
                            <Badge className="absolute top-4 left-4 bg-emerald-600 text-white border-0 shadow-md capitalize">
                                {item.mode}
                            </Badge>
                        )}
                    </div>

                    {item.images && item.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {item.images.map((img: string, idx: number) => (
                                <div key={idx} className="h-20 w-20 flex-shrink-0 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200">
                                    <img src={img} alt={`${item.name} ${idx}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="flex flex-col gap-6">
                    {/* Title & Badges */}
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            {item.category && (
                                <Badge variant="outline" className="text-neutral-600">
                                    <Tag className="mr-1 h-3 w-3" />{item.category}
                                </Badge>
                            )}
                            {item.condition && (
                                <Badge className="bg-emerald-100 text-emerald-800 border-0">
                                    <Wrench className="mr-1 h-3 w-3" />Condition: {item.condition}
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">{item.name}</h1>
                        {(item.mode || item.availability) && (
                            <p className="text-neutral-500 capitalize">
                                {item.mode && `${item.mode}`}
                                {item.availability && ` • Available for ${item.availability}`}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                            <h3 className="text-base font-semibold text-neutral-900 mb-2">Description</h3>
                            <p className="text-neutral-600 whitespace-pre-wrap leading-relaxed text-sm">
                                {item.description}
                            </p>
                        </div>
                    )}

                    {/* Owner Card */}
                    <Card className="border-neutral-200 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-emerald-100 shadow-sm">
                                    <AvatarImage src={ownerImage} />
                                    <AvatarFallback className="bg-emerald-100 text-emerald-800 font-semibold text-lg">
                                        {ownerInitial}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-emerald-600/70" />
                                        <p className="font-semibold text-neutral-900">{ownerName}</p>
                                    </div>
                                    <div className="flex flex-col mt-1 gap-0.5">
                                        <p className="text-sm font-medium text-neutral-700">{ownerCollege}</p>
                                        {(item.ownerId?.department || item.ownerId?.year) && (
                                            <p className="text-xs text-neutral-500">
                                                {item.ownerId?.department && `${item.ownerId.department}`}
                                                {item.ownerId?.department && item.ownerId?.year && " • "}
                                                {item.ownerId?.year && `Year ${item.ownerId.year}`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2 border-t border-neutral-100">
                        <Button
                            onClick={handleRequest}
                            className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                            disabled={isRequesting}
                        >
                            {isRequesting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Sending Request...
                                </>
                            ) : (
                                `Request to ${item.mode || "Borrow"}`
                            )}
                        </Button>

                        <Button variant="outline" className="w-full h-10 text-neutral-600 hover:text-neutral-900">
                            <Share2 className="mr-2 h-4 w-4" /> Share This Resource
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
