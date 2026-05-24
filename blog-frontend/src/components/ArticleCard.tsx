"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import { getTopicImage } from "@/utils/imageMapper";

export interface Article {
  id: string | number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  created_at?: string;
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

  const date = article.created_at
    ? new Date(article.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Card
      onClick={handleClick}
      style={style}
      className="card-enter group cursor-pointer border border-zinc-200/80 bg-white/60 backdrop-blur-md hover:bg-white hover:border-amber-500/40 hover:shadow-xl hover:shadow-zinc-950/5 transition-all duration-300 rounded-2xl flex flex-col h-full overflow-hidden"
    >
      {/* 1. Large Topic-Relevant Featured Image */}
      <div className="h-44 w-full bg-zinc-950 overflow-hidden relative shrink-0">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
          style={{ backgroundImage: `url('${getTopicImage(article.title, article.tags)}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
      </div>

      <CardHeader className="pb-2 pt-4">
        {/* Category Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {(article.tags || []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2
          className="text-lg font-bold leading-snug group-hover:text-amber-600 transition-colors text-zinc-900 line-clamp-2"
          style={{ fontFamily: "Lora, serif" }}
        >
          {article.title}
        </h2>
      </CardHeader>

      <CardContent className="flex-1 pb-4 pt-1">
        <p className="text-zinc-600 text-xs md:text-sm leading-relaxed line-clamp-3">
          {excerpt(article.content, 130)}
        </p>
      </CardContent>

      <CardFooter className="pt-3 pb-4 border-t border-zinc-100 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <div className="w-5.5 h-5.5 rounded-full bg-zinc-100 flex items-center justify-center text-[9px] font-bold text-zinc-700">
            {article.author ? article.author.charAt(0).toUpperCase() : "A"}
          </div>
          <span className="font-medium text-zinc-650">{article.author || "Anonymous"}</span>
        </div>
        {date && (
          <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
            <Clock className="w-3.5 h-3.5" />
            <span>4 min read</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
