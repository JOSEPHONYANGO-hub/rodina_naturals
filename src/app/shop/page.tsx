import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function cardProduct(product: {
  id: string;
  slug: string;
  name: string;
  price: { toString(): string };
  images: string[];
  stock: number;
  category: { name: string };
}) {
  return { ...product, price: product.price.toString() };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; min?: string; max?: string; page?: string };
}) {
  const page = Math.max(Number(searchParams.page || 1), 1);
  const take = 12;
  const where = {
    AND: [
      searchParams.q
        ? {
            OR: [
              { name: { contains: searchParams.q, mode: "insensitive" as const } },
              { description: { contains: searchParams.q, mode: "insensitive" as const } },
            ],
          }
        : {},
      searchParams.category ? { category: { slug: searchParams.category } } : {},
      searchParams.min ? { price: { gte: Number(searchParams.min) } } : {},
      searchParams.max ? { price: { lte: Number(searchParams.max) } } : {},
    ],
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      skip: (page - 1) * take,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const pages = Math.max(Math.ceil(total / take), 1);

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
              {products.map((product) => (
                <ProductCard key={product.id} product={cardProduct(product)} />
              ))}
            </div>
            <div className="mt-10 flex items-center justify-center gap-3">
              {Array.from({ length: pages }).map((_, index) => {
                const next = new URLSearchParams(searchParams as Record<string, string>);
                next.set("page", String(index + 1));
                return (
                  <Link
                    key={index}
                    href={`/shop?${next.toString()}`}
                    className={`grid h-10 w-10 place-items-center border ${
                      page === index + 1
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
