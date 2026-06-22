
"use client";

import { useState, useEffect } from 'react';
import { 
  GitBranch, 
  FlaskConical, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Terminal, 
  RefreshCcw,
  Smartphone,
  Cpu,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MOCK_TEST_RESULTS, MOCK_PIPELINE_BUILDS } from '@/lib/mock-data';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function CICDMonitorPage() {
  const [mounted, setMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleManualTrigger = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12" suppressHydrationWarning>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] border-primary/20 text-primary bg-primary/5 uppercase font-bold tracking-widest">Gcloud Auth: Success</Badge>
          </div>
          <div className="flex items-center gap-3">
            <GitBranch className="text-primary" size={32} />
            <h1 className="text-4xl font-headline font-bold">CI/CD Monitor</h1>
          </div>
          <p className="text-muted-foreground">Monitoring build pipelines and Firebase Test Lab Robo-crawlers.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleManualTrigger} 
            disabled={isSyncing}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
          >
            {isSyncing ? <RefreshCcw size={16} className="animate-spin" /> : <Terminal size={16} />}
            Trigger Build Flow
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-secondary/10 border-white/5 ghostly-fade">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-headline font-bold">98.2%</CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
              <Activity size={12} className="text-primary" /> Active Pipeline Health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={98.2} className="h-1 bg-white/5" />
            <p className="text-[10px] text-muted-foreground mt-2 font-mono uppercase">24 Builds / 24h</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-white/5 ghostly-fade" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-headline font-bold">85%</CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
              <FlaskConical size={12} className="text-accent" /> Test Lab Coverage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={85} className="h-1 bg-white/5 bg-accent" />
            <p className="text-[10px] text-muted-foreground mt-2 font-mono uppercase">Robo-Crawler Active</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-white/5 ghostly-fade" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-headline font-bold">Stable</CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
              <ShieldCheck size={12} className="text-green-500" /> Security Sharding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-1 flex-1 bg-green-500 rounded-full" />)}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 font-mono uppercase">Parallel Nodes: 05</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-secondary/10 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Monitor size={20} className="text-primary" /> Recent Builds
            </CardTitle>
            <CardDescription>Automated CI triggers from GitHub Actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_PIPELINE_BUILDS.map((build) => (
              <div key={build.id} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    build.status === 'Success' ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
                  )}>
                    {build.status === 'Success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">{build.id}</p>
                      <Badge variant="outline" className="text-[8px] border-white/10">{build.branch}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono">SHA: {build.commitHash} | {build.author}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{mounted && build.timestamp ? format(new Date(build.timestamp), 'MMM d, HH:mm') : '...'}</p>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                    <ExternalLink size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FlaskConical size={20} className="text-accent" /> Test Lab Intelligence
            </CardTitle>
            <CardDescription>Real-device matrix results for MDB Core Nexus.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_TEST_RESULTS.map((test) => (
              <div key={test.id} className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone size={18} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-bold">{test.device}</p>
                      <p className="text-[10px] text-muted-foreground">{test.osVersion} • {test.type} Test</p>
                    </div>
                  </div>
                  <Badge variant={test.status === 'Passed' ? 'default' : 'destructive'} className={cn(
                    "text-[9px] uppercase font-bold",
                    test.status === 'Passed' ? "bg-green-500/10 text-green-500 border-green-500/20" : ""
                  )}>
                    {test.status}
                  </Badge>
                </div>
                
                {test.screenshots && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {test.screenshots.map((s, idx) => (
                      <div key={idx} className="relative w-16 h-28 rounded-md overflow-hidden border border-white/10 shrink-0">
                        <Image src={s} alt="Robo Step" fill className="object-cover opacity-60 hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                    <div className="w-16 h-28 rounded-md border border-dashed border-white/10 flex flex-col items-center justify-center text-muted-foreground gap-1 cursor-pointer hover:bg-white/5 transition-colors">
                      <ExternalLink size={12} />
                      <span className="text-[8px] font-bold">Logs</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock size={10} /> Duration: {test.duration}
                  </span>
                  <span className="text-sm text-muted-foreground font-mono">
                    {mounted && test.timestamp ? format(new Date(test.timestamp), 'MMM d, HH:mm') : '...'}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-primary/5 border-primary/20 p-8 flex flex-col items-center text-center space-y-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
          <Cpu className="text-primary relative z-10" size={48} />
          <div className="relative z-10">
            <h3 className="text-xl font-headline font-bold">Parallel Sharding Active</h3>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-2">
              Your test suite is split across <span className="text-primary font-bold">5 parallel device nodes</span>. Current execution time reduced by <span className="text-green-500 font-bold">72%</span> compared to serial testing.
            </p>
          </div>
          <button className="relative z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-primary/20 hover:bg-primary/10 hover:text-primary h-9 px-3">
            Manage Shard Policy <ChevronRight size={14} />
          </button>
        </Card>

        <Card className="bg-secondary/10 border-white/5">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Terminal size={16} className="text-muted-foreground" />
              Build Execution Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Environment', value: 'Google Cloud Workstations' },
              { label: 'Runner', value: 'Ubuntu-22.04 (Standard-4)' },
              { label: 'SDK Version', value: 'Firebase-CLI v12.4.0' },
              { label: 'Artifacts', value: 'Cloud Storage Bucket (gs://mdb-nexus-builds)' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-muted-foreground">{item.label}:</span>
                <span className="text-foreground">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
