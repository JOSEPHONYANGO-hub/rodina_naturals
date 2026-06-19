import { PrismaClient, Role, StockStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function categorySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const SHOP_CATEGORY_NAMES = [
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

const SHOP_CATEGORIES = SHOP_CATEGORY_NAMES.map((name) => ({
  name,
  slug: categorySlug(name),
}));

const FEATURED_BRANDS = [
  { name: "Bioxcin", slug: "bioxcin" },
  { name: "Restorex", slug: "restorex" },
  { name: "Procsin", slug: "procsin" },
  { name: "Bioblas", slug: "bioblas" },
  { name: "Thalia", slug: "thalia" },
  { name: "Rain", slug: "rain" },
];

const TEST_PRODUCT_SLUGS = [
  "bioxcin-signature-care",
  "restorex-signature-care",
  "procsin-signature-care",
  "bioblas-signature-care",
  "thalia-signature-care",
  "rain-signature-care",
];

const FEATURED_PRODUCT_SLUGS = [
  "bioxcin-skin-vitamin-c",
  "bioxcin-forte",
  "bioxcin-men-and-sport",
  "procsin-sun-cream-spf50-face-body-50-ml",
  "procsin-hydrosolution-sebum-duo-gel",
  "thalia-aloe-vera-body-lotion",
  "thalia-spf50-daily-face-moisturizer",
];

const BEST_SELLER_PRODUCT_SLUGS = [
  "bioxcin-acnium",
  "bioxcin-collagen-and-biotin",
  "bioxcin-anti-wrinkle",
  "procsin-c-vitamin-skincare-set",
  "procsin-hydrosynol-aha-bha-serum-30-ml",
  "thalia-the-curea-foot-care-cream-75-ml-psd",
  "thalia-bubble-soap-vitamin-c",
];

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

  await prisma.product.deleteMany({
    where: { slug: { in: TEST_PRODUCT_SLUGS } },
  });

  await prisma.product.updateMany({
    where: { stock: { lt: 10 } },
    data: { stock: 10, stockStatus: StockStatus.IN_STOCK },
  });

  await prisma.product.updateMany({
    data: { isFeatured: false, isBestSeller: false },
  });

  await prisma.product.updateMany({
    where: { slug: { in: FEATURED_PRODUCT_SLUGS } },
    data: { isFeatured: true, stock: 10, stockStatus: StockStatus.IN_STOCK },
  });

  await prisma.product.updateMany({
    where: { slug: { in: BEST_SELLER_PRODUCT_SLUGS } },
    data: { isBestSeller: true, stock: 10, stockStatus: StockStatus.IN_STOCK },
  });

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
