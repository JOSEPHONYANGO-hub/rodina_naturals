"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    paymentMethod: "CARD",
  });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create the order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        }),
      });

      if (!orderResponse.ok) {
        const data = await orderResponse.json();
        throw new Error(data.error || "Could not create order.");
      }

      const order = await orderResponse.json();

      if (form.paymentMethod === "CASH_ON_DELIVERY") {
        clear();
        window.location.href = `/checkout/success?order=${order.id}&method=cod`;
        return;
      }

      // 2. Initialize Paystack transaction
      const payResponse = await fetch("/api/payments/paystack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, paymentMethod: form.paymentMethod }),
      });

      const payData = await payResponse.json();

      if (!payData.url) {
        throw new Error(payData.error || "Could not initialize payment.");
      }

      // 3. Clear cart and redirect to Paystack hosted payment page
      clear();
      window.location.href = payData.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-cream pb-20 pt-32">
      <div className="container-page grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="soft-card p-6 md:p-8">
          <h1 className="text-4xl">Checkout</h1>
          <div className="mt-8 grid gap-4">
            {(["customerName", "customerEmail", "customerPhone"] as const).map((key) => {
              const label = {
                customerName: "Full name",
                customerEmail: "Email address",
                customerPhone: "Phone number (e.g. 0712345678)",
              }[key];

              return (
                <input
                  key={key}
                  className="field"
                  placeholder={label}
                  value={form[key]}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  required
                />
              );
            })}
            <textarea
              className="field min-h-28"
              placeholder="Shipping address"
              value={form.shippingAddress}
              onChange={(event) => setForm({ ...form, shippingAddress: event.target.value })}
              required
            />
            <select
              className="field"
              value={form.paymentMethod}
              onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}
            >
              <option value="CARD">Pay by Card (Visa / Mastercard)</option>
              <option value="MPESA">Pay via M-Pesa</option>
              <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
            </select>

            {form.paymentMethod !== "CASH_ON_DELIVERY" && (
              <p className="text-xs text-ink/60">
                You will be redirected to Paystack&apos;s secure payment page to complete your payment.
              </p>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}
          </div>
          <button className="btn-primary mt-8" disabled={loading || !items.length}>
            {loading ? "Processing..." : form.paymentMethod === "CASH_ON_DELIVERY" ? "Place Order" : "Proceed to Payment"}
          </button>
        </form>

        <aside className="soft-card h-fit p-6">
          <h2 className="text-2xl">Summary</h2>
          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between border-t border-maroon/10 pt-5 font-semibold">
            <span>Total</span>
            <span className="text-maroon">{formatCurrency(total())}</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-ink/50">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secured by Paystack
          </div>
        </aside>
      </div>
    </div>
  );
}
