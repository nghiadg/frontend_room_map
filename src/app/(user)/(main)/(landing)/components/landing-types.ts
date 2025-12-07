import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type Stat = {
  value: string;
  label: string;
  subtext: string;
};

export type HeroCopy = {
  badge: string;
  title: ReactNode;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  note: string;
};

export type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

export type FeaturesCopy = {
  badge: string;
  title: string;
  description: string;
};

export type StepItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type StepsCopy = {
  badge: string;
  title: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  location: string;
};

export type TestimonialsCopy = {
  badge: string;
  title: string;
  description: string;
};

export type CtaCopy = {
  badge: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
};
