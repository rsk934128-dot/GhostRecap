"use client";

import { useState, useEffect } from 'react';
import { MOCK_MESSAGES } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Search, Filter, Sparkles, MoreVertical, Trash2, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClassificationBadge } from '@/components/dashboard/ClassificationBadge';
import { smartMessageCategorization } from '@/ai/flows/smart-message-categorization';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ArchivedMessage } from '@/lib/types';

export default function ArchiveDashboard() {
  const [messages, setMessages] = useState<ArchivedMessage[]>(MOCK_MESSAGES);
  const [search, setSearch] = useState('');
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = messages.filter(m => 
    m.sender.toLowerCase().includes(search.toLowerCase()) || 
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  async function handleAnalyze(id: string, content: string) {
    setAnalyzing(id);
    try {
      const result = await smartMessageCategorization({ messageContent: content });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, category: result.category } : m));
      toast({
        title: "Analysis Complete",
        description: `Message categorized as ${result.category}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to categorize message.",
      });
    } finally {
      setAnalyzing(null);
    }
  }

  const handleSmartSync = async () => {
    setIsSyncing(true);
    try {
      // Simulate fetching new messages from different sources
      await new Promise(resolve => setTimeout(resolve, 2000));

      const incomingMessages: ArchivedMessage[] = [
        {
          id: Math.random().toString(36).substring(7),
          sender: 'Coinbase',
          content: 'New sign-in detected on your account. If this wasn\'t you, please secure your account.',
          timestamp: new Date().toISOString(),
          app: 'Signal',
        },
        {
          id: Math.random().toString(36).substring(7),
          sender: 'Netflix',
          content: 'Your subscription has been renewed. Thank you for being a member.',
          timestamp: new Date().toISOString(),
          app: 'WhatsApp',
        }
      ];

      // Auto-categorize each new message using GenAI
      const categorized = await Promise.all(incomingMessages.map(async (msg) => {
        const result = await smartMessageCategorization({ messageContent: msg.content });
        return { ...msg, category: result.category };
      }));

      setMessages(prev => [...categorized, ...prev]);
      
      toast({
        title: "Smart Sync Complete",
        description: `Synchronized ${categorized.length} new messages from connected platforms.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: "There was a problem synchronizing your archives.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    toast({
      title: "Message Removed",
      description: "Archive fragment has been purged from local storage.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold mb-2">Archive Dashboard</h1>
          <p className="text-muted-foreground">Secure centralized management for all your archived notifications.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:bg-white/5">
            <Filter size={16} /> Filter
          </Button>
          <Button 
            size="sm" 
            className="gap-2 shadow-[0_0_15px_rgba(102,145,255,0.3)] bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            onClick={handleSmartSync}
            disabled={isSyncing}
          >
            {isSyncing ? <RefreshCcw size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {isSyncing ? "Syncing..." : "Smart Sync"}
          </Button>
        </div>
      </header>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
        <Input 
          className="pl-10 h-12 bg-secondary/50 border-white/5 focus-visible:ring-primary/50" 
          placeholder="Search by sender or content..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((msg, i) => (
          <Card key={msg.id} className="ghostly-fade overflow-hidden border-white/5 bg-secondary/20 hover:bg-secondary/30 transition-all" style={{ animationDelay: `${i * 100}ms` }}>
            <CardContent className="p-0">
              <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20 shrink-0">
                  {msg.sender.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold truncate">{msg.sender}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-muted-foreground">{msg.app}</span>
                      {msg.category && <ClassificationBadge category={msg.category} />}
                      {msg.isDeleted && <span className="text-[10px] uppercase tracking-wider font-bold text-accent animate-pulse">Recovered</span>}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {mounted ? format(new Date(msg.timestamp), 'h:mm a') : '...'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {msg.content}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {!msg.category && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-primary hover:text-primary/80 hover:bg-primary/10"
                      onClick={() => handleAnalyze(msg.id, msg.content)}
                      disabled={analyzing === msg.id}
                    >
                      <Sparkles size={18} className={analyzing === msg.id ? 'animate-spin' : ''} />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(msg.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <MoreVertical size={18} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20 bg-secondary/10 rounded-lg border border-dashed border-white/5">
            <RefreshCcw size={40} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground font-medium">No messages found in your forensic archive.</p>
            <Button variant="link" className="text-primary mt-2" onClick={() => setSearch('')}>Clear search filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
