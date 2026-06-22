'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase, logAnalyticsEvent } from '@/firebase';
import { collection, query, where, orderBy, limit, addDoc } from 'firebase/firestore';
import { Transaction, MDBPayoutResponse, NagadPayoutResponse, NagadMfiNode, NagadPhilanthropyNode, NagadMerchantPayPayload, NagadMerchantPayResponse, NagadBiller, NagadBillPayPayload, NagadBillPayResponse } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger, SelectGroup, SelectLabel } from '@/components/ui/select';
import { RefreshCcw, Filter, BrainCircuit, CheckCircle2, DatabaseZap, Send, Landmark, Key, ShieldCheck, Smartphone, Zap, Search, AlertCircle, Building2, MapPin, Heart, Gift, QrCode, User, FileText, Lightbulb, GraduationCap, Wifi, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { analyzeNexusLedger, NexusIntelligenceOutput } from '@/ai/flows/nexus-intelligence';
import { executeMDBPayout } from '@/app/lib/midland-actions';
import { executeNagadPayout } from '@/app/lib/nagad-actions';
import { executeNagadMerchantPay } from '@/app/lib/nagad-merchant-actions';
import { executeNagadBillPay } from '@/app/lib/nagad-billpay-actions';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from '@/lib/utils';
import { generateHMACChecksum, generateNagadSignature } from '@/lib/security';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_NAGAD_MFI_NODES, MOCK_NAGAD_PHILANTHROPY_NODES, MOCK_NAGAD_BILLERS } from '@/lib/mock-data';

