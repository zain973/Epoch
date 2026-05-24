import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import TopNavbar from "@/components/TopNavbar";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import ArticleActions from "@/components/ArticleActions";
import { getTopicImage } from "@/utils/imageMapper";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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
 * Helper to calculate reading time based on content length.
 */
function getReadTime(content: string) {
  const wordCount = (content || "").split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 160));
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
        <h3 key={idx} className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-8 mb-4 font-serif" style={{ fontFamily: "Lora, serif" }}>
          {trimmed.replace(/^##\s*/, "")}
        </h3>
      );
    }
    if (trimmed.startsWith("#")) {
      return (
        <h2 key={idx} className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-10 mb-4 font-serif" style={{ fontFamily: "Lora, serif" }}>
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
        <ul key={idx} className="list-disc pl-6 my-6 space-y-2.5 text-zinc-755 dark:text-zinc-300 font-light">
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
      <p key={idx} className="text-zinc-800 dark:text-zinc-300 text-lg leading-relaxed mb-6 font-light tracking-wide font-sans">
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
    : "May 24, 2026";

  // Calculate read time based on length
  const wordCount = (article.content || "").split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 160));

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans">
      
      {/* Dynamic Scroll Progress Bar */}
      <ReadingProgressBar />
      
      <TopNavbar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Back navigation arrow */}
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-8 group font-semibold font-sans"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to feed
        </Link>

        {/* Large Immersive Featured Header Canvas cover */}
        <div className="w-full h-80 md:h-[400px] rounded-[32px] overflow-hidden relative shadow-xl mb-10 shrink-0 border border-zinc-200/20 dark:border-zinc-800/40">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url('${getTopicImage(article.title, article.tags)}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-black/10 to-transparent" />
          
          {/* Header Tags overlay */}
          <div className="absolute bottom-6 left-6 md:left-10 flex flex-wrap gap-2 z-10">
            {(article.tags || []).map(tag => (
              <span key={tag} className="px-3.5 py-1 rounded bg-amber-600 text-white font-bold text-[9px] uppercase tracking-widest shadow-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Reading Canvas Container */}
        <article className="max-w-3xl mx-auto space-y-8">
          
          {/* Header titles */}
          <header className="space-y-4">
            <h1 
              className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-zinc-950 dark:text-white font-serif"
              style={{ fontFamily: "Lora, serif" }}
            >
              {article.title}
            </h1>
            
            <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed italic font-light font-sans">
              Reflections on culture, design grid philosophies, and cinematic storytelling logs.
            </p>

            {/* Meta info details */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-b border-zinc-200/50 dark:border-zinc-800/40 pb-6 text-sm text-zinc-550 dark:text-zinc-450 font-sans">
              
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center font-bold text-amber-800 dark:text-amber-400 uppercase text-xs ring-2 ring-amber-500/10">
                  {article.author ? article.author.charAt(0).toUpperCase() : "A"}
                </div>
                <div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-300 block leading-tight">{article.author || "Anonymous"}</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-semibold">Contributor</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-zinc-400 dark:text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500/70" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                  <span>{viewCount + 1} views</span>
                </div>
                <span className="text-zinc-300 dark:text-zinc-750">|</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/5 text-amber-700 dark:text-amber-400 font-extrabold uppercase tracking-widest text-[9px]">{readTime} MIN STUDY</span>
              </div>

            </div>
          </header>

          {/* Clean Markdown-like Content area */}
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            {renderArticleContent(article.content)}
          </div>

          {/* Likes, Bookmarks, and Social Sharing widget */}
          <ArticleActions articleId={article.id} articleTitle={article.title} />

          {/* Dynamic Previous & Next Article Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-zinc-200/50 dark:border-zinc-800/40 pb-10 my-8 font-sans">
            {prevArticle ? (
              <Link 
                href={`/article/${prevArticle.id}`}
                className="flex items-center justify-between p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-850 hover:border-amber-500/40 dark:hover:border-amber-500/35 bg-white/40 dark:bg-zinc-900/20 hover:bg-white dark:hover:bg-zinc-900/40 shadow-sm transition-all group shrink-0"
              >
                <div className="space-y-1.5 pr-4">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous Story
                  </span>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{prevArticle.title}</h4>
                </div>
              </Link>
            ) : (
              <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-900/50 bg-zinc-50/50 dark:bg-zinc-900/10 flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-650 font-light italic">
                Beginning of creative feed
              </div>
            )}

            {nextArticle ? (
              <Link 
                href={`/article/${nextArticle.id}`}
                className="flex items-center justify-between p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-850 hover:border-amber-500/40 dark:hover:border-amber-500/35 bg-white/40 dark:bg-zinc-900/20 hover:bg-white dark:hover:bg-zinc-900/40 shadow-sm transition-all group shrink-0"
              >
                <div className="space-y-1.5 pl-4 text-right ml-auto">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-1 justify-end">
                    Next Story <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{nextArticle.title}</h4>
                </div>
              </Link>
            ) : (
              <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-900/50 bg-zinc-50/50 dark:bg-zinc-900/10 flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-650 font-light italic">
                End of creative feed
              </div>
            )}
          </div>

          {/* RELATED ARTICLES / RECOMMENDATIONS */}
          {recommendations.length > 0 && (
            <div className="space-y-6 pt-6">
              <h3 
                className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white font-serif" 
                style={{ fontFamily: "Lora, serif" }}
              >
                Recommended Narratives
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recommendations.map(rec => (
                  <div 
                    key={rec.id}
                    className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-amber-500/30 dark:hover:border-amber-500/20 transition-all duration-500 bg-white dark:bg-zinc-900/30 group cursor-pointer"
                  >
                    <Link href={`/article/${rec.id}`}>
                      <div className="h-36 bg-zinc-950 overflow-hidden relative">
                        <div 
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                          style={{ backgroundImage: `url('${getTopicImage(rec.title, rec.tags)}')` }}
                        />
                        <div className="absolute inset-0 bg-black/25 dark:bg-black/45" />
                      </div>
                      
                      <div className="p-5 space-y-2.5 font-sans">
                        <h4 
                          className="font-bold text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 font-serif" 
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {rec.title}
                        </h4>
                        
                        <div className="flex items-center justify-between text-[10px] text-zinc-450 dark:text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800/40">
                          <span className="font-bold text-zinc-650 dark:text-zinc-400">{rec.author}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" /> {getReadTime(rec.content)} min read</span>
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
