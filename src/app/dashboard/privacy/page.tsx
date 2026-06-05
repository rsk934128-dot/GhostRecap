"use client";

import { BrainCircuit, ShieldCheck, Zap, Server, Users, Lock, Code, Sparkles, Target, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function IntelligenceOSVision() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <BrainCircuit className="text-primary" size={32} />
          <h1 className="text-4xl font-headline font-bold">Intelligence OS v2 Roadmap</h1>
        </div>
        <p className="text-muted-foreground">Unifying, analyzing, and securing your communication ecosystem.</p>
      </header>

      {/* Monetization Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { plan: 'Free', price: '$0', features: ['7-day history', 'Basic Classification', 'Command Center Access'], icon: Users },
          { plan: 'Pro', price: '$7/mo', features: ['Unlimited History', 'Priority OS Orchestration', 'Relationship Intelligence', 'Secure Vault'], icon: Zap, highlight: true },
          { plan: 'Business', price: '$29/mo', features: ['Shared Intelligence Inbox', 'Automation Studio Plus', 'Team Compliance Logs', 'Analytics Engine'], icon: Server },
        ].map((tier, i) => (
          <Card key={i} className={`bg-secondary/10 border-white/5 ${tier.highlight ? 'ring-2 ring-primary/50 bg-primary/5' : ''}`}>
            <CardHeader className="p-6">
              <tier.icon size={24} className={tier.highlight ? 'text-primary' : 'text-muted-foreground'} />
              <CardTitle className="text-xl mt-2">{tier.plan}</CardTitle>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold font-headline">{tier.price}</span>
                <span className="text-xs text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <ul className="space-y-3 mt-4">
                {tier.features.map((f, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]" /> {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-secondary/10 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} className="text-primary" />
              OS Development Phases
            </CardTitle>
            <CardDescription>Our path to complete Communication Intelligence.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: 'Phase 1: Intelligence Core (Audit, OCR, AI)', value: 100, status: 'STABLE' },
              { label: 'Phase 2: Relationship & Vault (E2EE, Health Scores)', value: 85, status: 'ACTIVE' },
              { label: 'Phase 3: Automation Studio (Workflows, Visual UI)', value: 40, status: 'IN DEV' },
              { label: 'Phase 4: Business Suite (Teams, Shared Inbox)', value: 10, status: 'QUEUED' },
            ].map((phase, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span>{phase.label}</span>
                  <span className={phase.value === 100 ? "text-primary" : "text-muted-foreground"}>{phase.status}</span>
                </div>
                <Progress value={phase.value} className="h-1.5 bg-white/5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} className="text-accent" />
              Zero-Knowledge Architecture
            </CardTitle>
            <CardDescription>Security as a fundamental OS primitive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4">
              <Database size={20} className="text-primary shrink-0" />
              <div>
                <h5 className="text-xs font-bold mb-1">Local-First Persistence</h5>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Intelligence fragments are processed and stored locally. Cloud sync is optional and end-to-end encrypted with your master hardware key.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4">
              <ShieldCheck size={20} className="text-accent shrink-0" />
              <div>
                <h5 className="text-xs font-bold mb-1">Audit Compliance Layer</h5>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Automatic data retention pruning and secure one-click purge ensuring complete user control over the audit trail.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center p-12 bg-primary/5 rounded-3xl border border-primary/20 relative overflow-hidden group">
        <Sparkles className="absolute -top-4 -right-4 text-primary/10 w-32 h-32 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
        <h3 className="text-2xl font-headline font-bold mb-4">Our Vision</h3>
        <p className="text-muted-foreground text-sm max-w-3xl mx-auto italic leading-relaxed">
          "GhostRecap is the AI-powered Communication Intelligence OS that unifies, analyzes, automates, and secures digital conversations across every channel. We empower individuals and businesses to transform noisy notifications into actionable intelligence while maintaining absolute privacy."
        </p>
      </div>
    </div>
  );
}
