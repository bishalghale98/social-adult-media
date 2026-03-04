'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Sparkles } from 'lucide-react';

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    interestedIn: z.enum(['MALE', 'FEMALE', 'OTHER', 'ANY']),
    dob: z.string().min(1, 'Date of birth is required'),
    city: z.string().min(2, 'City must be at least 2 characters'),
});

export default function RegisterPage() {
    const { register } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            gender: 'MALE',
            interestedIn: 'ANY',
            dob: '',
            city: '',
        },
    });

    async function onSubmit(values) {
        setError('');
        setLoading(true);
        try {
            await register(values);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.details?.[0]?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-black text-zinc-50">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <Card className="w-full max-w-[500px] relative z-10 bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-2xl my-8">
                <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight mb-2">
                        <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Create Account</span>
                    </CardTitle>
                    <CardDescription className="text-base text-zinc-400">
                        Join PrivateConnect and meet people
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg flex items-center gap-2 text-sm mb-6">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-300">Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="CoolUser" className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-400 text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-300">Email Address</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="your@email.com" className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-400 text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-300">Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-400 text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="dob"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-300">Date of Birth</FormLabel>
                                            <FormControl>
                                                <Input type="date" className="bg-zinc-900/50 border-white/10 text-white focus-visible:ring-purple-500 block w-full scheme-dark" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-400 text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-300">City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="New York" className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-400 text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-300">Gender</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white focus:ring-purple-500">
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                                    <SelectItem value="MALE" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Male</SelectItem>
                                                    <SelectItem value="FEMALE" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Female</SelectItem>
                                                    <SelectItem value="OTHER" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-red-400 text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="interestedIn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-300">Interested In</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white focus:ring-purple-500">
                                                        <SelectValue placeholder="Interested in" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                                    <SelectItem value="MALE" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Male</SelectItem>
                                                    <SelectItem value="FEMALE" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Female</SelectItem>
                                                    <SelectItem value="OTHER" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Other</SelectItem>
                                                    <SelectItem value="ANY" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Any</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-red-400 text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <p className="text-xs text-zinc-500 text-center mt-2 px-2">
                                By registering, you confirm you are 18 or older and agree to our age-gated consent policy.
                            </p>

                            <Button
                                type="submit"
                                className="w-full py-6 mt-2 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.23)] transition duration-200"
                                disabled={loading}
                            >
                                {loading ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></span> : 'Create Account'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>

                <CardFooter className="flex justify-center border-t border-white/5 pt-6 mt-2">
                    <p className="text-center text-zinc-400 text-sm">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
