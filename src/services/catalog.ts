import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { ProductCardData, ProductFilters } from "@/types/catalog";

export const PRODUCT_PAGE_SIZE = 20;
export const MAX_PRODUCT_PAGE_SIZE = 48;
const PRODUCT_SORT_OPTIONS = ["recommended", "newest", "price-asc", "price-desc", "name"] as const;
type ProductSort = (typeof PRODUCT_SORT_OPTIONS)[number];

export const SHOP_CATEGORIES = [
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

export const FEATURED_BRANDS = [
  { name: "Bioxcin", slug: "bioxcin" },
  { name: "Restorex", slug: "restorex" },
  { name: "Procsin", slug: "procsin" },
  { name: "Bioblas", slug: "bioblas" },
  { name: "Thalia", slug: "thalia" },
  { name: "Rain", slug: "rain" },
];

export const fallbackProducts: ProductCardData[] = [
  {
    id: "bioxcin-forte-shampoo",
    slug: "bioxcin-forte-shampoo",
    name: "Bioxcin Forte Hair Strengthening Shampoo",
    price: "2450",
    stock: 18,
    category: { name: "Hair Care" },
    brand: { name: "Bioxcin" },
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "procsin-vitamin-c-serum",
    slug: "procsin-vitamin-c-serum",
    name: "Procsin Vitamin C Radiance Serum",
    price: "3200",
    stock: 12,
    category: { name: "Skincare" },
    brand: { name: "Procsin" },
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "restorex-repair-mask",
    slug: "restorex-repair-mask",
    name: "Restorex Intensive Hair Repair Mask",
    price: "2850",
    stock: 15,
    category: { name: "Hair Care" },
    brand: { name: "Restorex" },
    images: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "thalia-natural-soap-set",
    slug: "thalia-natural-soap-set",
    name: "Thalia Natural Beauty Soap Collection",
    price: "1750",
    stock: 26,
    category: { name: "Body Care" },
    brand: { name: "Thalia" },
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "bioblas-herbal-hair-serum",
    slug: "bioblas-herbal-hair-serum",
    name: "Bioblas Herbal Hair Growth Serum",
    price: "2650",
    stock: 19,
    category: { name: "Hair Care" },
    brand: { name: "Bioblas" },
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "rain-wellness-moisturizer",
    slug: "rain-wellness-moisturizer",
    name: "Rain Wellness Daily Moisturizer",
    price: "2950",
    stock: 14,
    category: { name: "Skincare" },
    brand: { name: "Rain" },
    images: [
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85",
    ],
  },
];

export function normalizeProductFilters(filters: ProductFilters) {
  const page = Math.max(Number(filters.page || 1), 1);
  const take = Math.min(Math.max(Number(filters.take || PRODUCT_PAGE_SIZE), 1), MAX_PRODUCT_PAGE_SIZE);
  const sort: ProductSort = PRODUCT_SORT_OPTIONS.includes(filters.sort as ProductSort)
    ? (filters.sort as ProductSort)
    : "recommended";
  return {
    page,
    take,
    sort,
    query: filters.q?.trim() || "",
    brand: filters.brand?.trim() || "",
    category: filters.category?.trim() || "",
    min: filters.min ? Number(filters.min) : undefined,
    max: filters.max ? Number(filters.max) : undefined,
  };
}

function productOrderBy(sort: ProductSort): Prisma.ProductOrderByWithRelationInput[] {
  if (sort === "price-asc") return [{ price: "asc" }, { createdAt: "desc" }];
  if (sort === "price-desc") return [{ price: "desc" }, { createdAt: "desc" }];
  if (sort === "name") return [{ name: "asc" }];
  if (sort === "newest") return [{ createdAt: "desc" }];

  return [
    { isFeatured: "desc" },
    { isBestSeller: "desc" },
    { createdAt: "desc" },
  ];
}

export function buildProductWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const normalized = normalizeProductFilters(filters);

  return {
    AND: [
      normalized.query
        ? {
            OR: [
              { name: { contains: normalized.query, mode: "insensitive" } },
              { description: { contains: normalized.query, mode: "insensitive" } },
            ],
          }
        : {},
      normalized.category ? { category: { slug: normalized.category } } : {},
      normalized.brand
        ? {
            OR: [
              { name: { contains: normalized.brand, mode: "insensitive" } },
              { description: { contains: normalized.brand, mode: "insensitive" } },
              { brand: { slug: normalized.brand } },
            ],
          }
        : {},
      normalized.min ? { price: { gte: normalized.min } } : {},
      normalized.max ? { price: { lte: normalized.max } } : {},
    ],
  };
}

