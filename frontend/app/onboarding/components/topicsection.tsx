"use client";

import { Globe, Smartphone, Brain, Cloud, Gamepad2, Shield, Database, Wrench } from "lucide-react";

interface TopicSectionProps {
    selected: string[];
    setSelected: (topics: string[]) => void;
}

const topics = [
    { name: "Web Development", icon: Globe, emoji: "🌐" },
    { name: "Mobile Development", icon: Smartphone, emoji: "📱" },
    { name: "AI & Machine Learning", icon: Brain, emoji: "🤖" },
    { name: "DevOps & Cloud", icon: Cloud, emoji: "⚙️" },
    { name: "Game Development", icon: Gamepad2, emoji: "🎮" },
    { name: "Security", icon: Shield, emoji: "🔐" },
    { name: "Data Science", icon: Database, emoji: "📊" },
    { name: "Tools & Libraries", icon: Wrench, emoji: "🛠️" },
];

export default function TopicSection({ selected, setSelected }: TopicSectionProps) {
    const toggleTopic = (topicName: string) => {
        if (selected.includes(topicName)) {
            setSelected(selected.filter((t) => t !== topicName));
        } else {
            setSelected([...selected, topicName]);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold">What interests you?</h3>
                <p className="text-sm text-[#8b949e] mt-1">
                    Select the areas you'd like to explore (optional)
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {topics.map((topic) => {
                    const Icon = topic.icon;
                    const isSelected = selected.includes(topic.name);

                    return (
                        <button
                            key={topic.name}
                            onClick={() => toggleTopic(topic.name)}
                            className={`
                                relative p-4 rounded-lg border transition-all
                                ${isSelected
                                    ? "bg-[#1f6feb]/10 border-[#1f6feb]"
                                    : "bg-[#161b22] border-[#30363d] hover:border-[#8b949e]"
                                }
                            `}
                        >
                            <div className="flex flex-col items-center text-center gap-2">
                                <span className="text-3xl">{topic.emoji}</span>
                                <span className="text-xs font-medium leading-tight">
                                    {topic.name}
                                </span>
                            </div>
                            
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-4 h-4 bg-[#1f6feb] rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
