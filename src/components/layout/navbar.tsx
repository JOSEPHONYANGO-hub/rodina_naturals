"use client";

import {
  ChevronDown,
  Heart,
  Menu,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";
import { SocialIcon } from "@/components/social-icons";
import { CATEGORIES, CONTACT_DETAILS, SOCIAL_LINKS } from "@/config/brand";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop", hasMega: true },
  { href: "/shop?brand=bioxcin", label: "Brands", hasMega: true },
  { href: "/shop?category=skincare", label: "Skincare" },
  { href: "/shop?category=hair-care", label: "Haircare" },
  { href: "/shop?category=body-care", label: "Body Care" },
  { href: "/shop?max=2000", label: "Top Deals" },
  { href: "/contact", label: "Contact Us" },
];

const categoryGroups = [
  {
    title: "Skincare",
    href: "/shop?category=skincare",
    items: ["Cleansers", "Toners", "Serums", "Moisturizers", "Sunscreens", "Eye Care"],
  },
  {
    title: "Hair Care",
    href: "/shop?category=hair-care",
    items: ["Shampoo", "Conditioner", "Hair Oils", "Hair Masks", "Hair Growth", "Styling"],
  },
  {
    title: "Body & Wellness",
    href: "/shop?category=body-care",
    items: ["Body Lotion", "Body Butter", "Scrubs", "Hand Creams", "Foot Care", "Gift Sets"],
  },
];

