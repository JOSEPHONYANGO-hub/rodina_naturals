import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const categories = ["Bioxcin", "Procsin", "Bioblas", "Restorex", "Rain", "Thalia"];

const imagePool = [
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
];

async function main() {
  await Promise.all(
    categories.map((name) =>
      prisma.category.upsert({
        where: { slug: name.toLowerCase() },
        update: {},
        create: { name, slug: name.toLowerCase() },
      }),
    ),
  );

  const allCategories = await prisma.category.findMany();

  for (let index = 0; index < allCategories.length; index += 1) {
    const category = allCategories[index];
    await prisma.product.upsert({
      where: { slug: `${category.slug}-signature-care` },
      update: {},
      create: {
        name: `${category.name} Signature Care`,
        slug: `${category.slug}-signature-care`,
        description:
          "A refined daily treatment selected for a polished skincare ritual with a soft, nourishing finish.",
        ingredients:
          "Aqua, botanical extracts, glycerin, panthenol, vitamin complex, fragrance.",
        price: 1800 + index * 250,
        images: [imagePool[index % imagePool.length], imagePool[(index + 1) % imagePool.length]],
        categoryId: category.id,
        stock: 24 + index,
        isFeatured: index < 3,
        isBestSeller: index % 2 === 0,
      },
    });
  }

  await prisma.user.upsert({
    where: { email: "admin@rodinanaturals.co.ke" },
    update: {},
    create: {
      name: "Rodina Admin",
      email: "admin@rodinanaturals.co.ke",
      password: await hash("ChangeMe123!", 12),
      role: Role.ADMIN,
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
