"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Calendar, ArrowRight, BookOpen } from "lucide-react";
import TopNavbar from "@/components/TopNavbar";
import { getTopicImage } from "@/utils/imageMapper";
import { Button } from "@/components/ui/button";

interface Article {
  id: string | number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  created_at?: string;
}

export default function LatestPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/articles/");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const list: Article[] = Array.isArray(data) ? data : data.articles ?? [];
        
        // Sort chronologically (newest first based on ID or created_at)
        list.sort((x, y) => Number(y.id) - Number(x.id));
        setArticles(list);
      } catch {
        const mockFallback = [
          {
            id: "20",
            title: "Visual Poetry: Shifting Colors and Textures in Post-Modern Art",
            content: "Post-modern art strips away literal objects, exploring how pure texture and color gradients elicit emotional responses using tactile organic material layers.",
            author: "Sophia Loren",
            tags: ["art", "design", "style"],
            created_at: "2026-05-24T12:00:00Z"
          },
          {
            id: "19",
            title: "Unearthing the Past: Lessons from Indus Valley Heritage",
            content: "The ancient cities of Mohenjo-daro and Harappa featured structured grid patterns and underground drainage, showing civic planning layouts that inspire modern architects.",
            author: "Dr. Amit Sharma",
            tags: ["history", "heritage", "culture"],
            created_at: "2026-05-24T10:00:00Z"
          }
        ];
        setArticles(mockFallback);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  const latestFeatured = articles[0];
  const gridArticles = articles.slice(1);

  // Custom reading time based on content length
  const getReadTime = (content: string) => {
    const wordCount = (content || "").split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 160));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans">
      <TopNavbar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Section Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Chronological Updates</span>
          </div>
          
          <h1 
            className="text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-white font-serif" 
            style={{ fontFamily: "Lora, serif" }}
          >
            Latest Narrative Updates
          </h1>
          
          <p className="text-zinc-650 dark:text-zinc-400 mt-2 text-lg max-w-2xl font-light">
            Stay up to date with fresh stories, creative announcements, developer tutorials, and cultural chronicles uploaded in real time.
          </p>
        </div>

        {loading ? (
          <div className="py-24 text-center text-zinc-400 text-sm font-light animate-pulse">
            Fetching fresh logs from database...
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* LATEST FEATURED POST AT TOP */}
            {latestFeatured && (
              <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200/80 dark:border-zinc-800/60 rounded-[32px] overflow-hidden shadow-xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-center relative">
                
                {/* Visual Cover cover banner */}
                <div 
                  onClick={() => router.push(`/article/${latestFeatured.id}`)}
                  className="w-full lg:w-1/2 h-72 md:h-96 rounded-2xl bg-zinc-950 overflow-hidden relative shrink-0 cursor-pointer group"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-103 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url('${getTopicImage(latestFeatured.title, latestFeatured.tags)}')` }}
                  />
                  <div className="absolute inset-0 bg-black/25 dark:bg-black/40" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1 rounded-full bg-amber-600 text-white font-bold text-[9px] uppercase tracking-widest shadow-md">
                      Freshly Released
                    </span>
                  </div>
                </div>

                {/* Meta details */}
                <div className="flex-1 space-y-5 font-sans">
                  <div className="flex gap-2">
                    {latestFeatured.tags?.map(t => (
                      <span key={t} className="text-[9px] font-extrabold tracking-widest uppercase text-amber-700 dark:text-amber-400">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <h2 
                    onClick={() => router.push(`/article/${latestFeatured.id}`)}
                    className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer font-serif text-zinc-950 dark:text-white"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    {latestFeatured.title}
                  </h2>

                  <p className="text-zinc-550 dark:text-zinc-400 text-sm leading-relaxed font-light">
                    {latestFeatured.content.slice(0, 240)}…
                  </p>

                  <div className="flex items-center gap-6 pt-2 text-xs text-zinc-400 dark:text-zinc-500">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center font-bold text-amber-800 dark:text-amber-400 text-[10px]">
                        {latestFeatured.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{latestFeatured.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>Newest Upload</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href={`/article/${latestFeatured.id}`}>
                      <Button className="rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-7 h-11 text-xs font-bold tracking-widest uppercase hover:opacity-90 flex items-center gap-1.5 shadow-md">
                        Read Story <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

              </div>
            )}

            {/* RESPONSIVE BLOG GRID */}
            <div className="space-y-6 pt-4">
              <h3 
                className="text-2xl font-bold tracking-tight border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4 text-zinc-950 dark:text-white font-serif" 
                style={{ fontFamily: "Lora, serif" }}
              >
                Recent Chronological Grids
              </h3>

              {gridArticles.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 text-sm font-light">
                  No other articles in database feed yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gridArticles.map(a => (
                    <article
                      key={a.id}
                      onClick={() => router.push(`/article/${a.id}`)}
                      className="bg-white dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/60 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-amber-500/30 dark:hover:border-amber-500/20 transition-all duration-500 cursor-pointer group flex flex-col h-full shadow-sm"
                    >
                      <div className="h-44 bg-zinc-950 overflow-hidden relative shrink-0">
                        <div 
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                          style={{ backgroundImage: `url('${getTopicImage(a.title, a.tags)}')` }}
                        />
                        <div className="absolute inset-0 bg-black/25 dark:bg-black/40" />
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 font-sans">
                        <div className="space-y-2.5">
                          <div className="flex flex-wrap gap-1">
                            {a.tags?.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[8px] font-extrabold tracking-widest uppercase px-2 py-0.5 bg-amber-500/5 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <h4 
                            className="font-bold text-base md:text-lg leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-zinc-900 dark:text-white font-serif line-clamp-2" 
                            style={{ fontFamily: "Lora, serif" }}
                          >
                            {a.title}
                          </h4>

                          <p className="text-zinc-550 dark:text-zinc-400 text-xs leading-relaxed line-clamp-3 font-light">
                            {a.content}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/40 text-[10px] text-zinc-450 dark:text-zinc-500">
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">{a.author}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> {getReadTime(a.content)} min read</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/50 dark:border-zinc-800/50 py-8 text-center text-xs text-zinc-450 dark:text-zinc-555 mt-12 bg-white dark:bg-zinc-950 transition-colors">
        &copy; {new Date().getFullYear()} Epoch Creative. All rights reserved. Latest Stories Stream.
      </footer>
    </div>
  );
}
