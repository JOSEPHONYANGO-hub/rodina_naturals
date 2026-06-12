"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";

export function AddToCartButton({
  product,
}: {
  product: { id: string; name: string; price: number; image: string; stock: number };
}) {
  const add = useCart((state) => state.add);
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = Math.max(product.stock, 1);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex h-12 w-full items-center justify-between rounded-full border border-maroon/15 bg-white px-2 sm:w-36">
        <button
          className="grid h-9 w-9 place-items-center rounded-full text-maroon transition hover:bg-cream"
          onClick={() => setQuantity((value) => Math.max(value - 1, 1))}
          aria-label="Decrease quantity"
          type="button"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="text-sm font-bold text-charcoal">{quantity}</span>
        <button
          className="grid h-9 w-9 place-items-center rounded-full text-maroon transition hover:bg-cream"
          onClick={() => setQuantity((value) => Math.min(value + 1, maxQuantity))}
          aria-label="Increase quantity"
          type="button"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        className="btn-primary w-full sm:w-auto"
        disabled={product.stock < 1}
        onClick={() =>
          add(
            {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
            },
            quantity,
          )
        }
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        {product.stock > 0 ? "Add To Cart" : "Out Of Stock"}
      </button>
    </div>
  );
}
