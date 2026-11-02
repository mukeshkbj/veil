import Link from "next/link";

export function Wordmark() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5 text-[16px] font-semibold tracking-[-0.01em] text-ink">
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <circle cx="12" cy="12" r="10" className="fill-none stroke-ink" strokeWidth="1.5" />
        <path d="M12 2 A10 10 0 0 0 12 22 Z" className="fill-ink/15" />
        <path d="M12 1.5 V22.5" className="stroke-wax" strokeWidth="2" strokeLinecap="round" />
      </svg>
      Veil
    </Link>
  );
}
