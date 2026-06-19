import { PrismaClient, StockStatus } from "@prisma/client";
import products from "./thalia-products.json";

const prisma = new PrismaClient();

type ThaliaProductSeed = (typeof products)[number];

const FEATURED_PRODUCT_SLUGS = new Set([
  "thalia-aloe-vera-body-lotion",
  "thalia-spf50-daily-face-moisturizer",
]);

const BEST_SELLER_PRODUCT_SLUGS = new Set([
  "thalia-the-curea-foot-care-cream-75-ml-psd",
  "thalia-bubble-soap-vitamin-c",
]);

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function categoryForProduct(product: ThaliaProductSeed) {
  const value = `${product.name} ${product.slug}`.toLowerCase();

  if (value.includes("curea") || value.includes("foot") || value.includes("el-ayak")) {
    return "The Curea Series";
  }

  if (value.includes("sun") || value.includes("spf")) return "Sun Care";
  if (value.includes("mask")) return "Face Masks";
  if (value.includes("lip") || value.includes("blister")) return "Lip Balm";
  if (value.includes("shampoo") || value.includes("conditioner") || value.includes("hair")) {
    return "Hair Care";
  }
  if (value.includes("soap")) return "Soap";
  if (value.includes("body") || value.includes("scrub") || value.includes("shower")) {
    return "Body Care";
  }
  if (
    value.includes("cleanser") ||
    value.includes("toner") ||
    value.includes("tonik") ||
    value.includes("serum") ||
    value.includes("cream") ||
    value.includes("gel")
  ) {
    return "Skincare";
  }

  return product.category.name || "Thalia";
}

async function main() {
  const brand = await prisma.brand.upsert({
    where: { slug: "thalia" },
    update: { name: "Thalia" },
    create: { name: "Thalia", slug: "thalia" },
  });

  let created = 0;
  let skipped = 0;

  for (const product of products) {
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
          ...(isPlaceholder ? { price: product.price } : {}),
          stock: 10,
          stockStatus: StockStatus.IN_STOCK,
          isFeatured: FEATURED_PRODUCT_SLUGS.has(product.slug),
          isBestSeller: BEST_SELLER_PRODUCT_SLUGS.has(product.slug),
        },
      });

      skipped += 1;
      continue;
    }

    const categoryName = categoryForProduct(product);
    const category = await prisma.category.upsert({
      where: { slug: slugify(categoryName) },
      update: { name: categoryName },
      create: { name: categoryName, slug: slugify(categoryName) },
    });

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
        tags: Array.from(new Set(["Thalia", categoryName, ...product.tags])),
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        isFeatured: FEATURED_PRODUCT_SLUGS.has(product.slug),
        isBestSeller: BEST_SELLER_PRODUCT_SLUGS.has(product.slug),
      },
    });

    created += 1;
  }

  console.log(`Seeded Thalia products. Created: ${created}. Existing: ${skipped}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
