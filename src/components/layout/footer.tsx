import { Mail, MapPin, Phone, Send } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { SocialIcon } from "@/components/social-icons";
import { CONTACT_DETAILS, SOCIAL_LINKS } from "@/config/brand";

const companyLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact Us" },
  { href: "/login", label: "Account" },
  { href: "/cart", label: "Cart" },
];

const supportLinks = [
  { href: "/contact", label: "Help Center" },
  { href: "/shop?max=2000", label: "Offers & Deals" },
  { href: "/checkout", label: "Checkout" },
  { href: "/shop", label: "All Products" },
];

const categoryLinks = [
  { href: "/shop?category=skincare", label: "Skincare" },
  { href: "/shop?category=hair-care", label: "Haircare" },
  { href: "/shop?category=body-care", label: "Body Care" },
  { href: "/shop?q=makeup", label: "Makeup" },
];

const legalLinks = [
  { href: "/contact", label: "Privacy Policy" },
  { href: "/contact", label: "Terms of Use" },
  { href: "/contact", label: "Legal" },
  { href: "/shop", label: "Site Map" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="container-page pt-12">
        <div className="grid overflow-hidden rounded-[28px] bg-maroon shadow-[0_28px_90px_rgba(0,0,0,0.26)] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative hidden min-h-[220px] bg-[#7d111b] lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(245,230,211,0.18),transparent_32%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.12),transparent_30%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Logo className="scale-125 rounded-[22px] px-4 py-3 shadow-[0_22px_65px_rgba(0,0,0,0.22)]" />
            </div>
          </div>
          <div className="px-6 py-8 sm:px-10 lg:px-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-gold">Newsletter</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Join The Rodina Beauty Club
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/78">
              Receive exclusive offers, beauty tips and early access to new collections.
            </p>
            <form className="mt-6 flex max-w-xl flex-col gap-3 rounded-[28px] border border-white/18 bg-white/10 p-2 sm:flex-row sm:rounded-full">
              <label className="sr-only" htmlFor="footer-newsletter-email">Email address</label>
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon" />
                <input
                  id="footer-newsletter-email"
                  className="min-h-12 w-full rounded-full border border-transparent bg-white pl-11 pr-4 text-sm font-medium text-charcoal outline-none placeholder:text-charcoal/45 focus:border-gold"
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
              <button className="inline-flex min-h-12 items-center justify-center rounded-full bg-charcoal px-6 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-gold hover:text-maroon">
                Subscribe
                <Send className="ml-2 h-3.5 w-3.5" />
              </button>
            </form>
            <p className="mt-4 text-xs leading-5 text-white/62">
              You can unsubscribe at any time. Secure checkout with Stripe and M-Pesa.
            </p>
          </div>
        </div>

        <div className="grid gap-10 py-12 lg:grid-cols-[1.3fr_0.75fr_0.75fr_0.75fr_1.05fr]">
          <div className="lg:pr-8">
            <Logo className="rounded-2xl bg-white px-3 py-2 shadow-none" />
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/68">
              Rodina Naturals is a modern Kenyan beauty destination for premium skincare,
              haircare, makeup, bath, and body essentials.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                ["facebook", SOCIAL_LINKS.facebook],
                ["instagram", SOCIAL_LINKS.instagram],
                ["tiktok", SOCIAL_LINKS.tiktok],
              ].map(([name, href]) => (
                <Link
                  key={name}
                  href={href}
                  aria-label={name}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-gold hover:bg-gold hover:text-maroon"
                  target="_blank"
                >
                  <SocialIcon name={name as "facebook" | "instagram" | "tiktok"} />
                </Link>
              ))}
            </div>
          </div>

          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Support" links={supportLinks} />
          <FooterColumn title="Categories" links={categoryLinks} />

          <div>
            <h3 className="text-sm font-bold text-gold">Contact Us</h3>
            <div className="mt-5 space-y-4 text-sm leading-6 text-white/68">
              <p className="flex gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />
                {CONTACT_DETAILS.location}
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold" />
                {CONTACT_DETAILS.phone}
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gold" />
                {CONTACT_DETAILS.email}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="container-page flex flex-col gap-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Rodina Naturals. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="transition hover:text-gold">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gold">{title}</h3>
      <div className="mt-5 flex flex-col gap-3 text-sm text-white/68">
        {links.map((link) => (
          <Link key={`${title}-${link.label}`} href={link.href} className="transition hover:text-gold">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
