'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ShieldAlert, CheckCircle, Ban, Clock } from 'lucide-react';

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('OPEN');

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/app/discover');
            return;
        }
        if (user?.role === 'ADMIN') {
            fetchReports();
        }
    }, [user, authLoading, filter]);

    async function fetchReports() {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/reports', { params: { status: filter } });
            setReports(data.reports);
        } catch {
            // Ignore
        } finally {
            setLoading(false);
        }
    }

    async function reviewReport(id) {
        try {
            await api.post(`/admin/reports/${id}/review`);
            fetchReports();
        } catch {
            alert('Failed to review report');
        }
    }

    async function suspendUser(userId) {
        if (!confirm('Suspend this user?')) return;
        try {
            await api.post(`/admin/users/${userId}/suspend`);
            alert('User suspended');
        } catch {
            alert('Failed');
        }
    }

    async function banUser(userId) {
        if (!confirm('Ban this user? This is permanent.')) return;
        try {
            await api.post(`/admin/users/${userId}/ban`);
            alert('User banned');
        } catch {
            alert('Failed');
        }
    }

    if (authLoading || !user) return null;

    return (
        <div className="min-h-screen bg-black p-6 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8 animate-in">
                {/* Header */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                        <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Admin Dashboard</span>
                    </h1>
                    <p className="text-zinc-400 text-lg">Moderation & Report Management</p>
                </div>

                {/* Report Tabs */}
                <Tabs value={filter} onValueChange={setFilter} className="w-full">
                    <TabsList className="bg-zinc-900 border border-white/[0.06] p-1 h-auto">
                        {['OPEN', 'REVIEWED', 'CLOSED'].map((s) => (
                            <TabsTrigger
                                key={s}
                                value={s}
                                className="data-[state=active]:bg-purple-500/15 data-[state=active]:text-purple-300 data-[state=active]:shadow-none px-5 py-2 text-sm font-semibold rounded-lg"
                            >
                                <span className="flex items-center gap-2">
                                    {s === 'OPEN' && <Clock className="w-3.5 h-3.5" />}
                                    {s === 'REVIEWED' && <CheckCircle className="w-3.5 h-3.5" />}
                                    {s === 'CLOSED' && <Ban className="w-3.5 h-3.5" />}
                                    {s}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {['OPEN', 'REVIEWED', 'CLOSED'].map((tabValue) => (
                        <TabsContent key={tabValue} value={tabValue} className="mt-6">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <Card key={i} className="bg-zinc-950/80 border-white/[0.06]">
                                            <CardContent className="p-6 space-y-4">
                                                <div className="flex justify-between">
                                                    <div className="flex gap-2">
                                                        <Skeleton className="h-5 w-16 bg-zinc-800" />
                                                        <Skeleton className="h-5 w-16 bg-zinc-800" />
                                                    </div>
                                                    <Skeleton className="h-4 w-24 bg-zinc-800" />
                                                </div>
                                                <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                                                <Skeleton className="h-4 w-1/2 bg-zinc-800" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : reports.length === 0 ? (
                                <Card className="bg-zinc-950/50 border-dashed border-white/10">
                                    <CardContent className="py-16 text-center">
                                        <ShieldAlert className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                                        <p className="text-lg font-semibold text-zinc-300 mb-1">No {filter.toLowerCase()} reports</p>
                                        <p className="text-sm text-zinc-500">All clear for now.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {reports.map((report) => (
                                        <Card key={report.id} className="bg-zinc-950/80 border-white/[0.06] hover:border-white/10 transition-colors group">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className={report.targetType === 'USER'
                                                                ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                                                                : 'border-pink-500/30 bg-pink-500/10 text-pink-300'
                                                            }
                                                        >
                                                            {report.targetType}
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className={report.status === 'OPEN'
                                                                ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                                                                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                                            }
                                                        >
                                                            {report.status}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-xs text-zinc-500 font-medium">
                                                        {new Date(report.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className="space-y-1.5 mb-4">
                                                    <p className="text-sm text-zinc-300">
                                                        <span className="font-semibold text-zinc-100">Reporter:</span>{' '}
                                                        {report.reporter?.profile?.username || 'Unknown'}
                                                    </p>
                                                    <p className="text-sm text-zinc-300">
                                                        <span className="font-semibold text-zinc-100">Target ID:</span>{' '}
                                                        <code className="text-xs bg-zinc-800 px-2 py-0.5 rounded font-mono text-zinc-400">
                                                            {report.targetId}
                                                        </code>
                                                    </p>
                                                </div>

                                                <Separator className="bg-white/[0.04] my-4" />

                                                <p className="text-sm text-zinc-400 mb-5">
                                                    <span className="font-semibold text-zinc-200">Reason:</span> {report.reason}
                                                </p>

                                                {report.status === 'OPEN' && (
                                                    <div className="flex flex-wrap gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => reviewReport(report.id)}
                                                            className="bg-purple-600 hover:bg-purple-500 text-white shadow-sm"
                                                        >
                                                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                                            Mark Reviewed
                                                        </Button>
                                                        {report.targetType === 'USER' && (
                                                            <>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => suspendUser(report.targetId)}
                                                                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                                                                >
                                                                    Suspend User
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => banUser(report.targetId)}
                                                                    className="shadow-sm"
                                                                >
                                                                    <Ban className="w-3.5 h-3.5 mr-1.5" />
                                                                    Ban User
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}
