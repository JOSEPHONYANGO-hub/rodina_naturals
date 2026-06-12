"use client";

import { SlidersHorizontal, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ShopFilters({
  categories,
}: {
  categories: { name: string; slug: string }[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const paramsString = params.toString();
  const [query, setQuery] = useState(params.get("q") || "");
  const suggestions = categories.filter((category) =>
    category.name.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(paramsString);
      if (query) next.set("q", query);
      else next.delete("q");
      next.set("page", "1");
      router.push(`${pathname}?${next.toString()}`);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query, paramsString, pathname, router]);

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(paramsString);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    router.push(`${pathname}?${next.toString()}`);
  }

  function clearFilters() {
    setQuery("");
    router.push(pathname);
  }

  return (
    <aside className="h-fit rounded-[28px] border border-maroon/10 bg-white p-5 shadow-[0_18px_50px_rgba(77,12,18,0.06)]">
      <div className="mb-5 flex items-center justify-between">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-maroon">
          <SlidersHorizontal className="h-4 w-4 text-gold" />
          Refine
        </p>
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/50 transition hover:text-maroon"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon/50" />
        <input
          className="field rounded-full pl-10"
          placeholder="Search products"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && suggestions.length ? (
          <div className="absolute left-0 right-0 top-14 z-20 rounded-2xl border border-maroon/10 bg-white p-2 shadow-[0_18px_50px_rgba(77,12,18,0.12)]">
            {suggestions.slice(0, 4).map((category) => (
              <button
                key={category.slug}
                onClick={() => setFilter("category", category.slug)}
                className="block w-full rounded-xl px-3 py-2 text-left text-sm text-maroon hover:bg-cream"
              >
                {category.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-5 grid gap-4">
        <select
          className="field rounded-full"
          defaultValue={params.get("category") || ""}
          onChange={(event) => setFilter("category", event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          className="field rounded-full"
          defaultValue={params.get("category") || ""}
          onChange={(event) => setFilter("category", event.target.value)}
        >
          <option value="">All brands</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="field rounded-full"
            placeholder="Min price"
            defaultValue={params.get("min") || ""}
            onBlur={(event) => setFilter("min", event.target.value)}
          />
          <input
            className="field rounded-full"
            placeholder="Max price"
            defaultValue={params.get("max") || ""}
            onBlur={(event) => setFilter("max", event.target.value)}
          />
        </div>
      </div>
    </aside>
  );
}
