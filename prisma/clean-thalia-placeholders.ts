import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const placeholderDescription = "Full product details and pricing will be updated soon.";

function prettyName(value: string) {
  return value
    .replace(/\.psd$/i, "")
    .replace(/\bTHE\b/g, "The")
    .replace(/\bSUN\b/g, "Sun")
    .replace(/\bGEL\b/g, "Gel")
    .replace(/\bOIL\b/g, "Oil")
    .replace(/\bTEA\b/g, "Tea")
    .replace(/\bRED\b/g, "Red")
    .replace(/\bDAY\b/g, "Day")
    .replace(/\bRUB\b/g, "Rub")
    .replace(/\bAND\b/g, "And")
    .replace(/\bOFF\b/g, "Off")
    .replace(/\bUP\b/g, "Up")
    .replace(/\bMIX\b/g, "Mix")
    .replace(/\bOAT\b/g, "Oat")
    .replace(/\bME\b/g, "Me")
    .replace(/\bML\b/g, "ml")
    .replace(/\s+/g, " ")
    .trim();
}

function prettyCategory(value: string) {
  return prettyName(value)
    .replace(/Seri̇si̇|Serİsİ|Serisi/gi, "Series")
    .replace(/\bShowe\b/gi, "Shower")
    .replace(/\bMouisturizer\b/gi, "Moisturizer")
    .replace(/\.jpg$/i, "")
    .trim();
}

function shouldDeleteProduct(name: string) {
  return (
    /^1e6a/i.test(name) ||
    /^capture one catalog/i.test(name) ||
    /^screenshot /i.test(name) ||
    /^display$/i.test(name)
  );
}

async function main() {
  const brand = await prisma.brand.findUnique({ where: { slug: "thalia" } });
  if (!brand) {
    console.log("No Thalia brand found.");
    return;
  }

  const placeholders = await prisma.product.findMany({
    where: {
      brandId: brand.id,
      description: { contains: placeholderDescription },
    },
    include: { category: true },
  });

  const toDelete = placeholders.filter((product) => shouldDeleteProduct(product.name));
  if (toDelete.length) {
    await prisma.product.deleteMany({
      where: { id: { in: toDelete.map((product) => product.id) } },
    });
  }

  const remaining = placeholders.filter((product) => !shouldDeleteProduct(product.name));
  for (const product of remaining) {
    const name = prettyName(product.name);
    await prisma.product.update({
      where: { id: product.id },
      data: {
        name,
        shortDescription: `${name} by Thalia.`,
        description: `${name} from Thalia. Full product details and pricing will be updated soon.`,
        metaTitle: `${name} | Thalia`,
        metaDescription: `${name} by Thalia.`,
      },
    });

    const categoryName = prettyCategory(product.category.name);
    if (categoryName && categoryName !== product.category.name) {
      await prisma.category.update({
        where: { id: product.categoryId },
        data: { name: categoryName },
      });
    }
  }

  console.log(`Deleted ${toDelete.length} technical placeholder products.`);
  console.log(`Cleaned ${remaining.length} Thalia placeholder products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
