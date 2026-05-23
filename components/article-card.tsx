"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar } from "lucide-react";
import { ClassicalFeedArticle } from "@/types/blog";

interface ArticleCardProps {
  article: ClassicalFeedArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  // Gracefully handle dynamic fallback values if database fields are empty
  const formattedDate = article.published_at 
    ? new Date(article.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : "Recently";

  // Temporary mock tags if Feature 6 relationship schemas haven't been linked to your query
  const displayTags = article.tags || ["Engineering", "Development"];

  return (
    <Link href={`/articles/${article.slug}`} className="block group">
      <Card className="h-full border border-muted transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-md flex flex-col justify-between">
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {displayTags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-[11px] font-normal tracking-wide">
                #{tag.toLowerCase()}
              </Badge>
            ))}
          </div>
          <CardTitle className="line-clamp-2 text-xl leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
            {article.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {article.content}
          </p>
        </CardContent>
        
        <CardFooter className="text-xs text-muted-foreground border-t pt-3 mt-auto flex justify-between items-center bg-muted/20 rounded-b-lg">
          <span className="font-semibold text-foreground/80">By {article.author_name}</span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {article.view_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
