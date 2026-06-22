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
  Timer,
  Smartphone,
  CheckCircle2,
  Building2,
  PlusCircle,
  ArrowDownCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { LiquidityNode } from '@/lib/types';
import { NAGAD_BANK_NODES } from '@/lib/mock-data';
import { executeBankToNagadSync } from '@/app/lib/nagad-actions';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function OceanMixingPage() {
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [nagadSync, setNagadSync] = useState(true);
  
  // Liquidity Injection State
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [syncAmount, setSyncAmount] = useState('');

  useEffect(() => {
    setMounted(true);
    // Periodically pulse the Nagad Sync
    const interval = setInterval(() => {
      setNagadSync(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fix: Handling the toast outside the state updater to avoid "Cannot update Toaster while rendering"
  useEffect(() => {
    if (testProgress >= 100 && isTesting) {
      setIsTesting(false);
      toast({
        title: "Stress Test Complete",
        description: "Ocean Mixing Node successfully handled 15,000 requests/sec with Nagad RSA signatures.",
      });
    }
  }, [testProgress, isTesting]);

  const nodes: LiquidityNode[] = [
    { id: '1', name: 'Midland Bank Node', balance: 4500000, currency: 'BDT', health: 98, status: 'online', type: 'bank' },
    { id: '2', name: 'Nagad Gateway Node', balance: 1850000, currency: 'BDT', health: 94, status: 'online', type: 'nagad' },
    { id: '3', name: 'bKash Gateway Node', balance: 1200000, currency: 'BDT', health: 92, status: 'rebalancing', type: 'gateway' },
    { id: '4', name: 'Global Bridge Node', balance: 85000, currency: 'USD', health: 100, status: 'online', type: 'global' },
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
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const handleLiquiditySync = async () => {
    if (!selectedBank || !syncAmount) {
      toast({ variant: 'destructive', title: 'Missing Fragment', description: 'Please select a bank node and amount.' });
      return;
    }

    setIsSyncing(true);
    try {
      const response = await executeBankToNagadSync({ 
        bankName: selectedBank, 
        amount: parseFloat(syncAmount) 
      });

      if (response.success) {
        toast({
          title: "Liquidity Synced",
          description: response.message,
        });
        setSyncAmount('');
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Bridge Error', description: 'Handshake timeout during sync.' });
    } finally {
      setIsSyncing(false);
    }
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
          <p className="text-muted-foreground">Normalizing liquidity fragments across MDB, Nagad, and Global Rails.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleStartStressTest} 
            disabled={isTesting}
            variant="outline"
            className="gap-2 border-white/10 hover:bg-white/5"
          >
            {isTesting ? <RefreshCcw size={16} className="animate-spin" /> : <Activity size={16} />}
            Stress Test
          </Button>
          <Link href="/dashboard/ocean/topography">
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
              <Zap size={16} /> View Topography
            </Button>
          </Link>
        </div>
      </header>

      {isTesting && (
        <Card className="bg-primary/10 border-primary/20 animate-pulse">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-primary">
              <span>Nagad RSA Signing Active</span>
              <span>{testProgress}%</span>
            </div>
            <Progress value={testProgress} className="h-1 bg-white/5" />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                {node.type === 'nagad' ? <Smartphone size={14} className={cn("transition-colors duration-500", nagadSync ? "text-accent" : "text-muted-foreground")} /> : <Server size={14} className="text-muted-foreground" />}
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
        {/* Bank to Nagad Liquidity Bridge */}
        <Card className="bg-accent/5 border-accent/20 relative overflow-hidden ghostly-fade" style={{ animationDelay: '200ms' }}>
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Building2 size={100} />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-headline font-bold">
              <PlusCircle size={22} className="text-accent" />
              Bank to Nagad Bridge
            </CardTitle>
            <CardDescription>Inject liquidity fragments from 34 commercial banks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                  <Building2 size={10} /> Select Source Bank Node
                </label>
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger className="bg-black/20 border-white/10 h-11 text-xs">
                    <SelectValue placeholder="Search Bank Directory..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {NAGAD_BANK_NODES.map(bank => (
                      <SelectItem key={bank} value={bank} className="text-xs">
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                  <ArrowDownCircle size={10} /> Amount (BDT)
                </label>
                <Input 
                  type="number"
                  className="bg-black/20 border-white/10 h-11 text-lg font-mono"
                  placeholder="0.00"
                  value={syncAmount}
                  onChange={(e) => setSyncAmount(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleLiquiditySync}
                disabled={isSyncing}
                className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg shadow-accent/20 gap-2"
              >
                {isSyncing ? <RefreshCcw size={18} className="animate-spin" /> : <Smartphone size={18} />}
                {isSyncing ? "RSA Handshaking..." : "Initiate Liquidity Sync"}
              </Button>
            </div>
            
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                <strong className="text-accent">Note:</strong> Liquidity synchronization utilizes the Midland Bank Core settlement node for inter-bank handshakes.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity size={20} className="text-primary" />
              Nagad B2B Bridge Latency
            </CardTitle>
            <CardDescription>RSA-2048 signing overhead during fragment mixing.</CardDescription>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-secondary/10 border-white/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Droplets size={120} />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldAlert size={20} className="text-accent" />
              Nagad Integration Node
            </CardTitle>
            <CardDescription>RSA-2048 / PKCS1Padding Security primitive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex gap-4">
              <div className="p-2 rounded-lg bg-accent/20 text-accent h-fit">
                <Smartphone size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold mb-1">M2P Payout Active</h5>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Redistributing <span className="text-accent font-bold">18.5%</span> of total liquidity to Nagad Gateway for immediate disbursements.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Smartphone size={12} /> Nagad Node Sync
                </span>
                <Badge variant="outline" className={cn("text-[10px] transition-all", nagadSync ? "text-green-500" : "text-amber-500")}>
                  {nagadSync ? 'LIVE' : 'SYNCING'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Database size={12} /> Encryption Standard
                </span>
                <Badge variant="outline" className="text-[10px] border-accent/20 text-accent">RSA-2048</Badge>
              </div>
            </div>

            <Link href="/dashboard/ocean/topography">
              <Button variant="outline" className="w-full h-11 border-white/10 hover:bg-accent/10 hover:text-accent gap-2 font-bold group">
                View Node Topography <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Timer size={20} className="text-primary" />
              Real-time Settlement Queue
            </CardTitle>
            <CardDescription>Status of pending inter-node liquidity fragments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Midland Bank Node', status: 'Settled', time: '2m ago' },
              { label: 'Nagad Gateway Node', status: 'Active', time: 'Live' },
              { label: 'bKash Node', status: 'Pending', time: '14s' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-primary">{item.status}</p>
                  <p className="text-[10px] text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
