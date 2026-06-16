"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductFormValue = {
  id: string;
  name: string;
  sku: string | null;
  slug: string;
  shortDescription: string | null;
  description: string;
  ingredients: string;
  price: { toString(): string } | number | string;
  salePrice: { toString(): string } | number | string | null;
  taxStatus: string;
  taxClass: string | null;
  currency: string;
  categoryId: string;
  brandId: string | null;
  stockStatus: string;
  stock: number;
  weight: { toString(): string } | number | string | null;
  length: { toString(): string } | number | string | null;
  width: { toString(): string } | number | string | null;
  height: { toString(): string } | number | string | null;
  tags: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  productType: string;
  isDownloadable: boolean;
  isVirtual: boolean;
  images: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
};

export function ProductForm({
  brands,
  categories,
  product,
}: {
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  product?: ProductFormValue;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [isVirtual, setIsVirtual] = useState(Boolean(product?.isVirtual));

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body });
      const data = await response.json().catch(() => null);

      if (data?.secure_url) setImages((current) => [...current, data.secure_url]);
      else setError(data?.error || "Image upload failed. Choose another image file and try again.");
    } catch {
      setError("Image upload failed. Choose another image file and try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploading) {
      setError("Please wait for the image upload to finish before saving.");
      return;
    }

    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const price = Number(form.get("price"));
    const salePriceValue = form.get("salePrice");
    const salePrice = salePriceValue ? Number(salePriceValue) : undefined;
    const sku = String(form.get("sku") || "").trim();
    const currency = String(form.get("currency") || "KES").trim().toUpperCase();

    if (!Number.isFinite(price) || price <= 0) {
      setLoading(false);
      setError("Regular price must be greater than zero.");
      return;
    }

    if (sku && !/^[a-z0-9-_]+$/i.test(sku)) {
      setLoading(false);
      setError("SKU can only contain letters, numbers, hyphens, and underscores.");
      return;
    }

    if (!/^[A-Z]{3}$/.test(currency)) {
      setLoading(false);
      setError("Currency must be a 3-letter code such as KES.");
      return;
    }

    if (salePrice && salePrice >= price) {
      setLoading(false);
      setError("Sale price must be lower than the regular price.");
      return;
    }

    const payload = {
      name: form.get("name"),
      sku,
      slug: form.get("slug"),
      shortDescription: form.get("shortDescription"),
      description: form.get("description"),
      ingredients: form.get("ingredients"),
      price,
      salePrice,
      taxStatus: form.get("taxStatus"),
      taxClass: form.get("taxClass"),
      currency,
      categoryId: form.get("categoryId") || undefined,
      brandId: form.get("brandId") || undefined,
      stockStatus: form.get("stockStatus"),
      stock: Number(form.get("stock")),
      weight: form.get("weight"),
      length: form.get("length"),
      width: form.get("width"),
      height: form.get("height"),
      tags: String(form.get("tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      metaTitle: form.get("metaTitle"),
      metaDescription: form.get("metaDescription"),
      productType: form.get("productType"),
      isDownloadable: form.get("isDownloadable") === "on",
      isVirtual: form.get("isVirtual") === "on",
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
      <div>
        <p className="eyebrow">Core Identification</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input className="field" name="name" defaultValue={product?.name} placeholder="Product name / title" required />
          <input className="field" name="sku" defaultValue={product?.sku || ""} placeholder="SKU (optional)" />
          <input className="field" name="slug" defaultValue={product?.slug || ""} placeholder="URL slug (optional)" />
          <select className="field" name="brandId" defaultValue={product?.brandId || ""}>
            <option value="">Select brand (optional)</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>
        <textarea className="field mt-4 min-h-24" name="shortDescription" defaultValue={product?.shortDescription || ""} placeholder="Short description / product hook (optional)" />
        <textarea className="field mt-4 min-h-36" name="description" defaultValue={product?.description} placeholder="Long description, features, benefits, specifications (optional)" />
        <textarea className="field mt-4 min-h-24" name="ingredients" defaultValue={product?.ingredients} placeholder="Ingredients or specifications (optional)" />
      </div>

      <div className="border-t border-maroon/10 pt-5">
        <p className="eyebrow">Pricing & Financials</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <input className="field" name="price" type="number" step="0.01" min="0" defaultValue={product?.price?.toString()} placeholder="Regular price" required />
          <input className="field" name="salePrice" type="number" step="0.01" min="0" defaultValue={product?.salePrice?.toString() || ""} placeholder="Sale price (optional)" />
          <select className="field" name="taxStatus" defaultValue={product?.taxStatus || "TAXABLE"}>
            <option value="TAXABLE">Taxable</option>
            <option value="NONE">No tax</option>
          </select>
          <input className="field" name="currency" defaultValue={product?.currency || "KES"} placeholder="Currency" maxLength={3} />
          <input className="field md:col-span-2" name="taxClass" defaultValue={product?.taxClass || ""} placeholder="Tax class (optional, e.g. VAT inclusive)" />
        </div>
      </div>

      <div className="border-t border-maroon/10 pt-5">
        <p className="eyebrow">Inventory & Logistics</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <select className="field" name="stockStatus" defaultValue={product?.stockStatus || "IN_STOCK"}>
            <option value="IN_STOCK">In stock</option>
            <option value="OUT_OF_STOCK">Out of stock</option>
            <option value="BACKORDER">Backorder</option>
          </select>
          <input className="field" name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} placeholder="Quantity / stock level" required />
          <select className="field" name="categoryId" defaultValue={product?.categoryId}>
            <option value="">Select category (optional)</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <input className="field" name="weight" type="number" step="0.01" min="0" defaultValue={product?.weight?.toString() || ""} placeholder="Weight kg (optional)" disabled={isVirtual} />
          <input className="field" name="length" type="number" step="0.01" min="0" defaultValue={product?.length?.toString() || ""} placeholder="Length cm (optional)" disabled={isVirtual} />
          <input className="field" name="width" type="number" step="0.01" min="0" defaultValue={product?.width?.toString() || ""} placeholder="Width cm (optional)" disabled={isVirtual} />
          <input className="field" name="height" type="number" step="0.01" min="0" defaultValue={product?.height?.toString() || ""} placeholder="Height cm (optional)" disabled={isVirtual} />
        </div>
      </div>

      <div className="border-t border-maroon/10 pt-5">
        <p className="eyebrow">Categorization & SEO</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input className="field" name="tags" defaultValue={product?.tags?.join(", ") || ""} placeholder="Tags, comma separated (optional)" />
          <input className="field" name="metaTitle" defaultValue={product?.metaTitle || ""} placeholder="Meta title (optional)" />
          <textarea className="field min-h-24 md:col-span-2" name="metaDescription" defaultValue={product?.metaDescription || ""} placeholder="Meta description (optional)" />
        </div>
      </div>

      <div className="border-t border-maroon/10 pt-5">
        <p className="eyebrow">Visual Assets</p>
        <input className="field mt-4" type="file" accept="image/*" onChange={upload} disabled={uploading || loading} />
        {uploading ? <p className="mt-3 text-sm text-ink/55">Uploading image...</p> : null}
        {images.length ? (
          <div className="mt-4 grid gap-3 rounded-2xl border border-maroon/10 bg-cream p-4 text-sm text-ink/70 sm:grid-cols-2">
            {images.map((image) => (
              <div key={image} className="overflow-hidden rounded-2xl border border-maroon/10 bg-white">
                <div className="relative aspect-[4/3] bg-rose/25">
                  <Image src={image} alt="Product preview" fill sizes="(min-width: 640px) 320px, 100vw" className="object-cover" />
                </div>
                <div className="flex items-center gap-3 p-3">
                  <p className="min-w-0 flex-1 truncate">{image}</p>
                  <button
                    className="text-xs font-bold uppercase tracking-[0.14em] text-maroon"
                    type="button"
                    onClick={() => setImages((current) => current.filter((item) => item !== image))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink/55">Images are optional. Upload one when available.</p>
        )}
      </div>

      <div className="border-t border-maroon/10 pt-5">
        <p className="eyebrow">Technical / Custom Fields</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <select className="field" name="productType" defaultValue={product?.productType || "SIMPLE"}>
            <option value="SIMPLE">Simple product</option>
            <option value="VARIABLE">Variable product</option>
          </select>
          <div className="rounded-2xl border border-maroon/10 bg-cream p-4 text-sm">
            <label className="flex items-center gap-2">
              <input name="isVirtual" type="checkbox" defaultChecked={product?.isVirtual} onChange={(event) => setIsVirtual(event.target.checked)} />
              Virtual product
            </label>
            <label className="mt-3 flex items-center gap-2">
              <input name="isDownloadable" type="checkbox" defaultChecked={product?.isDownloadable} />
              Downloadable product
            </label>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-6 text-sm">
          <label><input className="mr-2" name="isFeatured" type="checkbox" defaultChecked={product?.isFeatured} /> Featured</label>
          <label><input className="mr-2" name="isBestSeller" type="checkbox" defaultChecked={product?.isBestSeller} /> Best seller</label>
        </div>
      </div>
      {error ? (
        <p className="rounded-2xl border border-maroon/15 bg-cream px-4 py-3 text-sm text-maroon">
          {error}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="btn-primary w-fit" disabled={loading || deleting || uploading}>
          {uploading ? "Uploading..." : loading ? "Saving..." : "Save Product"}
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
