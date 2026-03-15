"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X, MessageSquare } from "lucide-react";

export default function RequestsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState("incoming");
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
            return;
        }

        if (status === "authenticated") {
            fetchRequests(activeTab);
        }
    }, [status, activeTab, router]);

    const fetchRequests = async (type: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/requests?type=${type}`);
            const data = await res.json();
            if (res.ok) {
                setRequests(data.requests);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateRequestStatus = async (id: string, newStatus: string) => {
        setIsUpdating(id);
        try {
            const res = await fetch(`/api/requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            toast({
                title: "Status Updated",
                description: `Request marked as ${newStatus}.`,
            });

            // Refresh data
            fetchRequests(activeTab);
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not update the request.",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "bg-amber-100 text-amber-800 border-amber-200";
            case "Approved":
                return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "Rejected":
                return "bg-rose-100 text-rose-800 border-rose-200";
            case "Completed":
            case "Returned":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-neutral-100 text-neutral-800 border-neutral-200";
        }
    };

    if (isLoading && requests.length === 0) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-neutral-900">Manage Requests</h1>
                <p className="text-neutral-500 mt-1">Simple view of all item requests.</p>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-neutral-300">
                        <MessageSquare className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                        <h3 className="text-lg font-medium text-neutral-800">No requests found</h3>
                        <p className="text-neutral-500 mt-2">
                            There are currently no requests to display.
                        </p>
                    </div>
                ) : (
                    requests.map((req: any) => (
                        <Card key={req._id} className="border-neutral-200 shadow-sm">
                            <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-neutral-900 text-lg">{req.itemMetadata?.name || "Unknown Item"}</h3>
                                        <Badge variant="outline" className={getStatusColor(req.status)}>
                                            {req.status === "Pending" ? "Holding Period" : req.status}
                                        </Badge>
                                        {req.itemMetadata?.price && (
                                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold">
                                                ₹{req.itemMetadata.price}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-neutral-600">
                                        Requested by: <span className="font-medium text-neutral-900">{req.requesterMetadata?.name || "Student"}</span> from {req.requesterMetadata?.college || "Meenakshi College of Engineering"}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                        {(req.requesterMetadata?.department || req.requesterMetadata?.year) && (
                                            <p className="text-xs text-neutral-500 font-medium">
                                                {req.requesterMetadata?.department && `${req.requesterMetadata.department}`}
                                                {req.requesterMetadata?.department && req.requesterMetadata?.year && " • "}
                                                {req.requesterMetadata?.year && `Year ${req.requesterMetadata.year}`}
                                            </p>
                                        )}
                                        {req.requesterMetadata?.phone && (
                                            <p className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                📞 {req.requesterMetadata.phone}
                                            </p>
                                        )}
                                    </div>
                                    {req.message && (
                                        <p className="text-sm text-neutral-500 italic mt-3 bg-neutral-50 p-3 rounded-xl border border-neutral-100 relative">
                                            <span className="absolute -top-2 left-3 bg-white px-2 text-[10px] text-neutral-400 font-bold uppercase tracking-wider border border-neutral-100 rounded">Message</span>
                                            "{req.message}"
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                    {req.status === "Pending" && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 sm:flex-none border-rose-200 text-rose-700 hover:bg-rose-50"
                                                onClick={() => updateRequestStatus(req._id, "Rejected")}
                                                disabled={isUpdating === req._id}
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700"
                                                onClick={() => updateRequestStatus(req._id, "Approved")}
                                                disabled={isUpdating === req._id}
                                            >
                                                Approve
                                            </Button>
                                        </>
                                    )}
                                    {req.status === "Approved" && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="w-full sm:w-auto bg-blue-50 text-blue-700 hover:bg-blue-100"
                                            onClick={() => updateRequestStatus(req._id, "Returned")}
                                            disabled={isUpdating === req._id}
                                        >
                                            Mark as Returned
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
