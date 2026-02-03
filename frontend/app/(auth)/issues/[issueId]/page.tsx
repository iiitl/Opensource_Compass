"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import IssueHeader from "./components/issueheader";
import IssueMeta from "./components/issuemeta";
import AIExplanationCard from "./components/aiexplanationcard";
import SuggestedSteps from "./components/suggestedsteps";
import ActionPanel from "./components/actionpanel";

export default function IssueDetailPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".issue-animate", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="max-w-3xl space-y-8"
    >
      <div className="issue-animate">
        <IssueHeader />
      </div>

      <div className="issue-animate">
        <IssueMeta />
      </div>

      <div className="issue-animate">
        <AIExplanationCard />
      </div>

      <div className="issue-animate">
        <SuggestedSteps />
      </div>

      <div className="issue-animate">
        <ActionPanel />
      </div>
    </div>
  );
}
