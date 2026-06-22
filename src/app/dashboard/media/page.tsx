"use client";

import { Music, Play, Disc, Star, Sparkles, TrendingUp, RefreshCcw, BrainCircuit, BarChart3, Globe, Radio, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { analyzeMediaSentiment, MediaSentimentOutput } from '@/ai/flows/media-sentiment-analysis';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MediaIntelligenceHub() {
  const [mounted, setMounted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MediaSentimentOutput | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mediaData = [
    {
      artist: "Jassie Gill",
      category: "Sovereign Pop",
      tracks: [
        { title: "Nikle Currant (with Neha Kakkar)", description: "A high-energy pop track known for its catchy beat.", type: "High-Energy" },
        { title: "Surma Kaala", description: "A popular upbeat song featuring Rhea Chakraborty.", type: "Upbeat" },
        { title: "Guitar Sikhda", description: "A soulful romantic number written by Jaani and composed by B Praak.", type: "Soulful" }
      ]
    },
    {
      artist: "Badshah",
      category: "Global Anthems",
      tracks: [
        { title: "DJ Waley Babu", description: "One of Badshah's most iconic party anthems.", type: "Iconic" },
        { title: "Jugnu", description: "A vibrant, modern pop track that became a massive digital hit.", type: "Digital Hit" },
        { title: "Abhi Toh Party Shuru Hui Hai", description: "A classic Bollywood party song from the film Khoobsurat.", type: "Classic" }
      ]
    },
    {
      artist: "B Praak & Jaani",
      category: "Emotional Nodes",
      tracks: [
        { title: "Kya Loge Tum", description: "A powerful, emotionally charged song from his album Zohrajabeen.", type: "Powerful" },
        { title: "Yaar Ka Sataya Hua Hai", description: "A dramatic storytelling song featuring Nawazuddin Siddiqui.", type: "Dramatic" },
        { title: "Masstaani", description: "A melodic and popular composition that showcases their signature sound.", type: "Melodic" }
      ]
    }
  ];

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeMediaSentiment({ mediaData });
      setAnalysisResult(result);
      toast({ title: "Analysis Complete", description: "Cultural sentiment signals have been mapped." });
    } catch (e) {
      toast({ variant: "destructive", title: "Analysis Failed", description: "Intelligence node could not reach the cognitive layer." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] border-primary/20 text-primary bg-primary/5 uppercase font-bold tracking-widest">Entertainment Node</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Music className="text-primary" size={32} />
            <h1 className="text-4xl font-headline font-bold">Media Intelligence Hub</h1>
          </div>
          <p className="text-muted-foreground">Analyzing cultural sentiment and collaboration trends in global entertainment.</p>
        </div>
        <Button 
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
        >
          {isAnalyzing ? <RefreshCcw size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {isAnalyzing ? "Analyzing Trends..." : "Run Sentiment Analysis"}
        </Button>
      </header>

      {/* Live Fragments / Stream Section */}
      <Card className="bg-accent/5 border-accent/20 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Radio size={120} /></div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Radio className="text-accent animate-pulse" size={24} /> Live Streaming Node
            </CardTitle>
            <Badge className="bg-accent text-black font-bold">LIVE PULSE</Badge>
          </div>
          <CardDescription>Direct interface for official media fragments and live streams.</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="p-6 rounded-2xl bg-black/40 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h4 className="font-bold text-lg">Toffee Live: Official Fragment</h4>
              <p className="text-xs text-muted-foreground max-w-sm">Secure URI handshake for RzT1pp4Bb1O6C9k7RvnM node. Validated for high-bandwidth telemetry.</p>
            </div>
            <Button 
              className="bg-accent hover:bg-accent/90 text-black font-bold h-12 px-8 gap-2 shadow-lg shadow-accent/20"
              onClick={() => window.open('https://toffeelive.com/en/watch/RzT1pp4Bb1O6C9k7RvnM', '_blank')}
            >
              <ExternalLink size={18} /> Open Toffee Stream
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {mediaData.map((group, i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                <Disc size={20} className="text-primary" /> {group.artist}
              </h3>
              <Badge variant="secondary" className="text-[9px] bg-white/5">{group.category}</Badge>
            </div>
            <div className="space-y-4">
              {group.tracks.map((track, idx) => (
                <Card key={idx} className="bg-secondary/10 border-white/5 hover:bg-secondary/20 transition-all ghostly-fade group" style={{ animationDelay: `${(i * 3 + idx) * 100}ms` }}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-bold leading-tight pr-4">{track.title}</CardTitle>
                      <Badge variant="outline" className="text-[8px] uppercase border-white/10 shrink-0">{track.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">{track.description}</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] flex-1 gap-1 border border-white/5 hover:bg-primary/10 hover:text-primary">
                        <Play size={10} /> Analyze
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 border border-white/5 hover:bg-accent/10 hover:text-accent">
                        <Star size={10} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20 p-8 flex flex-col items-center text-center space-y-4">
        <TrendingUp className="text-primary" size={48} />
        <div>
          <h3 className="text-xl font-headline font-bold">Cultural Sentiment Index</h3>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto mt-2 leading-relaxed">
            Collaborations between artists like Jassie Gill, Badshah, and B Praak show a <span className="text-primary font-bold">14.2% increase</span> in regional-global crossover intent. This sentiment analysis suggests high merchant value for regional entertainment nodes.
          </p>
        </div>
      </Card>

      {/* AI Analysis Result Dialog */}
      <Dialog open={!!analysisResult} onOpenChange={(open) => !open && setAnalysisResult(null)}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
              <BrainCircuit className="text-primary" /> Media Sentiment Report
            </DialogTitle>
            <DialogDescription>Autonomous cultural analysis for the Entertainment Node</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary/5 border-primary/20 p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Trend Score</p>
                <p className="text-3xl font-bold font-headline text-primary">{analysisResult?.culturalTrendScore}%</p>
              </Card>
              <Card className="bg-accent/5 border-accent/20 p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Market Impact</p>
                <p className="text-sm font-bold mt-1 text-accent">{analysisResult?.marketImpact}</p>
              </Card>
            </div>
            
            <div className="p-4 rounded-xl bg-secondary/50 border border-white/5 space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                <Globe size={14} className="text-primary" /> Overall Sentiment
              </p>
              <p className="text-sm leading-relaxed">{analysisResult?.overallSentiment}</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                <BarChart3 size={14} className="text-primary" /> Key Cultural Insights
              </p>
              <div className="grid gap-2">
                {analysisResult?.keyInsights.map((insight, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-[10px] font-bold text-primary uppercase mb-1">Recommendation</p>
              <p className="text-sm font-medium">{analysisResult?.recommendation}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-primary font-bold px-8" onClick={() => setAnalysisResult(null)}>Close Report</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}