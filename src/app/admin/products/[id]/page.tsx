import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";
import { getProductFormTaxonomy } from "@/services/product-taxonomy";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, taxonomy] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    getProductFormTaxonomy(),
  ]);

  if (!product) notFound();

  const { brands, categories } = taxonomy;

  return (
    <div className="bg-cream pb-20 pt-32">
      <div className="container-page max-w-3xl">
        <h1 className="mb-8 text-5xl">Edit Product</h1>
        <ProductForm brands={brands} categories={categories} product={product} />
      </div>
    </div>
  );
}
