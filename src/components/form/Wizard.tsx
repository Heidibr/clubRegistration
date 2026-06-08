type WizardProps = {
  steps: readonly { title: string }[];
  currentStep: number;
  onStepClick: (index: number) => void;
};

export default function Wizard({
  steps,
  currentStep,
  onStepClick,
}: Readonly<WizardProps>) {
  return (
    <div className="flex flex-row items-start justify-center gap-3 sm:gap-4 pt-4">
      {steps.map((step, index) => (
        <div key={step.title} className="flex flex-col items-center gap-1 text-center">
          <RoundButton
            
            step={index + 1}
            active={index === currentStep}
            done={index < currentStep}
            onClick={() => onStepClick(index)}
          />
          <span className="text-xs text-navy">{step.title}</span>
        </div>
      ))}
    </div>
  );
}

type RoundButtonProps = {
  step: number;
  active: boolean;
  done: boolean;
  onClick: () => void;
};

function RoundButton({ step, active, done, onClick }: Readonly<RoundButtonProps>) {
  const base = "h-8 w-8 rounded-full border-2 border-navy cursor-pointer";
  const colors = active || done ? "bg-navy text-cream" : "bg-white text-navy";
  return (
    <button type="button" onClick={onClick} className={`${base} ${colors}`}>
      {step}
    </button>
  );
}
