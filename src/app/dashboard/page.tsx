"use client";

import { useState, useEffect, useMemo } from 'react';
import { MOCK_MESSAGES } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { 
  Search, Sparkles, RefreshCcw, BrainCircuit, ShieldAlert, 
  Target, Zap, AlertTriangle, ChevronRight, MessageSquare, 
  CheckCircle2, TrendingUp, Info, Rocket, Timer, Briefcase,
  ShieldCheck, ArrowUpRight, MousePointerClick
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClassificationBadge } from '@/components/dashboard/ClassificationBadge';
import { runCopilot, CopilotOutput } from '@/ai/flows/copilot-workspace';
import { getPredictiveInsights, PredictiveOutput } from '@/ai/flows/predictive-insights';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ArchivedMessage } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from '@/components/ui/progress';

export default function MissionControlCenter() {
  const [messages, setMessages] = useState<ArchivedMessage[]>(MOCK_MESSAGES);
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<ArchivedMessage | null>(null);
  const [analysis, setAnalysis] = useState<CopilotOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [globalInsights, setGlobalInsights] = useState<PredictiveOutput | null>(null);

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
    return {
      total: messages.length,
      urgent: messages.filter(m => m.category === 'Urgent').length,
      opportunities: messages.filter(m => (m.opportunityScore || 0) > 70).length,
      decisions: messages.filter(m => m.decisionPending).length,
      avgPriority: Math.round(messages.reduce((acc, m) => acc + (m.priorityScore || 0), 0) / (messages.length || 1))
    };
  }, [messages]);

  const filtered = messages.filter(m => 
    m.sender.toLowerCase().includes(search.toLowerCase()) || 
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleSmartSync = async () => {
    setIsSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const incoming: ArchivedMessage = {
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
      toast({ title: "Autonomous Indexing Complete", description: "New High-Value Opportunity detected." });
      handleRunGlobalIntelligence();
    } catch (error) {
      toast({ variant: "destructive", title: "Sync Error", description: "Intelligence bridge failed." });
    } finally {
      setIsSyncing(false);
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 px-2 py-0 border-primary/20">OS v3.0 Autonomous</Badge>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
              <ShieldCheck size={10} className="text-green-500" /> Trust Fabric: ACTIVE
            </span>
          </div>
          <h1 className="text-4xl font-headline font-bold">Mission Control</h1>
          <p className="text-muted-foreground">Unified autonomous orchestration and communication intelligence.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            className="gap-2 shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold group"
            onClick={handleSmartSync}
            disabled={isSyncing}
          >
            {isSyncing ? <RefreshCcw size={16} className="animate-spin" /> : <Zap size={16} className="group-hover:animate-pulse" />}
            {isSyncing ? "Syncing Sources..." : "Sync Intelligence"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20 ghostly-fade overflow-hidden group">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20 text-primary">
                  <Briefcase size={20} />
                </div>
                <h3 className="font-bold">Opportunity Pipeline</h3>
              </div>
              <ArrowUpRight size={16} className="text-primary opacity-50" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-bold font-headline">{globalInsights?.opportunityPipeline || 0}%</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase">Pipeline Health</span>
              </div>
              <Progress value={globalInsights?.opportunityPipeline || 0} className="h-1 bg-white/5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Detected <span className="text-primary font-bold">{stats.opportunities} high-value signals</span> in the last 24h. Potential growth detected in relationship nodes.
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
                <h3 className="font-bold">Pending Decisions</h3>
              </div>
              <MousePointerClick size={16} className="text-accent opacity-50" />
            </div>
            <div className="space-y-3">
              {stats.decisions > 0 ? (
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/10">
                  <p className="text-xs font-bold text-accent mb-1">{stats.decisions} DECISIONS REQUIRED</p>
                  <p className="text-[10px] text-muted-foreground italic leading-tight">Autonomous Agent has drafted 2 response options for Investor Alpha.</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-4">No critical pending decisions identified.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-destructive/5 border-destructive/20 ghostly-fade relative overflow-hidden group">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-destructive/20 text-destructive">
                <ShieldAlert size={20} />
              </div>
              <h3 className="font-bold">Active Risks</h3>
            </div>
            <ul className="space-y-2">
              {globalInsights?.insights.filter(i => i.type === 'Risk').map((risk, idx) => (
                <li key={idx} className="text-xs flex items-start gap-2 text-muted-foreground">
                  <div className="w-1 h-1 rounded-full bg-destructive mt-1.5 shrink-0" />
                  {risk.description}
                </li>
              ))}
              <li className="text-xs flex items-start gap-2 text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-destructive mt-1.5 shrink-0" />
                Unanswered high-priority from Alex Rivera
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Fragments', value: stats.total, icon: BrainCircuit, color: 'text-primary' },
          { label: 'Decision Nodes', value: stats.decisions, icon: CheckCircle2, color: 'text-accent' },
          { label: 'Opportunities', value: stats.opportunities, icon: Rocket, color: 'text-orange-400' },
          { label: 'Trust Score', value: '98%', icon: ShieldCheck, color: 'text-green-400' },
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
            placeholder="Search Memory Graph (e.g. 'Price discussion with Sarah')..." 
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
                        {msg.opportunityScore && msg.opportunityScore > 70 && (
                          <Badge className="bg-orange-500/10 text-orange-400 text-[8px] border-orange-500/20 px-1 py-0">Opportunity</Badge>
                        )}
                        {msg.decisionPending && (
                          <Badge className="bg-accent/10 text-accent text-[8px] border-accent/20 px-1 py-0">Decision Pending</Badge>
                        )}
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
              Autonomous Action Engine
            </DialogTitle>
            <DialogDescription>
              Orchestrating response for {selectedMsg?.sender}
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
                      Autonomous Summary
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
                      <ArrowUpRight size={14} /> Draft Equity Reply
                    </Button>
                    <Button className="h-10 text-xs font-bold bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 justify-start gap-2">
                      <Timer size={14} /> Schedule Follow-up
                    </Button>
                    <Button variant="outline" className="h-10 text-xs font-bold border-white/10 justify-start gap-2">
                      <CheckCircle2 size={14} /> Extract Tasks
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