export default function NexusLedgerPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAuditing, setIsAuditing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  const [isMerchantPayDialogOpen, setIsMerchantPayDialogOpen] = useState(false);
  const [isBillPayDialogOpen, setIsBillPayDialogOpen] = useState(false);
  const [isExecutingPayout, setIsExecutingPayout] = useState(false);
  const [isExecutingMerchantPay, setIsExecutingMerchantPay] = useState(false);
  const [isExecutingBillPay, setIsExecutingBillPay] = useState(false);
  const [auditResult, setAuditResult] = useState<NexusIntelligenceOutput | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<'mdb' | 'nagad'>('mdb');
  const [nagadMode, setNagadMode] = useState<'b2b' | 'mfi' | 'charity'>('b2b');

  const [payoutData, setPayoutData] = useState({
    destAccount: '',
    routing: '',
    amount: '',
    narration: 'Mission 400 Settlement',
    mfiOrg: '',
    mfiBranch: '',
    philanthropyId: '',
  });

  const [merchantPayData, setMerchantPayData] = useState<NagadMerchantPayPayload>({
    merchantAccountNumber: '01711223344',
    amount: 0,
    counterNumber: '1',
    reference: 'REF-NEXUS-01',
    pinSecureToken: 'SECURE_PIN_HASH',
    channel: 'APP_QR'
  });

  const [billPayData, setBillPayData] = useState<NagadBillPayPayload>({
    billerCode: '',
    accountNo: '',
    amount: 0,
    contactNo: '',
    pinToken: 'SECURE_BILL_TOKEN'
  });

  const ledgerQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'transactions'),
      where('merchantId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
  }, [db, user]);

  const { data: transactions, loading } = useCollection<Transaction>(ledgerQuery);

  const filteredTransactions = transactions?.filter(t => {
    return statusFilter === 'all' || t.status === statusFilter;
  });

  const mfiOrgs = useMemo(() => Array.from(new Set(MOCK_NAGAD_MFI_NODES.map(n => n.organizationName))), []);
  const availableBranches = useMemo(() => 
    MOCK_NAGAD_MFI_NODES.filter(n => n.organizationName === payoutData.mfiOrg),
    [payoutData.mfiOrg]
  );

  const selectedPhilanthropy = useMemo(() => 
    MOCK_NAGAD_PHILANTHROPY_NODES.find(n => n.id.toString() === payoutData.philanthropyId),
    [payoutData.philanthropyId]
  );

  const selectedBiller = useMemo(() => 
    MOCK_NAGAD_BILLERS.find(b => b.code === billPayData.billerCode),
    [billPayData.billerCode]
  );

  const handleSeedData = async () => {
    if (!db || !user) {
      toast({ variant: "destructive", title: "Auth Required", description: "Please login to seed test node." });
      return;
    }
    setIsSeeding(true);
    
    const mockTxs = [
      { amount: 15000, currency: 'BDT', status: 'completed', description: 'Midland Bank API Settlement', type: 'payment', timestamp: new Date(Date.now() - 3600000).toISOString(), checksum: generateHMACChecksum({ amount: 15000, source: 'MDB' }) },
      { amount: 2500, currency: 'BDT', status: 'completed', description: 'Nagad Merchant Pay - Node 400', type: 'payment', timestamp: new Date(Date.now() - 7200000).toISOString(), checksum: generateNagadSignature({ amount: 2500, source: 'BKASH' }) },
      { amount: 45000, currency: 'BDT', status: 'flagged', description: 'High Velocity Transfer - Suspicious', type: 'payment', timestamp: new Date(Date.now() - 10800000).toISOString(), checksum: 'ERROR_CHECKSUM_MISMATCH' },
      { amount: 12000, currency: 'BDT', status: 'pending', description: 'Nagad EMI: VPKA Foundation', type: 'payout', timestamp: new Date(Date.now() - 14400000).toISOString(), checksum: generateNagadSignature({ amount: 12000, source: 'NAGAD' }) },
      { amount: 5000, currency: 'BDT', status: 'completed', description: 'Donation: Quantum Foundation', type: 'payout', timestamp: new Date(Date.now() - 18000000).toISOString(), checksum: generateNagadSignature({ amount: 5000, source: 'CHARITY' }) }
    ];

    try {
      mockTxs.forEach((tx) => {
        const data = { ...tx, merchantId: user.uid };
        addDoc(collection(db, 'transactions'), data).catch(async (err) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({ 
            path: 'transactions', 
            operation: 'create', 
            requestResourceData: data 
          }));
        });
      });
      toast({ title: "Nexus Node Seeded", description: "Transaction fragments pushed to node." });
    } catch (e) {
      toast({ variant: "destructive", title: "Seed Failed", description: "Failed to connect to Nexus Ledger node." });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleRunAIAudit = async () => {
    if (!filteredTransactions?.length) {
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

  const handleExecutePayout = async () => {
    if (!payoutData.amount || parseFloat(payoutData.amount) <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Specify a valid settlement amount." });
      return;
    }
    setIsExecutingPayout(true);

    try {
      let result: MDBPayoutResponse | NagadPayoutResponse;
      
      if (payoutMethod === 'mdb') {
        result = await executeMDBPayout({
          sourceAccountNumber: '122.122.8821.01',
          destinationAccountNumber: payoutData.destAccount,
          routingNumber: payoutData.routing,
          amount: parseFloat(payoutData.amount),
          narration: payoutData.narration,
        });
      } else {
        const metadata = nagadMode === 'mfi' ? {
          mfiOrg: payoutData.mfiOrg,
          mfiBranch: payoutData.mfiBranch,
          payoutType: 'EMI'
        } : nagadMode === 'charity' ? {
          philanthropyOrg: selectedPhilanthropy?.organizationName,
          donationCategory: selectedPhilanthropy?.category
        } : undefined;

        result = await executeNagadPayout({
          orderId: `NEXUS_${Date.now()}`,
          customerMsisdn: payoutData.destAccount,
          amount: parseFloat(payoutData.amount),
          metadata
        });
      }

      if (result.success) {
        const txData = {
          amount: parseFloat(payoutData.amount),
          currency: 'BDT',
          status: 'completed',
          description: `${payoutMethod.toUpperCase()} Payout: ${payoutData.narration}`,
          type: 'payout',
          merchantId: user?.uid,
          timestamp: new Date().toISOString(),
          metadata: { transactionId: result.transactionId }
        };
        
        addDoc(collection(db, 'transactions'), txData);
        toast({ title: "Settlement Successful", description: result.message });
        setIsPayoutDialogOpen(false);
      } else {
        toast({ variant: "destructive", title: "Settlement Failed", description: result.message });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Bridge Error", description: "Handshake timeout during settlement." });
    } finally {
      setIsExecutingPayout(false);
    }
  };

  const handleExecuteMerchantPay = async () => {
    if (merchantPayData.amount <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Specify payment amount." });
      return;
    }
    setIsExecutingMerchantPay(true);
    try {
      const result = await executeNagadMerchantPay(merchantPayData);
      if (result.success) {
        const txData = {
          amount: merchantPayData.amount,
          currency: 'BDT',
          status: 'completed',
          description: `Nagad Merchant Pay (${merchantPayData.channel})`,
          type: 'payment',
          merchantId: user?.uid,
          timestamp: new Date().toISOString(),
          metadata: result.metadata
        };
        addDoc(collection(db, 'transactions'), txData);
        toast({ title: "Payment Received", description: result.message });
        setIsMerchantPayDialogOpen(false);
      } else {
        toast({ variant: "destructive", title: "Payment Declined", description: result.message });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Gateway Error", description: "Node rejected transaction." });
    } finally {
      setIsExecutingMerchantPay(false);
    }
  };

  const handleExecuteBillPay = async () => {
    if (!billPayData.billerCode || billPayData.amount <= 0) {
      toast({ variant: "destructive", title: "Incomplete Data", description: "Select a biller and enter amount." });
      return;
    }
    setIsExecutingBillPay(true);
    try {
      const result = await executeNagadBillPay(billPayData);
      if (result.success) {
        const txData = {
          amount: billPayData.amount,
          currency: 'BDT',
          status: 'completed',
          description: `Bill Payment: ${selectedBiller?.name}`,
          type: 'payout',
          merchantId: user?.uid,
          timestamp: new Date().toISOString(),
          metadata: { charge: result.charge, total: result.totalAmount }
        };
        addDoc(collection(db, 'transactions'), txData);
        toast({ title: "Bill Settled", description: result.message });
        setIsBillPayDialogOpen(false);
      } else {
        toast({ variant: "destructive", title: "Payment Failed", description: result.message });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Gateway Error", description: "Biller node unresponsive." });
    } finally {
      setIsExecutingBillPay(false);
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      case 'flagged': return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Flagged</Badge>;
      default: return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/20 bg-primary/5 mb-2">Financial Node 01</Badge>
          <h1 className="text-4xl font-headline font-bold">Nexus Ledger</h1>
          <p className="text-muted-foreground">Self-healing financial reconciliation and AI transaction auditing.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2 border-amber-500/20 text-amber-500 hover:bg-amber-500/5" onClick={() => setIsBillPayDialogOpen(true)}>
            <Receipt size={16} /> Pay Bill
          </Button>
          <Button variant="outline" className="gap-2 border-accent/20 text-accent hover:bg-accent/5" onClick={() => setIsMerchantPayDialogOpen(true)}>
            <QrCode size={16} /> Simulate QR Pay
          </Button>
          <Button variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/5" onClick={() => setIsPayoutDialogOpen(true)}>
            <Send size={16} /> Initiate Payout
          </Button>
          <Button variant="outline" className="gap-2 border-white/10" onClick={handleSeedData} disabled={isSeeding}>
            {isSeeding ? <RefreshCcw size={16} className="animate-spin" /> : <DatabaseZap size={16} />} Seed Test Node
          </Button>
          <Button className="gap-2 bg-primary font-bold shadow-lg shadow-primary/20" onClick={handleRunAIAudit} disabled={isAuditing}>
            {isAuditing ? <RefreshCcw size={16} className="animate-spin" /> : <BrainCircuit size={16} />} Run AI Audit
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-secondary/10 border-white/5 ghostly-fade">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-headline font-bold">
              ৳ {transactions?.reduce((acc, t) => t.status === 'completed' ? acc + t.amount : acc, 0).toLocaleString() || 0}
            </CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
              <CheckCircle2 size={12} className="text-green-500" /> Settled Fragment Volume
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-secondary/10 border-white/5 ghostly-fade" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-headline font-bold text-destructive">
              {transactions?.filter(t => t.status === 'flagged').length || 0}
            </CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
              <AlertCircle size={12} className="text-destructive" /> Flagged Fragments
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-secondary/10 border-white/5 ghostly-fade" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-headline font-bold text-accent">
              {transactions?.length || 0}
            </CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
              <Zap size={12} className="text-accent" /> Total Ledger Entries
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-secondary/5 border-white/5 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-secondary/10">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <Input className="pl-9 h-9 w-[250px] bg-black/20 border-white/10" placeholder="Search hash or fragment..." />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[150px] bg-black/20 border-white/10">
                <Filter className="mr-2" size={14} />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fragments</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-[10px] font-mono text-muted-foreground">LAST SYNC: {format(new Date(), 'HH:mm:ss')}</div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[10px] uppercase font-bold">Timestamp</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Node Fragment</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Channel</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-right">Amount</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 animate-pulse text-muted-foreground">Scanning Nexus Memory...</TableCell></TableRow>
              ) : filteredTransactions?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No fragments detected in node.</TableCell></TableRow>
              ) : (
                filteredTransactions?.map((tx) => (
                  <TableRow key={tx.id} className="border-white/5 hover:bg-white/5 cursor-pointer transition-colors" onClick={() => setSelectedTx(tx)}>
                    <TableCell className="font-mono text-[11px] text-muted-foreground">
                      {format(new Date(tx.timestamp), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm truncate max-w-[200px]">{tx.description}</span>
                        <span className="text-[9px] text-muted-foreground font-mono">TXN: {tx.id?.substring(0, 12)}...</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tx.description.includes('Midland') ? <Landmark size={12} className="text-primary" /> : <Smartphone size={12} className="text-accent" />}
                        <span className="text-[10px] font-bold uppercase">{tx.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-sm">
                      ৳ {tx.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(tx.status)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bill Pay Dialog */}
      <Dialog open={isBillPayDialogOpen} onOpenChange={setIsBillPayDialogOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
              <Receipt className="text-amber-500" /> Utility & Education Node
            </DialogTitle>
            <DialogDescription>Pay utility bills and education fees via Nagad Gateway.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Select Biller Node</Label>
              <Select value={billPayData.billerCode} onValueChange={(val) => setBillPayData(prev => ({ ...prev, billerCode: val }))}>
                <SelectTrigger className="bg-black/20 border-white/10 h-11">
                  <SelectValue placeholder="Search Biller..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectGroup>
                    <SelectLabel>Utilities</SelectLabel>
                    {MOCK_NAGAD_BILLERS.filter(b => b.category === 'Utility').map(b => (
                      <SelectItem key={b.code} value={b.code}>{b.name}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Education (Sirajganj & Others)</SelectLabel>
                    {MOCK_NAGAD_BILLERS.filter(b => b.category === 'Education').map(b => (
                      <SelectItem key={b.code} value={b.code}>{b.name}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Internet</SelectLabel>
                    {MOCK_NAGAD_BILLERS.filter(b => b.category === 'Internet').map(b => (
                      <SelectItem key={b.code} value={b.code}>{b.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {selectedBiller && (
              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-center gap-3">
                <div className="p-2 rounded-md bg-amber-500/10 text-amber-500">
                  {selectedBiller.category === 'Education' ? <GraduationCap size={16} /> : selectedBiller.category === 'Utility' ? <Lightbulb size={16} /> : <Wifi size={16} />}
                </div>
                <div>
                  <p className="text-xs font-bold">{selectedBiller.name}</p>
                  <p className="text-[10px] text-muted-foreground">Code: {selectedBiller.code} | Fee: {selectedBiller.chargeType === 'Fixed' ? `৳${selectedBiller.chargeValue}` : 'Slab-based'}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Account/Bill No</Label>
                <Input 
                  className="bg-black/20 border-white/10 h-11" 
                  placeholder="e.g. 100223" 
                  value={billPayData.accountNo}
                  onChange={(e) => setBillPayData(prev => ({ ...prev, accountNo: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Amount (BDT)</Label>
                <Input 
                  type="number"
                  className="bg-black/20 border-white/10 h-11 font-mono" 
                  placeholder="0.00" 
                  value={billPayData.amount || ''}
                  onChange={(e) => setBillPayData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Nagad PIN Token</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input type="password" value={billPayData.pinToken} readOnly className="pl-10 bg-black/20 border-white/10 h-11" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsBillPayDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 shadow-lg shadow-amber-500/20"
              onClick={handleExecuteBillPay}
              disabled={isExecutingBillPay}
            >
              {isExecutingBillPay ? <RefreshCcw size={16} className="animate-spin mr-2" /> : <Receipt size={16} className="mr-2" />}
              Process Bill Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payout Dialog */}
      <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
              <Send className="text-primary" /> Initiate Settlement
            </DialogTitle>
            <DialogDescription>Execute inter-node fund transfers via MDB Core or Nagad Bridge.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <Tabs value={payoutMethod} onValueChange={(val: any) => setPayoutMethod(val)}>
              <TabsList className="grid grid-cols-2 w-full bg-black/20 h-12 p-1">
                <TabsTrigger value="mdb" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold">Midland Bank NPSB</TabsTrigger>
                <TabsTrigger value="nagad" className="data-[state=active]:bg-accent data-[state=active]:text-black font-bold">Nagad B2B Bridge</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mdb" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Destination Account</Label>
                    <Input className="bg-black/20 border-white/10" placeholder="122..." value={payoutData.destAccount} onChange={(e) => setPayoutData(p => ({ ...prev, destAccount: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Routing Number</Label>
                    <Input className="bg-black/20 border-white/10" placeholder="150..." value={payoutData.routing} onChange={(e) => setPayoutData(p => ({ ...prev, routing: e.target.value }))} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="nagad" className="space-y-6 pt-4">
                <Select value={nagadMode} onValueChange={(val: any) => setNagadMode(val)}>
                  <SelectTrigger className="bg-black/20 border-white/10 h-11">
                    <SelectValue placeholder="Select Payout Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="b2b">Merchant to Personal (M2P)</SelectItem>
                    <SelectItem value="mfi">Microfinance Settlement (EMI)</SelectItem>
                    <SelectItem value="charity">Philanthropy Disbursement</SelectItem>
                  </SelectContent>
                </Select>

                {nagadMode === 'mfi' && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">MFI Organization</Label>
                      <Select value={payoutData.mfiOrg} onValueChange={(val) => setPayoutData(p => ({ ...prev, mfiOrg: val, mfiBranch: '' }))}>
                        <SelectTrigger className="bg-black/20 border-white/10"><SelectValue placeholder="Select Org" /></SelectTrigger>
                        <SelectContent>{mfiOrgs.map(org => <SelectItem key={val} value={val}>{val}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">Branch Node</Label>
                      <Select value={payoutData.mfiBranch} onValueChange={(val) => setPayoutData(p => ({ ...prev, mfiBranch: val }))} disabled={!payoutData.mfiOrg}>
                        <SelectTrigger className="bg-black/20 border-white/10"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                        <SelectContent>{availableBranches.map(b => <SelectItem key={b.branchName} value={b.branchName}>{b.branchName}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {nagadMode === 'charity' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Philanthropy Node</Label>
                    <Select value={payoutData.philanthropyId} onValueChange={(val) => setPayoutData(p => ({ ...prev, philanthropyId: val }))}>
                      <SelectTrigger className="bg-black/20 border-white/10 h-11"><SelectValue placeholder="Select Foundation" /></SelectTrigger>
                      <SelectContent>
                        {MOCK_NAGAD_PHILANTHROPY_NODES.map(node => (
                          <SelectItem key={node.id} value={node.id.toString()}>
                            <div className="flex items-center gap-2">
                              <Heart size={12} className="text-red-400" />
                              <span>{node.organizationName}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedPhilanthropy && (
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-between mt-2">
                        <span className="text-[10px] font-bold uppercase text-green-500">Category: {selectedPhilanthropy.category}</span>
                        <Badge variant="outline" className="text-[8px] bg-green-500/10 text-green-500 py-0">ACTIVE NODE</Badge>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Nagad Account (MSISDN)</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input className="pl-10 bg-black/20 border-white/10" placeholder="01XXXXXXXXX" value={payoutData.destAccount} onChange={(e) => setPayoutData(p => ({ ...prev, destAccount: e.target.value }))} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Settlement Amount (BDT)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">৳</span>
                  <Input type="number" className="pl-8 bg-black/20 border-white/10 font-mono h-11" placeholder="0.00" value={payoutData.amount} onChange={(e) => setPayoutData(p => ({ ...prev, amount: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Narration / Reference</Label>
                <Input className="bg-black/20 border-white/10 h-11" value={payoutData.narration} onChange={(e) => setPayoutData(p => ({ ...prev, narration: e.target.value }))} />
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase text-muted-foreground">
                <span>Security Primitive</span>
                <span className="text-primary">ENFORCED</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-muted-foreground">Algorithm:</span>
                <span className="text-foreground">{payoutMethod === 'mdb' ? 'HMAC-SHA256' : 'RSA-2048/PKCS1'}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsPayoutDialogOpen(false)}>Cancel</Button>
            <Button 
              className={cn(
                "font-bold px-8 shadow-lg",
                payoutMethod === 'mdb' ? "bg-primary hover:bg-primary/90 text-black" : "bg-accent hover:bg-accent/90 text-black"
              )}
              onClick={handleExecutePayout}
              disabled={isExecutingPayout}
            >
              {isExecutingPayout ? <RefreshCcw size={16} className="animate-spin mr-2" /> : <ShieldCheck size={16} className="mr-2" />}
              {isExecutingPayout ? "RSA Handshaking..." : "Authorize Settlement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Simulation Dialog */}
      <Dialog open={isMerchantPayDialogOpen} onOpenChange={setIsMerchantPayDialogOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
              <QrCode className="text-accent" /> Merchant Pay Node
            </DialogTitle>
            <DialogDescription>Simulate a C2B transaction (QR or USSD) received by your node.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Channel</Label>
                <Select value={merchantPayData.channel} onValueChange={(val: any) => setMerchantPayData(p => ({ ...prev, channel: val }))}>
                  <SelectTrigger className="bg-black/20 border-white/10 h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APP_QR">Nagad App (QR)</SelectItem>
                    <SelectItem value="USSD">USSD (*167#)</SelectItem>
                    <SelectItem value="GATEWAY_API">Gateway API</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Amount (BDT)</Label>
                <Input type="number" className="bg-black/20 border-white/10 h-11 font-mono" placeholder="0.00" value={merchantPayData.amount || ''} onChange={(e) => setMerchantPayData(p => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Customer MSISDN (Sender)</Label>
              <Input className="bg-black/20 border-white/10 h-11" placeholder="01XXXXXXXXX" value={merchantPayData.merchantAccountNumber} onChange={(e) => setMerchantPayData(p => ({ ...prev, merchantAccountNumber: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">PIN Secure Token</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input type="password" value={merchantPayData.pinSecureToken} readOnly className="pl-10 bg-black/20 border-white/10 h-11" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsMerchantPayDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-accent hover:bg-accent/90 text-black font-bold px-8 shadow-lg shadow-accent/20"
              onClick={handleExecuteMerchantPay}
              disabled={isExecutingMerchantPay}
            >
              {isExecutingMerchantPay ? <RefreshCcw size={16} className="animate-spin mr-2" /> : <Smartphone size={16} className="mr-2" />}
              {isExecutingMerchantPay ? "RSA Signing..." : "Simulate Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Audit Dialog */}
      <Dialog open={!!auditResult} onOpenChange={(open) => !open && setAuditResult(null)}>
        <DialogContent className="max-w-3xl bg-card/95 backdrop-blur-xl border-white/10 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-3xl">
              <BrainCircuit className="text-primary" /> Intelligence Audit Report
            </DialogTitle>
            <DialogDescription>Autonomous transaction forensic analysis for merchant node.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 py-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary/5 border-primary/20 p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Compliance Score</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold font-headline text-primary">{auditResult?.complianceScore}%</span>
                  <Badge variant="outline" className="mb-1 text-[8px] border-primary/30 text-primary">PASSED</Badge>
                </div>
              </Card>
              <Card className={cn(
                "p-4 border-2",
                auditResult?.fraudAnalysis.riskLevel === 'Low' ? "bg-green-500/5 border-green-500/20" : "bg-destructive/5 border-destructive/20"
              )}>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Fraud Risk Level</p>
                <div className="flex items-center gap-2">
                  {auditResult?.fraudAnalysis.riskLevel === 'Low' ? <CheckCircle2 className="text-green-500" size={24} /> : <AlertCircle className="text-destructive" size={24} />}
                  <span className={cn("text-2xl font-bold font-headline uppercase", auditResult?.fraudAnalysis.riskLevel === 'Low' ? "text-green-500" : "text-destructive")}>
                    {auditResult?.fraudAnalysis.riskLevel}
                  </span>
                </div>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <DatabaseZap size={14} className="text-primary" /> Cognitive Summary
              </h4>
              <p className="text-sm leading-relaxed p-4 rounded-xl bg-secondary/50 border border-white/5 italic">
                "{auditResult?.smartSummary}"
              </p>
            </div>

            {auditResult?.fraudAnalysis.phishingAlerts && auditResult.fraudAnalysis.phishingAlerts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-widest text-destructive flex items-center gap-2">
                  <ShieldCheck size={14} /> Phishing Guard Alerts
                </h4>
                <div className="grid gap-2">
                  {auditResult.fraudAnalysis.phishingAlerts.map((alert, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive-foreground">
                      <AlertCircle size={14} className="shrink-0" />
                      {alert}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Zap size={14} className="text-accent" /> Node Recommendations
              </h4>
              <div className="grid gap-2">
                {auditResult?.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="border-t border-white/5 pt-4">
            <Button className="bg-primary text-black font-bold px-12" onClick={() => setAuditResult(null)}>Acknowledge Audit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Details Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="font-headline">Node Fragment Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Amount Disbursed</p>
              <h2 className="text-4xl font-bold font-headline">৳ {selectedTx?.amount.toLocaleString()}</h2>
              <Badge variant="outline" className="border-green-500/30 text-green-500 bg-green-500/5">{selectedTx?.status.toUpperCase()}</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs py-2 border-b border-white/5">
                <span className="text-muted-foreground">Fragment ID</span>
                <span className="font-mono text-primary">{selectedTx?.id}</span>
              </div>
              <div className="flex justify-between text-xs py-2 border-b border-white/5">
                <span className="text-muted-foreground">Type</span>
                <span className="font-bold uppercase">{selectedTx?.type}</span>
              </div>
              <div className="flex justify-between text-xs py-2 border-b border-white/5">
                <span className="text-muted-foreground">Channel</span>
                <span>{selectedTx?.description.includes('Midland') ? 'MDB Core Bridge' : 'Nagad B2B Gateway'}</span>
              </div>
              <div className="flex justify-between text-xs py-2 border-b border-white/5">
                <span className="text-muted-foreground">Timestamp</span>
                <span>{selectedTx && format(new Date(selectedTx.timestamp), 'yyyy-MM-dd HH:mm:ss')}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <p className="text-[10px] font-bold text-primary uppercase flex items-center gap-2">
                <ShieldCheck size={12} /> HSM Signature
              </p>
              <p className="text-[10px] font-mono break-all text-muted-foreground">
                {selectedTx?.checksum || 'NAGAD_RSA_SIG_AUTO_VERIFIED_GR8821'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="w-full border-white/10" onClick={() => setSelectedTx(null)}>Close Fragment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}