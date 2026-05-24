"use client";

import { useEffect, useState } from "react";
import ArticleCard, { Article } from "./ArticleCard";
import { Loader2, Newspaper, X } from "lucide-react";

const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Getting Started with FastAPI & Next.js",
    content: "FastAPI is one of the fastest Python frameworks available today. Combined with Next.js on the frontend, you get a full-stack powerhouse. In this article we'll walk through setting up both, connecting them via a REST API, and deploying the stack.",
    author: "Yashwanth K",
    tags: ["fastapi", "nextjs", "python"],
    created_at: "2025-06-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Tailwind CSS Tips Every Developer Should Know",
    content: "Tailwind CSS has changed how we style web applications. Here are 10 underrated utilities that will level up your UI game — from custom arbitrary values to group-hover states and the clamp() trick for fluid typography.",
    author: "Priya M",
    tags: ["tailwind", "css", "frontend"],
    created_at: "2025-06-09T08:30:00Z",
  },
  {
    id: "3",
    title: "PostgreSQL vs MongoDB: Which Should You Pick in 2025?",
    content: "The database decision can make or break your project architecture. We compare PostgreSQL and MongoDB across five dimensions: query flexibility, horizontal scaling, schema design, ecosystem support, and cloud-managed pricing.",
    author: "Arjun R",
    tags: ["databases", "postgres", "mongodb"],
    created_at: "2025-06-08T14:00:00Z",
  },
  {
    id: "4",
    title: "Understanding React Server Components",
    content: "React Server Components (RSC) fundamentally change how we think about data fetching. No more useEffect waterfall — fetch directly in the component, on the server, with zero client JS overhead. Here's what you need to know.",
    author: "Sneha T",
    tags: ["react", "nextjs", "performance"],
    created_at: "2025-06-07T11:00:00Z",
  },
  {
    id: "5",
    title: "Building a REST API with Python FastAPI",
    content: "FastAPI's automatic OpenAPI docs, Pydantic validation, and async-first design make it a joy to work with. This guide walks you through creating a production-ready CRUD API with authentication middleware in under 100 lines of code.",
    author: "Yashwanth K",
    tags: ["fastapi", "python", "api"],
    created_at: "2025-06-06T09:00:00Z",
  },
  {
    id: "6",
    title: "Docker for Developers: A Practical Guide",
    content: "Containerisation is no longer optional for modern dev workflows. Learn how to Dockerize your FastAPI + Next.js app, wire them together with Docker Compose, and ship a reproducible environment your entire team can use instantly.",
    author: "Rahul V",
    tags: ["docker", "devops", "deployment"],
    created_at: "2025-06-05T16:00:00Z",
  },
];

export default function FeedContainer() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

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

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/articles/");
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        const fetched = Array.isArray(data) ? data : data.articles ?? [];
        if (fetched.length === 0) {
          const localStr = localStorage.getItem("EPOCH_LOCAL_ARTICLES");
          const localArticles = localStr ? JSON.parse(localStr) : [];
          setArticles([...localArticles, ...MOCK_ARTICLES]);
          setUsingMock(true);
        } else {
          setArticles(fetched);
          setUsingMock(false);
        }
      } catch {
        // Backend offline — show mock data + locally published articles so UI still works
        const localStr = localStorage.getItem("EPOCH_LOCAL_ARTICLES");
        const localArticles = localStr ? JSON.parse(localStr) : [];
        setArticles([...localArticles, ...MOCK_ARTICLES]);
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm">Loading articles…</p>
      </div>
    );
  }

  return (
    <div>
      {usingMock && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-accent/10 border border-accent/20 text-sm text-accent flex items-center gap-2">
          <span>⚡</span>
          <span>
            <strong>Demo mode</strong> — showing sample articles. Start your FastAPI backend at{" "}
            <code className="bg-accent/20 px-1 rounded text-xs">localhost:8000</code> to see real data.
          </span>
        </div>
      )}
      {!usingMock && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary flex items-center gap-2">
          <span>🚀</span>
          <span>Connected to live backend – displaying real articles.</span>
        </div>
      )}

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
          <Newspaper className="w-10 h-10 opacity-40" />
          <p className="font-medium">No articles yet</p>
          <p className="text-sm">Be the first to write something!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <ArticleCard
              key={article.id}
              article={article}
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      )}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 text-white border-t border-zinc-800 shadow-2xl py-3 px-6 flex items-center justify-between">
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
