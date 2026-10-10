import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center rounded-2xl bg-white px-3 py-2 shadow-[0_10px_28px_rgba(60,26,8,0.12)] ring-1 ring-espresso/10 ${className}`}
      aria-label="Eloria Beauty"
    >
      <Image
        src="/eloria-logo.svg"
        alt="Eloria Beauty"
        width={260}
        height={72}
        className="h-12 w-auto object-contain md:h-14"
        priority
      />
    </Link>
  );
}
