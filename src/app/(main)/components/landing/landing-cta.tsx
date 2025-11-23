import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { CtaCopy } from "./landing-types";

type LandingCtaProps = {
  copy: CtaCopy;
};

export default function LandingCta({ copy }: LandingCtaProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-primary/90 via-primary to-amber-500 p-8 text-background shadow-2xl sm:p-12">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent)] lg:block" />
        <div className="relative space-y-6">
          <Badge variant="secondary" className="bg-white/20 text-white">
            {copy.badge}
          </Badge>
          <h2 className="text-3xl font-semibold sm:text-4xl">{copy.title}</h2>
          <p className="text-base text-white/80">{copy.description}</p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-primary"
            >
              <Link href="/map">
                {copy.primaryCta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/70 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/posts/create">{copy.secondaryCta}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
