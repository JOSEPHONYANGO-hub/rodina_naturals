"use client";

import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import type { ProductCardData } from "@/types/catalog";

type ProductCardProps = {
  product: ProductCardData;
};

export function ProductCard({ product }: ProductCardProps) {
  const add = useCart((state) => state.add);
  const soldOut = product.stock < 1;

  return (
    <article className="group bg-ivory">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-rose/35">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-maroon/28 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
          {soldOut ? (
            <span className="absolute left-4 top-4 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-maroon">
              Sold Out
            </span>
          ) : null}
        </div>
      </Link>
      <div className="border-x border-b border-maroon/10 bg-white px-5 pb-5 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-gold">
          {product.category?.name}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 min-h-14 text-xl leading-snug transition group-hover:text-maroonDark">
            {product.name}
          </h3>
        </Link>
        <div className="mt-5 flex items-center justify-between border-t border-maroon/10 pt-4">
          <p className="text-sm font-semibold tracking-[0.08em] text-maroon">
            {formatCurrency(product.price)}
          </p>
          <button
            onClick={() =>
              add({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.images[0],
              })
            }
            className="grid h-10 w-10 place-items-center border border-maroon bg-maroon text-white transition hover:border-gold hover:bg-gold hover:text-maroon disabled:cursor-not-allowed disabled:border-maroon/20 disabled:bg-maroon/20"
            aria-label={`Add ${product.name} to cart`}
            disabled={soldOut}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
