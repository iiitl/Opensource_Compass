import TechChip from "./techchip";

const DOMAINS = [
  "Backend Systems",
  "Frontend",
  "DevOps",
  "AI / ML",
  "Open Source Tooling",
  "Web3",
];

export default function DomainSection({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: (v: string[]) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">
          Domains & interests
        </h2>
        <p className="text-sm text-[#8b949e]">
          Optional — choose what kind of problems excite you.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {DOMAINS.map((domain) => (
          <TechChip
            key={domain}
            label={domain}
            selected={selected.includes(domain)}
            toggle={() =>
              setSelected(
                selected.includes(domain)
                  ? selected.filter((v) => v !== domain)
                  : [...selected, domain]
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
