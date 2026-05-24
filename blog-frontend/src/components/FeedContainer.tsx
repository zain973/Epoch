"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ArticleCard, { Article } from "./ArticleCard";
import { Loader2, Newspaper, X, SlidersHorizontal, Heart, Eye, Calendar, Sparkles, Search } from "lucide-react";

const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Getting Started with FastAPI & Next.js",
    content: "FastAPI is one of the fastest Python frameworks available today. Combined with Next.js on the frontend, you get a full-stack powerhouse. In this article we'll walk through setting up both, connecting them via a REST API, and deploying the stack.",
    author: "Yashwanth K",
    tags: ["fastapi", "nextjs", "python", "technology"],
    created_at: "2026-05-20T10:00:00Z",
    likes: 145,
    views: 450
  },
  {
    id: "2",
    title: "Tailwind CSS Tips Every Developer Should Know",
    content: "Tailwind CSS has changed how we style web applications. Here are 10 underrated utilities that will level up your UI game — from custom arbitrary values to group-hover states and the clamp() trick for fluid typography.",
    author: "Priya M",
    tags: ["tailwind", "css", "frontend", "design"],
    created_at: "2026-05-18T08:30:00Z",
    likes: 98,
    views: 320
  },
  {
    id: "3",
    title: "PostgreSQL vs MongoDB: Which Should You Pick in 2025?",
    content: "The database decision can make or break your project architecture. We compare PostgreSQL and MongoDB across five dimensions: query flexibility, horizontal scaling, schema design, ecosystem support, and cloud-managed pricing.",
    author: "Arjun R",
    tags: ["databases", "postgres", "mongodb", "technology"],
    created_at: "2026-05-16T14:00:00Z",
    likes: 210,
    views: 890
  },
  {
    id: "4",
    title: "Understanding React Server Components",
    content: "React Server Components (RSC) fundamentally change how we think about data fetching. No more useEffect waterfall — fetch directly in the component, on the server, with zero client JS overhead. Here's what you need to know.",
    author: "Sneha T",
    tags: ["react", "nextjs", "performance", "technology"],
    created_at: "2026-05-14T11:00:00Z",
    likes: 312,
    views: 1140
  },
  {
    id: "5",
    title: "Building a REST API with Python FastAPI",
    content: "FastAPI's automatic OpenAPI docs, Pydantic validation, and async-first design make it a joy to work with. This guide walks you through creating a production-ready CRUD API with authentication middleware in under 100 lines of code.",
    author: "Yashwanth K",
    tags: ["fastapi", "python", "api", "technology"],
    created_at: "2026-05-12T09:00:00Z",
    likes: 120,
    views: 420
  },
  {
    id: "6",
    title: "Docker for Developers: A Practical Guide",
    content: "Containerisation is no longer optional for modern dev workflows. Learn how to Dockerize your FastAPI + Next.js app, wire them together with Docker Compose, and ship a reproducible environment your entire team can use instantly.",
    author: "Rahul V",
    tags: ["docker", "devops", "deployment", "technology"],
    created_at: "2026-05-10T16:00:00Z",
    likes: 88,
    views: 310
  },
  {
    id: "7",
    title: "Echoes of Ajanta: The Spiritual Tapestry of Ancient Caves",
    content: "Deep within the basalt cliffs of Maharashtra lies the Ajanta cave complex, an ancient marvel of rock-cut architecture carved by Buddhist monks.",
    author: "Aravind S",
    tags: ["culture", "heritage", "history"],
    created_at: "2026-05-08T12:00:00Z",
    likes: 240,
    views: 780
  },
  {
    id: "8",
    title: "Weaving Time: The Legacy of Varanasi's Silk Artisans",
    content: "Varanasi's silk weavers use handloom shuttles to weave gold and silver threads into highly intricate Banarasi silk sarees, preserving patterns across generations.",
    author: "Meera Iyer",
    tags: ["culture", "heritage", "storytelling"],
    created_at: "2026-05-06T15:00:00Z",
    likes: 180,
    views: 650
  },
  {
    id: "9",
    title: "The Typography of Luxury: Crafting Editorial Identity",
    content: "Typography is the silent voice of design. In high-end editorial and premium branding, serif fonts evoke luxury, whereas modern sans-serifs communicate simplicity.",
    author: "Elena Rostova",
    tags: ["design", "branding", "style"],
    created_at: "2026-05-04T10:00:00Z",
    likes: 195,
    views: 590
  }
];

