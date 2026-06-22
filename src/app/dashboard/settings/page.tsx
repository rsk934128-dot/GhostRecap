
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
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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

export default function SettingsPage() {
  const { user, isAdmin } = useUser();
  const [loading, setLoading] = useState(false);
  const [purging, setPurging] = useState(false);
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

  const handleExport = (format: string) => {
    toast({
      title: `Export Started`,
      description: `Your communication audit trail is being prepared in ${format} format.`,
    });
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

  const copyProfileId = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      toast({
        title: "Profile ID Copied",
        description: "Your merchant node identifier has been copied.",
      });
    }
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
                <Button variant="outline" className="border-amber-500/20 hover:bg-amber-500/10 text-amber-500 gap-2 h-12 font-bold">
                  <Server size={18} /> Global Sync Force
                </Button>
                <Button variant="outline" className="border-amber-500/20 hover:bg-amber-500/10 text-amber-500 gap-2 h-12 font-bold">
                  <Zap size={18} /> Flush AI Memory
                </Button>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-amber-500/10 space-y-2">
                <p className="text-[10px] font-bold text-amber-500 uppercase">Admin Handshake Status</p>
                <div className="flex items-center gap-2 text-xs font-mono">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span>NODE_ALPHA_ROOT: VERIFIED_GR8821</span>
                </div>
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
              <Label className="text-xs font-bold text-muted-foreground uppercase">Merchant Node ID (Profile ID)</Label>
              <div className="flex gap-2">
                <Input 
                  value={user?.uid || "Loading..."} 
                  readOnly 
                  className="bg-black/20 border-white/10 font-mono text-xs"
                />
                <Button variant="outline" size="icon" onClick={copyProfileId} className="shrink-0 border-white/10">
                  <Copy size={16} />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">This ID is used for inter-node handshakes and settlement verification.</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Linked Identity</Label>
              <p className="text-sm font-mono text-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-primary" />
              Privacy & Compliance
            </CardTitle>
            <CardDescription>Control how your audit data is processed and shared.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Zero-Knowledge Mode</Label>
                <p className="text-sm text-muted-foreground">Encrypt all local communications with your master key only.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Lock size={14} className="text-primary" /> PCI-DSS Data Masking
                </Label>
                <p className="text-sm text-muted-foreground">Enable mandatory tokenization for all sensitive financial fragments.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="space-y-4">
              <Label className="text-base font-semibold">Data Export (GDPR Compliance)</Label>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="gap-2 border-white/10" onClick={() => handleExport('JSON')}>
                  <FileJson size={14} /> Export JSON
                </Button>
                <Button variant="outline" size="sm" className="gap-2 border-white/10" onClick={() => handleExport('CSV')}>
                  <FileSpreadsheet size={14} /> Export CSV
                </Button>
              </div>
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
                  This action is irreversible. All local message fragments, relationship scores, and autonomous logs will be destroyed. Your hardware signature will remain, but all associated intelligence will be lost.
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
