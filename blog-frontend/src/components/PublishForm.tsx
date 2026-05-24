"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Send, X, Loader2, Sparkles, Tag, BookOpen, Feather } from "lucide-react";

export default function PublishForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState(user?.name || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addTag = () => {
    const cleaned = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (cleaned && !tags.includes(cleaned)) {
      setTags((p) => [...p, cleaned]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags((p) => p.filter((t) => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please supply both a title and article body.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);

    const payload = {
      title: title.trim(),
      content: content.trim(),
      author: author.trim() || user?.name || "Anonymous",
      tags,
    };

    let success = false;
    let modeMsg = "";

    try {
      // 1. Try posting to the live FastAPI backend
      const res = await fetch("/api/articles/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        success = true;
        modeMsg = "Published directly to the live backend database! 🚀";
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Error ${res.status}`);
      }
    } catch (err) {
      // 2. Offline Fallback: Save to localStorage so it functions perfectly in Demo Mode
      const localStr = localStorage.getItem("EPOCH_LOCAL_ARTICLES");
      const localArticles = localStr ? JSON.parse(localStr) : [];
      
      const newArticle = {
        id: `local-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        author: author.trim() || user?.name || "Anonymous",
        tags,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem("EPOCH_LOCAL_ARTICLES", JSON.stringify([newArticle, ...localArticles]));
      success = true;
      modeMsg = "Demo mode — Saved locally in browser storage! 💾";
    }

    setSubmitting(false);

    if (success) {
      toast({
        title: "Published! 🎉",
        description: modeMsg,
      });
      // Delay navigation slightly so they see the success toast
      setTimeout(() => router.push("/feed"), 1500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Decorative Tag */}
      <div className="flex items-center gap-2 text-primary text-xs font-semibold tracking-widest uppercase">
        <Feather className="w-3.5 h-3.5" />
        <span>Creative Workspace</span>
      </div>

      <div className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-zinc-700 font-semibold text-sm flex items-center gap-1.5">
            Article Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Introduce your concept or narrative…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg h-12 px-4 border-zinc-200 bg-white/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all rounded-xl text-zinc-900"
          />
        </div>

        {/* Author Input */}
        <div className="space-y-2">
          <Label htmlFor="author" className="text-zinc-700 font-semibold text-sm">
            Creator / Pen Name
          </Label>
          <Input
            id="author"
            placeholder="Your name or organization"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="h-11 px-4 border-zinc-200 bg-white/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all rounded-xl text-zinc-900"
          />
        </div>

        {/* Tag Creator */}
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-zinc-700 font-semibold text-sm flex items-center gap-1.5">
            Tags / Categories
          </Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="e.g. film, strategy, design — press Enter to add"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="h-11 px-4 border-zinc-200 bg-white/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all rounded-xl text-zinc-900"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addTag}
              className="h-11 px-5 border-zinc-200 hover:bg-zinc-50 rounded-xl"
            >
              Add
            </Button>
          </div>

          {/* Render Pills */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 animate-fadeIn">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive transition-colors ml-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Body Editor */}
        <div className="space-y-2">
          <Label htmlFor="content" className="text-zinc-700 font-semibold text-sm flex items-center gap-1.5">
            Article Body <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="content"
            placeholder="Unleash your perspective. Supports multi-line paragraphs and spacing…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] text-base leading-relaxed p-4 border-zinc-200 bg-white/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all rounded-xl text-zinc-900 resize-y"
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {Math.max(0, Math.round(content.split(/\s+/).filter(Boolean).length))} words
            </span>
            <span>{content.length} characters</span>
          </div>
        </div>

        {/* Submit Action */}
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full h-12 text-base font-semibold rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all hover:scale-[1.01] shadow-md shadow-zinc-950/10 active:scale-100 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Publishing to Hub…
            </>
          ) : (
            <>
              <Send className="w-4.5 h-4.5" />
              Publish Article
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
