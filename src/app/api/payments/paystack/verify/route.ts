import { badRequest, ok, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/payments/paystack";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  const orderId = searchParams.get("order");

  if (!reference || !orderId) return badRequest("Missing reference or order.");

  try {
    const transaction = await verifyTransaction(reference);

    if (transaction.status === "success") {
      await prisma.order.updateMany({
        where: { id: orderId, paystackReference: reference },
        data: { status: "PAID" },
      });
      return ok({ paid: true, reference });
    }

    return ok({ paid: false, status: transaction.status });
  } catch (error) {
    console.error("Paystack verify error:", error);
    return serverError("Could not verify payment.");
  }
}
