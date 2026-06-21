"use client";

import { useState, useEffect } from 'react';
import { 
  Waves, 
  Zap, 
  Activity, 
  RefreshCcw, 
  ShieldAlert, 
  Database, 
  Server, 
  TrendingUp,
  ArrowRight,
  Droplets,
  Timer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { LiquidityNode, StressTestResult } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function OceanMixingPage() {
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nodes: LiquidityNode[] = [
    { id: '1', name: 'Midland Bank Node', balance: 4500000, currency: 'BDT', health: 98, status: 'online' },
    { id: '2', name: 'bKash Gateway Node', balance: 1200000, currency: 'BDT', health: 92, status: 'rebalancing' },
    { id: '3', name: 'Global Bridge Node', balance: 85000, currency: 'USD', health: 100, status: 'online' },
  ];

  const mockLatencyData = [
    { time: '10:00', latency: 45 },
    { time: '10:05', latency: 52 },
    { time: '10:10', latency: 38 },
    { time: '10:15', latency: 65 },
    { time: '10:20', latency: 42 },
    { time: '10:25', latency: 48 },
  ];

  const handleStartStressTest = () => {
    setIsTesting(true);
    setTestProgress(0);
    
    const interval = setInterval(() => {
      setTestProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTesting(false);
          toast({
            title: "Stress Test Complete",
            description: "Ocean Mixing Node successfully handled 12,500 requests/sec with 99.9% accuracy.",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] border-primary/20 text-primary bg-primary/5 uppercase font-bold tracking-widest">Step 4: Ocean Mixing</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Waves className="text-primary" size={32} />
            <h1 className="text-4xl font-headline font-bold">Liquidity Ocean</h1>
          </div>
          <p className="text-muted-foreground">Normalizing liquidity fragments across Midland Bank and Global Rails.</p>
        </div>
        <Button 
          onClick={handleStartStressTest} 
          disabled={isTesting}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
        >
          {isTesting ? <RefreshCcw size={16} className="animate-spin" /> : <Zap size={16} />}
          {isTesting ? "Simulating Traffic..." : "Trigger Stress Test"}
        </Button>
      </header>

      {isTesting && (
        <Card className="bg-primary/10 border-primary/20 animate-pulse">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-primary">
              <span>Stress Simulation Active</span>
              <span>{testProgress}%</span>
            </div>
            <Progress value={testProgress} className="h-1 bg-white/5" />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {nodes.map((node, i) => (
          <Card key={node.id} className="bg-secondary/10 border-white/5 ghostly-fade" style={{ animationDelay: `${i * 100}ms` }}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className={cn(
                  "text-[9px] uppercase font-bold",
                  node.status === 'online' ? "text-green-500 border-green-500/20" : "text-amber-500 border-amber-500/20"
                )}>
                  {node.status}
                </Badge>
                <Server size={14} className="text-muted-foreground" />
              </div>
              <CardTitle className="text-lg mt-2">{node.name}</CardTitle>
              <CardDescription className="font-mono text-xs">
                {node.currency} {node.balance.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                  <span>Node Health</span>
                  <span className="text-primary">{node.health}%</span>
                </div>
                <Progress value={node.health} className="h-1 bg-white/5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-secondary/10 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity size={20} className="text-primary" />
              Network Latency (Nexus Core)
            </CardTitle>
            <CardDescription>Real-time response tracking during fragment mixing.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] pt-4">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockLatencyData}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="time" stroke="#ffffff30" fontSize={10} />
                  <YAxis stroke="#ffffff30" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--primary))', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="latency" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorLatency)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-white/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Droplets size={120} />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldAlert size={20} className="text-accent" />
              Ocean Mixing Logic
            </CardTitle>
            <CardDescription>Autonomous redistribution of liquidity fragments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex gap-4">
              <div className="p-2 rounded-lg bg-accent/20 text-accent h-fit">
                <TrendingUp size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold mb-1">Normalization Algorithm</h5>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Redistributing <span className="text-accent font-bold">14.2%</span> of excess bKash liquidity to Midland Bank HSM for settlement balancing.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Timer size={12} /> Auto-Mixing Cycle
                </span>
                <Badge variant="outline" className="text-[10px]">Every 15m</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Database size={12} /> HSM Encryption Level
                </span>
                <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">AES-512-NX</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full h-11 border-white/10 hover:bg-accent/10 hover:text-accent gap-2 font-bold group">
              View Node Topography <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
