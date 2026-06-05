"use client";

import { useState, useEffect, useMemo } from 'react';
import { MOCK_MESSAGES } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { 
  Search, Sparkles, RefreshCcw, BrainCircuit, ShieldAlert, 
  Target, Zap, AlertTriangle, ChevronRight, MessageSquare, 
  CheckCircle2, TrendingUp, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClassificationBadge } from '@/components/dashboard/ClassificationBadge';
import { runCopilot, CopilotOutput } from '@/ai/flows/copilot-workspace';
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

export default function IntelligenceCommandCenter() {
  const [messages, setMessages] = useState<ArchivedMessage[]>(MOCK_MESSAGES);
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<ArchivedMessage | null>(null);
  const [analysis, setAnalysis] = useState<CopilotOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    return {
      total: messages.length,
      urgent: messages.filter(m => m.category === 'Urgent').length,
      otp: messages.filter(m => m.category === 'OTP').length,
      spam: messages.filter(m => m.isSpam).length,
      avgPriority: Math.round(messages.reduce((acc, m) => acc + (m.priorityScore || 0), 0) / messages.length)
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
        sender: 'Project Lead',
        content: 'URGENT: Client feedback received. Review the shared document ASAP.',
        timestamp: new Date().toISOString(),
        app: 'WhatsApp',
        category: 'Urgent',
        priorityScore: 98,
      };
      setMessages(prev => [incoming, ...prev]);
      toast({ title: "Command Sync Complete", description: "New urgent intelligence fragment indexed." });
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
            <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 px-2 py-0 border-primary/20">OS v2.5 Cognitive</Badge>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
              <TrendingUp size={10} className="text-green-500" /> System Health: 94%
            </span>
          </div>
          <h1 className="text-4xl font-headline font-bold">Executive Command Center</h1>
          <p className="text-muted-foreground">AI-driven predictive intelligence and communication orchestration.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            className="gap-2 shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold group"
            onClick={handleSmartSync}
            disabled={isSyncing}
          >
            {isSyncing ? <RefreshCcw size={16} className="animate-spin" /> : <Zap size={16} className="group-hover:animate-pulse" />}
            {isSyncing ? "Orchestrating..." : "Sync Intelligence"}
          </Button>
        </div>
      </header>

      {/* Cognitive Layer Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20 ghostly-fade overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
            <BrainCircuit size={80} />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-primary/20 text-primary">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold">Cognitive Briefing</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have <span className="text-primary font-bold">{stats.urgent} urgent</span> threads requiring attention. 
              <span className="text-foreground"> 3 actionable tasks</span> were detected in recent Signal communications. 
              Communication health has improved by <span className="text-green-400 font-bold">12%</span> this week.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-destructive/5 border-destructive/20 ghostly-fade relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
            <ShieldAlert size={80} />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-destructive/20 text-destructive">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-bold">Predictive Risks</h3>
            </div>
            <ul className="space-y-2">
              <li className="text-xs flex items-start gap-2 text-muted-foreground">
                <Info size={14} className="text-amber-400 shrink-0 mt-0.5" />
                Unanswered follow-up from Alex Rivera (4h delay)
              </li>
              <li className="text-xs flex items-start gap-2 text-muted-foreground">
                <Info size={14} className="text-red-400 shrink-0 mt-0.5" />
                Detected suspicious login attempt fragment in SMS
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Core Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Fragments', value: stats.total, icon: BrainCircuit, color: 'text-primary' },
          { label: 'High Priority', value: stats.urgent, icon: Target, color: 'text-red-400' },
          { label: 'Security OTP', value: stats.otp, icon: MessageSquare, color: 'text-amber-400' },
          { label: 'Spam Blocked', value: stats.spam, icon: ShieldAlert, color: 'text-muted-foreground' },
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
            placeholder="Ask AI Search (e.g. 'Show budget decisions')..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Intelligence Feed */}
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
                        {msg.priorityScore !== undefined && (
                          <div className="flex items-center gap-1.5 ml-2">
                            <span className={`text-[10px] font-bold ${msg.priorityScore > 80 ? 'text-red-400' : 'text-green-400'}`}>
                              {msg.priorityScore}% Score
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {mounted ? format(new Date(msg.timestamp), 'HH:mm') : '...'}
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

      {/* Copilot Workspace Dialog */}
      <Dialog open={!!selectedMsg} onOpenChange={(open) => !open && setSelectedMsg(null)}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline">
              <BrainCircuit className="text-primary" />
              Copilot Workspace
            </DialogTitle>
            <DialogDescription>
              Cognitive analysis for message from {selectedMsg?.sender}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="p-4 rounded-xl bg-secondary/50 border border-white/5">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Original Context</p>
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
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm leading-relaxed">{analysis.analysis}</p>
                  </CardContent>
                </Card>

                {analysis.tasks && analysis.tasks.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-green-500" /> Action Items Extracted
                    </p>
                    <div className="grid gap-2">
                      {analysis.tasks.map((task, i) => (
                        <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/5 text-xs flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {task}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1 h-9 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                    Draft Contextual Reply
                  </Button>
                  <Button variant="outline" className="flex-1 h-9 text-xs font-bold border-white/10">
                    Add to Follow-up Queue
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
