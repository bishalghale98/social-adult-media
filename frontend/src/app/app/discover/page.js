'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { useGetUsersQuery } from '../../../store/slice/userApi';
import { useSendFriendRequestMutation } from '../../../store/slice/friendApi';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MapPin, UserPlus, Filter, Users } from 'lucide-react';

const filterSchema = z.object({
    gender: z.string().optional(),
    interestedIn: z.string().optional(),
    city: z.string().optional(),
    minAge: z.string().optional(),
    maxAge: z.string().optional(),
});

export default function DiscoverPage() {
    const form = useForm({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            gender: 'ALL',
            interestedIn: 'ALL',
            city: '',
            minAge: '',
            maxAge: ''
        }
    });

    const [page, setPage] = useState(1);
    const [appliedFilters, setAppliedFilters] = useState({ page: 1, limit: 20 });

    // Build query params from applied filters
    const queryParams = { ...appliedFilters };

    const { data, isLoading: loading } = useGetUsersQuery(queryParams);
    const users = data?.users || [];
    const pagination = data?.pagination || {};

    const [sendFriendRequest, { isLoading: sendingRequest }] = useSendFriendRequestMutation();
    const [sendingTo, setSendingTo] = useState(null);

    async function handleSendFriendRequest(userId) {
        setSendingTo(userId);
        try {
            await sendFriendRequest({ receiverId: userId, queryParams }).unwrap();
        } catch (err) {
            toast.error(err.data?.error || 'Failed to send request');
        } finally {
            setSendingTo(null);
        }
    }

    function onSubmit(values) {
        const params = { page: 1, limit: 20 };
        if (values.gender && values.gender !== 'ALL') params.gender = values.gender;
        if (values.interestedIn && values.interestedIn !== 'ALL') params.interestedIn = values.interestedIn;
        if (values.city) params.city = values.city;
        if (values.minAge) params.minAge = values.minAge;
        if (values.maxAge) params.maxAge = values.maxAge;
        setPage(1);
        setAppliedFilters(params);
    }

    function handlePageChange(newPage) {
        setPage(newPage);
        setAppliedFilters((prev) => ({ ...prev, page: newPage }));
    }

    return (
        <div className="animate-in max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                        <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Discover People</span>
                    </h1>
                    <p className="text-zinc-400 text-base">Find like-minded people in your area.</p>
                </div>
            </div>

            {/* Filters */}
            <Card className="bg-zinc-950/50 backdrop-blur-md border-white/[0.06] shadow-lg">
                <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-4 h-4 text-zinc-400" />
                        <h3 className="text-sm font-semibold text-zinc-300">Filters</h3>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-xs text-zinc-400 font-medium">Gender</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-900/50 border-white/[0.06] text-white text-sm focus:ring-purple-500/50 h-10">
                                                    <SelectValue placeholder="All" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                                <SelectItem value="ALL" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">All</SelectItem>
                                                <SelectItem value="MALE" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Male</SelectItem>
                                                <SelectItem value="FEMALE" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Female</SelectItem>
                                                <SelectItem value="OTHER" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="interestedIn"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-xs text-zinc-400 font-medium">Interested</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-900/50 border-white/[0.06] text-white text-sm focus:ring-purple-500/50 h-10">
                                                    <SelectValue placeholder="All" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                                <SelectItem value="ALL" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">All</SelectItem>
                                                <SelectItem value="MALE" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Male</SelectItem>
                                                <SelectItem value="FEMALE" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Female</SelectItem>
                                                <SelectItem value="ANY" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Any</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-xs text-zinc-400 font-medium">City</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-900/50 border-white/[0.06] text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50 h-10"
                                                placeholder="City"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="minAge"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs text-zinc-400 font-medium">Min Age</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="bg-zinc-900/50 border-white/[0.06] text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50 h-10"
                                                    placeholder="18"
                                                    min={18}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="maxAge"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs text-zinc-400 font-medium">Max Age</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="bg-zinc-900/50 border-white/[0.06] text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50 h-10"
                                                    placeholder="99"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>
                                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white border-0 shadow-sm h-10">
                                    Apply Filters
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Results */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="bg-zinc-950/80 border-white/[0.06] overflow-hidden">
                            <Skeleton className="h-24 w-full bg-zinc-800" />
                            <CardContent className="px-5 pb-5 flex flex-col items-center pt-0">
                                <Skeleton className="w-20 h-20 -mt-10 mb-3 rounded-full bg-zinc-800" />
                                <Skeleton className="h-5 w-28 mb-2 bg-zinc-800" />
                                <div className="flex gap-2 mb-4">
                                    <Skeleton className="h-5 w-12 rounded-full bg-zinc-800" />
                                    <Skeleton className="h-5 w-14 rounded-full bg-zinc-800" />
                                    <Skeleton className="h-5 w-16 rounded-full bg-zinc-800" />
                                </div>
                                <Skeleton className="h-4 w-full mb-1 bg-zinc-800" />
                                <Skeleton className="h-4 w-2/3 mb-6 bg-zinc-800" />
                                <Skeleton className="h-9 w-full rounded-md bg-zinc-800" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : users.length === 0 ? (
                <Card className="bg-zinc-950/50 border-dashed border-white/10">
                    <CardContent className="py-16 text-center">
                        <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-zinc-300 mb-1">No users found</p>
                        <p className="text-sm text-zinc-500">Try adjusting your filters to see more people.</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <Card key={user.userId} className="group relative bg-zinc-950/80 border-white/[0.06] overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                                <div className="h-24 bg-gradient-to-r from-purple-900/40 to-pink-900/40 relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                                </div>

                                <CardContent className="px-5 pb-5 relative flex flex-col items-center pt-0">
                                    <Avatar className="w-20 h-20 -mt-10 mb-3 ring-4 ring-zinc-950 shadow-xl border-none">
                                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-bold text-white">
                                            {user.username[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="text-center w-full">
                                        <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                                            {user.username}
                                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="Online" />
                                        </h3>

                                        <div className="flex justify-center flex-wrap gap-1.5 mb-4">
                                            <Badge variant="outline" className="border-purple-500/30 bg-purple-500/15 text-purple-300 text-xs">
                                                {user.age}
                                            </Badge>
                                            <Badge variant="outline" className="border-white/10 bg-zinc-800/80 text-zinc-300 text-xs">
                                                {user.gender}
                                            </Badge>
                                            <Badge variant="outline" className="border-white/10 bg-zinc-800/80 text-zinc-300 text-xs gap-1">
                                                <MapPin className="w-3 h-3" /> {user.city}
                                            </Badge>
                                        </div>

                                        {user.bio ? (
                                            <p className="text-sm text-zinc-400 mb-6 line-clamp-2 min-h-[40px]">
                                                {user.bio}
                                            </p>
                                        ) : (
                                            <div className="mb-6 min-h-[40px]" />
                                        )}

                                        <Button
                                            className="w-full bg-zinc-100 text-zinc-900 hover:bg-white hover:text-black font-semibold shadow-sm"
                                            onClick={() => handleSendFriendRequest(user.userId)}
                                            disabled={sendingTo === user.userId}
                                        >
                                            {sendingTo === user.userId ? (
                                                <span className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
                                            ) : (
                                                <><UserPlus className="w-4 h-4 mr-2" />Add Friend</>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <Button
                                variant="outline"
                                className="bg-zinc-900 border-white/10 text-white hover:bg-zinc-800 hover:text-white"
                                onClick={() => handlePageChange(Math.max(1, page - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-zinc-400 font-medium">
                                Page <span className="text-white">{pagination.page}</span> of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                className="bg-zinc-900 border-white/10 text-white hover:bg-zinc-800 hover:text-white"
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= pagination.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
