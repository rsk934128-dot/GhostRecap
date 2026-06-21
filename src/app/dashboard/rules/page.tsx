"use client";

import { MOCK_RULES } from '@/lib/mock-data';
import { Zap, Plus, GripVertical, Settings2, Code, ArrowRight, Play, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function AutomationStudio() {
  const [rules, setRules] = useState(MOCK_RULES);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Code className="text-primary" size={32} />
            <h1 className="text-4xl font-headline font-bold">Automation Studio</h1>
          </div>
          <p className="text-muted-foreground">Design visual triggers and AI actions to orchestrate your communication workflows.</p>
        </div>
        <Button className="gap-2 shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
          <Plus size={18} /> New Workflow
        </Button>
      </header>

      <div className="grid gap-6">
        {rules.map((rule, i) => (
          <Card key={rule.id} className="ghostly-fade border-white/5 bg-secondary/10 overflow-hidden group" style={{ animationDelay: `${i * 100}ms` }}>
            <CardContent className="p-0">
              <div className="flex items-stretch">
                <div className="w-12 bg-white/5 flex items-center justify-center cursor-grab active:cursor-grabbing border-r border-white/5">
                  <GripVertical size={18} className="text-muted-foreground" />
                </div>
                <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Play size={20} className="fill-current" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {rule.name}
                        {rule.tag && <Badge className="bg-accent/20 text-accent text-[10px]">{rule.tag}</Badge>}
                      </h3>
                      <p className="text-xs text-muted-foreground">Trigger: Keyword match <span className="text-foreground font-mono">"{rule.trigger}"</span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs font-mono max-w-xs truncate">
                      Action: {rule.response}
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground" />
                    <div className="p-2 rounded-lg bg-primary/20 border border-primary/20">
                      <Zap size={16} className="text-primary" />
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Workflow Status</span>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xs font-bold", rule.isActive ? "text-primary" : "text-muted-foreground")}>
                          {rule.isActive ? "ACTIVE" : "PAUSED"}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Database size={16} className="text-primary" />
              Intelligence Triggers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {['Intent Analysis', 'Sentiment Change', 'Priority Breach', 'Relationship Cooling'].map(t => (
              <div key={t} className="flex items-center justify-between p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer group">
                <span className="text-xs text-muted-foreground group-hover:text-foreground">{t}</span>
                <Badge variant="outline" className="text-[9px] border-white/10 uppercase">v2 API</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}