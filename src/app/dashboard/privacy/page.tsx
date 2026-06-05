
"use client";

import { ShieldCheck, Lock, Eye, Globe, Zap, TrendingUp, DollarSign, Rocket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function PrivacyRoadmapPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-primary" size={32} />
          <h1 className="text-4xl font-headline font-bold">Privacy Center & Roadmap</h1>
        </div>
        <p className="text-muted-foreground">Our commitment to zero-knowledge security and the future of digital forensics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Capabilities */}
        <Card className="bg-secondary/10 border-white/5 ghostly-fade">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap size={20} className="text-primary" />
              Current Capabilities
            </CardTitle>
            <CardDescription>What you can do with GhostRecap right now.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">ACTIVE</Badge>
                AI Message Categorization (GenAI)
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">ACTIVE</Badge>
                Forensic Timeline Reconstruction
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">ACTIVE</Badge>
                Direct Deep-Link Hub (No contact save)
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">BETA</Badge>
                Notification Snapshot Archiving
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Future Roadmap */}
        <Card className="bg-secondary/10 border-white/5 ghostly-fade" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket size={20} className="text-accent" />
              Future Roadmap
            </CardTitle>
            <CardDescription>Upcoming features and long-term vision.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                  <span>Real-time API Integration</span>
                  <span>40%</span>
                </div>
                <Progress value={40} className="h-1.5" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                  <span>OCR & Audio Recovery</span>
                  <span>15%</span>
                </div>
                <Progress value={15} className="h-1.5" />
              </div>
              <div className="space-y-1 text-sm italic text-muted-foreground">
                Upcoming: Cross-platform secure sync, advanced intent analysis, and professional forensic report export.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monetization Strategy */}
      <Card className="bg-primary/5 border-primary/20 ghostly-fade" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign size={20} className="text-primary" />
            Monetization & Growth
          </CardTitle>
          <CardDescription>How GhostRecap can become a sustainable business.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-bold text-sm">SaaS Subscriptions</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Freemium model with a "Pro" tier for unlimited message history, advanced GenAI insights, and premium support.
            </p>
          </div>
          <div className="space-y-2 border-l border-white/5 pl-6">
            <h4 className="font-bold text-sm">Forensic Expert Tools</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pay-per-use or enterprise licensing for investigators needing deep-data recovery and evidence-grade exports.
            </p>
          </div>
          <div className="space-y-2 border-l border-white/5 pl-6">
            <h4 className="font-bold text-sm">AI-as-a-Service</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Exposing our categorization and intent engine via API for third-party business automation tools.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-secondary/20 border border-white/5 flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Lock size={20} />
          </div>
          <h5 className="font-bold text-sm">Zero-Knowledge</h5>
          <p className="text-[10px] text-muted-foreground">We never see your decryption keys. Data is yours alone.</p>
        </div>
        <div className="p-4 rounded-xl bg-secondary/20 border border-white/5 flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <Eye size={20} />
          </div>
          <h5 className="font-bold text-sm">Transparency</h5>
          <p className="text-[10px] text-muted-foreground">Open protocols for how we extract notification metadata.</p>
        </div>
        <div className="p-4 rounded-xl bg-secondary/20 border border-white/5 flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
            <Globe size={20} />
          </div>
          <h5 className="font-bold text-sm">Compliance</h5>
          <p className="text-[10px] text-muted-foreground">Designed with GDPR and international privacy standards in mind.</p>
        </div>
      </div>
    </div>
  );
}
