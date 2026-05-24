import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, User, Clock, Tag, Eye, ChevronLeft, ChevronRight, MessageSquare, ArrowRight } from "lucide-react";
import TopNavbar from "@/components/TopNavbar";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import ArticleActions from "@/components/ArticleActions";
import { getTopicImage } from "@/utils/imageMapper";

const BACKEND_URL = "http://localhost:8000";

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  created_at: string;
}

interface InteractionStats {
  article_id: number;
  total: number;
  counts: {
    view?: number;
    [key: string]: any;
  };
}

/**
 * Fetch interaction statistics for an article.
 */
async function fetchInteractionStats(id: string | number): Promise<InteractionStats | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/interactions/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Generate SEO metadata for the article page.
 */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/articles/${params.id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error();
    const article: Article = await res.json();
    return {
      title: `${article.title} — Epoch Creative`,
      description: article.content ? article.content.slice(0, 150) : "",
    };
  } catch {
    return { title: "Article not found — Epoch Creative" };
  }
}

/**
 * Clean block parsing to support markdown-like layouts on the server side.
 */
function renderArticleContent(content: string) {
  const blocks = content.split(/\n\s*\n/); // split by double newlines

  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // 1. Headers: # Header or ## Header
    if (trimmed.startsWith("##")) {
      return (
        <h3 key={idx} className="text-2xl font-bold tracking-tight text-zinc-900 mt-8 mb-4 font-serif" style={{ fontFamily: "Lora, serif" }}>
          {trimmed.replace(/^##\s*/, "")}
        </h3>
      );
    }
    if (trimmed.startsWith("#")) {
      return (
        <h2 key={idx} className="text-3xl font-extrabold tracking-tight text-zinc-900 mt-10 mb-4 font-serif" style={{ fontFamily: "Lora, serif" }}>
          {trimmed.replace(/^#\s*/, "")}
        </h2>
      );
    }

    // 2. Blockquotes: > quote
    if (trimmed.startsWith(">")) {
      return (
        <blockquote key={idx} className="border-l-4 border-amber-500 pl-6 italic text-zinc-700 dark:text-zinc-300 my-6 text-lg font-light leading-relaxed">
          {trimmed.replace(/^>\s*/, "")}
        </blockquote>
      );
    }

    // 3. Code blocks: ``` code ```
    if (trimmed.startsWith("```")) {
      const code = trimmed.replace(/^```[a-zA-Z]*\n?|```$/g, "");
      return (
        <pre key={idx} className="bg-zinc-900 text-zinc-100 p-5 rounded-2xl my-6 text-sm font-mono overflow-x-auto shadow-inner leading-relaxed border border-zinc-800">
          <code>{code}</code>
        </pre>
      );
    }

    // 4. Bulleted Lists
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      const items = trimmed.split(/\n[*-\s]+/);
      return (
        <ul key={idx} className="list-disc pl-6 my-6 space-y-2.5 text-zinc-700 dark:text-zinc-300 font-light">
          {items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item.replace(/^[*-\s]+/, "")}
            </li>
          ))}
        </ul>
      );
    }

    // 5. Standard Paragraphs
    return (
      <p key={idx} className="text-zinc-850 dark:text-zinc-300 text-lg leading-relaxed mb-6 font-light tracking-wide">
        {trimmed}
      </p>
    );
  });
}

/**
 * Server‑side dynamic reading experience for publicly accessible articles.
 */
