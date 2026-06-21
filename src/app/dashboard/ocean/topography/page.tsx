"use client";

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Database, 
  Server, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Cpu,
  RefreshCcw,
  Activity,
  Waves
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function NodeTopographyPage() {
  const [mounted, setMounted] = useState(false);
  const [activePulse, setActivePulse] = useState(true);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActivePulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/dashboard/ocean" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mb-4 transition-colors">
            <ArrowLeft size={12} /> Back to Liquidity Ocean
          </Link>
          <div className="flex items-center gap-3">
            <Cpu className="text-primary" size={32} />
            <h1 className="text-4xl font-headline font-bold">Node Topography</h1>
          </div>
          <p className="text-muted-foreground">Visual orchestration of MDB Core Nexus liquidity fragments.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex gap-2 py-1 px-3">
            <Activity size={12} className="animate-pulse" /> NETWORK LIVE
          </Badge>
        </div>
      </header>

      <div className="relative w-full h-[600px] bg-black/40 border border-white/5 rounded-3xl overflow-hidden ghostly-fade shadow-2xl">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
          backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)', 
          backgroundSize: '30px 30px' 
        }} />

        {/* Topography Canvas */}
        <div className="relative w-full h-full flex items-center justify-center">
          
          {/* Central Core Node */}
          <div className="relative z-20 group">
            <div className={cn(
              "w-24 h-24 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40 border-4 border-background transition-transform duration-500 group-hover:scale-110",
              activePulse && "ring-8 ring-primary/20"
            )}>
              <Cpu size={40} className="animate-pulse" />
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Nexus Core</p>
              <p className="text-[10px] text-muted-foreground font-mono">NODE_ALPHA_01</p>
            </div>

            {/* Pulsing Aura */}
            <div className="absolute inset-0 -z-10 bg-primary/20 blur-3xl animate-pulse rounded-full" />
          </div>

          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 5px hsl(var(--primary)/0.5))' }}>
            {/* Midland Bank Connection */}
            <path 
              d="M 50% 50% L 25% 25%" 
              stroke="hsl(var(--primary))" 
              strokeWidth="2" 
              strokeDasharray="5,5" 
              className={cn("animate-scroll", activePulse && "opacity-100")}
              fill="none"
              style={{ transform: 'translate(0, 0)' }}
            />
            {/* bKash Connection */}
            <path 
              d="M 50% 50% L 75% 25%" 
              stroke="hsl(var(--accent))" 
              strokeWidth="2" 
              strokeDasharray="5,5" 
              className="animate-scroll"
              fill="none"
            />
            {/* Global Bridge Connection */}
            <path 
              d="M 50% 50% L 50% 85%" 
              stroke="hsl(var(--primary))" 
              strokeWidth="2" 
              strokeDasharray="8,4" 
              className="animate-scroll"
              fill="none"
            />
          </svg>

          {/* Midland Bank Node (Top Left) */}
          <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 group">
            <div className="w-16 h-16 rounded-xl bg-secondary border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/50 transition-all cursor-pointer">
              <Database size={24} />
            </div>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-center w-32">
              <p className="text-[10px] font-bold uppercase tracking-tighter">Midland Bank</p>
              <Badge variant="outline" className="text-[8px] bg-green-500/10 text-green-500 border-green-500/20 py-0">SECURE</Badge>
            </div>
          </div>

          {/* bKash Node (Top Right) */}
          <div className="absolute top-[25%] right-[25%] translate-x-1/2 -translate-y-1/2 group">
            <div className="w-16 h-16 rounded-xl bg-secondary border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-accent group-hover:border-accent/50 transition-all cursor-pointer">
              <Zap size={24} />
            </div>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-center w-32">
              <p className="text-[10px] font-bold uppercase tracking-tighter">bKash Gateway</p>
              <Badge variant="outline" className="text-[8px] bg-amber-500/10 text-amber-500 border-amber-500/20 py-0">MIXING</Badge>
            </div>
          </div>

          {/* Global Bridge Node (Bottom) */}
          <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 group">
            <div className="w-20 h-20 rounded-xl bg-secondary border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/50 transition-all cursor-pointer">
              <Globe size={32} />
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center w-32">
              <p className="text-[10px] font-bold uppercase tracking-tighter">Global Bridge</p>
              <Badge variant="outline" className="text-[8px] bg-primary/10 text-primary border-primary/20 py-0">PCI-DSS ACTIVE</Badge>
            </div>
          </div>

          {/* Floating Data Fragments */}
          <div className="absolute top-[40%] left-[35%] animate-bounce opacity-40">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <div className="absolute bottom-[40%] right-[35%] animate-ping opacity-20">
            <div className="w-3 h-3 rounded-full bg-accent" />
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2 p-4 rounded-xl bg-black/60 border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
            <div className="w-3 h-3 rounded bg-primary" /> Nexus Core Node
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
            <div className="w-3 h-3 rounded bg-accent" /> Liquidity Gateway
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
            <div className="w-3 h-3 border-2 border-dashed border-primary" /> HSM encrypted Link
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-secondary/10 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" />
              Node Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-headline">99.98%</p>
            <p className="text-[10px] text-muted-foreground uppercase mt-1">Global Uptime</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <RefreshCcw size={16} className="text-accent" />
              Sync Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-headline">12ms</p>
            <p className="text-[10px] text-muted-foreground uppercase mt-1">Inter-node handshake</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Waves size={16} className="text-primary" />
              Ocean State
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-headline">NORMALIZED</p>
            <p className="text-[10px] text-muted-foreground uppercase mt-1">Liquidity Fragments Balanced</p>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-scroll {
          animation: scroll 1s linear infinite;
        }
      `}</style>
    </div>
  );
}