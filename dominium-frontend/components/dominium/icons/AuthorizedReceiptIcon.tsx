type IconProps = {
  className?: string;
};

export function AuthorizedReceiptIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <path
        d="M14 24L32 14L50 24V45L32 55L14 45V24Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M14 24L32 34L50 24"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M32 34V55"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        cx="45"
        cy="17"
        r="9"
        fill="var(--d-surface)"
        stroke="var(--d-accent)"
        strokeWidth="3"
      />
      <path
        d="M41.5 17L44 19.5L49 14"
        stroke="var(--d-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
