"use client";

import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition duration-300",
        solid
          ? "border-maroon/10 bg-ivory/95 shadow-[0_12px_40px_rgba(77,12,18,0.05)] backdrop-blur"
          : "border-white/10 bg-transparent",
      )}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <Logo />
        <nav
          className={cn(
            "hidden items-center gap-9 text-[11px] font-semibold uppercase tracking-[0.24em] md:flex",
            solid ? "text-maroon" : "text-white",
          )}
        >
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-gold">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
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
            className={cn("p-2 md:hidden", solid ? "text-maroon" : "text-white")}
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-maroon/10 bg-white md:hidden">
          <nav className="container-page flex flex-col py-4 text-sm uppercase tracking-[0.18em] text-maroon">
            {links.map((link) => (
              <Link
                key={link.href}
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
