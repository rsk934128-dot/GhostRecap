
"use client";

import { Music, Play, Disc, Star, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function MediaIntelligenceHub() {
  const [mounted, setMounted] = useState(false);

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
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
          <Sparkles size={16} /> Run Sentiment Analysis
        </Button>
      </header>

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
    </div>
  );
}
