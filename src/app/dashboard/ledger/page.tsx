'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, addDoc } from 'firebase/firestore';
import { Transaction, MDBPayoutResponse, NagadPayoutResponse } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  RefreshCcw, Filter, BrainCircuit, CheckCircle2, DatabaseZap, Send, ShieldCheck, 
  Smartphone, Zap, Search, AlertCircle, QrCode, Receipt, Globe2, WalletCards, 
  FileSpreadsheet, ArrowRight, MoreVertical, Building2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { analyzeNexusLedger, NexusIntelligenceOutput } from '@/ai/flows/nexus-intelligence';
import { executeMDBPayout } from '@/app/lib/midland-actions';
import { executeNagadPayout } from '@/app/lib/nagad-actions';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { generateHMACChecksum, generateNagadSignature } from '@/lib/security';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NAGAD_BANK_NODES } from '@/lib/mock-data';

export default function NexusLedgerPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAuditing, setIsAuditing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  
  const [auditResult, setAuditResult] = useState<NexusIntelligenceOutput | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<'mdb' | 'nagad'>('mdb');
  const [isExecuting, setIsExecuting] = useState(false);

  // States for forms
  const [payoutData, setPayoutData] = useState({ 
    destAccount: '', 
    destBank: 'Midland Bank',
    routing: '', 
    amount: '', 
    narration: 'Mission 400 Settlement' 
  });

  const ledgerQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'transactions'), where('merchantId', '==', user.uid), orderBy('timestamp', 'desc'), limit(50));
  }, [db, user]);

  const { data: transactions, loading } = useCollection<Transaction>(ledgerQuery);

  const filteredTransactions = useMemo(() => {
    return transactions?.filter(t => statusFilter === 'all' || t.status === statusFilter) || [];
  }, [transactions, statusFilter]);

  const handleRunAIAudit = async () => {
    if (!filteredTransactions.length) {
      toast({ variant: "destructive", title: "Empty Ledger", description: "Seed the node before auditing." });
      return;
    }
    setIsAuditing(true);
    try {
      const result = await analyzeNexusLedger({
        transactions: filteredTransactions.map(t => ({ amount: t.amount, currency: t.currency, status: t.status, description: t.description, timestamp: t.timestamp, type: t.type })),
        merchantName: user?.displayName || "Nexus Merchant"
      });
      setAuditResult(result);
    } catch (e) {
      toast({ variant: "destructive", title: "AI Audit Standby", description: "Node capacity reached. Showing safe-mode report." });
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSeedData = async () => {
    if (!db || !user) return;
    setIsSeeding(true);
    const mockTxs = [
      { amount: 15000, currency: 'BDT', status: 'completed', description: 'Midland Bank API Settlement', type: 'payment', timestamp: new Date(Date.now() - 3600000).toISOString(), checksum: generateHMACChecksum({ amount: 15000 }) },
      { amount: 2500, currency: 'BDT', status: 'completed', description: 'Nagad QR Pay - Node 400', type: 'payment', timestamp: new Date(Date.now() - 7200000).toISOString(), checksum: generateNagadSignature({ amount: 2500 }) },
    ];
    try {
      for (const tx of mockTxs) {
        await addDoc(collection(db, 'transactions'), { ...tx, merchantId: user.uid });
      }
      toast({ title: "Nexus Node Seeded", description: "Fragments pushed to ledger." });
    } catch (e) {
      toast({ variant: "destructive", title: "Seed Failed", description: "Database rejected fragments." });
    } finally {
      setIsSeeding(false);
    }
  };

  const handlePayout = async () => {
    if (!payoutData.destAccount || !payoutData.amount) {
      toast({ variant: 'destructive', title: 'Missing Info', description: 'Fill in account and amount.' });
      return;
    }
    setIsExecuting(true);
    try {
      let res;
      if (payoutMethod === 'mdb') {
        res = await executeMDBPayout({
          sourceAccountNumber: 'MDB_CORE_400',
          destinationAccountNumber: payoutData.destAccount,
          routingNumber: payoutData.routing || '012345678',
          amount: parseFloat(payoutData.amount),
          narration: `${payoutData.narration} to ${payoutData.destBank}`
        });
      } else {
        res = await executeNagadPayout({
          orderId: 'ORD_' + Date.now(),
          customerMsisdn: payoutData.destAccount,
          amount: parseFloat(payoutData.amount)
        });
      }

      if (res.success) {
        toast({ title: "Settlement Dispatched", description: res.message });
        setIsPayoutDialogOpen(false);
        if (db && user) {
          addDoc(collection(db, 'transactions'), {
            amount: parseFloat(payoutData.amount),
            currency: 'BDT',
            status: 'completed',
            description: `${payoutMethod.toUpperCase()} Settlement to ${payoutData.destBank} (${payoutData.destAccount})`,
            type: 'payout',
            timestamp: new Date().toISOString(),
            merchantId: user.uid
          });
        }
      } else {
        toast({ variant: 'destructive', title: 'Handshake Failed', description: res.message });
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Critical Failure', description: 'Node handshake error.' });
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Settled</Badge>;
      case 'flagged': return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Flagged</Badge>;
      default: return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/20 bg-primary/5">Financial Node ALPHA</Badge>
          <h1 className="text-3xl md:text-4xl font-headline font-bold">Nexus Ledger</h1>
          <p className="text-sm text-muted-foreground">Autonomous financial fragments and real-time AI reconciliation.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-white/10 hidden sm:flex" onClick={handleSeedData} disabled={isSeeding}>
            <DatabaseZap size={14} /> Seed Node
          </Button>
          <Button size="sm" className="gap-2 bg-primary font-bold shadow-lg shadow-primary/20" onClick={handleRunAIAudit} disabled={isAuditing}>
            {isAuditing ? <RefreshCcw size={14} className="animate-spin" /> : <BrainCircuit size={14} />} 
            <span className="hidden sm:inline">Run AI Audit</span><span className="sm:hidden">Audit</span>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button variant="secondary" className="h-20 flex-col gap-2 bg-white/5 border-white/5 hover:bg-white/10" onClick={() => setIsPayoutDialogOpen(true)}>
          <Send size={20} className="text-primary" />
          <span className="text-[10px] font-bold uppercase">Payout</span>
        </Button>
        <Button variant="secondary" className="h-20 flex-col gap-2 bg-white/5 border-white/5 hover:bg-white/10">
          <Receipt size={20} className="text-amber-500" />
          <span className="text-[10px] font-bold uppercase">Bill Pay</span>
        </Button>
        <Button variant="secondary" className="h-20 flex-col gap-2 bg-white/5 border-white/5 hover:bg-white/10">
          <Globe2 size={20} className="text-green-500" />
          <span className="text-[10px] font-bold uppercase">Remit</span>
        </Button>
        <Button variant="secondary" className="h-20 flex-col gap-2 bg-white/5 border-white/5 hover:bg-white/10">
          <WalletCards size={20} className="text-red-500" />
          <span className="text-[10px] font-bold uppercase">Cash Out</span>
        </Button>
      </div>

      <Card className="bg-secondary/10 border-white/5 ghostly-fade overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Transaction Matrix</CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-8 bg-black/20 border-white/10 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Settled</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden md:block">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5">
                  <TableHead className="text-[10px] uppercase font-bold">Fragment</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-right">Amount</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold">Status</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id} className="border-white/5 hover:bg-white/5 cursor-pointer">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold truncate max-w-[200px]">{tx.description}</span>
                        <span className="text-[9px] font-mono text-muted-foreground uppercase">{format(new Date(tx.timestamp), 'MMM d, HH:mm')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      <span className={tx.type === 'payment' ? 'text-green-500' : 'text-red-400'}>
                        {tx.type === 'payment' ? '+' : '-'} {tx.amount.toLocaleString()} BDT
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
                    <TableCell className="text-right"><ArrowRight size={14} className="ml-auto opacity-30" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {loading && (
            <div className="p-12 flex flex-col items-center justify-center text-muted-foreground gap-4">
              <RefreshCcw className="animate-spin" size={32} />
              <p className="text-xs font-bold uppercase tracking-widest">Accessing Ledger Node...</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-white/10 w-[95vw]">
          <DialogHeader><DialogTitle className="font-headline">Initiate Settlement</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <Tabs value={payoutMethod} onValueChange={(val: any) => setPayoutMethod(val)}>
              <TabsList className="grid grid-cols-2 w-full bg-black/20">
                <TabsTrigger value="mdb" className="data-[state=active]:bg-primary">MDB Core</TabsTrigger>
                <TabsTrigger value="nagad" className="data-[state=active]:bg-accent">Nagad B2B</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {payoutMethod === 'mdb' && (
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Destination Bank Node</Label>
                <Select value={payoutData.destBank} onValueChange={(val) => setPayoutData(p => ({ ...p, destBank: val }))}>
                  <SelectTrigger className="bg-black/20 border-white/10 h-11 text-xs">
                    <SelectValue placeholder="Select Bank..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {NAGAD_BANK_NODES.map(bank => (
                      <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Account Number</Label>
              <Input className="bg-black/20 border-white/10" placeholder="01XXXXXXXXX" value={payoutData.destAccount} onChange={(e) => setPayoutData(p => ({ ...p, destAccount: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Amount (BDT)</Label>
              <Input type="number" className="bg-black/20 border-white/10 font-mono" placeholder="0.00" value={payoutData.amount} onChange={(e) => setPayoutData(p => ({ ...p, amount: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full bg-primary font-bold gap-2" 
              onClick={handlePayout} 
              disabled={isExecuting}
            >
              {isExecuting ? <RefreshCcw className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
              {isExecuting ? "Authorizing RSA..." : "Authorize RSA Sign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
