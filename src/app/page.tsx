
"use client";

import Link from 'next/link';
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  Globe, 
  ArrowRight, 
  MessageSquare, 
  BrainCircuit, 
  ChevronRight,
  Database,
  Smartphone,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" suppressHydrationWarning>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <span className="font-headline font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              GhostRecap
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#security" className="hover:text-primary transition-colors">Security</Link>
            <Link href="#mission" className="hover:text-primary transition-colors">Mission 400</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary">Login</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
                Get Started <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] bg-accent/10 blur-[100px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 ghostly-fade">
            <Badge variant="outline" className="py-1 px-4 border-primary/20 bg-primary/5 text-primary uppercase font-bold tracking-[0.2em] text-[10px]">
              <Activity size={12} className="mr-2 animate-pulse" /> Intelligence Layer 400 Active
            </Badge>
            <h1 className="text-6xl md:text-7xl font-headline font-bold leading-[1.1] tracking-tight">
              Communication <br /> 
              <span className="text-primary">Intelligence OS</span> 🛡️
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Unify, analyze, automate, and secure your digital conversations across WhatsApp, Signal, and Telegram with AI-powered sovereign nodes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/30">
                  Access Command Center
                </Button>
              </Link>
              <Link href="#security">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 hover:bg-white/5">
                  View Security Spec
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-8 border-t border-white/5">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/${i + 40}/100/100`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">400+ Merchants</strong> already orchestrating via Nexus Core.
              </p>
            </div>
          </div>

          <div className="relative group ghostly-fade" style={{ animationDelay: '200ms' }}>
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10 group-hover:bg-primary/30 transition-all duration-1000" />
            <Card className="bg-secondary/20 border-white/10 overflow-hidden backdrop-blur-sm shadow-2xl">
              <div className="bg-black/40 h-8 flex items-center gap-1.5 px-4 border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <div className="p-1">
                <img 
                  src="https://picsum.photos/seed/ghost2/800/500" 
                  alt="Dashboard Preview" 
                  className="rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  data-ai-hint="data visualization"
                />
              </div>
            </Card>
            
            {/* Floating Elements */}
            <Card className="absolute -bottom-6 -left-6 bg-card/90 border-primary/20 p-4 shadow-2xl hidden md:block">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">HSM Status</p>
                  <p className="text-xs font-bold">Encrypted Handshake OK</p>
                </div>
              </div>
            </Card>
            
            <Card className="absolute -top-6 -right-6 bg-card/90 border-accent/20 p-4 shadow-2xl hidden md:block">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20 text-accent">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">AI Categorizer</p>
                  <p className="text-xs font-bold">99.8% Accuracy</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Network Latency', value: '12ms' },
            { label: 'Sovereign Nodes', value: '400+' },
            { label: 'Security Standard', value: 'PCI-DSS' },
            { label: 'Uptime', value: '99.98%' },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <p className="text-3xl font-headline font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-headline font-bold">Engineered for Sovereignty</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              GhostRecap transforms noisy notifications into actionable intelligence while maintaining absolute privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Unified Intelligence',
                desc: 'Automatically categorizes messages from WhatsApp, Signal, and Telegram into Urgent, Transactional, and MDB-Signals.',
                icon: MessageSquare,
                color: 'text-primary'
              },
              {
                title: 'Anti-Phishing Shield',
                desc: 'Automated domain validation for Nagad rails. Identifies social engineering patterns and quarantines links.',
                icon: ShieldCheck,
                color: 'text-green-500'
              },
              {
                title: 'Financial Bridge',
                desc: 'Simulates payouts via Midland Bank Core and Nagad Gateway. Supports B2B, MFI, and EMI settlements.',
                icon: Database,
                color: 'text-accent'
              },
              {
                title: 'Secure Intel Vault',
                desc: 'Zero-Knowledge local-first encryption for sensitive fragments like OTPs, contracts, and PII.',
                icon: Lock,
                color: 'text-primary'
              },
              {
                title: 'Cognitive Layer',
                desc: 'AI-driven sentiment analysis and relationship scoring to optimize your communication productivity.',
                icon: BrainCircuit,
                color: 'text-purple-500'
              },
              {
                title: 'Global Rails',
                desc: 'Integrated with Google Pay, Apple Pay, Visa, and Mastercard tokenization engines for cross-border commerce.',
                icon: Globe,
                color: 'text-accent'
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-secondary/10 border-white/5 hover:bg-secondary/20 transition-all group p-8">
                <div className={cn("w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", feature.color)}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-headline font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Specification Section */}
      <section id="security" className="py-32 px-6 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-5">
          <Lock size={400} />
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-headline font-bold leading-tight">
                Cryptographic <br /> <span className="text-primary">Architecture</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                GhostRecap is built on theoretical foundations of world-class security. Every message fragment is protected by continuous key agreement and hardware-bound signatures.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: 'X3DH & Double Ratchet', desc: 'Mutual authentication with forward secrecy and post-compromise security.' },
                  { title: 'ML-KEM Braid', desc: 'Post-Quantum forward secrecy using sparse continuous key agreement.' },
                  { title: 'XEdDSA & VXEdDSA', desc: 'EdDSA-compatible signatures with verifiable random functions (VRF).' }
                ].map((spec, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                    <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
                    <div>
                      <h5 className="font-bold text-sm">{spec.title}</h5>
                      <p className="text-xs text-muted-foreground">{spec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
               <img 
                src="https://picsum.photos/seed/ghost3/800/600" 
                alt="Security Graph" 
                className="rounded-3xl border border-white/10 shadow-2xl opacity-80"
                data-ai-hint="abstract network"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
            <Smartphone className="text-primary" size={40} />
          </div>
          <h2 className="text-5xl font-headline font-bold">Mission 400</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            "GhostRecap is the AI-powered Communication Intelligence OS that unifies, analyzes, automates, and secures digital conversations across every channel. We empower individuals and businesses to transform noisy notifications into actionable intelligence while maintaining absolute privacy."
          </p>
          <div className="pt-8">
            <Link href="/login">
              <Button size="lg" className="h-16 px-12 text-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-2xl shadow-primary/30">
                Join the Mission
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5 bg-card/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo size={40} />
              <span className="font-headline font-bold text-xl tracking-tight">GhostRecap</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Intelligence Layer for secure digital communication. Built for Mission 400.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-primary">Platform</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Command Center</Link></li>
              <li><Link href="/dashboard/ledger" className="hover:text-primary transition-colors">Nexus Ledger</Link></li>
              <li><Link href="/dashboard/vault" className="hover:text-primary transition-colors">Secure Vault</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-accent">Legal</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/dashboard/privacy" className="hover:text-primary transition-colors">Privacy OS</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-foreground">Connect</h4>
            <div className="flex gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-lg bg-secondary border border-white/5 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                  <Globe size={18} />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">
              © 2026 GhostRecap OS. <br /> Secure Handshake Verified.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { cn } from '@/lib/utils';
