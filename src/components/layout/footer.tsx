import { MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  return (
    <footer className="bg-maroon text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo className="rounded bg-white px-3 py-2" />
          <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
            Premium cosmetics and skincare for considered daily rituals, curated in Nairobi.
          </p>
          <div className="mt-5 flex gap-3">
            <Link
              href="https://www.facebook.com/profile.php?id=61575638121262"
              aria-label="Facebook"
              className="grid h-9 w-9 place-items-center border border-white/20 text-xs font-semibold transition hover:border-gold hover:text-gold"
            >
              F
            </Link>
            <Link
              href="https://www.instagram.com/rodinanaturals/"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center border border-white/20 text-xs font-semibold transition hover:border-gold hover:text-gold"
            >
              IG
            </Link>
            <Link
              href="https://www.tiktok.com/@rodinanaturals_ke"
              aria-label="TikTok"
              className="grid h-9 w-9 place-items-center border border-white/20 text-xs font-semibold transition hover:border-gold hover:text-gold"
            >
              TT
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-lg text-white">Boutique</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            <Link href="/shop">Shop all</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/login">Login</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="text-lg text-white">Visit Us</h3>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/75">
            <p className="flex gap-2">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />
              Kenafrica Business Park, Ruaraka, Tower B, 3rd Floor, Office 5, Nairobi
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" />
              0793 200 000
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
