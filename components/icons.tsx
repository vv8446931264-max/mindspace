import type { SVGProps } from "react";

/**
 * Lucide-style line icons (1.75 stroke). Used for all *structural* and
 * decorative UI — brand, section headers, controls. Mood and emotion emojis
 * stay as emojis because there they are content, not chrome.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 18, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Brand mark — a calm, abstract "mind" spark. */
export function BrainIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 5a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8A3 3 0 0 0 12 18a3 3 0 0 0 4-4.2A3 3 0 0 0 15 8a3 3 0 0 0-3-3Z" />
      <path d="M12 5v13" />
    </Base>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3c1 3-1.5 4-1.5 6.5a3.5 3.5 0 0 0 7 0C17.5 6 14 6 12 3Z" />
      <path d="M8.5 12A4 4 0 0 0 8 14a4 4 0 1 0 8 0c0-.7-.2-1.4-.5-2" />
    </Base>
  );
}

export function TrendUpIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M17 8h4v4" />
    </Base>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </Base>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </Base>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </Base>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6.3 6.3 4 4M20 20l-2.3-2.3M17.7 6.3 20 4M4 20l2.3-2.3" />
      <circle cx="12" cy="12" r="3" />
    </Base>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 19c0-7 5-12 14-13-1 9-6 14-13 14a4 4 0 0 1-1-1Z" />
      <path d="M5 19c3-4 6-6 10-7" />
    </Base>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4l3 2" />
    </Base>
  );
}

export function BulbIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.3 1 2.5h6c0-1.2.4-1.9 1-2.5A6 6 0 0 0 12 3Z" />
    </Base>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 3h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />
    </Base>
  );
}

export function HeartHandshakeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 20s-7-4.4-7-9.3A4 4 0 0 1 12 8a4 4 0 0 1 7 2.7C19 15.6 12 20 12 20Z" />
      <path d="M12 8l-1.5 1.5a1.4 1.4 0 0 0 2 2L14 10" />
    </Base>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M10.3 4 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </Base>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9.5 12 1.8 1.8 3.5-3.6" />
    </Base>
  );
}

export function WindIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 8h11a2.5 2.5 0 1 0-2.5-2.5" />
      <path d="M3 12h16a2.5 2.5 0 1 1-2.5 2.5" />
      <path d="M3 16h7a2.5 2.5 0 1 1-2.5 2.5" />
    </Base>
  );
}
