"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  PenLine, Sparkles, LogOut, User, ChevronDown, Search, Bell, 
  Moon, Sun, Instagram, Twitter, Github, Menu, X, Compass,
  Palette, Library, Layers, Camera, Building2, Cpu, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface CategoryItem {
  name: string;
  tag: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // 1. Detect scroll position for navbar shrinking
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Synchronize theme state with DOM
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      } else {
        document.documentElement.classList.remove("dark");
        setIsDark(false);
      }
    }
  }, []);

  // 3. Close all dropdowns when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setMegaMenuOpen(false);
      setProfileDropdownOpen(false);
      setNotificationsOpen(false);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
      toast({ title: "Light mode enabled", description: "Enjoy the warm ivory editorial view." });
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
      toast({ title: "Dark mode enabled", description: "Optimized for night-time reading aesthetics." });
    }
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    toast({ title: "Signed out successfully" });
    router.push("/signin");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/feed?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const megaCategories: CategoryItem[] = [
    { name: "Culture", tag: "culture", desc: "Folk traditions, rituals, and heritage storytelling.", icon: Compass, color: "text-amber-500 bg-amber-500/5 dark:bg-amber-500/10" },
    { name: "Art", tag: "art", desc: "Visual galleries, paintings, and post-modern expressions.", icon: Palette, color: "text-rose-500 bg-rose-500/5 dark:bg-rose-500/10" },
    { name: "Heritage", tag: "heritage", desc: "Historical timelines, craft relics, and monuments.", icon: Library, color: "text-orange-500 bg-orange-500/5 dark:bg-orange-500/10" },
    { name: "Design", tag: "design", desc: "Brutalist spires, UI grid lines, and minimalism.", icon: Layers, color: "text-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10" },
    { name: "Photography", tag: "photography", desc: "Silent cinematic lenses and documentary frames.", icon: Camera, color: "text-blue-500 bg-blue-500/5 dark:bg-blue-500/10" },
    { name: "Architecture", tag: "architecture", desc: "Sacred temple dimensions and basalt structures.", icon: Building2, color: "text-purple-500 bg-purple-500/5 dark:bg-purple-500/10" },
    { name: "Technology", tag: "python", desc: "Clean development models and modern stack blueprints.", icon: Cpu, color: "text-cyan-500 bg-cyan-500/5 dark:bg-cyan-500/10" },
    { name: "Branding", tag: "branding", desc: "Premium strategy lines and minimalist layouts.", icon: Award, color: "text-yellow-600 bg-yellow-500/5 dark:bg-yellow-500/10" },
  ];

  const mockNotifications = [
    { id: 1, text: "Aravind S published a new story in Culture Shelf.", time: "2 hrs ago" },
    { id: 2, text: "Your post 'The Typography of Luxury' gained 15 likes today.", time: "5 hrs ago" },
    { id: 3, text: "Elena Rostova commented on your article.", time: "1 day ago" },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-500 ease-out ${
        scrolled 
          ? "bg-[#FDFBF7]/85 dark:bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40 py-2.5 shadow-xl shadow-zinc-950/5" 
          : "bg-[#FDFBF7] dark:bg-zinc-950 border-b border-zinc-200/20 dark:border-zinc-800/20 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/10 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex flex-col">
            <span
              className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white uppercase font-serif"
              style={{ fontFamily: "Lora, serif" }}
            >
              Epoch Creative
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500 font-semibold font-sans leading-none">
              Magazine
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Bar Links */}
        <nav className="hidden lg:flex items-center gap-7 font-sans text-xs font-semibold text-zinc-650 dark:text-zinc-400">
          <Link 
            href="/" 
            className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors hover-underline-glide ${
              pathname === "/" ? "text-amber-600 dark:text-amber-400 font-bold" : ""
            }`}
          >
            Home
          </Link>
          <Link 
            href="/feed" 
            className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors hover-underline-glide ${
              pathname === "/feed" ? "text-amber-600 dark:text-amber-400 font-bold" : ""
            }`}
          >
            Explore
          </Link>

          {/* Categories Trigger Mega Dropdown (Click Action) */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setMegaMenuOpen(!megaMenuOpen);
                setProfileDropdownOpen(false);
                setNotificationsOpen(false);
              }}
              className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1 focus:outline-none ${
                megaMenuOpen ? "text-amber-600 dark:text-amber-400" : ""
              }`}
            >
              Categories <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${megaMenuOpen ? "rotate-180 text-amber-500" : ""}`} />
            </button>
          </div>

          <Link 
            href="/trending" 
            className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors hover-underline-glide ${
              pathname === "/trending" ? "text-amber-600 dark:text-amber-400 font-bold" : ""
            }`}
          >
            Trending
          </Link>
          <Link 
            href="/latest" 
            className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors hover-underline-glide ${
              pathname === "/latest" ? "text-amber-600 dark:text-amber-400 font-bold" : ""
            }`}
          >
            Latest
          </Link>
          <Link 
            href="/about" 
            className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors hover-underline-glide ${
              pathname === "/about" ? "text-amber-600 dark:text-amber-400 font-bold" : ""
            }`}
          >
            About
          </Link>
          <a 
            href="#newsletter" 
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors hover-underline-glide"
          >
            Contact
          </a>
        </nav>

        {/* Right Side Tools (Search, Theme, Notify, Actions) */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Expanded Luxury Search Form */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative group">
            <input 
              type="text"
              placeholder="Search journals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 focus:w-56 bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-amber-500/40 focus:bg-white dark:focus:bg-zinc-950 rounded-full py-1.5 pl-4 pr-10 text-[11px] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-amber-500/5 transition-all duration-500"
            />
            <button 
              type="submit" 
              className="absolute right-3 text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors p-1 z-10"
              aria-label="Click to search"
            >
              <Search className="w-3.5 h-3.5 transition-transform duration-300 hover:scale-115" />
            </button>
          </form>

          {/* Social Icons for Elegant Touch */}
          <div className="hidden lg:flex items-center gap-2.5 text-zinc-450 dark:text-zinc-550 border-r border-zinc-200/50 dark:border-zinc-800/50 pr-4">
            <a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"><Github className="w-4 h-4" /></a>
          </div>

          {/* Light/Dark Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition-colors relative"
            aria-label="Theme toggle"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setNotificationsOpen(!notificationsOpen);
                setMegaMenuOpen(false);
                setProfileDropdownOpen(false);
              }}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </button>
            
            {notificationsOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in text-xs font-sans text-zinc-600 dark:text-zinc-400"
              >
                <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                  <span className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px]">Notifications</span>
                  <span className="text-[9px] text-amber-500 font-semibold cursor-pointer">Mark all read</span>
                </div>
                <div className="space-y-2.5">
                  {mockNotifications.map(n => (
                    <div key={n.id} className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-xl transition-colors">
                      <p className="leading-snug text-zinc-850 dark:text-zinc-300">{n.text}</p>
                      <span className="text-[9px] text-zinc-400 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile dropdown or Sign-in Links */}
          <div className="relative">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setMegaMenuOpen(false);
                    setNotificationsOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-amber-500/20 hover:scale-105 active:scale-100 transition-all focus:outline-none"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>

                {profileDropdownOpen && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-3 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-fade-in text-xs font-sans"
                  >
                    <div className="px-3.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-500">
                      <span className="block font-bold text-zinc-800 dark:text-zinc-250 truncate">{user.name}</span>
                      <span className="text-[10px] truncate block">{user.email}</span>
                    </div>
                    <Link
                      href="/write"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-amber-50/50 dark:hover:bg-zinc-800 hover:text-amber-600 dark:hover:text-amber-400 font-semibold transition-colors"
                    >
                      <PenLine className="w-3.5 h-3.5" />
                      Write Post
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-destructive/5 hover:text-destructive font-semibold transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-zinc-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/signin">
                  <Button variant="ghost" className="text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 h-9 px-4 text-xs font-semibold rounded-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 h-9 px-4 text-xs font-semibold shadow-md">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Write a Post CTA (Always present for premium look) */}
          <Link href="/write" className="hidden md:inline-block">
            <Button size="sm" className="gap-1.5 bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-full border-0 px-4 h-9 text-[10px] font-bold uppercase tracking-wider hover:scale-[1.03] active:scale-100 transition-all shadow-md shadow-orange-500/10">
              <PenLine className="w-3.5 h-3.5" />
              Write
            </Button>
          </Link>

          {/* Mobile Hamburger menu */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Category Mega Dropdown (Full Width / Grid sheet triggered by Click) */}
      {megaMenuOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 right-0 top-full bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl py-8 backdrop-blur-xl animate-fade-in z-50"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-900">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 font-serif" style={{ fontFamily: "Lora, serif" }}>
                  Discover Creative Spheres
                </h3>
                <p className="text-[11px] text-zinc-450 dark:text-zinc-550 mt-0.5 font-sans font-light">Explore our meticulously sorted shelves of storytelling culture, codes, and architecture logs.</p>
              </div>
              <Link 
                href="/feed"
                onClick={() => setMegaMenuOpen(false)}
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 flex items-center gap-1 group/link font-sans"
              >
                Explore all stories <ChevronDown className="w-3 h-3 -rotate-90 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {megaCategories.map((card) => {
                const IconComponent = card.icon;
                return (
                  <Link
                    key={card.name}
                    href={`/category/${card.tag}`}
                    onClick={() => setMegaMenuOpen(false)}
                    className="p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-all duration-300 flex items-start gap-3.5 group border border-transparent hover:border-zinc-200/40 dark:hover:border-zinc-800/40 cursor-pointer"
                  >
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.color} group-hover:scale-105 transition-transform duration-300`}>
                      <IconComponent className="w-4.5 h-4.5" />
                    </span>
                    <div className="space-y-1 font-sans">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white capitalize group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                        {card.name}
                      </h4>
                      <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-light leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer (Responsive slide out panel) */}
      {mobileMenuOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl z-40 animate-fade-in font-sans space-y-6"
        >
          
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <input 
              type="text"
              placeholder="Search journals, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-amber-500/50 focus:bg-white dark:focus:bg-zinc-950 rounded-full py-2 pl-4 pr-10 text-xs text-zinc-900 dark:text-white focus:outline-none"
            />
            <button type="submit" className="absolute right-3.5 text-zinc-450 dark:text-zinc-500 z-10" aria-label="Search mobile">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Nav links */}
          <div className="flex flex-col gap-4 font-semibold text-sm text-zinc-700 dark:text-zinc-350">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-500 transition-colors">Home</Link>
            <Link href="/feed" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-500 transition-colors">Explore Feed</Link>
            <Link href="/trending" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-500 transition-colors">Trending Narratives</Link>
            <Link href="/latest" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-500 transition-colors">Latest Posts</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-500 transition-colors">About Us</Link>
          </div>

          {/* Categories Grid Mobile */}
          <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-900 pt-4">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-amber-600 dark:text-amber-500">Categories</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {megaCategories.map(c => (
                <Link
                  key={c.name}
                  href={`/category/${c.tag}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl hover:text-amber-500 transition-colors capitalize"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions button */}
          {!user && (
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
              <Link href="/signin" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                <Button variant="outline" className="w-full rounded-full h-10 text-xs font-semibold">Log in</Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                <Button className="w-full rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 h-10 text-xs font-semibold">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      )}

    </header>
  );
}
