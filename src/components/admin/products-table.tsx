"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  images: string[];
  price: { toString(): string };
  stock: number;
  category: { name: string };
  brand?: { name: string } | null;
};

const FALLBACK = "/rodina-logo.jpeg";

function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-maroon/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-maroon">
      {children}
    </span>
  );
}

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const allChecked = selected.size === products.length && products.length > 0;
  const someChecked = selected.size > 0 && !allChecked;

  function toggleAll() {
    setSelected(allChecked ? new Set() : new Set(products.map((p) => p.id)));
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function deleteSelected() {
    if (!selected.size) return;
    const names = products
      .filter((p) => selected.has(p.id))
      .map((p) => p.name)
      .join(", ");
    if (!window.confirm(`Delete ${selected.size} product(s)?\n\n${names}\n\nThis cannot be undone.`)) return;

    setDeleting(true);
    const ids = Array.from(selected);
    await Promise.all(
      ids.map((id) => fetch(`/api/products/${id}`, { method: "DELETE" })),
    );
    setDeleting(false);
    setSelected(new Set());
    router.refresh();
  }

  return (
    <div>
      {/* Bulk action toolbar */}
      {selected.size > 0 && (
        <div className="mb-4 flex items-center gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <span className="text-sm font-semibold text-red-700">
            {selected.size} product{selected.size > 1 ? "s" : ""} selected
          </span>
          <button
            onClick={deleteSelected}
            disabled={deleting}
            className="ml-auto rounded-xl bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : `Delete ${selected.size}`}
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs font-semibold text-red-500 hover:text-red-700"
          >
            Clear
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-ink/45">
            <tr>
              <th className="py-3 pr-3 w-8">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => { if (el) el.indeterminate = someChecked; }}
                  onChange={toggleAll}
                  className="h-4 w-4 cursor-pointer rounded border-maroon/30 text-maroon focus:ring-maroon/20"
                />
              </th>
              <th className="py-3">Product</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const checked = selected.has(product.id);
              return (
                <tr
                  key={product.id}
                  className={`border-t border-maroon/10 transition ${checked ? "bg-maroon/[0.03]" : ""}`}
                >
                  <td className="py-4 pr-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(product.id)}
                      className="h-4 w-4 cursor-pointer rounded border-maroon/30 text-maroon focus:ring-maroon/20"
                    />
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-rose/25">
                        <Image
                          src={product.images[0] || FALLBACK}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-charcoal">{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category.name}</td>
                  <td>{product.brand?.name || "Unbranded"}</td>
                  <td>{formatCurrency(product.price.toString())}</td>
                  <td>{product.stock}</td>
                  <td>
                    <StatusPill>{product.stock > 0 ? "Active" : "Out"}</StatusPill>
                  </td>
                  <td>
                    <Link className="font-semibold text-maroon" href={`/admin/products/${product.id}`}>
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
