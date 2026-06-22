"use client";

import { useState, useEffect, useMemo } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { Transaction, MDBPayoutResponse, NagadPayoutResponse, InboundRemittancePayload } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  RefreshCcw, Send, ShieldCheck, 
  Smartphone, Zap, QrCode, Globe2, WalletCards, 
  FileSpreadsheet, ArrowRight, Building2, Link2, Copy,
  UserCheck, History as HistoryIcon, Download, Search, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { executeMDBPayout, verifyBankAccount } from '@/app/lib/midland-actions';
import { executeNagadPayout } from '@/app/lib/nagad-actions';
import { executeGlobalRemittance } from '@/app/lib/nagad-remittance-actions';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NAGAD_BANK_NODES } from '@/lib/mock-data';

export default function NexusLedgerPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isRemitDialogOpen, setIsRemitDialogOpen] = useState(false);
  
  const [payoutMethod, setPayoutMethod] = useState<'mdb' | 'nagad'>('mdb');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedName, setRecipientName] = useState<string | null>(null);

  const [payoutData, setPayoutData] = useState({ 
    destAccount: '', 
    destBank: 'Midland Bank',
    routing: '', 
    amount: '', 
    narration: 'Mission 400 Settlement' 
  });

  const [remitData, setRemitData] = useState<InboundRemittancePayload>({
    remitterName: 'John Doe',
    beneficiaryNagadNumber: '01712345678',
    sourceCountry: 'USA',
    mtoProvider: 'Western Union',
    principalAmountBDT: 50000,
    referenceNumber: 'WU-' + Math.random().toString(36).substring(7).toUpperCase()
  });

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
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Critical Failure', description: 'Node handshake error.' });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleRemittanceDisburse = async () => {
    setIsExecuting(true);
    try {
      const res = await executeGlobalRemittance(remitData);
      if (res.status === 'Settled') {
        toast({ title: "Remittance Disbursed", description: res.message });
        if (db && user) {
          addDoc(collection(db, 'transactions'), {
            amount: res.totalCreditedAmount,
            currency: 'BDT',
            status: 'completed',
            description: `Global Remit via ${remitData.mtoProvider} (Incl. 2.5% Incentive)`,
            type: 'payment',
            timestamp: new Date().toISOString(),
            merchantId: user.uid,
            metadata: { 
              ...remitData, 
              txId: res.txId, 
              incentive: res.governmentIncentive,
              principal: res.principalAmount
            }
          });
        }
        setIsRemitDialogOpen(false);
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Bridge Error', description: 'Handshake failed.' });
    } finally {
      setIsExecuting(false);
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
          <Button variant="outline" size="sm" className="gap-2 border-white/10" onClick={() => {}}>
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
        <Button variant="secondary" className="h-20 flex-col gap-2 bg-white/5 border-white/5 hover:bg-white/10" onClick={() => setIsRemitDialogOpen(true)}>
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
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "text-[9px] uppercase font-bold",
                        tx.status === 'completed' ? "text-green-500 border-green-500/20 bg-green-500/5" : "text-amber-500 border-amber-500/20"
                      )}>{tx.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right"><ArrowRight size={14} className="ml-auto opacity-30" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden grid gap-4 p-4">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm font-bold leading-tight">{tx.description}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{format(new Date(tx.timestamp), 'MMM d, HH:mm')}</p>
                  </div>
                  <Badge variant="outline" className="text-[8px] uppercase">{tx.status}</Badge>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Value</span>
                  <span className={cn("font-mono font-bold", tx.type === 'payment' ? "text-green-500" : "text-red-400")}>
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

      <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
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

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Amount (BDT)</Label>
              <Input type="number" className="bg-black/20 border-white/10 font-mono h-11 text-lg" placeholder="0.00" value={payoutData.amount} onChange={(e) => setPayoutData(p => ({ ...p, amount: e.target.value }))} />
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

      <Dialog open={isRemitDialogOpen} onOpenChange={setIsRemitDialogOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-white/10 w-[95vw]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Global MTO Bridge</DialogTitle>
            <DialogDescription>Receive remittance from Western Union, Ria, or Remitly with 2.5% incentive.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Source Country</Label>
                <Select value={remitData.sourceCountry} onValueChange={(val) => setRemitData(p => ({ ...p, sourceCountry: val }))}>
                  <SelectTrigger className="bg-black/20 border-white/10 h-11 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['USA', 'UK', 'UAE', 'Saudi Arabia', 'Canada', 'Australia'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">MTO Partner</Label>
                <Select value={remitData.mtoProvider} onValueChange={(val) => setRemitData(p => ({ ...p, mtoProvider: val }))}>
                  <SelectTrigger className="bg-black/20 border-white/10 h-11 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Western Union', 'Ria Money', 'Remitly', 'MoneyGram'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Principal Amount (BDT)</Label>
              <Input type="number" className="bg-black/20 border-white/10 h-11 font-mono" value={remitData.principalAmountBDT} onChange={(e) => setRemitData(p => ({ ...p, principalAmountBDT: parseFloat(e.target.value) }))} />
            </div>
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Government Incentive (2.5%)</span>
                <span className="text-green-500 font-bold">৳ {(remitData.principalAmountBDT * 0.025).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-green-500/10 pt-2">
                <span>Total Credit</span>
                <span className="text-primary">৳ {(remitData.principalAmountBDT * 1.025).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full bg-primary font-bold h-12" onClick={handleRemittanceDisburse} disabled={isExecuting}>
              {isExecuting ? <RefreshCcw size={16} className="animate-spin" /> : <Globe2 size={18} />} Disburse to Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
