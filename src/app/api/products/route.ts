import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { badRequest, created, ok, unauthorized } from "@/lib/api-response";
import { requireAdmin } from "@/lib/authz";
import { productSchema } from "@/lib/validators";
import { createProduct, getProductListing } from "@/services/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listing = await getProductListing(Object.fromEntries(searchParams));
  return ok(listing);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  try {
    const body = productSchema.parse(await request.json());
    const product = await createProduct(body);
    return created(product);
  } catch (error) {
    if (error instanceof ZodError) {
      return badRequest(error.issues[0]?.message || "Invalid product details.");
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return badRequest("SKU or slug already exists. Use a unique value.");
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return badRequest(error.message.split("\n").filter(Boolean).slice(-1)[0] || "Invalid product data.");
    }

    return badRequest("Product could not be saved. Check the fields and try again.");
  }
}
