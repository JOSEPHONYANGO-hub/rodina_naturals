import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const SHOP_CATEGORIES = [
  { name: "Skincare", slug: "skincare" },
  { name: "Hair Care", slug: "hair-care" },
  { name: "Body Care", slug: "body-care" },
  { name: "Foot Care", slug: "foot-care" },
  { name: "Makeup", slug: "makeup" },
  { name: "Fragrances", slug: "fragrances" },
  { name: "Men's Grooming", slug: "mens-grooming" },
  { name: "Beauty Tools", slug: "beauty-tools" },
  { name: "Organic Products", slug: "organic-products" },
  { name: "Gift Sets", slug: "gift-sets" },
];

const FEATURED_BRANDS = [
  { name: "Bioxcin", slug: "bioxcin" },
  { name: "Restorex", slug: "restorex" },
  { name: "Procsin", slug: "procsin" },
  { name: "Bioblas", slug: "bioblas" },
  { name: "Thalia", slug: "thalia" },
  { name: "Rain", slug: "rain" },
];

const imagePool = [
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80",
];

const brandCategoryMap: Record<string, { category: string; product: string; description: string }> = {
  bioxcin: {
    category: "hair-care",
    product: "Bioxcin Forte Hair Strengthening Shampoo",
    description: "Bioxcin hair loss prevention and hair strengthening care for fuller-looking hair.",
  },
  restorex: {
    category: "hair-care",
    product: "Restorex Intensive Hair Repair Mask",
    description: "Restorex hair care and hair restoration solution for dry, damaged lengths.",
  },
  procsin: {
    category: "skincare",
    product: "Procsin Vitamin C Radiance Serum",
    description: "Procsin professional skincare and dermatological radiance treatment.",
  },
  bioblas: {
    category: "hair-care",
    product: "Bioblas Herbal Hair Growth Serum",
    description: "Bioblas herbal hair care and hair growth support for weak hair.",
  },
  thalia: {
    category: "body-care",
    product: "Thalia Natural Beauty Soap Collection",
    description: "Thalia natural beauty, soap and body care for everyday rituals.",
  },
  rain: {
    category: "skincare",
    product: "Rain Wellness Daily Moisturizer",
    description: "Rain premium skincare and wellness hydration for a polished routine.",
  },
};

async function main() {
  await Promise.all(
    SHOP_CATEGORIES.map((item) =>
      prisma.category.upsert({
        where: { slug: item.slug },
        update: { name: item.name },
        create: { name: item.name, slug: item.slug },
      }),
    ),
  );

  await Promise.all(
    FEATURED_BRANDS.map((item) =>
      prisma.brand.upsert({
        where: { slug: item.slug },
        update: { name: item.name },
        create: { name: item.name, slug: item.slug },
      }),
    ),
  );

  const [brands, categories] = await Promise.all([
    prisma.brand.findMany(),
    prisma.category.findMany(),
  ]);
  const brandBySlug = new Map(brands.map((brand) => [brand.slug, brand]));
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

  for (let index = 0; index < FEATURED_BRANDS.length; index += 1) {
    const brand = FEATURED_BRANDS[index];
    const seed = brandCategoryMap[brand.slug];
    const category = categoryBySlug.get(seed.category);
    const databaseBrand = brandBySlug.get(brand.slug);

    if (!category || !databaseBrand) {
      throw new Error(`Missing seed category: ${seed.category}`);
    }

    await prisma.product.upsert({
      where: { slug: `${brand.slug}-signature-care` },
      update: {
        name: seed.product,
        description: seed.description,
        brandId: databaseBrand.id,
        categoryId: category.id,
      },
      create: {
        name: seed.product,
        slug: `${brand.slug}-signature-care`,
        description: seed.description,
        ingredients: "Aqua, botanical extracts, glycerin, panthenol, vitamin complex, fragrance.",
        price: 1800 + index * 250,
        images: [imagePool[index % imagePool.length], imagePool[(index + 1) % imagePool.length]],
        brandId: databaseBrand.id,
        categoryId: category.id,
        stock: 24 + index,
        isFeatured: index < 4,
        isBestSeller: index % 2 === 0,
      },
    });
  }

  await prisma.user.upsert({
    where: { email: "admin@rodinanaturals.co.ke" },
    update: {
      name: "Rodina Admin",
      password: await hash("ChangeMe123!", 12),
      role: Role.ADMIN,
    },
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
