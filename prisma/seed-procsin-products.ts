import { PrismaClient, StockStatus } from "@prisma/client";
import products from "./procsin-products.json";

const prisma = new PrismaClient();

const FEATURED_PRODUCT_SLUGS = new Set([
  "procsin-sun-cream-spf50-face-body-50-ml",
  "procsin-hydrosolution-sebum-duo-gel",
]);

const BEST_SELLER_PRODUCT_SLUGS = new Set([
  "procsin-c-vitamin-skincare-set",
  "procsin-hydrosynol-aha-bha-serum-30-ml",
]);

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const brand = await prisma.brand.upsert({
    where: { slug: "procsin" },
    update: { name: "Procsin" },
    create: { name: "Procsin", slug: "procsin" },
  });

  let created = 0;
  let updated = 0;

  for (const product of products) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(product.category) },
      update: { name: product.category },
      create: { name: product.category, slug: slugify(product.category) },
    });

    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
      select: { id: true, price: true, description: true },
    });

    if (existing) {
      const isPlaceholder =
        existing.price.toString() === "1" ||
        existing.description.includes("Full product details and pricing will be updated soon.");

      await prisma.product.update({
        where: { id: existing.id },
        data: {
          ...(isPlaceholder
            ? {
                name: product.name,
                shortDescription: product.shortDescription,
                description: product.description,
                ingredients: product.ingredients,
                price: product.price,
                currency: product.currency,
                images: product.images,
                categoryId: category.id,
                brandId: brand.id,
                tags: Array.from(new Set(["Procsin", product.category, ...product.tags])),
                metaTitle: product.metaTitle,
                metaDescription: product.metaDescription,
              }
            : {}),
          stock: 10,
          stockStatus: StockStatus.IN_STOCK,
          isFeatured: FEATURED_PRODUCT_SLUGS.has(product.slug),
          isBestSeller: BEST_SELLER_PRODUCT_SLUGS.has(product.slug),
        },
      });

      if (isPlaceholder) {
        updated += 1;
      }

      continue;
    }

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        ingredients: product.ingredients,
        price: product.price,
        currency: product.currency,
        images: product.images,
        categoryId: category.id,
        brandId: brand.id,
        stock: 10,
        stockStatus: StockStatus.IN_STOCK,
        tags: Array.from(new Set(["Procsin", product.category, ...product.tags])),
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        isFeatured: FEATURED_PRODUCT_SLUGS.has(product.slug),
        isBestSeller: BEST_SELLER_PRODUCT_SLUGS.has(product.slug),
      },
    });

    created += 1;
  }

  console.log(`Seeded Procsin products. Created: ${created}. Updated: ${updated}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
