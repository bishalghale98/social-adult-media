'use client';
import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Shield, UserX } from 'lucide-react';

export default function SettingsPage() {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlocks();
    }, []);

    async function fetchBlocks() {
        try {
            const { data } = await api.get('/blocks');
            setBlocks(data);
        } catch {
            // Ignore
        } finally {
            setLoading(false);
        }
    }

    async function unblock(blockedId) {
        try {
            await api.delete(`/blocks/${blockedId}`);
            setBlocks((prev) => prev.filter((b) => b.blockedId !== blockedId));
        } catch {
            alert('Failed to unblock');
        }
    }

    return (
        <div className="animate-in max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Settings</span>
                </h1>
                <p className="text-zinc-400">Privacy & account preferences</p>
            </div>

            {/* Legal disclaimer */}
            <Card className="border-amber-500/20 bg-amber-500/[0.03] shadow-sm">
                <CardContent className="p-5 flex gap-4">
                    <div className="shrink-0 mt-0.5">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center">
                            <AlertTriangle className="w-4.5 h-4.5 text-amber-400" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-amber-400 text-sm mb-1.5">Platform Disclaimer</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            This platform only provides communication tools. Users are solely responsible for their interactions, decisions, and offline activities.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Blocked users */}
            <Card className="bg-zinc-950/80 border-white/[0.06] shadow-lg">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-zinc-100 text-lg">
                        <Shield className="w-5 h-5 text-zinc-400" />
                        Blocked Users
                    </CardTitle>
                </CardHeader>
                <Separator className="bg-white/[0.04]" />
                <CardContent className="pt-5">
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/50 border border-white/[0.04]">
                                    <Skeleton className="h-4 w-28 bg-zinc-800" />
                                    <Skeleton className="h-7 w-20 bg-zinc-800 rounded-md" />
                                </div>
                            ))}
                        </div>
                    ) : blocks.length === 0 ? (
                        <div className="text-center py-8">
                            <UserX className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                            <p className="text-sm text-zinc-500">You haven&apos;t blocked anyone.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {blocks.map((block) => (
                                <div key={block.id} className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/50 border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                                    <span className="font-medium text-sm text-zinc-200">{block.blockedUser?.username || 'Unknown'}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => unblock(block.blockedId)}
                                        className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 h-7 text-xs"
                                    >
                                        Unblock
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
