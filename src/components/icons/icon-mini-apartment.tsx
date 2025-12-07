import { IconProps } from "./types";

/**
 * Icon for mini_apartment property type (Chung cư mini)
 * Tall apartment building - centered without ground line
 */
export default function IconMiniApartment({
  className,
  width,
  height,
  size,
}: IconProps) {
  return (
    <svg
      width={width || size || 24}
      height={height || size || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Building body */}
      <rect
        x="6"
        y="2"
        width="12"
        height="20"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Floor dividers */}
      <line
        x1="6"
        y1="8"
        x2="18"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="6"
        y1="14"
        x2="18"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Windows - top floor */}
      <rect
        x="8"
        y="4"
        width="2.5"
        height="2"
        rx="0.3"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x="13.5"
        y="4"
        width="2.5"
        height="2"
        rx="0.3"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Windows - middle floor */}
      <rect
        x="8"
        y="10"
        width="2.5"
        height="2"
        rx="0.3"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x="13.5"
        y="10"
        width="2.5"
        height="2"
        rx="0.3"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Door - ground floor */}
      <rect
        x="10"
        y="16"
        width="4"
        height="6"
        rx="0.3"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
