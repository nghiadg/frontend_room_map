"use client";

import { cn } from "@/lib/utils";

interface PostFormMobileProgressProps {
  currentStep: string;
  steps: Array<{
    key: string;
    step: number;
  }>;
}

export function PostFormMobileProgress({
  currentStep,
  steps,
}: PostFormMobileProgressProps) {
  const currentStepNumber =
    steps.find((step) => step.key === currentStep)?.step || 1;

  return (
    <div className="lg:hidden flex gap-1.5 justify-center mt-8 mb-4">
      {steps.map((step) => (
        <div
          key={step.key}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            step.step === currentStepNumber
              ? "w-8 bg-primary"
              : step.step < currentStepNumber
                ? "w-1.5 bg-primary/50"
                : "w-1.5 bg-gray-300 dark:bg-gray-600"
          )}
        />
      ))}
    </div>
  );
}
