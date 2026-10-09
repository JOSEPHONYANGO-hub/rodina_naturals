import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import {
  FEATURED_BRANDS,
  SHOP_CATEGORIES,
  getCategories,
  getBrands,
  getProductListing,
  toProductCard,
} from "@/services/catalog";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string; brand?: string; category?: string; min?: string; max?: string; page?: string; take?: string; sort?: string };
}) {
  let listing: { products: ReturnType<typeof toProductCard>[]; total: number; page: number; pages: number } | null = null;
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
    const logoMap = Object.fromEntries(FEATURED_BRANDS.map((b) => [b.slug, b.logo]));
    const brandsWithLogos = databaseBrands.map((b) => ({ ...b, logo: logoMap[b.slug] }));
    brands = brandsWithLogos.length ? brandsWithLogos : FEATURED_BRANDS;
    categories = databaseCategories.length ? databaseCategories : SHOP_CATEGORIES;
  } catch (error) {
    console.error("Shop catalog unavailable:", error);
  }

  return (
    <div className="bg-[#f7fafc] pb-20 pt-28">
      <div className="container-page">
        <div className="grid gap-7 lg:grid-cols-[260px_1fr]">
          <ShopFilters brands={brands} categories={categories} />
          <div>
            {listing === null ? (
              <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-[24px] border border-[#a81723]/10 bg-white px-6 py-16 text-center shadow-sm">
                <p className="text-lg font-semibold text-[#222222]">Shop temporarily unavailable</p>
                <p className="mt-2 max-w-sm text-sm text-[#222222]/60">
                  We&apos;re having trouble loading products right now. Please refresh the page or try again in a moment.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex h-10 items-center rounded-full bg-[#a81723] px-6 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#7a111b]"
                >
                  Refresh
                </Link>
              </div>
            ) : (
              <>
                <ShopToolbar total={listing.total} pageSize={listing.products.length} sort={searchParams.sort || "recommended"} />
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {listing.products.map((product) => (
                    <ProductCard key={product.id} product={product} variant="shop" />
                  ))}
                </div>
                {listing.products.length === 0 && (
                  <div className="mt-10 text-center text-sm text-[#222222]/50">
                    No products found. Try adjusting your filters.
                  </div>
                )}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: listing.pages }).map((_, index) => {
                    const next = new URLSearchParams(searchParams as Record<string, string>);
                    next.set("page", String(index + 1));
                    return (
                      <Link
                        key={index}
                        href={`/shop?${next.toString()}`}
                        className={`grid h-10 w-10 place-items-center rounded-lg border text-sm font-semibold ${
                          listing!.page === index + 1
                            ? "border-[#a81723] bg-[#a81723] text-white"
                            : "border-[#d7e0ea] bg-white text-[#374151] transition hover:border-[#a81723] hover:text-[#a81723]"
                        }`}
                      >
                        {index + 1}
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
