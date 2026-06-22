
"use client";

import { BrainCircuit, ShieldCheck, Zap, Server, Users, Lock, Code, Sparkles, Target, Database, Coins, TrendingUp, Key, Cpu, BarChart3, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function IntelligenceOSVision() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <BrainCircuit className="text-primary" size={32} />
          <h1 className="text-4xl font-headline font-bold">Intelligence OS v2 Roadmap</h1>
        </div>
        <p className="text-muted-foreground">Unifying, analyzing, and securing your communication ecosystem for the next generation of commerce.</p>
      </header>

      {/* Cost-Effective Strategy Section */}
      <Card className="bg-green-500/5 border-green-500/20 ghostly-fade">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-green-500 font-headline">
              <Wallet size={24} /> সাশ্রয়ী রোডম্যাপ (Cost-effective Strategy)
            </CardTitle>
            <Badge className="bg-green-500 text-black">BUDGET FRIENDLY</Badge>
          </div>
          <CardDescription>বাজেট-ফ্রেন্ডলি উপায়ে পুরো সেটআপ দাঁড় করানোর পরিকল্পনা।</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">১</div>
              <div>
                <h5 className="font-bold text-sm">ফ্রি ইনফ্রাস্ট্রাকচার</h5>
                <p className="text-xs text-muted-foreground">Vercel হোস্টিং এবং Firebase Free Tier ব্যবহার করে ১ টাকাও খরচ না করে সার্ভার রেডি রাখা।</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">২</div>
              <div>
                <h5 className="font-bold text-sm">Pay-as-you-go এপিআই</h5>
                <p className="text-xs text-muted-foreground">কোনো ফিক্সড মান্থলি ফি নেই, শুধুমাত্র সফল ট্রানজ্যাকশনের ওপর ছোট কমিশন মডেল।</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">৩</div>
              <div>
                <h5 className="font-bold text-sm">লিগ্যাল ও পেপারওয়ার্ক</h5>
                <p className="text-xs text-muted-foreground">পৌরসভা থেকে অল্প খরচে বেসিক ট্রেড লাইসেন্স নিয়ে ব্যবসায়িক বৈধতা নিশ্চিত করা।</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">৪</div>
              <div>
                <h5 className="font-bold text-sm">বাজেট ট্র্যাকিং</h5>
                <p className="text-xs text-muted-foreground">Rubel Bank Super App-এর বাজেট ট্র্যাকার দিয়ে প্রজেক্টের প্রতিটি খরচ নিখুঁতভাবে ট্র্যাক করা।</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles size={20} className="text-primary" />
              GhostRecap কী কী করতে পারে?
            </CardTitle>
            <CardDescription>আপনার বর্তমান সক্ষমতা এক নজরে।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p className="text-muted-foreground">
              GhostRecap এখন একটি <span className="text-primary font-bold">Communication Intelligence Layer</span> হিসেবে কাজ করছে। এটি হোয়াটসঅ্যাপ বা সিগন্যাল থেকে আসা মেসেজগুলোকে অটোমেটিক ক্যাটাগরাইজ করে জরুরি মেসেজগুলো আলাদা করে।
            </p>
            <ul className="grid grid-cols-1 gap-2">
              <li className="flex gap-2 items-start bg-black/20 p-2 rounded-lg">
                <ShieldCheck size={16} className="text-green-500 mt-0.5" />
                <span><strong>Security Guard:</strong> নগদ (Nagad) বা ব্যাংকিং ফিশিং লিঙ্ক অটোমেটিক ব্লক করা।</span>
              </li>
              <li className="flex gap-2 items-start bg-black/20 p-2 rounded-lg">
                <Database size={16} className="text-primary mt-0.5" />
                <span><strong>Financial Bridge:</strong> মিডল্যান্ড ব্যাংক কোর এবং নগদ গেটওয়ের মাধ্যমে সরাসরি বি২বি পে-আউট।</span>
              </li>
              <li className="flex gap-2 items-start bg-black/20 p-2 rounded-lg">
                <Lock size={16} className="text-accent mt-0.5" />
                <span><strong>Secure Intel Vault:</strong> আপনার সব ওটিপি (OTP) এবং সেনসিティブ ফাইল লোকাল-ফার্স্ট এনক্রিপশনে রাখা।</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={20} className="text-accent" />
              Market Opportunity 2026
            </CardTitle>
            <CardDescription>B2B Embedded Finance & Open Banking scale.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <div className="p-4 rounded-xl bg-black/40 border border-accent/20">
              <p className="text-2xl font-bold font-headline text-accent">$185B</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Embedded Finance Opportunity</p>
              <Progress value={75} className="h-1 bg-white/5 mt-2" />
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <Zap size={18} className="text-accent" />
                </div>
                <div>
                  <h5 className="font-bold text-foreground">Agentic Banking Integration</h5>
                  <p className="text-muted-foreground text-xs">এআই এজেন্টদের মাধ্যমে সরাসরি ব্যাংকিং ট্রানজেকশন প্রসেস করার সুবিধা।</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <TrendingUp size={18} className="text-primary" />
                </div>
                <div>
                  <h5 className="font-bold text-foreground">Open Banking Aggregation</h5>
                  <p className="text-muted-foreground text-xs">৯,০০০+ গ্লোবাল ব্যাংকের সাথে এপিআই কানেক্টিভিটি এবং ডাটা সিঙ্ক।</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Encryption Specifications */}
      <Card className="bg-secondary/10 border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key size={20} className="text-primary" />
            Advanced Cryptographic Protocols
          </CardTitle>
          <CardDescription>Theoretical foundations of GhostRecap security architecture.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-white/5">
              <AccordionTrigger className="text-sm font-bold hover:no-underline">XEdDSA and VXEdDSA</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Describes how to create and verify EdDSA-compatible signatures using public key and private key formats initially defined for the X25519 and X448 elliptic curve Diffie-Hellman functions. "VXEdDSA" extends this to make it a verifiable random function (VRF).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-white/5">
              <AccordionTrigger className="text-sm font-bold hover:no-underline">X3DH (Extended Triple Diffie-Hellman)</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Establishes a shared secret key between two parties who mutually authenticate based on public keys. Provides forward secrecy and cryptographic deniability.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-white/5">
              <AccordionTrigger className="text-sm font-bold hover:no-underline">PQXDH (Post-Quantum Extended Diffie-Hellman)</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Provides post-quantum forward secrecy and a form of cryptographic deniability. While relying on discrete log for authentication, it adds a layer of post-quantum resilience to key agreement.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-white/5">
              <AccordionTrigger className="text-sm font-bold hover:no-underline">Double Ratchet Algorithm</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Used to exchange encrypted messages based on a shared secret key. Derives new keys for every message so earlier keys cannot be calculated from later ones (forward secrecy) and vice versa (post-compromise security).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border-white/5">
              <AccordionTrigger className="text-sm font-bold hover:no-underline">Sesame and ML-KEM Braid</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Sesame manages sessions in multi-device settings. ML-KEM Braid allows sparse continuous key agreement with post-quantum forward secrecy using ML-KEM standards.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

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
                <h5 className="text-xs font-bold mb-1 text-foreground">Local-First Persistence</h5>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Intelligence fragments are processed and stored locally. Cloud sync is optional and end-to-end encrypted with your master hardware key.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4">
              <ShieldCheck size={20} className="text-accent shrink-0" />
              <div>
                <h5 className="text-xs font-bold mb-1 text-foreground">Audit Compliance Layer</h5>
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
