// "use client";

// import { useEffect, useRef } from "react";
// import {
//   Sparkles,
//   FolderGit2,
//   GitPullRequest,
// } from "lucide-react";
// import gsap from "gsap";
// import { TracingBeamStep } from "../ui/tracingbeam";

// const steps = [
//   {
//     title: "Choose your tech stack",
//     description:
//       "Tell us which languages, frameworks, and domains you’re interested in.",
//     Icon: Sparkles,
//   },
//   {
//     title: "Discover relevant repositories",
//     description:
//       "We analyze GitHub data to surface active and beginner-friendly projects.",
//     Icon: FolderGit2,
//   },
//   {
//     title: "Start contributing with AI guidance",
//     description:
//       "Understand issues easily and follow suggested first steps confidently.",
//     Icon: GitPullRequest,
//   },
// ];

// export default function HowItWorksSection() {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.from(".tracing-step", {
//         opacity: 0,
//         y: 40,
//         duration: 0.8,
//         stagger: 0.2,
//         ease: "power3.out",
//       });
//     }, containerRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section
//       ref={containerRef}
//       className="bg-[#010409] text-white py-24"
//     >
//       <div className="max-w-6xl mx-auto px-6 text-center">
//         {/* Header */}
//         <div className="max-w-2xl mx-auto mb-12">
//           <h2 className="text-3xl md:text-4xl font-semibold">
//             How it works
//           </h2>
//           <p className="mt-3 text-[#8b949e] text-base md:text-lg">
//             A simple, guided flow to help you start contributing
//             without overwhelm.
//           </p>
//         </div>

//         {/* Steps */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {steps.map(({ Icon, title, description }, idx) => (
//             <div
//               key={idx}
//               className="tracing-step"
//             >
//               <TracingBeamStep
//                 icon={<Icon className="h-8 w-8 text-[#2f81f7]" />}
//                 title={title}
//                 description={description}
//                 active={idx === 1} /* optional active styling */
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import {
  Sparkles,
  FolderGit2,
  GitPullRequest,
} from "lucide-react";
import { WorkflowStepCard } from "../ui/tracingbeam";
import { ArrowConnector } from "../ui/tracingbeam";

export default function WorkflowSection() {
  return (
    <section className="bg-[#010409] text-white py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold">
            How it works
          </h2>
          <p className="mt-3 text-[#8b949e] text-base md:text-lg">
            A guided workflow that takes you from interest to your
            first meaningful open-source contribution.
          </p>
        </div>

        {/* Desktop Workflow */}
        <div className="hidden md:flex items-center justify-between">
          <WorkflowStepCard
            icon={<Sparkles className="h-6 w-6 text-[#2f81f7]" />}
            title="Choose your tech stack"
            subtitle="Personalize recommendations"
            description="Select the languages, frameworks, and domains you’re interested in so we can tailor repository suggestions for you."
          />

          <ArrowConnector />

          <WorkflowStepCard
            icon={<FolderGit2 className="h-6 w-6 text-[#2f81f7]" />}
            title="Discover relevant repositories"
            subtitle="Curated & beginner-friendly"
            description="We analyze GitHub activity, labels, and maintainers to surface projects that are active and welcoming."
          />

          <ArrowConnector />

          <WorkflowStepCard
            icon={<GitPullRequest className="h-6 w-6 text-[#2f81f7]" />}
            title="Contribute with confidence"
            subtitle="AI-guided issues"
            description="Understand issues in plain English, see required skills, and follow clear first steps toward your PR."
          />
        </div>

        {/* Mobile Workflow */}
        <div className="md:hidden space-y-4">
          <WorkflowStepCard
            icon={<Sparkles className="h-6 w-6 text-[#2f81f7]" />}
            title="Choose your tech stack"
            subtitle="Personalize recommendations"
            description="Select the languages, frameworks, and domains you’re interested in so we can tailor repository suggestions."
          />

          <ArrowConnector direction="down" />

          <WorkflowStepCard
            icon={<FolderGit2 className="h-6 w-6 text-[#2f81f7]" />}
            title="Discover repositories"
            subtitle="Curated & beginner-friendly"
            description="We surface active projects with beginner-friendly issues and good community practices."
          />

          <ArrowConnector direction="down" />

          <WorkflowStepCard
            icon={<GitPullRequest className="h-6 w-6 text-[#2f81f7]" />}
            title="Contribute with confidence"
            subtitle="AI-guided issues"
            description="Understand issues easily and follow structured steps to submit your first PR."
          />
        </div>
      </div>
    </section>
  );
}
