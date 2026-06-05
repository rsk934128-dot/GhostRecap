"use client";

import { useState, useEffect, useMemo } from 'react';
import { MOCK_MESSAGES } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Search, Filter, Sparkles, MoreVertical, Trash2, RefreshCcw, BrainCircuit, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClassificationBadge } from '@/components/dashboard/ClassificationBadge';
import { smartMessageCategorization } from '@/ai/flows/smart-message-categorization';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ArchivedMessage } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export default function IntelligenceDashboard() {
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
    };
  }, [messages]);

  const filtered = messages.filter(m => 
    m.sender.toLowerCase().includes(search.toLowerCase()) || 
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  async function handleAnalyze(id: string, content: string) {
    setAnalyzing(id);
    try {
      const result = await smartMessageCategorization({ messageContent: content });
      // Simulate Intelligence scoring
      const priority = Math.floor(Math.random() * 100);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, category: result.category, priorityScore: priority } : m));
      toast({
        title: "Intelligence Analysis Complete",
        description: `Message prioritized with score: ${priority}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to run intelligence engine.",
      });
    } finally {
      setAnalyzing(null);
    }
  }

  const handleSmartSync = async () => {
    setIsSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const incoming: ArchivedMessage[] = [
        {
          id: Math.random().toString(36).substring(7),
          sender: 'CryptoBase',
          content: 'Alert: Your login was successful from a new device in Tokyo.',
          timestamp: new Date().toISOString(),
          app: 'Signal',
          priorityScore: 85,
        }
      ];
      setMessages(prev => [...incoming, ...prev]);
      toast({ title: "Audit Sync Complete", description: "New communication fragments indexed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Sync Error", description: "Audit trail synchronization failed." });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold mb-2">Unified Feed</h1>
          <p className="text-muted-foreground">AI-powered communication intelligence and secure audit trail.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="gap-2 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            onClick={handleSmartSync}
            disabled={isSyncing}
          >
            {isSyncing ? <RefreshCcw size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {isSyncing ? "Syncing Intelligence..." : "Audit Sync"}
          </Button>
        </div>
      </header>

      {/* Intelligence Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Index', value: stats.total, icon: BrainCircuit, color: 'text-primary' },
          { label: 'Action Required', value: stats.urgent, icon: ShieldAlert, color: 'text-red-400' },
          { label: 'Auth Codes', value: stats.otp, icon: RefreshCcw, color: 'text-amber-400' },
          { label: 'Spam Filtered', value: stats.spam, icon: Trash2, color: 'text-muted-foreground' },
        ].map((stat, i) => (
          <Card key={i} className="bg-secondary/10 border-white/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold font-headline">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input 
          className="pl-10 h-12 bg-secondary/50 border-white/5" 
          placeholder="Search unified communication feed..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((msg, i) => (
          <Card key={msg.id} className="ghostly-fade border-white/5 bg-secondary/20 hover:bg-secondary/30 transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20 shrink-0">
                {msg.sender.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold truncate">{msg.sender}</span>
                    <Badge variant="outline" className="text-[9px] uppercase">{msg.app}</Badge>
                    {msg.category && <ClassificationBadge category={msg.category} />}
                    {msg.priorityScore !== undefined && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${msg.priorityScore > 70 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        Priority: {msg.priorityScore}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {mounted ? format(new Date(msg.timestamp), 'h:mm a') : '...'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {msg.content}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {!msg.category && (
                  <Button variant="ghost" size="icon" onClick={() => handleAnalyze(msg.id, msg.content)} disabled={analyzing === msg.id}>
                    <Sparkles size={18} className={analyzing === msg.id ? 'animate-spin' : ''} />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <MoreVertical size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}