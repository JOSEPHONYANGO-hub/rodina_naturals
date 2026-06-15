import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { getAdminDashboard } from "@/services/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let dashboard: Awaited<ReturnType<typeof getAdminDashboard>>;

  try {
    dashboard = await getAdminDashboard();
  } catch (error) {
    console.warn("Admin dashboard data is unavailable.", error);

    return (
      <div className="bg-cream pb-20 pt-32">
        <div className="container-page">
          <div className="soft-card mx-auto max-w-3xl p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Admin setup required</p>
            <h1 className="mt-3 text-4xl text-charcoal sm:text-5xl">Connect the database</h1>
            <p className="mt-5 leading-8 text-ink/70">
              The admin dashboard needs Prisma database access before it can show products,
              categories, brands, orders, or let you add new products.
            </p>
            <div className="mt-7 grid gap-3 rounded-[24px] border border-maroon/10 bg-cream p-5 text-sm text-charcoal">
              <code>docker compose up -d postgres</code>
              <code>npx prisma migrate deploy</code>
              <code>npm run db:seed</code>
            </div>
            <p className="mt-5 text-sm leading-7 text-ink/60">
              Then log in with admin@rodinanaturals.co.ke and password ChangeMe123!.
            </p>
            <Link href="/login" className="btn-primary mt-7">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [products, orders, categories, brands] = dashboard;

  return (
    <div className="bg-cream pb-20 pt-32">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Admin</p>
            <h1 className="mt-3 text-5xl">Dashboard</h1>
          </div>
          <Link href="/admin/products/new" className="btn-primary">Add Product</Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="soft-card p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-gold">Products</p>
            <p className="mt-3 text-4xl font-serif text-maroon">{products.length}</p>
          </div>
          <div className="soft-card p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-gold">Orders</p>
            <p className="mt-3 text-4xl font-serif text-maroon">{orders.length}</p>
          </div>
          <div className="soft-card p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-gold">Revenue</p>
            <p className="mt-3 text-4xl font-serif text-maroon">
              {formatCurrency(orders.reduce((sum, order) => sum + Number(order.total), 0))}
            </p>
          </div>
        </div>
        <section className="mt-10 soft-card overflow-x-auto p-6">
          <h2 className="text-3xl">Products</h2>
          <table className="mt-5 w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-maroon/60">
              <tr><th className="py-3">Name</th><th>Category</th><th>Brand</th><th>Price</th><th>Stock</th><th></th></tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-maroon/10">
                  <td className="py-4">{product.name}</td>
                  <td>{product.category.name}</td>
                  <td>{product.brand?.name || "Unbranded"}</td>
                  <td>{formatCurrency(product.price.toString())}</td>
                  <td>{product.stock}</td>
                  <td><Link className="text-maroon" href={`/admin/products/${product.id}`}>Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="soft-card p-6">
            <h2 className="text-3xl">Orders</h2>
            <div className="mt-5 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border-t border-maroon/10 pt-4">
                  <div className="flex justify-between gap-4">
                    <p className="font-semibold text-maroon">{order.customerName}</p>
                    <p>{formatCurrency(order.total.toString())}</p>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink/50">{order.status} - {order.paymentMethod}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="soft-card p-6">
            <h2 className="text-3xl">Categories</h2>
            <div className="mt-5 grid gap-3">
              {categories.map((category) => (
                <div key={category.id} className="flex justify-between border-t border-maroon/10 pt-3">
                  <span>{category.name}</span>
                  <span className="text-maroon">{category._count.products} products</span>
                </div>
              ))}
            </div>
          </div>
          <div className="soft-card p-6">
            <h2 className="text-3xl">Brands</h2>
            <div className="mt-5 grid gap-3">
              {brands.map((brand) => (
                <div key={brand.id} className="flex justify-between border-t border-maroon/10 pt-3">
                  <span>{brand.name}</span>
                  <span className="text-maroon">{brand._count.products} products</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
