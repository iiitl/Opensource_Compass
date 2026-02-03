import TechChip from "./techchip";

const FRAMEWORK_GROUPS = [
  {
    title: "Frontend",
    options: ["React", "Next.js", "Vue", "Angular"],
  },
  {
    title: "Backend",
    options: ["Node.js", "Spring Boot", "Django", "Flask"],
  },
  {
    title: "DevOps",
    options: ["Docker", "Kubernetes", "Terraform"],
  },
];

export default function FrameworkSection({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: (v: string[]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          Frameworks & tools
        </h2>
        <p className="text-sm text-[#8b949e]">
          Optional — helps us suggest more relevant repositories.
        </p>
      </div>

      {FRAMEWORK_GROUPS.map((group) => (
        <div key={group.title} className="space-y-2">
          <h3 className="text-sm text-[#6e7681] uppercase tracking-wide">
            {group.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.options.map((opt) => (
              <TechChip
                key={opt}
                label={opt}
                selected={selected.includes(opt)}
                toggle={() =>
                  setSelected(
                    selected.includes(opt)
                      ? selected.filter((v) => v !== opt)
                      : [...selected, opt]
                  )
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
