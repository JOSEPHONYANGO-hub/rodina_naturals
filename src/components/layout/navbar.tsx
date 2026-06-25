"use client";

import React from "react";
import {
  ChevronDown,
  ChevronRight,
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
import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";
import { SocialIcon } from "@/components/social-icons";
import { CATEGORIES, CONTACT_DETAILS, SOCIAL_LINKS } from "@/config/brand";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

type MegaMenuKey = "category" | "concern" | "brand";

const megaMenus: { key: MegaMenuKey; label: string }[] = [
  { key: "category", label: "Shop by Category" },
  { key: "concern", label: "Shop by Concern" },
  { key: "brand", label: "Shop by Brand" },
];

const directNavLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=skincare", label: "Skincare" },
  { href: "/shop?category=hair-care", label: "Haircare" },
  { href: "/shop?category=body-care", label: "Body Care" },
  { href: "/shop?max=2000", label: "Top Deals" },
  { href: "/contact", label: "Contact Us" },
];

const mobileLinks = [
  ...directNavLinks,
  { href: "/shop?brand=procsin", label: "Brands" },
];

const categorySidebar = [
  { title: "Beauty And Skin Care", href: "/shop?category=skincare" },
  { title: "Dermatological Skincare", href: "/shop?category=acne-and-blemishes" },
  { title: "Hair Care", href: "/shop?category=hair-care" },
  { title: "Body Care", href: "/shop?category=body-care" },
  { title: "Sun Care", href: "/shop?category=sunscreens" },
  { title: "Lip Care", href: "/shop?category=lip-care" },
  { title: "Eye Care", href: "/shop?category=eye-care" },
  { title: "Mum And Baby", href: "/shop?q=kids" },
  { title: "Men's Grooming", href: "/shop?category=mens-grooming" },
  { title: "Foot Care", href: "/shop?category=foot-care" },
];

const categoryColumns = [
  {
    title: "Body Care",
    href: "/shop?category=body-care",
    items: ["Body Lotions", "Body Scrubs", "Shower Gels", "Hand Creams", "Foot Creams", "Body Sprays"],
  },
  {
    title: "Face Care",
    href: "/shop?category=skincare",
    items: ["Clay Mask", "Creams & Gels", "Creams & Moisturisers", "Exfoliating Mask", "Eye Creams", "Face Cleansers", "Face Creams", "Face Mask", "Face Masks", "Face Scrub", "Face Oils", "Face Soaps & Cleansers", "Face Scrubs", "Serums", "Toners"],
  },
  {
    title: "Hair Care",
    href: "/shop?category=hair-care",
    items: ["Shampoo", "Conditioner", "Hair Oils", "Hair Masks", "Hair Growth Products", "Styling Products", "Anti Hair Loss", "Dandruff Care"],
  },
  {
    title: "Targeted Care",
    href: "/shop",
    items: ["Acne & Blemishes", "Anti-Aging", "Sensitive Skin", "Sunscreens", "Lip Care", "Eye Care", "Foot Care"],
  },
];

const brandLinks = [
  { name: "Procsin", href: "/shop?brand=procsin", logo: "/brand-logos/procsin-logo.jpg" },
  { name: "Rain", href: "/shop?brand=rain", logo: "/brand-logos/rain-logo.jpg" },
  { name: "Sera", href: "/shop?brand=sera", logo: "/brand-logos/sera-logo.jpg" },
  { name: "Bioxcin", href: "/shop?brand=bioxcin" },
  { name: "Thalia", href: "/shop?brand=thalia" },
  { name: "Restorex", href: "/shop?brand=restorex" },
  { name: "Bioblas", href: "/shop?brand=bioblas" },
  { name: "Nice & Lovely", href: "/shop?brand=nice-and-lovely" },
  { name: "Dove", href: "/shop?brand=dove" },
  { name: "Garnier", href: "/shop?brand=garnier" },
];

