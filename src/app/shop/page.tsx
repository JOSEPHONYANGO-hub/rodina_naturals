import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { getCategories, getProductListing, toProductCard } from "@/services/catalog";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; min?: string; max?: string; page?: string };
}) {
  const [listing, categories] = await Promise.all([
    getProductListing(searchParams),
    getCategories(),
  ]);

  return (
    <div className="bg-cream pb-20 pt-32">
      <div className="container-page">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Boutique store</p>
          <h1 className="mt-3 text-5xl">Shop Rodina Naturals</h1>
        </div>
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <ShopFilters categories={categories} />
          <div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {listing.products.map((product) => (
                <ProductCard key={product.id} product={toProductCard(product)} />
              ))}
            </div>
            <div className="mt-10 flex items-center justify-center gap-3">
              {Array.from({ length: listing.pages }).map((_, index) => {
                const next = new URLSearchParams(searchParams as Record<string, string>);
                next.set("page", String(index + 1));
                return (
                  <Link
                    key={index}
                    href={`/shop?${next.toString()}`}
                    className={`grid h-10 w-10 place-items-center border ${
                      listing.page === index + 1
                        ? "border-maroon bg-maroon text-white"
                        : "border-maroon/20 bg-white text-maroon"
                    }`}
                  >
                    {index + 1}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
