
"use client";

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  ArrowUpRight, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Activity,
  Award,
  Wallet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

export default function AnalyticsDeepDive() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const revenueProjection = [
    { year: 'Year 1', users: '50K', revenue: '$3M', status: 'Startup' },
    { year: 'Year 2', users: '200K', revenue: '$15M', status: 'Growth' },
    { year: 'Year 3', users: '500K', revenue: '$50M', status: 'Scale' },
    { year: 'Year 5', users: '2M+', revenue: '$100M+', status: 'Unicorn' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] border-primary/20 text-primary bg-primary/5 uppercase font-bold tracking-widest">Business Intelligence</Badge>
          </div>
          <div className="flex items-center gap-3">
            <BarChart3 className="text-primary" size={32} />
            <h1 className="text-4xl font-headline font-bold">Analytics Deep-Dive</h1>
          </div>
          <p className="text-muted-foreground">Strategic forecasting and real-time intelligence for Mission 400.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 gap-2">
          <Globe size={16} /> Global Report
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-secondary/10 border-white/5 ghostly-fade">
          <CardHeader className="pb-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Daily Trading Volume</p>
            <CardTitle className="text-2xl font-headline font-bold">$1.2M</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
              <TrendingUp size={12} /> +12.5% <span className="text-muted-foreground font-normal">vs last week</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10 border-white/5 ghostly-fade" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Platform Commission</p>
            <CardTitle className="text-2xl font-headline font-bold">18%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase">
              Primary Revenue Model
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10 border-white/5 ghostly-fade" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Merchants</p>
            <CardTitle className="text-2xl font-headline font-bold">400+</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[9px]">SLA COMPLIANT</Badge>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20 ghostly-fade" style={{ animationDelay: '300ms' }}>
          <CardHeader className="pb-2">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Revenue Potential</p>
            <CardTitle className="text-2xl font-headline font-bold text-primary">$100M+</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-accent text-xs font-bold uppercase">
              Phase 3 Scale Ready
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-secondary/10 border-white/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5"><Activity size={150} /></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-primary" /> 5-Year Scaling Roadmap
            </CardTitle>
            <CardDescription>Conservative revenue and user growth projections.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-6">
              {revenueProjection.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-headline text-lg font-bold text-primary">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.year}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">{item.status} Phase</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-8">
                    <div className="hidden md:block">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Active Nodes</p>
                      <p className="text-sm font-bold font-mono">{item.users}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Revenue</p>
                      <p className="text-lg font-bold font-headline text-primary group-hover:scale-110 transition-transform">{item.revenue}</p>
                    </div>
                    <ArrowUpRight className="text-muted-foreground group-hover:text-primary" size={20} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart size={18} className="text-primary" /> Monetization Tiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span>Platinum Nodes ($99/mo)</span>
                  <span className="text-primary">15%</span>
                </div>
                <Progress value={15} className="h-1 bg-white/5" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span>Gold Nodes ($19/mo)</span>
                  <span className="text-accent">35%</span>
                </div>
                <Progress value={35} className="h-1 bg-white/5 bg-accent" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span>Silver/Free Nodes</span>
                  <span className="text-muted-foreground">50%</span>
                </div>
                <Progress value={50} className="h-1 bg-white/5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border-accent/20 p-6 flex flex-col items-center text-center space-y-4">
            <Award className="text-accent" size={48} />
            <div>
              <h3 className="text-xl font-headline font-bold">Mission 400 Governance</h3>
              <p className="text-muted-foreground text-xs mt-2 leading-relaxed italic">
                "Our key is unique value proposition: AI Signals and Agentic Banking integration for elite merchants."
              </p>
            </div>
            <div className="flex gap-2 w-full">
              <div className="flex-1 p-2 rounded-lg bg-black/40 border border-white/5">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Market Cap</p>
                <p className="text-sm font-bold font-mono">$185B</p>
              </div>
              <div className="flex-1 p-2 rounded-lg bg-black/40 border border-white/5">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Global Ops</p>
                <p className="text-sm font-bold font-mono">9,000+</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <Zap className="text-primary animate-pulse" size={32} />
        </div>
        <h3 className="text-2xl font-headline font-bold">Autonomous Revenue Generation</h3>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          GhostRecap OS executes automated arbitrage and commission extraction across the Nexus Core bridge, ensuring a consistent 18% spread on every settlement.
        </p>
      </div>
    </div>
  );
}
