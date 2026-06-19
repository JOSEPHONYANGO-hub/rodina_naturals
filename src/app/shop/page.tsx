import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import {
  FEATURED_BRANDS,
  SHOP_CATEGORIES,
  getCategories,
  getBrands,
  getFallbackProductListing,
  getProductListing,
  toProductCard,
} from "@/services/catalog";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string; brand?: string; category?: string; min?: string; max?: string; page?: string; take?: string; sort?: string };
}) {
  let listing = getFallbackProductListing(searchParams);
  let categories = SHOP_CATEGORIES;
  let brands = FEATURED_BRANDS;

  try {
    const [databaseListing, databaseBrands, databaseCategories] = await Promise.all([
      getProductListing(searchParams),
      getBrands(),
      getCategories(),
    ]);

    listing = {
      ...databaseListing,
      products: databaseListing.products.map((product) => toProductCard(product)),
    };
    brands = databaseBrands.length ? databaseBrands : FEATURED_BRANDS;
    categories = databaseCategories.length ? databaseCategories : SHOP_CATEGORIES;
  } catch (error) {
    console.warn("Using shop fallback products because catalog data is unavailable.", error);
  }

  return (
    <div className="bg-[#f7fafc] pb-20 pt-28">
      <div className="container-page">
        <div className="grid gap-7 lg:grid-cols-[260px_1fr]">
          <ShopFilters brands={brands} categories={categories} />
          <div>
            <ShopToolbar total={listing.total} pageSize={listing.products.length} sort={searchParams.sort || "recommended"} />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {listing.products.map((product) => (
                <ProductCard key={product.id} product={product} variant="shop" />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: listing.pages }).map((_, index) => {
                const next = new URLSearchParams(searchParams as Record<string, string>);
                next.set("page", String(index + 1));
                return (
                  <Link
                    key={index}
                    href={`/shop?${next.toString()}`}
                    className={`grid h-10 w-10 place-items-center rounded-lg border text-sm font-semibold ${
                      listing.page === index + 1
                        ? "border-[#66b345] bg-[#66b345] text-white"
                        : "border-[#d7e0ea] bg-white text-[#374151] transition hover:border-[#66b345]"
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
