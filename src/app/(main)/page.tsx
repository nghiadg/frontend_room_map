import {
  Building2,
  Handshake,
  LayoutDashboard,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import LandingCta from "./components/landing/landing-cta";
import LandingFeatures from "./components/landing/landing-features";
import LandingHero from "./components/landing/landing-hero";
import LandingSteps from "./components/landing/landing-steps";
import LandingTestimonials from "./components/landing/landing-testimonials";
import type {
  CtaCopy,
  FeatureItem,
  FeaturesCopy,
  HeroCopy,
  Stat,
  StepItem,
  StepsCopy,
  Testimonial,
  TestimonialsCopy,
} from "./components/landing/landing-types";

export default async function Home() {
  const t = await getTranslations("landing");

  const heroCopy: HeroCopy = {
    badge: t("hero.badge"),
    title: t.rich("hero.title", {
      highlight: (chunks) => <span className="text-primary">{chunks}</span>,
    }),
    description: t("hero.description"),
    primaryCta: t("hero.primaryCta"),
    secondaryCta: t("hero.secondaryCta"),
    note: t("hero.note"),
  };

  const stats: Stat[] = [
    {
      value: t("stats.items.verified.value"),
      label: t("stats.items.verified.label"),
      subtext: t("stats.items.verified.subtext"),
    },
    {
      value: t("stats.items.cities.value"),
      label: t("stats.items.cities.label"),
      subtext: t("stats.items.cities.subtext"),
    },
    {
      value: t("stats.items.map.value"),
      label: t("stats.items.map.label"),
      subtext: t("stats.items.map.subtext"),
    },
  ];

  const featuresCopy: FeaturesCopy = {
    badge: t("features.badge"),
    title: t("features.title"),
    description: t("features.description"),
  };

  const featureItems: FeatureItem[] = [
    {
      title: t("features.items.map_first.title"),
      description: t("features.items.map_first.description"),
      icon: MapPin,
      accent: "from-primary/20 via-primary/5 to-transparent text-primary",
    },
    {
      title: t("features.items.verified_data.title"),
      description: t("features.items.verified_data.description"),
      icon: ShieldCheck,
      accent:
        "from-emerald-200/40 via-emerald-100/40 to-transparent text-emerald-600",
    },
    {
      title: t("features.items.smart_matching.title"),
      description: t("features.items.smart_matching.description"),
      icon: Sparkles,
      accent:
        "from-fuchsia-200/50 via-fuchsia-100/50 to-transparent text-fuchsia-600",
    },
    {
      title: t("features.items.host_tools.title"),
      description: t("features.items.host_tools.description"),
      icon: Building2,
      accent: "from-blue-200/40 via-blue-100/40 to-transparent text-blue-600",
    },
  ];

  const stepsCopy: StepsCopy = {
    badge: t("steps.badge"),
    title: t("steps.title"),
    description: t("steps.description"),
  };

  const steps: StepItem[] = [
    {
      title: t("steps.items.explore.title"),
      description: t("steps.items.explore.description"),
      icon: Search,
    },
    {
      title: t("steps.items.shortlist.title"),
      description: t("steps.items.shortlist.description"),
      icon: LayoutDashboard,
    },
    {
      title: t("steps.items.book.title"),
      description: t("steps.items.book.description"),
      icon: Handshake,
    },
  ];

  const testimonialsCopy: TestimonialsCopy = {
    badge: t("testimonials.badge"),
    title: t("testimonials.title"),
    description: t("testimonials.description"),
  };

  const testimonials: Testimonial[] = [
    {
      quote: t("testimonials.items.linh.quote"),
      author: t("testimonials.items.linh.author"),
      role: t("testimonials.items.linh.role"),
      location: t("testimonials.items.linh.location"),
    },
    {
      quote: t("testimonials.items.minh.quote"),
      author: t("testimonials.items.minh.author"),
      role: t("testimonials.items.minh.role"),
      location: t("testimonials.items.minh.location"),
    },
  ];

  const ctaCopy: CtaCopy = {
    badge: t("cta.badge"),
    title: t("cta.title"),
    description: t("cta.description"),
    primaryCta: t("cta.primaryCta"),
    secondaryCta: t("cta.secondaryCta"),
  };

  const partners: string[] = [];

  return (
    <div className="relative isolate min-h-full bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute left-1/2 top-10 size-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 size-[360px] translate-y-1/3 rounded-full bg-secondary/40 blur-[120px]" />
      </div>

      <LandingHero hero={heroCopy} stats={stats} partners={partners} />
      <LandingFeatures copy={featuresCopy} features={featureItems} />
      <LandingSteps copy={stepsCopy} steps={steps} />
      <LandingTestimonials
        copy={testimonialsCopy}
        testimonials={testimonials}
      />
      <LandingCta copy={ctaCopy} />
    </div>
  );
}
