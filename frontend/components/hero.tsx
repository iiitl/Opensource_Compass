"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import gsap from "gsap";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-animate", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center bg-[#0d1117] text-white overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-[#0d1117] to-[#010409]" />

      <div className="relative z-10 max-w-6xl w-full px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        
        {/* LEFT CONTENT */}
        <div className="space-y-6 text-center md:text-left">
          <h1 className="hero-animate text-4xl md:text-5xl xl:text-6xl font-semibold leading-tight tracking-tight">
            Start Open Source the{" "}
            <span className="text-[#2f81f7]">Right Way</span>
          </h1>

          <p className="hero-animate text-base md:text-lg text-[#8b949e] max-w-xl mx-auto md:mx-0">
            Discover beginner-friendly open source projects and issues tailored
            to your tech stack — guided by AI, backed by GitHub data.
          </p>

          <div className="hero-animate flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              size="lg"
              className="bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-5 text-base font-medium"
            >
              <Github className="mr-2 h-5 w-5" />
              Continue with GitHub
            </Button>
          </div>

          <p className="hero-animate text-xs text-[#6e7681]">
            Read-only GitHub access • No spam • Open-source friendly
          </p>
        </div>

        {/* RIGHT VISUAL */}
        <div className="hidden md:block relative">
          <div
            className="
              relative aspect-[16/9]
              rounded-3xl
              border border-[#30363d]
              bg-[#161b22]
              overflow-hidden
              shadow-[0_0_100px_rgba(59,130,246,0.35)]
              scale-[1.2]
              lg:scale-[1.3]
              translate-x-10
              lg:translate-x-16
            "
          >
            <video
              src="/assets/landingvid.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>





      </div>
    </section>
  );
}