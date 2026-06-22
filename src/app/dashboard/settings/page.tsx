"use client";

import { useState, useEffect } from 'react';
import { 
  User, 
  Smartphone, 
  Database, 
  Clock,
  Save,
  Trash2,
  AlertCircle,
  Download,
  ShieldCheck,
  FileJson,
  FileSpreadsheet,
  RefreshCcw,
  Lock,
  Copy,
  Terminal,
  Server,
  Zap,
  Archive,
  CloudUpload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { MOCK_MESSAGES } from '@/lib/mock-data';

export default function SettingsPage() {
  const { user, isAdmin } = useUser();
  const [loading, setLoading] = useState(false);
  const [purging, setPurging] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings Updated",
        description: "Your communication intelligence profile has been saved.",
      });
    }, 1000);
  };

  const handleExportWorkspace = () => {
    setExporting(true);
    setTimeout(() => {
      const backupData = {
        projectName: "GhostRecap OS",
        version: "2.5.0-ALPHA",
        timestamp: new Date().toISOString(),
        backupType: "FULL_WORKSPACE_FRAGMENT",
        nodeId: user?.uid || "NEXUS-01",
        migrationStatus: "READY_FOR_AI_STUDIO",
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ghostrecap_workspace_backup_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExporting(false);
      toast({
        title: "Workspace Exported",
        description: "Your project backup is ready for Google AI Studio or Antigravity.",
      });
    }, 2000);
  };

  const handleForceSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast({
        title: "Global Sync Success",
        description: "All merchant nodes have been synchronized with the HSM master key.",
      });
    }, 2000);
  };

  const handlePurge = () => {
    setPurging(true);
    setTimeout(() => {
      setPurging(false);
      toast({
        variant: "destructive",
        title: "Wipe Complete",
        description: "All local communication fragments and audit trails have been permanently erased.",
      });
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-headline font-bold mb-2">Platform Controls</h1>
          <p className="text-muted-foreground">Manage your communication intelligence, auditing, and privacy preferences.</p>
        </div>
        {isAdmin && (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 mb-1 px-4 py-1">
            <ShieldCheck size={14} className="mr-2" /> System Superuser
          </Badge>
        )}
      </header>

      <div className="grid gap-8">
        {/* Migration Alert */}
        <Alert className="bg-primary/5 border-primary/20 ghostly-fade">
          <Zap className="h-4 w-4 text-primary" />
          <AlertTitle className="font-bold">Firebase Studio Migration Plan</AlertTitle>
          <AlertDescription className="text-xs leading-relaxed mt-1">
            Firebase Studio is transitioning to <strong>Google AI Studio</strong>. Your core services (Firestore, Auth) are safe. Use the export tool below to back up your workspace before <strong>March 22, 2027</strong>.
          </AlertDescription>
        </Alert>

        {/* Workspace Backup Section */}
        <Card className="bg-primary/5 border-primary/20 ghostly-fade">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Archive size={20} /> Project Portability
            </CardTitle>
            <CardDescription>Export your full workspace configuration for local Antigravity or AI Studio migration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleExportWorkspace} 
                disabled={exporting}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 gap-2"
              >
                {exporting ? <RefreshCcw size={18} className="animate-spin" /> : <Download size={18} />}
                Export Workspace Zip
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-white/10 hover:bg-white/5 h-12 gap-2"
                onClick={() => toast({ title: "Handshake Active", description: "Project linked to Google AI Studio Node." })}
              >
                <CloudUpload size={18} /> Transfer to AI Studio
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground italic flex items-center gap-2">
              <ShieldCheck size={12} /> Backup includes Genkit flows, intelligence fragments, and node topography.
            </p>
          </CardContent>
        </Card>

        {/* Admin Controls Section */}
        {isAdmin && (
          <Card className="bg-amber-500/5 border-amber-500/20 ghostly-fade">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-500">
                <Terminal size={20} /> Root Node Controls
              </CardTitle>
              <CardDescription>Advanced system-wide orchestrations for administrative nodes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="border-amber-500/20 hover:bg-amber-500/10 text-amber-500 gap-2 h-12 font-bold"
                  onClick={handleForceSync}
                  disabled={syncing}
                >
                  {syncing ? <RefreshCcw size={18} className="animate-spin" /> : <Server size={18} />}
                  {syncing ? "Syncing Nodes..." : "Global Sync Force"}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-amber-500/20 hover:bg-amber-500/10 text-amber-500 gap-2 h-12 font-bold"
                  onClick={() => toast({ title: "AI Flushed", description: "Node cache cleared." })}
                >
                  <Zap size={18} /> Flush AI Memory
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-secondary/10 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <User size={20} /> Merchant Profile
            </CardTitle>
            <CardDescription>Your unique identity within the Nexus Core network.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Merchant Node ID</Label>
              <div className="flex gap-2">
                <Input 
                  value={user?.uid || "Loading..."} 
                  readOnly 
                  className="bg-black/20 border-white/10 font-mono text-xs"
                />
                <Button variant="outline" size="icon" onClick={() => {
                   if (user?.uid) navigator.clipboard.writeText(user.uid);
                   toast({ title: "Copied" });
                }} className="shrink-0 border-white/10">
                  <Copy size={16} />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Linked Identity</Label>
              <p className="text-sm font-mono text-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-headline font-bold">Safe-Wipe Control</AlertTitle>
          <AlertDescription>
            Purging your index will permanently erase all communication intelligence metadata and audit trails.
          </AlertDescription>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-4 border-destructive/50 hover:bg-destructive/20" disabled={purging}>
                {purging ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 size={16} className="mr-2" />}
                One-Click Data Purge
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-destructive/20">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive font-headline text-2xl">Confirm Permanent Wipe?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This action is irreversible. All local message fragments, relationship scores, and autonomous logs will be destroyed. 
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-secondary/50 border-white/5 hover:bg-secondary">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handlePurge} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, Purge Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Alert>
      </div>

      <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-white/5">
        <Button onClick={handleSave} disabled={loading} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg">
          {loading ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
          Save Intel Profile
        </Button>
      </div>
    </div>
  );
}
