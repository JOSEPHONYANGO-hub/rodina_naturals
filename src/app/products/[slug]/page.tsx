import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/product/add-to-cart";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) notFound();

  return (
    <div className="bg-cream pb-24 pt-32">
      <div className="container-page grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4">
          <div className="relative aspect-[4/5] overflow-hidden border border-maroon/10 bg-rose/35">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.slice(1, 4).map((image) => (
              <div key={image} className="relative aspect-square overflow-hidden border border-maroon/10 bg-white">
                <Image src={image} alt="" fill sizes="20vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="border border-maroon/10 bg-ivory p-8 shadow-[0_24px_80px_rgba(77,12,18,0.06)] lg:p-11">
          <p className="eyebrow">{product.category.name}</p>
          <h1 className="mt-4 text-5xl leading-tight sm:text-6xl">{product.name}</h1>
          <p className="mt-6 text-xl font-semibold tracking-[0.08em] text-maroon">
            {formatCurrency(product.price.toString())}
          </p>
          <p className="mt-7 leading-8 text-ink/70">{product.description}</p>
          <div className="mt-8 border-y border-maroon/10 py-7">
            <h2 className="text-2xl">Ingredients</h2>
            <p className="mt-3 leading-7 text-ink/70">{product.ingredients}</p>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-maroon">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
          <div className="mt-6">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.images[0],
                stock: product.stock,
              }}
            />
          </div>
          <div className="mt-10">
            <h2 className="text-2xl">Reviews</h2>
            <div className="mt-4 space-y-4">
              {product.reviews.length ? (
                product.reviews.map((review) => (
                  <div key={review.id} className="border-t border-maroon/10 pt-4">
                    <p className="font-semibold text-maroon">{review.user.name || "Customer"}</p>
                    <p className="mt-1 text-sm text-ink/70">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink/60">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
