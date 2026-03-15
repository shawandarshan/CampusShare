"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // assuming shadcn generated this

export default function AddItemPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        condition: "",
        description: "",
        availability: "",
        mode: "",
    });

    // Note: For a hackathon, we can mock the actual image upload to Cloudinary and just store the mock URL, 
    // or use an internal API route to handle signed uploads. Here we will keep track of files.
    const [images, setImages] = useState<File[]>([]);

    if (status === "unauthenticated") {
        if (typeof window !== "undefined") router.push("/auth/signin");
        return null;
    }

    const handleMimeTypeUpload = async (): Promise<string[]> => {
        const uploadedUrls: string[] = [];
        for (const file of images) {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
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
                    _id: session.user.email, // using email as ID or you could use a proper session id
                    name: session.user.name,
                    college: "Meenakshi College of Engineering", // Mock or retrieve from profile
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
                        Share, lend, or donate your items to help other students on campus.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-neutral-900 font-medium">Item Name</Label>
                            <Input
                                id="name"
                                required
                                className="text-neutral-900 placeholder:text-neutral-400"
                                placeholder="e.g. Arduino Uno R3"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-neutral-900 font-medium">Category</Label>
                                <Select required onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val as string }))}>
                                    <SelectTrigger className="text-neutral-900">
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
                                    <SelectTrigger className="text-neutral-900">
                                        <SelectValue placeholder="Select Condition" />
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
                            <Label htmlFor="description" className="text-neutral-900 font-medium">Description</Label>
                            <Textarea
                                id="description"
                                required
                                placeholder="Describe the item, any missing parts, or usage instructions..."
                                className="resize-none text-neutral-900 placeholder:text-neutral-400"
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="mode" className="text-neutral-900 font-medium">Sharing Mode</Label>
                                <Select required onValueChange={(val) => setFormData((prev) => ({ ...prev, mode: val as string }))}>
                                    <SelectTrigger className="text-neutral-900">
                                        <SelectValue placeholder="Select Mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Borrow">Borrow</SelectItem>
                                        <SelectItem value="Exchange">Exchange</SelectItem>
                                        <SelectItem value="Donate">Donate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="availability" className="text-neutral-900 font-medium">Availability</Label>
                                <Input
                                    id="availability"
                                    required
                                    className="text-neutral-900 placeholder:text-neutral-400"
                                    placeholder="e.g. 7 days, permanent"
                                    value={formData.availability}
                                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-neutral-900 font-medium">Images</Label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 hover:text-emerald-500"
                                        >
                                            <span>Upload a file</span>
                                            <Input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        setImages(Array.from(e.target.files));
                                                    }
                                                }}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 5MB</p>
                                    {images.length > 0 && (
                                        <p className="mt-2 text-sm text-emerald-600">{images.length} file(s) selected</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                            {isLoading ? "Listing Item..." : "List Resource"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
