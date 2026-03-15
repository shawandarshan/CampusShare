"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Trash2, IndianRupee, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session, status } = useSession();
    const router = useRouter();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        condition: "",
        description: "",
        availability: "",
        mode: "",
        price: "",
    });

    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await fetch(`/api/items/${id}`);
                if (!res.ok) throw new Error("Failed to fetch item");
                const data = await res.json();
                const item = data.item || data;

                // Authorization check
                const currentUserId = (session?.user as any)?.id || session?.user?.email;
                const ownerId = item.ownerId?._id || item.ownerId || "";
                
                if (status === "authenticated" && ownerId !== currentUserId) {
                    toast({
                        title: "Unauthorized",
                        description: "You do not have permission to edit this listing.",
                        variant: "destructive",
                    });
                    router.push(`/item/${id}`);
                    return;
                }

                setFormData({
                    name: item.name || "",
                    category: item.category || "",
                    condition: item.condition || "",
                    description: item.description || "",
                    availability: item.availability || "",
                    mode: item.mode || "Borrow",
                    price: item.price || "",
                });
                setExistingImages(item.images || []);
            } catch (error) {
                console.error("Error fetching item:", error);
                toast({ title: "Error", description: "Failed to load resource data.", variant: "destructive" });
            } finally {
                setIsFetching(false);
            }
        };

        if (status === "authenticated") fetchItem();
        else if (status === "unauthenticated") router.push("/auth/signin");
    }, [id, status, session, router, toast]);

    const handleFiles = (files: FileList | File[]) => {
        const newFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
        setImages(prev => [...prev, ...newFiles]);
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeExistingImage = (idx: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== idx));
    };

    const removeNewImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        URL.revokeObjectURL(previews[idx]);
        setPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.mode === "Sell" && !formData.price) {
            toast({ title: "Price Required", description: "Please enter a price for items you wish to sell.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        try {
            // 1. Upload new images if any
            const newUploadedUrls: string[] = [];
            for (const file of images) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", file);
                const res = await fetch("/api/upload", { method: "POST", body: uploadFormData });
                if (res.ok) {
                    const data = await res.json();
                    newUploadedUrls.push(data.url);
                }
            }

            // 2. Combine existing and new images
            const finalImages = [...existingImages, ...newUploadedUrls];

            // 3. Update the item
            const res = await fetch(`/api/items/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    images: finalImages,
                }),
            });

            if (!res.ok) throw new Error("Failed to update resource");

            toast({ title: "Updated!", description: "Listing saved successfully." });
            router.push(`/item/${id}`);
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to save changes.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl px-4 py-12">
            <Link href={`/item/${id}`} className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-emerald-600 mb-6 transition-colors font-student">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Discard Changes
            </Link>

            <Card className="shadow-lg border-neutral-200 overflow-hidden rounded-3xl">
                <CardHeader className="space-y-1 text-center pb-8 border-b bg-neutral-50/50">
                    <CardTitle className="text-3xl font-black tracking-tight text-neutral-900">Edit Resource</CardTitle>
                    <CardDescription className="text-neutral-500 font-medium pt-2">
                        Update your listing details or sharing terms.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-neutral-900 font-bold ml-1">Item Name</Label>
                            <Input
                                id="name"
                                required
                                className="h-12 border-neutral-200 focus:border-emerald-500 rounded-xl"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-neutral-900 font-bold ml-1">Category</Label>
                                <Select value={formData.category} onValueChange={(val: string | null) => setFormData((prev) => ({ ...prev, category: val || "" }))}>
                                    <SelectTrigger className="h-12 border-neutral-200 rounded-xl">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Books">Books</SelectItem>
                                        <SelectItem value="Electronics">Electronics</SelectItem>
                                        <SelectItem value="Tools">Tools</SelectItem>
                                        <SelectItem value="Lab Materials">Lab Materials</SelectItem>
                                        <SelectItem value="Project Components">Project Components</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-neutral-900 font-bold ml-1">Condition</Label>
                                <Select value={formData.condition} onValueChange={(val: string | null) => setFormData((prev) => ({ ...prev, condition: val || "" }))}>
                                    <SelectTrigger className="h-12 border-neutral-200 rounded-xl">
                                        <SelectValue placeholder="Condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="New">New</SelectItem>
                                        <SelectItem value="Good">Good</SelectItem>
                                        <SelectItem value="Fair">Fair</SelectItem>
                                        <SelectItem value="Poor">Poor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-neutral-900 font-bold ml-1">Description</Label>
                            <Textarea
                                id="description"
                                required
                                className="min-h-[120px] border-neutral-200 rounded-2xl resize-none font-medium text-sm leading-relaxed"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-neutral-900 font-bold ml-1">Sharing Mode</Label>
                                <Select value={formData.mode} onValueChange={(val: string | null) => setFormData((prev) => ({ ...prev, mode: val || "" }))}>
                                    <SelectTrigger className="h-12 border-emerald-100 rounded-xl bg-emerald-50/20">
                                        <SelectValue placeholder="Mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Borrow">Borrow</SelectItem>
                                        <SelectItem value="Sell">Sell</SelectItem>
                                        <SelectItem value="Donate">Donate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {formData.mode === "Sell" ? (
                                <div className="space-y-2">
                                    <Label className="text-emerald-700 font-bold ml-1">Price (₹)</Label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-600" />
                                        <Input
                                            type="number"
                                            className="h-12 pl-10 border-emerald-200 rounded-xl font-bold"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label className="text-neutral-900 font-bold ml-1">Availability</Label>
                                    <Input
                                        className="h-12 border-neutral-200 rounded-xl"
                                        value={formData.availability}
                                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Label className="text-neutral-900 font-bold ml-1">Manage Images</Label>
                            
                            {/* Combined Image Gallery */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {existingImages.map((src, idx) => (
                                    <div key={`old-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-neutral-100 group">
                                        <img src={src} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" onClick={() => removeExistingImage(idx)} className="bg-white text-rose-600 p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {previews.map((src, idx) => (
                                    <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-emerald-200 group ring-2 ring-emerald-50 ring-offset-2">
                                        <img src={src} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" onClick={() => removeNewImage(idx)} className="bg-white text-rose-600 p-2 rounded-full shadow-lg">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="absolute top-1 left-1 bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase">New</div>
                                    </div>
                                ))}
                                {(existingImages.length + images.length) < 5 && (
                                    <label className="aspect-square rounded-xl border-2 border-dashed border-neutral-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-neutral-400 hover:text-emerald-600">
                                        <Upload className="h-6 w-6" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Add More</span>
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
                                    </label>
                                )}
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-14 text-lg font-black bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 rounded-2xl transition-all hover:-translate-y-1"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span>Saving Changes...</span>
                                </div>
                            ) : "Save & Update listing"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
