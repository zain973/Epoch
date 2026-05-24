"use client";

import Link from "next/link";
import { Sparkles, Heart, Compass, BookOpen, Film, ArrowRight, Award } from "lucide-react";
import TopNavbar from "@/components/TopNavbar";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 font-sans">
      <TopNavbar />

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Cinematic Header Block */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 shadow-lg shadow-orange-500/10 mb-4 animate-bounce">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ fontFamily: "Lora, serif" }}>
            Epoch Creative
          </h1>
          <p className="text-amber-700 text-sm font-bold uppercase tracking-widest">
            Stories that build bonds, experiences that define eras.
          </p>
          <p className="text-zinc-600 text-lg max-w-2xl mx-auto font-light leading-relaxed pt-2">
            We are a premium brand storytelling hub blending cinematic film production, elegant design, and bespoke digital strategy to capture and preserve cultural narratives globally.
          </p>
        </section>

        {/* Brand Mission & Philosophy Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <div className="bg-white border border-zinc-200/80 p-8 rounded-3xl shadow-md relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 mb-6 shrink-0">
              <Compass className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "Lora, serif" }}>Our Mission</h3>
            <p className="text-zinc-600 text-sm leading-relaxed font-light">
              To strip away visual digital noise and unearth the authentic, highly detailed human updates that shape modern design libraries, ensuring traditional craftsmanship and digital creativity coexist beautifully.
            </p>
          </div>

          <div className="bg-white border border-zinc-200/80 p-8 rounded-3xl shadow-md relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl" />
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700 mb-6 shrink-0">
              <Film className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "Lora, serif" }}>Cinematic Philosophy</h3>
            <p className="text-zinc-600 text-sm leading-relaxed font-light">
              We treat every corporate update, code log, and folklore study as a documentary shoot—analyzing shadows, spacing, and pacing to give our visionaries an elite, premium storytelling dashboard.
            </p>
          </div>
        </section>

        {/* Timeline Journey Section */}
        <section className="space-y-6 pt-6">
          <h3 className="text-3xl font-bold text-center" style={{ fontFamily: "Lora, serif" }}>Our Journey</h3>
          
          <div className="space-y-8 relative before:absolute before:left-4 md:before:left-1/2 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-200">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-6 relative">
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-amber-500 rounded-full border-4 border-white shadow shrink-0" />
              <div className="pl-10 md:pl-0 md:w-1/2 md:text-right md:pr-10 space-y-1">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Late 2023</span>
                <h4 className="font-bold text-base text-zinc-900">Spawning the Network</h4>
                <p className="text-zinc-500 text-xs font-light max-w-sm md:ml-auto">Formed as a decentralized community of documentary film producers and digital strategy engineers.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-6 relative">
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-rose-500 rounded-full border-4 border-white shadow shrink-0" />
              <div className="pl-10 md:pl-10 md:w-1/2 md:translate-x-full space-y-1">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Mid 2024</span>
                <h4 className="font-bold text-base text-zinc-900">Cultural Muralism Project</h4>
                <p className="text-zinc-500 text-xs font-light max-w-sm">Commissioned global open-air galleries, mapping traditional folklore directly onto city brick walls.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-6 relative">
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-zinc-950 rounded-full border-4 border-white shadow shrink-0" />
              <div className="pl-10 md:pl-0 md:w-1/2 md:text-right md:pr-10 space-y-1">
                <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Spring 2026</span>
                <h4 className="font-bold text-base text-zinc-900">Launching the Editorial Hub</h4>
                <p className="text-zinc-500 text-xs font-light max-w-sm md:ml-auto">Merged all journals, coding logs, and sacred blueprint reviews into the single, premium, database-backed portal you browse today.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="bg-zinc-950 text-white rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-tr from-amber-500/10 to-rose-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "Lora, serif" }}>
            Participate in the Narrative
          </h2>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto font-light leading-relaxed">
            Have a traditional art case study, architectural analysis, or creative code log you want to share with the world under open-access grids?
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link href="/write">
              <Button className="rounded-full bg-white text-zinc-950 px-6 h-11 text-xs font-semibold hover:bg-zinc-100 flex items-center gap-1.5 shadow-md">
                Start Writing <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/feed">
              <Button variant="outline" className="rounded-full border-zinc-700 hover:bg-zinc-900 text-white px-6 h-11 text-xs font-semibold">
                Explore Stories
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-450 mt-12 bg-white">
        &copy; {new Date().getFullYear()} Epoch Creative. All rights reserved. Visionaries About Portal.
      </footer>
    </div>
  );
}
