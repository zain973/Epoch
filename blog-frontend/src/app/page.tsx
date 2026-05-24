"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, Search, Moon, Sun, Instagram, Twitter, Linkedin, Github, 
  Bell, ArrowRight, Clock, Mail, BookOpen, PenLine, Tag, Heart, Award, Eye, Compass, Feather
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import TopNavbar from "@/components/TopNavbar";
import { getTopicImage } from "@/utils/imageMapper";

const BACKEND_URL = "http://localhost:8000";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [emailInput, setEmailInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. Fetch live articles from SQLite DB
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

  // 2. Perform Category & Search Filtering
  useEffect(() => {
    let result = articles;

    if (selectedCategory !== "all") {
      result = result.filter(a => 
        a.tags?.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query) ||
        a.author.toLowerCase().includes(query)
      );
    }

    setFilteredArticles(result);
  }, [searchQuery, selectedCategory, articles]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    toast({
      title: "Welcome to our inner circle 📬",
      description: "Thank you for subscribing to the Epoch Creative newsletter.",
    });
    setEmailInput("");
  };

  const featuredArticle = articles[0];
  const featuredStories = articles.slice(1, 4);
  const trendingStories = articles.slice(4, 7);
  const editorsPicks = articles.slice(7, 10);

  const categoriesList = ["all", "fastapi", "nextjs", "python", "tailwind", "databases", "docker", "performance"];
  
  const categoryDiscoveryCards = [
    { name: "Culture", tag: "culture", desc: "Folk traditions, festivals, and rural heritage logs.", img: "/cultural_mural_bg.png" },
    { name: "Design", tag: "design", desc: "Luxury editorial grids, UI/UX philosophy, and spacing.", img: "/design_topic_bg.png" },
    { name: "Technology", tag: "python", desc: "Clean development architectures and API systems.", img: "/coding_topic_bg.png" },
    { name: "Databases", tag: "databases", desc: "Network structure nodes and cloud migrations.", img: "/database_topic_bg.png" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? "bg-zinc-950 text-white" : "bg-[#FDFBF7] text-zinc-900"}`}>
      
      {/* 1. Header Navigation Bar */}
      <TopNavbar />

      {/* 2. HOMEPAGE HERO (Awwwards & Editorial Luxury Layout) */}
      {featuredArticle && (
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative overflow-hidden">
          {/* Subtle parallax ambient glow meshes */}
          <div className="absolute top-0 right-0 w-[45%] h-[50%] bg-gradient-to-tr from-amber-500/5 via-orange-500/5 to-rose-600/5 rounded-full blur-[140px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Storytelling Editorial text */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-amber-700 uppercase">
                <Feather className="w-3.5 h-3.5" />
                <span>The Storytelling Epoch</span>
              </div>
              
              <h1 
                className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-zinc-950 dark:text-white"
                style={{ fontFamily: "Lora, serif" }}
              >
                Unearthing the sacred blueprints of culture, design, and storytelling.
              </h1>
              
              <p className="text-amber-800 text-sm font-semibold tracking-wider italic">
                “Every era has a visual signature. We capture the ink before it dries.”
              </p>
              
              <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg font-light leading-relaxed max-w-xl">
                We craft premium, open-access narratives by intersecting rock-cut architecture, Banarasi silk handlooms, minimalist branding systems, and modern software engineering into one visual magazine.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/feed">
                  <Button className="rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-7 h-12 text-xs font-semibold tracking-widest uppercase hover:opacity-90 flex items-center gap-2 group shadow-xl">
                    Explore Stories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/write">
                  <Button variant="outline" className="rounded-full border-zinc-200 dark:border-zinc-800 px-7 h-12 text-xs font-semibold tracking-widest uppercase hover:bg-zinc-100 dark:hover:bg-zinc-900 bg-white/40">
                    Start Writing
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Story Card Display (Cinematic & Glass Overlay) */}
            <div className="lg:col-span-6 flex justify-center">
              <div 
                onClick={() => router.push(`/article/${featuredArticle.id}`)}
                className="w-full max-w-[480px] rounded-3xl overflow-hidden shadow-2xl relative group cursor-pointer border border-zinc-200/40 transform hover:scale-[1.01] transition-all duration-500"
              >
                {/* Visual Image cover */}
                <div className="h-[460px] bg-zinc-950 w-full overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-103 transition-transform duration-700"
                    style={{ backgroundImage: `url('${getTopicImage(featuredArticle.title, featuredArticle.tags)}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                </div>

                {/* Floating Glass Box Overlay */}
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md text-white space-y-4">
                  <div className="flex gap-2">
                    {featuredArticle.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[9px] font-extrabold uppercase tracking-widest text-amber-300">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold font-serif leading-snug group-hover:text-amber-300 transition-colors" style={{ fontFamily: "Lora, serif" }}>
                    {featuredArticle.title}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-2 border-t border-white/5">
                    <span className="font-semibold text-zinc-300">{featuredArticle.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 5 min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED STORIES SECTION (Large Editorial Card Canvas Grid) */}
      {featuredStories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-200 dark:border-zinc-800">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight uppercase font-serif" style={{ fontFamily: "Lora, serif" }}>
              Featured Stories
            </h2>
            <p className="text-zinc-500 text-xs mt-1">Curated masterpieces covering heritage and design logs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredStories.map(story => (
              <div 
                key={story.id}
                onClick={() => router.push(`/article/${story.id}`)}
                className="bg-white border border-zinc-200/80 rounded-3xl overflow-hidden hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 cursor-pointer group flex flex-col h-full"
              >
                {/* Cover cover matched cover */}
                <div className="h-56 bg-zinc-950 overflow-hidden relative shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${getTopicImage(story.title, story.tags)}')` }}
                  />
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-0.5 rounded bg-black/45 text-amber-300 text-[8px] font-bold uppercase tracking-widest">
                      Featured
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-serif leading-snug group-hover:text-amber-600 transition-colors text-zinc-900" style={{ fontFamily: "Lora, serif" }}>
                      {story.title}
                    </h3>
                    <p className="text-zinc-650 text-xs leading-relaxed line-clamp-3 font-light">
                      {story.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-[10px] text-zinc-400">
                    <span className="font-semibold text-zinc-600">{story.author}</span>
                    <span>5 min read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. TRENDING NARRATIVES SECTION (Modern Magazine Layout) */}
      {trendingStories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-200 dark:border-zinc-800">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight uppercase font-serif" style={{ fontFamily: "Lora, serif" }}>
              Trending Narratives
            </h2>
            <p className="text-zinc-500 text-xs mt-1">High-engagement updates taking our community by storm.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {trendingStories.map((story, idx) => (
              <div 
                key={story.id}
                onClick={() => router.push(`/article/${story.id}`)}
                className="bg-white border border-zinc-200/80 p-6 rounded-3xl hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 cursor-pointer group relative flex flex-col justify-between h-56 overflow-hidden"
              >
                {/* Background artistic mesh glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-600">
                      Trending #{idx + 1}
                    </span>
                    <span className="text-4xl font-extrabold tracking-tighter text-zinc-100 font-serif leading-none transition-colors group-hover:text-amber-500/10">
                      0{idx + 1}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold font-serif leading-snug group-hover:text-amber-600 transition-colors text-zinc-900" style={{ fontFamily: "Lora, serif" }}>
                    {story.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-3 border-t border-zinc-100 relative z-10">
                  <span className="font-semibold text-zinc-600">{story.author}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 4 min read</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. EDITOR'S PICKS SECTION (Curated Horizontal Layout) */}
      {editorsPicks.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-200 dark:border-zinc-800">
          <div className="mb-10 text-center md:text-left flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight uppercase font-serif" style={{ fontFamily: "Lora, serif" }}>
                Editor's Picks
              </h2>
              <p className="text-zinc-500 text-xs mt-1">Bespoke updates and case studies selected by our directors.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Award className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {editorsPicks.slice(0, 2).map(art => (
              <div 
                key={art.id}
                onClick={() => router.push(`/article/${art.id}`)}
                className="bg-white border border-zinc-200/80 p-5 rounded-3xl overflow-hidden hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row gap-6 items-center"
              >
                {/* Horizontal image banner */}
                <div className="w-full sm:w-44 h-36 rounded-2xl bg-zinc-950 overflow-hidden relative shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${getTopicImage(art.title, art.tags)}')` }}
                  />
                  <div className="absolute inset-0 bg-black/35" />
                </div>

                {/* Content excerpt */}
                <div className="flex-1 space-y-3">
                  <h4 className="text-base font-bold leading-snug group-hover:text-amber-600 transition-colors text-zinc-900" style={{ fontFamily: "Lora, serif" }}>
                    {art.title}
                  </h4>
                  <p className="text-zinc-650 text-xs font-light line-clamp-2 leading-relaxed">
                    {art.content}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-[10px] text-zinc-400">
                    <span className="font-semibold text-zinc-600">{art.author}</span>
                    <span>5 min read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. CATEGORY DISCOVERY CARDS SECTION (Artistic Glass Modules) */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl font-bold tracking-tight uppercase font-serif" style={{ fontFamily: "Lora, serif" }}>
            Category Discovery
          </h2>
          <p className="text-zinc-500 text-xs mt-1">Explore our dynamically filtered creative shelves.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryDiscoveryCards.map(card => (
            <div 
              key={card.name}
              onClick={() => router.push(`/category/${card.tag}`)}
              className="h-64 rounded-3xl overflow-hidden relative shadow-lg cursor-pointer group border border-zinc-200/40"
            >
              {/* Cover cover Matched background */}
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url('${card.img}')` }}
              />
              <div className="absolute inset-0 bg-black/45 transition-colors group-hover:bg-black/55" />

              {/* Centered Glass overlay info */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                <span className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-amber-400">
                  <Compass className="w-4 h-4" />
                </span>
                
                <div className="space-y-1">
                  <h4 className="text-xl font-bold font-serif leading-tight tracking-wide" style={{ fontFamily: "Lora, serif" }}>
                    {card.name}
                  </h4>
                  <p className="text-zinc-300 text-[10px] leading-relaxed font-light font-sans">
                    {card.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. LATEST STORIES FEED (Dynamic Feed grid & Filters) */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight uppercase font-serif" style={{ fontFamily: "Lora, serif" }}>
              Latest Creative Logs
            </h2>
            <p className="text-zinc-500 text-xs mt-1">Explore fresh journals, coding blueprints, and artwork updates.</p>
          </div>

          {/* Dynamic category filter pills */}
          <div className="flex flex-wrap gap-2">
            {categoriesList.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50"
                }`}
              >
                {cat === "all" ? "All posts" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered logs lists */}
        {filteredArticles.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <BookOpen className="w-12 h-12 mx-auto text-zinc-300" />
            <h4 className="text-lg font-bold">No posts match your category filter</h4>
            <p className="text-zinc-500 text-xs">Try selecting a different genre capsule or clear the active query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.slice(0, 6).map(art => (
              <div 
                key={art.id}
                onClick={() => router.push(`/article/${art.id}`)}
                className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col h-full"
              >
                <div className="h-44 bg-zinc-950 overflow-hidden relative shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${getTopicImage(art.title, art.tags)}')` }}
                  />
                  <div className="absolute inset-0 bg-black/35" />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {art.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 bg-amber-500/5 text-amber-700 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-bold text-base leading-snug group-hover:text-amber-600 transition-colors text-zinc-900 line-clamp-2" style={{ fontFamily: "Lora, serif" }}>
                      {art.title}
                    </h3>

                    <p className="text-zinc-500 text-xs line-clamp-3 leading-relaxed font-light">
                      {art.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-[10px] text-zinc-400">
                    <span className="font-semibold text-zinc-600">{art.author}</span>
                    <span>4 min read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 8. LUXURY NEWSLETTER CTA SECTION (Startup Grade Dark Mesh Card) */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white p-8 md:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
            {/* Elegant glowing warm ambient mesh lights in the background */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-gradient-to-tr from-amber-500/10 to-rose-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-gradient-to-tr from-rose-500/10 to-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex justify-center mb-2">
              <span className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400">
                <Mail className="w-5 h-5 animate-pulse" />
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight" style={{ fontFamily: "Lora, serif" }}>
              Join the Epoch Circle
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm max-w-md mx-auto font-light leading-relaxed">
              Get behind-the-scenes film commentaries, cultural analysis essays, and marketing strategy blueprints delivered straight to your creative toolbox once a month.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-4 relative z-10">
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
            
            <p className="text-[10px] text-zinc-500 font-light">Zero spam. Unsubscribe at any time. Built with ultimate privacy.</p>
          </div>
        </div>
      </section>

      {/* 9. FOOTER (Sophisticated Magazine Brand Footer) */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white text-zinc-650 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand details */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight uppercase text-zinc-900 font-serif" style={{ fontFamily: "Lora, serif" }}>
                Epoch Creative
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs font-light text-zinc-500">
              A premium brand storytelling portal blending cinematic vision, robust strategies, and digital workspace design. Created for visionaries.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600">Quick Links</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><Link href="/" className="hover:text-amber-500 transition-colors">Homepage</Link></li>
              <li><Link href="/feed" className="hover:text-amber-500 transition-colors">Stories Feed</Link></li>
              <li><Link href="/write" className="hover:text-amber-500 transition-colors">Publish Studio</Link></li>
              <li><Link href="/about" className="hover:text-amber-500 transition-colors">About Storytellers</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600">Core Genres</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><Link href="/category/culture" className="hover:text-amber-500 transition-colors">Culture Shelf</Link></li>
              <li><Link href="/category/design" className="hover:text-amber-500 transition-colors">Design & Spacing</Link></li>
              <li><Link href="/category/photography" className="hover:text-amber-500 transition-colors">Silent Lens</Link></li>
              <li><Link href="/category/architecture" className="hover:text-amber-500 transition-colors">Sacred Blueprints</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600">Social follow</h4>
            <p className="text-xs leading-relaxed font-light text-zinc-500">
              Follow our creators for daily editorial highlights, design grids, and campaign previews.
            </p>
            <div className="flex gap-4 text-zinc-500">
              <a href="#" className="hover:text-amber-500 transition-colors"><Instagram className="w-4.5 h-4.5" /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Twitter className="w-4.5 h-4.5" /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Linkedin className="w-4.5 h-4.5" /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Github className="w-4.5 h-4.5" /></a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-100 py-6 text-center text-xs text-zinc-400">
          &copy; {new Date().getFullYear()} Epoch Creative. All rights reserved. Designed with luxury aesthetics.
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
