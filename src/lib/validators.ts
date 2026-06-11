import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  ingredients: z.string().min(3),
  price: z.coerce.number().positive(),
  images: z.array(z.string().url()).min(1),
  categoryId: z.string().min(1),
  stock: z.coerce.number().int().min(0),
  isFeatured: z.coerce.boolean().optional(),
  isBestSeller: z.coerce.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.enum(["Bioxcin", "Procsin", "Bioblas", "Restorex", "Rain", "Thalia"]),
});

export const orderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(9),
  shippingAddress: z.string().min(8),
  paymentMethod: z.enum(["STRIPE", "MPESA", "CASH_ON_DELIVERY"]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().min(1),
      }),
    )
    .min(1),
});
