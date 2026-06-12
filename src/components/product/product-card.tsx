"use client";

import { Eye, Heart, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { cn, formatCurrency } from "@/lib/utils";
import type { ProductCardData } from "@/types/catalog";

type ProductCardProps = {
  product: ProductCardData;
};

export function ProductCard({ product }: ProductCardProps) {
  const add = useCart((state) => state.add);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const soldOut = product.stock < 1;
  const image = product.images[0];

  const addProduct = () =>
    add({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image,
    });

  return (
    <>
      <article className="group overflow-hidden rounded-[28px] border border-maroon/10 bg-white shadow-[0_18px_55px_rgba(77,12,18,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(77,12,18,0.11)]">
        <div className="relative">
          <Link href={`/products/${product.slug}`} className="block">
            <div className="relative aspect-[4/5] overflow-hidden bg-rose/35">
              <Image
                src={image}
                alt={product.name}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              {product.images[1] ? (
                <Image
                  src={product.images[1]}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
              ) : null}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-charcoal/35 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            </div>
          </Link>
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-maroon shadow">
              {soldOut ? "Sold Out" : "In Stock"}
            </span>
          </div>
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
        <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
            {product.category?.name}
          </p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-2 min-h-[3.5rem] text-base font-semibold leading-snug text-charcoal transition group-hover:text-maroon sm:text-lg">
              {product.name}
            </h3>
          </Link>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-maroon/10 pt-4">
            <p className="text-sm font-bold tracking-[0.04em] text-maroon sm:text-base">
              {formatCurrency(product.price)}
            </p>
            <button
              onClick={addProduct}
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-charcoal px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-maroon disabled:cursor-not-allowed disabled:bg-charcoal/20 sm:px-5"
              aria-label={`Add ${product.name} to cart`}
              disabled={soldOut}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add
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
              <p className="mt-5 text-xl font-bold text-maroon">{formatCurrency(product.price)}</p>
              <p className="mt-4 text-sm leading-7 text-ink/65">
                Premium beauty essential selected for modern everyday routines.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={addProduct}
                  disabled={soldOut}
                  className={cn("btn-primary", soldOut && "cursor-not-allowed opacity-45")}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
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
