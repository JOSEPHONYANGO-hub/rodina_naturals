import Link from "next/link";
import { CheckCircle, Clock, MapPin, Package, Phone, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/payments/paystack";
import { formatCurrency } from "@/lib/utils";

async function resolveOrder(reference: string | undefined, orderId: string | undefined) {
  if (!orderId) return null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: { select: { name: true } } } } },
  });

  if (!order) return null;

  // Already marked PAID by webhook — no need to call Paystack again
  if (order.status === "PAID" || order.status === "PROCESSING" || order.status === "SHIPPED" || order.status === "DELIVERED") {
    return { order, paid: true };
  }

  // Try to verify with Paystack directly (handles the case where webhook hasn't fired yet)
  if (reference) {
    try {
      const tx = await verifyTransaction(reference);
      if (tx.status === "success") {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        });
        return { order: { ...order, status: "PAID" as const }, paid: true };
      }
    } catch {
      // Paystack verify failed — fall through to pending state
    }
  }

  return { order, paid: false };
}

const statusSteps = [
  { label: "Order Received", icon: Package, detail: "Your order has been created in our system." },
  { label: "Payment Confirmed", icon: CheckCircle, detail: "We have received your payment." },
  { label: "Processing", icon: Clock, detail: "Our team is preparing your items." },
  { label: "Out for Delivery", icon: Truck, detail: "Your order is on the way." },
  { label: "Delivered", icon: MapPin, detail: "Your order has been delivered." },
];

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { reference?: string; order?: string; method?: string };
}) {
  const { reference, order: orderId, method } = searchParams;
  const isCod = method === "cod";

  const result = isCod
    ? orderId
      ? { order: await prisma.order.findUnique({ where: { id: orderId }, include: { items: { include: { product: { select: { name: true } } } } } }), paid: true }
      : null
    : await resolveOrder(reference, orderId);

  const paid = isCod || result?.paid === true;
  const order = result?.order;

  return (
    <div className="bg-cream pb-24 pt-32">
      <div className="container-page max-w-3xl">

        {/* ── Status card ── */}
        <div className="rounded-[34px] bg-white p-8 shadow-[0_24px_80px_rgba(77,12,18,0.09)] sm:p-12 text-center">
          {paid ? (
            <>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-gold">
                {isCod ? "Order Confirmed" : "Payment Successful"}
              </p>
              <h1 className="mt-3 text-5xl font-semibold text-charcoal">Thank You!</h1>
              <p className="mt-5 leading-8 text-ink/70">
                {isCod
                  ? "Your order is confirmed. Our team will call you to arrange delivery and collect payment."
                  : "Your payment was received successfully. We will start preparing your order right away."}
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-100">
                <Clock className="h-10 w-10 text-amber-600" />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-gold">Payment Pending</p>
              <h1 className="mt-3 text-5xl font-semibold text-charcoal">Almost There</h1>
              <p className="mt-5 leading-8 text-ink/70">
                Your order has been created. If you paid via M-Pesa, check your phone for the STK push
                prompt and enter your PIN. Your order will be confirmed automatically once payment is received.
              </p>
            </>
          )}

          {order && (
            <div className="mt-6 rounded-2xl bg-cream px-6 py-4 text-sm">
              <p className="text-ink/55">Order ID</p>
              <p className="mt-1 font-mono font-bold text-maroon">{order.id}</p>
            </div>
          )}
        </div>

        {/* ── Order items ── */}
        {order && order.items.length > 0 && (
          <div className="mt-6 rounded-[34px] bg-white p-6 shadow-[0_24px_80px_rgba(77,12,18,0.07)] sm:p-8">
            <h2 className="text-2xl font-semibold text-charcoal">Items Ordered</h2>
            <div className="mt-5 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 rounded-2xl bg-cream px-5 py-4 text-sm">
                  <span className="font-semibold text-charcoal">{item.product.name}</span>
                  <span className="shrink-0 text-ink/60">
                    {item.quantity} × {formatCurrency(Number(item.price))}
                  </span>
                </div>
              ))}
              <div className="flex justify-between gap-4 border-t border-maroon/10 px-5 pt-4 font-bold">
                <span>Total Paid</span>
                <span className="text-maroon">{formatCurrency(Number(order.total))}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Delivery timeline ── */}
        {paid && (
          <div className="mt-6 rounded-[34px] bg-white p-6 shadow-[0_24px_80px_rgba(77,12,18,0.07)] sm:p-8">
            <h2 className="text-2xl font-semibold text-charcoal">What Happens Next</h2>
            <div className="mt-6 space-y-5">
              {statusSteps.map((step, index) => {
                const active = index <= 1; // Order received + payment confirmed are always done after success
                return (
                  <div key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${active ? "bg-maroon text-white" : "bg-cream text-ink/30"}`}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`mt-1 w-0.5 flex-1 ${active ? "bg-maroon/30" : "bg-maroon/10"}`} style={{ minHeight: "20px" }} />
                      )}
                    </div>
                    <div className="pb-5">
                      <p className={`font-semibold ${active ? "text-charcoal" : "text-ink/40"}`}>{step.label}</p>
                      <p className="mt-0.5 text-sm text-ink/55">{step.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Contact & delivery info ── */}
        <div className="mt-6 rounded-[34px] bg-maroon p-6 text-white shadow-[0_24px_80px_rgba(168,23,35,0.18)] sm:p-8">
          <h2 className="text-2xl font-semibold">Delivery Information</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3">
              <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#F5E6D3]" />
              <div>
                <p className="font-semibold text-[#F5E6D3]">Nairobi Delivery</p>
                <p className="mt-1 text-sm text-white/70">Same-day or next-day delivery within Nairobi. Our team will contact you to confirm the time.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#F5E6D3]" />
              <div>
                <p className="font-semibold text-[#F5E6D3]">We Will Call You</p>
                <p className="mt-1 text-sm text-white/70">Our delivery team will call you on the phone number you provided to arrange the handover.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#F5E6D3]" />
              <div>
                <p className="font-semibold text-[#F5E6D3]">Upcountry Delivery</p>
                <p className="mt-1 text-sm text-white/70">Orders outside Nairobi are shipped via courier. Expect 2–4 business days. Tracking number will be sent to your email.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#F5E6D3]" />
              <div>
                <p className="font-semibold text-[#F5E6D3]">Questions?</p>
                <p className="mt-1 text-sm text-white/70">WhatsApp or call us on 0793 200 000. Quote your Order ID when reaching out.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/shop" className="btn-primary">Continue Shopping</Link>
          <Link href="/" className="btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
