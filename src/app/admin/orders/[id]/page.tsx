import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { OrderActions } from "./order-actions";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  PENDING:    "bg-amber-100 text-amber-800",
  PAID:       "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED:    "bg-indigo-100 text-indigo-800",
  DELIVERED:  "bg-green-100 text-green-800",
  FAILED:     "bg-red-100 text-red-800",
  CANCELLED:  "bg-gray-100 text-gray-600",
};

const METHOD_LABEL: Record<string, string> = {
  CARD: "Card (Paystack)",
  MPESA: "M-Pesa (Paystack)",
  CASH_ON_DELIVERY: "Cash on Delivery",
};

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { product: { select: { name: true, slug: true, images: true } } } },
      user: { select: { name: true, email: true } },
    },
  });

  if (!order) notFound();

  return (
    <div className="bg-[#f7f1ea] min-h-screen pb-16 pt-28">
      <div className="container-page max-w-5xl">
        <div className="mb-6">
          <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-maroon hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to orders
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <h1 className="text-4xl font-semibold text-charcoal">Order Details</h1>
            <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[order.status] ?? ""}`}>
              {order.status}
            </span>
          </div>
          <p className="mt-1 font-mono text-sm text-ink/50">{order.id}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Items */}
            <section className="rounded-[28px] bg-white p-6 shadow-[0_14px_45px_rgba(34,34,34,0.05)]">
              <h2 className="text-xl font-semibold text-charcoal">Items Ordered</h2>
              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl bg-cream px-5 py-4">
                    <div>
                      <p className="font-semibold text-charcoal">{item.product.name}</p>
                      <p className="mt-0.5 text-sm text-ink/55">Qty: {item.quantity} × {formatCurrency(Number(item.price))}</p>
                    </div>
                    <p className="font-bold text-maroon">{formatCurrency(Number(item.price) * item.quantity)}</p>
                  </div>
                ))}
                <div className="flex justify-between border-t border-maroon/10 px-5 pt-4 font-bold text-lg">
                  <span>Order Total</span>
                  <span className="text-maroon">{formatCurrency(Number(order.total))}</span>
                </div>
              </div>
            </section>

            {/* Manage order — client component */}
            <OrderActions
              orderId={order.id}
              currentStatus={order.status}
              trackingNumber={order.trackingNumber ?? ""}
              adminNotes={order.adminNotes ?? ""}
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Customer info */}
            <section className="rounded-[28px] bg-white p-6 shadow-[0_14px_45px_rgba(34,34,34,0.05)]">
              <h2 className="text-xl font-semibold text-charcoal">Customer</h2>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  ["Name", order.customerName],
                  ["Email", order.customerEmail],
                  ["Phone", order.customerPhone],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 rounded-xl bg-cream px-4 py-3">
                    <span className="text-ink/55">{label}</span>
                    <span className="font-semibold text-charcoal text-right">{value}</span>
                  </div>
                ))}
                <div className="rounded-xl bg-cream px-4 py-3">
                  <p className="text-ink/55">Delivery Address</p>
                  <p className="mt-1 font-semibold text-charcoal">{order.shippingAddress}</p>
                </div>
              </div>
            </section>

            {/* Payment info */}
            <section className="rounded-[28px] bg-white p-6 shadow-[0_14px_45px_rgba(34,34,34,0.05)]">
              <h2 className="text-xl font-semibold text-charcoal">Payment</h2>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  ["Method", METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod],
                  ["Status", order.status],
                  ["Paystack Ref", order.paystackReference ?? "N/A"],
                  ["Tracking No.", order.trackingNumber ?? "Not assigned yet"],
                  ["Order Date", new Date(order.createdAt).toLocaleString("en-KE", { dateStyle: "long", timeStyle: "short" })],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 rounded-xl bg-cream px-4 py-3">
                    <span className="shrink-0 text-ink/55">{label}</span>
                    <span className="font-semibold text-charcoal text-right break-all">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
