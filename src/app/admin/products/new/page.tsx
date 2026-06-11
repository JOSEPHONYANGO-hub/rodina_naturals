import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="bg-cream pb-20 pt-32">
      <div className="container-page max-w-3xl">
        <h1 className="mb-8 text-5xl">Add Product</h1>
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
