"use client";

import { useState } from 'react';
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
  FileSpreadsheet
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

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

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
    toast({
      variant: "destructive",
      title: "Data Purge Initiated",
      description: "All local communication fragments are being wiped from this device.",
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-headline font-bold mb-2">Platform Controls</h1>
        <p className="text-muted-foreground">Manage your communication intelligence, auditing, and privacy preferences.</p>
      </header>

      <div className="grid gap-8">
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

        <Card className="bg-secondary/10 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database size={20} className="text-accent" />
              User-Controlled Retention
            </CardTitle>
            <CardDescription>Define how long communication fragments are archived before automatic purging.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Retention Period</Label>
              <Select defaultValue="30">
                <SelectTrigger className="bg-black/20 border-white/10">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days (Audit Only)</SelectItem>
                  <SelectItem value="30">30 Days (Compliance)</SelectItem>
                  <SelectItem value="90">90 Days (Intelligence)</SelectItem>
                  <SelectItem value="forever">Unlimited (Business Tier)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Clock size={16} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground italic">
                Retention settings apply to all unified messaging channels.
              </span>
            </div>
          </CardContent>
        </Card>

        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-headline font-bold">Safe-Wipe Control</AlertTitle>
          <AlertDescription>
            Purging your index will permanently erase all communication intelligence metadata and audit trails.
          </AlertDescription>
          <Button variant="outline" size="sm" className="mt-4 border-destructive/50 hover:bg-destructive/20" onClick={handlePurge}>
            <Trash2 size={16} className="mr-2" /> One-Click Data Purge
          </Button>
        </Alert>
      </div>

      <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-white/5">
        <Button onClick={handleSave} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg">
          <Save size={18} /> Save Intel Profile
        </Button>
      </div>
    </div>
  );
}