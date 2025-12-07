"use client";

import { cn } from "@/lib/utils";

type UserLocationMarkerProps = {
  className?: string;
};

export default function UserLocationMarker({
  className,
}: UserLocationMarkerProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Outer pulse ring - optimized with will-change for GPU acceleration */}
      <div
        className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping"
        style={{ willChange: "transform, opacity" }}
      />

      {/* Middle ring */}
      <div className="relative h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
        {/* Inner dot */}
        <div className="h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
      </div>
    </div>
  );
}
