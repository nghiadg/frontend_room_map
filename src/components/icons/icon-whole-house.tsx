import { IconProps } from "./types";

/**
 * Icon for whole_house property type (Nhà nguyên căn)
 * Traditional house with pitched roof - centered without ground line
 */
export default function IconWholeHouse({
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
      {/* Pitched roof */}
      <path
        d="M3 10L12 3L21 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* House body */}
      <rect
        x="5"
        y="10"
        width="14"
        height="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Left window */}
      <rect
        x="7"
        y="13"
        width="3"
        height="3"
        rx="0.3"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Right window */}
      <rect
        x="14"
        y="13"
        width="3"
        height="3"
        rx="0.3"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Door */}
      <rect
        x="10"
        y="16"
        width="4"
        height="6"
        rx="0.3"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="12.5" cy="19" r="0.5" fill="currentColor" />
    </svg>
  );
}
