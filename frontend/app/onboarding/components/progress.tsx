export default function ProgressStepper({
  currentStep,
}: {
  currentStep: number;
}) {
  const steps = ["Connect GitHub", "Choose Tech Stack", "Discover Repos"];

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, idx) => {
        const active = idx + 1 <= currentStep;

        return (
          <div key={step} className="flex-1 flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                active
                  ? "bg-[#2f81f7] text-white"
                  : "bg-[#161b22] text-[#6e7681]"
              }`}
            >
              {idx + 1}
            </div>
            {idx !== steps.length - 1 && (
              <div className="flex-1 h-[1px] mx-2 bg-[#30363d]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
