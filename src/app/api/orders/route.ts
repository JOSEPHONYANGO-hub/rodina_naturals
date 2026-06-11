import { badRequest, created, ok, unauthorized } from "@/lib/api-response";
import { getCurrentSession, requireAdmin } from "@/lib/authz";
import { orderSchema } from "@/lib/validators";
import { createOrder, getAdminOrders } from "@/services/orders";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const orders = await getAdminOrders();
  return ok(orders);
}

export async function POST(request: Request) {
  try {
    const body = orderSchema.parse(await request.json());
    const session = await getCurrentSession();
    const order = await createOrder(body, session?.user.id);
    return created(order);
  } catch {
    return badRequest("Invalid order details.");
  }
}
