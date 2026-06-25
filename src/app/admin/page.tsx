import {
  BadgeCheck,
  BarChart3,
  Bell,
  Boxes,
  CreditCard,
  FileText,
  LifeBuoy,
  MessageSquare,
  PackageCheck,
  Plus,
  Receipt,
  RefreshCcw,
  RotateCcw,
  Search,
  Settings,
  ShoppingBag,
  Tags,
  Truck,
  WalletCards,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCurrentSession } from "@/lib/authz";
import { formatCurrency } from "@/lib/utils";
import { getAdminDashboard } from "@/services/admin";

export const dynamic = "force-dynamic";

const PRODUCT_IMAGE_FALLBACK = "/rodina-logo.jpeg";

const mainMenu = [
  { label: "Overview", icon: BarChart3, href: "#overview" },
  { label: "Analytics", icon: BarChart3, href: "#analytics" },
  { label: "Products", icon: Boxes, href: "#products" },
  { label: "Sales", icon: ShoppingBag, href: "#orders" },
  { label: "Manage Orders", icon: PackageCheck, href: "/admin/orders" },
];

const transactionMenu = [
  { label: "Payment", icon: CreditCard, href: "#payments" },
  { label: "Refunds", icon: RefreshCcw, href: "#refunds" },
  { label: "Invoices", icon: Receipt, href: "#invoices" },
  { label: "Returns", icon: RotateCcw, href: "#returns" },
];

const generalMenu = [
  { label: "Notifications", icon: Bell, href: "#notifications" },
  { label: "Feedback", icon: MessageSquare, href: "#feedback" },
  { label: "Settings", icon: Settings, href: "#settings" },
  { label: "Support", icon: LifeBuoy, href: "#support" },
];

