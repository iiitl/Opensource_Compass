"use client";

import Particles from "@/components/ui/particles";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Background Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <Particles
          className="absolute inset-0"
          quantity={50}
          staticity={30}
          ease={50}
          refresh
        />
      </div>

      {/* Ambient Background Gradients */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen fixed" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen fixed" />

      {/* Content */}
      <div className="relative z-10 pb-20">
        {children}
      </div>
    </div>
  );
}
