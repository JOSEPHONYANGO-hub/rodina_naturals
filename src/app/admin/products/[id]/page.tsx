import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="bg-cream pb-20 pt-32">
      <div className="container-page max-w-3xl">
        <h1 className="mb-8 text-5xl">Edit Product</h1>
        <ProductForm categories={categories} product={product} />
      </div>
    </div>
  );
}
