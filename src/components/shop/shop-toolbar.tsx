"use client";

import { Grid3X3 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ShopToolbar({
  total,
  pageSize,
  sort,
}: {
  total: number;
  pageSize: number;
  sort: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    next.set(key, value);
    next.set("page", "1");
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-[14px] border border-[#d7e0ea] bg-white px-4 py-3 shadow-[0_10px_30px_rgba(34,34,34,0.04)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-sm text-[#6b7280]">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#eef8ef] text-[#66b345]">
          <Grid3X3 className="h-4 w-4" />
        </span>
        <span>
          Showing <strong className="text-xl text-[#66b345]">{pageSize}</strong> of {total} products
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b94a3]">
        <label className="flex items-center gap-2">
          Sort
          <select
            className="h-10 rounded-lg border border-[#d7e0ea] bg-[#f8fafc] px-3 text-xs font-semibold normal-case tracking-normal text-[#374151]"
            value={sort}
            onChange={(event) => setParam("sort", event.target.value)}
          >
            <option value="recommended">Recommended</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          Show
          <select
            className="h-10 rounded-lg border border-[#d7e0ea] bg-[#f8fafc] px-3 text-xs font-semibold normal-case tracking-normal text-[#374151]"
            value={String(pageSize)}
            onChange={(event) => setParam("take", event.target.value)}
          >
            <option value="20">20 per page</option>
            <option value="40">40 per page</option>
          </select>
        </label>
      </div>
    </div>
  );
}
