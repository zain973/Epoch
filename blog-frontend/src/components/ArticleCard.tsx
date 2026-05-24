"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Clock, Heart, Eye, ArrowRight, User } from "lucide-react";
import { getTopicImage } from "@/utils/imageMapper";

export interface Article {
  id: string | number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  created_at?: string;
  likes?: number;
  views?: number;
}

interface ArticleCardProps {
  article: Article;
  style?: React.CSSProperties;
}

async function logInteraction(articleId: string | number) {
  try {
    await fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        article_id: articleId,
        interaction_type: "view",
      }),
    });
  } catch {
    // Silent fail
  }
}

function excerpt(text: string, maxLen = 120) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "…";
}

export default function ArticleCard({ article, style }: ArticleCardProps) {
  const router = useRouter();
  
  const handleClick = () => {
    logInteraction(article.id);
    router.push(`/article/${article.id}`);
  };

  // Deterministic engagements based on title hash to prevent SSR/hydration mismatch
  const hash = (article.title || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const likesCount = article.likes !== undefined ? article.likes : (hash % 135) + 15;
  const viewsCount = article.views !== undefined ? article.views : (hash % 720) + 115;
  
  // Custom reading time based on content length
  const wordCount = (article.content || "").split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 160));

  const dateStr = article.created_at
    ? new Date(article.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "May 24, 2026";

  return (
    <Card
      onClick={handleClick}
      style={style}
      className="card-enter group cursor-pointer border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-900 hover:border-amber-500/40 dark:hover:border-amber-500/30 hover:shadow-2xl hover:shadow-zinc-950/5 dark:hover:shadow-zinc-950/20 transition-all duration-500 rounded-3xl flex flex-col h-full overflow-hidden"
    >
      {/* 1. Large Topic-Relevant Featured Image with Luxury Hover-Zoom */}
      <div className="h-48 w-full bg-zinc-950 overflow-hidden relative shrink-0">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" 
          style={{ backgroundImage: `url('${getTopicImage(article.title, article.tags)}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60 dark:opacity-85" />
        
        {/* Floating Read Time Badge */}
        <div className="absolute top-4 right-4 bg-zinc-950/60 dark:bg-zinc-900/80 border border-white/10 backdrop-blur-md rounded-full px-2.5 py-1 text-[9px] font-bold text-white tracking-wider flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-amber-400" />
          <span>{readTime} MIN READ</span>
        </div>
      </div>

      {/* 2. Card Header and Badges */}
      <CardHeader className="pb-2 pt-5 px-6">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(article.tags || []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[8px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded bg-amber-500/5 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/10"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Serif Typography Headline */}
        <h2
          className="text-lg font-bold leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-zinc-900 dark:text-white line-clamp-2 font-serif"
          style={{ fontFamily: "Lora, serif" }}
        >
          {article.title}
        </h2>
      </CardHeader>

      {/* 3. Card Excerpt Content */}
      <CardContent className="flex-1 pb-4 pt-1 px-6">
        <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed line-clamp-3 font-light font-sans">
          {excerpt(article.content, 140)}
        </p>
      </CardContent>

      {/* 4. Down Actions / Card Footer */}
      <CardFooter className="pt-4 pb-5 px-6 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between gap-2 text-xs">
        
        {/* Author Avatar Info */}
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center text-[10px] font-bold text-zinc-700 dark:text-zinc-300 ring-2 ring-zinc-200/20 dark:ring-zinc-700/20 uppercase">
            {article.author ? article.author.charAt(0) : "A"}
          </div>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-[100px]">{article.author || "Anonymous"}</span>
        </div>

        {/* Engagements metrics details (Likes, Views, Date) */}
        <div className="flex items-center gap-3.5 text-zinc-400 dark:text-zinc-500 text-[10px] font-medium leading-none">
          <div className="flex items-center gap-1 hover:text-rose-500 transition-colors">
            <Heart className="w-3.5 h-3.5 text-rose-500/70" />
            <span>{likesCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-zinc-400/70" />
            <span>{viewsCount}</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="text-[9px] uppercase tracking-wider">{dateStr}</span>
        </div>

      </CardFooter>
    </Card>
  );
}
