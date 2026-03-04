'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, MessageCircle, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black text-zinc-50">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-in mt-10 md:mt-0">

          <div className="inline-flex items-center justify-center p-1 rounded-full bg-zinc-900 border border-white/10 mb-8 shadow-2xl backdrop-blur-xl">
            <span className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-300 bg-purple-500/20 rounded-full">New App</span>
            <span className="px-4 text-sm text-zinc-300">Discover Version 2.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
            Connect Privately, <br />
            <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Safely & Securely.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl mx-auto">
            A premium, adult-only messaging platform built on consent.
            Connect with verified users in a safe, encrypted environment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-[0_0_40px_rgba(168,85,247,0.4)] bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0">
                Get Started Now
              </Button>
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-transparent border-white/20 hover:bg-white/10 text-white">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
            {[
              { icon: Shield, title: '18+ Verified', desc: 'Secure age-gated network' },
              { icon: MessageCircle, title: 'Private Chat', desc: 'End-to-end encryption' },
              { icon: HeartHandshake, title: 'Consent First', desc: 'Mutual connections only' },
              { icon: ShieldCheck, title: 'Moderated', desc: 'Active safety features' },
            ].map((f, i) => (
              <Card key={i} className="bg-zinc-900/50 backdrop-blur-md border border-white/5 hover:border-purple-500/30 transition-colors group">
                <CardContent className="p-6 text-left flex flex-col pt-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-zinc-100">{f.title}</h3>
                  <p className="text-sm text-zinc-400">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Disclaimer footer */}
      <footer className="py-8 px-6 text-center border-t border-white/5 text-sm text-zinc-500 relative z-10 bg-black/50 backdrop-blur-md">
        This platform only provides communication tools. Users are solely responsible for their interactions, decisions, and offline activities.
      </footer>
    </div>
  );
}
