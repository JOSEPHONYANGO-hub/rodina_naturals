"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function ChangePasswordForm() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.next.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (form.next !== form.confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: form.current, newPassword: form.next }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error || "Failed to update password."); return; }
    setSuccess(true);
    setForm({ current: "", next: "", confirm: "" });
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      {(["current", "next", "confirm"] as const).map((key) => {
        const labels = { current: "Current password", next: "New password", confirm: "Confirm new password" };
        return (
          <div key={key} className="relative">
            <input
              type={show ? "text" : "password"}
              className="field pr-12"
              placeholder={labels[key]}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required
            />
            {key === "confirm" && (
              <button type="button" onClick={() => setShow((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-maroon">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
        );
      })}
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">Password updated successfully.</p>}
      <button className="btn-primary" disabled={loading}>{loading ? "Saving…" : "Update Password"}</button>
    </form>
  );
}
