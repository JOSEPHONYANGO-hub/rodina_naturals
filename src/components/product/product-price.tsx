"use client";

import { formatCurrency } from "@/lib/utils";

export function ProductPrice({
  price,
  salePrice,
}: {
  price: string;
  salePrice: string | null;
}) {
  const full = parseFloat(price);
  const sale = salePrice ? parseFloat(salePrice) : null;
  const hasOffer = sale !== null && sale > 0 && sale < full;

  if (hasOffer) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-xl font-bold tracking-[0.04em] text-maroon">
          {formatCurrency(sale)}
        </p>
        <p className="text-base font-semibold text-ink/40 line-through">
          {formatCurrency(full)}
        </p>
      </div>
    );
  }

  return (
    <p className="text-xl font-bold tracking-[0.04em] text-maroon">
      {formatCurrency(full)}
    </p>
  );
}
