import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/product/add-to-cart";
import { ImageGallery } from "@/components/product/image-gallery";
import { ProductCard } from "@/components/product/product-card";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { FEATURED_BRANDS, toProductCard } from "@/services/catalog";

export const dynamic = "force-dynamic";

const PRODUCT_IMAGE_FALLBACK = "/rodina-logo.jpeg";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      brand: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  const productImage = product.images[0] || PRODUCT_IMAGE_FALLBACK;
  const brandLogo = product.brand
    ? FEATURED_BRANDS.find((b) => b.slug === product.brand!.slug)?.logo
    : undefined;

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-cream pb-16 pt-28">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <ImageGallery
            images={product.images}
            productName={product.name}
            fallback={PRODUCT_IMAGE_FALLBACK}
          />

          <div className="h-fit rounded-[24px] border border-maroon/10 bg-white p-5 shadow-[0_12px_40px_rgba(77,12,18,0.07)] sm:p-6">
            <p className="eyebrow text-xs">{product.category.name}</p>
            <h1 className="mt-2 text-xl font-semibold leading-snug text-charcoal sm:text-2xl">
              {product.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <p className="text-xl font-bold tracking-[0.04em] text-maroon">
                {formatCurrency(product.price.toString())}
              </p>
              <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-maroon">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
            {product.brand && (
              <div className="mt-3 flex items-center gap-3">
                {brandLogo ? (
                  <Link href={`/shop?brand=${product.brand.slug}`} className="group">
                    <div className="relative h-9 w-28 overflow-hidden rounded-lg border border-maroon/10 bg-cream p-1 transition group-hover:border-maroon/30">
                      <Image
                        src={brandLogo}
                        alt={product.brand.name}
                        fill
                        sizes="112px"
                        className="object-contain p-0.5"
                      />
                    </div>
                  </Link>
                ) : (
                  <Link
                    href={`/shop?brand=${product.brand.slug}`}
                    className="rounded-full border border-maroon/20 bg-cream px-3 py-1 text-xs font-semibold text-maroon hover:bg-maroon/5"
                  >
                    {product.brand.name}
                  </Link>
                )}
              </div>
            )}
            <p className="mt-4 text-sm leading-7 text-ink/70">{product.description}</p>

            <div className="mt-4 rounded-[18px] border border-maroon/10 bg-cream p-4">
              <h2 className="text-base font-semibold text-charcoal">Ingredients</h2>
              <p className="mt-2 text-sm leading-6 text-ink/70">{product.ingredients}</p>
            </div>

            <div className="mt-4">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  image: productImage,
                  stock: product.stock,
                }}
              />
            </div>

            <div className="mt-4 rounded-[18px] border border-maroon/10 p-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold text-charcoal">Reviews</h2>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                  {product.reviews.length} total
                </span>
              </div>
              <div className="mt-4 space-y-4">
                {product.reviews.length ? (
                  product.reviews.map((review) => (
                    <div key={review.id} className="border-t border-maroon/10 pt-4">
                      <p className="font-semibold text-maroon">{review.user.name || "Customer"}</p>
                      <p className="mt-1 text-sm text-ink/70">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-cream p-5">
                    <p className="font-semibold text-charcoal">No reviews yet.</p>
                    <p className="mt-1 text-sm text-ink/60">
                      The review area is ready for customer feedback after purchase.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {related.length ? (
          <section className="mt-20">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Complete the routine</p>
                <h2 className="section-title">Related Products</h2>
              </div>
              <Link href="/shop" className="fine-link">
                Continue shopping
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={toProductCard(item)} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
