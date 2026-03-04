'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navigation from '@/components/Navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        } else if (!loading && user && !user.consentAcceptedAt) {
            router.push('/consent');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-zinc-800 border-t-purple-500 rounded-full animate-spin" />
                    <Skeleton className="h-3 w-32 bg-zinc-800" />
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex min-h-screen w-full mx-auto bg-black text-zinc-50">
            <Navigation />

            {/* Main content area */}
            <main className="flex-1 min-w-0 p-5 pb-24 md:p-8 md:pl-8">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
