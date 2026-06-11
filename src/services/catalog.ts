import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { ProductFilters } from "@/types/catalog";

export const PRODUCT_PAGE_SIZE = 12;
export const MAX_PRODUCT_PAGE_SIZE = 48;

export function normalizeProductFilters(filters: ProductFilters) {
  const page = Math.max(Number(filters.page || 1), 1);
  const take = Math.min(Math.max(Number(filters.take || PRODUCT_PAGE_SIZE), 1), MAX_PRODUCT_PAGE_SIZE);
  return {
    page,
    take,
    query: filters.q?.trim() || "",
    category: filters.category?.trim() || "",
    min: filters.min ? Number(filters.min) : undefined,
    max: filters.max ? Number(filters.max) : undefined,
  };
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
}) {
  return { ...product, price: product.price.toString() };
}

export async function getProductListing(filters: ProductFilters) {
  const normalized = normalizeProductFilters(filters);
  const where = buildProductWhere(filters);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
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
      include: { category: true },
      take: 4,
    }),
    prisma.product.findMany({
      where: { isBestSeller: true },
      include: { category: true },
      take: 4,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function createProduct(data: {
  name: string;
  description: string;
  ingredients: string;
  price: number;
  images: string[];
  categoryId: string;
  stock: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}) {
  return prisma.product.create({
    data: {
      ...data,
      slug: slugify(data.name),
    },
  });
}

export async function updateProduct(
  id: string,
  data: Partial<Parameters<typeof createProduct>[0]>,
) {
  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(data.name ? { slug: slugify(data.name) } : {}),
    },
  });
}
