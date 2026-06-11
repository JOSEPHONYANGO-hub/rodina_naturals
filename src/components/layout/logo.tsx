import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="Rodina Naturals">
      <Image
        src="/rodina-logo.jpeg"
        alt="Rodina Naturals"
        width={170}
        height={86}
        className="h-12 w-auto object-contain"
        priority
      />
    </Link>
  );
}
