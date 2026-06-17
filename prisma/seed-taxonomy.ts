import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const categoryNames = [
  "Skincare",
  "Cleansers",
  "Toners",
  "Serums",
  "Moisturizers",
  "Face Masks",
  "Sunscreens",
  "Eye Care",
  "Lip Care",
  "Hair Care",
  "Shampoo",
  "Conditioner",
  "Hair Oils",
  "Hair Masks",
  "Hair Serums",
  "Hair Growth Products",
  "Styling Products",
  "Body Care",
  "Body Wash",
  "Body Lotion",
  "Body Butter",
  "Body Scrubs",
  "Hand Creams",
  "Foot Care",
  "Foot Creams",
  "Heel Repair",
  "Foot Scrubs",
  "Foot Masks",
  "Makeup",
  "Foundation",
  "Concealer",
  "Lipstick",
  "Mascara",
  "Eyeshadow",
  "Eyeliner",
  "Fragrances",
  "Women's Perfumes",
  "Men's Perfumes",
  "Body Mists",
  "Men's Grooming",
  "Beard Care",
  "Shaving",
  "Face Care",
  "Hair Styling",
  "Beauty Tools",
  "Makeup Brushes",
  "Beauty Blenders",
  "Hair Brushes",
  "Facial Rollers",
  "Organic Products",
  "Organic Skincare",
  "Organic Haircare",
  "Herbal Products",
  "Gift Sets",
  "Skincare Sets",
  "Haircare Sets",
  "Beauty Bundles",
  "Skin Concerns",
  "Acne & Blemishes",
  "Dry Skin",
  "Oily Skin",
  "Sensitive Skin",
  "Hyperpigmentation",
  "Anti-Aging",
  "Hair Concerns",
  "Hair Loss",
  "Dandruff",
  "Dry Hair",
  "Damaged Hair",
  "Weak Hair",
  "Curly Hair Care",
  "Body Concerns",
  "Stretch Marks",
  "Dark Spots",
  "Uneven Skin Tone",
];

const brandNames = ["Bioxcin", "Restorex", "Procsin", "Bioblas", "Thalia", "Rain"];

async function main() {
  const categories = Array.from(new Set(categoryNames)).map((name) => ({
    name,
    slug: slugify(name),
  }));

  const brands = brandNames.map((name) => ({
    name,
    slug: slugify(name),
  }));

  await Promise.all(
    categories.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: { name: category.name },
        create: category,
      }),
    ),
  );

  await Promise.all(
    brands.map((brand) =>
      prisma.brand.upsert({
        where: { slug: brand.slug },
        update: { name: brand.name },
        create: brand,
      }),
    ),
  );

  const [categoryCount, brandCount] = await Promise.all([
    prisma.category.count(),
    prisma.brand.count(),
  ]);

  console.log(`Seeded taxonomy. Categories: ${categoryCount}. Brands: ${brandCount}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
