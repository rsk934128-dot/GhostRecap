"use client";

import { Link2, MessageCircle, Send, Users, Smartphone, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function DirectLinkHub() {
  const [id, setId] = useState('');
  const [selectedApp, setSelectedApp] = useState<'whatsapp' | 'telegram' | 'signal'>('whatsapp');

  const apps = [
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, prefix: 'https://wa.me/', placeholder: 'Phone (e.g. 1234567890)' },
    { id: 'telegram', name: 'Telegram', icon: Send, prefix: 'https://t.me/', placeholder: 'Username (e.g. ghost_recap)' },
    { id: 'signal', name: 'Signal', icon: Shield, prefix: 'https://signal.me/#p/', placeholder: 'Phone (e.g. +1...)' },
  ];

  const handleOpen = () => {
    if (!id) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a target identifier.' });
      return;
    }
    const app = apps.find(a => a.id === selectedApp);
    if (app) {
      window.open(`${app.prefix}${id.replace(/\+/g, '')}`, '_blank');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <Link2 className="text-primary" size={32} />
          <h1 className="text-4xl font-headline font-bold">Direct Link Hub</h1>
        </div>
        <p className="text-muted-foreground">Bypass contact saving with secure deep links directly to messaging platforms.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {apps.map((app) => (
          <Card 
            key={app.id} 
            className={cn(
              "cursor-pointer transition-all border-white/5",
              selectedApp === app.id ? "bg-primary/10 ring-2 ring-primary/50" : "bg-secondary/20 hover:bg-secondary/30"
            )}
            onClick={() => setSelectedApp(app.id as any)}
          >
            <CardContent className="p-6 flex flex-col items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                selectedApp === app.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-white/5 text-muted-foreground"
              )}>
                <app.icon size={24} />
              </div>
              <span className="font-bold tracking-tight">{app.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-secondary/10 border-white/5 ghostly-fade">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone size={20} className="text-primary" />
            Target Identifier
          </CardTitle>
          <CardDescription>Enter the username or phone number to open the chat instantly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input 
              className="bg-black/20 border-white/10 h-12 text-lg font-mono focus-visible:ring-primary/50"
              placeholder={apps.find(a => a.id === selectedApp)?.placeholder}
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <Button className="h-12 px-8 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold" onClick={handleOpen}>
              <Send size={18} /> Open Chat
            </Button>
          </div>
          <p className="text-xs text-muted-foreground italic flex items-center gap-2">
            <Shield size={12} /> This action creates a direct URI transition. No data is stored on our servers.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="space-y-4">
          <h3 className="text-xl font-headline font-bold flex items-center gap-2">
            <Users size={20} className="text-accent" />
            Recent Destinations
          </h3>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Smartphone size={14} className="text-muted-foreground" />
                  </div>
                  <span className="font-mono text-sm">+1 (555) 012{i}-983</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Telegram</span>
                  <Link2 size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
