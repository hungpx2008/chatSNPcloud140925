export function Logo() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 100 100"
      className="h-20 w-20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4D9DE0" />
          <stop offset="100%" stopColor="#80C9E2" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="20" fill="url(#logoGradient)" />
      <g transform="translate(0 -5)">
        <rect x="29" y="32" width="6" height="18" rx="3" fill="#E15554" />
        <rect x="39" y="28" width="6" height="26" rx="3" fill="#E1BC29" />
        <rect x="49" y="24" width="6" height="34" rx="3" fill="#F6D55C" />
        <rect x="59" y="30" width="6" height="22" rx="3" fill="#3A7D44" />
        <rect x="69" y="34" width="6" height="14" rx="3" fill="#89A894" />
      </g>
      <text
        x="50%"
        y="78%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="18"
        fontWeight="bold"
        fill="#002D5B"
        fontFamily="sans-serif"
      >
        ChatSNP
      </text>
    </svg>
  );
}