const concernLinks = [
  { title: "Skin Concerns", items: ["Acne & Blemishes", "Dry Skin", "Oily Skin", "Sensitive Skin", "Hyperpigmentation", "Anti-Aging"] },
  { title: "Hair Concerns", items: ["Hair Loss", "Dandruff", "Dry Hair", "Damaged Hair", "Weak Hair", "Curly Hair Care"] },
  { title: "Body Concerns", items: ["Stretch Marks", "Dark Spots", "Uneven Skin Tone", "Dry Skin"] },
];

const categorySlugOverrides: Record<string, string> = {
  "Body Lotions": "body-lotion",
  "Creams & Moisturisers": "moisturizers",
  "Face Mask": "face-masks",
  "Face Scrub": "face-scrubs",
  "Face Soaps & Cleansers": "cleansers",
  "Anti Hair Loss": "hair-loss",
  "Dandruff Care": "dandruff",
};

function categoryFilterHref(label: string) {
  const slug = categorySlugOverrides[label] || label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `/shop?category=${slug}&page=1`;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaMenuKey | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const count = useCart((state) => state.count());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { setMounted(true); }, []);
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
      onMouseLeave={() => setActiveMega(null)}
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
                  href={categoryFilterHref(category)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-cream"
                  onClick={() => setSearch("")}
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
            {mounted && count > 0 ? (
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
        <div className="container-page flex min-h-[50px] items-center justify-center gap-9 text-sm font-semibold normal-case tracking-normal text-white">
          {directNavLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="group relative inline-flex items-center gap-1 whitespace-nowrap py-4 transition duration-300 hover:text-[#F5E6D3]"
              onMouseEnter={() => setActiveMega(null)}
              onFocus={() => setActiveMega(null)}
            >
              {link.label}
              <span className="absolute bottom-2 left-0 h-0.5 w-full origin-left scale-x-0 bg-[#F5E6D3] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
          {megaMenus.map((menu) => (
            <button
              key={menu.key}
              className="group relative inline-flex items-center gap-1 whitespace-nowrap py-4 transition duration-300 hover:text-[#F5E6D3]"
              onMouseEnter={() => setActiveMega(menu.key)}
              onFocus={() => setActiveMega(menu.key)}
              type="button"
            >
              {menu.label}
              <ChevronDown className={cn("h-4 w-4 transition duration-300", activeMega === menu.key && "rotate-180")} />
              <span className="absolute bottom-2 left-0 h-0.5 w-full origin-left scale-x-0 bg-[#F5E6D3] transition-transform duration-300 group-hover:scale-x-100" />
            </button>
          ))}
        </div>
      </nav>

      {activeMega ? (
        <div className="absolute inset-x-0 top-full z-50 hidden bg-transparent px-5 pt-2 text-charcoal animate-in fade-in slide-in-from-top-3 duration-300 lg:block">
          <div className="container-page">
            <div className="mx-auto max-h-[min(54vh,470px)] max-w-[1000px] overflow-hidden rounded-[14px] border border-[#e7edf3] bg-white shadow-[0_28px_80px_rgba(34,34,34,0.22)]">
              {activeMega === "category" ? (
                <div className="grid h-[min(54vh,470px)] grid-cols-[230px_1fr]">
                  <div className="overscroll-contain overflow-y-auto border-r border-[#e7edf3] bg-[#fbfcfd] p-3 [scrollbar-color:#a81723_#f5e6d3] [scrollbar-width:thin]">
                    {categorySidebar.map((category) => (
                      <Link
                        key={category.title}
                        href={category.href}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-[#243041] transition hover:bg-white hover:text-[#a81723]"
                        onClick={() => setActiveMega(null)}
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F5E6D3] text-[11px] text-[#a81723] transition group-hover:bg-[#a81723] group-hover:text-white">
                          {category.title.slice(0, 1)}
                        </span>
                        <span className="flex-1 leading-4">{category.title}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-[#9aa5b1] transition group-hover:text-[#a81723]" />
                      </Link>
                    ))}
                  </div>
                  <div className="overscroll-contain overflow-y-auto p-5 [scrollbar-color:#a81723_#f5e6d3] [scrollbar-width:thin]">
                    <div className="mb-5 flex items-center justify-between border-b border-[#edf1f5] pb-4">
                      <h2 className="text-base font-bold text-[#243041]">Beauty And Skin Care</h2>
                      <Link href="/shop" onClick={() => setActiveMega(null)} className="rounded-full border border-[#a81723]/20 px-5 py-2 text-xs font-bold text-[#a81723] transition hover:bg-[#F5E6D3]">
                        View all
                      </Link>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2">
                      {categoryColumns.map((group) => (
                        <div key={group.title}>
                          <Link href={group.href} onClick={() => setActiveMega(null)} className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-[#243041] hover:text-[#a81723]">
                            {group.title}
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                          <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                            {group.items.map((item) => (
                              <Link
                                key={`${group.title}-${item}`}
                                href={categoryFilterHref(item)}
                                onClick={() => setActiveMega(null)}
                                className="text-xs font-medium text-[#667085] transition duration-200 hover:translate-x-0.5 hover:text-[#a81723]"
                              >
                                {item}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {activeMega === "brand" ? (
                <div className="max-h-[min(54vh,470px)] overscroll-contain overflow-y-auto p-5 [scrollbar-color:#a81723_#f5e6d3] [scrollbar-width:thin]">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#243041]">Featured Brands</h2>
                    <Link href="/shop" onClick={() => setActiveMega(null)} className="rounded-full border border-[#a81723]/20 px-5 py-2 text-xs font-bold text-[#a81723] transition hover:bg-[#F5E6D3]">
                      View all brands
                    </Link>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {brandLinks.map((brand) => (
                      <Link
                        key={brand.name}
                        href={brand.href}
                        onClick={() => setActiveMega(null)}
                        className="group grid min-h-[78px] place-items-center rounded-xl border border-[#e3e9f0] bg-[#fbfcfd] px-3 py-2 text-center transition duration-300 hover:-translate-y-0.5 hover:border-[#a81723] hover:bg-white hover:shadow-[0_14px_32px_rgba(168,23,35,0.1)]"
                      >
                        {brand.logo ? (
                          <span className="relative h-9 w-full">
                            <Image src={brand.logo} alt={`${brand.name} logo`} fill sizes="160px" className="object-contain" />
                          </span>
                        ) : (
                          <span className="text-lg font-extrabold text-[#243041] group-hover:text-[#a81723]">{brand.name}</span>
                        )}
                        <span className="mt-2 text-[10px] font-extrabold uppercase text-[#243041]">{brand.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Link href="/shop" onClick={() => setActiveMega(null)} className="inline-flex rounded-lg bg-[#a81723] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#7d111b]">
                      Browse all brands
                    </Link>
                  </div>
                </div>
              ) : null}

              {activeMega === "concern" ? (
                <div className="max-h-[min(54vh,470px)] overscroll-contain overflow-y-auto p-5 [scrollbar-color:#a81723_#f5e6d3] [scrollbar-width:thin]">
                  <div className="mb-5 flex items-center justify-between border-b border-[#edf1f5] pb-4">
                    <h2 className="text-base font-bold text-[#243041]">Shop by Concern</h2>
                    <Link href="/shop" onClick={() => setActiveMega(null)} className="rounded-full border border-[#a81723]/20 px-5 py-2 text-xs font-bold text-[#a81723] transition hover:bg-[#F5E6D3]">
                      View all
                    </Link>
                  </div>
                  <div className="grid gap-5 md:grid-cols-3">
                    {concernLinks.map((group) => (
                      <div key={group.title} className="rounded-xl border border-[#e3e9f0] bg-[#fbfcfd] p-5">
                        <h3 className="font-bold text-[#243041]">{group.title}</h3>
                        <div className="mt-4 grid gap-2">
                          {group.items.map((item) => (
                            <Link key={item} href={categoryFilterHref(item)} onClick={() => setActiveMega(null)} className="text-sm text-[#667085] transition duration-200 hover:translate-x-0.5 hover:text-[#a81723]">
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
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
            {mobileLinks.map((link) => (
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
