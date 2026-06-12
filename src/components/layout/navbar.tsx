"use client";

import {
  ChevronDown,
  Mail,
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";
import { CATEGORIES, CONTACT_DETAILS, SOCIAL_LINKS } from "@/config/brand";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/shop", label: "All Products", hasMega: true },
  { href: "/shop", label: "Our Brands", hasMega: true },
  { href: "/shop?category=thalia", label: "Skincare" },
  { href: "/shop?category=bioblas", label: "Haircare" },
  { href: "/shop?q=makeup", label: "Makeup" },
  { href: "/shop?category=rain", label: "Bath & Body" },
  { href: "/shop?max=2000", label: "Offers / Deals" },
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
      className="sticky inset-x-0 top-0 z-50 border-b-4 border-brandPurple bg-white text-brandPurple shadow-[0_10px_30px_rgba(36,22,23,0.08)]"
      onMouseLeave={() => setMegaOpen(false)}
    >
      <div className="bg-brandPurple text-white">
        <div className="container-page flex min-h-9 flex-wrap items-center justify-between gap-x-5 gap-y-2 py-2 text-xs font-bold sm:text-sm">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call to order: {CONTACT_DETAILS.phone}
            </a>
            <a href="mailto:customercare@rodinabeauty.co.ke" className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email: customercare@rodinabeauty.co.ke
            </a>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/shop" className="hover:text-cream">
              Newsletter
            </Link>
            <Link href={SOCIAL_LINKS.facebook} className="hover:text-cream" aria-label="Facebook">
              F
            </Link>
            <Link href={SOCIAL_LINKS.instagram} className="hover:text-cream" aria-label="Instagram">
              IG
            </Link>
            <Link href={SOCIAL_LINKS.tiktok} className="hover:text-cream" aria-label="TikTok">
              TT
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page flex min-h-[78px] items-center justify-between gap-5 py-3">
        <Logo className="shrink-0" />
        <form
          onSubmit={submitSearch}
          className="relative hidden max-w-3xl flex-1 items-center text-charcoal md:flex"
        >
          <Search className="absolute right-4 h-5 w-5 text-charcoal" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search beauty essentials"
            className="h-12 w-full rounded-full border border-charcoal/20 bg-[#f8f8f8] pl-5 pr-12 text-sm font-medium text-charcoal outline-none transition placeholder:text-charcoal/50 focus:border-brandPurple focus:bg-white"
          />
          {search && suggestions.length ? (
            <div className="absolute left-0 right-0 top-14 overflow-hidden rounded-2xl border border-maroon/10 bg-white p-2 text-maroon shadow-[0_18px_50px_rgba(77,12,18,0.12)]">
              {suggestions.map((category) => (
                <Link
                  key={category}
                  href={`/shop?category=${category.toLowerCase()}`}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-cream"
                >
                  <Sparkles className="h-3.5 w-3.5 text-gold" />
                  {category}
                </Link>
              ))}
            </div>
          ) : null}
        </form>
        <div className="flex items-center gap-2 text-brandPurple sm:gap-4">
          <Link
            href="/shop"
            className="hidden p-2 transition hover:text-brandPurpleDark sm:block"
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </Link>
          <div className="relative">
            {status === "authenticated" ? (
              <button
                className={cn(
                  "flex items-center gap-2 rounded-full border px-2 py-1.5 text-xs font-semibold transition hover:border-gold",
                  "border-brandPurple/15 bg-white text-brandPurple",
                )}
                onClick={() => setAccountOpen((value) => !value)}
                aria-label="Account menu"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-[11px] font-bold uppercase text-brandPurple">
                  {(session.user.name || session.user.email || "A").slice(0, 1)}
                </span>
                <span className="hidden max-w-28 truncate xl:inline">
                  {session.user.name || "Account"}
                </span>
              </button>
            ) : (
              <Link
                href="/login"
                className="p-2 text-brandPurple transition hover:text-brandPurpleDark"
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
            className="relative p-2 text-brandPurple transition hover:text-brandPurpleDark"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-semibold text-brandPurple">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            className="p-2 text-brandPurple lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav className="hidden border-t border-maroon/10 bg-white lg:block">
        <div className="container-page flex min-h-[58px] items-center justify-center gap-7 text-sm font-bold text-brandPurple xl:gap-10 xl:text-base">
          {links.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="inline-flex items-center gap-1 whitespace-nowrap transition hover:text-brandPurpleDark"
              onMouseEnter={() => setMegaOpen(Boolean(link.hasMega))}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brandPurple/10 text-brandPurple">
                {link.label.slice(0, 1)}
              </span>
              {link.label}
              {link.hasMega ? <ChevronDown className="h-4 w-4" /> : null}
            </Link>
          ))}
        </div>
      </nav>

      {megaOpen ? (
        <div className="hidden border-t border-maroon/10 bg-white shadow-[0_24px_70px_rgba(77,12,18,0.1)] lg:block">
          <div className="container-page grid gap-8 py-7 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                Explore Rodina
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    href={`/shop?category=${category.toLowerCase()}`}
                    className="rounded-2xl border border-maroon/10 bg-cream px-5 py-4 text-sm font-semibold text-maroon transition hover:border-gold hover:bg-white"
                  >
                    {category}
                    <span className="mt-1 block text-xs font-normal text-ink/55">
                      Shop the {category} collection
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/shop?max=2000"
              className="rounded-[28px] bg-charcoal p-7 text-white transition hover:bg-maroon"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                This week
              </p>
              <p className="mt-3 text-3xl font-semibold leading-tight">
                Beauty deals curated for your shelf.
              </p>
              <span className="mt-5 inline-flex text-xs font-semibold uppercase tracking-[0.22em] text-white">
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
