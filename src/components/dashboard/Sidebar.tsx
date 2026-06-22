
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
  GitBranch
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
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
    { name: 'Intel & Roadmap', icon: BrainCircuit, href: '/dashboard/privacy' },
  ];

  return (
    <aside className={cn(
      "h-screen flex flex-col border-r border-border transition-all duration-300 bg-card/40 backdrop-blur-xl sticky top-0",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center gap-3">
        <Logo size={collapsed ? 32 : 40} />
        {!collapsed && <span className="font-headline font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">GhostRecap</span>}
      </div>

      <nav className="flex-1 px-3 space-y-1">
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
              {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border flex flex-col gap-2">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all",
          )}
        >
          <Settings size={20} />
          {!collapsed && <span className="font-medium text-sm">OS Settings</span>}
        </Link>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="self-center mt-2"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
    </aside>
  );
}
