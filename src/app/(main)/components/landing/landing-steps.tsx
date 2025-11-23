import { Badge } from "@/components/ui/badge";

import type { StepItem, StepsCopy } from "./landing-types";

type LandingStepsProps = {
  copy: StepsCopy;
  steps: StepItem[];
};

export default function LandingSteps({ copy, steps }: LandingStepsProps) {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:py-20">
        <div className="flex-1 space-y-4">
          <Badge variant="secondary">{copy.badge}</Badge>
          <h2 className="text-3xl font-semibold sm:text-4xl">{copy.title}</h2>
          <p className="text-base text-muted-foreground">{copy.description}</p>
        </div>
        <div className="flex-1 space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex gap-4 rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm shadow-black/5"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {index + 1}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <step.icon
                    className="size-5 text-primary"
                    aria-hidden="true"
                  />
                  <p className="font-semibold text-foreground">{step.title}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
