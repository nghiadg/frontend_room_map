import { IconProps } from "./types";

/**
 * Icon for 1b1l property type (1 Ngủ 1 Khách)
 * Single-story flat roof unit - centered without ground line
 */
export default function IconSingleRoom({
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
      {/* Flat roof */}
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Building body */}
      <rect
        x="4"
        y="6"
        width="16"
        height="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Window with cross */}
      <rect
        x="6"
        y="10"
        width="5"
        height="4"
        rx="0.3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <line
        x1="8.5"
        y1="10"
        x2="8.5"
        y2="14"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <line
        x1="6"
        y1="12"
        x2="11"
        y2="12"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      {/* Door */}
      <rect
        x="14"
        y="11"
        width="4"
        height="9"
        rx="0.3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="16.5" cy="15.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
