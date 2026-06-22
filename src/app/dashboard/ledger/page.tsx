"use client";

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
  FileSpreadsheet, ArrowRight, MoreVertical, Building2, Link2, Copy, Download,
  UserCheck, History as HistoryIcon, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { analyzeNexusLedger, NexusIntelligenceOutput } from '@/ai/flows/nexus-intelligence';
import { executeMDBPayout, verifyBankAccount } from '@/app/lib/midland-actions';
import { executeNagadPayout } from '@/app/lib/nagad-actions';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NAGAD_BANK_NODES } from '@/lib/mock-data';

export default function NexusLedgerPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAuditing, setIsAuditing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  
  const [auditResult, setAuditResult] = useState<NexusIntelligenceOutput | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<'mdb' | 'nagad'>('mdb');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedName, setRecipientName] = useState<string | null>(null);

  // States for forms
  const [payoutData, setPayoutData] = useState({ 
    destAccount: '', 
    destBank: 'Midland Bank',
    routing: '', 
    amount: '', 
    narration: 'Mission 400 Settlement' 
  });

  const [requestLink, setRequestMoneyLink] = useState('');

  const ledgerQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'transactions'), where('merchantId', '==', user.uid), orderBy('timestamp', 'desc'), limit(50));
  }, [db, user]);

  const { data: transactions, loading } = useCollection<Transaction>(ledgerQuery);

  const filteredTransactions = useMemo(() => {
    return transactions?.filter(t => statusFilter === 'all' || t.status === statusFilter) || [];
  }, [transactions, statusFilter]);

  const handleVerifyAccount = async () => {
    if (!payoutData.destAccount) {
      toast({ variant: 'destructive', title: 'Error', description: 'Enter account number first.' });
      return;
    }
    setIsVerifying(true);
    setRecipientName(null);
    try {
      const res = await verifyBankAccount(payoutData.destBank, payoutData.destAccount);
      if (res.success) {
        setRecipientName(res.name!);
        toast({ title: "Account Verified", description: `Node identified: ${res.name}` });
      } else {
        toast({ variant: 'destructive', title: "Verification Failed", description: res.message });
      }
    } catch (e) {
      toast({ variant: 'destructive', title: "Node Timeout", description: "Could not reach bank directory." });
    } finally {
      setIsVerifying(false);
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
            description: `${payoutMethod.toUpperCase()} Settlement to ${verifiedName || payoutData.destBank} (${payoutData.destAccount})`,
            type: 'payout',
            timestamp: new Date().toISOString(),
            merchantId: user.uid,
            metadata: {
              recipientName: verifiedName,
              account: payoutData.destAccount,
              bank: payoutData.destBank,
              method: payoutMethod,
              note: payoutData.narration
            }
          });
        }
        setRecipientName(null);
      } else {
        toast({ variant: 'destructive', title: 'Handshake Failed', description: res.message });
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Critical Failure', description: 'Node handshake error.' });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleExportCSV = () => {
    if (!filteredTransactions.length) return;
    const headers = ["Date", "Description", "Type", "Amount", "Status"];
    const rows = filteredTransactions.map(tx => [
      format(new Date(tx.timestamp), 'yyyy-MM-dd HH:mm'),
      `"${tx.description}"`,
      tx.type.toUpperCase(),
      tx.amount,
      tx.status
    ].join(","));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexus_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Ledger Exported", description: "CSV file saved to downloads." });
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
          <Button variant="outline" size="sm" className="gap-2 border-white/10" onClick={handleExportCSV}>
            <FileSpreadsheet size={14} /> Export CSV
          </Button>
          <Button size="sm" className="gap-2 bg-primary font-bold shadow-lg shadow-primary/20" onClick={() => setIsPayoutDialogOpen(true)}>
            <Send size={14} /> Send Money
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button variant="secondary" className="h-20 flex-col gap-2 bg-white/5 border-white/5 hover:bg-white/10" onClick={() => setIsPayoutDialogOpen(true)}>
          <Send size={20} className="text-primary" />
          <span className="text-[10px] font-bold uppercase">Payout</span>
        </Button>
        <Button variant="secondary" className="h-20 flex-col gap-2 bg-white/5 border-white/5 hover:bg-white/10" onClick={() => setIsRequestDialogOpen(true)}>
          <Link2 size={20} className="text-accent" />
          <span className="text-[10px] font-bold uppercase">Request Money</span>
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
          {/* Mobile Card View */}
          <div className="md:hidden grid gap-4 p-4">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm font-bold leading-tight">{tx.description}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{format(new Date(tx.timestamp), 'MMM d, HH:mm')}</p>
                  </div>
                  {getStatusBadge(tx.status)}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Value</span>
                  <span className={cn("font-mono font-bold", tx.type === 'payment' ? 'text-green-500' : 'text-red-400')}>
                    {tx.type === 'payment' ? '+' : '-'} {tx.amount.toLocaleString()} BDT
                  </span>
                </div>
              </div>
            ))}
          </div>
          {loading && (
            <div className="p-12 flex flex-col items-center justify-center text-muted-foreground gap-4">
              <RefreshCcw className="animate-spin" size={32} />
              <p className="text-xs font-bold uppercase tracking-widest">Accessing Ledger Node...</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isPayoutDialogOpen} onOpenChange={(val) => {
        setIsPayoutDialogOpen(val);
        if(!val) { setRecipientName(null); setPayoutData({ destAccount: '', destBank: 'Midland Bank', routing: '', amount: '', narration: 'Mission 400 Settlement' }); }
      }}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-white/10 w-[95vw]">
          <DialogHeader><DialogTitle className="font-headline text-2xl">Initiate Settlement</DialogTitle></DialogHeader>
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
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Destination Account Number</Label>
              <div className="flex gap-2">
                <Input 
                  className="bg-black/20 border-white/10 h-11 flex-1 font-mono" 
                  placeholder="e.g. 01712345678" 
                  value={payoutData.destAccount} 
                  onChange={(e) => setPayoutData(p => ({ ...p, destAccount: e.target.value }))} 
                />
                <Button 
                  variant="outline" 
                  className="h-11 px-3 border-primary/20 text-primary hover:bg-primary/10" 
                  onClick={handleVerifyAccount}
                  disabled={isVerifying}
                >
                  {isVerifying ? <RefreshCcw size={14} className="animate-spin" /> : <UserCheck size={18} />}
                </Button>
              </div>
              {verifiedName && (
                <div className="p-2 rounded bg-green-500/10 border border-green-500/20 animate-in fade-in zoom-in-95">
                  <p className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1">
                    <CheckCircle2 size={10} /> Recipient Verified
                  </p>
                  <p className="text-sm font-bold text-foreground">{verifiedName}</p>
                </div>
              )}
            </div>

            {payoutMethod === 'mdb' && (
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Branch Routing Number (Optional)</Label>
                <Input className="bg-black/20 border-white/10 h-11 font-mono" placeholder="e.g. 012345678" value={payoutData.routing} onChange={(e) => setPayoutData(p => ({ ...p, routing: e.target.value }))} />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Amount (BDT)</Label>
              <Input type="number" className="bg-black/20 border-white/10 font-mono h-11 text-lg" placeholder="0.00" value={payoutData.amount} onChange={(e) => setPayoutData(p => ({ ...p, amount: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Transaction Note / Narration</Label>
              <Input className="bg-black/20 border-white/10 h-11" placeholder="e.g. Settlement for..." value={payoutData.narration} onChange={(e) => setPayoutData(p => ({ ...p, narration: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full bg-primary font-bold gap-2 h-12" 
              onClick={handlePayout} 
              disabled={isExecuting || (payoutData.destAccount.length > 5 && !verifiedName)}
            >
              {isExecuting ? <RefreshCcw size={16} className="animate-spin" /> : <ShieldCheck size={20} />}
              {isExecuting ? "Authorizing RSA..." : verifiedName ? "Authorize RSA Sign" : "Verify Account First"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-white/10 w-[95vw]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Payment Request Gateway</DialogTitle>
            <DialogDescription>Generate a secure link to receive funds into your Nexus Node.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Requested Amount (Optional)</Label>
              <Input type="number" className="bg-black/20 border-white/10 font-mono h-11" placeholder="0.00" value={payoutData.amount} onChange={(e) => setPayoutData(p => ({ ...p, amount: e.target.value }))} />
            </div>
            
            <Button className="w-full bg-accent text-accent-foreground font-bold h-11" onClick={() => {
              const amount = payoutData.amount || '0';
              const link = `https://nexus.recap/pay?id=${user?.uid}&amount=${amount}&ref=MISSION400`;
              setRequestMoneyLink(link);
              toast({ title: "Gateway Link Active", description: "Payment request node generated." });
            }}>
              Generate Payment Link
            </Button>

            {requestLink && (
              <div className="space-y-3 animate-in fade-in zoom-in-95">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col items-center gap-4">
                  <div className="w-32 h-32 bg-white p-2 rounded-lg">
                    <QrCode size={112} className="text-black" />
                  </div>
                  <div className="w-full space-y-1">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase">Gateway URL</Label>
                    <div className="flex gap-2">
                      <Input readOnly value={requestLink} className="bg-black/20 border-white/10 text-[10px] h-8 font-mono" />
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => {
                        navigator.clipboard.writeText(requestLink);
                        toast({ title: "Link Copied" });
                      }}><Copy size={12} /></Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
