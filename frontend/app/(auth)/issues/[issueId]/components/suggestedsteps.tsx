export default function SuggestedSteps() {
  const steps = [
    "Clone the repository locally",
    "Locate the authentication middleware",
    "Identify the token refresh handler",
    "Add proper refresh logic and tests",
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Suggested first steps
      </h2>

      <ul className="space-y-2">
        {steps.map((step, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 text-sm text-[#8b949e]"
          >
            <span className="mt-1 h-2 w-2 rounded-full bg-[#2f81f7]" />
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
