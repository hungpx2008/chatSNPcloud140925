export function UsaFlagIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1235 650"
      className={className}
      width="36"
      height="19"
    >
      <rect width="1235" height="650" fill="#FFF" />
      <path
        d="M0 0h1235v50H0zM0 100h1235v50H0zM0 200h1235v50H0zM0 300h1235v50H0zM0 400h1235v50H0zM0 500h1235v50H0zM0 600h1235v50H0z"
        fill="#B22234"
      />
      <rect width="494" height="350" fill="#3C3B6E" />
      <g fill="#FFF">
        <g id="s5">
          <g id="s4">
            <path id="s" d="M117.5 0l25 80-65-50h80l-65 50z" />
            <use href="#s" x="82.333" />
          </g>
          <use href="#s4" x="164.666" />
        </g>
        <g id="r6">
          <use href="#s5" y="29.167" />
          <use href="#s" x="41.167" y="29.167" />
        </g>
        <g id="r5">
          <use href="#s5" x="41.167" y="58.333" />
        </g>
        <g id="r4">
          <use href="#r6" y="58.333" />
        </g>
        <g id="r3">
          <use href="#r5" y="58.333" />
        </g>
        <g id="r2">
          <use href="#r4" y="58.333" />
        </g>
        <use href="#r6" transform="translate(41.167 29.167)" />
        <use href="#r5" transform="translate(0 58.333)" />
        <use href="#r6" transform="translate(41.167 87.5)" />
        <use href="#r5" transform="translate(0 116.666)" />
        <use href="#r6" transform="translate(41.167 145.833)" />
        <use href="#r5" transform="translate(0 175)" />
        <use href="#r6" transform="translate(41.167 204.167)" />
        <use href="#r5" transform="translate(0 233.333)" />
        <use href="#r6" transform="translate(41.167 262.5)" />
      </g>
    </svg>
  );
}
