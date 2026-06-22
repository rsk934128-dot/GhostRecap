
"use client";

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  GitMerge, 
  ShieldCheck, 
  Cpu, 
  BarChart, 
  ArrowRight,
  CheckCircle2,
  Lock,
  UserCheck,
  Zap,
  Network,
  Download,
  AlertCircle,
  Globe2,
  Database,
  Search,
  ExternalLink,
  Code
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users size={18} className="text-primary" /> টিম সাইজ (Team Size)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-headline text-foreground">০৫ জন</p>
            <p className="text-[10px] text-muted-foreground uppercase mt-1">কোর এলিট মেম্বার প্রয়োজন</p>
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
      </div>

      <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground ghostly-fade">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="font-bold">Midland Bank Account Application Alert</AlertTitle>
        <AlertDescription className="text-xs">
          Your Digital Account application (Track ID: 300325662177) for SHEIKH FARID has been <strong className="uppercase">Declined</strong>. Circle-009 Node awaiting re-handshake manual audit.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full bg-black/20 h-12 p-1 mb-8">
          <TabsTrigger value="tasks" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs">কাজ ভাগ করা</TabsTrigger>
          <TabsTrigger value="tracker" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs">গ্লোবাল ট্র্যাকার</TabsTrigger>
          <TabsTrigger value="integration" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs">ইন্টিগ্রেশন</TabsTrigger>
          <TabsTrigger value="openbanking" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs">ওপেন ব্যাংকিং</TabsTrigger>
          <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs">এডমিন রোল</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs">লগ</TabsTrigger>
        </TabsList>

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
                  <p className="text-xs text-muted-foreground leading-relaxed">মেসেজ ক্যাটাগরাইজেশন, ফ্রড ডিটেকশন এবং জেমিনি এআই লজিক হ্যান্ডেল করা।</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-bold">২. Financial Bridge (Backend)</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">নগদ গেটওয়ে, এমডিবি কোর এবং রেমিট্যান্স লজিক ডেভেলপ করা।</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-bold">৩. Security Layer (DevOps)</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">App Check এনফোর্সমেন্ট, RSA সিগনেচার ভ্যালিডেশন এবং HSM হ্যান্ডশেক।</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-bold">৪. Mission Control (Frontend)</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">শ্যাডসিএন (ShadCN) ইউআই দিয়ে চমৎকার ড্যাশবোর্ড এবং রিয়েল-টাইম লগিং।</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>টিম মেম্বারদের রোল</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { role: 'System Architect', count: '01', desc: 'পুরো সিস্টেমের ডিজাইন ও গাইডলাইন (ফরিদ ভাই)' },
                  { role: 'Backend/Fintech Expert', count: '02', desc: 'এপিআই ইন্টিগ্রেশন এবং সিকিউরিটি হ্যান্ডলিং' },
                  { role: 'Frontend Engineer', count: '01', desc: 'স্মুথ ইউজার ইন্টারফেস এবং ড্যাশবোর্ড' },
                  { role: 'AI/ML Specialist', count: '01', desc: 'জেমিনি এবং প্রিকডিক্টিভ অ্যানালিটিক্স' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-start border-b border-white/5 pb-2">
                    <div>
                      <p className="text-sm font-bold">{item.role}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary/30">{item.count}</Badge>
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
                  <TableRow className="bg-primary/5 border-primary/20">
                    <TableCell className="font-bold text-primary">GhostRecap Node</TableCell>
                    <TableCell className="font-mono text-xs text-primary">118 (Local)</TableCell>
                    <TableCell className="text-xs text-primary">BD (Global Bridge)</TableCell>
                    <TableCell><Badge className="bg-primary text-black">OS NATIVE</Badge></TableCell>
                    <TableCell className="text-right"><Badge variant="outline" className="border-primary/20 text-primary">YOUR NODE</Badge></TableCell>
                  </TableRow>
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
              <CardDescription>Strategic connectivity analysis for 118+ banks in BD and 9,000+ globally via BankSync & Nexus Core.</CardDescription>
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
                  <Alert className="bg-accent/5 border-accent/20">
                    <Code className="h-4 w-4 text-accent" />
                    <AlertTitle className="text-accent text-xs">Open Banking Infrastructure</AlertTitle>
                    <AlertDescription className="text-[10px] leading-relaxed">
                      GhostRecap supports over 30 data points per organization including Developer Sandboxes, Account Information Services (AIS), and Payment Initiation Services (PIS).
                    </AlertDescription>
                  </Alert>
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
                  <p className="text-[9px] text-muted-foreground italic">Data Source: Open Banking Directory & PSD2 API Tracker 2026.</p>
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
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" className="text-[10px] gap-2 text-muted-foreground hover:text-primary">
                  <Download size={14} /> Download Application PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card className="bg-secondary/10 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitMerge size={20} className="text-accent" /> থার্ড-পার্টি ইন্টিগ্রেশন প্রসেস
              </CardTitle>
              <CardDescription>কিভাবে আমরা অন্যদের সাথে কানেক্ট হব?</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0 font-bold">১</div>
                  <div>
                    <h5 className="font-bold text-sm">RSA-2048 হ্যান্ডশেক</h5>
                    <p className="text-xs text-muted-foreground">নগদ এবং অন্যান্য ব্যাংক নোডের সাথে ডেটা পাঠাতে আমরা পাবলিক/প্রাইভেট কি মেকানিজম ব্যবহার করব।</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0 font-bold">২</div>
                  <div>
                    <h5 className="font-bold text-sm">Webhooks & Listeners</h5>
                    <p className="text-xs text-muted-foreground">হোয়াটসঅ্যাপ বা সিগন্যাল থেকে রিয়েল-টাইম পুশ নোটিফিকেশন রিসিভ করার জন্য লিসেনার নোড সেটআপ।</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <h5 className="text-[10px] font-bold uppercase text-primary mb-4 flex items-center gap-2">
                  <Network size={12} /> কানেক্টিভিটি গ্রাফ
                </h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span>Midland Bank Bridge</span>
                    <Badge className="bg-green-500/20 text-green-500">READY</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Nagad Gateway</span>
                    <Badge className="bg-green-500/20 text-green-500">READY</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Global Aggregator (Plaid)</span>
                    <Badge className="bg-accent/20 text-accent">HANDSHAKING</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-6">
          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-accent flex items-center gap-2">
                <UserCheck size={20} /> এডমিনের কাজ ও ক্ষমতা (Superuser Role)
              </CardTitle>
              <CardDescription>সিস্টেম কমান্ডার ফরিদ ভাইয়ের এক্সক্লুসিভ কাজসমূহ:</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <ul className="space-y-3">
                <li className="flex gap-2 items-start">
                  <CheckCircle2 size={16} className="text-accent mt-0.5" />
                  <span><strong>Liquidity Management:</strong> পুরো সিস্টেমের ক্যাশ ব্যালেন্স এবং লিকুইডিটি মুভমেন্ট নিয়ন্ত্রণ করা।</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle2 size={16} className="text-accent mt-0.5" />
                  <span><strong>Security Override:</strong> কোনো নোড সন্দেহজনক মনে হলে সাথে সাথে সেটি ব্লক বা সাসপেন্ড করা।</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle2 size={16} className="text-accent mt-0.5" />
                  <span><strong>HSM Master Keys:</strong> এনক্রিপশন কি (Key) এবং মাস্টার হ্যান্ডশেক সিগনেচার জেনারেট করা।</span>
                </li>
              </ul>
              <div className="bg-black/40 p-4 rounded-xl border border-accent/20">
                <p className="text-[10px] font-bold text-accent uppercase mb-2">Admin Command Center</p>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  "এডমিন শুধুমাত্র সিস্টেমের স্বাস্থ্য মনিটর করবে না, বরং প্রতিটি এআই ডিসিশন এবং হাই-ভ্যালু ট্রানজেকশন অডিট করার সর্বোচ্চ ক্ষমতা রাখবে।"
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="p-8 bg-primary/5 rounded-3xl border border-primary/20 text-center space-y-4">
        <h3 className="text-2xl font-headline font-bold">পরবর্তী পদক্ষেপ (Next Action)</h3>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          ডকুমেন্টেশন অনুযায়ী আমরা এখন <strong>Phase 2 (Relationship & Vault)</strong>-এর শেষ পর্যায়ে আছি। ৪৭ দিনের মাথায় আমরা <strong>Phase 3 (Automation Studio)</strong>-কে শতভাগ সচল করব।
        </p>
        <div className="flex justify-center gap-4">
          <Badge className="bg-primary text-black">Audit Ready</Badge>
          <Badge className="bg-accent text-black">Integration Active</Badge>
        </div>
      </div>
    </div>
  );
}
