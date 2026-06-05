"use client";

import { MOCK_RULES } from '@/lib/mock-data';
import { Zap, Plus, GripVertical, Settings2, Power } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function RulesPage() {
  const [rules, setRules] = useState(MOCK_RULES);

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-primary fill-primary/20" size={32} />
            <h1 className="text-4xl font-headline font-bold">Response Rule Builder</h1>
          </div>
          <p className="text-muted-foreground">Automate your replies based on high-precision keyword matching and intent analysis.</p>
        </div>
        <Button className="gap-2 shadow-[0_0_20px_rgba(26,198,255,0.4)] bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus size={18} /> New Rule
        </Button>
      </header>

      <div className="grid gap-6">
        {rules.map((rule, i) => (
          <Card key={rule.id} className="ghostly-fade border-white/5 bg-secondary/10 overflow-hidden" style={{ animationDelay: `${i * 100}ms` }}>
            <CardContent className="p-0">
              <div className="flex items-stretch">
                <div className="w-12 bg-white/5 flex items-center justify-center cursor-grab active:cursor-grabbing border-r border-white/5">
                  <GripVertical size={18} className="text-muted-foreground" />
                </div>
                <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">{rule.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      <Zap size={12} className="text-accent" /> Active Automation
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Trigger Keywords</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                        "{rule.trigger}"
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-6">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</span>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xs font-bold", rule.isActive ? "text-accent" : "text-muted-foreground")}>
                          {rule.isActive ? "RUNNING" : "PAUSED"}
                        </span>
                        <Switch checked={rule.isActive} onCheckedChange={(val) => {
                          setRules(prev => prev.map(r => r.id === rule.id ? { ...r, isActive: val } : r));
                        }} />
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="hover:bg-white/10">
                      <Settings2 size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}