function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-maroon/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-maroon">
      {children}
    </span>
  );
}

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
  const session = await getCurrentSession();
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const paidOrders = orders.filter((order) => order.status === "PAID");
  const pendingOrders = orders.filter((order) => order.status === "PENDING");
  const lowStockProducts = products.filter((product) => product.stock <= 5);
  const featuredProducts = products.filter((product) => product.isFeatured);
  const averageOrderValue = orders.length ? totalRevenue / orders.length : 0;

  return (
    <div className="bg-[#f7f1ea] pb-12 pt-28">
      <div className="container-page">
        <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-[28px] border border-maroon/10 bg-white p-4 shadow-[0_18px_60px_rgba(34,34,34,0.06)] xl:sticky xl:top-36">
            <div className="rounded-[22px] bg-maroon px-5 py-5 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#F5E6D3]">Rodina</p>
              <h1 className="mt-2 text-2xl font-semibold text-white">Admin Suite</h1>
              <p className="mt-2 text-xs leading-5 text-white/75">Beauty commerce operations</p>
            </div>

            <div className="mt-5 grid gap-5 text-sm">
              <div>
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-ink/35">Main Menu</p>
                <nav className="mt-2 grid gap-1">
                  {mainMenu.map((item) => (
                    <Link key={item.label} href={item.href} className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 font-semibold text-ink/65 transition hover:bg-cream hover:text-maroon">
                      <item.icon className="h-4 w-4 text-maroon/70 transition group-hover:scale-110" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div>
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-ink/35">Transaction</p>
                <nav className="mt-2 grid gap-1">
                  {transactionMenu.map((item) => (
                    <Link key={item.label} href={item.href} className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 font-semibold text-ink/65 transition hover:bg-cream hover:text-maroon">
                      <item.icon className="h-4 w-4 text-maroon/70 transition group-hover:scale-110" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div>
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-ink/35">General</p>
                <nav className="mt-2 grid gap-1">
                  {generalMenu.map((item) => (
                    <Link key={item.label} href={item.href} className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 font-semibold text-ink/65 transition hover:bg-cream hover:text-maroon">
                      <item.icon className="h-4 w-4 text-maroon/70 transition group-hover:scale-110" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            <section id="overview" className="rounded-[30px] border border-maroon/10 bg-white p-5 shadow-[0_18px_60px_rgba(34,34,34,0.06)] sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">Overview</p>
                  <h2 className="mt-2 text-4xl font-semibold text-charcoal">Dashboard</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/60">
                    Manage products, brands, categories, orders, payments, content, and support from one workspace.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                    <input className="field h-12 rounded-full bg-cream pl-11" placeholder="Search admin records" />
                  </div>
                  <Link href="/admin/products/new" className="btn-primary shrink-0">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Link>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-[24px] bg-cream p-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-maroon text-white">
                  {(session?.user.name || session?.user.email || "A").slice(0, 1)}
                </span>
                <div>
                  <p className="font-semibold text-charcoal">{session?.user.name || "Rodina Admin"}</p>
                  <p className="text-sm text-ink/55">{session?.user.email || "admin@rodinanaturals.co.ke"}</p>
                </div>
                <StatusPill>Admin</StatusPill>
              </div>
            </section>

            <section id="analytics" className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Revenue", value: formatCurrency(totalRevenue), icon: WalletCards, detail: `${paidOrders.length} paid orders` },
                { label: "Orders", value: String(orders.length), icon: ShoppingBag, detail: `${pendingOrders.length} pending` },
                { label: "Products", value: String(products.length), icon: Boxes, detail: `${lowStockProducts.length} low stock` },
                { label: "Avg. Order", value: formatCurrency(averageOrderValue), icon: BarChart3, detail: `${featuredProducts.length} featured items` },
              ].map((card) => (
                <div key={card.label} className="rounded-[26px] border border-maroon/10 bg-white p-5 shadow-[0_14px_45px_rgba(34,34,34,0.05)]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-ink/45">{card.label}</p>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-maroon/10 text-maroon">
                      <card.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-5 text-3xl font-semibold text-charcoal">{card.value}</p>
                  <p className="mt-2 text-sm text-ink/55">{card.detail}</p>
                </div>
              ))}
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <div id="products" className="rounded-[30px] border border-maroon/10 bg-white p-5 shadow-[0_18px_60px_rgba(34,34,34,0.06)] sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-gold">Product management</p>
                    <h2 className="mt-2 text-3xl font-semibold text-charcoal">Catalog</h2>
                  </div>
                  <Link href="/admin/products/new" className="btn-secondary">
                    Add Product
                  </Link>
                </div>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[860px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.18em] text-ink/45">
                      <tr>
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
                      {products.map((product) => (
                        <tr key={product.id} className="border-t border-maroon/10">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-rose/25">
                                <Image
                                  src={product.images[0] || PRODUCT_IMAGE_FALLBACK}
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="rounded-[30px] border border-maroon/10 bg-white p-5 shadow-[0_18px_60px_rgba(34,34,34,0.06)]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-gold">Inventory alerts</p>
                  <h2 className="mt-2 text-2xl font-semibold text-charcoal">Low Stock</h2>
                  <div className="mt-4 grid gap-3">
                    {(lowStockProducts.length ? lowStockProducts : products.slice(0, 4)).map((product) => (
                      <div key={product.id} className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
                        <span className="text-sm font-semibold text-charcoal">{product.name}</span>
                        <span className="text-sm text-maroon">{product.stock}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] border border-maroon/10 bg-maroon p-5 text-white shadow-[0_18px_60px_rgba(168,23,35,0.18)]">
                  <PackageCheck className="h-7 w-7 text-[#F5E6D3]" />
                  <h2 className="mt-4 text-2xl font-semibold text-white">Storefront Control</h2>
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    Featured, best seller, stock, brand, category, pricing, and product images are managed from product edit screens.
                  </p>
                </div>
              </div>
            </section>

            <section id="orders" className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
              <div className="rounded-[30px] border border-maroon/10 bg-white p-5 shadow-[0_18px_60px_rgba(34,34,34,0.06)] sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-gold">Sales</p>
                    <h2 className="mt-2 text-3xl font-semibold text-charcoal">Recent Orders</h2>
                  </div>
                  <Link href="/admin/orders" className="rounded-full border border-maroon/20 px-4 py-2 text-xs font-bold text-maroon transition hover:bg-cream">
                    View all →
                  </Link>
                </div>
                <div className="mt-5 grid gap-4">
                  {orders.length ? (
                    orders.slice(0, 6).map((order) => (
                      <div key={order.id} className="rounded-[22px] border border-maroon/10 bg-cream p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-charcoal">{order.customerName}</p>
                            <p className="mt-1 text-xs text-ink/55">{order.customerEmail}</p>
                          </div>
                          <p className="font-bold text-maroon">{formatCurrency(order.total.toString())}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <StatusPill>{order.status}</StatusPill>
                          <StatusPill>{order.paymentMethod}</StatusPill>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-[22px] bg-cream p-5 text-sm text-ink/60">No orders yet.</p>
                  )}
                </div>
              </div>

              <div className="grid gap-6">
                <div className="rounded-[30px] border border-maroon/10 bg-white p-5 shadow-[0_18px_60px_rgba(34,34,34,0.06)]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-gold">Taxonomy</p>
                  <h2 className="mt-2 text-3xl font-semibold text-charcoal">Categories & Brands</h2>
                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-maroon">
                        <Tags className="h-4 w-4" />
                        Categories
                      </div>
                      <div className="grid gap-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex justify-between rounded-2xl bg-cream px-4 py-3 text-sm">
                            <span>{category.name}</span>
                            <span className="text-maroon">{category._count.products}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-maroon">
                        <BadgeCheck className="h-4 w-4" />
                        Brands
                      </div>
                      <div className="grid gap-2">
                        {brands.map((brand) => (
                          <div key={brand.id} className="flex justify-between rounded-2xl bg-cream px-4 py-3 text-sm">
                            <span>{brand.name}</span>
                            <span className="text-maroon">{brand._count.products}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-4">
              {[
                { id: "payments", title: "Payment", icon: CreditCard, copy: "Monitor Stripe, M-Pesa, and cash on delivery payments." },
                { id: "refunds", title: "Refunds", icon: RefreshCcw, copy: "Track refund requests and customer resolution workflows." },
                { id: "invoices", title: "Invoices", icon: FileText, copy: "Review order invoices and payment records." },
                { id: "returns", title: "Returns", icon: Truck, copy: "Manage return requests and delivery follow-ups." },
              ].map((card) => (
                <div id={card.id} key={card.title} className="rounded-[28px] border border-maroon/10 bg-white p-5 shadow-[0_14px_45px_rgba(34,34,34,0.05)]">
                  <card.icon className="h-6 w-6 text-maroon" />
                  <h2 className="mt-4 text-xl font-semibold text-charcoal">{card.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/60">{card.copy}</p>
                  <StatusPill>Ready</StatusPill>
                </div>
              ))}
            </section>

            <section className="mt-6 rounded-[30px] border border-maroon/10 bg-white p-5 shadow-[0_18px_60px_rgba(34,34,34,0.06)] sm:p-6">
              <div className="flex items-start gap-3">
                <Settings className="mt-1 h-5 w-5 text-maroon" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-gold">Settings</p>
                  <h2 className="mt-2 text-3xl font-semibold text-charcoal">Store Preferences</h2>
                </div>
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {[
                  ["Email Notifications", "Receive updates about new orders, customer messages, and stock alerts."],
                  ["Transaction Reports", "Review revenue, payment status, and order performance."],
                  ["Customer Feedback", "Monitor product reviews, contact messages, and service opportunities."],
                ].map(([title, copy]) => (
                  <div key={title} className="rounded-[24px] border border-maroon/10 bg-cream p-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-charcoal">{title}</h3>
                      <span className="relative h-6 w-11 rounded-full bg-green-300">
                        <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow" />
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-ink/60">{copy}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
