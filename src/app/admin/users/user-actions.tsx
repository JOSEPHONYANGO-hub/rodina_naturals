"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type Mode = "create" | "manage";

export function UserActions({
  mode,
  userId,
  currentName = "",
  currentRole = "USER",
}: {
  mode: Mode;
  userId?: string;
  currentName?: string;
  currentRole?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: currentName,
    email: "",
    password: "",
    role: currentRole,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Failed to create account."); return; }
    setSuccess(`Account created for ${data.email}`);
    setForm({ name: "", email: "", password: "", role: "USER" });
    router.refresh();
  }

  async function updateRole(role: string) {
    setLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setLoading(false);
    router.refresh();
  }

  async function deleteUser() {
    if (!confirm("Delete this account? This cannot be undone.")) return;
    setLoading(true);
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  if (mode === "manage") {
    return (
      <div className="flex items-center gap-2">
        <select
          className="field w-28 py-2 text-sm"
          value={form.role}
          onChange={(e) => { setForm({ ...form, role: e.target.value }); updateRole(e.target.value); }}
          disabled={loading}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          onClick={deleteUser}
          disabled={loading}
          className="grid h-9 w-9 place-items-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50"
          title="Delete account"
        >
          <Trash2 size={15} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={create} className="mt-5 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="field" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="field" type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
        <select className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="USER">User (orders only)</option>
          <option value="ADMIN">Admin (full access)</option>
        </select>
      </div>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}
      <button className="btn-primary" disabled={loading}>{loading ? "Creating…" : "Create Account"}</button>
    </form>
  );
}
