import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { HeroCopy, Stat } from "./landing-types";

type LandingHeroProps = {
  hero: HeroCopy;
  stats: Stat[];
  partners?: string[];
};

export default function LandingHero({
  hero,
  stats,
  partners = [],
}: LandingHeroProps) {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
        <Badge variant="secondary" className="text-sm">
          {hero.badge}
        </Badge>
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground sm:text-lg">
            {hero.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/map">
              {hero.primaryCta}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/posts/create">{hero.secondaryCta}</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{hero.note}</p>

        <div className="grid w-full gap-4 rounded-3xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-primary/5 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-background/70 p-4 text-left shadow-sm shadow-black/5"
            >
              <p className="text-3xl font-semibold text-foreground">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground/80">{stat.subtext}</p>
            </div>
          ))}
        </div>

        {partners.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs uppercase tracking-wide text-muted-foreground">
            {partners.map((partner) => (
              <span key={partner} className="font-semibold text-foreground/70">
                {partner}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
