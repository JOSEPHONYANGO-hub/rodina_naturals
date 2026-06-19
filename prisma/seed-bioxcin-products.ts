import { PrismaClient, StockStatus } from "@prisma/client";
import products from "./bioxcin-products.json";

const prisma = new PrismaClient();

const FEATURED_PRODUCT_SLUGS = new Set([
  "bioxcin-skin-vitamin-c",
  "bioxcin-forte",
  "bioxcin-men-and-sport",
]);

const BEST_SELLER_PRODUCT_SLUGS = new Set([
  "bioxcin-acnium",
  "bioxcin-collagen-and-biotin",
  "bioxcin-anti-wrinkle",
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
    where: { slug: "bioxcin" },
    update: { name: "Bioxcin" },
    create: { name: "Bioxcin", slug: "bioxcin" },
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
      select: { id: true },
    });

    const data = {
      name: product.name,
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
      tags: Array.from(new Set(["Bioxcin", product.category, ...product.tags])),
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      isFeatured: FEATURED_PRODUCT_SLUGS.has(product.slug),
      isBestSeller: BEST_SELLER_PRODUCT_SLUGS.has(product.slug),
    };

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data,
      });
      updated += 1;
      continue;
    }

    await prisma.product.create({
      data: {
        ...data,
        slug: product.slug,
      },
    });

    created += 1;
  }

  console.log(`Seeded Bioxcin products. Created: ${created}. Updated: ${updated}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
