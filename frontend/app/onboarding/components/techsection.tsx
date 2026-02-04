import TechChip from "./techchip";

export default function TechSection({
  title,
  subtitle,
  options,
  required,
  selected,
  setSelected,
}: {
  title: string;
  subtitle: string;
  options: string[];
  required?: boolean;
  selected: string[];
  setSelected: (v: string[]) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">
          {title} {required && <span className="text-red-500">*</span>}
        </h2>
        <p className="text-sm text-[#8b949e]">{subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
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
  );
}
