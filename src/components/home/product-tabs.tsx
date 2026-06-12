"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";
import type { ProductCardData } from "@/types/catalog";

type ProductTabsProps = {
  bestSellers: ProductCardData[];
  newArrivals: ProductCardData[];
};

const tabs = [
  { id: "best", label: "Best Sellers" },
  { id: "new", label: "New Arrivals" },
] as const;

export function ProductTabs({ bestSellers, newArrivals }: ProductTabsProps) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("best");
  const products = active === "best" ? bestSellers : newArrivals;

  return (
    <section className="bg-ivory py-20 sm:py-24">
      <div className="container-page">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Trending now</p>
            <h2 className="section-title">Shop What Everyone Loves</h2>
          </div>
          <div className="inline-flex rounded-full border border-maroon/10 bg-white p-1 shadow-[0_12px_35px_rgba(77,12,18,0.06)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={cn(
                  "rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition",
                  active === tab.id
                    ? "bg-charcoal text-white"
                    : "text-maroon hover:bg-cream",
                )}
                onClick={() => setActive(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
