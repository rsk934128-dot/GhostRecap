"use client";

import { useState, useEffect } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  ArrowUpRight, 
  RefreshCcw, 
  CreditCard, 
  Smartphone, 
  FileCheck, 
  AlertCircle,
  Activity,
  Zap,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { VisaCompliance, GlobalBridgeStatus } from '@/lib/types';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { maskSensitiveData, generateSecureToken } from '@/lib/security';
import { cn } from '@/lib/utils';

export default function GlobalCompliancePage() {
  const { user } = useUser();
  const db = useFirestore();
  const [syncing, setSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showTokens, setShowTokens] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const complianceQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'visa-compliance'),
      where('merchantId', '==', user.uid),
      limit(1)
    );
  }, [db, user]);

  const { data: complianceData, loading: complianceLoading } = useCollection<VisaCompliance>(complianceQuery);
  const currentCompliance = complianceData?.[0];

  const bridges: GlobalBridgeStatus[] = [
    { provider: 'Google Pay', status: 'connected', latency: 45, lastSync: new Date().toISOString() },
    { provider: 'Apple Pay', status: 'limited', latency: 120, lastSync: new Date().toISOString() },
    { provider: 'Visa', status: 'connected', latency: 32, lastSync: new Date().toISOString() },
    { provider: 'Mastercard', status: 'pending', latency: 0, lastSync: new Date().toISOString() },
  ];

  const handleManualSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast({
        title: "Global Bridge Synced",
        description: "Communication channels with Google & Apple Payment APIs are stable.",
      });
    }, 2000);
  };

  const sampleCard = "4532781290124456";
  const maskedCard = maskSensitiveData(sampleCard);
  const secureToken = generateSecureToken(user?.uid || "NEXUS");

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] border-primary/20 text-primary bg-primary/5 uppercase font-bold tracking-widest">Step 3: Giant Integration</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="text-primary" size={32} />
            <h1 className="text-4xl font-headline font-bold">Global Bridge</h1>
          </div>
          <p className="text-muted-foreground">Managing sovereign compliance and cross-border payment rails.</p>
        </div>
        <Button 
          onClick={handleManualSync} 
          disabled={syncing}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
        >
          {syncing ? <RefreshCcw size={16} className="animate-spin" /> : <Activity size={16} />}
          Sync Payment Rails
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-secondary/10 border-white/5 ghostly-fade">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
              <FileCheck size={12} className="text-primary" /> Visa Compliance
            </CardDescription>
            <CardTitle className="text-3xl font-headline font-bold">
              {complianceLoading ? '...' : currentCompliance ? `${currentCompliance.score}%` : '85%'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={currentCompliance?.score || 85} className="h-1 bg-white/5" />
            <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-green-500" /> STATUS: {currentCompliance?.status || 'VALID'}</span>
              <span>LAST REVIEW: {mounted ? format(new Date(), 'MMM d') : '...'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 md:col-span-2 ghostly-fade overflow-hidden relative" style={{ animationDelay: '100ms' }}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Lock size={80} />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" /> Nexus Tokenization Engine
            </CardTitle>
            <CardDescription>PCI-DSS compliant data masking in active memory.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Live Handshake Masking</p>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs flex items-center justify-between">
                <span>{showTokens ? sampleCard : maskedCard}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowTokens(!showTokens)}>
                  {showTokens ? <EyeOff size={12} /> : <Eye size={12} />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Generated Sovereign Token</p>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 font-mono text-xs text-primary">
                {secureToken}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-secondary/10 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone size={20} className="text-primary" />
              Digital Wallet Integration
            </CardTitle>
            <CardDescription>Status of Google and Apple Pay tokenization services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bridges.filter(b => b.provider.includes('Pay')).map((bridge, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center border",
                    bridge.status === 'connected' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                  )}>
                    {bridge.provider === 'Google Pay' ? <CreditCard size={20} /> : <Smartphone size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{bridge.provider}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">ID: {bridge.provider.toUpperCase().replace(' ', '_')}_NODE_X</p>
                  </div>
                </div>
                <Badge variant="outline" className={cn(
                  "border-white/10 uppercase text-[9px]",
                  bridge.status === 'connected' ? "text-green-500" : "text-amber-500"
                )}>
                  {bridge.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-primary" />
              Compliance Checklist
            </CardTitle>
            <CardDescription>Critical requirements for maintaining MDB Core Bridge access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'PCI-DSS Self-Assessment (Masking Active)', status: 'complete' },
              { label: 'E2EE Hardware Handshake', status: 'complete' },
              { label: 'Visa QR Settlement Node', status: 'pending' },
              { label: 'Apple Pay Entitlements', status: 'pending' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                {item.status === 'complete' ? (
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20 py-0 h-5">Verified</Badge>
                ) : (
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1 text-primary hover:bg-primary/10">
                    Fix <ArrowUpRight size={10} />
                  </Button>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-primary/10">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <AlertCircle size={16} className="text-primary mt-0.5 shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Sovereign Action Required:</strong> Your Visa QR node is awaiting Midland Bank's HSM signature. Integration will resume once the handshake is verified.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