export function toProductCard(product: {
  id: string;
  slug: string;
  name: string;
  price: { toString(): string };
  images: string[];
  stock: number;
  category?: { name: string };
  brand?: { name: string } | null;
}) {
  return { ...product, price: product.price.toString() };
}

function cleanProductData<T extends { sku?: string; slug?: string; name?: string }>(data: T) {
  const next = { ...data } as T & Record<string, unknown>;

  if ("sku" in next && typeof next.sku === "string") {
    next.sku = next.sku.trim() || undefined;
  }

  for (const key of Object.keys(next)) {
    if (next[key] === undefined || next[key] === "") {
      delete next[key];
    }
  }

  return next;
}

export async function getProductListing(filters: ProductFilters) {
  const normalized = normalizeProductFilters(filters);
  const where = buildProductWhere(filters);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { brand: true, category: true },
      orderBy: productOrderBy(normalized.sort),
      skip: (normalized.page - 1) * normalized.take,
      take: normalized.take,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page: normalized.page,
    pages: Math.max(Math.ceil(total / normalized.take), 1),
  };
}

export async function getHomeCatalog() {
  return Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true },
      include: { brand: true, category: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.product.findMany({
      where: { isBestSeller: true },
      include: { brand: true, category: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getBrands() {
  return prisma.brand.findMany({ orderBy: { name: "asc" } });
}

export function getFallbackProductListing(filters: ProductFilters) {
  const normalized = normalizeProductFilters(filters);
  const query = normalized.query.toLowerCase();
  const brand = normalized.brand.toLowerCase();
  const category = normalized.category.toLowerCase();

  const filtered = fallbackProducts.filter((product) => {
    const text = `${product.name} ${product.category?.name || ""}`.toLowerCase();
    const price = Number(product.price);

    return (
      (!query || text.includes(query)) &&
      (!brand || product.brand?.name.toLowerCase().includes(brand) || product.name.toLowerCase().includes(brand)) &&
      (!category || slugify(product.category?.name || "") === category) &&
      (!normalized.min || price >= normalized.min) &&
      (!normalized.max || price <= normalized.max)
    );
  });

  const start = (normalized.page - 1) * normalized.take;
  const products = filtered.slice(start, start + normalized.take);

  return {
    products,
    total: filtered.length,
    page: normalized.page,
    pages: Math.max(Math.ceil(filtered.length / normalized.take), 1),
  };
}

export async function createProduct(data: {
  name: string;
  sku?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  ingredients?: string;
  price: number;
  salePrice?: number;
  taxStatus?: string;
  taxClass?: string;
  currency?: string;
  images: string[];
  categoryId?: string;
  brandId?: string | null;
  stockStatus?: "IN_STOCK" | "OUT_OF_STOCK" | "BACKORDER";
  stock: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  productType?: "SIMPLE" | "VARIABLE";
  isDownloadable?: boolean;
  isVirtual?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}) {
  const productData = cleanProductData(data);
  const fallbackCategory = productData.categoryId
    ? null
    : await prisma.category.upsert({
        where: { slug: "uncategorized" },
        update: {},
        create: { name: "Uncategorized", slug: "uncategorized" },
      });

  return prisma.product.create({
    data: {
      ...productData,
      brandId: productData.brandId || null,
      categoryId: productData.categoryId || fallbackCategory?.id || "",
      description: productData.description || productData.shortDescription || "Product details coming soon.",
      ingredients: productData.ingredients || "Not specified.",
      currency: productData.currency || "KES",
      tags: productData.tags || [],
      slug: slugify(productData.slug || productData.name),
    },
  });
}

export async function updateProduct(
  id: string,
  data: Partial<Parameters<typeof createProduct>[0]>,
) {
  const productData = cleanProductData(data);
  const {
    brandId,
    categoryId,
    name,
    slug,
    tags,
    ...rest
  } = productData;

  return prisma.product.update({
    where: { id },
    data: {
      ...rest,
      ...(name ? { name } : {}),
      ...(brandId !== undefined ? { brandId: brandId || null } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(tags ? { tags } : {}),
      ...(slug ? { slug: slugify(slug) } : name ? { slug: slugify(name) } : {}),
    },
  });
}
