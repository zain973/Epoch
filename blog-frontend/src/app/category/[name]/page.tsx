"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { BookOpen, Clock, Tag } from "lucide-react";
import TopNavbar from "@/components/TopNavbar";
import { getTopicImage } from "@/utils/imageMapper";

const BACKEND_URL = "http://localhost:8000";

interface Article {
  id: string | number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  created_at?: string;
}

export default function CategoryPage({ params }: { params: { name: string } }) {
  const router = useRouter();
  const categoryName = params.name.toLowerCase();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Categories validation list
  const validCategories = ["culture", "art", "heritage", "design", "architecture", "photography", "branding", "fastapi", "nextjs", "python", "tailwind", "databases", "docker", "performance"];
  
  if (!validCategories.includes(categoryName)) {
    notFound();
  }

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      try {
        const res = await fetch("/api/articles/");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const list: Article[] = Array.isArray(data) ? data : data.articles ?? [];
        
        // Filter by category tag overlap
        const filtered = list.filter(art => 
          art.tags?.some(tag => tag.toLowerCase() === categoryName)
        );
        setArticles(filtered);
      } catch {
        // Fallback offline mock data matching tags
        const mockDb = [
          {
            id: "7",
            title: "Echoes of Ajanta: The Spiritual Tapestry of Ancient Caves",
            content: "Deep within the Maharashtra basalt cliffs lie ancient rock sanctuaries painted with devotions.",
            author: "Aravind S",
            tags: ["culture", "heritage", "art"]
          },
          {
            id: "9",
            title: "The Typography of Luxury: Crafting Editorial Identity",
            content: "Typography carries the voice of design, blending historical serif Garamonds with modern sans-serifs.",
            author: "Elena Rostova",
            tags: ["design", "branding", "style"]
          }
        ];
        const filteredMock = mockDb.filter(art => 
          art.tags?.some(tag => tag.toLowerCase() === categoryName)
        );
        setArticles(filteredMock);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryArticles();
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 font-sans">
      <TopNavbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Category Header */}
        <div className="mb-12 border-b border-zinc-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-600 font-bold uppercase tracking-widest text-xs mb-2">
              <Tag className="w-3.5 h-3.5" />
              <span>Genre Collection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black capitalize tracking-tight font-serif" style={{ fontFamily: "Lora, serif" }}>
              {categoryName}
            </h1>
            <p className="text-zinc-550 text-sm mt-1 max-w-xl font-light">
              Browsing curated research logs, strategic essays, and visual portfolios categorized under our {categoryName} genre.
            </p>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-700 font-bold text-xs">
            {articles.length} {articles.length === 1 ? "article" : "articles"} found
          </span>
        </div>

        {/* Dynamic Category Articles Grid */}
        {loading ? (
          <div className="py-24 text-center text-zinc-400 text-sm">
            Filtering database shelves...
          </div>
        ) : articles.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <BookOpen className="w-12 h-12 mx-auto text-zinc-300" />
            <h3 className="text-xl font-bold">No articles cataloged under {categoryName} yet</h3>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">
              Be the first to publish a creative update in the {categoryName} shelf!
            </p>
            <div className="pt-2">
              <Link href="/write" className="px-5 py-2.5 rounded-full bg-zinc-950 text-white font-semibold text-xs shadow-md">
                Publish a Post &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(art => (
              <article 
                key={art.id}
                onClick={() => router.push(`/article/${art.id}`)}
                className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full"
              >
                {/* Dynamic cover matched cover cover */}
                <div className="h-44 bg-zinc-950 overflow-hidden relative shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${getTopicImage(art.title, art.tags)}')` }}
                  />
                  <div className="absolute inset-0 bg-black/35" />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {art.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 bg-amber-500/5 text-amber-700 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-bold text-base leading-snug group-hover:text-amber-600 transition-colors text-zinc-900 line-clamp-2" style={{ fontFamily: "Lora, serif" }}>
                      {art.title}
                    </h3>

                    <p className="text-zinc-500 text-xs line-clamp-3 leading-relaxed font-light">
                      {art.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-[10px] text-zinc-400">
                    <span className="font-semibold text-zinc-600">{art.author}</span>
                    <span>4 min read</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-450 mt-12 bg-white">
        &copy; {new Date().getFullYear()} Epoch Creative. All rights reserved. Dynamic Genre Shelves.
      </footer>
    </div>
  );
}
