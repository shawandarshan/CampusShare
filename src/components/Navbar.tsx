"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuGroup,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Menu, X } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

export default function Navbar() {
    const { data: session } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                        CampusShare
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden sm:flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Link href="/browse">
                            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-neutral-900 border border-neutral-200 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 bg-white shadow-sm flex items-center justify-center">
                                <Search className="h-5 w-5" strokeWidth={2.5} />
                            </Button>
                        </Link>

                        {session && (
                            <Link href="/add-item">
                                <Button variant="ghost" size="icon" title="Share Item" className="rounded-full h-10 w-10 text-emerald-700 border border-emerald-200 hover:border-emerald-500 hover:text-emerald-800 hover:bg-emerald-100 bg-emerald-50 shadow-sm flex items-center justify-center">
                                    <Plus className="h-5 w-5" strokeWidth={2.5} />
                                </Button>
                            </Link>
                        )}
                    </div>

                    {session ? (
                        <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
                            <NotificationBell />
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none">
                                    <div role="button" className="relative h-9 w-9 rounded-full cursor-pointer ring-2 ring-transparent hover:ring-emerald-500 transition-all shadow-sm">
                                        <Avatar className="h-9 w-9 border border-neutral-200">
                                            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                                            <AvatarFallback className="bg-emerald-100 text-emerald-800 font-medium">
                                                {session.user?.name?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" sideOffset={4}>
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <Link href="/dashboard"><DropdownMenuItem>Dashboard</DropdownMenuItem></Link>
                                    <Link href="/requests"><DropdownMenuItem>My Requests</DropdownMenuItem></Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/auth/signin">
                                <Button variant="ghost" className="text-neutral-700">Sign In</Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile: icons + hamburger */}
                <div className="flex sm:hidden items-center gap-2">
                    <Link href="/browse">
                        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-neutral-700 border border-neutral-200 bg-white">
                            <Search className="h-4 w-4" />
                        </Button>
                    </Link>
                    {session && (
                        <NotificationBell />
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-9 w-9 text-neutral-700 border border-neutral-200 bg-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div className="sm:hidden border-t border-neutral-100 bg-white px-4 py-4 space-y-2 shadow-lg">
                    {session ? (
                        <>
                            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-neutral-100">
                                <Avatar className="h-10 w-10 border border-neutral-200">
                                    <AvatarImage src={session.user?.image || ""} />
                                    <AvatarFallback className="bg-emerald-100 text-emerald-800 font-medium">
                                        {session.user?.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-neutral-900 text-sm">{session.user?.name}</p>
                                    <p className="text-xs text-neutral-500">{session.user?.email}</p>
                                </div>
                            </div>
                            <Link href="/add-item" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full justify-start border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                    <Plus className="mr-2 h-4 w-4" /> List an Item
                                </Button>
                            </Link>
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start text-neutral-800 hover:bg-neutral-50">Dashboard</Button>
                            </Link>
                            <Link href="/requests" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start text-neutral-800 hover:bg-neutral-50">My Requests</Button>
                            </Link>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                            >
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start text-neutral-800">Sign In</Button>
                            </Link>
                            <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
