'use client';

import { useState } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, Firestore } from 'firebase/firestore';
import { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCcw, Search, Filter, CreditCard, ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function NexusLedgerPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Compound Query for Real-Time Ledger
  const ledgerQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    
    let q = query(
      collection(db, 'transactions'),
      where('merchantId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    if (statusFilter !== 'all') {
      q = query(q, where('status', '==', statusFilter));
    }
    
    if (typeFilter !== 'all') {
      q = query(q, where('type', '==', typeFilter));
    }

    return q;
  }, [db, user, statusFilter, typeFilter]);

  const { data: transactions, loading } = useCollection<Transaction>(ledgerQuery);

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
          <h1 className="text-4xl font-headline font-bold">MDB Nexus Ledger</h1>
          <p className="text-muted-foreground">Real-time financial reconciliation and transaction auditing.</p>
        </div>
        <Button variant="outline" className="gap-2 border-white/10">
          <RefreshCcw size={16} /> Force Sync Node
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-secondary/10 border-white/5">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Total Volume</CardDescription>
            <CardTitle className="text-2xl font-headline">৳ 0.00</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-secondary/10 border-white/5">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Pending Nodes</CardDescription>
            <CardTitle className="text-2xl font-headline">0</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-secondary/10 border-white/5">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Flagged Items</CardDescription>
            <CardTitle className="text-2xl font-headline text-destructive">0</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Network Health</CardDescription>
            <CardTitle className="text-2xl font-headline text-primary">100%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-secondary/10 border-white/5">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Filter size={20} className="text-primary" />
              Advanced Audit Filters
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-black/20 border-white/10 h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] bg-black/20 border-white/10 h-9">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="payout">Payout</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-white/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground animate-pulse">
                      Streaming from Node Nexus...
                    </TableCell>
                  </TableRow>
                ) : transactions && transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-white/5 transition-colors border-white/5">
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {format(new Date(tx.timestamp), 'MMM d, HH:mm:ss')}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{tx.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs uppercase font-bold">
                          {tx.type === 'payout' ? <ArrowUpRight size={12} className="text-blue-400" /> : <ArrowDownLeft size={12} className="text-green-400" />}
                          {tx.type}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell className="text-right font-bold font-mono">
                        {tx.currency} {tx.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle size={32} className="opacity-20" />
                        <p>No transaction fragments found in this node.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
