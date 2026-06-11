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
  const [images, setImages] = useState<string[]>(product?.images || []);

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body });
    const data = await response.json();
    if (data.secure_url) setImages((current) => [...current, data.secure_url]);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
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

    await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

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
      <button className="btn-primary w-fit" disabled={loading}>{loading ? "Saving..." : "Save Product"}</button>
    </form>
  );
}
