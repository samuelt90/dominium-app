type IconProps = {
  className?: string;
};

export function GuideIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <rect
        x="14"
        y="9"
        width="36"
        height="46"
        rx="9"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M23 21H41M23 31H41M23 41H34"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M20 21L21.5 22.5L25 18.5"
        stroke="var(--d-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 31L21.5 32.5L25 28.5"
        stroke="var(--d-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42 42L49 49"
        stroke="var(--d-accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        cx="40"
        cy="40"
        r="6"
        stroke="var(--d-accent)"
        strokeWidth="3"
      />
    </svg>
  );
}
