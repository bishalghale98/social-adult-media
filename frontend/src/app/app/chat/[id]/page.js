'use client';
import { useState, useEffect, useRef, use, useMemo, useCallback } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { getSocket, disconnectSocket } from '../../../../lib/socket';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from '@/components/ui/form';
import { useGetMessagesQuery } from '../../../../store/slice/conversationApi';
import { useGetConversationsQuery } from '../../../../store/slice/conversationApi';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const messageSchema = z.object({
    message: z.string().min(1, 'Message cannot be empty'),
});

export default function ChatPage({ params }) {
    const resolvedParams = use(params);
    const conversationId = resolvedParams.id;
    const { user } = useAuth();

    const { data: msgData, isLoading: loadingMessages } = useGetMessagesQuery(conversationId);
    const { data: conversationsData } = useGetConversationsQuery();

    // Track only messages that arrive via socket (after initial fetch)
    const [socketMessages, setSocketMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            message: '',
        }
    });

    const watchMessage = useWatch({ control: form.control, name: 'message' });

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const socketRef = useRef(null);

    // Derive final messages list from RTK Query data + socket messages
    const messages = useMemo(() => {
        const fetched = msgData?.messages || [];
        const fetchedIds = new Set(fetched.map((m) => m.id));
        const uniqueSocketMsgs = socketMessages.filter((m) => !fetchedIds.has(m.id));
        return [...fetched, ...uniqueSocketMsgs];
    }, [msgData, socketMessages]);

    const otherUser = conversationsData?.find((c) => c.id === conversationId)?.otherUser || null;
    const loading = loadingMessages;

    const handleNewMessage = useCallback((message) => {
        if (message.conversationId === conversationId) {
            setSocketMessages((prev) => [...prev, message]);
        }
    }, [conversationId]);

    const setupSocket = useCallback(() => {
        const socket = getSocket();
        socketRef.current = socket;
        socket.on('message:new', handleNewMessage);
        socket.on('typing', (data) => {
            if (data.conversationId === conversationId && data.userId !== user?.id) {
                setIsTyping(data.isTyping);
            }
        });
    }, [conversationId, handleNewMessage, user?.id]);

    useEffect(() => {
        setupSocket();
        return () => { disconnectSocket(); };
    }, [conversationId, setupSocket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    function handleTyping() {
        const socket = getSocket();
        if (!socket) return;
        socket.emit('typing:start', { conversationId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing:stop', { conversationId });
        }, 2000);
    }

    async function onSubmit(values) {
        if (!values.message.trim()) return;
        const socket = getSocket();
        if (socket) {
            socket.emit('message:send', { conversationId, bodyText: values.message.trim() });
            socket.emit('typing:stop', { conversationId });
        }
        form.reset();
    }

    function formatTime(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto space-y-4 animate-in">
                <Card className="bg-zinc-950/80 border-white/[0.06]">
                    <CardContent className="p-4 flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full bg-zinc-800" />
                        <Skeleton className="h-5 w-32 bg-zinc-800" />
                    </CardContent>
                </Card>
                <Card className="bg-zinc-950/80 border-white/[0.06] h-[60vh]">
                    <CardContent className="p-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                                <Skeleton className={`h-10 ${i % 2 === 0 ? 'w-48' : 'w-56'} bg-zinc-800 rounded-2xl`} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] lg:h-[calc(100vh-40px)] animate-in max-w-5xl mx-auto w-full">
            <Card className="bg-zinc-950/80 border-white/[0.06] mb-3 shrink-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                    <Link href="/app/chats" className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white h-8 w-8">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold">
                            {otherUser?.username?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-bold text-[0.95rem] text-zinc-100 leading-tight">{otherUser?.username || 'Chat'}</h2>
                        {isTyping && <p className="text-xs text-purple-400 italic animate-pulse">typing...</p>}
                    </div>
                </CardContent>
            </Card>

            <Card className="flex-1 overflow-hidden border-white/[0.06] bg-zinc-950/60 mb-3">
                <CardContent className="p-4 h-full overflow-y-auto flex flex-col gap-2.5">
                    {messages.length === 0 ? (
                        <div className="m-auto text-center text-zinc-500">
                            <div className="text-4xl mb-3">👋</div>
                            <p className="text-sm">Say hi to {otherUser?.username || 'your friend'}!</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMine = msg.senderId === user?.id;
                            return (
                                <div key={msg.id} className={`flex flex-col max-w-[80%] md:max-w-[70%] ${isMine ? 'self-end items-end' : 'self-start items-start'}`}>
                                    <div className={`px-4 py-2.5 text-[0.925rem] leading-relaxed shadow-sm ${isMine
                                        ? 'bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl rounded-tr-sm'
                                        : 'bg-zinc-800/80 text-zinc-100 rounded-2xl rounded-tl-sm border border-white/[0.04]'
                                        }`}>
                                        {msg.bodyText}
                                    </div>
                                    <p className="text-[0.65rem] text-zinc-600 mt-1 px-1">{formatTime(msg.createdAt)}</p>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>
            </Card>

            <Card className="bg-zinc-950/80 border-white/[0.06] shrink-0 shadow-md">
                <CardContent className="p-3">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center">
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem className="flex-1 m-0 space-y-0">
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-900/50 border-white/[0.06] text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
                                                placeholder="Type a message..."
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleTyping();
                                                }}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!watchMessage?.trim() || form.formState.isSubmitting}
                                className="bg-purple-600 hover:bg-purple-500 text-white h-10 w-10 shrink-0 shadow-sm shadow-purple-500/20 disabled:opacity-30"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
