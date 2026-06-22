"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { MOCK_MESSAGES } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { 
  Search, RefreshCcw, Briefcase, ArrowUpRight, CheckCircle2,
  SignalHigh, Zap, Lock, Activity, Award, ShieldCheck, ShieldAlert,
  ChevronRight, Globe, QrCode, TrendingUp, MessageSquare, Bot
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
  const [handshakeResult, setHandshakeResult] = useState<{signature: string} | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  
  const processedTxIds = useRef<Set<string>>(new Set());

  const transactionsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'transactions'), where('merchantId', '==', user.uid), orderBy('timestamp', 'desc'), limit(20));
  }, [db, user]);

  const { data: recentTransactions } = useCollection<Transaction>(transactionsQuery);

  const addLog = (message: string, type: SystemLog['type'] = 'info') => {
    const newLog: SystemLog = { id: Math.random().toString(36).substring(7), type, message, timestamp: new Date().toISOString(), module: 'NEXUS-CORE' };
    setLogs(prev => [newLog, ...prev].slice(0, 15));
  };

  useEffect(() => {
    setMounted(true);
    setMessages(MOCK_MESSAGES);
    const stored = typeof window !== 'undefined' ? localStorage.getItem('giant_integration_step') : null;
    if (stored === 'completed') setHandshakeResult({ signature: "STORED_HSM_SIG_VERIFIED_GR8821" });
    
    addLog('System initialized. Nexus Core handshake standby.', 'info');
    addLog('Anti-Phishing Guard active: Monitoring Official Rails.', 'success');
    addLog('Firebase Studio Migration Notice: PROJECT SAFE.', 'warning');
    addLog('Agentic Banking Node (MCP): STANDBY.', 'info');
  }, []);

  useEffect(() => {
    if (recentTransactions && mounted) {
      recentTransactions.forEach(tx => {
        if (tx.id && !processedTxIds.current.has(tx.id)) {
          processedTxIds.current.add(tx.id);
          const type = tx.description.includes('Remit') ? 'REMITTANCE' : tx.type.toUpperCase();
          const protocol = tx.description.includes('Nagad') || tx.description.includes('Remit') ? 'NAGAD-RSA' : 'MDB-HMAC';
          addLog(`${type} Fragment: ${tx.amount} BDT settled via ${protocol}`, 'success');
        }
      });
    }
  }, [recentTransactions, mounted]);

  const stats = useMemo(() => ({
    volume: recentTransactions?.reduce((acc, t) => acc + (t.type === 'payment' ? t.amount : -t.amount), 0) || 0,
    urgent: messages.filter(m => m.category === 'Urgent').length,
    threatScore: recentTransactions?.some(t => t.status === 'flagged') ? 85 : 12,
  }), [messages, recentTransactions]);

  const filtered = messages.filter(m => m.sender.toLowerCase().includes(search.toLowerCase()) || m.content.toLowerCase().includes(search.toLowerCase()));

  const handleSmartSync = async () => {
    setIsSyncing(true);
    addLog('Initiating autonomous fragment synchronization...', 'info');
    setTimeout(() => {
      const incoming: ArchivedMessage = {
        id: Math.random().toString(36).substring(7),
        sender: 'Nagad Security',
        content: 'Critical: Quarantined node detected at external domain. Validation failed.',
        timestamp: new Date().toISOString(),
        app: 'Signal',
        category: 'Urgent',
        priorityScore: 100,
        tags: ['FRAUD-ALERT']
      };
      setMessages(prev => [incoming, ...prev]);
      addLog('Anti-Phishing Firewall blocked external domain node.', 'error');
      setIsSyncing(false);
      toast({ variant: "destructive", title: "Phishing Risk Quarantined", description: "Node blocked by Nexus Firewall." });
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20 px-2 py-0">Node 01: ALPHA</Badge>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
              <ShieldCheck size={10} className="text-green-500" /> Security Shield: ACTIVE
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold">Mission Control</h1>
          <p className="text-sm text-muted-foreground italic">"এক এর ভিতর সব" - Unified Intelligence Orchestration.</p>
        </div>
        <Button className="w-full md:w-auto gap-2 bg-primary font-bold shadow-xl group" onClick={handleSmartSync} disabled={isSyncing}>
          {isSyncing ? <RefreshCcw size={16} className="animate-spin" /> : <Zap size={16} />}
          Sync Intelligence
        </Button>
      </header>

      {/* Cognitive Layer Cards - Mobile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-destructive/5 border-destructive/20 ghostly-fade overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-full bg-destructive/10 text-destructive"><ShieldAlert size={20} /></div>
              <Badge variant="destructive" className="text-[8px] animate-pulse">APP CHECK ACTIVE</Badge>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Threat Index</p>
            <h3 className="text-xl font-bold font-headline">{stats.threatScore}%</h3>
            <Progress value={stats.threatScore} className="h-1 bg-white/5 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-accent/20 ghostly-fade">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-full", stats.volume > 0 ? "bg-green-500/10 text-green-500" : "bg-accent/10 text-accent")}>
                <Bot size={20} />
              </div>
              <Badge variant="outline" className={cn("text-[8px] border-accent/20 text-accent", stats.volume > 0 && "bg-green-500/10 text-green-500 border-green-500/20")}>
                AGENTIC BANKING
              </Badge>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">MCP Node Status</p>
            <h3 className="text-xl font-bold font-headline uppercase">{stats.volume > 0 ? "Active" : "Standby"}</h3>
            <div className="flex gap-1 mt-2">
              <div className={cn("h-1 flex-1 rounded-full", stats.volume > 0 ? "bg-green-500" : "bg-accent")} />
              <div className={cn("h-1 flex-1 rounded-full", stats.volume > 10000 ? "bg-green-500" : "bg-white/5")} />
              <div className={cn("h-1 flex-1 rounded-full", stats.volume > 50000 ? "bg-green-500" : "bg-white/5")} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 ghostly-fade">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-full bg-primary/10 text-primary"><TrendingUp size={20} /></div>
              <Badge variant="outline" className="text-[8px] border-primary/20 text-primary">LIVE FLOW</Badge>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Node Liquidity</p>
            <h3 className="text-xl font-bold font-headline">৳ {stats.volume.toLocaleString()}</h3>
            <Progress value={Math.min(100, (Math.abs(stats.volume) / 100000) * 100)} className="h-1 bg-white/5 mt-2" />
          </CardContent>
        </Card>

        {/* Live Logs - Only 3 lines on mobile */}
        <Card className="bg-secondary/10 border-white/5 overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[10px] uppercase font-bold flex items-center gap-2"><Activity size={12} className="text-primary"/> Node Pulse</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 h-[80px] overflow-y-auto scrollbar-none font-mono text-[9px]">
            {logs.slice(0, 10).map(log => (
              <div key={log.id} className="flex gap-2 mb-1">
                <span className={cn(log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-green-500' : 'text-primary')}>[{log.type.charAt(0).toUpperCase()}]</span>
                <span className="text-foreground/70 truncate">{log.message}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-headline font-bold flex items-center gap-2"><SignalHigh size={20} className="text-primary"/> Inbound Fragments</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input className="pl-10 h-10 bg-secondary/50 border-white/5" placeholder="Filter fragments..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-none">
            {filtered.map((msg) => (
              <Card key={msg.id} className="border-white/5 bg-secondary/10 hover:bg-secondary/20 transition-all cursor-pointer group" onClick={() => setSelectedMsg(msg)}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold border shrink-0", msg.category === 'Urgent' ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-primary/10 text-primary border-primary/20")}>
                    {msg.sender.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-sm truncate">{msg.sender}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{format(new Date(msg.timestamp), 'HH:mm')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 group-hover:text-foreground">{msg.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20 overflow-hidden relative border-dashed border-2">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Globe size={100} /></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck size={20} className="text-primary"/> Migration Hub</CardTitle>
              <CardDescription>Project Transition to Google AI Studio Node.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                 <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Local Antigravity Compatibility</span>
                    <CheckCircle2 size={12} className="text-green-500" />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Workspace Zip Integrity</span>
                    <CheckCircle2 size={12} className="text-green-500" />
                  </div>
              </div>
              <Button variant="outline" className="w-full border-primary/20 text-primary text-xs h-9" onClick={() => toast({ title: "Backup Logged" })}>
                View Migration Audit
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/10 border-white/5">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Lock size={18} className="text-accent" /> HSM Handshake</CardTitle></CardHeader>
            <CardContent>
              {handshakeResult ? (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center space-y-2">
                  <Award className="text-green-500 mx-auto" size={32} />
                  <p className="text-xs font-bold text-green-500 uppercase tracking-widest">Sovereign Link Active</p>
                </div>
              ) : (
                <Button className="w-full bg-primary font-bold shadow-lg" onClick={() => setHandshakeResult({signature: 'VERIFIED'})}>Authorize HSM Bridge</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedMsg} onOpenChange={(open) => !open && setSelectedMsg(null)}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-white/10 w-[95vw]">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Zap size={20} className="text-primary"/> Nexus Cognitive Engine</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-secondary/50 border border-white/5"><p className="text-sm italic text-muted-foreground">"{selectedMsg?.content}"</p></div>
            <Button className="w-full bg-primary font-bold h-12" onClick={async () => {
              setIsAnalyzing(true);
              const res = await runCopilot({ messageContent: selectedMsg?.content || '', mode: 'summarize' });
              setAnalysis(res);
              setIsAnalyzing(false);
            }} disabled={isAnalyzing}>
              {isAnalyzing ? <RefreshCcw size={18} className="animate-spin mr-2" /> : <BrainCircuit size={18} className="mr-2" />}
              Analyze Fragment
            </Button>
            {analysis && (
              <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 animate-in slide-in-from-bottom-2">
                <p className="text-xs font-bold text-primary uppercase mb-2">Audit Conclusion</p>
                <p className="text-sm leading-relaxed">{analysis.analysis}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