type SortOption = "latest" | "likes" | "views";

export default function FeedContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  
  // Real-time search values matching navbar redirects
  const [localSearchVal, setLocalSearchVal] = useState(searchQuery);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSort, setActiveSort] = useState<SortOption>("latest");

  const categoriesList = ["all", "culture", "art", "heritage", "design", "photography", "architecture", "technology", "branding"];

  useEffect(() => {
    const closed = localStorage.getItem("EPOCH_BANNER_CLOSED");
    if (!closed) {
      setShowBanner(true);
    }
  }, []);

  const closeBanner = () => {
    localStorage.setItem("EPOCH_BANNER_CLOSED", "true");
    setShowBanner(false);
  };

  // 1. Fetch articles from SQLite DB
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/articles/");
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        const fetched = Array.isArray(data) ? data : data.articles ?? [];
        if (fetched.length === 0) {
          loadOfflineFallback();
        } else {
          setArticles(fetched);
          setUsingMock(false);
        }
      } catch {
        loadOfflineFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadOfflineFallback = () => {
      const localStr = localStorage.getItem("EPOCH_LOCAL_ARTICLES");
      const localArticles = localStr ? JSON.parse(localStr) : [];
      setArticles([...localArticles, ...MOCK_ARTICLES]);
      setUsingMock(true);
    };

    fetchArticles();
  }, []);

  // 2. Sync navbar search query redirects with our local search inputs
  useEffect(() => {
    setLocalSearchVal(searchQuery);
  }, [searchQuery]);

  // 3. Perform Filtering & Sorting client-side
  useEffect(() => {
    let result = [...articles];

    // Filter by Active Search
    if (localSearchVal.trim()) {
      const query = localSearchVal.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query) ||
          a.author.toLowerCase().includes(query) ||
          a.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Filter by Category Pill
    if (activeCategory !== "all") {
      result = result.filter((a) =>
        a.tags?.some((t) => t.toLowerCase() === activeCategory.toLowerCase())
      );
    }

    // Sort by Selected Criteria
    result.sort((a, b) => {
      const hashA = (a.title || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const hashB = (b.title || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      const likesA = a.likes !== undefined ? a.likes : (hashA % 135) + 15;
      const likesB = b.likes !== undefined ? b.likes : (hashB % 135) + 15;
      
      const viewsA = a.views !== undefined ? a.views : (hashA % 720) + 115;
      const viewsB = b.views !== undefined ? b.views : (hashB % 720) + 115;

      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

      if (activeSort === "likes") {
        return likesB - likesA;
      }
      if (activeSort === "views") {
        return viewsB - viewsA;
      }
      // Latest (default)
      return dateB - dateA || Number(b.id) - Number(a.id);
    });

    setFilteredArticles(result);
  }, [articles, localSearchVal, activeCategory, activeSort]);

  const clearSearch = () => {
    setLocalSearchVal("");
    router.push("/feed");
  };

  // Calculate matching stats
  const averageReadTime = Math.max(
    1,
    Math.ceil(
      filteredArticles.reduce((acc, a) => {
        const words = (a.content || "").split(/\s+/).length;
        return acc + Math.max(1, Math.ceil(words / 160));
      }, 0) / (filteredArticles.length || 1)
    )
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-zinc-455">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-sm font-light">Assembling the library...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* Dynamic Connection Status Notification */}
      {usingMock ? (
        <div className="px-4 py-3 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 text-xs text-amber-700 dark:text-amber-400 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>
              <strong>Editorial Archives</strong> — loaded 20 local culture and design diaries. FastAPI local host is offline.
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-450 dark:text-zinc-500">Offline Fallback</span>
        </div>
      ) : (
        <div className="px-4 py-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connected to live SQLite database nodes. Accessing 20 custom seeded articles.</span>
        </div>
      )}

      {/* Real-time Inline Explore Local Search Bar */}
      <div className="relative max-w-xl mx-auto group">
        <Search className="w-4.5 h-4.5 absolute left-4.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-amber-500 transition-colors pointer-events-none" />
        <input 
          type="text"
          placeholder="Filter stories by keywords, authors, or tags..."
          value={localSearchVal}
          onChange={(e) => setLocalSearchVal(e.target.value)}
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 focus:border-amber-500 dark:focus:border-amber-500 rounded-2xl py-3 pl-12 pr-10 text-sm text-zinc-900 dark:text-white placeholder-zinc-450 dark:placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-amber-500/5 transition-all duration-300 shadow-sm"
        />
        {localSearchVal && (
          <button 
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-850 dark:hover:text-white p-1"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Explore Page Details Bar: Filter pills, sorting dropdowns, and stats */}
      <div className="space-y-4">
        
        {/* Category Pill Clouds Tag Cloud */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/40 dark:border-zinc-800/40 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>Filter Categories</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-500/10"
                    : "bg-white/40 dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-650 dark:text-zinc-400"
                }`}
              >
                {cat === "all" ? "All Shelves" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sorting Selector and Stats bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-light text-zinc-500 dark:text-zinc-400">
          
          {/* Stats metrics readout */}
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{filteredArticles.length}</span>
              <span>journals found</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-800">|</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{averageReadTime} min</span>
              <span>average study duration</span>
            </div>
            {activeCategory !== "all" && (
              <>
                <span className="text-zinc-300 dark:text-zinc-800">|</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/5 text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider text-[9px]">
                  Tag: #{activeCategory}
                </span>
              </>
            )}
          </div>

          {/* Interactive Sorting Panel dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500">Sort By:</span>
            <div className="flex rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 p-0.5 shadow-inner">
              <button
                onClick={() => setActiveSort("latest")}
                className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-colors ${
                  activeSort === "latest"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setActiveSort("likes")}
                className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-colors ${
                  activeSort === "likes"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                Loved
              </button>
              <button
                onClick={() => setActiveSort("views")}
                className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-colors ${
                  activeSort === "views"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                Popular
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Active Search matching banner and details */}
      {localSearchVal.trim() && (
        <div className="flex items-center justify-between px-6 py-4 rounded-3xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800/40 shadow-inner animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-light text-zinc-650 dark:text-zinc-300">
              Showing <strong className="font-semibold text-zinc-900 dark:text-white">{filteredArticles.length}</strong> matching entries for query:{" "}
              <code className="bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded text-amber-600 dark:text-amber-400 font-bold">
                "{localSearchVal}"
              </code>
            </span>
          </div>
          <button
            onClick={clearSearch}
            className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-850 dark:hover:text-white transition-colors"
            title="Clear active query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filtered article cards grid */}
      {filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-400 dark:text-zinc-500 text-center">
          <Newspaper className="w-12 h-12 opacity-30 text-amber-600 animate-pulse" />
          <div className="space-y-1">
            <p className="font-bold text-zinc-855 dark:text-zinc-200">No journals found</p>
            <p className="text-xs text-zinc-450 dark:text-zinc-500 max-w-sm font-light">
              Try adjusting your category pill choices, clear the active search filter query, or write a new custom study!
            </p>
          </div>
          {localSearchVal.trim() && (
            <button
              onClick={clearSearch}
              className="mt-2 rounded-full border border-zinc-200/80 dark:border-zinc-800 px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-850"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, i) => (
            <ArticleCard
              key={article.id}
              article={article}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      )}

      {/* Floating Announcement banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 text-white border-t border-zinc-800 shadow-2xl py-3.5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs md:text-sm">
            <span className="text-amber-500 animate-pulse">❤️</span>
            <span className="font-light tracking-wide text-zinc-300">
              The <strong className="font-semibold text-white">Epoch Creative</strong> workspace is active. Publish your own stories, essays, or design case studies now!
            </span>
            <a 
              href="/write" 
              className="text-amber-400 font-semibold hover:text-amber-300 hover:underline transition-colors shrink-0 flex items-center gap-1 ml-2"
            >
              Participate now &rarr;
            </a>
          </div>
          <button 
            onClick={closeBanner}
            className="text-zinc-500 hover:text-white transition-colors p-1"
            aria-label="Close announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
