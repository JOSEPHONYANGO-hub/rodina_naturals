"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, remove, update, total } = useCart();

  return (
    <div className="bg-cream pb-20 pt-32">
      <div className="container-page">
        <h1 className="text-5xl">Your Cart</h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.length ? (
              items.map((item) => (
                <div key={item.id} className="soft-card flex gap-4 p-4">
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-white">
                    <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h2 className="text-xl">{item.name}</h2>
                        <p className="mt-1 text-sm text-maroon">{formatCurrency(item.price)}</p>
                      </div>
                      <button onClick={() => remove(item.id)} className="h-9 w-9 text-maroon" aria-label="Remove item">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="grid h-8 w-8 place-items-center bg-cream" onClick={() => update(item.id, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button className="grid h-8 w-8 place-items-center bg-cream" onClick={() => update(item.id, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="soft-card p-8">
                <p>Your cart is empty.</p>
                <Link href="/shop" className="btn-primary mt-6">Start Shopping</Link>
              </div>
            )}
          </div>
          <aside className="soft-card h-fit p-6">
            <h2 className="text-2xl">Order Summary</h2>
            <div className="mt-6 flex justify-between border-t border-maroon/10 pt-5">
              <span>Total</span>
              <strong className="text-maroon">{formatCurrency(total())}</strong>
            </div>
            <Link href="/checkout" className="btn-primary mt-6 w-full">Checkout</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
