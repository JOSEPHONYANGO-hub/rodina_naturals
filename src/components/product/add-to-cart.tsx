"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";

export function AddToCartButton({
  product,
}: {
  product: { id: string; name: string; price: number; image: string; stock: number };
}) {
  const add = useCart((state) => state.add);

  return (
    <button
      className="btn-primary w-full sm:w-auto"
      disabled={product.stock < 1}
      onClick={() =>
        add({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        })
      }
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      {product.stock > 0 ? "Add To Cart" : "Out Of Stock"}
    </button>
  );
}
