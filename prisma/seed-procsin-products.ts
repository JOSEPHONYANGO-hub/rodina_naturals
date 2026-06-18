import { PrismaClient, StockStatus } from "@prisma/client";
import products from "./procsin-products.json";

const prisma = new PrismaClient();

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

      if (isPlaceholder) {
        await prisma.product.update({
          where: { id: existing.id },
          data: {
            name: product.name,
            shortDescription: product.shortDescription,
            description: product.description,
            ingredients: product.ingredients,
            price: product.price,
            currency: product.currency,
            images: product.images,
            categoryId: category.id,
            brandId: brand.id,
            stockStatus: StockStatus.IN_STOCK,
            tags: Array.from(new Set(["Procsin", product.category, ...product.tags])),
            metaTitle: product.metaTitle,
            metaDescription: product.metaDescription,
          },
        });
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
        tags: Array.from(new Set(["Procsin", product.category, ...product.tags])),
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        isFeatured: false,
        isBestSeller: false,
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
