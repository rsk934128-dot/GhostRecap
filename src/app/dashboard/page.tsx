"use client";

import { useState, useEffect, useMemo } from 'react';
import { MOCK_MESSAGES } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, RefreshCcw, BrainCircuit, ShieldAlert, Target, Zap, AlertTriangle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClassificationBadge } from '@/components/dashboard/ClassificationBadge';
import { smartMessageCategorization } from '@/ai/flows/smart-message-categorization';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ArchivedMessage } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export default function IntelligenceCommandCenter() {
  const [messages, setMessages] = useState<ArchivedMessage[]>(MOCK_MESSAGES);
  const [search, setSearch] = useState('');
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);

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
      await new Promise(resolve => setTimeout(resolve, 2000));
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 px-2 py-0 border-primary/20">OS v2.0</Badge>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">System Status: Optimal</span>
          </div>
          <h1 className="text-4xl font-headline font-bold">Intelligence Command Center</h1>
          <p className="text-muted-foreground">Unified audit feed with AI priority orchestration.</p>
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

      {/* Intelligence Insight Bar */}
      <Card className="bg-primary/5 border-primary/20 ghostly-fade">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary/20">
              <Sparkles size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">Daily Intelligence Brief</p>
              <p className="text-xs text-muted-foreground">You have {stats.urgent} urgent communications requiring immediate follow-up. Avg Priority: {stats.avgPriority}%</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary hover:bg-primary/10">
            Full Summary <ChevronRight size={14} />
          </Button>
        </CardContent>
      </Card>

      {/* Command Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Intelligence Feed', value: stats.total, icon: BrainCircuit, color: 'text-primary', desc: 'Active fragments' },
          { label: 'Action Priority', value: stats.urgent, icon: Target, color: 'text-red-400', desc: 'Immediate response' },
          { label: 'Vault Activity', value: stats.otp, icon: RefreshCcw, color: 'text-amber-400', desc: 'Recent OTPs' },
          { label: 'Threat Monitor', value: stats.spam, icon: AlertTriangle, color: 'text-muted-foreground', desc: 'Blocked attempts' },
        ].map((stat, i) => (
          <Card key={i} className="bg-secondary/10 border-white/5 hover:bg-secondary/20 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-bold font-headline">{stat.value}</p>
                  <span className="text-[9px] text-muted-foreground">{stat.desc}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 group max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            className="pl-10 h-12 bg-secondary/50 border-white/5 focus-visible:ring-primary/50" 
            placeholder="Search Intelligence OS knowledge base..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((msg) => (
          <Card key={msg.id} className="ghostly-fade border-white/5 bg-secondary/20 hover:bg-secondary/30 transition-all group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20 shrink-0">
                {msg.sender.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold truncate">{msg.sender}</span>
                    <Badge variant="outline" className="text-[9px] uppercase border-white/10">{msg.app}</Badge>
                    {msg.category && <ClassificationBadge category={msg.category} />}
                    {msg.priorityScore !== undefined && (
                      <div className="flex items-center gap-1.5 ml-2">
                        <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${msg.priorityScore > 80 ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${msg.priorityScore}%` }} 
                          />
                        </div>
                        <span className={`text-[10px] font-bold ${msg.priorityScore > 80 ? 'text-red-400' : 'text-green-400'}`}>
                          {msg.priorityScore}%
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {mounted ? format(new Date(msg.timestamp), 'h:mm a') : '...'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
                  {msg.content}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-primary font-bold">
                  Analyze <Sparkles size={12} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
