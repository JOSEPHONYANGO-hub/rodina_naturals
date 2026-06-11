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
  } catch {
    return badRequest("Invalid product details.");
  }
}
