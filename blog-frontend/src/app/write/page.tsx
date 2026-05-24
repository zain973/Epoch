import TopNavbar from "@/components/TopNavbar";
import PublishForm from "@/components/PublishForm";

export const metadata = {
  title: "Write — Epoch Creative",
};

export default function WritePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <TopNavbar />

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-3"
            style={{ fontFamily: "Lora, serif" }}
          >
            Create a New Narrative
          </h1>
          <p className="text-zinc-600 text-lg leading-relaxed">
            Publish case studies, design logs, strategic insights, or announcements directly to the Epoch Creative hub.
          </p>
        </div>

        {/* Elegant Editorial Card Wrapper */}
        <div className="bg-white/60 backdrop-blur-md border border-zinc-200/80 rounded-2xl p-8 md:p-12 shadow-xl shadow-zinc-950/5 relative overflow-hidden">
          {/* Subtle warm decorative mesh glow in the top-right corner */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-tr from-amber-500/5 to-rose-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <PublishForm />
        </div>
      </main>
    </div>
  );
}
