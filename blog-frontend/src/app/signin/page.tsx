"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, Loader2, Eye, EyeOff, Film, ArrowRight, Compass } from "lucide-react";

export default function SignInPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      toast({ title: "Welcome to Epoch! ✨", description: "You have signed in successfully." });
      router.push("/feed");
    } else {
      toast({ title: "Sign in failed", description: "Invalid credentials.", variant: "destructive" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col lg:flex-row font-sans">
      {/* Left decorative/cinematic panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-950 flex-col justify-between p-12 relative overflow-hidden text-white">
        {/* Animated ambient mesh gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-600/10 blur-[120px] animate-pulse duration-[6s]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[65%] h-[65%] rounded-full bg-gradient-to-tr from-rose-500/10 to-amber-500/20 blur-[140px] animate-pulse duration-[8s] delay-1000" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        {/* Top brand signature */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/10">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-wider uppercase font-sans text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-100">
            Epoch Creative
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10 max-w-lg my-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400" style={{ fontFamily: "Lora, serif" }}>
              Stories that build bonds, experiences that define eras.
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              We craft premium brand narratives by blending cinematic film production, elegant design, and bespoke digital strategy.
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t border-zinc-800/80">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center shrink-0">
                <Film className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-100">Cinematic Case Studies</h4>
                <p className="text-zinc-400 text-sm mt-1">Deep dives into our commercial productions, creative shorts, and behind-the-scenes processes.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-100">Strategic Insights</h4>
                <p className="text-zinc-400 text-sm mt-1">Thought-provoking essays on digital campaigns, design philosophy, and the future of brand storytelling.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-zinc-600 text-xs">
          &copy; {new Date().getFullYear()} Epoch Creative. All rights reserved. Built for visionaries.
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 min-h-screen">
        <div className="w-full max-w-[420px] space-y-8">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-wider uppercase text-zinc-900">
              Epoch Creative
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-semibold text-zinc-900 tracking-tight" style={{ fontFamily: "Lora, serif" }}>
              Welcome back
            </h2>
            <p className="text-zinc-600">
              New to our creative portal?{" "}
              <Link href="/signup" className="text-amber-600 font-medium hover:text-amber-700 transition-colors inline-flex items-center gap-0.5 hover:underline">
                Register an account <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>

          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-700 font-medium text-sm">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-12 border-zinc-200/80 bg-white/70 backdrop-blur-sm px-4 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all text-zinc-900"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-zinc-700 font-medium text-sm">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-12 border-zinc-200/80 bg-white/70 backdrop-blur-sm pl-4 pr-11 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all text-zinc-900"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-12 text-base font-medium rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 transition-all hover:scale-[1.01] shadow-md shadow-zinc-950/10 active:scale-100"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? "Signing in…" : "Sign in to Portal"}
            </Button>
          </div>

          <div className="rounded-2xl bg-amber-50/50 border border-amber-100 p-4 text-xs text-amber-800 leading-relaxed">
            <span className="font-semibold">💡 Professional Access Tip:</span> In demo mode, you can sign in using any email and password to explore our creative case studies and publish updates.
          </div>
        </div>
      </div>
    </div>
  );
}
