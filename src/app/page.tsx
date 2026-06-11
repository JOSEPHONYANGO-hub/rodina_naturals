import Image from "next/image";
import Link from "next/link";
import { HeroSlider } from "@/components/home/hero-slider";
import { ProductCard } from "@/components/product/product-card";
import { SOCIAL_LINKS } from "@/config/brand";
import { getHomeCatalog, toProductCard } from "@/services/catalog";

export const dynamic = "force-dynamic";

const testimonials = [
  "The boutique experience feels thoughtful, and the products are beautifully curated.",
  "My skin and hair routine finally feels elegant and simple.",
  "Fast Nairobi delivery and premium service from start to finish.",
];

export default async function Home() {
  const [featured, bestSellers, categories] = await getHomeCatalog();

  return (
    <>
      <HeroSlider />
      <section className="bg-cream py-24">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Curated ritual</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link href="/shop" className="hidden text-xs font-semibold uppercase tracking-[0.24em] text-maroon transition hover:text-gold md:block">
              View all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={toProductCard(product)} />
            ))}
          </div>
        </div>
      </section>

      <section className="luxury-band py-24">
        <div className="container-page">
          <div className="mb-10 text-center">
            <p className="eyebrow">Collections</p>
            <h2 className="section-title">Shop By Category</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="border border-maroon/10 bg-white px-5 py-9 text-center text-lg font-serif tracking-[0.08em] text-maroon transition duration-300 hover:border-gold hover:bg-cream hover:text-maroonDark"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="container-page">
          <div className="mb-10">
            <p className="eyebrow">Beloved picks</p>
            <h2 className="section-title">Best Sellers</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={toProductCard(product)} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24">
        <div className="container-page grid gap-6 md:grid-cols-3">
          {testimonials.map((quote) => (
            <blockquote key={quote} className="border border-maroon/10 bg-white p-8">
              <p className="font-serif text-2xl leading-9 text-maroon">&ldquo;{quote}&rdquo;</p>
              <footer className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-gold">Rodina client</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="container-page">
          <div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Instagram</p>
              <h2 className="section-title">@rodinanaturals</h2>
            </div>
            <Link href={SOCIAL_LINKS.instagram} className="text-xs font-semibold uppercase tracking-[0.24em] text-maroon transition hover:text-gold">
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

      <section className="bg-maroon py-20 text-white">
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
