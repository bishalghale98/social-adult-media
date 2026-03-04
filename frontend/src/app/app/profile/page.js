'use client';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Pencil, X, Save, CheckCircle, MapPin, Eye, Heart } from 'lucide-react';

export default function ProfilePage() {
    const { user, checkAuth } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        bio: user?.profile?.bio || '',
        city: user?.profile?.city || '',
        visibility: user?.profile?.visibility || 'PUBLIC',
        interestedIn: user?.profile?.interestedIn || 'ANY',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSave(e) {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        try {
            await api.patch('/me/profile', form);
            await checkAuth();
            setSuccess('Profile updated successfully');
            setEditing(false);
        } catch {
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    }

    if (!user) return null;

    const username = user.profile?.username || 'User';

    return (
        <div className="animate-in max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                        <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">My Profile</span>
                    </h1>
                    <p className="text-zinc-400">Manage your personal information</p>
                </div>
                <Button
                    variant={editing ? "ghost" : "outline"}
                    onClick={() => { setEditing(!editing); setSuccess(''); }}
                    className={editing
                        ? "text-zinc-400 hover:text-white hover:bg-white/5"
                        : "border-white/10 text-zinc-300 hover:text-white hover:bg-white/5"
                    }
                >
                    {editing ? <><X className="w-4 h-4 mr-2" />Cancel</> : <><Pencil className="w-4 h-4 mr-2" />Edit Profile</>}
                </Button>
            </div>

            {/* Success message */}
            {success && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm animate-in">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    {success}
                </div>
            )}

            {/* Profile Card */}
            <Card className="bg-zinc-950/80 border-white/[0.06] overflow-hidden shadow-xl">
                {/* Cover / decorative header */}
                <div className="h-28 bg-gradient-to-r from-purple-600/20 via-pink-600/15 to-purple-600/20 relative" />

                <CardContent className="px-6 pb-6 relative">
                    {/* Avatar overlapping the cover */}
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-5 -mt-12 mb-6">
                        <Avatar className="h-24 w-24 border-4 border-zinc-950 shadow-2xl shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-3xl font-bold">
                                {username[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left flex-1 pb-1">
                            <h2 className="text-2xl font-bold text-zinc-100 mb-1">{username}</h2>
                            <p className="text-sm text-zinc-500">{user.email}</p>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-300 gap-1.5">
                            {user.profile?.gender}
                        </Badge>
                        <Badge variant="outline" className="border-pink-500/30 bg-pink-500/10 text-pink-300 gap-1.5">
                            <Heart className="w-3 h-3" />
                            Interested in: {user.profile?.interestedIn}
                        </Badge>
                    </div>

                    <Separator className="bg-white/[0.06] mb-6" />

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-zinc-900/50 rounded-xl p-4 border border-white/[0.04]">
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium mb-1.5">
                                <MapPin className="w-3 h-3" />
                                City
                            </div>
                            <p className="font-semibold text-zinc-200 text-sm">{user.profile?.city || '—'}</p>
                        </div>
                        <div className="bg-zinc-900/50 rounded-xl p-4 border border-white/[0.04]">
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium mb-1.5">
                                <Eye className="w-3 h-3" />
                                Visibility
                            </div>
                            <p className="font-semibold text-zinc-200 text-sm">{user.profile?.visibility || '—'}</p>
                        </div>
                    </div>

                    {/* Bio */}
                    {user.profile?.bio && (
                        <div className="bg-zinc-900/50 rounded-xl p-4 border border-white/[0.04]">
                            <p className="text-xs text-zinc-500 font-medium mb-2">Bio</p>
                            <p className="text-sm text-zinc-300 leading-relaxed">{user.profile.bio}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Form */}
            {editing && (
                <Card className="bg-zinc-950/80 border-white/[0.06] shadow-xl animate-in">
                    <CardHeader className="pb-4">
                        <h3 className="text-xl font-bold text-zinc-100">Edit Profile Info</h3>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-zinc-300">Bio</Label>
                                <Textarea
                                    name="bio"
                                    rows={3}
                                    maxLength={300}
                                    placeholder="Tell people about yourself..."
                                    className="bg-zinc-900/50 border-white/[0.06] text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50 min-h-[100px] resize-none"
                                    value={form.bio}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-right text-zinc-500">{form.bio.length}/300</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-zinc-300">City</Label>
                                <Input
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    className="bg-zinc-900/50 border-white/[0.06] text-white placeholder:text-zinc-500 focus-visible:ring-purple-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">Visibility</Label>
                                    <Select value={form.visibility} onValueChange={(val) => setForm({ ...form, visibility: val })}>
                                        <SelectTrigger className="bg-zinc-900/50 border-white/[0.06] text-white focus:ring-purple-500/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                            <SelectItem value="PUBLIC" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Public</SelectItem>
                                            <SelectItem value="HIDDEN" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Hidden</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">Interested In</Label>
                                    <Select value={form.interestedIn} onValueChange={(val) => setForm({ ...form, interestedIn: val })}>
                                        <SelectTrigger className="bg-zinc-900/50 border-white/[0.06] text-white focus:ring-purple-500/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                            <SelectItem value="MALE" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Male</SelectItem>
                                            <SelectItem value="FEMALE" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Female</SelectItem>
                                            <SelectItem value="ANY" className="focus:bg-purple-500/20 focus:text-white cursor-pointer">Any</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-500/20"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <><Save className="w-4 h-4 mr-2" />Save Changes</>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
