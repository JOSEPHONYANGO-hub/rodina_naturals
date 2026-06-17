import { ProductForm } from "@/components/admin/product-form";
import { getProductFormTaxonomy } from "@/services/product-taxonomy";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const { brands, categories } = await getProductFormTaxonomy();

  return (
    <div className="bg-cream pb-20 pt-32">
      <div className="container-page max-w-3xl">
        <h1 className="mb-8 text-5xl">Add Product</h1>
        <ProductForm brands={brands} categories={categories} />
      </div>
    </div>
  );
}
