"use client";

interface ExperienceSelectorProps {
    selected: string;
    setSelected: (level: string) => void;
}

const levels = [
    {
        value: "Beginner",
        label: "Beginner",
        description: "Looking for good first issues",
        icon: "🌱",
    },
    {
        value: "Intermediate",
        label: "Intermediate",
        description: "Ready for moderate challenges",
        icon: "🚀",
    },
    {
        value: "Advanced",
        label: "Advanced",
        description: "Want complex projects",
        icon: "⭐",
    },
];

export default function ExperienceSelector({ selected, setSelected }: ExperienceSelectorProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold">Experience Level</h3>
                <p className="text-sm text-[#8b949e] mt-1">
                    Help us find repos that match your skill level
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {levels.map((level) => {
                    const isSelected = selected === level.value;

                    return (
                        <button
                            key={level.value}
                            onClick={() => setSelected(level.value)}
                            className={`
                                relative p-5 rounded-lg border transition-all text-left
                                ${isSelected
                                    ? "bg-[#1f6feb]/10 border-[#1f6feb]"
                                    : "bg-[#161b22] border-[#30363d] hover:border-[#8b949e]"
                                }
                            `}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">{level.icon}</span>
                                <div className="flex-1">
                                    <div className="font-semibold">{level.label}</div>
                                    <div className="text-xs text-[#8b949e] mt-1">
                                        {level.description}
                                    </div>
                                </div>
                            </div>

                            {isSelected && (
                                <div className="absolute top-3 right-3 w-5 h-5 bg-[#1f6feb] rounded-full flex items-center justify-center">
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
