"use client";

import {
  AlertTriangle,
  BookOpen,
  Compass,
  CheckCircle,
} from "lucide-react";
import { PainPointCard } from "./ui/painpointcard";
import { SolutionCard } from "./ui/solutioncard";

export default function WhyThisMattersSection() {
  return (
    <section className="bg-[#0d1117] text-white py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Why this matters
          </h2>
          <p className="mt-3 text-[#8b949e] text-base md:text-lg">
            Open source is powerful — but starting without guidance
            often feels overwhelming.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Problems */}
          <div className="space-y-4">
            <PainPointCard
              icon={<AlertTriangle className="h-5 w-5 text-[#f85149]" />}
              title="Too many repositories"
              description="GitHub hosts millions of projects, but very few are suitable for beginners looking to make their first contribution."
            />

            <PainPointCard
              icon={<BookOpen className="h-5 w-5 text-[#f85149]" />}
              title="Unclear issues"
              description="Issues often lack context, making it hard to understand what needs to be done or where to start."
            />
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <SolutionCard
              icon={<Compass className="h-5 w-5 text-[#3fb950]" />}
              title="Guided discovery"
              description="We recommend repositories that match your interests and are active, welcoming, and contribution-ready."
            />

            <SolutionCard
              icon={<CheckCircle className="h-5 w-5 text-[#3fb950]" />}
              title="Clear next steps"
              description="AI explains issues in simple terms and suggests actionable steps so you can contribute confidently."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
