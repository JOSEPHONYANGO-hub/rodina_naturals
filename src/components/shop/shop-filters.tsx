"use client";

import { ChevronUp, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ShopFilters({
  brands,
  categories,
}: {
  brands: { name: string; slug: string }[];
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

  const selectedCategory = params.get("category") || "";
  const selectedBrand = params.get("brand") || "";

  return (
    <aside className="h-fit overflow-hidden rounded-[12px] border border-[#d7e0ea] bg-white shadow-[0_10px_30px_rgba(34,34,34,0.04)]">
      <div className="flex items-center justify-between border-b border-[#e5ebf1] bg-[#F5E6D3] px-4 py-3">
        <p className="text-xs font-semibold text-[#a81723]">Category</p>
        <ChevronUp className="h-4 w-4 text-[#a81723]" />
      </div>
      <div className="p-4">
        <button
          onClick={clearFilters}
          className="mb-4 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/50 transition hover:text-maroon"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon/50" />
          <input
            className="field h-10 rounded-lg pl-10 text-sm"
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
        <div className="mt-5 grid max-h-[420px] gap-3 overflow-y-auto pr-1 text-sm text-[#4b5563]">
          {categories.slice(0, 22).map((category) => (
            <label key={category.slug} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#cfd8e3] text-[#a81723] focus:ring-[#a81723]"
                checked={selectedCategory === category.slug}
                onChange={() => setFilter("category", selectedCategory === category.slug ? "" : category.slug)}
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 border-t border-[#e5ebf1] pt-4">
          <p className="mb-3 text-xs font-semibold text-[#a81723]">Brand</p>
          <div className="grid gap-3 text-sm text-[#4b5563]">
            {brands.map((brand) => (
              <label key={brand.slug} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#cfd8e3] text-[#a81723] focus:ring-[#a81723]"
                  checked={selectedBrand === brand.slug}
                  onChange={() => setFilter("brand", selectedBrand === brand.slug ? "" : brand.slug)}
                />
                <span>{brand.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-[#e5ebf1] pt-4">
          <p className="mb-3 text-xs font-semibold text-[#a81723]">Price</p>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="field h-10 rounded-lg text-sm"
              placeholder="Min price"
              defaultValue={params.get("min") || ""}
              onBlur={(event) => setFilter("min", event.target.value)}
            />
            <input
              className="field h-10 rounded-lg text-sm"
              placeholder="Max price"
              defaultValue={params.get("max") || ""}
              onBlur={(event) => setFilter("max", event.target.value)}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
