import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { SocialIcon } from "@/components/social-icons";
import { CATEGORIES, CONTACT_DETAILS, SOCIAL_LINKS } from "@/config/brand";

const customerLinks = [
  { href: "/contact", label: "Contact us" },
  { href: "/login", label: "Account" },
  { href: "/cart", label: "Cart" },
  { href: "/shop?max=2000", label: "Offers / Deals" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.95fr]">
        <div>
          <Logo className="rounded-2xl bg-white px-3 py-2" />
          <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
            Rodina Naturals is a modern Kenyan beauty destination for premium skincare,
            haircare, makeup, bath, and body essentials.
          </p>
          <form className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              className="min-h-12 rounded-full border border-white/15 bg-white/10 px-5 text-sm text-white outline-none placeholder:text-white/45 focus:border-gold"
              type="email"
              placeholder="Email address"
            />
            <button className="rounded-full bg-gold px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-maroon transition hover:bg-white">
              Join
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Categories</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-white/72">
            <Link href="/shop">All Products</Link>
            <Link href="/shop?category=thalia">Skincare</Link>
            <Link href="/shop?category=bioblas">Haircare</Link>
            <Link href="/shop?q=makeup">Makeup</Link>
            <Link href="/shop?category=rain">Bath & Body</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Our Brands</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-white/72">
            {CATEGORIES.map((category) => (
              <Link key={category} href={`/shop?category=${category.toLowerCase()}`}>
                {category}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
            Customer Service
          </h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-white/72">
            {customerLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 space-y-3 text-sm leading-7 text-white/72">
            <p className="flex gap-2">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />
              {CONTACT_DETAILS.location}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" />
              {CONTACT_DETAILS.phone}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold" />
              {CONTACT_DETAILS.email}
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              href={SOCIAL_LINKS.facebook}
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-gold hover:text-gold"
              target="_blank"
            >
              <SocialIcon name="facebook" />
            </Link>
            <Link
              href={SOCIAL_LINKS.instagram}
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-gold hover:text-gold"
              target="_blank"
            >
              <SocialIcon name="instagram" />
            </Link>
            <Link
              href={SOCIAL_LINKS.tiktok}
              aria-label="TikTok"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-gold hover:text-gold"
              target="_blank"
            >
              <SocialIcon name="tiktok" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="container-page flex flex-col gap-2 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Rodina Naturals. All rights reserved.</p>
          <p>Secure checkout with Stripe and M-Pesa.</p>
        </div>
      </div>
    </footer>
  );
}
