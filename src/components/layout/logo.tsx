import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center rounded-2xl bg-white px-3 py-2 shadow-[0_10px_28px_rgba(122,44,115,0.14)] ring-1 ring-brandPurple/10 ${className}`}
      aria-label="Rodina Naturals"
    >
      <Image
        src="/rodina-logo-bold.png"
        alt="Rodina Naturals"
        width={720}
        height={296}
        className="h-16 w-auto object-contain contrast-125 saturate-150 md:h-20"
        priority
      />
    </Link>
  );
}
