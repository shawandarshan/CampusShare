"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Bell, X, Phone, GraduationCap, Building, BookOpen, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Request {
    id?: string;
    _id?: string;
    item_id: string;
    item_name: string;
    requester_name: string;
    requester_email: string;
    requester_image: string;
    requester_college: string;
    requester_dept: string;
    requester_year: string;
    requester_phone: string;
    message: string;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    is_read: boolean;
}

export default function NotificationBell() {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const unreadCount = requests.filter((r) => !r.is_read).length;

    const fetchNotifications = async () => {
        if (!session) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/requests?type=incoming");
            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests || []);
            }
        } catch (err) {
            console.error("Failed to load notifications:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatus = async (requestId: string, status: "approved" | "rejected") => {
        try {
            await fetch(`/api/requests/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            // Update local state immediately
            setRequests((prev) =>
                prev.map((r) => (r.id === requestId ? { ...r, status, is_read: true } : r))
            );
        } catch (err) {
            console.error("Failed to update request status:", err);
        }
    };

    useEffect(() => {
        if (session) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [session]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!session) return null;

    const statusColor = (status: string) => {
        if (status === "approved") return "bg-emerald-100 text-emerald-700";
        if (status === "rejected") return "bg-red-100 text-red-700";
        return "bg-amber-100 text-amber-700";
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="relative" ref={ref}>
            {/* Bell Button */}
            <button
                onClick={() => { setOpen((prev) => !prev); if (!open) fetchNotifications(); }}
                className="relative h-10 w-10 rounded-full flex items-center justify-center border border-neutral-200 bg-white hover:border-amber-400 hover:bg-amber-50 transition-all shadow-sm"
                title="Notifications"
            >
                <Bell className="h-5 w-5 text-neutral-700" strokeWidth={2} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute right-0 top-14 w-96 max-h-[80vh] overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-900/10 z-50">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-neutral-100 px-4 py-3 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-neutral-900 text-sm">Incoming Requests</h3>
                            <p className="text-xs text-neutral-400">{requests.length} request{requests.length !== 1 ? "s" : ""} for your items</p>
                        </div>
                        <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Body */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 text-center px-4">
                            <Bell className="h-12 w-12 text-neutral-200 mb-3" />
                            <p className="text-neutral-500 font-medium text-sm">No incoming requests yet</p>
                            <p className="text-neutral-400 text-xs mt-1">When someone requests your item, it appears here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-50">
                            {requests.map((req) => (
                                <div
                                    key={req.id || req._id}
                                    className={`p-4 hover:bg-neutral-50 transition-colors ${!req.is_read ? "border-l-4 border-l-emerald-400" : ""}`}
                                >
                                    {/* Top: Avatar + Name + Status */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <Avatar className="h-10 w-10 flex-shrink-0 border border-neutral-200">
                                            <AvatarImage src={req.requester_image} />
                                            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold text-sm">
                                                {req.requester_name?.charAt(0) || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="font-semibold text-neutral-900 text-sm truncate">{req.requester_name || "Unknown"}</p>
                                                <Badge className={`text-[10px] px-2 py-0 rounded-full border-0 flex-shrink-0 ${statusColor(req.status)}`}>
                                                    {req.status}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-neutral-500 mt-0.5 truncate">{req.requester_email}</p>
                                        </div>
                                    </div>

                                    {/* Item Requested */}
                                    {req.item_name && (
                                        <div className="flex items-center gap-1.5 mb-2 bg-emerald-50 rounded-lg px-2 py-1.5">
                                            <BookOpen className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                                            <span className="text-xs font-medium text-emerald-800 truncate">Requesting: {req.item_name}</span>
                                        </div>
                                    )}

                                    {/* Profile Details Grid */}
                                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                                        {req.requester_college && (
                                            <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                                                <Building className="h-3 w-3 text-neutral-400 flex-shrink-0" />
                                                <span className="truncate">{req.requester_college}</span>
                                            </div>
                                        )}
                                        {req.requester_dept && (
                                            <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                                                <GraduationCap className="h-3 w-3 text-neutral-400 flex-shrink-0" />
                                                <span className="truncate">{req.requester_dept}</span>
                                            </div>
                                        )}
                                        {req.requester_year && (
                                            <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                                                <BookOpen className="h-3 w-3 text-neutral-400 flex-shrink-0" />
                                                <span>Year {req.requester_year}</span>
                                            </div>
                                        )}
                                        {req.requester_phone && (
                                            <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                                                <Phone className="h-3 w-3 text-neutral-400 flex-shrink-0" />
                                                <a href={`tel:${req.requester_phone}`} className="text-emerald-600 hover:underline font-medium">
                                                    {req.requester_phone}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Message */}
                                    {req.message && (
                                        <p className="text-xs text-neutral-500 italic bg-neutral-50 rounded-lg px-3 py-2 border border-neutral-100 mb-2 line-clamp-2">
                                            "{req.message}"
                                        </p>
                                    )}

                                    {/* Approve / Reject buttons for pending requests */}
                                    {req.status === "pending" && (
                                        <div className="flex gap-2 mt-2 mb-2">
                                            <button
                                                onClick={() => handleStatus(req.id!, "approved")}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all"
                                            >
                                                <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatus(req.id!, "rejected")}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all"
                                            >
                                                <XCircle className="h-3.5 w-3.5" /> Reject
                                            </button>
                                        </div>
                                    )}

                                    {/* Footer: timestamp */}
                                    <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                                        <Clock className="h-3 w-3" />
                                        {formatDate(req.created_at)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
