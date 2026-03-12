"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Loader2, Package, MapPin, Mail, Settings, Edit3, Share2, BookOpen, Calendar, Phone, Check, X } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { toast } = useToast();

    const [profile, setProfile] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        college: "",
        department: "",
        year: "",
        contact: ""
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
            return;
        }

        if (status === "authenticated") {
            fetchDashboardData();
            fetchAiInsight();
        }
    }, [status, router]);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch("/api/user/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile(data.user);
                setItems(data.items);
            }
        } catch (error) {
            console.error("Failed to load dashboard:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAiInsight = async () => {
        setIsAiLoading(true);
        try {
            const res = await fetch("/api/ai/recommendation");
            if (res.ok) {
                const data = await res.json();
                setAiInsight(data.recommendation);
            }
        } catch (error) {
            console.error("Failed to load AI insight:", error);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleEditClick = () => {
        setEditForm({
            name: profile.name || "",
            college: profile.college || "",
            department: profile.department || "",
            year: profile.year || "",
            contact: profile.contact || ""
        });
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(data.user);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !profile) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-neutral-50">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    const activeCount = items.filter((i) => i.status === "Available").length;
    const sharedCount = items.filter((i) => i.status === "Unavailable").length;

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Profile Sidebar */}
                <div className="w-full md:w-80 shrink-0 space-y-6">
                    <Card className="border-neutral-200 shadow-sm overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-emerald-500 to-cyan-600 relative"></div>
                        <CardContent className="px-6 pb-6 relative pt-0">
                            <div className="flex justify-between items-start">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-lg -mt-12 bg-white">
                                    <AvatarImage src={profile.profileImage} />
                                    <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-800 font-semibold">
                                        {profile.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                {isEditing ? (
                                    <Button variant="ghost" size="icon" className="mt-2 -mr-2 text-rose-400 hover:text-rose-600" onClick={() => setIsEditing(false)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button variant="ghost" size="icon" className="mt-2 -mr-2 text-neutral-400 hover:text-emerald-600" onClick={handleEditClick}>
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="mt-4">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <Input
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            placeholder="Your Name"
                                            className="font-bold text-lg h-9 text-neutral-900 placeholder:text-neutral-400"
                                        />
                                        <Input
                                            value={editForm.college}
                                            onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                                            placeholder="College/University"
                                            className="h-8 text-sm text-neutral-900 placeholder:text-neutral-400"
                                        />
                                        <Input
                                            value={editForm.department}
                                            onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                                            placeholder="Department/Major"
                                            className="h-8 text-sm text-neutral-900 placeholder:text-neutral-400"
                                        />
                                        <Select
                                            value={editForm.year}
                                            onValueChange={(val) => setEditForm({ ...editForm, year: val || "" })}
                                        >
                                            <SelectTrigger className="h-8 text-sm text-neutral-900 data-[placeholder]:text-neutral-400">
                                                <SelectValue placeholder="Year (1, 2, 3, 4)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1</SelectItem>
                                                <SelectItem value="2">2</SelectItem>
                                                <SelectItem value="3">3</SelectItem>
                                                <SelectItem value="4">4</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            value={editForm.contact}
                                            onChange={(e) => {
                                                const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                                setEditForm({ ...editForm, contact: numericValue });
                                            }}
                                            placeholder="Contact Info (Phone Number)"
                                            className="h-8 text-sm text-neutral-900 placeholder:text-neutral-400"
                                        />
                                        <Button
                                            onClick={handleSaveProfile}
                                            disabled={isSaving}
                                            className="w-full h-8 mt-2 bg-emerald-600 hover:bg-emerald-700 text-xs"
                                        >
                                            {isSaving ? "Saving..." : "Save Profile"}
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-neutral-900">{profile.name || "User"}</h2>
                                        <div className="flex items-center text-sm text-neutral-500 mt-1">
                                            <MapPin className="h-4 w-4 mr-2 text-emerald-600/70" />
                                            {profile.college ? <span>{profile.college}</span> : <span className="text-emerald-600/50 italic cursor-pointer" onClick={handleEditClick}>Add College</span>}
                                        </div>
                                        <div className="flex items-center text-sm text-neutral-500 mt-2">
                                            <BookOpen className="h-4 w-4 mr-2 text-emerald-600/70" />
                                            {profile.department ? <span>{profile.department}</span> : <span className="text-emerald-600/50 italic cursor-pointer" onClick={handleEditClick}>Add Department</span>}
                                        </div>
                                        <div className="flex items-center text-sm text-neutral-500 mt-2">
                                            <Calendar className="h-4 w-4 mr-2 text-emerald-600/70" />
                                            {profile.year ? <span>{profile.year}</span> : <span className="text-emerald-600/50 italic cursor-pointer" onClick={handleEditClick}>Add Year</span>}
                                        </div>
                                        <div className="flex items-center text-sm text-neutral-500 mt-2">
                                            <Mail className="h-4 w-4 mr-2 text-emerald-600/70" />
                                            {profile.email || "Add Email"}
                                        </div>
                                        <div className="flex items-center text-sm text-neutral-500 mt-2">
                                            <Phone className="h-4 w-4 mr-2 text-emerald-600/70" />
                                            {profile.contact ? <span>{profile.contact}</span> : <span className="text-emerald-600/50 italic cursor-pointer" onClick={handleEditClick}>Add Contact</span>}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div className="flex flex-col">
                                    <div className="font-semibold text-emerald-700">{items.length}</div>
                                    <div className="text-xs text-emerald-600/70 mt-0.5">Total Listings</div>
                                </div>
                                <div className="h-8 w-px bg-emerald-200"></div>
                                <div className="flex flex-col items-end">
                                    <div className="font-semibold text-emerald-700">{activeCount}</div>
                                    <div className="text-xs text-emerald-600/70 mt-0.5">Active Items</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-200 shadow-sm hidden md:block">
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-sm font-semibold flex items-center text-neutral-900">
                                <Settings className="h-4 w-4 mr-2" /> Account Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="flex flex-col">
                                <Button variant="ghost" className="justify-start rounded-none h-12 px-6 text-neutral-900 hover:bg-neutral-50" onClick={handleEditClick}>Edit Profile</Button>
                                <Button variant="ghost" className="justify-start rounded-none h-12 px-6 text-neutral-900 hover:bg-neutral-50" onClick={() => toast({ title: "Coming Soon", description: "Notification preferences will be available in the next update." })}>Notification Preferences</Button>
                                <Button variant="ghost" className="justify-start rounded-none h-12 px-6 text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => toast({ title: "Action Disabled", description: "Account deletion is restricted in this demo workspace.", variant: "destructive" })}>Delete Account</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <Card className="bg-white border-neutral-200 shadow-sm">
                            <CardContent className="p-6 flex items-center">
                                <div className="bg-emerald-100 p-3 rounded-xl mr-4 text-emerald-600">
                                    <Package className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-neutral-900">{activeCount}</p>
                                    <p className="text-sm text-neutral-500 font-medium">Active Listings</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-neutral-200 shadow-sm">
                            <CardContent className="p-6 flex items-center">
                                <div className="bg-cyan-100 p-3 rounded-xl mr-4 text-cyan-600">
                                    <Share2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-neutral-900">{sharedCount}</p>
                                    <p className="text-sm text-neutral-500 font-medium">Items Shared</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mb-8 border-transparent bg-gradient-to-r from-emerald-50 to-cyan-50 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full opacity-20 blur-2xl"></div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center text-emerald-800">
                                <Star className="h-5 w-5 mr-2 text-emerald-600 fill-emerald-600/30" />
                                AI Assistant Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isAiLoading ? (
                                <div className="flex items-center text-sm text-neutral-500">
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing campus resources...
                                </div>
                            ) : (
                                <p className="text-neutral-700 italic text-sm leading-relaxed">
                                    "{aiInsight || "Why not share some of your items? Your campus community would appreciate it!"}"
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <div className="mb-6 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-neutral-900">Your Listings</h3>
                        <Link href="/add-item">
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Add New Item</Button>
                        </Link>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-neutral-300">
                            <Package className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                            <h3 className="text-lg font-medium text-neutral-800">No items listed</h3>
                            <p className="text-neutral-500 mt-2 mb-6">List your first item to start sharing with the campus.</p>
                            <Link href="/add-item">
                                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                    Create Listing
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {items.map((item) => (
                                <Card key={item._id} className="overflow-hidden border-neutral-200 shadow-sm flex flex-col">
                                    <div className="aspect-video bg-neutral-100 relative">
                                        {item.images && item.images.length > 0 ? (
                                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-neutral-400 text-sm">No Image</div>
                                        )}
                                        <Badge variant={item.status === "Available" ? "default" : "secondary"}
                                            className={`absolute top-3 right-3 border-0 shadow-sm ${item.status === 'Available' ? 'bg-emerald-600 text-white' : 'bg-white/90 text-neutral-700 backdrop-blur-sm'}`}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-4 flex-1">
                                        <h4 className="font-semibold text-neutral-900 mb-1 line-clamp-1">{item.name}</h4>
                                        <div className="flex justify-between items-center mt-3">
                                            <Badge variant="outline" className="text-neutral-500 bg-neutral-50">{item.mode}</Badge>
                                            <Link href={`/item/${item._id}`}>
                                                <Button variant="ghost" size="sm" className="h-8 text-neutral-500 hover:text-emerald-600">
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
