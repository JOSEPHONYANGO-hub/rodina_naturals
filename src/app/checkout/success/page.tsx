import Link from "next/link";
import { CheckCircle, Clock } from "lucide-react";

async function verifyPayment(reference: string, orderId: string) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const response = await fetch(
      `${appUrl}/api/payments/paystack/verify?reference=${encodeURIComponent(reference)}&order=${encodeURIComponent(orderId)}`,
      { cache: "no-store" },
    );
    return response.json();
  } catch {
    return { paid: false };
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { reference?: string; order?: string; method?: string };
}) {
  const { reference, order, method } = searchParams;
  const isCod = method === "cod";

  let paid = isCod;
  if (reference && order && !isCod) {
    const result = await verifyPayment(reference, order);
    paid = result.paid === true;
  }

  return (
    <div className="bg-cream px-4 py-32">
      <div className="mx-auto max-w-2xl bg-white p-10 text-center shadow-[0_18px_60px_rgba(77,12,18,0.08)]">
        {paid ? (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-gold">
              {isCod ? "Order Confirmed" : "Payment Successful"}
            </p>
            <h1 className="mt-4 text-5xl">Thank You!</h1>
            <p className="mt-5 leading-8 text-ink/70">
              {isCod
                ? "Your order has been placed. Our team will contact you to arrange delivery and payment."
                : "Your payment was received. We'll start processing your order right away."}
            </p>
            {order && (
              <p className="mt-3 text-sm text-ink/50">
                Order reference: <span className="font-mono font-semibold text-maroon">{order}</span>
              </p>
            )}
          </>
        ) : (
          <>
            <Clock className="mx-auto h-16 w-16 text-gold" />
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-gold">Payment Pending</p>
            <h1 className="mt-4 text-5xl">Almost There</h1>
            <p className="mt-5 leading-8 text-ink/70">
              Your order was created. If you paid via M-Pesa, please confirm the prompt on your phone.
              Once confirmed, your order will be processed automatically.
            </p>
            {order && (
              <p className="mt-3 text-sm text-ink/50">
                Order ID: <span className="font-mono font-semibold text-maroon">{order}</span>
              </p>
            )}
          </>
        )}
        <Link href="/shop" className="btn-primary mt-8">Continue Shopping</Link>
      </div>
    </div>
  );
}
