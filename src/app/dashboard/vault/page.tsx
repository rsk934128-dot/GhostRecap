"use client";

import { MOCK_VAULT } from '@/lib/mock-data';
import { ShieldCheck, Lock, Key, FileText, Smartphone, Search, Filter, Trash2, Eye, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function SecureIntelligenceVault() {
  const [locked, setLocked] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (locked) {
    return (
      <div className="h-[80vh] flex items-center justify-center animate-in fade-in duration-500">
        <Card className="max-w-md w-full bg-secondary/10 border-white/5 ghostly-fade">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <Lock className="text-primary" size={32} />
            </div>
            <CardTitle className="text-2xl font-headline font-bold">Vault Locked</CardTitle>
            <CardDescription>Biometric or PIN authentication required to access sensitive fragments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 gap-2" onClick={() => setLocked(false)}>
              <ShieldCheck size={20} /> Authenticate Access
            </Button>
            <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest">
              Zero-Knowledge Local Encryption Active
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="text-primary" size={32} />
            <h1 className="text-4xl font-headline font-bold">Secure Intel Vault</h1>
          </div>
          <p className="text-muted-foreground">Isolated storage for OTPs, sensitive documents, and financial fragments.</p>
        </div>
        <Button variant="outline" className="border-white/10 hover:bg-destructive/10 hover:text-destructive h-10 gap-2" onClick={() => setLocked(true)}>
          <Lock size={16} /> Lock Vault
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input className="pl-10 h-11 bg-secondary/50 border-white/5" placeholder="Search secure vault..." />
          </div>

          <div className="grid gap-4">
            {MOCK_VAULT.map((item, i) => (
              <Card key={item.id} className="bg-secondary/10 border-white/5 hover:bg-secondary/20 transition-all cursor-pointer group ghostly-fade" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    {item.type === 'OTP' ? <Key size={20} /> : <FileText size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-bold text-sm truncate">{item.title}</h4>
                      <span className="text-[10px] text-muted-foreground">
                        {mounted ? format(new Date(item.timestamp), 'MMM d') : '...'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{item.content}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldAlert size={18} className="text-primary" />
                Vault Security Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-2">
                <p className="text-xs font-bold uppercase text-muted-foreground">Auto-Lock Timer</p>
                <Badge variant="outline" className="border-primary/20 text-primary">5 Minutes (Idle)</Badge>
              </div>
              <div className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-2">
                <p className="text-xs font-bold uppercase text-muted-foreground">Encryption Standard</p>
                <p className="text-xs font-mono">AES-256-GCM (Local Only)</p>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-2xl bg-secondary/20 border border-white/5 flex flex-col items-center text-center space-y-3">
            <Smartphone className="text-accent" size={32} />
            <h4 className="font-bold">Device Trust System</h4>
            <p className="text-[11px] text-muted-foreground">This vault is locked to your hardware signature. Data cannot be accessed from new devices without recovery keys.</p>
            <Button size="sm" variant="link" className="text-accent text-xs">Manage Recovery Keys</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
