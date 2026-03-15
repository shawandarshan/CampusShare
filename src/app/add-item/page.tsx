"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Trash2, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AddItemPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(false);
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
    const [previews, setPreviews] = useState<string[]>([]);

    if (status === "unauthenticated") {
        if (typeof window !== "undefined") router.push("/auth/signin");
        return null;
    }

    const handleFiles = (files: FileList | File[]) => {
        const newFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
        
        if (newFiles.length === 0) {
            toast({
                title: "Invalid file",
                description: "Please upload image files only.",
                variant: "destructive",
            });
            return;
        }

        setImages(prev => [...prev, ...newFiles]);

        // Create previews
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(previews[index]);
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleMimeTypeUpload = async (): Promise<string[]> => {
        const uploadedUrls: string[] = [];
        for (const file of images) {
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);
            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            });
            if (res.ok) {
                const data = await res.json();
                uploadedUrls.push(data.url);
            }
        }
        return uploadedUrls;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const uploadedImageUrls = await handleMimeTypeUpload();

            const requestBody = {
                ...formData,
                images: uploadedImageUrls,
                ownerId: session?.user ? {
                    _id: session.user.email,
                    name: session.user.name,
                    college: "Meenakshi College of Engineering",
                    profileImage: session.user.image
                } : null
            };

            const res = await fetch("/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!res.ok) {
                throw new Error("Failed to add item");
            }

            toast({
                title: "Success!",
                description: "Your item has been successfully listed.",
            });

            router.push("/browse");
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl px-4 py-12">
            <Card className="shadow-lg border-neutral-200">
                <CardHeader className="space-y-1 text-center pb-8 border-b">
                    <CardTitle className="text-3xl font-bold tracking-tight text-neutral-900">List a Resource</CardTitle>
                    <CardDescription className="text-neutral-600">
                        Share, lend, sell, or donate your items to help other students on campus.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-neutral-900 font-medium">Item Name</Label>
                            <Input
                                id="name"
                                required
                                className="text-neutral-900 bg-white placeholder:text-neutral-400"
                                placeholder="e.g. Arduino Uno R3"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-neutral-900 font-medium">Category</Label>
                                <Select required onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val as string }))}>
                                    <SelectTrigger className="text-neutral-900 bg-white">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Books">Books</SelectItem>
                                        <SelectItem value="Electronics">Electronics</SelectItem>
                                        <SelectItem value="Tools">Tools</SelectItem>
                                        <SelectItem value="Lab Materials">Lab Materials</SelectItem>
                                        <SelectItem value="Project Components">Project Components</SelectItem>
                                        <SelectItem value="Gadgets">Gadgets</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="condition" className="text-neutral-900 font-medium">Condition</Label>
                                <Select required onValueChange={(val) => setFormData((prev) => ({ ...prev, condition: val as string }))}>
                                    <SelectTrigger className="text-neutral-900 bg-white">
                                        <SelectValue placeholder="Select Condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Borrow">Borrow</SelectItem>
                                        <SelectItem value="Sell">Sell</SelectItem>
                                        <SelectItem value="Donate">Donate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-neutral-900 font-medium">Description</Label>
                            <Textarea
                                id="description"
                                required
                                placeholder="Describe the item, any missing parts, or usage instructions..."
                                className="resize-none text-neutral-900 bg-white placeholder:text-neutral-400"
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="mode" className="text-neutral-900 font-medium">Sharing Mode</Label>
                                <Select required onValueChange={(val: string) => setFormData((prev) => ({ ...prev, mode: val }))}>
                                    <SelectTrigger className="text-neutral-900 bg-white border-emerald-200">
                                        <SelectValue placeholder="Select Mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Borrow">Borrow</SelectItem>
                                        <SelectItem value="Sell">Sell (Direct Sale)</SelectItem>
                                        <SelectItem value="Donate">Donate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.mode === "Sell" ? (
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-emerald-700 font-semibold flex items-center gap-1">
                                        Price (₹)
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="price"
                                            type="number"
                                            required={formData.mode === "Sell"}
                                            className="text-neutral-900 bg-white border-emerald-300 pl-8"
                                            placeholder="Set your price"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                        <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-emerald-600" />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label htmlFor="availability" className="text-neutral-900 font-medium">Availability</Label>
                                    <Input
                                        id="availability"
                                        required={formData.mode !== "Sell"}
                                        className="text-neutral-900 bg-white placeholder:text-neutral-400"
                                        placeholder="e.g. 7 days, permanent"
                                        value={formData.availability}
                                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Label className="text-neutral-900 font-medium">Resources Images</Label>
                            
                            <div 
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                className={`mt-2 flex justify-center rounded-xl border-2 border-dashed transition-all duration-200 px-6 py-10 ${
                                    isDragging 
                                    ? "border-emerald-500 bg-emerald-50/50 scale-[1.01]" 
                                    : "border-neutral-200 bg-neutral-50/30 hover:bg-neutral-50 hover:border-neutral-300"
                                }`}
                            >
                                <div className="text-center">
                                    <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                                        isDragging ? "bg-emerald-100 text-emerald-600" : "bg-neutral-100 text-neutral-400"
                                    }`}>
                                        <Upload className="h-8 w-8" />
                                    </div>
                                    <div className="flex text-sm leading-6 text-neutral-600 justify-center">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md font-semibold text-emerald-600 hover:text-emerald-500 focus-within:outline-none"
                                        >
                                            <span>Upload images</span>
                                            <Input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        handleFiles(e.target.files);
                                                    }
                                                }}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-neutral-400">Up to 5 images (PNG, JPG, GIF)</p>
                                </div>
                            </div>

                            {/* Previews */}
                            {previews.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                                    {previews.map((preview, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 group">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all hover:-translate-y-0.5" 
                            disabled={isLoading || (formData.mode === "Sell" && !formData.price)}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Listing your resource...
                                </div>
                            ) : "List Resource"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
