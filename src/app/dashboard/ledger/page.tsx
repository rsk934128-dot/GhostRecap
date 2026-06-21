'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, addDoc } from 'firebase/firestore';
import { Transaction, MDBPayoutResponse, NagadPayoutResponse, NagadMfiNode, NagadPhilanthropyNode } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger, SelectGroup, SelectLabel } from '@/components/ui/select';
import { 
  RefreshCcw, Filter, BrainCircuit, 
  CheckCircle2, DatabaseZap, Send, Landmark, Key, 
  ShieldCheck, Smartphone, Zap, Search, AlertCircle,
  Building2, MapPin, Heart, Gift
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
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from '@/lib/utils';
import { generateHMACChecksum, generateNagadSignature } from '@/lib/security';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_NAGAD_MFI_NODES, MOCK_NAGAD_PHILANTHROPY_NODES } from '@/lib/mock-data';

export default function NexusLedgerPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAuditing, setIsAuditing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  const [isExecutingPayout, setIsExecutingPayout] = useState(false);
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

  // MFI Filter Logic
  const mfiOrgs = useMemo(() => Array.from(new Set(MOCK_NAGAD_MFI_NODES.map(n => n.organizationName))), []);
  const availableBranches = useMemo(() => 
    MOCK_NAGAD_MFI_NODES.filter(n => n.organizationName === payoutData.mfiOrg),
    [payoutData.mfiOrg]
  );

  const selectedPhilanthropy = useMemo(() => 
    MOCK_NAGAD_PHILANTHROPY_NODES.find(n => n.id.toString() === payoutData.philanthropyId),
    [payoutData.philanthropyId]
  );

  const handleSeedData = async () => {
    if (!db || !user) return;
    setIsSeeding(true);
    
    const mockTxs = [
      { amount: 15000, currency: 'BDT', status: 'completed', description: 'Midland Bank API Settlement', type: 'payment', timestamp: new Date(Date.now() - 3600000).toISOString(), checksum: generateHMACChecksum({ amount: 15000, source: 'MDB' }) },
      { amount: 2500, currency: 'BDT', status: 'completed', description: 'bKash Merchant Pay - Node 400', type: 'payment', timestamp: new Date(Date.now() - 7200000).toISOString(), checksum: generateHMACChecksum({ amount: 2500, source: 'BKASH' }) },
      { amount: 45000, currency: 'BDT', status: 'flagged', description: 'High Velocity Transfer - Suspicious', type: 'payment', timestamp: new Date(Date.now() - 10800000).toISOString(), checksum: 'ERROR_CHECKSUM_MISMATCH' },
      { amount: 12000, currency: 'BDT', status: 'pending', description: 'Nagad EMI: VPKA Foundation', type: 'payout', timestamp: new Date(Date.now() - 14400000).toISOString(), checksum: generateNagadSignature({ amount: 12000, source: 'NAGAD' }) },
      { amount: 5000, currency: 'BDT', status: 'completed', description: 'Donation: Quantum Foundation', type: 'payout', timestamp: new Date(Date.now() - 18000000).toISOString(), checksum: generateNagadSignature({ amount: 5000, source: 'CHARITY' }) }
    ];

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

    toast({ title: "Nexus Node Seeded", description: "Transaction fragments (including Philanthropy) pushed to node." });
    setIsSeeding(false);
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
    if ((nagadMode === 'b2b' && !payoutData.destAccount) || !payoutData.amount) {
      toast({ variant: "destructive", title: "Missing Payload", description: "Required fields missing for authorization." });
      return;
    }
    
    setIsExecutingPayout(true);
    try {
      if (payoutMethod === 'mdb') {
        const payloadBase = {
          sourceAccountNumber: 'MDB-NEXUS-778899',
          destinationAccountNumber: payoutData.destAccount,
          routingNumber: payoutData.routing || '000111222',
          amount: parseFloat(payoutData.amount),
          narration: payoutData.narration
        };

        const response: MDBPayoutResponse = await executeMDBPayout(payloadBase);

        if (response.success) {
          const checksum = generateHMACChecksum(payloadBase);
          const txData = {
            amount: parseFloat(payoutData.amount),
            currency: 'BDT',
            status: 'completed',
            description: `MDB Payout: ${payoutData.narration}`,
            type: 'payout',
            merchantId: user?.uid,
            timestamp: new Date().toISOString(),
            checksum,
            metadata: { ...payloadBase, transactionId: response.transactionId }
          };
          
          addDoc(collection(db, 'transactions'), txData);
          toast({ title: "MDB Payout Authorized", description: `TX ID: ${response.transactionId}` });
          setIsPayoutDialogOpen(false);
        }
      } else {
        const nagadPayload = {
          customerMsisdn: nagadMode === 'charity' ? '01799999999' : payoutData.destAccount,
          amount: parseFloat(payoutData.amount),
          orderId: `NEXUS-NGD-${Date.now()}`,
          metadata: {
            mfiOrg: nagadMode === 'mfi' ? payoutData.mfiOrg : undefined,
            mfiBranch: nagadMode === 'mfi' ? payoutData.mfiBranch : undefined,
            philanthropyOrg: nagadMode === 'charity' ? selectedPhilanthropy?.organizationName : undefined,
            donationCategory: nagadMode === 'charity' ? selectedPhilanthropy?.category : undefined,
            payoutType: nagadMode.toUpperCase()
          }
        };

        const response: NagadPayoutResponse = await executeNagadPayout(nagadPayload);

        if (response.success) {
          const signature = generateNagadSignature(nagadPayload);
          const desc = nagadMode === 'charity' 
            ? `Donation: ${selectedPhilanthropy?.organizationName}` 
            : nagadMode === 'mfi' 
              ? `Nagad MFI: ${payoutData.mfiOrg}` 
              : `Nagad B2B: ${payoutData.narration}`;

          const txData = {
            amount: parseFloat(payoutData.amount),
            currency: 'BDT',
            status: 'completed',
            description: desc,
            type: 'payout',
            merchantId: user?.uid,
            timestamp: new Date().toISOString(),
            checksum: signature,
            metadata: { 
              ...nagadPayload, 
              transactionId: response.transactionId,
            }
          };

          addDoc(collection(db, 'transactions'), txData);
          toast({ title: "Nagad Authorized", description: `Transferred to ${nagadMode.toUpperCase()}` });
          setIsPayoutDialogOpen(false);
        }
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Bridge Reset", description: "Authorization failed." });
    } finally {
      setIsExecutingPayout(false);
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
        <div className="flex gap-2">
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Compliance Score', value: auditResult ? `${auditResult.complianceScore}%` : '--', color: 'text-primary' },
          { label: 'Fraud Risk', value: auditResult ? auditResult.fraudAnalysis.riskLevel : '--', color: auditResult?.fraudAnalysis.riskLevel === 'High' ? 'text-destructive' : 'text-green-500' },
          { label: 'Node Health', value: '100%', color: 'text-primary' },
          { label: 'Network Uptime', value: 'LIVE', color: 'text-green-400' }
        ].map((stat, i) => (
          <Card key={i} className="bg-secondary/10 border-white/5">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest">{stat.label}</CardDescription>
              <CardTitle className={cn("text-2xl font-headline", stat.color)}>{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="bg-secondary/10 border-white/5 overflow-hidden">
        <CardHeader className="bg-black/20 border-b border-white/5">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-lg"><Filter size={20} className="text-primary" /> Ledger Filter</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-black/20 border-white/10 h-9">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5">
                <TableHead>Timestamp</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-16 animate-pulse text-muted-foreground font-mono">Streaming fragments...</TableCell></TableRow>
              ) : filteredTransactions?.length ? (
                filteredTransactions.map((tx) => (
                  <TableRow key={tx.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="text-xs font-mono text-muted-foreground">{tx.timestamp ? format(new Date(tx.timestamp), 'MMM d, HH:mm') : '...'}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{tx.description}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[9px] uppercase border-white/10">{tx.type}</Badge></TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
                    <TableCell className="text-right font-bold font-mono text-primary">{tx.currency} {tx.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setSelectedTx(tx)}>
                        <Search size={14} className="text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20">
                    <div className="flex flex-col items-center gap-2">
                      <DatabaseZap size={48} className="text-muted-foreground opacity-20" />
                      <p className="text-muted-foreground text-sm">No fragments found.</p>
                      <Button variant="link" className="text-primary text-xs" onClick={handleSeedData}>Seed Node</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
              <ShieldCheck className="text-primary" /> Fragment Audit Trail
            </DialogTitle>
            <DialogDescription>Full cryptographic breakdown of the selected fragment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Internal Node ID</p>
                <p className="text-xs font-mono">{selectedTx?.id || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Status</p>
                <div>{selectedTx && getStatusBadge(selectedTx.status)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Key size={12} className="text-primary" /> Digital Signature (HMAC/RSA)
              </p>
              <div className={cn(
                "p-4 rounded-lg border font-mono text-[10px] break-all leading-relaxed bg-black/40",
                selectedTx?.checksum === 'ERROR_CHECKSUM_MISMATCH' ? "border-destructive/30 text-destructive" : "border-white/5 text-green-400"
              )}>
                {selectedTx?.checksum || 'PENDING_VALIDATION'}
              </div>
              {selectedTx?.checksum === 'ERROR_CHECKSUM_MISMATCH' && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
                  <AlertCircle size={14} className="text-destructive" />
                  <p className="text-[10px] text-destructive font-bold">SECURITY ALERT: Checksum mismatch!</p>
                </div>
              )}
            </div>

            {selectedTx?.metadata && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Meta-Data Logs</p>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono space-y-1">
                  {Object.entries(selectedTx.metadata).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="text-right text-foreground">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button className="w-full bg-primary font-bold" onClick={() => setSelectedTx(null)}>Close Audit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payout Dialog */}
      <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
              <Landmark className="text-primary" /> Funds Disbursement
            </DialogTitle>
            <DialogDescription>Execute transfers via MDB Core or Nagad B2B Gateway.</DialogDescription>
          </DialogHeader>
          
          <Tabs value={payoutMethod} onValueChange={(v) => setPayoutMethod(v as any)} className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2 bg-black/40 h-12 p-1">
              <TabsTrigger value="mdb" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                <Landmark size={14} className="mr-2" /> MDB Core
              </TabsTrigger>
              <TabsTrigger value="nagad" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs">
                <Smartphone size={14} className="mr-2" /> Nagad M2P
              </TabsTrigger>
            </TabsList>
            
            <div className="grid gap-4 py-6">
              {payoutMethod === 'nagad' && (
                <div className="flex gap-2 p-1 bg-black/40 rounded-lg mb-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn("flex-1 text-[10px] h-8", nagadMode === 'b2b' && "bg-accent/20 text-accent")}
                    onClick={() => setNagadMode('b2b')}
                  >
                    B2B Transfer
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn("flex-1 text-[10px] h-8", nagadMode === 'mfi' && "bg-accent/20 text-accent")}
                    onClick={() => setNagadMode('mfi')}
                  >
                    MFI / EMI
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn("flex-1 text-[10px] h-8", nagadMode === 'charity' && "bg-accent/20 text-accent")}
                    onClick={() => setNagadMode('charity')}
                  >
                    Donation
                  </Button>
                </div>
              )}

              {payoutMethod === 'nagad' && nagadMode === 'mfi' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                      <Building2 size={10} /> MFI Organization
                    </Label>
                    <Select 
                      value={payoutData.mfiOrg} 
                      onValueChange={(v) => setPayoutData({...payoutData, mfiOrg: v, mfiBranch: ''})}
                    >
                      <SelectTrigger className="bg-black/20 border-white/10 h-11 text-xs">
                        <SelectValue placeholder="Select Organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {mfiOrgs.map(org => <SelectItem key={org} value={org} className="text-xs">{org}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                      <MapPin size={10} /> Branch
                    </Label>
                    <Select 
                      value={payoutData.mfiBranch} 
                      onValueChange={(v) => setPayoutData({...payoutData, mfiBranch: v})}
                      disabled={!payoutData.mfiOrg}
                    >
                      <SelectTrigger className="bg-black/20 border-white/10 h-11 text-xs">
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBranches.map(node => (
                          <SelectItem key={node.branchName} value={node.branchName} className="text-xs">
                            {node.branchName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {payoutMethod === 'nagad' && nagadMode === 'charity' && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <Heart size={10} className="text-red-400" /> Philanthropy Node
                  </Label>
                  <Select 
                    value={payoutData.philanthropyId} 
                    onValueChange={(v) => setPayoutData({...payoutData, philanthropyId: v})}
                  >
                    <SelectTrigger className="bg-black/20 border-white/10 h-11 text-xs">
                      <SelectValue placeholder="Select Charity / Zakat Fund" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_NAGAD_PHILANTHROPY_NODES.map(node => (
                        <SelectItem key={node.id} value={node.id.toString()} className="text-xs">
                          {node.organizationName} ({node.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {nagadMode === 'b2b' || payoutMethod === 'mdb' ? (
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                    {payoutMethod === 'mdb' ? 'Destination Account' : 'Nagad Number'}
                  </Label>
                  <Input 
                    className="bg-black/20 border-white/10 h-11" 
                    placeholder={payoutMethod === 'mdb' ? "Account Number" : "01XXXXXXXXX"}
                    value={payoutData.destAccount}
                    onChange={(e) => setPayoutData({...payoutData, destAccount: e.target.value})}
                  />
                </div>
              ) : null}

              {payoutMethod === 'mdb' && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Routing Number</Label>
                  <Input 
                    className="bg-black/20 border-white/10 h-11" 
                    placeholder="000111222"
                    value={payoutData.routing}
                    onChange={(e) => setPayoutData({...payoutData, routing: e.target.value})}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Amount (BDT)</Label>
                  <Input 
                    type="number"
                    className="bg-black/20 border-white/10 h-11" 
                    value={payoutData.amount}
                    onChange={(e) => setPayoutData({...payoutData, amount: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Narration</Label>
                  <Input 
                    className="bg-black/20 border-white/10 h-11" 
                    value={payoutData.narration}
                    onChange={(e) => setPayoutData({...payoutData, narration: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </Tabs>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsPayoutDialogOpen(false)}>Cancel</Button>
            <Button 
              className={cn(
                "font-bold px-8 shadow-lg",
                payoutMethod === 'mdb' ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-accent text-accent-foreground shadow-accent/20"
              )}
              onClick={handleExecutePayout}
              disabled={isExecutingPayout}
            >
              {isExecutingPayout ? <RefreshCcw className="animate-spin mr-2" size={16} /> : <Zap className="mr-2" size={16} />}
              {isExecutingPayout ? "RSA Signing..." : "Authorize Transfer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Audit Report Dialog */}
      <Dialog open={!!auditResult} onOpenChange={(open) => !open && setAuditResult(null)}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
              <BrainCircuit className="text-primary" /> Nexus AI Audit Report
            </DialogTitle>
            <DialogDescription>Autonomous financial intelligence analysis.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary/5 border-primary/20 p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Compliance Score</p>
                <p className="text-3xl font-bold font-headline text-primary">{auditResult?.complianceScore}%</p>
              </Card>
              <Card className="bg-destructive/5 border-destructive/20 p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Fraud Risk</p>
                <p className="text-3xl font-bold font-headline text-destructive">{auditResult?.fraudAnalysis.riskLevel}</p>
              </Card>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-white/5 space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase">Executive Summary</p>
              <p className="text-sm leading-relaxed text-foreground/90">{auditResult?.smartSummary}</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase">Strategic Recommendations</p>
              <div className="grid gap-2">
                {auditResult?.recommendations.map((r, i) => (
                  <div key={i} className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs flex gap-3 items-start">
                    <CheckCircle2 size={14} className="text-primary shrink-0" />
                    <span className="font-medium">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full bg-primary font-bold shadow-lg" onClick={() => setAuditResult(null)}>Close Intelligence Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
