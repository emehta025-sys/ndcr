export function BurstMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`burst-mark ${className}`}
      focusable="false"
      viewBox="0 0 420 300"
      fill="none"
    >
      <path
        d="M16 38 93 52 68 20 148 40 164 10 206 48 245 15 255 56 331 31 315 73 404 70 365 111 407 144 351 161 391 211 326 214 365 267 287 247 271 290 221 255 185 291 167 251 88 274 109 231 18 224 61 190 13 157 75 142 35 96 108 105 96 65Z"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="miter"
      />
      <path d="M118 151h184M146 171h128M172 191h76" stroke="currentColor" strokeWidth="3" strokeDasharray="2 10" />
    </svg>
  );
}
