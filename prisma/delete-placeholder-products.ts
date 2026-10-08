import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const targets = await prisma.product.findMany({
    where: { price: { equals: 1 } },
    select: { id: true, name: true, slug: true, price: true },
    orderBy: { name: "asc" },
  });

  if (!targets.length) {
    console.log("No KSh 1 products found. Nothing to delete.");
    return;
  }

  console.log(`Found ${targets.length} product(s) priced at KSh 1:\n`);
  for (const p of targets) {
    console.log(`  - ${p.name} (${p.slug})`);
  }

  const { count } = await prisma.product.deleteMany({
    where: { price: { equals: 1 } },
  });

  console.log(`\nDeleted ${count} product(s).`);
}

main()
  .finally(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
