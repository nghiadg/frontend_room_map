import { Badge } from "@/components/ui/badge";

import type { FeatureItem, FeaturesCopy } from "./landing-types";

type LandingFeaturesProps = {
  copy: FeaturesCopy;
  features: FeatureItem[];
};

export default function LandingFeatures({
  copy,
  features,
}: LandingFeaturesProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="space-y-4 text-center">
        <Badge variant="outline" className="mx-auto">
          {copy.badge}
        </Badge>
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {copy.title}
        </h2>
        <p className="mx-auto max-w-3xl text-base text-muted-foreground">
          {copy.description}
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-6 text-left shadow-lg shadow-black/5 transition hover:-translate-y-1 hover:border-primary/60"
          >
            <div
              className={`mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent}`}
            >
              <feature.icon className="size-6" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
