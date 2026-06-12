import { CreditCard, ShieldCheck, Sparkles, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeroSlider } from "@/components/home/hero-slider";
import { ProductTabs } from "@/components/home/product-tabs";
import { ProductCard } from "@/components/product/product-card";
import { SOCIAL_LINKS } from "@/config/brand";
import { getHomeCatalog, toProductCard } from "@/services/catalog";

export const dynamic = "force-dynamic";

const categoryImages = [
  "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80",
];

const trusts = [
  { icon: ShieldCheck, title: "Authentic products", copy: "Curated beauty brands you can trust." },
  { icon: Truck, title: "Fast delivery", copy: "Reliable dispatch across Nairobi and Kenya." },
  { icon: CreditCard, title: "Secure payments", copy: "Card and M-Pesa checkout support." },
  { icon: Sparkles, title: "Boutique care", copy: "A polished shopping experience." },
];

const instagramImages = [
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80",
];

export default async function Home() {
  const [featured, bestSellers, categories] = await getHomeCatalog();
  const featuredCards = featured.map((product) => toProductCard(product));
  const bestSellerCards = bestSellers.map((product) => toProductCard(product));

  return (
    <>
      <HeroSlider />

      <section className="relative z-10 -mt-10 pb-14">
        <div className="container-page grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trusts.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-maroon/10 bg-white p-5 shadow-[0_18px_50px_rgba(77,12,18,0.08)]"
            >
              <item.icon className="h-6 w-6 text-gold" />
              <h2 className="mt-3 text-base font-semibold text-charcoal">{item.title}</h2>
              <p className="mt-1 text-sm leading-6 text-ink/60">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="container-page">
          <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Featured categories</p>
              <h2 className="section-title">Shop By Beauty Need</h2>
            </div>
            <Link href="/shop" className="fine-link">
              View all categories
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group overflow-hidden rounded-[26px] border border-maroon/10 bg-white shadow-[0_14px_40px_rgba(77,12,18,0.06)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={categoryImages[index % categoryImages.length]}
                    alt={category.name}
                    fill
                    sizes="(min-width: 1024px) 16vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 to-transparent" />
                  <p className="absolute inset-x-0 bottom-0 p-4 text-center text-sm font-bold uppercase tracking-[0.16em] text-white">
                    {category.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory py-16 sm:py-24">
        <div className="container-page">
          <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Curated picks</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link href="/shop" className="fine-link">
              Shop all products
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featuredCards.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          <div className="mb-8 text-center">
            <p className="eyebrow">Our brands</p>
            <h2 className="mt-3 text-3xl font-semibold text-charcoal sm:text-5xl">
              Trusted Beauty Names At Rodina
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="rounded-[22px] border border-maroon/10 bg-cream px-5 py-6 text-center text-lg font-bold tracking-[0.08em] text-maroon transition hover:border-gold hover:bg-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="container-page grid gap-5 lg:grid-cols-2">
          <Link
            href="/shop?max=2000"
            className="group relative min-h-[320px] overflow-hidden rounded-[34px] bg-charcoal p-8 text-white"
          >
            <Image
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85"
              alt=""
              fill
              sizes="50vw"
              className="object-cover opacity-40 transition duration-500 group-hover:scale-105"
            />
            <div className="relative max-w-md">
              <p className="eyebrow">Offers / Deals</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-white">
                Premium beauty under KSh 2,000
              </h2>
              <span className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-maroon">
                Shop deals
              </span>
            </div>
          </Link>
          <Link
            href="/shop?category=bioblas"
            className="group relative min-h-[320px] overflow-hidden rounded-[34px] bg-maroon p-8 text-white"
          >
            <Image
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85"
              alt=""
              fill
              sizes="50vw"
              className="object-cover opacity-35 transition duration-500 group-hover:scale-105"
            />
            <div className="relative max-w-md">
              <p className="eyebrow">Haircare edit</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-white">
                Soft, healthy hair routines start here
              </h2>
              <span className="mt-7 inline-flex rounded-full bg-gold px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-maroon">
                Explore haircare
              </span>
            </div>
          </Link>
        </div>
      </section>

      <ProductTabs bestSellers={bestSellerCards} newArrivals={featuredCards} />

      <section className="bg-cream py-16 sm:py-24">
        <div className="container-page">
          <div className="mb-9 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Instagram</p>
              <h2 className="section-title">@rodinanaturals</h2>
            </div>
            <Link href={SOCIAL_LINKS.instagram} className="fine-link">
              Follow us
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {instagramImages.map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-[26px] bg-white">
                <Image src={src} alt="" fill sizes="25vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16 text-white sm:py-20">
        <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Newsletter</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
              Get new drops, offers, and beauty notes first.
            </h2>
          </div>
          <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input className="field rounded-full border-white/20" type="email" placeholder="Email address" />
            <button className="btn-primary bg-gold text-maroon hover:bg-white">Join</button>
          </form>
        </div>
      </section>
    </>
  );
}
