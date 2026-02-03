export default function TechChip({
  label,
  selected,
  toggle,
}: {
  label: string;
  selected: boolean;
  toggle: () => void;
}) {
  return (
    <button
      onClick={toggle}
      className={`px-4 py-2 rounded-full border text-sm transition-colors ${
        selected
          ? "bg-[#2f81f7] border-[#2f81f7] text-white"
          : "bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-[#2f81f7]"
      }`}
    >
      {label}
    </button>
  );
}
