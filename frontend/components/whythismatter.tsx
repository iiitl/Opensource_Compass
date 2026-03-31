"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AlertTriangle,
  BookOpen,
  Compass,
  CheckCircle,
  XCircle,
  ArrowRight
} from "lucide-react";
import { PainPointCard } from "./ui/painpointcard";
import { SolutionCard } from "./ui/solutioncard";

gsap.registerPlugin(ScrollTrigger);

export default function WhyThisMattersSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate columns from sides
      gsap.fromTo(
        ".problem-col",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        ".solution-col",
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        }
      );
      
      // Animate center connector
      gsap.fromTo(
        ".connector-line",
        { scaleY: 0, opacity: 0 },
        {
          scaleY: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="approach" ref={containerRef} className="bg-[#0d1117] text-white py-32 relative overflow-hidden">
        {/* Background Gradients - Distinct sides */}
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-green-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 why-animate">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Why this matters
          </h2>
          <p className="mt-4 text-[#8b949e] text-lg md:text-xl">
            Starting open source is hard. We fix the broken onboarding experience.
          </p>
        </div>

        {/* COMPARISON LAYOUT */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            
            {/* Center Connector (Desktop only) */}
            <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 -ml-px w-0.5 bg-gradient-to-b from-transparent via-[#30363d] to-transparent connector-line flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#0d1117] border border-[#30363d] flex items-center justify-center z-10">
                    <ArrowRight className="w-4 h-4 text-[#8b949e]" />
                </div>
            </div>

          {/* LEFT: The Struggle (Problems) */}
          <div className="space-y-6 problem-col relative">
            <div className="flex items-center gap-3 mb-8 pl-2">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <XCircle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-2xl font-semibold text-white">The Typical Struggle</h3>
            </div>
            
            <div className="relative group">
                {/* Connecting line for cards */}
                <div className="absolute left-6 top-8 bottom-0 w-px bg-gradient-to-b from-red-500/20 to-transparent md:hidden" />
                
                <div className="space-y-6">
                    <PainPointCard
                    icon={<AlertTriangle className="h-5 w-5 text-[#f85149]" />}
                    title="Overwhelmed by Choice"
                    description="GitHub hosts millions of projects. Finding one that matches your skill level and tech stack feels like finding a needle in a haystack."
                    />

                    <PainPointCard
                    icon={<BookOpen className="h-5 w-5 text-[#f85149]" />}
                    title="Ambiguous Issues"
                    description='"Fix bug in styling" — Issues often lack context, reproduction steps, or guidance, leaving beginners lost before they even start.'
                    />
                </div>
            </div>
          </div>

          {/* RIGHT: The Solution (Compass) */}
          <div className="space-y-6 solution-col relative">
             <div className="flex items-center gap-3 mb-8 pl-2 md:pl-0 md:justify-end">
                <h3 className="text-2xl font-semibold text-white order-2 md:order-1">The Compass Way</h3>
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 order-1 md:order-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
            </div>

            <div className="space-y-6">
                <SolutionCard
                icon={<Compass className="h-5 w-5 text-[#3fb950]" />}
                title="Curated Discovery"
                description="Our AI filters out inactive repos and surfaces active, welcoming projects that specifically need your skills."
                />

                <SolutionCard
                icon={<CheckCircle className="h-5 w-5 text-[#3fb950]" />}
                title="Actionable Guidance"
                description="We break down complex issues into simple, step-by-step contribution plans so you know exactly what to do."
                />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
