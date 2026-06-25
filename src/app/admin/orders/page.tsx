import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";

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
  CARD: "Card",
  MPESA: "M-Pesa",
  CASH_ON_DELIVERY: "COD",
};

export default async function AdminOrdersPage() {
  const session = await requireAdmin();
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const total = orders.reduce((s, o) => s + Number(o.total), 0);
  const paid = orders.filter((o) => ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(o.status));
  const pending = orders.filter((o) => o.status === "PENDING");

  return (
    <div className="bg-[#f7f1ea] min-h-screen pb-16 pt-28">
      <div className="container-page">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-maroon hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to dashboard
            </Link>
            <h1 className="mt-3 text-4xl font-semibold text-charcoal">Orders</h1>
            <p className="mt-1 text-sm text-ink/55">{orders.length} total orders · {formatCurrency(total)} revenue</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Orders", value: orders.length },
            { label: "Paid / Fulfilled", value: paid.length },
            { label: "Pending Payment", value: pending.length },
            { label: "Total Revenue", value: formatCurrency(total) },
          ].map((s) => (
            <div key={s.label} className="rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(34,34,34,0.05)]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">{s.label}</p>
              <p className="mt-3 text-2xl font-semibold text-charcoal">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Orders table */}
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_18px_60px_rgba(34,34,34,0.06)]">
          <div className="border-b border-maroon/10 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-maroon" />
              <h2 className="text-xl font-semibold text-charcoal">All Orders</h2>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center text-ink/50">No orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead className="border-b border-maroon/10 bg-cream text-xs font-bold uppercase tracking-[0.16em] text-ink/45">
                  <tr>
                    <th className="px-6 py-4 text-left">Customer</th>
                    <th className="px-4 py-4 text-left">Items</th>
                    <th className="px-4 py-4 text-left">Total</th>
                    <th className="px-4 py-4 text-left">Method</th>
                    <th className="px-4 py-4 text-left">Status</th>
                    <th className="px-4 py-4 text-left">Date</th>
                    <th className="px-4 py-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-maroon/5 hover:bg-cream/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-charcoal">{order.customerName}</p>
                        <p className="text-xs text-ink/50">{order.customerEmail}</p>
                        <p className="text-xs text-ink/50">{order.customerPhone}</p>
                      </td>
                      <td className="px-4 py-4 text-ink/60">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</td>
                      <td className="px-4 py-4 font-semibold text-maroon">{formatCurrency(Number(order.total))}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-maroon/10 px-3 py-1 text-[11px] font-bold text-maroon">
                          {METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${STATUS_STYLES[order.status] ?? ""}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-ink/50">
                        {new Date(order.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-4">
                        <Link href={`/admin/orders/${order.id}`} className="font-semibold text-maroon hover:underline">
                          Manage →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
