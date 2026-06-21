"use client";

import { MOCK_CONTACTS } from '@/lib/mock-data';
import { Users, Target, MessageSquare, TrendingUp, ShieldCheck, Mail, Phone, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function RelationshipIntelligence() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-primary" size={32} />
          <h1 className="text-4xl font-headline font-bold">Relationship Intelligence</h1>
        </div>
        <p className="text-muted-foreground">AI-driven contact interaction scores and communication health metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_CONTACTS.map((contact, i) => (
          <Card key={contact.id} className="bg-secondary/10 border-white/5 hover:bg-secondary/20 transition-all ghostly-fade" style={{ animationDelay: `${i * 100}ms` }}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-headline text-xl font-bold text-primary">
                  {contact.name.charAt(0)}
                </div>
                <Badge variant={contact.priority === 'High' ? 'destructive' : 'outline'} className="text-[10px] border-white/5">
                  {contact.priority} Priority
                </Badge>
              </div>
              <CardTitle className="mt-4">{contact.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                {contact.platforms.map(p => (
                  <Badge key={p} variant="secondary" className="text-[8px] px-1.5 py-0 bg-white/5">{p}</Badge>
                ))}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Interaction Score</span>
                  <span className="text-primary">{contact.interactionScore}%</span>
                </div>
                <Progress value={contact.interactionScore} className="h-1 bg-white/5" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-2 border-y border-white/5">
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Response Rate</p>
                  <p className="text-sm font-bold">98.2%</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Last Sync</p>
                  <p className="text-sm font-bold">2h ago</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 h-8 border-white/10 hover:bg-primary/10 hover:text-primary">
                  Insights
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-8 border-white/10 hover:bg-accent/10 hover:text-accent">
                  Full Audit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
          <TrendingUp className="text-primary" size={48} />
          <div>
            <h3 className="text-xl font-headline font-bold">Communication Productivity Index</h3>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-2">
              Based on your last 7 days of intelligence logs, your interaction efficiency has increased by 14%. Focus on 3 urgent threads from Alex Rivera for optimal SLA compliance.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
            View Analytics Deep-Dive
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
