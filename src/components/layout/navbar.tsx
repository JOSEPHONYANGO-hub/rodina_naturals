"use client";

import {
  ChevronDown,
  Heart,
  Menu,
  MapPin,
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
import { CATEGORIES, CONTACT_DETAILS } from "@/config/brand";
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
          <div className="hidden items-center justify-end gap-6 sm:flex">
            <Link href="/contact" className="hover:text-[#F5E6D3]">
              Shipping & return
            </Link>
            <Link href="/cart" className="hover:text-[#F5E6D3]">
              Track order
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
            <ShoppingBag size={20} />
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
              className="inline-flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent py-4 transition hover:border-[#F5E6D3] hover:text-[#F5E6D3]"
              onMouseEnter={() => setMegaOpen(Boolean(link.hasMega))}
            >
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
