"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Save, Truck } from "lucide-react";

const STATUSES = [
  { value: "PENDING",    label: "Pending Payment",  color: "bg-amber-100 text-amber-800" },
  { value: "PAID",       label: "Paid",              color: "bg-blue-100 text-blue-800" },
  { value: "PROCESSING", label: "Processing",        color: "bg-purple-100 text-purple-800" },
  { value: "SHIPPED",    label: "Shipped",           color: "bg-indigo-100 text-indigo-800" },
  { value: "DELIVERED",  label: "Delivered",         color: "bg-green-100 text-green-800" },
  { value: "CANCELLED",  label: "Cancelled",         color: "bg-gray-100 text-gray-600" },
];

export function OrderActions({
  orderId,
  currentStatus,
  trackingNumber: initialTracking,
  adminNotes: initialNotes,
}: {
  orderId: string;
  currentStatus: string;
  trackingNumber: string;
  adminNotes: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState(initialTracking);
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingNumber: tracking, adminNotes: notes }),
      });
      if (!res.ok) throw new Error("Failed to update order.");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_14px_45px_rgba(34,34,34,0.05)]">
      <h2 className="text-xl font-semibold text-charcoal">Manage Order</h2>

      <div className="mt-5 space-y-5">
        {/* Status */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-charcoal">Order Status</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatus(s.value)}
                className={`rounded-xl border-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition ${
                  status === s.value
                    ? `border-maroon ${s.color}`
                    : "border-maroon/10 bg-cream text-ink/50 hover:border-maroon/30"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-charcoal">
            <Truck className="mr-1.5 inline h-4 w-4 text-maroon" />
            Tracking Number
          </label>
          <input
            className="field"
            placeholder="e.g. G4S-KE-123456 or Posta reference"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
          />
          <p className="mt-1 text-xs text-ink/50">
            Enter the courier tracking number. This will be visible on the customer&apos;s order page.
          </p>
        </div>

        {/* Admin notes */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-charcoal">Internal Notes</label>
          <textarea
            className="field min-h-24"
            placeholder="Internal delivery notes, customer communication, dispatch info…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn-primary w-full"
        >
          {saved ? (
            <><CheckCircle className="mr-2 h-4 w-4" /> Saved!</>
          ) : saving ? (
            "Saving…"
          ) : (
            <><Save className="mr-2 h-4 w-4" /> Save Changes</>
          )}
        </button>
      </div>
    </section>
  );
}
