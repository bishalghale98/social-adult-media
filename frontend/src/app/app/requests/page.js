'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Inbox, Send, UserCheck, UserX, X } from 'lucide-react';

export default function RequestsPage() {
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [tab, setTab] = useState('incoming');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchRequests();
    }, []);

    async function fetchRequests() {
        setLoading(true);
        try {
            const [inc, out] = await Promise.all([
                api.get('/friends/requests/incoming'),
                api.get('/friends/requests/outgoing'),
            ]);
            setIncoming(inc.data);
            setOutgoing(out.data);
        } catch {
            // Ignore
        } finally {
            setLoading(false);
        }
    }

    async function acceptRequest(id) {
        try {
            const { data } = await api.post(`/friends/requests/${id}/accept`);
            setIncoming((prev) => prev.filter((r) => r.id !== id));
            if (data.conversation?.id) {
                router.push(`/app/chat/${data.conversation.id}`);
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed');
        }
    }

    async function rejectRequest(id) {
        try {
            await api.post(`/friends/requests/${id}/reject`);
            setIncoming((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed');
        }
    }

    async function cancelRequest(id) {
        try {
            await api.post(`/friends/requests/${id}/cancel`);
            setOutgoing((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed');
        }
    }

    return (
        <div className="animate-in max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Friend Requests</span>
                </h1>
                <p className="text-zinc-400">Manage your connections</p>
            </div>

            <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="bg-zinc-900 border border-white/[0.06] p-1 h-auto w-fit">
                    <TabsTrigger
                        value="incoming"
                        className="data-[state=active]:bg-purple-500/15 data-[state=active]:text-purple-300 data-[state=active]:shadow-none px-5 py-2 text-sm font-semibold rounded-lg gap-2"
                    >
                        <Inbox className="w-3.5 h-3.5" />
                        Incoming
                        {incoming.length > 0 && (
                            <Badge variant="secondary" className="ml-1 bg-purple-500/20 text-purple-300 border-0 text-[10px] px-1.5 py-0 h-4">
                                {incoming.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="outgoing"
                        className="data-[state=active]:bg-purple-500/15 data-[state=active]:text-purple-300 data-[state=active]:shadow-none px-5 py-2 text-sm font-semibold rounded-lg gap-2"
                    >
                        <Send className="w-3.5 h-3.5" />
                        Outgoing
                        {outgoing.length > 0 && (
                            <Badge variant="secondary" className="ml-1 bg-zinc-700 text-zinc-300 border-0 text-[10px] px-1.5 py-0 h-4">
                                {outgoing.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="incoming" className="mt-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Card key={i} className="bg-zinc-950/80 border-white/[0.06]">
                                    <CardContent className="p-5 flex items-center gap-4">
                                        <Skeleton className="h-14 w-14 rounded-full bg-zinc-800" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-28 bg-zinc-800" />
                                            <Skeleton className="h-3 w-36 bg-zinc-800" />
                                            <div className="flex gap-2">
                                                <Skeleton className="h-7 w-16 bg-zinc-800 rounded-md" />
                                                <Skeleton className="h-7 w-16 bg-zinc-800 rounded-md" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : incoming.length === 0 ? (
                        <Card className="bg-zinc-950/50 border-dashed border-white/10">
                            <CardContent className="py-16 text-center">
                                <Inbox className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                                <p className="text-lg font-semibold text-zinc-300 mb-1">No incoming requests</p>
                                <p className="text-sm text-zinc-500">You&apos;re all caught up!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {incoming.map((req) => (
                                <Card key={req.id} className="bg-zinc-950/80 border-white/[0.06] hover:border-white/10 transition-all duration-200">
                                    <CardContent className="p-5 flex items-center gap-4">
                                        <Avatar className="h-14 w-14 border border-white/10 shrink-0">
                                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg font-bold">
                                                {req.sender?.profile?.username?.[0]?.toUpperCase() || '?'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-base text-zinc-100 truncate">{req.sender?.profile?.username || 'Unknown'}</h3>
                                            <p className="text-sm text-zinc-500 truncate mb-3">
                                                {req.sender?.profile?.gender} · {req.sender?.profile?.city}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => acceptRequest(req.id)}
                                                    className="bg-purple-600 hover:bg-purple-500 text-white h-7 text-xs shadow-sm"
                                                >
                                                    <UserCheck className="w-3 h-3 mr-1" />
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => rejectRequest(req.id)}
                                                    className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 h-7 text-xs"
                                                >
                                                    <UserX className="w-3 h-3 mr-1" />
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="outgoing" className="mt-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2].map((i) => (
                                <Card key={i} className="bg-zinc-950/80 border-white/[0.06]">
                                    <CardContent className="p-5 flex items-center gap-4">
                                        <Skeleton className="h-14 w-14 rounded-full bg-zinc-800" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-28 bg-zinc-800" />
                                            <Skeleton className="h-3 w-20 bg-zinc-800" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : outgoing.length === 0 ? (
                        <Card className="bg-zinc-950/50 border-dashed border-white/10">
                            <CardContent className="py-16 text-center">
                                <Send className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                                <p className="text-lg font-semibold text-zinc-300 mb-1">No outgoing requests</p>
                                <p className="text-sm text-zinc-500">Go discover some new people.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {outgoing.map((req) => (
                                <Card key={req.id} className="bg-zinc-950/80 border-white/[0.06] hover:border-white/10 transition-all duration-200">
                                    <CardContent className="p-5 flex items-center gap-4">
                                        <Avatar className="h-14 w-14 border border-white/10 shrink-0">
                                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg font-bold">
                                                {req.receiver?.profile?.username?.[0]?.toUpperCase() || '?'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-base text-zinc-100 truncate">{req.receiver?.profile?.username || 'Unknown'}</h3>
                                            <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] mb-3">
                                                Pending Response
                                            </Badge>
                                            <div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => cancelRequest(req.id)}
                                                    className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 h-7 text-xs"
                                                >
                                                    <X className="w-3 h-3 mr-1" />
                                                    Cancel Request
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
