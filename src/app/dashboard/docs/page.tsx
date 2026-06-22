"use client";

import { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Zap, 
  Archive, 
  Wallet,
  Monitor,
  AlertCircle,
  BarChart,
  Search,
  CheckCircle2,
  ExternalLink,
  Globe2,
  Network,
  Cpu
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function StrategicDocsPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const aggregators = [
    { name: 'BankSync', banks: 9748, countries: 62, mcp: 'READY', verified: true },
    { name: 'Plaid', banks: 9706, countries: 60, mcp: 'READY', verified: false },
    { name: 'Lunch Flow', banks: 2402, countries: 60, mcp: 'READY', verified: true },
    { name: 'GoCardless', banks: 2228, countries: 54, mcp: 'STANDBY', verified: false },
    { name: 'Salt Edge', banks: 1586, countries: 73, mcp: 'STANDBY', verified: true },
    { name: 'TrueLayer', banks: 70, countries: 64, mcp: 'READY', verified: true },
  ];

  const filteredAggregators = aggregators.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <FileText className="text-primary" size={32} />
          <h1 className="text-4xl font-headline font-bold">Operation Manual & Docs</h1>
        </div>
        <p className="text-muted-foreground italic">"এক এর ভিতর সব" - Mission 400 Strategic Governance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Archive size={18} className="text-primary" /> মাইগ্রেশন প্ল্যান
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold font-headline">৯ মাস বাকি</p>
            <p className="text-[10px] text-muted-foreground uppercase mt-1">Google AI Studio Transfer</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap size={18} className="text-accent" /> ডেডলাইন (Deadline)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-headline text-accent">৪৭ দিন</p>
            <p className="text-[10px] text-muted-foreground uppercase mt-1">বাকি আছে (Mission 400)</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck size={18} className="text-green-500" /> স্ট্যাটাস (Status)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-headline text-green-500">STABLE</p>
            <p className="text-[10px] text-muted-foreground uppercase mt-1">ইনফ্রাস্ট্রাকচার রেডি</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet size={18} className="text-green-500" /> খরচ ট্র্যাকার (Budget)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-headline text-green-500">সাশ্রয়ী</p>
            <p className="text-[10px] text-muted-foreground uppercase mt-1">Rubel Bank Module Active</p>
          </CardContent>
        </Card>
      </div>

      <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground ghostly-fade">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="font-bold">Firebase Studio Transition Alert</AlertTitle>
        <AlertDescription className="text-xs leading-relaxed">
          Firebase Studio workspace creation is disabled as of <strong>June 22, 2026</strong>. Project shutdown: <strong>March 22, 2027</strong>. Your Firestore and Auth nodes are <strong>UNINTERRUPTED</strong>.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="migration" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full bg-black/20 h-12 p-1 mb-8">
          <TabsTrigger value="migration" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs">মাইগ্রেশন</TabsTrigger>
          <TabsTrigger value="tracker" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs">গ্লোবাল ট্র্যাকার</TabsTrigger>
          <TabsTrigger value="integration" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs">ইন্টিগ্রেশন</TabsTrigger>
          <TabsTrigger value="openbanking" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs">ওপেন ব্যাংকিং</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs">লগ</TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs">কাজ ভাগ</TabsTrigger>
        </TabsList>

        <TabsContent value="migration" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-secondary/10 border-white/5">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Monitor size={20} /> মাইগ্রেশন রোডম্যাপ (Roadmap)
                </CardTitle>
                <CardDescription>Firebase Studio থেকে সরে যাওয়ার পর্যায়সমূহ:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h5 className="text-sm font-bold">১. ব্যাকআপ ও জিপ (জুন ২০২৬)</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">বর্তমান কোডবেস জিপ করে লোকাল স্টোরেজে রাখা।</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-bold">২. Google AI Studio (জুলাই ২০২৬)</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">ক্লাউড এজেন্টগুলোকে গুগলের নতুন ফ্রি এআই স্টুডিওতে ট্রান্সফার করা।</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-bold">৩. Antigravity/Local (আগস্ট ২০২৬)</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">লোকাল পিসিতে গুগল অ্যান্টিগ্রাভিটি ব্যবহার করে কোড এডিট ও টেস্ট করা।</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>গুগল মাইগ্রেশন গাইড (Action Items)</CardTitle>
                <CardDescription>বাজেট ঠিক রেখে পরবর্তী পদক্ষেপ:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { role: 'Firestore/Auth', status: 'Safe', desc: 'কোর সার্ভিসগুলো আজীবন সচল থাকবে।' },
                  { role: 'AI Workspace', status: 'Migrate', desc: 'Google AI Studio - খরচ ০ টাকা।' },
                  { role: 'Editor', status: 'Antigravity', desc: 'লোকাল ডেক্সটপ অ্যাপ - খরচ ০ টাকা।' },
                  { role: 'Hosting', status: 'Vercel', desc: 'NextJS হোস্টিং - খরচ ০ টাকা।' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-start border-b border-white/5 pb-2">
                    <div>
                      <p className="text-sm font-bold">{item.role}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <Badge variant="outline" className="text-green-500 border-green-500/30">{item.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tracker" className="space-y-6">
          <Card className="bg-secondary/10 border-white/5 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BarChart size={20} className="text-primary" /> Financial Aggregator Tracker 2026
                </CardTitle>
                <CardDescription>Industry comparison of Open Banking connectivity platforms.</CardDescription>
              </div>
              <div className="relative w-64 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <Input 
                  placeholder="Filter aggregators..." 
                  className="pl-9 h-8 bg-black/20 border-white/10 text-xs" 
                  value={searchQuery}
                  onChange={(e) => setSearchSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5">
                    <TableHead className="text-[10px] uppercase font-bold">Platform</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold">Banks</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold">Countries</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold">MCP Status</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAggregators.map((agg) => (
                    <TableRow key={agg.name} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-bold">
                        <div className="flex items-center gap-2">
                          {agg.name}
                          {agg.verified && <CheckCircle2 size={10} className="text-blue-400" />}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{agg.banks.toLocaleString()}</TableCell>
                      <TableCell className="text-xs">{agg.countries}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={agg.mcp === 'READY' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-amber-500/20 text-amber-500'}>
                          {agg.mcp}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><ExternalLink size={12} /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="openbanking" className="space-y-6">
          <Card className="bg-secondary/10 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe2 size={20} className="text-primary" /> Open Banking Tracker (Global)
              </CardTitle>
              <CardDescription>Strategic connectivity analysis for 9,000+ globally via BankSync & Nexus Core.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <h5 className="font-bold text-sm mb-2 text-primary">Midland Bank PLC Status</h5>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex justify-between"><span>Open Banking APIs</span> <Badge variant="outline" className="h-5">Profiling Active</Badge></li>
                      <li className="flex justify-between"><span>MCP Integration</span> <Badge variant="outline" className="h-5 text-accent border-accent/20">Ready (Agentic)</Badge></li>
                      <li className="flex justify-between"><span>PSD2 Compliance</span> <Badge variant="outline" className="h-5 text-green-500 border-green-500/20">Certified</Badge></li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Top API Aggregators 2026</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {['BankSync (9,748 Banks)', 'Plaid (9,706 Banks)', 'Lunch Flow', 'GoCardless', 'TrueLayer', 'Yapily'].map(node => (
                      <div key={node} className="p-2 rounded-lg bg-white/5 border border-white/5 text-[10px] font-medium flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> {node}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-secondary/10 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network size={20} className="text-primary" /> MDB Digital Account Applications
              </CardTitle>
              <CardDescription>Archive of bank portal application fragments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-white/5 overflow-hidden">
                <div className="grid grid-cols-6 p-3 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <div className="col-span-1">Track ID</div>
                  <div className="col-span-1">Account Title</div>
                  <div className="col-span-1">Product</div>
                  <div className="col-span-1">Branch</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1 text-right">Date</div>
                </div>
                <div className="p-3 grid grid-cols-6 items-center text-xs border-t border-white/5 hover:bg-white/5 transition-colors">
                  <div className="col-span-1 font-mono text-primary">300325662177</div>
                  <div className="col-span-1 font-bold">SHEIKH FARID</div>
                  <div className="col-span-1 text-muted-foreground">Digital Savings</div>
                  <div className="col-span-1 text-muted-foreground">Rajshahi City</div>
                  <div className="col-span-1"><Badge variant="destructive" className="h-5 text-[9px]">DECLINED</Badge></div>
                  <div className="col-span-1 text-right text-muted-foreground">Mar 30, 2025</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-secondary/10 border-white/5">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Cpu size={20} /> নোড ভিত্তিক কাজ ভাগ (Division)
                </CardTitle>
                <CardDescription>আমরা প্রজেক্টকে ৪টি প্রধান অংশে ভাগ করব:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h5 className="text-sm font-bold">১. Intelligence Core (AI/ML)</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">মেসেজ ক্যাটাগরাইজেশন ও জেমিনি এআই লজিক হ্যান্ডেল করা।</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-bold">২. Financial Bridge (Backend)</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">নগদ গেটওয়ে এবং এমডিবি কোর লজিক ডেভেলপ করা।</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-8 bg-primary/5 rounded-3xl border border-primary/20 text-center space-y-4">
        <h3 className="text-2xl font-headline font-bold">পরবর্তী পদক্ষেপ (Next Action)</h3>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          ডকুমেন্টেশন অনুযায়ী আমরা এখন <strong>Phase 2 (Relationship & Vault)</strong>-এর শেষ পর্যায়ে আছি। গুগলের আপডেটের কারণে আমরা এখন **Workspace Backup**-কে সর্বোচ্চ গুরুত্ব দিচ্ছি।
        </p>
        <div className="flex justify-center gap-4">
          <Badge className="bg-primary text-black">Migration Ready</Badge>
          <Badge className="bg-accent text-black">Backup Active</Badge>
        </div>
      </div>
    </div>
  );
}
