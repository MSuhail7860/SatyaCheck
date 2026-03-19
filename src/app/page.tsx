import { VerificationEngine } from "@/components/verification-engine";
import { RecentScans } from "@/components/recent-scans";
import { ParticleCanvas } from "@/components/particle-canvas";
import { ShieldCheck, SearchCheck, BrainCircuit } from "lucide-react";
import { AnimatedStats } from "@/components/animated-stats";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] pt-16 px-4 md:px-8 pb-20 relative">

      {/* Hero Section */}
      <div className="max-w-4xl text-center space-y-6 mb-10 z-10 relative w-full">
        
        {/* Particle background scoped to hero */}
        <div className="absolute inset-0 -top-16 bottom-0 overflow-hidden pointer-events-none rounded-3xl">
          <ParticleCanvas />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-4">
            <span className="flex h-2 w-2 rounded-full bg-truth animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground/80">Gemini 2.5 Flash Powered</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/40 leading-tight pb-2">
            Verify Information <br className="hidden md:block"/>Before You Share
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto font-medium">
            Advanced AI misinformation detection. Instantly verify suspicious WhatsApp
            forwards, SMS warnings, manipulated images, URLs and social media claims.
          </p>

          {/* Animated Stats Row */}
          <AnimatedStats />
        </div>
      </div>

      <VerificationEngine />
      <RecentScans />

      {/* How it Works Section */}
      <div className="mt-24 max-w-5xl w-full z-10 relative">
        <h2 className="text-center text-3xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">How SatyaCheck Works</h2>
        <div className="grid md:grid-cols-3 gap-8">

          <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-truth" />
            </div>
            <h3 className="text-xl font-bold mb-3">1. Submit Claim</h3>
            <p className="text-foreground/60 text-sm leading-relaxed">Paste text, URLs, or upload screenshots of suspicious WhatsApp forwards and social media posts.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors relative">
            <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-px bg-white/20"></div>
            <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-white/20"></div>
            <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
              <BrainCircuit className="w-8 h-8 text-truth" />
            </div>
            <h3 className="text-xl font-bold mb-3">2. AI Analysis</h3>
            <p className="text-foreground/60 text-sm leading-relaxed">Gemini 2.5 Flash analyzes the claim against known manipulation techniques, logical fallacies, and context.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
              <SearchCheck className="w-8 h-8 text-truth" />
            </div>
            <h3 className="text-xl font-bold mb-3">3. Get Verdict</h3>
            <p className="text-foreground/60 text-sm leading-relaxed">Receive an instant Trust Score, a detailed radar breakdown, viral risk assessment, and links to credible fact-checkers.</p>
          </div>

        </div>
      </div>

    </div>
  );
}
