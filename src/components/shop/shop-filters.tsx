"use client";

import { Search } from "lucide-react";
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

  return (
    <aside className="soft-card h-fit p-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon/50" />
        <input
          className="field pl-10"
          placeholder="Search products"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="mt-5 grid gap-4">
        <select
          className="field"
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
        <div className="grid grid-cols-2 gap-3">
          <input
            className="field"
            placeholder="Min price"
            defaultValue={params.get("min") || ""}
            onBlur={(event) => setFilter("min", event.target.value)}
          />
          <input
            className="field"
            placeholder="Max price"
            defaultValue={params.get("max") || ""}
            onBlur={(event) => setFilter("max", event.target.value)}
          />
        </div>
      </div>
    </aside>
  );
}
