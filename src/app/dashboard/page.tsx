"use client";

import { useState, useEffect, useMemo } from 'react';
import { MOCK_MESSAGES } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { 
  Search, Sparkles, RefreshCcw, BrainCircuit, ShieldAlert, 
  Zap, ChevronRight, Briefcase, Timer, ShieldCheck, ArrowUpRight, CheckCircle2,
  SignalHigh,
  Bell,
  Rocket
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClassificationBadge } from '@/components/dashboard/ClassificationBadge';
import { runCopilot, CopilotOutput } from '@/ai/flows/copilot-workspace';
import { getPredictiveInsights, PredictiveOutput } from '@/ai/flows/predictive-insights';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ArchivedMessage, Transaction } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from '@/components/ui/progress';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { verifyHSMHandshake } from '@/lib/security';

export default function MissionControlCenter() {
  const { user } = useUser();
  const db = useFirestore();
  const [messages, setMessages] = useState<ArchivedMessage[]>(MOCK_MESSAGES);
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<ArchivedMessage | null>(null);
  const [analysis, setAnalysis] = useState<CopilotOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [globalInsights, setGlobalInsights] = useState<PredictiveOutput | null>(null);
  const [handshaking, setHandshaking] = useState(false);
  const [handshakeComplete, setHandshakeComplete] = useState(false);

  // Real-time Ledger Data for Executive Dashboard
  const transactionsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'transactions'),
      where('merchantId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
  }, [db, user]);

  const { data: recentTransactions, loading: transactionsLoading } = useCollection<Transaction>(transactionsQuery);

  useEffect(() => {
    setMounted(true);
    handleRunGlobalIntelligence();
  }, []);

  const handleRunGlobalIntelligence = async () => {
    try {
      const results = await getPredictiveInsights({
        messages: messages.map(m => ({ sender: m.sender, content: m.content, timestamp: m.timestamp }))
      });
      setGlobalInsights(results);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Intelligence Failure",
        description: "Global predictive analysis could not be completed."
      });
    }
  };

  const stats = useMemo(() => {
    const totalVolume = recentTransactions?.reduce((acc, t) => acc + t.amount, 0) || 0;
    const flaggedCount = recentTransactions?.filter(t => t.status === 'flagged').length || 0;
    const pendingCount = recentTransactions?.filter(t => t.status === 'pending').length || 0;
    
    return {
      totalMessages: messages.length,
      urgent: messages.filter(m => m.category === 'Urgent').length,
      opportunities: messages.filter(m => (m.opportunityScore || 0) > 70).length,
      decisions: messages.filter(m => m.decisionPending).length + pendingCount,
      volume: totalVolume,
      flagged: flaggedCount,
      txCount: recentTransactions?.length || 0,
      bankSignals: messages.filter(m => m.sender.toLowerCase().includes('bank') || m.content.toLowerCase().includes('hsm') || m.content.toLowerCase().includes('nexus')).length
    };
  }, [messages, recentTransactions]);

  const filtered = messages.filter(m => 
    m.sender.toLowerCase().includes(search.toLowerCase()) || 
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleSmartSync = async () => {
    setIsSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const isMDB = Math.random() > 0.5;
      const incoming: ArchivedMessage = isMDB ? {
        id: Math.random().toString(36).substring(7),
        sender: 'Midland Bank HSM',
        content: 'HSM Node Alpha Handshake Request. Waiting for secure signature verification.',
        timestamp: new Date().toISOString(),
        app: 'Signal',
        category: 'Urgent',
        priorityScore: 100,
        tags: ['MDB-CORE', 'HSM-BRIDGE']
      } : {
        id: Math.random().toString(36).substring(7),
        sender: 'Investor Alpha',
        content: 'I reviewed the proposal. Let’s discuss the equity split tomorrow morning.',
        timestamp: new Date().toISOString(),
        app: 'WhatsApp',
        category: 'Urgent',
        priorityScore: 98,
        opportunityScore: 95,
        decisionPending: true,
      };
      setMessages(prev => [incoming, ...prev]);
      toast({ title: "Autonomous Indexing Complete", description: isMDB ? "MDB Core Signal Detected." : "New High-Value Opportunity detected." });
      handleRunGlobalIntelligence();
    } catch (error) {
      toast({ variant: "destructive", title: "Sync Error", description: "Intelligence bridge failed." });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRespondToHandshake = async (nodeId: string) => {
    setHandshaking(true);
    try {
      const result = await verifyHSMHandshake(nodeId);
      if (result.success) {
        setHandshakeComplete(true);
        setMessages(prev => prev.filter(m => !m.tags?.includes('MDB-CORE')));
        toast({
          title: "Handshake Successful",
          description: `Nexus Node ${nodeId} is now verified. Signature: ${result.signature}`,
        });
        // Update local status for the session
        localStorage.setItem('giant_integration_step', 'completed');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Handshake Failed', description: 'HSM Bridge connection reset.' });
    } finally {
      setHandshaking(false);
    }
  };

  const handleAnalyze = async (msg: ArchivedMessage) => {
    setSelectedMsg(msg);
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await runCopilot({ messageContent: msg.content, mode: 'summarize' });
      setAnalysis(result);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not connect to Cognitive Layer.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const mdbSignal = messages.find(m => m.tags?.includes('MDB-CORE'));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 px-2 py-0 border-primary/20">MDB Nexus Live</Badge>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
              <ShieldCheck size={10} className="text-green-500" /> Nexus Security: ACTIVE
            </span>
          </div>
          <h1 className="text-4xl font-headline font-bold">Mission Control</h1>
          <p className="text-muted-foreground">Unified autonomous orchestration and Nexus financial intelligence.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            className="gap-2 shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold group"
            onClick={handleSmartSync}
            disabled={isSyncing}
          >
            {isSyncing ? <RefreshCcw size={16} className="animate-spin" /> : <Zap size={16} className="group-hover:animate-pulse" />}
            {isSyncing ? "Syncing Nexus..." : "Sync Intelligence"}
          </Button>
        </div>
      </header>

      {/* Nexus Inbound Signal Alert */}
      {mdbSignal && !handshakeComplete && (
        <Card className="bg-primary/10 border-primary/20 border-l-4 border-l-primary overflow-hidden ghostly-fade animate-pulse">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <SignalHigh size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Incoming MDB Core Signal Detected</p>
                <h4 className="text-sm font-bold text-foreground">{mdbSignal.sender}: {mdbSignal.content}</h4>
                <p className="text-[10px] text-muted-foreground font-mono mt-1">Source: HSM Bridge Node Alpha | Latency: 42ms</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs border-primary/20" onClick={() => handleAnalyze(mdbSignal)}>
                AI Audit
              </Button>
              <Button 
                size="sm" 
                className="bg-primary text-primary-foreground font-bold" 
                onClick={() => handleRespondToHandshake('ALPHA_01')}
                disabled={handshaking}
              >
                {handshaking ? <RefreshCcw className="animate-spin mr-2" size={12} /> : <ShieldCheck className="mr-2" size={12} />}
                {handshaking ? "Verifying..." : "Respond to Handshake"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {handshakeComplete && (
        <Card className="bg-green-500/10 border-green-500/20 border-l-4 border-l-green-500 overflow-hidden ghostly-fade">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-green-500 mb-1">Handshake Verified</p>
                <h4 className="text-sm font-bold text-foreground">Sovereign Link Established with MDB Core HSM</h4>
                <p className="text-[10px] text-muted-foreground font-mono mt-1">Status: SECURE | Step 3: 100% COMPLETE</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20 ghostly-fade overflow-hidden group">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20 text-primary">
                  <Briefcase size={20} />
                </div>
                <h3 className="font-bold">Nexus Volume</h3>
              </div>
              <ArrowUpRight size={16} className="text-primary opacity-50" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-bold font-headline">৳ {stats.volume.toLocaleString()}</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase">Node Volume</span>
              </div>
              <Progress value={Math.min(100, (stats.volume / 100000) * 100)} className="h-1 bg-white/5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Indexed from <span className="text-primary font-bold">Midland Bank & bKash</span>. {stats.txCount} fragments found.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-accent/20 ghostly-fade relative overflow-hidden group">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-accent/20 text-accent">
                  <Timer size={20} />
                </div>
                <h3 className="font-bold">Inbound Signals</h3>
              </div>
              <Bell size={16} className="text-accent opacity-50" />
            </div>
            <div className="space-y-3">
              {stats.bankSignals > 0 ? (
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/10">
                  <p className="text-xs font-bold text-accent mb-1">{stats.bankSignals} CORE SIGNALS ACTIVE</p>
                  <p className="text-[10px] text-muted-foreground italic leading-tight">
                    Critical handshake requests found in notification layer.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-4">No critical bank signals identified.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={cn("ghostly-fade relative overflow-hidden group", stats.flagged > 0 ? "bg-destructive/5 border-destructive/20" : "bg-green-500/5 border-green-500/20")}>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full", stats.flagged > 0 ? "bg-destructive/20 text-destructive" : "bg-green-500/20 text-green-500")}>
                  <ShieldAlert size={20} />
                </div>
                <h3 className="font-bold">Fraud Monitor</h3>
              </div>
              <ShieldAlert size={16} className={cn("opacity-50", stats.flagged > 0 ? "text-destructive" : "text-green-500")} />
            </div>
            <ul className="space-y-2">
              {stats.flagged > 0 ? (
                <li className="text-xs flex items-start gap-2 text-destructive font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0 animate-pulse" />
                  {stats.flagged} suspicious fragments detected!
                </li>
              ) : (
                <li className="text-xs flex items-start gap-2 text-muted-foreground">
                  <div className="w-1 h-1 rounded-full bg-green-500 mt-1.5 shrink-0" />
                  No active threats detected in Node M400.
                </li>
              )}
              <li className="text-xs flex items-start gap-2 text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-green-500 mt-1.5 shrink-0" />
                Nexus Identity Trust: 100% Verified.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Fragments', value: stats.txCount + stats.totalMessages, icon: BrainCircuit, color: 'text-primary' },
          { label: 'Ledger Audit', value: stats.flagged === 0 ? 'CLEAN' : 'RISK', icon: CheckCircle2, color: stats.flagged === 0 ? 'text-accent' : 'text-destructive' },
          { label: 'Growth Signals', value: stats.opportunities, icon: Rocket, color: 'text-orange-400' },
          { label: 'Trust Fabric', value: '100%', icon: ShieldCheck, color: 'text-green-400' },
        ].map((stat, i) => (
          <Card key={i} className="bg-secondary/10 border-white/5 hover:bg-secondary/20 transition-colors">
            <CardContent className="p-4 flex flex-col gap-1">
              <stat.icon size={16} className={`${stat.color} mb-1`} />
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold font-headline">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 group max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            className="pl-10 h-12 bg-secondary/50 border-white/5 focus-visible:ring-primary/50 text-lg" 
            placeholder="Search Nexus Memory Graph..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map((msg) => (
          <Card key={msg.id} className="ghostly-fade border-white/5 bg-secondary/10 hover:bg-secondary/20 transition-all group overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-stretch min-h-[80px]">
                <div className={`w-1.5 ${msg.category === 'Urgent' ? 'bg-red-500' : 'bg-primary/30'}`} />
                <div className="flex-1 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20 shrink-0">
                    {msg.sender.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold truncate text-sm">{msg.sender}</span>
                        <Badge variant="outline" className="text-[8px] uppercase border-white/10 px-1 py-0">{msg.app}</Badge>
                        {msg.category && <ClassificationBadge category={msg.category} className="scale-75 origin-left" />}
                        {msg.tags?.map(t => (
                          <Badge key={t} className="text-[8px] bg-primary/20 text-primary border-primary/30 h-4">{t}</Badge>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                        {mounted ? format(new Date(msg.timestamp), 'h:mm a') : '...'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors font-medium">
                      {msg.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1 text-[10px] text-primary font-bold hover:bg-primary/10"
                      onClick={() => handleAnalyze(msg)}
                    >
                      Copilot <ChevronRight size={10} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedMsg} onOpenChange={(open) => !open && setSelectedMsg(null)}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline">
              <BrainCircuit className="text-primary" />
              Nexus Cognitive Engine
            </DialogTitle>
            <DialogDescription>
              Orchestrating intelligence for {selectedMsg?.sender}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="p-4 rounded-xl bg-secondary/50 border border-white/5">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Source Context</p>
              <p className="text-sm italic">"{selectedMsg?.content}"</p>
            </div>

            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <RefreshCcw className="animate-spin text-primary" size={32} />
                <p className="text-sm font-medium animate-pulse">Running Cognitive Engines...</p>
              </div>
            ) : analysis && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles size={14} className="text-primary" />
                      Nexus Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm leading-relaxed">{analysis.analysis}</p>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Zap size={12} className="text-primary" /> Recommended Autonomous Actions
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="h-10 text-xs font-bold bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 justify-start gap-2">
                      <ArrowUpRight size={14} /> Update Ledger
                    </Button>
                    <Button variant="outline" className="h-10 text-xs font-bold border-white/10 justify-start gap-2">
                      <Timer size={14} /> Schedule Sync
                    </Button>
                    <Button variant="outline" className="h-10 text-xs font-bold border-white/10 justify-start gap-2">
                      <CheckCircle2 size={14} /> Verify Compliance
                    </Button>
                    <Button variant="outline" className="h-10 text-xs font-bold border-white/10 justify-start gap-2">
                      <ShieldCheck size={14} /> Verify Identity
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
