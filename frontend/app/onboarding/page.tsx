"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import AuthCard from "./components/authcard";
import ProgressStepper from "./components/progress";
import TechSection from "./components/techsection";
import StickyActionBar from "./components/stickyactionbar";
import TopicSection from "./components/topicsection";
import ExperienceSelector from "./components/experienceselector";
import { useAuth } from "@/contexts/auth-context";
import { savePreferences } from "@/lib/api/preferences";
import Particles from "@/components/ui/particles";


export default function OnboardingPage() {
    const router = useRouter();
    const pageRef = useRef<HTMLDivElement>(null);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [experienceLevel, setExperienceLevel] = useState<string>("Beginner");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Auth state management from context
    const { isAuthenticated: isAuth, isLoading, user } = useAuth();

    const currentStep = isAuth ? 2 : 1;

    useEffect(() => {
        if (isLoading) return; // Don't animate until we know the state
        
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
    }, [isLoading, isAuth]); // Re-run animation when state changes

    const handleContinue = async () => {
        if (!user?.username) {
            setError("User information not available. Please login again.");
            return;
        }

        try {
            setIsSaving(true);
            setError(null);

            console.log("💾 Saving preferences to database:", {
                languages: selectedLanguages,
                topics: selectedTopics,
                experienceLevel: experienceLevel,
                githubUsername: user.username
            });

            await savePreferences({
                languages: selectedLanguages,
                topics: selectedTopics,
                experienceLevel: experienceLevel,
                githubUsername: user.username
            });

            console.log("✅ Preferences saved successfully");
            router.push("/discover");
        } catch (err: any) {
            console.error("❌ Failed to save preferences:", err);
            setError(err.message || "Failed to save preferences. Please try again.");
            setIsSaving(false);
        }
    };

    if (isLoading) return null; // Or a loading spinner

    return (
        <div
            ref={pageRef}
            className="min-h-screen bg-[#0d1117] text-white flex justify-center pb-24 relative overflow-hidden"
        >
             {/* Background Particles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                 <Particles
                    className="absolute inset-0"
                    quantity={40}
                    staticity={30}
                    ease={50}
                    refresh
                />
            </div>
            
             {/* Ambient Background Gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0" />


            <div className="w-full max-w-4xl px-6 py-16 space-y-12 relative z-10">

                {/* Glassmorphic Container Wrapper for content could go here, 
                    but limiting strictly to "similar effects" usually means background + card styles.
                    Since AuthCard and sections are separate, let's wrap them if they are small, 
                    or just let them float on the particles. 
                    
                    The user said "apply similar effects". The "Why This Matters" section had cards.
                    The "Hero" had particles.
                    
                    I will wrap the content in a subtle glass container to make it pop against the particles.
                */}
                
                <div className="bg-[#161b22]/60 backdrop-blur-md border border-[#30363d] rounded-2xl p-8 md:p-12 shadow-2xl">

                    {/* Step 1: Auth Card - Only show if NOT authenticated */}
                    {!isAuth && (
                        <div className="onboard-animate">
                            <AuthCard />
                        </div>
                    )}
    
                    <div className="onboard-animate mb-12">
                        <ProgressStepper currentStep={currentStep} />
                    </div>
    
                    {/* Step 2: Tech Stack - Only show if authenticated */}
                    {isAuth && (
                        <div className="space-y-12">
                            <div className="onboard-animate">
                                <TechSection
                                    title="Programming Languages"
                                    subtitle="Select the languages you're comfortable with"
                                    options={[
                                        "JavaScript",
                                        "TypeScript",
                                        "Python",
                                        "Java",
                                        "Go",
                                        "Rust",
                                        "C++",
                                        "Ruby",
                                        "PHP",
                                        "Swift",
                                        "Kotlin",
                                    ]}
                                    required
                                    selected={selectedLanguages}
                                    setSelected={setSelectedLanguages}
                                />
                            </div>
    
                            <div className="onboard-animate">
                                <TopicSection
                                    selected={selectedTopics}
                                    setSelected={setSelectedTopics}
                                    />
                            </div>
    
                            <div className="onboard-animate">
                                <ExperienceSelector
                                    selected={experienceLevel}
                                    setSelected={setExperienceLevel}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sticky Action Bar - Only show if authenticated (Step 2) */}
                {isAuth && (
                    <div className="onboard-animate">
                        <StickyActionBar 
                            isValid={selectedLanguages.length > 0} 
                            onContinue={handleContinue}
                            isLoading={isSaving}
                            error={error}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

