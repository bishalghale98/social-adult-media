'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-black text-zinc-50">
            {/* Background glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <Card className="w-full max-w-md relative z-10 bg-zinc-950/80 backdrop-blur-xl border-white/10 shadow-2xl animate-in">
                <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                        <Lock className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight mb-2">
                        <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Welcome Back</span>
                    </CardTitle>
                    <CardDescription className="text-base text-zinc-400">
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg flex items-center gap-2 text-sm mb-6">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                className="bg-zinc-900/50 border-white/10 focus-visible:ring-purple-500 text-white placeholder:text-zinc-500"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="bg-zinc-900/50 border-white/10 focus-visible:ring-purple-500 text-white placeholder:text-zinc-500"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-6 mt-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-500/25"
                            disabled={loading}
                        >
                            {loading ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center border-t border-white/5 pt-6 mt-2">
                    <p className="text-center text-zinc-400 text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/register" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                            Create Account
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
