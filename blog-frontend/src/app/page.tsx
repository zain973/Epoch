"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, Search, Instagram, Twitter, Linkedin, Github, 
  ArrowRight, Clock, Mail, BookOpen, PenLine, Tag, Heart, 
  Award, Eye, Compass, Feather, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import TopNavbar from "@/components/TopNavbar";
import { getTopicImage } from "@/utils/imageMapper";

interface Article {
  id: string | number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  created_at?: string;
  likes?: number;
  views?: number;
}

export default function HomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [emailInput, setEmailInput] = useState("");

  // 1. Fetch live seeded articles from SQLite DB
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles/");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const fetched = Array.isArray(data) ? data : data.articles ?? [];
        if (fetched.length === 0) {
          loadOfflineFallback();
        } else {
          setArticles(fetched);
          setFilteredArticles(fetched);
        }
      } catch {
        loadOfflineFallback();
      }
    };

    const loadOfflineFallback = () => {
      const localStr = localStorage.getItem("EPOCH_LOCAL_ARTICLES");
      const localArticles = localStr ? JSON.parse(localStr) : [];
      const merged = [...localArticles, ...MOCK_ARTICLES];
      setArticles(merged);
      setFilteredArticles(merged);
    };

    fetchArticles();
  }, []);

  // 2. Perform client side filtering for the "Latest Stories" feed section
  useEffect(() => {
    let result = articles;

    if (selectedCategory !== "all") {
      result = result.filter(a => 
        a.tags?.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    setFilteredArticles(result);
  }, [selectedCategory, articles]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    toast({
      title: "Welcome to the Inner Circle 📬",
      description: "Thank you for subscribing to the Epoch Creative premium journal.",
    });
    setEmailInput("");
  };

  const featuredArticle = articles[0];
  const featuredStories = articles.slice(1, 4);
  const trendingStories = articles.slice(4, 7);
  const editorsPicks = articles.slice(7, 10);

  const categoriesList = ["all", "culture", "art", "heritage", "design", "photography", "architecture", "technology", "branding"];
  
  const categoryDiscoveryCards = [
    { name: "Culture", tag: "culture", desc: "Folk rituals and heritage logs.", img: "/cultural_mural_bg.png" },
    { name: "Design", tag: "design", desc: "Luxury spacing and typography systems.", img: "/design_topic_bg.png" },
    { name: "Technology", tag: "python", desc: "Modern API stacks and design codes.", img: "/coding_topic_bg.png" },
    { name: "Databases", tag: "databases", desc: "Basalt structures of data nodes.", img: "/database_topic_bg.png" },
  ];

  // Hashing helper for deterministic mock stats
  const getLikesCount = (art: Article) => {
    if (art.likes !== undefined) return art.likes;
    const hash = (art.title || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 120) + 15;
  };

  const getViewsCount = (art: Article) => {
    if (art.views !== undefined) return art.views;
    const hash = (art.title || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 600) + 110;
  };

  const getReadTime = (content: string) => {
    const wordCount = (content || "").split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 160));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 font-sans">
      
      {/* 1. Sticky Premium Glassmorphism Navbar */}
      <TopNavbar />

      {/* 2. HOMEPAGE HERO (Awwwards-inspired luxury asymmetric grid) */}
      {featuredArticle && (
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative overflow-hidden">
          
          {/* Subtle warm amber glowing ambient backgrounds */}
          <div className="absolute top-0 right-[-10%] w-[50%] h-[60%] bg-gradient-to-tr from-amber-500/5 via-orange-500/5 to-rose-600/5 dark:from-amber-500/10 dark:to-transparent rounded-full blur-[140px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Visual Typography Storytelling Text */}
            <div className="lg:col-span-7 space-y-8 text-left z-10">
              
              <div className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.25em] text-amber-700 dark:text-amber-400 uppercase">
                <Feather className="w-3.5 h-3.5" />
                <span>Creative Editorial Shelf</span>
              </div>
              
              <h1 
                className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-zinc-950 dark:text-white"
                style={{ fontFamily: "Lora, serif" }}
              >
                Unearthing the timeless <span className="font-serif italic text-amber-700 dark:text-amber-500 font-normal">blueprints</span> of culture, design, and art.
              </h1>
              
              <p className="text-zinc-550 dark:text-zinc-400 text-sm font-semibold tracking-widest uppercase italic leading-none border-l-2 border-amber-600 dark:border-amber-500 pl-4 py-1">
                “Every era has a signature. We capture the ink before it dries.”
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-450 text-base md:text-lg font-light leading-relaxed max-w-2xl font-sans">
                We compose premium, open-access journals intersecting sacred temple architecture, Varanasi silk handloom shuttles, brutalist grid lines, and high-performance backend frameworks. Made for the modern visual intellectual.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/feed">
                  <Button className="rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-8 h-12 text-[10px] font-bold tracking-widest uppercase hover:bg-zinc-800 dark:hover:bg-zinc-100 flex items-center gap-2 group shadow-xl">
                    Explore Stories 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="/write">
                  <Button variant="outline" className="rounded-full border-zinc-200 dark:border-zinc-800 px-8 h-12 text-[10px] font-bold tracking-widest uppercase hover:bg-zinc-100 dark:hover:bg-zinc-900 bg-white/40 dark:bg-zinc-950/20 shadow-md">
                    Start Writing
                  </Button>
                </Link>
              </div>

            </div>

            {/* Right Column: Hero Cinematic Featured Card (Floating + Glass Overlays) */}
            <div className="lg:col-span-5 flex justify-center z-10">
              <div 
                onClick={() => router.push(`/article/${featuredArticle.id}`)}
                className="w-full max-w-[430px] rounded-[32px] overflow-hidden shadow-2xl relative group cursor-pointer border border-zinc-200/30 dark:border-zinc-800/40 bg-zinc-900 animate-float-premium"
              >
                
                {/* Visual Image cover */}
                <div className="h-[480px] w-full overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-103 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url('${getTopicImage(featuredArticle.title, featuredArticle.tags)}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                </div>

                {/* Hot Badge */}
                <div className="absolute top-6 left-6">
                  <span className="px-3.5 py-1 rounded-full bg-amber-600 text-white text-[9px] font-extrabold uppercase tracking-widest shadow-md">
                    Featured Cover
                  </span>
                </div>

                {/* Floating Glassmorphic Details Box Overlay */}
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-zinc-950/80 dark:bg-zinc-900/90 border border-white/10 backdrop-blur-md text-white space-y-4 shadow-2xl">
                  
                  <div className="flex gap-2">
                    {(featuredArticle.tags || []).slice(0, 2).map(tag => (
                      <span key={tag} className="text-[9px] font-extrabold uppercase tracking-widest text-amber-300">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <h3 
                    className="text-xl font-bold leading-snug group-hover:text-amber-300 transition-colors" 
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    {featuredArticle.title}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-3 border-t border-white/5 font-sans">
                    <span className="font-bold text-zinc-250 flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[9px] font-bold">
                        {featuredArticle.author.charAt(0).toUpperCase()}
                      </div>
                      {featuredArticle.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> 
                      {getReadTime(featuredArticle.content)} MIN READ
                    </span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </section>
      )}

      {/* 3. FEATURED STORIES ROW (Large Canvas Editorial Cards Layout) */}
      {featuredStories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-zinc-200/50 dark:border-zinc-800/50">
          
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 
                className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase text-zinc-900 dark:text-white"
                style={{ fontFamily: "Lora, serif" }}
              >
                Featured Stories
              </h2>
              <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1 leading-relaxed font-sans">Curated publicationscovering visual arts, editorial designs, and architecture lines.</p>
            </div>
            <Link 
              href="/feed" 
              className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center gap-1 group/btn"
            >
              View Feed Shelf <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredStories.map((story) => (
              <div 
                key={story.id}
                onClick={() => router.push(`/article/${story.id}`)}
                className="bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-amber-500/30 dark:hover:border-amber-500/20 transition-all duration-500 cursor-pointer group flex flex-col h-full shadow-md"
              >
                
                {/* Cover Image with Zoom Effect */}
                <div className="h-60 bg-zinc-950 overflow-hidden relative shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url('${getTopicImage(story.title, story.tags)}')` }}
                  />
                  <div className="absolute inset-0 bg-zinc-950/20 dark:bg-zinc-950/50" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-0.5 rounded bg-zinc-950/60 dark:bg-zinc-900/80 border border-white/10 text-amber-400 text-[8px] font-extrabold uppercase tracking-widest backdrop-blur-md">
                      Featured
                    </span>
                  </div>
                </div>

                {/* Details Excerpt */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4 font-sans">
                  
                  <div className="space-y-2.5">
                    <h3 
                      className="text-lg md:text-xl font-bold leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-zinc-900 dark:text-white font-serif"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      {story.title}
                    </h3>
                    <p className="text-zinc-550 dark:text-zinc-400 text-xs md:text-sm leading-relaxed line-clamp-3 font-light font-sans">
                      {story.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/40 text-[10px] text-zinc-450 dark:text-zinc-500">
                    <span className="font-bold text-zinc-800 dark:text-zinc-300">{story.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> {getReadTime(story.content)} min read</span>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </section>
      )}

      {/* 4. TRENDING NARRATIVES SECTION (Modern Creative Magazine Grid with Large Serif Numbers) */}
      {trendingStories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-zinc-200/50 dark:border-zinc-800/50">
          
          <div className="mb-12">
            <h2 
              className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase text-zinc-900 dark:text-white"
              style={{ fontFamily: "Lora, serif" }}
            >
              Trending Narratives
            </h2>
            <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1 leading-relaxed font-sans font-light">High-engagement updates taking our cultural storytelling community by storm.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {trendingStories.map((story, idx) => (
              <div 
                key={story.id}
                onClick={() => router.push(`/article/${story.id}`)}
                className="bg-white dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60 p-6 rounded-[24px] hover:shadow-2xl hover:border-amber-500/30 dark:hover:border-amber-500/25 transition-all duration-500 cursor-pointer group relative flex flex-col justify-between h-60 overflow-hidden shadow-sm"
              >
                
                {/* Background artistic mesh glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-rose-600/5 dark:from-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="space-y-4 relative z-10 font-sans">
                  
                  {/* Trending Label & Huge Large Digits */}
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-500/5 dark:bg-amber-500/10 px-2 py-0.5 rounded">
                      Trending #{idx + 1}
                    </span>
                    <span 
                      className="text-5xl font-black tracking-tighter text-zinc-150 dark:text-zinc-800/40 group-hover:text-amber-500/20 leading-none transition-colors"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      0{idx + 1}
                    </span>
                  </div>
                  
                  <h3 
                    className="text-base md:text-lg font-bold leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-zinc-900 dark:text-white font-serif line-clamp-2"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    {story.title}
                  </h3>

                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-450 dark:text-zinc-500 pt-4 border-t border-zinc-100 dark:border-zinc-800/40 relative z-10">
                  <span className="font-bold text-zinc-800 dark:text-zinc-300">{story.author}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> {getLikesCount(story)}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-zinc-400" /> {getViewsCount(story)}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </section>
      )}

      {/* 5. EDITOR'S PICKS SECTION (Curated Elegant Horizontal Cards) */}
      {editorsPicks.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-zinc-200/50 dark:border-zinc-800/50">
          
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 
                className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase text-zinc-900 dark:text-white"
                style={{ fontFamily: "Lora, serif" }}
              >
                Editor's Picks
              </h2>
              <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1 leading-relaxed font-sans font-light">Bespoke updates and artistic case studies selected by our directors.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {editorsPicks.slice(0, 2).map((art) => (
              <div 
                key={art.id}
                onClick={() => router.push(`/article/${art.id}`)}
                className="bg-white dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60 p-5 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-amber-500/30 dark:hover:border-amber-500/20 transition-all duration-500 cursor-pointer group flex flex-col sm:flex-row gap-6 items-center shadow-sm"
              >
                
                {/* Horizontal image banner with Zoom */}
                <div className="w-full sm:w-48 h-36 rounded-2xl bg-zinc-950 overflow-hidden relative shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url('${getTopicImage(art.title, art.tags)}')` }}
                  />
                  <div className="absolute inset-0 bg-zinc-950/20 dark:bg-zinc-950/40" />
                </div>

                {/* Excerpt Details */}
                <div className="flex-1 space-y-3 font-sans">
                  <h4 
                    className="text-base font-bold leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-zinc-900 dark:text-white font-serif line-clamp-2"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    {art.title}
                  </h4>
                  <p className="text-zinc-550 dark:text-zinc-400 text-xs font-light line-clamp-2 leading-relaxed">
                    {art.content}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/40 text-[10px] text-zinc-450 dark:text-zinc-500">
                    <span className="font-bold text-zinc-800 dark:text-zinc-300">{art.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> {getReadTime(art.content)} min read</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </section>
      )}

      {/* 6. CATEGORY DISCOVERY SECTION (Artistic Glass Modules) */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-zinc-200/50 dark:border-zinc-800/50">
        
        <div className="mb-12">
          <h2 
            className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase text-zinc-900 dark:text-white"
            style={{ fontFamily: "Lora, serif" }}
          >
            Category Discovery
          </h2>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1 leading-relaxed font-sans font-light">Explore our dynamically filtered creative shelves & traditional craft relics.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryDiscoveryCards.map((card) => (
            <div 
              key={card.name}
              onClick={() => router.push(`/category/${card.tag}`)}
              className="h-64 rounded-[28px] overflow-hidden relative shadow-lg cursor-pointer group border border-zinc-200/40 dark:border-zinc-800/40"
            >
              
              {/* Background cover image with custom zoom transition */}
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                style={{ backgroundImage: `url('${card.img}')` }}
              />
              <div className="absolute inset-0 bg-zinc-950/45 dark:bg-zinc-950/65 group-hover:bg-zinc-950/55 transition-colors duration-300" />

              {/* Centered Glass overlay info details */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white z-10">
                <span className="w-9 h-9 rounded-xl bg-white/10 dark:bg-white/5 border border-white/25 dark:border-white/10 backdrop-blur-md flex items-center justify-center text-amber-300">
                  <Compass className="w-4.5 h-4.5" />
                </span>
                
                <div className="space-y-1.5">
                  <h4 
                    className="text-lg md:text-xl font-bold leading-tight tracking-wide font-serif"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    {card.name}
                  </h4>
                  <p className="text-zinc-350 dark:text-zinc-400 text-[10px] leading-relaxed font-light font-sans">
                    {card.desc}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* 7. LATEST STORY FEED (Filtered latest publications logs with pills) */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-zinc-200/50 dark:border-zinc-800/50">
        
        {/* Feed section header and pills filter */}
        <div className="mb-12 border-b border-zinc-200/40 dark:border-zinc-800/40 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h2 
              className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase text-zinc-900 dark:text-white"
              style={{ fontFamily: "Lora, serif" }}
            >
              Latest Creative Logs
            </h2>
            <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1 leading-relaxed font-sans font-light">Explore fresh journals, coding blueprints, architectural relics, and artwork updates.</p>
          </div>

          {/* Client side category capsules */}
          <div className="flex flex-wrap gap-2">
            {categoriesList.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-500/10"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {cat === "all" ? "All posts" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered creative logs list */}
        {filteredArticles.length === 0 ? (
          <div className="py-24 text-center space-y-4 font-sans text-zinc-400">
            <BookOpen className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-800 animate-pulse" />
            <h4 className="text-base font-bold text-zinc-850 dark:text-zinc-250">No logs found under this tag</h4>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">Try selecting a different genre capsule or clear the active query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.slice(0, 6).map((art, i) => (
              <div 
                key={art.id}
                onClick={() => router.push(`/article/${art.id}`)}
                className="bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-amber-500/30 dark:hover:border-amber-500/25 transition-all duration-500 group cursor-pointer flex flex-col h-full shadow-sm"
              >
                
                {/* Thumbnails Zoom */}
                <div className="h-48 bg-zinc-950 overflow-hidden relative shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url('${getTopicImage(art.title, art.tags)}')` }}
                  />
                  <div className="absolute inset-0 bg-zinc-950/20 dark:bg-zinc-950/50" />
                </div>

                {/* Excerpt Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4 font-sans">
                  
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap gap-1">
                      {(art.tags || []).slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[8px] font-extrabold tracking-widest uppercase px-2 py-0.5 bg-amber-500/5 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/5">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 
                      className="font-bold text-base md:text-lg leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors text-zinc-900 dark:text-white font-serif line-clamp-2"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      {art.title}
                    </h3>

                    <p className="text-zinc-550 dark:text-zinc-400 text-xs leading-relaxed line-clamp-3 font-light font-sans">
                      {art.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/40 text-[10px] text-zinc-450 dark:text-zinc-500">
                    <span className="font-bold text-zinc-850 dark:text-zinc-300">{art.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> {getReadTime(art.content)} min read</span>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* 8. LUXURY NEWSLETTER CTA SECTION (Dark Velvet Mesh Layout) */}
      <section id="newsletter" className="border-t border-zinc-200/50 dark:border-zinc-800/50 bg-[#FDFBF7] dark:bg-zinc-950 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6 py-16">
          
          <div className="rounded-[36px] bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white p-8 md:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl border border-zinc-800/50">
            
            {/* Elegant glowing warm ambient light pools */}
            <div className="absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-20%] w-[400px] h-[400px] bg-gradient-to-tr from-rose-500/10 to-transparent rounded-full blur-[110px] pointer-events-none" />

            <div className="flex justify-center mb-2 z-10 relative">
              <span className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 flex items-center justify-center text-amber-400">
                <Mail className="w-5 h-5 animate-pulse" />
              </span>
            </div>

            <h2 
              className="text-3xl md:text-5xl font-extrabold tracking-tight z-10 relative"
              style={{ fontFamily: "Lora, serif" }}
            >
              Join the Epoch Circle
            </h2>
            
            <p className="text-zinc-450 dark:text-zinc-450 text-xs md:text-sm max-w-md mx-auto font-light leading-relaxed z-10 relative font-sans">
              Get behind-the-scenes film commentaries, cultural analysis essays, and design grid case studies delivered straight to your creative mailbox once a month.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-4 relative z-20 font-sans">
              <Input
                type="email"
                required
                placeholder="Enter your email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="h-12 px-5 rounded-full bg-white/10 border border-white/20 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-amber-500/20 text-xs"
              />
              <Button type="submit" className="h-12 px-7 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 font-bold uppercase tracking-widest text-[10px] shrink-0 shadow-lg">
                Subscribe
              </Button>
            </form>
            
            <p className="text-[10px] text-zinc-500 font-light z-10 relative font-sans">Zero spam. Unsubscribe at any time. Built with ultimate privacy.</p>
          </div>

        </div>
      </section>

      {/* 9. BRAND FOOTER */}
      <footer className="border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 text-zinc-650 dark:text-zinc-400 transition-colors py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4 font-sans">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span 
                className="text-lg font-bold tracking-tight uppercase text-zinc-900 dark:text-white font-serif"
                style={{ fontFamily: "Lora, serif" }}
              >
                Epoch Creative
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs font-light text-zinc-500 dark:text-zinc-500">
              A premium brand storytelling portal blending cinematic vision, robust systems, and digital workspace layouts. Created for the global visual class.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Quick Links</h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li><Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Homepage</Link></li>
              <li><Link href="/feed" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Stories Feed</Link></li>
              <li><Link href="/write" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Publish Studio</Link></li>
              <li><Link href="/about" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">About Storytellers</Link></li>
            </ul>
          </div>

          {/* Categories Column */}
          <div className="space-y-3 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Core Genres</h4>
            <ul className="space-y-2.5 text-xs font-light font-sans">
              <li><Link href="/category/culture" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Culture Shelf</Link></li>
              <li><Link href="/category/design" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Design & Spacing</Link></li>
              <li><Link href="/category/photography" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Silent Lens</Link></li>
              <li><Link href="/category/architecture" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Sacred Blueprints</Link></li>
            </ul>
          </div>

          {/* Social Columns */}
          <div className="space-y-4 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Social follow</h4>
            <p className="text-xs leading-relaxed font-light text-zinc-550 dark:text-zinc-500">
              Follow our creators for daily editorial highlights, design grids, and campaign previews.
            </p>
            <div className="flex gap-4 text-zinc-400 dark:text-zinc-500">
              <a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"><Instagram className="w-4.5 h-4.5" /></a>
              <a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"><Twitter className="w-4.5 h-4.5" /></a>
              <a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"><Linkedin className="w-4.5 h-4.5" /></a>
              <a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"><Github className="w-4.5 h-4.5" /></a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-6 border-t border-zinc-150 dark:border-zinc-900 mt-12 pt-8 text-center text-xs text-zinc-450 dark:text-zinc-555 font-sans font-light">
          &copy; {new Date().getFullYear()} Epoch Creative. All rights reserved. Designed with ultimate luxury magazine aesthetics.
        </div>
      </footer>

    </div>
  );
}

const MOCK_ARTICLES: Article[] = [
  {
    id: "7",
    title: "Echoes of Ajanta: The Spiritual Tapestry of Ancient Caves",
    content: "Deep within the basalt cliffs of Maharashtra lies the Ajanta cave complex, an ancient marvel of rock-cut architecture carved by Buddhist monks.",
    author: "Aravind S",
    tags: ["culture", "heritage", "history"],
  },
  {
    id: "9",
    title: "The Typography of Luxury: Crafting Editorial Identity",
    content: "Typography is the silent voice of design. In high-end editorial and premium branding, serif fonts evoke luxury, whereas modern sans-serifs communicate simplicity.",
    author: "Elena Rostova",
    tags: ["design", "branding", "style"],
  },
  {
    id: "8",
    title: "Weaving Time: The Legacy of Varanasi's Silk Artisans",
    content: "Varanasi's silk weavers use handloom shuttles to weave gold and silver threads into highly intricate Banarasi silk sarees, preserving patterns across generations.",
    author: "Meera Iyer",
    tags: ["culture", "heritage", "storytelling"],
  },
];
