type IconProps = {
  className?: string;
};

export function ScanProductIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <rect
        x="13"
        y="15"
        width="38"
        height="34"
        rx="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M22 26H42M22 38H42"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M8 22V14C8 10.7 10.7 8 14 8H22"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M56 22V14C56 10.7 53.3 8 50 8H42"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M8 42V50C8 53.3 10.7 56 14 56H22"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M56 42V50C56 53.3 53.3 56 50 56H42"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M18 32H46"
        stroke="var(--d-accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
