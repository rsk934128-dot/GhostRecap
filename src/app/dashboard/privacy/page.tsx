"use client";

import { ShieldCheck, Lock, Eye, Globe, Zap, Rocket, CreditCard, Code, Server, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function CommunicationIntelligenceVision() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-primary" size={32} />
          <h1 className="text-4xl font-headline font-bold">Platform Intelligence & Roadmap</h1>
        </div>
        <p className="text-muted-foreground">Transitioning from message recovery to a zero-knowledge Communication Intelligence ecosystem.</p>
      </header>

      {/* Monetization Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { plan: 'Free', price: '$0', features: ['7-day history', 'Basic Classification'], icon: Users },
          { plan: 'Pro', price: '$7/mo', features: ['Unlimited History', 'Priority Scoring', 'Cloud Sync'], icon: Zap, highlight: true },
          { plan: 'Business', price: '$29/mo', features: ['Shared Inbox', 'Team Analytics', 'CRM Connect'], icon: Server },
          { plan: 'Enterprise', price: 'Custom', features: ['Zero-Knowledge E2EE', 'Compliance Exports'], icon: ShieldCheck },
        ].map((tier, i) => (
          <Card key={i} className={`bg-secondary/10 border-white/5 ${tier.highlight ? 'ring-2 ring-primary/50 bg-primary/5' : ''}`}>
            <CardHeader className="p-4 pb-2">
              <tier.icon size={20} className={tier.highlight ? 'text-primary' : 'text-muted-foreground'} />
              <CardTitle className="text-lg">{tier.plan}</CardTitle>
              <p className="text-2xl font-bold">{tier.price}</p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ul className="space-y-1 mt-2">
                {tier.features.map((f, idx) => (
                  <li key={idx} className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <div className="w-1 h-1 bg-primary rounded-full" /> {f}
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
              <Code size={20} className="text-primary" />
              Strategic Roadmap
            </CardTitle>
            <CardDescription>Our phased approach to Communication Intelligence.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase">
                <span>Phase 1: Intelligence Core (Audit, OCR, Classification)</span>
                <span className="text-primary">ACTIVE</span>
              </div>
              <Progress value={90} className="h-1.5" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase">
                <span>Phase 2: Sync & Voice (Voice-to-Text, E2EE Sync)</span>
                <span>IN PROGRESS</span>
              </div>
              <Progress value={35} className="h-1.5" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase">
                <span>Phase 3: Business Suite (Analytics, Shared Teams)</span>
                <span>QUEUED</span>
              </div>
              <Progress value={10} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} className="text-accent" />
              Privacy & Compliance
            </CardTitle>
            <CardDescription>Zero-knowledge storage and user-centric data control.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <h5 className="text-xs font-bold mb-1">Audit Trail Protocol</h5>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                GhostRecap acts as a local communication auditor. We prioritize "Audit Logs" over "Recovery" to ensure compliance with digital safety standards.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <h5 className="text-xs font-bold mb-1">Consent-First Access</h5>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Every data ingestion point requires explicit user consent via system notification hooks. No background scraping is performed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center p-8 bg-primary/5 rounded-2xl border border-primary/20">
        <h3 className="text-xl font-headline font-bold mb-2">Our Vision</h3>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto italic">
          "GhostRecap is an AI-powered Communication Intelligence and Message Management Platform that helps individuals and businesses organize, analyze, search, and automate digital communications across multiple channels while maintaining privacy and security."
        </p>
      </div>
    </div>
  );
}