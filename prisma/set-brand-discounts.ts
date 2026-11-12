import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DISCOUNT_BRANDS = ["procsin", "rain"];
const DISCOUNT_PERCENT = 50;

async function main() {
  const brands = await prisma.brand.findMany({
    where: { slug: { in: DISCOUNT_BRANDS } },
    select: { id: true, name: true, slug: true },
  });

  if (brands.length === 0) {
    console.log("No matching brands found:", DISCOUNT_BRANDS);
    return;
  }

  console.log("Applying discount to brands:", brands.map((b) => b.name).join(", "));

  for (const brand of brands) {
    const products = await prisma.product.findMany({
      where: { brandId: brand.id },
      select: { id: true, name: true, price: true },
    });

    console.log(`\n${brand.name}: ${products.length} products`);

    for (const product of products) {
      const full = Number(product.price.toString());
      const sale = Math.round(full * (1 - DISCOUNT_PERCENT / 100));
      await prisma.product.update({
        where: { id: product.id },
        data: { salePrice: sale },
      });
      console.log(`  ${product.name}: ${full} → ${sale}`);
    }
  }

  console.log("\nDone.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
