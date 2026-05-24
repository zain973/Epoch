"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Eye, Heart, Share2, Sparkles, TrendingUp } from "lucide-react";
import TopNavbar from "@/components/TopNavbar";
import { getTopicImage } from "@/utils/imageMapper";

interface Article {
  id: string | number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  created_at?: string;
  views?: number;
  likes?: number;
  shares?: number;
  score?: number;
}

export default function TrendingPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("/api/articles/");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const list: Article[] = Array.isArray(data) ? data : data.articles ?? [];
        
        // Calculate mock popularity score for realistic dynamic trending
        const scoredList = list.map(a => {
          const numId = Number(a.id) || 1;
          const views = (numId * 17) % 150 + 45;
          const likes = (numId * 9) % 45 + 12;
          const shares = (numId * 3) % 15 + 4;
          const score = (views * 2) + (likes * 6) + (shares * 15);
          return { ...a, views, likes, shares, score };
        });

        // Sort descending by engagement score
        scoredList.sort((x, y) => (y.score ?? 0) - (x.score ?? 0));
        setArticles(scoredList);
      } catch {
        // Fallback in case backend is offline
        const mockScored = [
          {
            id: "7",
            title: "Echoes of Ajanta: The Spiritual Tapestry of Ancient Caves",
            content: "Deep within the basalt cliffs of Maharashtra lies the Ajanta cave complex, an ancient marvel of rock-cut architecture carved by Buddhist monks.",
            author: "Aravind S",
            tags: ["culture", "heritage", "history"],
            views: 450, likes: 120, shares: 35, score: 1800
          },
          {
            id: "9",
            title: "The Typography of Luxury: Crafting Editorial Identity",
            content: "Typography is the silent voice of design. In high-end editorial and premium branding, serif fonts evoke luxury, whereas modern sans-serifs communicate simplicity.",
            author: "Elena Rostova",
            tags: ["design", "branding", "style"],
            views: 390, likes: 98, shares: 25, score: 1500
          },
          {
            id: "8",
            title: "Weaving Time: The Legacy of Varanasi's Silk Artisans",
            content: "Varanasi's silk weavers use handloom shuttles to weave gold and silver threads into highly intricate Banarasi silk sarees, preserving patterns across generations.",
            author: "Meera Iyer",
            tags: ["culture", "heritage", "storytelling"],
            views: 310, likes: 88, shares: 18, score: 1200
          }
        ];
        setArticles(mockScored);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans">
      <TopNavbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Section Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>High Engagement Logs</span>
          </div>
          
          <h1 
            className="text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-white" 
            style={{ fontFamily: "Lora, serif" }}
          >
            Trending Narratives
          </h1>
          
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-lg max-w-2xl font-light">
            Discover the creative updates, folklore essays, and design case studies that are capturing the imaginations of our global community.
          </p>
        </div>

        {/* Dynamic Trending List */}
        {loading ? (
          <div className="py-24 text-center text-zinc-400 text-sm font-light animate-pulse">
            Calculating engagement scores...
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((art, idx) => (
              <article 
                key={art.id}
                onClick={() => router.push(`/article/${art.id}`)}
                className="bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-amber-500/30 dark:hover:border-amber-500/20 transition-all duration-500 cursor-pointer group relative flex flex-col md:flex-row gap-6 p-6 items-center shadow-md"
              >
                
                {/* Background artistic mesh glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-rose-600/5 dark:from-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Number Indicator */}
                <div 
                  className="absolute top-4 left-6 md:static shrink-0 text-5xl md:text-6xl font-black tracking-tighter text-zinc-100 dark:text-zinc-800/30 group-hover:text-amber-500/20 leading-none w-14 transition-colors font-serif z-10"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  {idx < 9 ? `0${idx + 1}` : idx + 1}
                </div>

                {/* Cover cover banner */}
                <div className="w-full md:w-56 h-36 rounded-2xl bg-zinc-950 overflow-hidden relative shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url('${getTopicImage(art.title, art.tags)}')` }}
                  />
                  <div className="absolute inset-0 bg-black/25 dark:bg-black/40" />
                </div>

                {/* Excerpt Details */}
                <div className="flex-1 space-y-3 pt-8 md:pt-0 z-10 font-sans">
                  <div className="flex items-center gap-2">
                    {art.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[8px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-500/5 dark:bg-amber-500/10 px-2.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <h3 
                    className="text-xl font-bold leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-zinc-950 dark:text-white font-serif" 
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    {art.title}
                  </h3>

                  <p className="text-zinc-550 dark:text-zinc-400 text-xs md:text-sm line-clamp-2 leading-relaxed font-light font-sans">
                    {art.content}
                  </p>

                  {/* Analytics Bar */}
                  <div className="flex flex-wrap items-center gap-5 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-zinc-700 dark:text-zinc-300 font-bold">{art.author}</span>
                    <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" /> {art.views} views</span>
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500/70" /> {art.likes} likes</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5 text-zinc-350 dark:text-zinc-750" /> {art.shares} shares</span>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/50 dark:border-zinc-800/50 py-8 text-center text-xs text-zinc-450 dark:text-zinc-550 mt-12 bg-white dark:bg-zinc-950 transition-colors">
        &copy; {new Date().getFullYear()} Epoch Creative. All rights reserved. Trending Narratives Portal.
      </footer>
    </div>
  );
}
