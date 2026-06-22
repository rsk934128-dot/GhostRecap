
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
  Network
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function StrategicDocsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full bg-black/20 h-12 p-1 mb-8">
          <TabsTrigger value="tasks" className="data-[state=active]:bg-primary data-[state=active]:text-black">কাজ ভাগ করা</TabsTrigger>
          <TabsTrigger value="integration" className="data-[state=active]:bg-primary data-[state=active]:text-black">ইন্টিগ্রেশন</TabsTrigger>
          <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-black">এডমিন রোল</TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-black">ইউজার অ্যাক্সেস</TabsTrigger>
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
                    <h5 className="font-bold">RSA-2048 হ্যান্ডশেক</h5>
                    <p className="text-xs text-muted-foreground">নগদ এবং অন্যান্য ব্যাংক নোডের সাথে ডেটা পাঠাতে আমরা পাবলিক/প্রাইভেট কি মেকানিজম ব্যবহার করব।</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0 font-bold">২</div>
                  <div>
                    <h5 className="font-bold">Webhooks & Listeners</h5>
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
                    <span>Global MTO Node</span>
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

        <TabsContent value="users" className="space-y-6">
          <Card className="bg-secondary/10 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock size={20} className="text-primary" /> ইউজার লেভেল অ্যাক্সেস (Visibility)
              </CardTitle>
              <CardDescription>কে কি দেখতে পারবে?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-white/5 space-y-2">
                  <h5 className="font-bold flex items-center gap-2"><BarChart size={14} className="text-primary" /> মার্চেন্ট ইউজার</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>- নিজের ট্রানজেকশন হিস্ট্রি</li>
                    <li>- নিজের ইনবাউন্ড মেসেজ ইন্টেলিজেন্স</li>
                    <li>- পার্সোনাল ওয়ালেট ব্যালেন্স</li>
                    <li>- সিকিউর ভল্ট (নিজস্ব ডেটা)</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                  <h5 className="font-bold flex items-center gap-2 text-primary"><UserCheck size={14} /> সিস্টেম সুপারইউজার (Admin)</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>- গ্লোবাল ট্রানজেকশন অডিট লগ</li>
                    <li>- সিস্টেম-ওয়াইড সিকিউরিটি স্ট্যাটাস</li>
                    <li>- সব ইউজারের লিকুইডিটি নোড মনিটরিং</li>
                    <li>- এআই মেমরি ফ্লাশ এবং কনফিগারেশন</li>
                  </ul>
                </div>
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
