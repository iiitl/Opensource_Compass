"use client";

import { Button } from "../ui/button";
import { Github } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="bg-[#010409] text-white py-28">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-2xl border border-[#30363d] bg-[#0d1117] p-10 text-center">
          
          {/* subtle top glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2f81f7] to-transparent" />

          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Ready to make your first contribution?
          </h2>

          <p className="mt-4 text-[#8b949e] text-base md:text-lg max-w-2xl mx-auto">
            Discover beginner-friendly repositories, understand issues clearly,
            and start contributing with confidence — guided every step of the way.
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              className="bg-[#238636] hover:bg-[#2ea043] text-white px-7 py-6 text-base font-medium"
            >
              <Github className="mr-2 h-5 w-5" />
              Continue with GitHub
            </Button>
          </div>

          <p className="mt-4 text-xs text-[#6e7681]">
            No credit card • Read-only GitHub access • Free & open source
          </p>
        </div>
      </div>
    </section>
  );
}
