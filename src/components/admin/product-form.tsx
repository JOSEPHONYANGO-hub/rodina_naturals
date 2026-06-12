"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductFormValue = {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  price: { toString(): string } | number | string;
  categoryId: string;
  stock: number;
  images: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
};

export function ProductForm({
  categories,
  product,
}: {
  categories: { id: string; name: string }[];
  product?: ProductFormValue;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>(product?.images || []);

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body });
    const data = await response.json();
    if (data.secure_url) setImages((current) => [...current, data.secure_url]);
    else setError(data.error || "Image upload failed. You can paste an image URL instead.");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      description: form.get("description"),
      ingredients: form.get("ingredients"),
      price: Number(form.get("price")),
      categoryId: form.get("categoryId"),
      stock: Number(form.get("stock")),
      images,
      isFeatured: form.get("isFeatured") === "on",
      isBestSeller: form.get("isBestSeller") === "on",
    };

    const response = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || "Product could not be saved. Check the fields and try again.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function deleteProduct() {
    if (!product) return;
    const confirmed = window.confirm(`Delete "${product.name}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    setError("");
    const response = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    setDeleting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || "Product could not be deleted.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="soft-card grid gap-5 p-6 md:p-8">
      <input className="field" name="name" defaultValue={product?.name} placeholder="Product name" required />
      <select className="field" name="categoryId" defaultValue={product?.categoryId} required>
        <option value="">Select category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <textarea className="field min-h-32" name="description" defaultValue={product?.description} placeholder="Description" required />
      <textarea className="field min-h-24" name="ingredients" defaultValue={product?.ingredients} placeholder="Ingredients" required />
      <div className="grid gap-4 md:grid-cols-2">
        <input className="field" name="price" type="number" defaultValue={product?.price?.toString()} placeholder="Price" required />
        <input className="field" name="stock" type="number" defaultValue={product?.stock ?? 0} placeholder="Stock" required />
      </div>
      <input className="field" type="file" accept="image/*" onChange={upload} />
      <textarea
        className="field min-h-24"
        value={images.join("\n")}
        onChange={(event) => setImages(event.target.value.split("\n").filter(Boolean))}
        placeholder="Image URLs, one per line"
      />
      <div className="flex flex-wrap gap-6 text-sm">
        <label><input className="mr-2" name="isFeatured" type="checkbox" defaultChecked={product?.isFeatured} /> Featured</label>
        <label><input className="mr-2" name="isBestSeller" type="checkbox" defaultChecked={product?.isBestSeller} /> Best seller</label>
      </div>
      {error ? (
        <p className="rounded-2xl border border-maroon/15 bg-cream px-4 py-3 text-sm text-maroon">
          {error}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="btn-primary w-fit" disabled={loading || deleting}>
          {loading ? "Saving..." : "Save Product"}
        </button>
        {product ? (
          <button
            className="btn-secondary w-fit border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50 hover:text-red-800"
            type="button"
            disabled={loading || deleting}
            onClick={deleteProduct}
          >
            {deleting ? "Deleting..." : "Delete Product"}
          </button>
        ) : null}
      </div>
    </form>
  );
}
