import Image from "next/image";
import Link from "next/link";
import { HeroSlider } from "@/components/home/hero-slider";
import { ProductCard } from "@/components/product/product-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function cardProduct(product: {
  id: string;
  slug: string;
  name: string;
  price: { toString(): string };
  images: string[];
  stock: number;
  category: { name: string };
}) {
  return { ...product, price: product.price.toString() };
}

const testimonials = [
  "The boutique experience feels thoughtful, and the products are beautifully curated.",
  "My skin and hair routine finally feels elegant and simple.",
  "Fast Nairobi delivery and premium service from start to finish.",
];

export default async function Home() {
  const [featured, bestSellers, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true },
      include: { category: true },
      take: 4,
    }),
    prisma.product.findMany({
      where: { isBestSeller: true },
      include: { category: true },
      take: 4,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <HeroSlider />
      <section className="bg-cream py-20">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Curated ritual</p>
              <h2 className="mt-3 text-4xl">Featured Products</h2>
            </div>
            <Link href="/shop" className="hidden text-sm uppercase tracking-[0.2em] text-maroon md:block">
              View all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={cardProduct(product)} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Collections</p>
            <h2 className="mt-3 text-4xl">Shop By Category</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="border border-maroon/10 bg-cream px-5 py-8 text-center text-lg font-serif text-maroon transition hover:border-gold hover:bg-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="container-page">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Beloved picks</p>
            <h2 className="mt-3 text-4xl">Best Sellers</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={cardProduct(product)} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page grid gap-6 md:grid-cols-3">
          {testimonials.map((quote) => (
            <blockquote key={quote} className="soft-card p-8">
              <p className="text-lg leading-8 text-ink/80">&ldquo;{quote}&rdquo;</p>
              <footer className="mt-6 text-sm uppercase tracking-[0.2em] text-gold">Rodina client</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="container-page">
          <div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Instagram</p>
              <h2 className="mt-3 text-4xl">@rodinanaturals</h2>
            </div>
            <Link href="https://www.instagram.com/rodinanaturals/" className="text-sm uppercase tracking-[0.2em] text-maroon">
              Follow us
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
              "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80",
              "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80",
              "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80",
            ].map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden bg-white">
                <Image src={src} alt="" fill sizes="25vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-maroon py-16 text-white">
        <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Newsletter</p>
            <h2 className="mt-3 text-3xl text-white">Receive boutique skincare notes</h2>
          </div>
          <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input className="field border-white/20" type="email" placeholder="Email address" />
            <button className="btn-primary bg-gold text-maroon hover:bg-white">Join</button>
          </form>
        </div>
      </section>
    </>
  );
}
