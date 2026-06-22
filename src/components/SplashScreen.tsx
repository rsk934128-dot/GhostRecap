
"use client";

import { Logo } from "./Logo";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="relative group">
        <Logo size={120} className="animate-pulse transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full -z-10 animate-pulse" />
      </div>
      <div className="mt-12 text-center space-y-2 ghostly-fade">
        <h2 className="text-3xl font-headline font-bold tracking-[0.3em] text-primary">
          GHOSTRECAP OS
        </h2>
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-primary/30" />
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.5em]">
            Intelligence Layer 400
          </p>
          <div className="h-px w-8 bg-primary/30" />
        </div>
      </div>
    </div>
  );
}
