'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-react';

export default function ConsentPage() {
    const { acceptConsent, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);

    async function handleAccept() {
        if (!checked) return;
        setLoading(true);
        try {
            await acceptConsent();
        } catch {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-black text-zinc-50">
            <Card className="w-full max-w-lg bg-zinc-950/80 backdrop-blur-xl border-white/10 shadow-2xl p-2 animate-in">
                <CardHeader className="text-center pb-6 pt-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6 text-white shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight mb-2">
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Terms & Consent</span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="bg-zinc-900 rounded-xl p-6 max-h-[300px] overflow-y-auto text-sm leading-relaxed text-zinc-400 border border-white/5">
                        <h3 className="text-white font-semibold mb-3 text-base">
                            Platform Rules & Age Verification
                        </h3>
                        <ul className="space-y-3 list-disc pl-5">
                            <li><strong className="text-white">Age Requirement:</strong> You confirm that you are at least 18 years old.</li>
                            <li><strong className="text-white">Communication Only:</strong> This platform only provides communication tools. Users are solely responsible for their interactions, decisions, and offline activities.</li>
                            <li><strong className="text-white">Respect Others:</strong> Harassment, spam, or abusive behavior will result in suspension or ban.</li>
                            <li><strong className="text-white">Privacy:</strong> Do not share others&apos; personal information without consent.</li>
                            <li><strong className="text-white">Content Policy:</strong> No illegal content. Messages are text-only in this version.</li>
                            <li><strong className="text-white">Reporting:</strong> Report any suspicious or abusive behavior using the built-in tools.</li>
                        </ul>
                    </div>

                    <label
                        className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${checked ? 'bg-purple-500/10 border-purple-500' : 'bg-transparent border-white/10 hover:border-white/20'
                            }`}
                    >
                        <Checkbox
                            checked={checked}
                            onCheckedChange={setChecked}
                            className="mt-0.5 border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                            aria-label="Accept terms and confirm age"
                        />
                        <span className="text-sm leading-snug text-zinc-300">
                            I confirm that I am <strong className="text-white">18 years or older</strong> and I agree to the platform rules and terms of use.
                        </span>
                    </label>

                    <Button
                        onClick={handleAccept}
                        disabled={!checked || loading}
                        className="w-full py-6 text-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-0 shadow-lg shadow-orange-500/25"
                    >
                        {loading ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Accept & Continue'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