export default async function ArticlePage({ params }: { params: { id: string } }) {
  
  // 1. Fetch current article data
  let article: Article;
  try {
    const res = await fetch(`${BACKEND_URL}/api/articles/${params.id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      notFound();
    }
    article = await res.json();
  } catch (error) {
    notFound();
  }

  // 2. Log view interaction directly to FastAPI
  try {
    await fetch(`${BACKEND_URL}/api/interactions/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        article_id: Number(article.id),
        interaction_type: "view",
      }),
    });
  } catch (e) {
    // Silent fail
  }

  // 3. Fetch view counts
  const stats = await fetchInteractionStats(article.id);
  const viewCount = stats?.counts?.view || 0;

  // 4. Fetch all articles to compute dynamic navigations & recommendations
  let allArticles: Article[] = [];
  try {
    const res = await fetch(`${BACKEND_URL}/api/articles/`, {
      cache: "no-store",
    });
    if (res.ok) {
      allArticles = await res.json();
    }
  } catch {}

  // Find next and previous articles in chronological array
  const currentIndex = allArticles.findIndex(a => Number(a.id) === Number(article.id));
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 && currentIndex !== -1 ? allArticles[currentIndex + 1] : null;

  // Filter 2 related articles based on category tag overlaps
  const relatedArticles = allArticles
    .filter(a => Number(a.id) !== Number(article.id))
    .filter(a => a.tags?.some(t => article.tags?.includes(t)))
    .slice(0, 2);

  // If no tag overlap, just pick 2 latest posts
  const recommendations = relatedArticles.length > 0 
    ? relatedArticles 
    : allArticles.filter(a => Number(a.id) !== Number(article.id)).slice(0, 2);

  const formattedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown Date";

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 transition-colors">
      {/* Dynamic Scroll Progress Bar */}
      <ReadingProgressBar />
      
      <TopNavbar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Back navigation arrow */}
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-amber-600 transition-colors mb-8 group font-semibold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to feed
        </Link>

        {/* Large Immersive Featured Header Canvas cover */}
        <div className="w-full h-80 md:h-[400px] rounded-3xl overflow-hidden relative shadow-xl mb-10 shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url('${getTopicImage(article.title, article.tags)}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Header Tags overlay */}
          <div className="absolute bottom-6 left-6 md:left-10 flex flex-wrap gap-2">
            {(article.tags || []).map(tag => (
              <span key={tag} className="px-3 py-1 rounded bg-amber-500 text-white font-bold text-[10px] uppercase tracking-widest shadow-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Reading Canvas Container */}
        <article className="max-w-3xl mx-auto space-y-8">
          
          {/* Header titles */}
          <header className="space-y-4">
            <h1 
              className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] text-zinc-950"
              style={{ fontFamily: "Lora, serif" }}
            >
              {article.title}
            </h1>
            <p className="text-zinc-500 text-lg leading-relaxed italic font-light">
              Reflections on creativity, strategic insights, and narrative engineering.
            </p>

            {/* Meta info details */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-b border-zinc-200 pb-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-800">
                  {article.author ? article.author.charAt(0).toUpperCase() : "A"}
                </div>
                <div>
                  <span className="font-semibold text-zinc-900 block">{article.author || "Anonymous"}</span>
                  <span className="text-xs text-zinc-400">Contributor</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-300" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-zinc-300" />
                  <span>{viewCount + 1} views</span>
                </div>
              </div>
            </div>
          </header>

          {/* Clean Markdown-like Content area */}
          <div className="prose prose-zinc max-w-none text-zinc-800 dark:text-zinc-200">
            {renderArticleContent(article.content)}
          </div>

          {/* 5. Client Likes, Bookmarks, and Social Sharing widget */}
          <ArticleActions articleId={article.id} articleTitle={article.title} />

          {/* 6. Dynamic Previous & Next Article Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-zinc-200 pb-10 my-8">
            {prevArticle ? (
              <Link 
                href={`/article/${prevArticle.id}`}
                className="flex items-center justify-between p-5 rounded-2xl border border-zinc-200 hover:border-amber-500/40 hover:bg-white shadow-sm transition-all group"
              >
                <div className="space-y-1 pr-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous Story
                  </span>
                  <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">{prevArticle.title}</h4>
                </div>
              </Link>
            ) : (
              <div className="p-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex items-center justify-center text-xs text-zinc-400">
                Beginning of creative feed
              </div>
            )}

            {nextArticle ? (
              <Link 
                href={`/article/${nextArticle.id}`}
                className="flex items-center justify-between p-5 rounded-2xl border border-zinc-200 hover:border-amber-500/40 hover:bg-white shadow-sm transition-all group"
              >
                <div className="space-y-1 pl-4 text-right ml-auto">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1 justify-end">
                    Next Story <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">{nextArticle.title}</h4>
                </div>
              </Link>
            ) : (
              <div className="p-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex items-center justify-center text-xs text-zinc-400">
                End of creative feed
              </div>
            )}
          </div>

          {/* 7. RELATED ARTICLES / RECOMMENDATIONS */}
          {recommendations.length > 0 && (
            <div className="space-y-6 pt-6">
              <h3 className="text-xl font-bold tracking-tight text-zinc-950 font-serif" style={{ fontFamily: "Lora, serif" }}>
                Recommended Narratives
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recommendations.map(rec => (
                  <div 
                    key={rec.id}
                    className="border border-zinc-200/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all bg-white group cursor-pointer"
                  >
                    <Link href={`/article/${rec.id}`}>
                      <div className="h-32 bg-zinc-950 overflow-hidden relative">
                        <div 
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{ backgroundImage: `url('${getTopicImage(rec.title, rec.tags)}')` }}
                        />
                        <div className="absolute inset-0 bg-black/35" />
                      </div>
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-zinc-900 group-hover:text-amber-600 transition-colors line-clamp-2" style={{ fontFamily: "Lora, serif" }}>
                          {rec.title}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-2">
                          <span className="font-semibold text-zinc-500">{rec.author}</span>
                          <span>4 min read</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

        </article>
      </main>
    </div>
  );
}
