import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
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
  searchParams: { q?: string; brand?: string; category?: string; min?: string; max?: string; page?: string };
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
    <div className="bg-cream pb-24 pt-32">
      <div className="container-page">
        <div className="mb-10 overflow-hidden rounded-[34px] bg-white p-7 shadow-[0_18px_60px_rgba(77,12,18,0.06)] sm:p-10">
          <p className="eyebrow">Boutique store</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-5xl font-semibold leading-tight text-charcoal sm:text-6xl">
                Shop Rodina Naturals
              </h1>
              <p className="mt-5 max-w-2xl leading-8 text-ink/68">
                Beauty, skincare, haircare, and body essentials selected for a premium Kenyan
                ecommerce experience.
              </p>
            </div>
            <p className="rounded-full bg-cream px-5 py-3 text-sm font-semibold text-maroon">
              {listing.total} products available
            </p>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <ShopFilters brands={brands} categories={categories} />
          <div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
              {listing.products.map((product) => (
                <ProductCard key={product.id} product={product} />
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
                    className={`grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold ${
                      listing.page === index + 1
                        ? "border-maroon bg-maroon text-white"
                        : "border-maroon/20 bg-ivory text-maroon transition hover:border-gold"
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