const brandLinks = [
  { name: "Bioxcin", href: "/shop?brand=bioxcin", copy: "Hair strengthening" },
  { name: "Restorex", href: "/shop?brand=restorex", copy: "Repair routines" },
  { name: "Procsin", href: "/shop?brand=procsin", copy: "Dermatological care" },
  { name: "Bioblas", href: "/shop?brand=bioblas", copy: "Herbal hair care" },
  { name: "Thalia", href: "/shop?brand=thalia", copy: "Natural body care" },
  { name: "Rain", href: "/shop?brand=rain", copy: "Wellness skincare" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: session, status } = useSession();
  const count = useCart((state) => state.count());
  const suggestions = CATEGORIES.filter((category) =>
    category.toLowerCase().includes(search.toLowerCase()),
  ).slice(0, 4);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = search.trim();
    if (value) window.location.href = `/shop?q=${encodeURIComponent(value)}`;
  };

  return (
    <header
      className="sticky inset-x-0 top-0 z-50 bg-[#a81723] text-white shadow-[0_12px_34px_rgba(34,34,34,0.16)]"
      onMouseLeave={() => setMegaOpen(false)}
    >
      <div className="bg-[#7d111b] text-white/90">
        <div className="container-page grid min-h-8 grid-cols-1 items-center gap-2 py-2 text-[11px] font-bold sm:grid-cols-3">
          <div className="hidden items-center gap-5 sm:flex">
            <span className="inline-flex items-center gap-2 truncate">
              <MapPin className="h-3.5 w-3.5 text-[#F5E6D3]" />
              Location
            </span>
            <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 whitespace-nowrap hover:text-[#F5E6D3]">
              <Phone className="h-3.5 w-3.5 text-[#F5E6D3]" />
              {CONTACT_DETAILS.phone}
            </a>
          </div>
          <p className="text-center uppercase tracking-[0.16em] text-[#F5E6D3]">
            Mid-Season Sale Up to 50% Off.
          </p>
          <div className="hidden items-center justify-end gap-3 sm:flex">
            <Link href="/shop" className="mr-1 hover:text-[#F5E6D3]">
              Newsletter
            </Link>
            <Link
              href={SOCIAL_LINKS.facebook}
              className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-[#a81723]"
              aria-label="Facebook"
              target="_blank"
            >
              <SocialIcon name="facebook" />
            </Link>
            <Link
              href={SOCIAL_LINKS.instagram}
              className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-[#a81723]"
              aria-label="Instagram"
              target="_blank"
            >
              <SocialIcon name="instagram" />
            </Link>
            <Link
              href={SOCIAL_LINKS.tiktok}
              className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-[#a81723]"
              aria-label="TikTok"
              target="_blank"
            >
              <SocialIcon name="tiktok" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-y border-white/10 bg-[#a81723]">
        <div className="container-page flex min-h-[82px] items-center justify-between gap-4 py-3">
        <Logo className="shrink-0 rounded-xl bg-white px-2 py-1 shadow-none ring-1 ring-white/20 [&_img]:h-12 md:[&_img]:h-14" />
        <form
          onSubmit={submitSearch}
          className="relative hidden max-w-2xl flex-1 items-center text-charcoal md:flex"
        >
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search..."
            className="h-12 w-full rounded-l-full border border-white/25 bg-white pl-5 pr-4 text-sm font-medium text-charcoal outline-none transition placeholder:text-charcoal/45 focus:border-[#F5E6D3]"
          />
          <button
            type="submit"
            className="grid h-12 w-14 place-items-center rounded-r-full bg-[#F5E6D3] text-[#a81723] transition hover:bg-white"
            aria-label="Search products"
          >
            <Search className="h-5 w-5" />
          </button>
          {search && suggestions.length ? (
            <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-2xl border border-maroon/10 bg-white p-2 text-maroon shadow-[0_18px_50px_rgba(77,12,18,0.12)]">
              {suggestions.map((category) => (
                <Link
                  key={category}
                  href={`/shop?brand=${category.toLowerCase()}`}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-cream"
                >
                  <Sparkles className="h-3.5 w-3.5 text-gold" />
                  {category}
                </Link>
              ))}
            </div>
          ) : null}
        </form>
        <div className="flex items-center gap-2 text-white sm:gap-4">
          <Link
            href="/shop"
            className="hidden p-2 transition hover:text-[#F5E6D3] sm:block"
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </Link>
          <div className="relative">
            {status === "authenticated" ? (
              <button
                className={cn(
                  "flex items-center gap-2 rounded-full border px-2 py-1.5 text-xs font-semibold transition hover:border-[#F5E6D3]",
                  "border-white/20 bg-white/10 text-white",
                )}
                onClick={() => setAccountOpen((value) => !value)}
                aria-label="Account menu"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#F5E6D3] text-[11px] font-bold uppercase text-[#a81723]">
                  {(session.user.name || session.user.email || "A").slice(0, 1)}
                </span>
                <span className="hidden max-w-28 truncate xl:inline">
                  {session.user.name || "Account"}
                </span>
              </button>
            ) : (
              <Link
                href="/login"
                className="p-2 text-white transition hover:text-[#F5E6D3]"
                aria-label="Login"
              >
                <UserRound size={20} />
              </Link>
            )}
            {accountOpen && status === "authenticated" ? (
              <div className="absolute right-0 top-12 w-72 overflow-hidden rounded-[24px] border border-maroon/10 bg-white text-maroon shadow-[0_24px_70px_rgba(77,12,18,0.16)]">
                <div className="border-b border-maroon/10 bg-cream p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                    Signed in
                  </p>
                  <p className="mt-2 truncate font-semibold text-charcoal">
                    {session.user.name || "Rodina user"}
                  </p>
                  <p className="mt-1 truncate text-sm text-ink/60">{session.user.email}</p>
                  {session.user.role === "ADMIN" ? (
                    <span className="mt-3 inline-flex rounded-full bg-maroon px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                      Admin
                    </span>
                  ) : null}
                </div>
                <div className="grid p-2 text-sm">
                  {session.user.role === "ADMIN" ? (
                    <Link
                      href="/admin"
                      className="rounded-2xl px-4 py-3 transition hover:bg-cream"
                      onClick={() => setAccountOpen(false)}
                    >
                      Admin dashboard
                    </Link>
                  ) : null}
                  <Link
                    href="/cart"
                    className="rounded-2xl px-4 py-3 transition hover:bg-cream"
                    onClick={() => setAccountOpen(false)}
                  >
                    View cart
                  </Link>
                  <button
                    className="rounded-2xl px-4 py-3 text-left text-maroon transition hover:bg-cream"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          <Link
            href="/cart"
            className="relative p-2 text-white transition hover:text-[#F5E6D3]"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#F5E6D3] text-[10px] font-semibold text-[#a81723]">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            className="p-2 text-white lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      </div>

      <nav className="hidden bg-[#8f1420] lg:block">
        <div className="container-page flex min-h-[50px] items-center justify-center gap-7 text-[12px] font-extrabold uppercase tracking-[0.12em] text-white xl:gap-9">
          {links.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="group relative inline-flex items-center gap-1 whitespace-nowrap py-4 transition duration-300 hover:text-[#F5E6D3]"
              onMouseEnter={() => setMegaOpen(Boolean(link.hasMega))}
            >
              {link.label}
              {link.hasMega ? (
                <ChevronDown className={cn("h-4 w-4 transition duration-300", megaOpen && "rotate-180")} />
              ) : null}
              <span className="absolute bottom-2 left-0 h-0.5 w-full origin-left scale-x-0 bg-[#F5E6D3] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>
      </nav>

      {megaOpen ? (
        <div className="hidden border-t border-white/10 bg-white/95 text-charcoal shadow-[0_30px_90px_rgba(34,34,34,0.16)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 lg:block">
          <div className="container-page grid gap-8 py-8 lg:grid-cols-[1.15fr_0.9fr_340px]">
            <div className="rounded-[28px] border border-[#a81723]/10 bg-[#FAF8F5] p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-gold">
                    Shop by category
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-[#222222]">Beauty departments</h2>
                </div>
                <Link href="/shop" className="fine-link">
                  View all
                </Link>
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {categoryGroups.map((group) => (
                  <div key={group.title}>
                    <Link
                      href={group.href}
                      className="group/category inline-flex items-center gap-2 text-base font-bold text-[#a81723] transition hover:text-charcoal"
                    >
                      {group.title}
                      <ChevronDown className="h-4 w-4 -rotate-90 transition group-hover/category:translate-x-1" />
                    </Link>
                    <div className="mt-4 grid gap-2">
                      {group.items.map((item) => (
                        <Link
                          key={item}
                          href={`${group.href}&q=${encodeURIComponent(item)}`}
                          className="group/item flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium text-charcoal/68 transition duration-300 hover:bg-white hover:text-[#a81723] hover:shadow-[0_10px_28px_rgba(168,23,35,0.08)]"
                        >
                          <span>{item}</span>
                          <span className="h-px w-0 bg-[#a81723] transition-all duration-300 group-hover/item:w-5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#a81723]/10 bg-white p-6 shadow-[0_18px_55px_rgba(34,34,34,0.06)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-gold">
                Trusted brands
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {brandLinks.map((brand) => (
                  <Link
                    key={brand.name}
                    href={brand.href}
                    className="group/brand rounded-[22px] border border-[#a81723]/10 bg-[#FAF8F5] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#a81723]/30 hover:bg-[#a81723] hover:shadow-[0_18px_45px_rgba(168,23,35,0.18)]"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-bold text-[#a81723] shadow-sm transition group-hover/brand:bg-[#F5E6D3]">
                      {brand.name.slice(0, 1)}
                    </span>
                    <span className="mt-3 block font-bold text-charcoal transition group-hover/brand:text-white">
                      {brand.name}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-charcoal/55 transition group-hover/brand:text-white/78">
                      {brand.copy}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/shop?max=2000"
              className="group relative isolate min-h-[320px] overflow-hidden rounded-[28px] bg-charcoal p-7 text-white shadow-[0_24px_70px_rgba(34,34,34,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(168,23,35,0.22)]"
            >
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(245,230,211,0.2),transparent_34%),linear-gradient(135deg,#222222,#7d111b)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                This week
              </p>
              <p className="mt-3 text-3xl font-semibold leading-tight">
                Beauty deals curated for your shelf.
              </p>
              <span className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#a81723] transition group-hover:bg-[#F5E6D3]">
                View offers
              </span>
            </Link>
          </div>
        </div>
      ) : null}
      {open ? (
        <div className="border-t border-maroon/10 bg-white lg:hidden">
          <div className="container-page py-4">
            <form onSubmit={submitSearch} className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon/50" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="field rounded-full pl-10"
                placeholder="Search products"
              />
            </form>
          </div>
          <nav className="container-page flex flex-col pb-4 text-sm uppercase tracking-[0.18em] text-maroon">
            {status === "authenticated" ? (
              <div className="mb-3 rounded-2xl bg-cream p-4 normal-case tracking-normal">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Signed in
                </p>
                <p className="mt-1 font-semibold text-charcoal">
                  {session.user.name || session.user.email}
                </p>
                {session.user.role === "ADMIN" ? (
                  <Link
                    href="/admin"
                    className="mt-3 inline-flex text-xs font-bold uppercase tracking-[0.18em] text-maroon"
                    onClick={() => setOpen(false)}
                  >
                    Admin dashboard
                  </Link>
                ) : null}
                <button
                  className="mt-3 block text-xs font-bold uppercase tracking-[0.18em] text-maroon"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/login" className="py-3" onClick={() => setOpen(false)}>
                Login
              </Link>
            )}
            {links.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="py-3"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
