"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import AuthCard from "./components/authcard";
import ProgressStepper from "./components/progress";
import TechSection from "./components/techsection";
import StickyActionBar from "./components/stickyactionbar";
import FrameworkSection from "./components/frameworksection";
import DomainSection from "./components/domainsection";


export default function OnboardingPage() {
    const [frameworks, setFrameworks] = useState<string[]>([]);
    const [domains, setDomains] = useState<string[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".onboard-animate", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#0d1117] text-white flex justify-center"
    >
      <div className="w-full max-w-3xl px-6 py-16 space-y-12">
        
        <div className="onboard-animate">
          <AuthCard />
        </div>

        <div className="onboard-animate">
          <ProgressStepper currentStep={2} />
        </div>

        <div className="onboard-animate">
          <TechSection
            title="Programming Languages"
            subtitle="Select at least one language you are comfortable with"
            options={[
              "JavaScript",
              "TypeScript",
              "Python",
              "Java",
              "Go",
              "Rust",
              "C++",
            ]}
            required
            selected={selectedLanguages}
            setSelected={setSelectedLanguages}
          />
          <FrameworkSection
    selected={frameworks}
    setSelected={setFrameworks}
  />
</div>

<div className="onboard-animate">
  <DomainSection
    selected={domains}
    setSelected={setDomains}
  />
        </div>

        <StickyActionBar isValid={selectedLanguages.length > 0} />
      </div>
    </div>
  );
}
