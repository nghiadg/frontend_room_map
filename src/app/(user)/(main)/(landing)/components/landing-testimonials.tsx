import { Badge } from "@/components/ui/badge";

import type { Testimonial, TestimonialsCopy } from "./landing-types";

type LandingTestimonialsProps = {
  copy: TestimonialsCopy;
  testimonials: Testimonial[];
};

export default function LandingTestimonials({
  copy,
  testimonials,
}: LandingTestimonialsProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="space-y-4 text-center">
        <Badge variant="outline" className="mx-auto">
          {copy.badge}
        </Badge>
        <h2 className="text-3xl font-semibold sm:text-4xl">{copy.title}</h2>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground">
          {copy.description}
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.author}
            className="rounded-3xl border border-border/70 bg-card/60 p-6 shadow-lg shadow-black/5"
          >
            <p className="text-base text-foreground leading-relaxed">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <div className="mt-6 text-sm">
              <p className="font-semibold text-foreground">
                {testimonial.author}
              </p>
              <p className="text-muted-foreground">
                {testimonial.role} • {testimonial.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
