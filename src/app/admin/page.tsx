import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { getAdminDashboard } from "@/services/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [products, orders, categories] = await getAdminDashboard();

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
              <tr><th className="py-3">Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-maroon/10">
                  <td className="py-4">{product.name}</td>
                  <td>{product.category.name}</td>
                  <td>{formatCurrency(product.price.toString())}</td>
                  <td>{product.stock}</td>
                  <td><Link className="text-maroon" href={`/admin/products/${product.id}`}>Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="mt-10 grid gap-8 lg:grid-cols-2">
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
        </section>
      </div>
    </div>
  );
}
