'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle } from 'lucide-react';

export default function ChatsPage() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchConversations();
    }, []);

    async function fetchConversations() {
        try {
            const { data } = await api.get('/conversations');
            setConversations(data);
        } catch {
            // Ignore
        } finally {
            setLoading(false);
        }
    }

    function formatTime(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now - d;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return d.toLocaleDateString();
    }

    return (
        <div className="animate-in max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Messages</span>
                </h1>
                <p className="text-zinc-400">Your conversations</p>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="bg-zinc-950/80 border-white/[0.06]">
                            <CardContent className="p-4 flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-full bg-zinc-800" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32 bg-zinc-800" />
                                    <Skeleton className="h-3 w-48 bg-zinc-800" />
                                </div>
                                <Skeleton className="h-3 w-16 bg-zinc-800" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : conversations.length === 0 ? (
                <Card className="bg-zinc-950/50 border-dashed border-white/10">
                    <CardContent className="py-16 text-center">
                        <MessageCircle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-zinc-300 mb-1">No conversations yet</p>
                        <p className="text-sm text-zinc-500">Add friends to start chatting!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {conversations.map((conv) => (
                        <Card
                            key={conv.id}
                            className="bg-zinc-950/80 border-white/[0.06] hover:border-purple-500/30 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/5 group"
                            onClick={() => router.push(`/app/chat/${conv.id}`)}
                        >
                            <CardContent className="p-4 flex items-center gap-4">
                                <Avatar className="h-12 w-12 border border-white/10 shrink-0">
                                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-base font-bold">
                                        {conv.otherUser?.username?.[0]?.toUpperCase() || '?'}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-semibold text-[0.95rem] text-zinc-100 truncate group-hover:text-white transition-colors">
                                            {conv.otherUser?.username || 'Unknown'}
                                        </h3>
                                        <span className="text-xs text-zinc-500 whitespace-nowrap ml-3 font-medium">
                                            {formatTime(conv.lastMessageAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-500 truncate">
                                        {conv.lastMessage?.bodyText || 'Start a conversation...'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
