"use client";

import { Eye, Heart, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { cn, formatCurrency } from "@/lib/utils";
import type { ProductCardData } from "@/types/catalog";

type ProductCardProps = {
  product: ProductCardData;
  variant?: "default" | "shop";
};

const PRODUCT_IMAGE_FALLBACK = "/rodina-logo.jpeg";

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const add = useCart((state) => state.add);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const soldOut = product.stock < 1;
  const image = product.images[0] || PRODUCT_IMAGE_FALLBACK;
  const price = Number(product.price);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;
  const hasOffer = salePrice !== null && salePrice > 0 && salePrice < price;
  const displayPrice = hasOffer ? salePrice : price;
  const offerPercent = hasOffer ? Math.round(((price - salePrice) / price) * 100) : 0;

  const addProduct = () =>
    add({
      id: product.id,
      name: product.name,
      price: displayPrice,
      image,
    });

  if (variant === "shop") {
    return (
      <>
        <article className="group relative overflow-hidden rounded-[8px] border border-[#d7e0ea] bg-white p-3 shadow-[0_10px_24px_rgba(34,34,34,0.03)] transition duration-300 hover:-translate-y-0.5 hover:border-[#ed0b68] hover:shadow-[0_18px_38px_rgba(237,11,104,0.08)]">
          {hasOffer ? (
            <span className="absolute left-4 top-0 z-10 rounded-b-[4px] bg-[#ed0b68] px-3 py-1.5 text-[11px] font-bold text-white">
              {offerPercent}% Off
            </span>
          ) : soldOut ? (
            <span className="absolute left-4 top-0 z-10 rounded-b-[4px] bg-[#222222] px-3 py-1.5 text-[11px] font-bold text-white">
              Sold Out
            </span>
          ) : null}
          <Link href={`/products/${product.slug}`} className="block">
            <div className="relative mx-auto h-[132px] w-full overflow-hidden bg-white">
              <Image
                src={image}
                alt={product.name}
                fill
                sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw"
                className="object-contain p-2 transition duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <button
              className="grid h-9 w-9 place-items-center rounded-full border border-[#9ca3af] bg-white text-[#6b7280] transition hover:border-[#ed0b68] hover:text-[#ed0b68]"
              aria-label={`Quick view ${product.name}`}
              onClick={() => setQuickViewOpen(true)}
              type="button"
            >
              <Eye className="h-4 w-4" />
            </button>
            <Link
              href="/shop"
              className="grid h-9 w-9 place-items-center rounded-full border border-[#ed0b68] bg-white text-[#ed0b68] transition hover:bg-[#ed0b68] hover:text-white"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
            </Link>
          </div>
          <div className="pt-3">
            <p className="text-xs text-[#8a94a6]">{product.category?.name || product.brand?.name}</p>
            <Link href={`/products/${product.slug}`}>
              <h3 className="mt-1 line-clamp-2 min-h-[2.55rem] text-[14px] font-bold leading-snug text-[#111827] transition hover:text-[#ed0b68]">
                {product.name}
              </h3>
            </Link>
            <div className="mt-3 flex min-h-5 items-center gap-2 text-sm">
              {hasOffer ? (
                <span className="font-medium text-[#9ca3af] line-through">{formatCurrency(product.price)}</span>
              ) : null}
              <span className="font-semibold text-[#111827]">{formatCurrency(displayPrice)}</span>
            </div>
            <button
              onClick={addProduct}
              className="mt-3 h-9 w-full rounded-full bg-[#f4f3fb] text-sm font-bold text-[#111827] transition hover:bg-[#66b345] hover:text-white disabled:cursor-not-allowed disabled:bg-[#eef0f5] disabled:text-[#9ca3af]"
              disabled={soldOut}
              type="button"
            >
              + {soldOut ? "Out Of Stock" : "Add To Cart"}
            </button>
          </div>
        </article>

        {quickViewOpen ? (
          <div
            className="fixed inset-0 z-[80] grid place-items-center bg-charcoal/55 px-4 py-8 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative grid w-full max-w-4xl overflow-hidden rounded-[30px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.3)] md:grid-cols-[0.9fr_1fr]">
              <button
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-maroon shadow"
                onClick={() => setQuickViewOpen(false)}
                aria-label="Close quick view"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative min-h-[320px] bg-rose/30">
                <Image src={image} alt={product.name} fill sizes="50vw" className="object-contain p-6" />
              </div>
              <div className="p-7 sm:p-9">
                <p className="eyebrow">{product.category?.name}</p>
                <h3 className="mt-3 text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
                  {product.name}
                </h3>
                <div className="mt-5 flex items-center gap-3">
                  {hasOffer ? (
                    <span className="text-lg font-semibold text-ink/45 line-through">{formatCurrency(product.price)}</span>
                  ) : null}
                  <span className="text-xl font-bold text-maroon">{formatCurrency(displayPrice)}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-ink/65">
                  Premium beauty essential selected for modern everyday routines.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={addProduct}
                    disabled={soldOut}
                    className={cn("btn-primary", soldOut && "cursor-not-allowed opacity-45")}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {soldOut ? "Out Of Stock" : "Add To Cart"}
                  </button>
                  <Link href={`/products/${product.slug}`} className="btn-secondary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <article className="group overflow-hidden rounded-[18px] border border-maroon/10 bg-white shadow-[0_18px_55px_rgba(77,12,18,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(77,12,18,0.11)]">
        <div className="relative">
          <Link href={`/products/${product.slug}`} className="block">
            <div className="relative h-[150px] overflow-hidden bg-white sm:h-[165px] lg:h-[180px]">
              <Image
                src={image}
                alt={product.name}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-contain p-3 transition duration-500 group-hover:scale-105"
              />
              {product.images[1] ? (
                <Image
                  src={product.images[1]}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-contain p-3 opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
              ) : null}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-charcoal/35 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            </div>
          </Link>
          {hasOffer || soldOut ? (
            <div className="absolute left-4 top-0">
              <span className={cn("rounded-b-[4px] px-3 py-1.5 text-[11px] font-bold text-white shadow", soldOut ? "bg-[#222222]" : "bg-[#ed0b68]")}>
                {soldOut ? "Sold Out" : `${offerPercent}% Off`}
              </span>
            </div>
          ) : null}
          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
            <button
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-maroon shadow transition hover:bg-maroon hover:text-white"
              aria-label={`Quick view ${product.name}`}
              onClick={() => setQuickViewOpen(true)}
            >
              <Eye className="h-4 w-4" />
            </button>
            <Link
              href="/shop"
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-maroon shadow transition hover:bg-maroon hover:text-white"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="px-4 pb-4 pt-4 transition duration-300 group-hover:bg-[#a81723]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a81723] transition group-hover:text-[#F5E6D3]">
            {product.brand?.name || product.category?.name}
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-2 line-clamp-2 min-h-[3rem] text-[15px] font-semibold leading-snug text-charcoal transition group-hover:text-white">
              {product.name}
            </h3>
          </Link>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-maroon/10 pt-4 transition group-hover:border-white/18">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {hasOffer ? (
                <span className="text-sm font-semibold text-charcoal/42 line-through transition group-hover:text-white/60">
                  {formatCurrency(product.price)}
                </span>
              ) : null}
              <span className="text-sm font-bold tracking-[0.02em] text-maroon transition group-hover:text-white sm:text-base">
                {formatCurrency(displayPrice)}
              </span>
            </div>
            <button
              onClick={addProduct}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-charcoal text-white transition hover:bg-maroon group-hover:bg-white group-hover:text-[#a81723] group-hover:hover:bg-[#F5E6D3] disabled:cursor-not-allowed disabled:bg-charcoal/20"
              aria-label={`Add ${product.name} to cart`}
              disabled={soldOut}
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </article>

      {quickViewOpen ? (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-charcoal/55 px-4 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative grid w-full max-w-4xl overflow-hidden rounded-[30px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.3)] md:grid-cols-[0.9fr_1fr]">
            <button
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-maroon shadow"
              onClick={() => setQuickViewOpen(false)}
              aria-label="Close quick view"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative min-h-[320px] bg-rose/30">
              <Image src={image} alt={product.name} fill sizes="50vw" className="object-cover" />
            </div>
            <div className="p-7 sm:p-9">
              <p className="eyebrow">{product.category?.name}</p>
              <h3 className="mt-3 text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
                {product.name}
              </h3>
              <div className="mt-5 flex items-center gap-3">
                {hasOffer ? (
                  <span className="text-lg font-semibold text-ink/45 line-through">{formatCurrency(product.price)}</span>
                ) : null}
                <span className="text-xl font-bold text-maroon">{formatCurrency(displayPrice)}</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-ink/65">
                Premium beauty essential selected for modern everyday routines.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={addProduct}
                  disabled={soldOut}
                  className={cn("btn-primary", soldOut && "cursor-not-allowed opacity-45")}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {soldOut ? "Out Of Stock" : "Add To Cart"}
                </button>
                <Link href={`/products/${product.slug}`} className="btn-secondary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
