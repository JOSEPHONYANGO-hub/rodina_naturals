"use client";

import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { CATEGORIES } from "@/config/brand";
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
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const count = useCart((state) => state.count());
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !isHome || open;
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
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition duration-300",
        solid
          ? "border-maroon/10 bg-ivory/95 shadow-[0_12px_40px_rgba(77,12,18,0.05)] backdrop-blur"
          : "border-white/10 bg-transparent",
      )}
      onMouseLeave={() => setMegaOpen(false)}
    >
      <div className="container-page flex h-[76px] items-center justify-between gap-4">
        <Logo className="shrink-0" />
        <nav
          className={cn(
            "hidden items-center gap-5 text-[10px] font-semibold uppercase tracking-[0.18em] lg:flex xl:gap-7",
            solid ? "text-maroon" : "text-white",
          )}
        >
          {links.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="inline-flex items-center gap-1 whitespace-nowrap transition hover:text-gold"
              onMouseEnter={() => setMegaOpen(Boolean(link.hasMega))}
            >
              {link.label}
              {link.hasMega ? <ChevronDown className="h-3 w-3" /> : null}
            </Link>
          ))}
        </nav>
        <form
          onSubmit={submitSearch}
          className={cn(
            "relative hidden min-w-[230px] max-w-[330px] flex-1 items-center xl:flex",
            solid ? "text-maroon" : "text-white",
          )}
        >
          <Search className="absolute left-4 h-4 w-4 opacity-70" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search beauty essentials"
            className={cn(
              "h-11 w-full rounded-full border pl-11 pr-4 text-sm outline-none transition placeholder:text-current/50 focus:border-gold",
              solid
                ? "border-maroon/10 bg-white text-maroon"
                : "border-white/25 bg-white/10 text-white backdrop-blur",
            )}
          />
          {search && suggestions.length ? (
            <div className="absolute left-0 right-0 top-12 overflow-hidden rounded-2xl border border-maroon/10 bg-white p-2 text-maroon shadow-[0_18px_50px_rgba(77,12,18,0.12)]">
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
        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/shop"
            className={cn("hidden p-2 transition hover:text-gold sm:block", solid ? "text-maroon" : "text-white")}
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </Link>
          <Link
            href="/login"
            className={cn("p-2 transition hover:text-gold", solid ? "text-maroon" : "text-white")}
            aria-label="Login"
          >
            <UserRound size={20} />
          </Link>
          <Link
            href="/cart"
            className={cn("relative p-2 transition hover:text-gold", solid ? "text-maroon" : "text-white")}
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-semibold text-maroon">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            className={cn("p-2 lg:hidden", solid ? "text-maroon" : "text-white")}
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
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
