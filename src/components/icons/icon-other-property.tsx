import { IconProps } from "./types";

/**
 * Icon for other property type (Khác)
 * Modern building with slanted roof - centered without ground line
 */
export default function IconOtherProperty({
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
      {/* Main building with slanted roof */}
      <path
        d="M4 22V6L8 3H20V22H4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Roof separation line */}
      <line
        x1="4"
        y1="6"
        x2="20"
        y2="6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Windows */}
      <rect
        x="6"
        y="9"
        width="3"
        height="2.5"
        rx="0.3"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x="11"
        y="9"
        width="3"
        height="2.5"
        rx="0.3"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Large door/entrance */}
      <rect
        x="6"
        y="15"
        width="5"
        height="7"
        rx="0.3"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Side section */}
      <rect
        x="14"
        y="9"
        width="4"
        height="8"
        rx="0.3"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
