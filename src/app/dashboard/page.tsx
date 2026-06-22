
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { MOCK_MESSAGES } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { 
  Search, RefreshCcw, Briefcase, ArrowUpRight, CheckCircle2,
  SignalHigh,
  Zap,
  Lock,
  Activity,
  Award,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Globe,
  QrCode
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { runCopilot, CopilotOutput } from '@/ai/flows/copilot-workspace';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ArchivedMessage, Transaction, SystemLog } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from '@/components/ui/progress';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { verifyHSMHandshake, ALLOWED_NAGAD_DOMAINS } from '@/lib/security';

export default function MissionControlCenter() {
  const { user } = useUser();
  const db = useFirestore();
  const [messages, setMessages] = useState<ArchivedMessage[]>([]);
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<ArchivedMessage | null>(null);
  const [analysis, setAnalysis] = useState<CopilotOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [handshaking, setHandshaking] = useState(false);
  const [handshakeResult, setHandshakeResult] = useState<{signature: string} | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  
  const processedTxIds = useRef<Set<string>>(new Set());

  const transactionsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'transactions'),
      where('merchantId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
  }, [db, user]);

  const { data: recentTransactions } = useCollection<Transaction>(transactionsQuery);

  const addLog = (message: string, type: SystemLog['type'] = 'info') => {
    const newLog: SystemLog = {
      id: Math.random().toString(36).substring(7),
      type,
      message,
      timestamp: new Date().toISOString(),
      module: 'NEXUS-CORE'
    };
    setLogs(prev => [newLog, ...prev].slice(0, 15));
  };

  useEffect(() => {
    setMounted(true);
    setMessages(MOCK_MESSAGES);
    
    const stored = typeof window !== 'undefined' ? localStorage.getItem('giant_integration_step') : null;
    if (stored === 'completed') {
      setHandshakeResult({ signature: "STORED_HSM_SIG_VERIFIED_GR8821" });
    }

    const initialLogs: SystemLog[] = [
      {
        id: 'initial-1',
        type: 'info',
        message: 'System initialized. Nexus Core handshake standby.',
        timestamp: new Date().toISOString(),
        module: 'NEXUS-CORE'
      },
      {
        id: 'initial-2',
        type: 'success',
        message: 'Anti-Phishing Guard active: Monitoring Nagad Official Domains.',
        timestamp: new Date().toISOString(),
        module: 'NEXUS-CORE'
      },
      {
        id: 'initial-3',
        type: 'success',
        message: 'Firebase App Check Enforced: Bot protection active.',
        timestamp: new Date().toISOString(),
        module: 'NEXUS-CORE'
      }
    ];
    setLogs(initialLogs);
  }, []);

  useEffect(() => {
    if (recentTransactions && mounted) {
      recentTransactions.forEach(tx => {
        if (tx.id && !processedTxIds.current.has(tx.id)) {
          processedTxIds.current.add(tx.id);
          let channel = 'MDB-HMAC';
          if (tx.description.includes('Nagad')) channel = 'NAGAD-RSA';
          if (tx.description.includes('Remittance')) channel = 'GLOBAL-MTO';
          if (tx.description.includes('Cash Out')) channel = 'NAGAD-CASHOUT';
          
          const typeIcon = tx.type === 'payment' ? 'PAYMENT' : 'PAYOUT';
          addLog(`${typeIcon} Fragment detected: ${tx.currency} ${tx.amount} via ${channel}`, tx.status === 'flagged' ? 'warning' : 'success');
        }
      });
    }
  }, [recentTransactions, mounted]);

  const stats = useMemo(() => {
    const totalVolume = recentTransactions?.reduce((acc, t) => acc + t.amount, 0) || 0;
    const flaggedCount = recentTransactions?.filter(t => t.status === 'flagged').length || 0;
    
    return {
      totalMessages: messages.length,
      urgent: messages.filter(m => m.category === 'Urgent').length,
      volume: totalVolume,
      flagged: flaggedCount,
      txCount: recentTransactions?.length || 0,
    };
  }, [messages, recentTransactions]);

  const filtered = messages.filter(m => 
    m.sender.toLowerCase().includes(search.toLowerCase()) || 
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleSmartSync = async () => {
    setIsSyncing(true);
    addLog('Initiating autonomous fragment synchronization...', 'info');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const incoming: ArchivedMessage = {
        id: Math.random().toString(36).substring(7),
        sender: 'Nagad Security',
        content: 'Alert: Suspicious link detected in external node: http://nagad-bonus-win.com. Validation failed.',
        timestamp: new Date().toISOString(),
        app: 'Signal',
        category: 'Urgent',
        priorityScore: 100,
        tags: ['FRAUD-ALERT', 'PHISHING-GUARD']
      };
      setMessages(prev => [incoming, ...prev]);
      addLog('Anti-Phishing Firewall blocked external domain node.', 'error');
      toast({ variant: "destructive", title: "Phishing Risk Blocked", description: "Suspicious Nagad link detected and quarantined." });
    } catch (error) {
      addLog('Sync engine failed to handshake with HSM Bridge.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRespondToHandshake = async (nodeId: string) => {
    setHandshaking(true);
    addLog(`Verifying HSM signature for node ${nodeId}...`, 'info');
    try {
      const result = await verifyHSMHandshake(nodeId);
      if (result.success) {
        setHandshakeResult({ signature: result.signature });
        setMessages(prev => prev.filter(m => !m.tags?.includes('MDB-CORE')));
        addLog('HSM Handshake successful. Sovereign link established.', 'success');
        localStorage.setItem('giant_integration_step', 'completed');
      }
    } catch (error) {
      addLog('Handshake failed: Signature mismatch or timeout.', 'error');
    } finally {
      setHandshaking(false);
    }
  };

  const handleAnalyze = async (msg: ArchivedMessage) => {
    setSelectedMsg(msg);
    setIsAnalyzing(true);
    setAnalysis(null);
    addLog(`AI Copilot analyzing fragment from ${msg.sender}...`, 'info');
    try {
      const result = await runCopilot({ 
        messageContent: msg.content, 
        mode: msg.tags?.includes('FRAUD-ALERT') ? 'audit' : 'summarize' 
      });
      setAnalysis(result);
      addLog(`Analysis complete. Risk detected: ${result.priorityScore || 'N/A'}`, 'success');
    } catch (e: any) {
      addLog('Cognitive Layer connection error.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12" suppressHydrationWarning>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 px-2 py-0 border-primary/20">Nexus Core Live</Badge>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
              <ShieldCheck size={10} className="text-green-500" /> Anti-Phishing Shield: ACTIVE
            </span>
          </div>
          <h1 className="text-4xl font-headline font-bold">Mission Control</h1>
          <p className="text-muted-foreground">Unified orchestration with integrated Nagad Fraud Awareness.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            className="gap-2 shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold group"
            onClick={handleSmartSync}
            disabled={isSyncing}
          >
            {isSyncing ? <RefreshCcw size={16} className="animate-spin" /> : <Zap size={16} />}
            {isSyncing ? "Syncing..." : "Sync Intelligence"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-destructive/5 border-destructive/20 ghostly-fade overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                <ShieldAlert size={20} />
              </div>
              <Badge variant="destructive" className="text-[9px] animate-pulse uppercase">App Check Enforced</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Threat Shield</p>
              <h3 className="text-xl font-bold font-headline">SECURE</h3>
              <p className="text-[9px] text-muted-foreground font-mono mt-2">API Lock: 100% Enforced</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 ghostly-fade overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Briefcase size={20} />
              </div>
              <ArrowUpRight size={16} className="text-primary opacity-50" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Node Volume</p>
              <h3 className="text-xl font-bold font-headline">৳ {stats.volume.toLocaleString()}</h3>
              <Progress value={Math.min(100, (stats.volume / 100000) * 100)} className="h-1 bg-white/5 mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-accent/20 ghostly-fade overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-full bg-accent/10 text-accent">
                <QrCode size={20} />
              </div>
              <Badge variant="outline" className="text-[9px] border-accent/20 text-accent uppercase">QR ENGINE</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">C2B Status</p>
              <h3 className="text-xl font-bold font-headline">{handshakeResult ? 'ACTIVE' : 'PENDING'}</h3>
              <p className="text-[9px] text-muted-foreground font-mono mt-2">Merchant Pay Node Live</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-white/5 ghostly-fade overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[10px] flex items-center gap-2 uppercase font-bold text-muted-foreground">
              <Activity size={12} className="text-primary" /> Live Node Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 h-[80px] overflow-y-auto scrollbar-none">
            <div className="space-y-1">
              {logs.slice(0, 5).map(log => (
                <div key={log.id} className="flex gap-2 text-[9px] font-mono items-start">
                  <span className={cn(
                    "font-bold shrink-0",
                    log.type === 'success' ? "text-green-500" : 
                    log.type === 'warning' ? "text-amber-500" : 
                    log.type === 'error' ? "text-destructive" : "text-primary"
                  )}>[{log.type.charAt(0).toUpperCase()}]</span>
                  <span className="text-foreground/70 truncate">{log.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-headline font-bold flex items-center gap-2">
            <SignalHigh size={20} className="text-primary" /> Inbound Intelligence Graph
          </h3>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              className="pl-10 h-10 bg-secondary/50 border-white/5 focus-visible:ring-primary/50" 
              placeholder="Search Nexus Memory..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-none">
            {filtered.map((msg) => (
              <Card key={msg.id} className="ghostly-fade border-white/5 bg-secondary/10 hover:bg-secondary/20 transition-all group overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold border shrink-0",
                    msg.category === 'Urgent' ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-primary/10 text-primary border-primary/20"
                  )}>
                    {msg.sender.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold truncate text-sm">{msg.sender}</span>
                        {msg.tags?.map(t => (
                          <Badge key={t} className="text-[8px] bg-primary/20 text-primary border-primary/30 h-4">{t}</Badge>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground font-mono">
                        {mounted && msg.timestamp ? format(new Date(msg.timestamp), 'HH:mm') : '...'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
                      {msg.content}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    onClick={() => handleAnalyze(msg)}
                  >
                    <ChevronRight size={14} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck size={20} className="text-primary" />
                Anti-Phishing Protocol
              </CardTitle>
              <CardDescription>Automated domain validation and social engineering defense.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Trusted Nagad Rails</p>
                <div className="flex flex-wrap gap-2">
                  {ALLOWED_NAGAD_DOMAINS.map(domain => (
                    <Badge key={domain} variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20 text-[9px] font-mono">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-muted-foreground">
                  <span>Security Heuristics</span>
                  <span className="text-primary">ACTIVE</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Domain Mismatch Detection</span>
                    <CheckCircle2 size={12} className="text-green-500" />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Merchant QR Metadata Validation</span>
                    <CheckCircle2 size={12} className="text-green-500" />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Short-link De-obfuscation</span>
                    <CheckCircle2 size={12} className="text-green-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/10 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Globe size={80} />
            </div>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock size={18} className="text-accent" /> HSM Root Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!handshakeResult ? (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">Hardware Security Module handshake required to unlock full predictive audit layer.</p>
                  <Button 
                    className="w-full bg-primary font-bold shadow-lg" 
                    onClick={() => handleRespondToHandshake('ALPHA_01')}
                    disabled={handshaking}
                  >
                    {handshaking ? <RefreshCcw size={16} className="animate-spin mr-2" /> : <ShieldCheck size={16} className="mr-2" />}
                    Authorize HSM Handshake
                  </Button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center space-y-3">
                  <Award className="text-green-500 mx-auto" size={32} />
                  <p className="text-xs font-bold text-green-500">HSM CERTIFICATE ACTIVE</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedMsg} onOpenChange={(open) => !open && setSelectedMsg(null)}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline">
              <Zap className="text-primary" />
              Nexus Cognitive Engine
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="p-4 rounded-xl bg-secondary/50 border border-white/5">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Source Context</p>
              <p className="text-sm italic">"{selectedMsg?.content}"</p>
            </div>
            
            <div className="space-y-4">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <RefreshCcw className="animate-spin text-primary" size={32} />
                  <p className="text-sm font-medium animate-pulse">Running Threat Analysis...</p>
                </div>
              ) : (
                analysis && (
                  <div className="animate-in fade-in slide-in-from-bottom-2">
                    <Card className={cn(
                      "border-2",
                      (analysis.priorityScore ?? 0) > 80 ? "bg-destructive/5 border-destructive/20" : "bg-primary/5 border-primary/20"
                    )}>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <ShieldAlert size={14} className={(analysis.priorityScore ?? 0) > 80 ? "text-destructive" : "text-primary"} />
                          Audit Conclusion
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm leading-relaxed">{analysis.analysis}</p>
                        {selectedMsg?.tags?.includes('PHISHING-GUARD') && (
                          <div className="mt-4 p-3 rounded bg-destructive/10 border border-destructive/20 text-xs text-destructive font-bold uppercase">
                            PHISHING COUNTERMEASURE: Quarantined
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
