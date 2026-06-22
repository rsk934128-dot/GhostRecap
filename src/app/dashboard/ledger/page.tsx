
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase, logAnalyticsEvent } from '@/firebase';
import { collection, query, where, orderBy, limit, addDoc } from 'firebase/firestore';
import { Transaction, MDBPayoutResponse, NagadPayoutResponse, NagadMfiNode, NagadPhilanthropyNode, NagadMerchantPayPayload, NagadMerchantPayResponse, NagadBiller, NagadBillPayPayload, NagadBillPayResponse, InboundRemittancePayload, RemittanceDisbursementResult, NagadCashOutPayload, CashOutFeeResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger, SelectGroup, SelectLabel } from '@/components/ui/select';
import { 
  RefreshCcw, Filter, BrainCircuit, 
  CheckCircle2, DatabaseZap, Send, Landmark, Key, 
  ShieldCheck, Smartphone, Zap, Search, AlertCircle,
  Building2, MapPin, Heart, Gift, QrCode, User,
  FileText, Lightbulb, GraduationCap, Wifi, Receipt,
  Globe, Coins, ArrowDownRight, Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { analyzeNexusLedger, NexusIntelligenceOutput } from '@/ai/flows/nexus-intelligence';
import { executeMDBPayout } from '@/app/lib/midland-actions';
import { executeNagadPayout } from '@/app/lib/nagad-actions';
import { executeNagadMerchantPay } from '@/app/lib/nagad-merchant-actions';
import { executeNagadBillPay } from '@/app/lib/nagad-billpay-actions';
import { executeGlobalRemittance } from '@/app/lib/nagad-remittance-actions';
import { executeNagadCashOut, calculateCashOutFee } from '@/app/lib/nagad-cashout-actions';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from '@/lib/utils';
import { generateHMACChecksum, generateNagadSignature } from '@/lib/security';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_NAGAD_MFI_NODES, MOCK_NAGAD_PHILANTHROPY_NODES, MOCK_NAGAD_BILLERS, MOCK_NAGAD_MTO_NODES } from '@/lib/mock-data';

export default function NexusLedgerPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAuditing, setIsAuditing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  const [isMerchantPayDialogOpen, setIsMerchantPayDialogOpen] = useState(false);
  const [isBillPayDialogOpen, setIsBillPayDialogOpen] = useState(false);
  const [isRemittanceDialogOpen, setIsRemittanceDialogOpen] = useState(false);
  const [isCashOutDialogOpen, setIsCashOutDialogOpen] = useState(false);
  const [isExecutingPayout, setIsExecutingPayout] = useState(false);
  const [isExecutingMerchantPay, setIsExecutingMerchantPay] = useState(false);
  const [isExecutingBillPay, setIsExecutingBillPay] = useState(false);
  const [isExecutingRemittance, setIsExecutingRemittance] = useState(false);
  const [isExecutingCashOut, setIsExecutingCashOut] = useState(false);
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

  const [remittanceData, setRemittanceData] = useState<InboundRemittancePayload>({
    remitterName: 'Farid Global',
    beneficiaryNagadNumber: '01XXXXXXXXX',
    sourceCountry: '',
    mtoProvider: '',
    principalAmountBDT: 0,
    referenceNumber: 'MTCN-' + Math.random().toString(36).substr(2, 6).toUpperCase()
  });

  const [cashOutData, setCashOutData] = useState<NagadCashOutPayload>({
    uddoktaNumber: '017XXXXXXXX',
    amount: 0,
    pinSecureToken: 'SECURE_PIN_HASH',
    appType: 'REGULAR_APP'
  });

  const [previewCashOut, setPreviewCashOut] = useState<CashOutFeeResult | null>(null);

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

  const selectedMto = useMemo(() => 
    MOCK_NAGAD_MTO_NODES.find(m => m.country === remittanceData.sourceCountry),
    [remittanceData.sourceCountry]
  );

  useEffect(() => {
    if (cashOutData.amount > 0) {
      calculateCashOutFee(cashOutData.amount, cashOutData.appType).then(setPreviewCashOut);
    } else {
      setPreviewCashOut(null);
    }
  }, [cashOutData.amount, cashOutData.appType]);

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

  // ... (rest of the handle functions remain same)

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
          <Button variant="outline" className="gap-2 border-red-500/20 text-red-500 hover:bg-red-500/5" onClick={() => setIsCashOutDialogOpen(true)}>
            <Wallet size={16} /> Cash Out
          </Button>
          <Button variant="outline" className="gap-2 border-blue-500/20 text-blue-500 hover:bg-blue-500/5" onClick={() => setIsRemittanceDialogOpen(true)}>
            <Globe size={16} /> Global Remittance
          </Button>
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
      {/* ... (rest of the TSX content) */}
    </div>
  );
}
