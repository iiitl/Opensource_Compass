"use client";


import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "./ui/button";
import { Github } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.fromTo(".cta-content", 
            { opacity: 0, scale: 0.95, y: 30 },
            { 
                opacity: 1, 
                scale: 1, 
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-[#010409] text-white py-28 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="relative overflow-hidden rounded-2xl border border-[#30363d] bg-[#0d1117]/80 backdrop-blur-sm p-10 text-center cta-content shadow-2xl shadow-blue-900/20 group hover:border-[#2f81f7]/50 transition-colors duration-500">
          
          {/* subtle top glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2f81f7] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2f81f7]/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Animated animated-grid-bg equivalent or particles could go here if we had them */}

          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight relative z-10">
            Ready to make your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">first contribution?</span>
          </h2>

          <p className="mt-4 text-[#8b949e] text-base md:text-lg max-w-2xl mx-auto relative z-10">
            Discover beginner-friendly repositories, understand issues clearly,
            and start contributing with confidence — guided every step of the way.
          </p>

          <div className="mt-8 flex justify-center relative z-10">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3fb950] text-white px-8 py-6 text-lg font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-900/30 border border-green-600/50"
            >
              <Link href="/onboarding">
                <Github className="mr-2 h-5 w-5" />
                Continue with GitHub
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-[#6e7681] relative z-10 flex items-center justify-center gap-4">
            <span>✨ No credit card</span>
            <span className="w-1 h-1 rounded-full bg-[#30363d]" />
            <span>🔒 Read-only GitHub access</span>
            <span className="w-1 h-1 rounded-full bg-[#30363d]" />
            <span>❤️ Free & open source</span>
          </p>
        </div>
      </div>
    </section>
  );
}
