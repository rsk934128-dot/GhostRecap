"use client";

import { MOCK_RULES } from '@/lib/mock-data';
import { Zap, Plus, GripVertical, Settings2, Code, ArrowRight, Play, Database, Save, BrainCircuit, Activity, Trash2, BookText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { AutomationRule } from '@/lib/types';

export default function AutomationStudio() {
  const [rules, setRules] = useState<AutomationRule[]>(MOCK_RULES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSDKDocsOpen, setIsSDKDocsOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    trigger: '',
    response: '',
    isActive: true,
    tag: ''
  });

  const handleCreateRule = () => {
    if (!newRule.name || !newRule.trigger || !newRule.response) {
      toast({
        variant: "destructive",
        title: "Incomplete Configuration",
        description: "Please fill in all required fields to register the workflow."
      });
      return;
    }

    const rule: AutomationRule = {
      id: Math.random().toString(36).substring(7),
      name: newRule.name!,
      trigger: newRule.trigger!,
      response: newRule.response!,
      isActive: true,
      tag: newRule.tag || undefined
    };

    setRules(prev => [rule, ...prev]);
    setIsDialogOpen(false);
    setNewRule({ name: '', trigger: '', response: '', isActive: true, tag: '' });
    
    toast({
      title: "Workflow Registered",
      description: `${rule.name} is now active in your intelligence queue.`
    });
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    toast({ title: "Workflow Deleted", description: "Node successfully pruned from intelligence layer." });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] border-primary/20 text-primary bg-primary/5 uppercase font-bold tracking-widest">Step 5: Automation Studio</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="text-primary" size={32} />
            <h1 className="text-4xl font-headline font-bold">Intelligence Studio</h1>
          </div>
          <p className="text-muted-foreground">Design visual triggers and AI actions to orchestrate your communication workflows.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-6">
              <Plus size={18} /> New AI Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-white/10">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Design New Workflow</DialogTitle>
              <DialogDescription>
                Define a trigger keyword and the autonomous response for the system to execute.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase text-muted-foreground">Workflow Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Urgent Client Follow-up" 
                  className="bg-black/20 border-white/10 h-11"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trigger" className="text-xs font-bold uppercase text-muted-foreground">Trigger Keyword</Label>
                  <Input 
                    id="trigger" 
                    placeholder="e.g. meeting" 
                    className="bg-black/20 border-white/10 h-11 font-mono"
                    value={newRule.trigger}
                    onChange={(e) => setNewRule(prev => ({ ...prev, trigger: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tag" className="text-xs font-bold uppercase text-muted-foreground">Category Tag</Label>
                  <Input 
                    id="tag" 
                    placeholder="Optional tag" 
                    className="bg-black/20 border-white/10 h-11"
                    value={newRule.tag}
                    onChange={(e) => setNewRule(prev => ({ ...prev, tag: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="response" className="text-xs font-bold uppercase text-muted-foreground">Autonomous Response</Label>
                <Textarea 
                  id="response" 
                  placeholder="Describe the action or text response..." 
                  className="bg-black/20 border-white/10 min-h-[100px] resize-none"
                  value={newRule.response}
                  onChange={(e) => setNewRule(prev => ({ ...prev, response: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleCreateRule}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
              >
                <Save size={16} className="mr-2" /> Activate Workflow
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid gap-6">
        {rules.map((rule, i) => (
          <Card key={rule.id} className="ghostly-fade border-white/5 bg-secondary/10 overflow-hidden group hover:border-primary/30 transition-all" style={{ animationDelay: `${i * 100}ms` }}>
            <CardContent className="p-0">
              <div className="flex items-stretch">
                <div className="w-12 bg-white/5 flex items-center justify-center cursor-grab active:cursor-grabbing border-r border-white/5">
                  <GripVertical size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner group-hover:scale-105 transition-transform">
                      <Play size={24} className="fill-current" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl flex items-center gap-2">
                        {rule.name}
                        {rule.tag && <Badge className="bg-accent/20 text-accent text-[10px] font-bold border-accent/20">{rule.tag}</Badge>}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                         <Badge variant="outline" className="text-[10px] border-white/10 text-muted-foreground">TRIGGER</Badge>
                         <p className="text-sm font-mono text-foreground">Keyword: "{rule.trigger}"</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-1 max-w-md items-center gap-4 px-6 border-x border-white/5 h-full">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono flex-1 truncate">
                      <span className="text-primary font-bold mr-2">ACTION:</span>
                      {rule.response}
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground" />
                    <div className="p-3 rounded-xl bg-primary/20 border border-primary/20 animate-pulse">
                      <Zap size={20} className="text-primary" />
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Node Status</span>
                      <div className="flex items-center gap-3">
                        <span className={cn("text-xs font-bold", rule.isActive ? "text-primary" : "text-muted-foreground")}>
                          {rule.isActive ? "ACTIVE" : "PAUSED"}
                        </span>
                        <Switch checked={rule.isActive} onCheckedChange={(val) => {
                          setRules(prev => prev.map(r => r.id === rule.id ? { ...r, isActive: val } : r));
                        }} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="ghost" size="icon" className="hover:bg-white/10 h-10 w-10">
                         <Settings2 size={18} />
                       </Button>
                       <Button variant="ghost" size="icon" className="hover:bg-destructive/10 hover:text-destructive h-10 w-10" onClick={() => deleteRule(rule.id)}>
                         <Trash2 size={18} />
                       </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5"><BrainCircuit size={100} /></div>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity size={18} className="text-primary" /> Intelligence Trigger Matrix
            </CardTitle>
            <CardDescription>Available signals for cross-border orchestration.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { label: 'Intent Analysis', status: 'v2 API' },
              { label: 'Sentiment Change', status: 'ACTIVE' },
              { label: 'Priority Breach', status: 'v2 API' },
              { label: 'Settlement Signal', status: 'NEW' },
              { label: 'Node Downtime', status: 'BETA' },
              { label: 'RSA Mismatch', status: 'ACTIVE' }
            ].map(t => (
              <div key={t.label} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                <span className="text-xs text-muted-foreground group-hover:text-foreground font-medium">{t.label}</span>
                <Badge variant="outline" className="text-[8px] border-white/10 uppercase font-bold">{t.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="p-8 rounded-3xl bg-secondary/20 border border-white/5 flex flex-col items-center text-center space-y-4 justify-center">
           <Code size={48} className="text-accent" />
           <div>
             <h3 className="text-xl font-headline font-bold">Custom Logic Layer</h3>
             <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
               Coming Soon: Write custom TypeScript snippets to handle complex financial handshakes and automated payouts.
             </p>
           </div>
           <Button variant="outline" className="border-white/10 hover:bg-accent/10 hover:text-accent gap-2" onClick={() => setIsSDKDocsOpen(true)}>
             <BookText size={16} /> Access SDK Docs
           </Button>
        </div>
      </div>

      <Dialog open={isSDKDocsOpen} onOpenChange={setIsSDKDocsOpen}>
        <DialogContent className="max-w-4xl bg-card/95 backdrop-blur-xl border-white/10 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-headline font-bold flex items-center gap-2">
              <Code className="text-primary" /> GhostRecap OS SDK Docs
            </DialogTitle>
            <DialogDescription>Developer guidelines for Mission 400 node integration.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6 text-sm leading-relaxed">
            <section className="space-y-3">
              <h4 className="text-lg font-bold text-primary">১. কোর হ্যান্ডশেক প্রোটোকল (Core Handshake)</h4>
              <p className="text-muted-foreground">প্রতিটি নোড কানেকশনের জন্য `RSA-2048` ডিজিটাল সিগনেচার বাধ্যতামূলক। আমাদের ওএস স্বয়ংক্রিয়ভাবে মিডল্যান্ড ব্যাংক কোর এবং নগদ গেটওয়ের জন্য চ্যালেঞ্জ-রেসপন্স হ্যান্ডশেক জেনারেট করে।</p>
              <div className="p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-accent">
                const signature = generateNagadSignature(payload);<br/>
                const hsmResponse = await verifyHSMHandshake(nodeId);
              </div>
            </section>
            <Separator className="bg-white/5" />
            <section className="space-y-3">
              <h4 className="text-lg font-bold text-primary">২. পিআইআই রেড্যাকশন (PII Redaction)</h4>
              <p className="text-muted-foreground">এআই এজেন্টদের ডাটা ফিড করার আগে সেনসিটিভ তথ্য (ফোন নম্বর, ইমেইল) মাস্ক করা হয়। এটি GDPR এবং DORA কমপ্লায়েন্স নিশ্চিত করে।</p>
              <ul className="list-disc list-inside text-muted-foreground ml-2">
                <li>Regex-based Stage 1 detection.</li>
                <li>Dynamic data masking in memory.</li>
                <li>Structured audit logging for every MCP tool call.</li>
              </ul>
            </section>
            <section className="space-y-3">
              <h4 className="text-lg font-bold text-primary">৩. ইলাস্টিক এমসিপি (Elastic MCP)</h4>
              <p className="text-muted-foreground">আমির গরজি-র ফিন্যান্সিয়াল ইলাস্টিক এমসিপি সার্ভার ব্যবহার করে আপনি সরাসরি আপনার লেজার থেকে ডাটা কোয়েরি করতে পারবেন।</p>
              <div className="p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-green-400">
                npx lhm plugin publish --dir ./src/mcp-node
              </div>
            </section>
          </div>
          <DialogFooter>
            <Button className="bg-primary font-bold px-8" onClick={() => setIsSDKDocsOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
