"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CloudLightning, Github, Lightbulb } from "lucide-react";
import Particles from "@/components/ui/particles";

import Link from "next/link";
import gsap from "gsap";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  function SplitText({ text }: { text: string }) {
    return (
      <>
        {text.split("").map((char, i) => (
          <span key={i} className="hero-letter inline-block" aria-hidden>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </>
    );
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".hero-letter", {
        y: -120,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.9,
        stagger: 0.03,
        ease: "back.out(1.8)",
      })
      .from(".gradient-text", {
         opacity: 0,
         scale: 0.9,
         duration: 1,
         ease: "power2.out"
      }, "-=0.5")
        .from(
          ".hero-sub",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .from(
          ".hero-cta",
          {
            y: 16,
            opacity: 0,
            scale: 0.96,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .from(
          ".hero-foot",
          {
            opacity: 0,
            duration: 0.4,
          },
          "-=0.2",
        );
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
      
      {/* Particles Animation */}
      <div className="absolute inset-0 z-0">
        <Particles
            className="absolute inset-0"
            quantity={50}
            staticity={30}
            ease={50}
            refresh
        />
      </div>

      <div className="relative z-10 max-w-6xl w-full px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* LEFT CONTENT */}
        <div className="space-y-6 text-center md:text-left">
          
          <div className="relative">
            {/* Static background blur for text specific area */}
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-2xl"></div>
            
            <h1 className="relative text-4xl md:text-5xl xl:text-6xl font-semibold tracking-tight leading-tight">
              <span className="block overflow-visible pb-2">
                <SplitText text="Start Open Source" />
              </span>
            
              <span className="block overflow-visible -mt-2 pb-2">
                <SplitText text="the " />
                {/* Fixed "Right Way" text - Removed SplitText to ensure visibility */}
                <span className="gradient-text text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 glow-text inline-block">
                  Right Way
                </span>
              </span>
            </h1>
          </div>

          <p className="hero-sub text-base md:text-lg text-[#8b949e] max-w-xl mx-auto md:mx-0 relative z-10">
            Discover beginner-friendly open source projects and issues tailored
            to your tech stack — guided by AI, backed by GitHub data.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              asChild
              size="lg"
              className="bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-5 text-base font-medium"
            >
              <Link href="/onboarding">Get Started</Link>
            </Button>
          </div>

          <p className="hero-foot text-xs text-[#6e7681]">
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
              shadow-[0_0_100px_rgba(59,130,246,0.25)]
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
