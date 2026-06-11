"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    paymentMethod: "MPESA",
  });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const orderResponse = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
      }),
    });
    const order = await orderResponse.json();

    if (form.paymentMethod === "STRIPE") {
      const response = await fetch("/api/payments/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } else if (form.paymentMethod === "MPESA") {
      await fetch("/api/payments/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, phone: form.customerPhone }),
      });
      clear();
      router.push(`/checkout/success?order=${order.id}`);
    } else {
      clear();
      router.push(`/checkout/success?order=${order.id}`);
    }

    setLoading(false);
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
                customerEmail: "Email",
                customerPhone: "Phone number",
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
              <option value="MPESA">M-Pesa STK Push</option>
              <option value="STRIPE">Card payment</option>
              <option value="CASH_ON_DELIVERY">Cash on delivery</option>
            </select>
          </div>
          <button className="btn-primary mt-8" disabled={loading || !items.length}>
            {loading ? "Processing..." : "Place Order"}
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
        </aside>
      </div>
    </div>
  );
}
