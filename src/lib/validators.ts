import { z } from "zod";
import { CATEGORIES } from "@/config/brand";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

const optionalSku = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^[a-z0-9-_]+$/i.test(value), {
    message: "SKU can only contain letters, numbers, hyphens, and underscores.",
  })
  .transform((value) => value || undefined);

const optionalPositiveNumber = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.coerce.number().positive().optional(),
);

const productImage = z.string().trim().refine((value) => {
  if (/^\/uploads\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.(jpg|jpeg|png|webp|gif)$/i.test(value)) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}, "Upload a valid image file.");

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const productBaseSchema = z.object({
  name: z.string().min(2),
  sku: optionalSku,
  slug: optionalText,
  shortDescription: optionalText,
  description: optionalText,
  ingredients: optionalText,
  price: z.coerce.number().positive(),
  salePrice: optionalPositiveNumber,
  taxStatus: z.enum(["TAXABLE", "NONE"]).default("TAXABLE"),
  taxClass: optionalText,
  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/, "Currency must be a 3-letter code.").default("KES"),
  images: z.array(productImage).default([]),
  categoryId: optionalText,
  brandId: optionalText,
  stockStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK", "BACKORDER"]).default("IN_STOCK"),
  stock: z.coerce.number().int().min(0),
  weight: optionalPositiveNumber,
  length: optionalPositiveNumber,
  width: optionalPositiveNumber,
  height: optionalPositiveNumber,
  tags: z.array(z.string().trim().min(1)).default([]),
  metaTitle: optionalText,
  metaDescription: optionalText,
  productType: z.enum(["SIMPLE", "VARIABLE"]).default("SIMPLE"),
  isDownloadable: z.coerce.boolean().optional(),
  isVirtual: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  isBestSeller: z.coerce.boolean().optional(),
});

export const productSchema = productBaseSchema.refine((data) => !data.salePrice || data.salePrice < data.price, {
  message: "Sale price must be lower than regular price.",
  path: ["salePrice"],
});

export const productUpdateSchema = productBaseSchema.partial().refine((data) => {
  if (!data.salePrice || data.price === undefined) return true;
  return data.salePrice < data.price;
}, {
  message: "Sale price must be lower than regular price.",
  path: ["salePrice"],
});

export const categorySchema = z.object({
  name: z.enum(CATEGORIES),
});

export const orderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(9),
  shippingAddress: z.string().min(8),
  paymentMethod: z.enum(["CARD", "MPESA", "CASH_ON_DELIVERY"]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().min(1),
      }),
    )
    .min(1),
});
