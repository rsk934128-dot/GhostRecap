
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  History, 
  Zap, 
  Link2, 
  Settings,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Target,
  Lock,
  BarChart3,
  Globe,
  Waves,
  Music,
  GitBranch,
  Copy,
  User as UserIcon,
  ShieldCheck,
  Menu,
  X,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useUser } from '@/firebase';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

export const navItems = [
  { name: 'Command Center', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Nexus Ledger', icon: BarChart3, href: '/dashboard/ledger' },
  { name: 'Global Bridge', icon: Globe, href: '/dashboard/compliance' },
  { name: 'Ocean Mixing', icon: Waves, href: '/dashboard/ocean' },
  { name: 'Audit History', icon: History, href: '/dashboard/timeline' },
  { name: 'CI/CD Monitor', icon: GitBranch, href: '/dashboard/testing' },
  { name: 'Relationship Intel', icon: Target, href: '/dashboard/contacts' },
  { name: 'Secure Vault', icon: Lock, href: '/dashboard/vault' },
  { name: 'Automation Studio', icon: Zap, href: '/dashboard/rules' },
  { name: 'Direct Link Hub', icon: Link2, href: '/dashboard/direct' },
  { name: 'Media Hub', icon: Music, href: '/dashboard/media' },
  { name: 'Strategic Docs', icon: FileText, href: '/dashboard/docs' },
  { name: 'Intel & Roadmap', icon: BrainCircuit, href: '/dashboard/privacy' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAdmin } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyProfileId = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      toast({
        title: "Profile ID Copied",
        description: "Your unique identifier has been copied to the clipboard.",
      });
    }
  };

  if (!mounted) return null;

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className={cn("p-6 flex items-center gap-3", collapsed && !mobile && "justify-center")}>
        <Logo size={collapsed && !mobile ? 32 : 40} />
        {(!collapsed || mobile) && <span className="font-headline font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">GhostRecap</span>}
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-none">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-transform",
                isActive ? "scale-110" : "group-hover:scale-110"
              )} />
              {(!collapsed || mobile) && <span className="font-medium text-sm">{item.name}</span>}
              {isActive && (!collapsed || mobile) && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border flex flex-col gap-2">
        {user && (!collapsed || mobile) && (
          <div className="px-3 py-2 mb-2 rounded-lg bg-black/20 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
               <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <UserIcon size={10} /> Profile ID
              </p>
              {isAdmin && (
                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[8px] h-4 py-0 px-1 font-bold">
                  <ShieldCheck size={8} className="mr-0.5" /> ADMIN
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-primary truncate">
                {user.uid.substring(0, 12)}...
              </span>
              <button onClick={copyProfileId} className="hover:text-primary transition-colors">
                <Copy size={10} />
              </button>
            </div>
          </div>
        )}
        
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all",
            collapsed && !mobile && "justify-center"
          )}
        >
          <Settings size={20} />
          {(!collapsed || mobile) && <span className="font-medium text-sm">OS Settings</span>}
        </Link>
        
        {!mobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="self-center mt-2"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex h-screen flex-col border-r border-border transition-all duration-300 bg-card/40 backdrop-blur-xl sticky top-0 z-40",
        collapsed ? "w-20" : "w-64"
      )}>
        <NavContent />
      </aside>

      {/* Mobile Trigger Header */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-headline font-bold text-lg">GhostRecap</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-card border-r border-white/5 w-64">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <NavContent mobile />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
