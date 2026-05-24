"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PenLine, Sparkles, LogOut, User, ChevronDown, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const isWritePage = pathname === "/write";
  
  const handleLogout = () => {
    logout();
    toast({ title: "Signed out successfully" });
    router.push("/signin");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/feed?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categoriesList = ["culture", "art", "heritage", "design", "architecture", "photography", "branding"];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-[#FDFBF7]/80 backdrop-blur-md">
      {/* 1. UTILITY HEADER BAR */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-md shadow-orange-500/10">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-xl font-bold tracking-tight text-zinc-900 group-hover:text-amber-600 transition-colors uppercase font-serif"
            style={{ fontFamily: "Lora, serif" }}
          >
            Epoch Creative
          </span>
        </Link>

        {/* Live Search Widget */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative w-72">
          <Search className="w-4 h-4 absolute left-3.5 text-zinc-400" />
          <Input
            placeholder="Search logs, heritage, photography..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 rounded-full border-zinc-200 bg-white/70 text-xs focus:ring-amber-500/20 text-zinc-900"
          />
        </form>

        {/* User Account actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-700 text-[10px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-zinc-500 hover:text-destructive hover:bg-destructive/5 transition-colors gap-1.5 rounded-full text-xs font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signin">
                <Button variant="ghost" className="text-zinc-600 hover:bg-zinc-100 h-9 px-4 text-xs font-semibold rounded-full">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-full bg-zinc-950 text-white hover:opacity-90 h-9 px-4 text-xs font-semibold">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 2. RESPONSIVE NAVIGATION MENU */}
      <nav className="border-t border-zinc-100 bg-[#FDFBF7]/40">
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6 font-semibold text-zinc-650">
            <Link 
              href="/" 
              className={`hover:text-amber-500 transition-colors ${pathname === "/" ? "text-amber-600 font-bold" : ""}`}
            >
              Home
            </Link>
            <Link 
              href="/feed" 
              className={`hover:text-amber-500 transition-colors ${pathname === "/feed" ? "text-amber-600 font-bold" : ""}`}
            >
              Explore
            </Link>

            {/* Categories dropdown */}
            <div className="relative">
              <button 
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="hover:text-amber-500 transition-colors flex items-center gap-0.5"
              >
                Categories <ChevronDown className="w-3 h-3" />
              </button>
              {categoryDropdownOpen && (
                <div className="absolute left-0 mt-2 w-44 rounded-xl shadow-xl border p-1.5 z-50 bg-white border-zinc-200">
                  {categoriesList.map(cat => (
                    <Link
                      key={cat}
                      href={`/category/${cat}`}
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="block text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-amber-50 hover:text-amber-600 capitalize transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/trending" 
              className={`hover:text-amber-500 transition-colors ${pathname === "/trending" ? "text-amber-600 font-bold" : ""}`}
            >
              Trending
            </Link>
            <Link 
              href="/latest" 
              className={`hover:text-amber-500 transition-colors ${pathname === "/latest" ? "text-amber-600 font-bold" : ""}`}
            >
              Latest Posts
            </Link>
            <Link 
              href="/about" 
              className={`hover:text-amber-500 transition-colors ${pathname === "/about" ? "text-amber-600 font-bold" : ""}`}
            >
              About
            </Link>
          </div>

          <Link href="/write">
            <Button size="sm" className="gap-1.5 bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-full border-0 px-3.5 h-7 text-[10px] font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-100 transition-all shadow-md">
              <PenLine className="w-3 h-3" />
              Write
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
