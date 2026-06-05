"use client";

import { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Smartphone, 
  Clock,
  Save,
  Trash2,
  AlertCircle
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
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-headline font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account, synchronization, and privacy preferences.</p>
      </header>

      <div className="grid gap-8">
        {/* Profile Section */}
        <Card className="bg-secondary/10 border-white/5 ghostly-fade">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} className="text-primary" />
              Account Profile
            </CardTitle>
            <CardDescription>Update your personal information and how others see you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="ghost_recap_user" className="bg-black/20 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="user@example.com" className="bg-black/20 border-white/10" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Section */}
        <Card className="bg-secondary/10 border-white/5 ghostly-fade" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone size={20} className="text-accent" />
              Messaging Sync
            </CardTitle>
            <CardDescription>Select which platforms GhostRecap should monitor and archive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">WhatsApp Archiving</Label>
                <p className="text-sm text-muted-foreground">Automatically save incoming notifications from WhatsApp.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Telegram Archiving</Label>
                <p className="text-sm text-muted-foreground">Monitor and recover deleted messages from Telegram.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Signal Archiving</Label>
                <p className="text-sm text-muted-foreground">High-privacy sync for Signal messages.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-secondary/10 border-white/5 ghostly-fade" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database size={20} className="text-primary" />
              Data Retention
            </CardTitle>
            <CardDescription>Control how long your archived data is stored on our secure servers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Retention Period</Label>
              <Select defaultValue="90">
                <SelectTrigger className="bg-black/20 border-white/10">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                  <SelectItem value="forever">Forever (No Auto-deletion)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Clock size={16} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground italic">
                Data is encrypted at rest and only accessible with your master key.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Security Alert */}
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground ghostly-fade" style={{ animationDelay: '300ms' }}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-headline font-bold">Danger Zone</AlertTitle>
          <AlertDescription>
            Deleting your account will permanently erase all archived messages and recovery fragments. This action cannot be undone.
          </AlertDescription>
          <Button variant="outline" size="sm" className="mt-4 border-destructive/50 hover:bg-destructive/20 hover:text-destructive transition-colors">
            <Trash2 size={16} className="mr-2" /> Delete All Data
          </Button>
        </Alert>
      </div>

      <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-white/5">
        <Button variant="ghost" className="hover:bg-white/5">Cancel</Button>
        <Button onClick={handleSave} disabled={loading} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
          {loading ? "Saving..." : <><Save size={18} /> Save Preferences</>}
        </Button>
      </div>
    </div>
  );
}
