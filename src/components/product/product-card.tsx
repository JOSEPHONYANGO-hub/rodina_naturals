"use client";

import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: string | number;
    images: string[];
    stock: number;
    category?: { name: string };
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const add = useCart((state) => state.add);

  return (
    <article className="group bg-white">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">{product.category?.name}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 text-xl transition group-hover:text-maroonDark">{product.name}</h3>
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <p className="font-semibold text-maroon">{formatCurrency(product.price)}</p>
          <button
            onClick={() =>
              add({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.images[0],
              })
            }
            className="grid h-10 w-10 place-items-center bg-maroon text-white transition hover:bg-gold"
            aria-label={`Add ${product.name} to cart`}
            disabled={product.stock < 1}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
