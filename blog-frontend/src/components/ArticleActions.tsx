"use client";

import { useState } from "react";
import { Heart, Bookmark, Twitter, Linkedin, Link2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ArticleActionsProps {
  articleId: string | number;
  articleTitle: string;
}

export default function ArticleActions({ articleId, articleTitle }: ArticleActionsProps) {
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 20) + 5);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    toast({
      title: liked ? "Removed like 💔" : "Liked article! ❤️",
      description: liked ? "Removed your appreciation." : "Thank you for supporting this narrative!",
    });
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast({
      title: bookmarked ? "Removed bookmark 🔖" : "Bookmarked! 🔖",
      description: bookmarked ? "Removed from your reading list." : "Added to your personal reading list.",
    });
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied! 🔗",
        description: "Copied article link to clipboard.",
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-t border-b border-zinc-200/80 dark:border-zinc-800 my-8">
      {/* Likes and Bookmarks */}
      <div className="flex items-center gap-4">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-xs font-semibold ${
            liked 
              ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900" 
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
          }`}
        >
          <Heart className={`w-4.5 h-4.5 transition-transform active:scale-125 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
          <span>{likeCount} likes</span>
        </button>

        <button 
          onClick={handleBookmark}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-xs font-semibold ${
            bookmarked 
              ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900" 
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
          }`}
        >
          <Bookmark className={`w-4.5 h-4.5 transition-transform active:scale-125 ${bookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
          <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
        </button>
      </div>

      {/* Share Actions */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-2 hidden sm:inline">Share:</span>
        <button 
          onClick={handleCopyLink}
          className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 text-zinc-500 transition-colors"
          title="Copy Link"
        >
          <Link2 className="w-4 h-4" />
        </button>
        <a 
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 text-zinc-500 transition-colors"
          title="Share on Twitter/X"
        >
          <Twitter className="w-4 h-4" />
        </a>
        <a 
          href={`https://www.linkedin.com/shareArticle?title=${encodeURIComponent(articleTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 text-zinc-500 transition-colors"
          title="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
