"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { calculateShipping, TOWN_OPTIONS } from "@/lib/shipping";
import { formatCurrency } from "@/lib/utils";

type PaymentMethod = "CARD" | "MPESA" | "CASH_ON_DELIVERY";

const paymentOptions: {
  id: PaymentMethod;
  label: string;
  description: string;
}[] = [
  {
    id: "CARD",
    label: "Debit / Credit Card",
    description: "Visa, Mastercard — secure payment via Paystack",
  },
  {
    id: "MPESA",
    label: "M-Pesa",
    description: "Pay via M-Pesa STK push to your phone",
  },
  {
    id: "CASH_ON_DELIVERY",
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
  },
];

// Each beauty product assumed ~0.4 kg; minimum 1 kg billed.
function estimatedWeight(itemCount: number) {
  return Math.max(1, itemCount * 0.4);
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [townSearch, setTownSearch] = useState("");
  const [showTownList, setShowTownList] = useState(false);
  const townInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    shippingTownKey: "",
    shippingTownName: "",
    paymentMethod: "CARD" as PaymentMethod,
  });

  const selectedOption = paymentOptions.find((o) => o.id === form.paymentMethod)!;

  const filteredTowns = useMemo(() => {
    const q = townSearch.toLowerCase();
    return q ? TOWN_OPTIONS.filter((t) => t.name.toLowerCase().includes(q)) : TOWN_OPTIONS;
  }, [townSearch]);

  const totalItemQty = items.reduce((s, i) => s + i.quantity, 0);
  const weight = estimatedWeight(totalItemQty);
  const shippingCost = form.shippingTownKey
    ? calculateShipping(form.shippingTownKey, weight)
    : null;
  const grandTotal = total() + (shippingCost ?? 0);

  function selectTown(key: string, name: string) {
    setForm({ ...form, shippingTownKey: key, shippingTownName: name });
    setTownSearch(name);
    setShowTownList(false);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!items.length) return;
    if (!form.shippingTownKey) {
      setError("Please select a delivery town.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          shippingAddress: `${form.shippingTownName} — ${form.shippingAddress}`,
          paymentMethod: form.paymentMethod,
          shippingCost: shippingCost ?? 0,
          items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        }),
      });

      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error || "Could not create order.");

      if (form.paymentMethod === "CASH_ON_DELIVERY") {
        clear();
        window.location.href = `/checkout/success?order=${order.id}&method=cod`;
        return;
      }

      const payRes = await fetch("/api/payments/paystack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, paymentMethod: form.paymentMethod }),
      });

      const payData = await payRes.json();
      if (!payData.url) throw new Error(payData.error || "Could not initialise payment.");

      clear();
      window.location.href = payData.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-cream pb-24 pt-32">
      <div className="container-page">
        <p className="eyebrow">Secure checkout</p>
        <h1 className="mt-2 text-5xl">Complete Your Order</h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* ── LEFT: form ── */}
          <form onSubmit={submit} className="space-y-6">

            {/* Contact & shipping */}
            <section className="soft-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-charcoal">Delivery Details</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input
                  className="field sm:col-span-2"
                  placeholder="Full name"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  required
                />
                <input
                  className="field"
                  type="email"
                  placeholder="Email address"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  required
                />
                <input
                  className="field"
                  placeholder="Phone (e.g. 0712 345 678)"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  required
                />

                {/* Town / G4S branch selector */}
                <div className="relative sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">
                    Delivery Town
                  </label>
                  <input
                    ref={townInputRef}
                    className="field w-full"
                    placeholder="Search town (e.g. Nairobi, Mombasa, Kisumu…)"
                    value={townSearch}
                    autoComplete="off"
                    onChange={(e) => {
                      setTownSearch(e.target.value);
                      setForm({ ...form, shippingTownKey: "", shippingTownName: "" });
                      setShowTownList(true);
                    }}
                    onFocus={() => setShowTownList(true)}
                    onBlur={() => setTimeout(() => setShowTownList(false), 150)}
                  />
                  {showTownList && filteredTowns.length > 0 && (
                    <ul className="absolute z-40 mt-1 max-h-56 w-full overflow-y-auto rounded-2xl border border-maroon/10 bg-white shadow-xl">
                      {filteredTowns.map((town) => (
                        <li key={town.key}>
                          <button
                            type="button"
                            className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-charcoal hover:bg-cream"
                            onMouseDown={() => selectTown(town.key, town.name)}
                          >
                            <span>{town.name}</span>
                            <span className="text-xs font-semibold text-maroon">
                              KES {calculateShipping(town.key, weight).toLocaleString()}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {townSearch && !form.shippingTownKey && (
                    <p className="mt-1.5 text-xs text-red-500">Select a town from the list to confirm.</p>
                  )}
                </div>

                <textarea
                  className="field min-h-24 sm:col-span-2"
                  placeholder="Street / estate / building (optional detail)"
                  value={form.shippingAddress}
                  onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                />
              </div>

              {/* G4S info note */}
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-cream px-4 py-3 text-xs text-ink/60">
                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Shipping via G4S Kenya. Rates cover up to 5 kg — excess weight charged per additional kg.
              </div>
            </section>

            {/* Payment method */}
            <section className="soft-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-charcoal">Payment Method</h2>
              <div className="mt-5 grid gap-3">
                {paymentOptions.map((option) => {
                  const isActive = form.paymentMethod === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setForm({ ...form, paymentMethod: option.id })}
                      className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition ${
                        isActive
                          ? "border-maroon bg-maroon/5 ring-1 ring-maroon/20"
                          : "border-maroon/10 bg-white hover:border-maroon/30"
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        isActive ? "border-maroon" : "border-maroon/30"
                      }`}>
                        {isActive && <span className="h-2.5 w-2.5 rounded-full bg-maroon" />}
                      </span>

                      <span className="flex-1">
                        <span className="block font-semibold text-charcoal">{option.label}</span>
                        <span className="mt-0.5 block text-sm text-ink/60">{option.description}</span>
                      </span>

                      <span className="hidden shrink-0 sm:block">
                        {option.id === "CARD" && (
                          <span className="flex items-center gap-1">
                            <span className="grid h-7 w-11 place-items-center rounded-md border border-maroon/10 bg-white text-[9px] font-bold text-[#1a1f71]">VISA</span>
                            <span className="grid h-7 w-11 place-items-center rounded-md border border-maroon/10 bg-white text-[9px] font-bold text-[#eb001b]">MC</span>
                          </span>
                        )}
                        {option.id === "MPESA" && (
                          <span className="grid h-7 w-16 place-items-center rounded-md bg-[#00a651] px-2 text-[10px] font-bold text-white">M-PESA</span>
                        )}
                        {option.id === "CASH_ON_DELIVERY" && (
                          <span className="grid h-7 w-16 place-items-center rounded-md border border-maroon/10 bg-cream text-[10px] font-bold text-charcoal">COD</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {form.paymentMethod !== "CASH_ON_DELIVERY" && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-cream px-4 py-3 text-xs text-ink/60">
                  <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  {form.paymentMethod === "MPESA"
                    ? `You will be redirected to Paystack. Enter your M-Pesa number (${form.customerPhone || "0712 345 678"}) to receive the STK push prompt.`
                    : "You will be redirected to Paystack's secure payment page to enter your card details."}
                </div>
              )}
            </section>

            {error && (
              <div className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-4 text-base"
              disabled={loading || !items.length}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Processing…
                </span>
              ) : form.paymentMethod === "CASH_ON_DELIVERY" ? (
                "Place Order"
              ) : (
                `Pay ${formatCurrency(grandTotal)} via ${selectedOption.label}`
              )}
            </button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-ink/45">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Payments secured by Paystack
            </p>
          </form>

          {/* ── RIGHT: order summary ── */}
          <aside className="space-y-4">
            <div className="soft-card p-6">
              <h2 className="text-2xl font-semibold text-charcoal">Order Summary</h2>
              <div className="mt-5 space-y-4">
                {items.length ? items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-charcoal">{item.name}</p>
                      <p className="text-xs text-ink/50">Qty: {item.quantity}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-maroon">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                )) : (
                  <div className="py-6 text-center">
                    <p className="text-sm text-ink/50">Your cart is empty.</p>
                    <Link href="/shop" className="mt-3 inline-block text-sm font-semibold text-maroon underline">
                      Browse products
                    </Link>
                  </div>
                )}
              </div>
              <div className="mt-6 space-y-2 border-t border-maroon/10 pt-5">
                <div className="flex justify-between text-sm text-ink/60">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total())}</span>
                </div>
                <div className="flex justify-between text-sm text-ink/60">
                  <span>Shipping</span>
                  {shippingCost !== null ? (
                    <span className="font-semibold text-charcoal">{formatCurrency(shippingCost)}</span>
                  ) : (
                    <span className="text-ink/40">Select town above</span>
                  )}
                </div>
                {form.shippingTownName && (
                  <p className="text-right text-xs text-ink/40">via G4S — {form.shippingTownName}</p>
                )}
                <div className="flex justify-between border-t border-maroon/10 pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-maroon">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="soft-card grid grid-cols-3 divide-x divide-maroon/10 p-4 text-center">
              {[
                { icon: "🔒", label: "Secure\nPayment" },
                { icon: "🚚", label: "Fast\nDelivery" },
                { icon: "↩️", label: "Easy\nReturns" },
              ].map((b) => (
                <div key={b.label} className="px-2">
                  <div className="text-xl">{b.icon}</div>
                  <p className="mt-1 whitespace-pre-line text-[10px] font-semibold uppercase tracking-wide text-ink/50">
                    {b.label}
                  </p>
                </div>
              ))}
            </div>

            {/* G4S branding note */}
            <div className="rounded-2xl border border-maroon/10 bg-white px-5 py-4 text-xs text-ink/50">
              <p className="font-semibold text-charcoal">Courier Partner</p>
              <p className="mt-1">G4S Kenya — 140+ branch locations nationwide. Rates from the 2026 tariff schedule.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
