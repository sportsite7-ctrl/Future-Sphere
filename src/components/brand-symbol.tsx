export function BrandSymbol({ large = false }: { large?: boolean }) {
  return (
    <span className={large ? "brand-symbol brand-symbol-large" : "brand-symbol"} aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none">
        <path className="symbol-frame" d="M24 3.8 40.5 13v19L24 41.2 7.5 32V13L24 3.8Z" />
        <path className="symbol-f" d="M17 31V16.5h14M17 23.5h10" />
        <path className="symbol-s" d="M32 19c-1.8-2.4-7.8-3.1-10.2-.6-3.2 3.4 1.3 5.5 4.5 6.3 3.1.8 5.4 2.1 4.4 4.5-1.1 2.8-6.7 3.6-10.1 1.2" />
        <circle className="symbol-orbit" cx="38.5" cy="9.5" r="2.4" />
      </svg>
    </span>
  );
}
