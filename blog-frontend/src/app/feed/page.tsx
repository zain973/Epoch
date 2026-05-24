import { Suspense } from "react";
import TopNavbar from "@/components/TopNavbar";
import FeedContainer from "@/components/FeedContainer";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Explore Feed — Epoch Creative",
  description: "Browse premium, open-access stories, case studies, and editorial design articles.",
};

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      <TopNavbar />

      {/* Immersive Cultural Storytelling Hero Section */}
      <section 
        className="relative w-full h-[380px] md:h-[420px] overflow-hidden flex items-center justify-center bg-zinc-950"
        style={{
          backgroundImage: "url('/cultural_mural_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Deep, highly cinematic dark ambient overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        
        {/* Subtle warm light glow behind the central box */}
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Central Editorial Box */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="border border-white/10 p-8 md:p-12 rounded-3xl bg-black/40 backdrop-blur-md shadow-2xl relative overflow-hidden">
            
            {/* Header Title */}
            <h1
              className="text-2xl md:text-4xl font-extrabold tracking-widest text-white leading-tight uppercase font-serif"
              style={{ fontFamily: "Lora, serif" }}
            >
              The Silent Canvas
            </h1>

            {/* Gradient Amber/Rose Editorial Line */}
            <div className="w-24 h-[1.5px] bg-gradient-to-r from-amber-500 via-orange-400 to-rose-500 mx-auto my-4" />

            {/* Introductory Paragraph */}
            <p className="text-zinc-300 text-xs md:text-sm italic font-light leading-relaxed max-w-2xl mx-auto">
              Welcome to the Epoch Creative Shelf — an open-access digital journal archiving authentic folk traditions, design principles, silent cinematography, and software paradigms.
            </p>

            {/* Secondary Paragraph (Responsive) */}
            <p className="text-zinc-500 text-[10px] md:text-xs font-light leading-relaxed max-w-xl mx-auto mt-3 hidden sm:block">
              We present slow, curated studies exploring how timeless cultural craftsmanship intersects with minimalist UI grids and modern software architecture.
            </p>
          </div>
        </div>
      </section>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Suspense wrapper for Next.js build correctness */}
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <p className="text-xs">Assembling the library...</p>
          </div>
        }>
          <FeedContainer />
        </Suspense>

      </main>
    </div>
  );
}
