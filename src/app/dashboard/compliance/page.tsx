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
  EyeOff,
  CheckCircle2,
  FileText,
  ScanLine,
  BrainCircuit,
  Upload
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
import { verifyDocumentOCR, OCRVerificationOutput } from '@/ai/flows/ocr-verification-flow';

export default function GlobalCompliancePage() {
  const { user } = useUser();
  const db = useFirestore();
  const [syncing, setSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [giantStepProgress, setGiantStepProgress] = useState(85);
  const [isVerifying, setIsVerifying] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRVerificationOutput | null>(null);

  useEffect(() => {
    setMounted(true);
    const stepStatus = localStorage.getItem('giant_integration_step');
    if (stepStatus === 'completed') {
      setGiantStepProgress(100);
    }
  }, []);

  const handleRunOCR = async () => {
    setIsVerifying(true);
    try {
      const result = await verifyDocumentOCR({
        photoDataUri: 'data:image/png;base64,...',
        documentType: 'TIN_CERTIFICATE'
      });
      setOcrResult(result);
      setGiantStepProgress(100);
      localStorage.setItem('giant_integration_step', 'completed');
      toast({ title: "Audit Complete", description: "Identity verified via NBR TIN fragment." });
    } catch (e) {
      toast({ variant: "destructive", title: "Audit Standby", description: "Node capacity reached." });
    } finally {
      setIsVerifying(false);
    }
  };

  const bridges: GlobalBridgeStatus[] = [
    { provider: 'Google Pay', status: giantStepProgress === 100 ? 'connected' : 'connected', latency: 45, lastSync: new Date().toISOString() },
    { provider: 'Apple Pay', status: giantStepProgress === 100 ? 'connected' : 'limited', latency: giantStepProgress === 100 ? 35 : 120, lastSync: new Date().toISOString() },
    { provider: 'Visa', status: 'connected', latency: 32, lastSync: new Date().toISOString() },
    { provider: 'Mastercard', status: giantStepProgress === 100 ? 'connected' : 'pending', latency: giantStepProgress === 100 ? 28 : 0, lastSync: new Date().toISOString() },
  ];

  const secureToken = generateSecureToken(user?.uid || "NEXUS");

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={cn(
              "text-[10px] uppercase font-bold tracking-widest",
              giantStepProgress === 100 ? "border-green-500/20 text-green-500 bg-green-500/5" : "border-primary/20 text-primary bg-primary/5"
            )}>
              {giantStepProgress === 100 ? "Step 3: Giant Integration Complete" : "Step 3: Giant Integration"}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="text-primary" size={32} />
            <h1 className="text-4xl font-headline font-bold">Global Bridge</h1>
          </div>
          <p className="text-muted-foreground">Managing sovereign compliance and cross-border payment rails.</p>
        </div>
        <div className="flex gap-2">
          {giantStepProgress === 100 && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-4 flex gap-2">
              <CheckCircle2 size={14} /> Handshake Verified
            </Badge>
          )}
          <Button 
            onClick={handleRunOCR} 
            disabled={isVerifying}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
          >
            {isVerifying ? <RefreshCcw size={16} className="animate-spin" /> : <ScanLine size={16} />}
            Run Identity Audit
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-secondary/10 border-white/5 ghostly-fade">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
              <FileCheck size={12} className="text-primary" /> Giant Integration Progress
            </CardDescription>
            <CardTitle className="text-3xl font-headline font-bold">
              {giantStepProgress}%
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={giantStepProgress} className={cn("h-1 bg-white/5", giantStepProgress === 100 ? "bg-green-500" : "bg-primary")} />
            <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck size={10} className={giantStepProgress === 100 ? "text-green-500" : "text-primary"} /> HSM STATUS: {giantStepProgress === 100 ? 'ACTIVE' : 'AWAITING HANDSHAKE'}</span>
              <span>LAST REVIEW: {mounted ? format(new Date(), 'MMM d') : '...'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 md:col-span-2 ghostly-fade overflow-hidden relative">
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
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Linked Identity</p>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs flex items-center justify-between">
                <span>{ocrResult?.extractedData.name || "AWAITING AUDIT"}</span>
                {ocrResult && <CheckCircle2 size={12} className="text-green-500" />}
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

      {ocrResult && (
        <Card className="bg-green-500/5 border-green-500/20 animate-in slide-in-from-bottom-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-green-500">
              <BrainCircuit size={20} /> Identity Verification Report
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Taxpayer Name</p>
              <p className="text-sm font-bold">{ocrResult.extractedData.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">TIN Number</p>
              <p className="text-sm font-mono">{ocrResult.extractedData.tin}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Confidence</p>
              <p className="text-sm font-bold text-green-500">{ocrResult.confidenceScore}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Status</p>
              <Badge className="bg-green-500 text-black">OFFICIAL MATCH</Badge>
            </div>
          </CardContent>
        </Card>
      )}

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
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{bridge.provider}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">ID: {bridge.provider.toUpperCase().replace(' ', '_')}_NODE_X</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={cn(
                    "border-white/10 uppercase text-[9px]",
                    bridge.status === 'connected' ? "text-green-500" : "text-amber-500"
                  )}>
                    {bridge.status}
                  </Badge>
                  <p className="text-[9px] text-muted-foreground mt-1 font-mono">{bridge.latency}ms</p>
                </div>
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
              { label: 'NBR TIN Verification', status: giantStepProgress === 100 ? 'complete' : 'pending' },
              { label: 'E2EE Hardware Handshake', status: 'complete' },
              { label: 'Visa QR Settlement Node', status: giantStepProgress === 100 ? 'complete' : 'pending' },
              { label: 'Apple Pay Entitlements', status: giantStepProgress === 100 ? 'complete' : 'pending' },
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
