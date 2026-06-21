
"use client";

import { useState, useEffect } from 'react';
import { ShieldCheck, Key, Download, RefreshCcw, AlertTriangle, ArrowLeft, ClipboardCheck, Printer, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function RecoveryKeyManagement() {
  const [mounted, setMounted] = useState(false);
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateNewKey = () => {
    setIsGenerating(true);
    // Simulate generation of a 12-word mnemonic
    const words = [
      "ghost", "recap", "secure", "vault", "crypto", "shadow", 
      "shield", "orbit", "matrix", "pulse", "cyber", "vertex"
    ].sort(() => Math.random() - 0.5);
    
    setTimeout(() => {
      setMnemonic(words);
      setIsGenerating(false);
      toast({
        title: "New Master Key Generated",
        description: "Please secure these words immediately. They are not stored on our servers.",
      });
    }, 1200);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mnemonic.join(' '));
    toast({ title: "Copied to Clipboard", description: "Clear your clipboard history after pasting." });
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/dashboard/vault" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mb-4 transition-colors">
            <ArrowLeft size={12} /> Back to Secure Vault
          </Link>
          <div className="flex items-center gap-3">
            <Key className="text-primary" size={32} />
            <h1 className="text-4xl font-headline font-bold">Master Recovery Keys</h1>
          </div>
          <p className="text-muted-foreground">Manage emergency access credentials for your Zero-Knowledge communication fragments.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-headline font-bold">Critical Security Notice</AlertTitle>
            <AlertDescription className="text-xs leading-relaxed">
              GhostRecap does not store your recovery keys. If you lose these keys and your hardware signature changes, your vault data will be <strong>permanently inaccessible</strong>.
            </AlertDescription>
          </Alert>

          <Card className="bg-secondary/10 border-white/5">
            <CardHeader>
              <CardTitle className="text-lg">Generate Recovery Phrase</CardTitle>
              <CardDescription>This phrase acts as your master identity key.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mnemonic.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    {mnemonic.map((word, i) => (
                      <div key={i} className="bg-black/40 border border-white/5 p-3 rounded-lg flex items-center gap-3">
                        <span className="text-[10px] font-mono text-muted-foreground">{i + 1}</span>
                        <span className="font-mono text-sm font-bold text-primary">{word}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button variant="outline" className="gap-2 border-white/10" onClick={copyToClipboard}>
                      <ClipboardCheck size={16} /> Copy Phrase
                    </Button>
                    <Button variant="outline" className="gap-2 border-white/10" onClick={() => window.print()}>
                      <Printer size={16} /> Print Paper Backup
                    </Button>
                    <Button variant="ghost" className="text-muted-foreground text-xs hover:text-destructive" onClick={() => setMnemonic([])}>
                      Clear View
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl bg-black/20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
                    <ShieldCheck size={32} className="text-primary opacity-20" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold">No Active View</p>
                    <p className="text-xs text-muted-foreground px-8">Generate a new mnemonic phrase to refresh your backup credentials.</p>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
                    onClick={generateNewKey}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <RefreshCcw size={16} className="animate-spin mr-2" /> : <Key size={16} className="mr-2" />}
                    {isGenerating ? "Generating..." : "Generate Master Key"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-secondary/10 border-white/5">
            <CardHeader>
              <CardTitle className="text-lg">Hardware Signature Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Current Device Trusted</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Signature: GR-8821-X9-ALPHA</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-green-500/20 text-green-500 bg-green-500/5">Verified</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldAlert size={16} className="text-primary" />
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Offline Storage", desc: "Never store your recovery phrase in a cloud-synced note or email." },
                { title: "Paper Backup", desc: "Printing or writing down the phrase is the most secure method." },
                { title: "Limited Exposure", desc: "Only reveal your keys in a private, secure environment." }
              ].map((tip, i) => (
                <div key={i} className="space-y-1">
                  <h5 className="text-xs font-bold text-primary">{tip.title}</h5>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="p-6 rounded-2xl bg-secondary/20 border border-white/5 text-center space-y-4">
            <Download size={24} className="text-accent mx-auto" />
            <h4 className="font-bold text-sm">Encrypted JSON Backup</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Export your vault metadata as an encrypted JSON file. Requires your master key to decrypt.
            </p>
            <Button size="sm" variant="outline" className="w-full border-white/10 text-xs">
              Download Encrypted File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
