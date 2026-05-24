import TopNavbar from "@/components/TopNavbar";
import FeedContainer from "@/components/FeedContainer";

export const metadata = {
  title: "Feed — Epoch Creative",
};

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-950">
      <TopNavbar />

      {/* Immersive Cultural Storytelling Hero Section */}
      <section 
        className="relative w-full h-[460px] md:h-[500px] overflow-hidden flex items-center justify-center bg-zinc-950"
        style={{
          backgroundImage: "url('/cultural_mural_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Deep, highly cinematic dark ambient overlay */}
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
        
        {/* Subtle warm light glow behind the central box */}
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Central Editorial Box */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="border border-white/20 p-8 md:p-12 rounded-2xl bg-black/45 backdrop-blur-md shadow-2xl relative overflow-hidden">
            
            {/* Header Title */}
            <h1
              className="text-3xl md:text-5xl font-extrabold tracking-widest text-white leading-tight uppercase"
              style={{ fontFamily: "Lora, serif" }}
            >
              Celebrating Culture <br className="hidden md:inline" />
              Through Stories and Art
            </h1>

            {/* Gradient Amber/Rose Editorial Line */}
            <div className="w-36 h-[1.5px] bg-gradient-to-r from-amber-500 via-orange-400 to-rose-500 mx-auto my-6" />

            {/* Introductory Paragraph */}
            <p className="text-zinc-200 text-sm md:text-base italic font-light leading-relaxed max-w-2xl mx-auto">
              Welcome to the Epoch Creative Blog — a digital space dedicated to preserving, celebrating, and exploring the vibrant tapestry of traditions, cultural storytelling, and creative shorts from around the world.
            </p>

            {/* Secondary Paragraph (Responsive) */}
            <p className="text-zinc-400 text-xs md:text-sm font-light leading-relaxed max-w-2xl mx-auto mt-4 hidden sm:block">
              Through compelling case studies, creative logs, and strategic brand campaigns, we spotlight the rich perspectives and visual depth that authentic design brings to our modern digital experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Main Page Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Section Title */}
        <div className="mb-10 border-b border-zinc-200 pb-6 flex justify-between items-end">
          <div>
            <h2
              className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-2"
              style={{ fontFamily: "Lora, serif" }}
            >
              Latest Creative Logs
            </h2>
            <p className="text-zinc-600 text-sm">
              Explore the latest articles, design insights, and cultural stories from our visionaries.
            </p>
          </div>
        </div>

        {/* Article Grid */}
        <FeedContainer />
      </main>
    </div>
  );
}
