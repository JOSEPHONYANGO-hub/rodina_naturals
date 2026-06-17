import { prisma } from "@/lib/prisma";

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

const brandDefaults = [
  { name: "Bioxcin", slug: "bioxcin", categorySlug: "hair-care" },
  { name: "Restorex", slug: "restorex", categorySlug: "hair-care" },
  { name: "Procsin", slug: "procsin", categorySlug: "skincare" },
  { name: "Bioblas", slug: "bioblas", categorySlug: "hair-care" },
  { name: "Thalia", slug: "thalia", categorySlug: "body-care" },
  { name: "Rain", slug: "rain", categorySlug: "skincare" },
];

const brandSlugs = new Set(brandDefaults.map((brand) => brand.slug));

export async function ensureProductTaxonomy() {
  const categories = Array.from(new Set(categoryNames)).map((name) => ({
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

  const brands = await Promise.all(
    brandDefaults.map((brand) =>
      prisma.brand.upsert({
        where: { slug: brand.slug },
        update: { name: brand.name },
        create: { name: brand.name, slug: brand.slug },
      }),
    ),
  );

  const brandBySlug = new Map(brands.map((brand) => [brand.slug, brand]));

  for (const brand of brandDefaults) {
    const misplacedCategory = await prisma.category.findUnique({
      where: { slug: brand.slug },
    });

    if (!misplacedCategory) continue;

    const fallbackCategory = await prisma.category.findUnique({
      where: { slug: brand.categorySlug },
    });
    const databaseBrand = brandBySlug.get(brand.slug);

    if (!fallbackCategory || !databaseBrand) continue;

    await prisma.product.updateMany({
      where: { categoryId: misplacedCategory.id },
      data: {
        categoryId: fallbackCategory.id,
        brandId: databaseBrand.id,
      },
    });

    await prisma.category.deleteMany({
      where: { id: misplacedCategory.id },
    });
  }
}

export async function getProductFormTaxonomy() {
  await ensureProductTaxonomy();

  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({
      where: { slug: { notIn: Array.from(brandSlugs) } },
      orderBy: { name: "asc" },
    }),
  ]);

  return { brands, categories };
}
