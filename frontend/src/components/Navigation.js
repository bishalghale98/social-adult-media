'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Search, UserPlus, MessageCircle, User, LogOut, Menu, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';

const navItems = [
    { href: '/app/discover', label: 'Discover', icon: Search },
    { href: '/app/requests', label: 'Requests', icon: UserPlus },
    { href: '/app/chats', label: 'Chats', icon: MessageCircle },
    { href: '/app/profile', label: 'Profile', icon: User },
    { href: '/app/settings', label: 'Settings', icon: Settings },
];

export default function Navigation() {
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const username = user?.profile?.username || 'User';

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-[260px] border-r border-white/[0.06] bg-zinc-950 h-screen sticky top-0">
                <div className="px-6 py-7">
                    <Link href="/app/discover" className="text-2xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent block">
                        PrivateConnect
                    </Link>
                </div>

                <Separator className="bg-white/[0.06]" />

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[0.925rem] font-medium transition-all duration-200 group",
                                            isActive
                                                ? "bg-purple-500/10 text-white"
                                                : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "w-[22px] h-[22px] transition-colors shrink-0",
                                            isActive ? "text-purple-400" : "text-zinc-500 group-hover:text-zinc-300"
                                        )} />
                                        <span>{item.label}</span>
                                        {isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
                                        )}
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-zinc-900 text-zinc-200 border-white/10">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>

                <div className="px-3 pb-4">
                    <Separator className="bg-white/[0.06] mb-4" />

                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                        <Avatar className="h-9 w-9 border border-white/10">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold">
                                {username[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-200 truncate">{username}</p>
                            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="w-full justify-start gap-3.5 px-4 py-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl font-medium"
                    >
                        <LogOut className="w-[22px] h-[22px]" />
                        <span className="text-sm">Log Out</span>
                    </Button>
                </div>
            </aside>

            {/* Mobile Top Header */}
            <header className="md:hidden sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
                <Link href="/app/discover" className="text-xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    PrivateConnect
                </Link>
                <div className="flex items-center gap-2">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/10">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-zinc-950 border-white/[0.06] w-[280px] p-0">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <div className="flex flex-col h-full">
                                <div className="px-6 py-5">
                                    <span className="text-xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                        PrivateConnect
                                    </span>
                                </div>
                                <Separator className="bg-white/[0.06]" />

                                <nav className="flex-1 px-3 py-4 space-y-1">
                                    {navItems.map((item) => {
                                        const isActive = pathname.startsWith(item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3.5 px-4 py-3 rounded-xl text-[0.925rem] font-medium transition-all",
                                                    isActive
                                                        ? "bg-purple-500/10 text-white"
                                                        : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                                                )}
                                            >
                                                <item.icon className={cn(
                                                    "w-5 h-5",
                                                    isActive ? "text-purple-400" : "text-zinc-500"
                                                )} />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                <div className="px-3 pb-6">
                                    <Separator className="bg-white/[0.06] mb-4" />
                                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                                        <Avatar className="h-9 w-9 border border-white/10">
                                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold">
                                                {username[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-zinc-200 truncate">{username}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => { logout(); setMobileOpen(false); }}
                                        className="w-full justify-start gap-3 px-4 py-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="text-sm font-medium">Log Out</span>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            {/* Mobile Bottom Tab Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/90 border-t border-white/[0.06] px-2 py-1.5 pb-safe flex items-center justify-around backdrop-blur-xl">
                {navItems.slice(0, 4).map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all",
                                isActive ? "text-purple-400" : "text-zinc-500 active:scale-95"
                            )}
                        >
                            <item.icon className={cn("w-[22px] h-[22px] mb-0.5", isActive ? "text-purple-400" : "text-zinc-500")} />
                            <span className={cn(
                                "text-[10px] font-medium",
                                isActive ? "text-purple-400" : "text-zinc-500"
                            )}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
