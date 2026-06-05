"use client";

import { useEffect, useState } from 'react';
import { MOCK_MESSAGES } from '@/lib/mock-data';
import { History, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function TimelinePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sorted = [...MOCK_MESSAGES].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <History className="text-primary" size={32} />
          <h1 className="text-4xl font-headline font-bold">History Recovery Timeline</h1>
        </div>
        <p className="text-muted-foreground">Visual forensics reconstructs conversation fragments and deleted notifications.</p>
      </header>

      <div className="relative pl-8 space-y-8">
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 timeline-line rounded-full" />
        
        {sorted.map((item, i) => (
          <div key={item.id} className="relative ghostly-fade" style={{ animationDelay: `${i * 150}ms` }}>
            <div className={cn(
              "absolute -left-[31px] top-0 w-8 h-8 rounded-full border-2 border-background flex items-center justify-center z-10",
              item.isDeleted ? "bg-accent text-accent-foreground" : "bg-card text-primary"
            )}>
              {item.isDeleted ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
            </div>
            
            <Card className={cn(
              "border-white/5 overflow-hidden",
              item.isDeleted ? "bg-accent/5 ring-1 ring-accent/30" : "bg-card/50"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-headline font-bold">{item.sender}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 font-bold uppercase tracking-widest">{item.app}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {mounted ? format(new Date(item.timestamp), 'MMM d, yyyy h:mm a') : '...'}
                  </span>
                </div>
                <p className={cn(
                  "text-sm leading-relaxed",
                  item.isDeleted ? "text-accent font-medium italic" : "text-muted-foreground"
                )}>
                  {item.isDeleted ? `Recovered Fragment: ${item.content}` : item.content}
                </p>
                {item.isDeleted && (
                  <div className="mt-4 pt-4 border-t border-accent/10 flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-tighter">
                    <AlertTriangle size={10} /> Forensic match found in notification cache
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
