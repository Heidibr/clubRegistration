import React from "react";

export function useWizard<T extends Record<string, string>>(
  steps: readonly { fields: readonly (keyof T)[] }[],
  values: T,
  validate: (values: T) => Record<string, string>,
  setErrors: (errors: Record<string, string>) => void
) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const isLastStep = currentStep === steps.length - 1;

  function goToStep(target: number) {
    if (target <= currentStep) {
      setErrors({});
      setCurrentStep(target);
      return;
    }
    const allErrors = validate(values);
    for (let i = currentStep; i < target; i++) {
      const invalidField = steps[i].fields.find((field) => allErrors[field as string]);
      if (invalidField) {
        const stepErrors: Record<string, string> = {};
        for (const field of steps[i].fields) {
          const key = field as string;
          if (allErrors[key]) stepErrors[key] = allErrors[key];
        }
        setErrors(stepErrors);
        setCurrentStep(i);
        return;
      }
    }
    setErrors({});
    setCurrentStep(target);
  }

  return { currentStep, isLastStep, goToStep, setCurrentStep };
}
