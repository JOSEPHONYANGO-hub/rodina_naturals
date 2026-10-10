import {
  ArrowRight,
  Award,
  BadgeCheck,
  CreditCard,
  Truck,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CarouselFrame } from "@/components/home/carousel-frame";
import { HeroSlider } from "@/components/home/hero-slider";
import { ProductCard } from "@/components/product/product-card";
import { getHomeCatalog, toProductCard } from "@/services/catalog";
import type { ProductCardData } from "@/types/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eloria Beauty | Luxury Beauty, Skincare and Personal Care",
  description:
    "Shop premium skincare, haircare, wellness, makeup and personal care products from Bioxcin, Restorex, Procsin, Bioblas, Thalia and Rain.",
};

const categoryShowcase = [
  {
    title: "Skincare",
    href: "/shop?category=skincare",
    image: "/category-images/skincare.jpg",
    subcategories: ["Cleansers", "Toners", "Serums", "Moisturizers", "Face Masks", "Sunscreens", "Eye Care", "Lip Care"],
  },
  {
    title: "Hair Care",
    href: "/shop?category=hair-care",
    image: "/category-images/hair-care.jpg",
    subcategories: ["Shampoo", "Conditioner", "Hair Oils", "Hair Masks", "Hair Serums", "Hair Growth Products", "Styling Products"],
  },
  {
    title: "Body Care",
    href: "/shop?category=body-care",
    image: "/category-images/body-care.jpg",
    subcategories: ["Body Wash", "Body Lotion", "Body Butter", "Body Scrubs", "Hand Creams"],
  },
  {
    title: "Foot Care",
    href: "/shop?category=foot-care",
    image: "/category-images/foot-care.jpg",
    subcategories: ["Foot Creams", "Heel Repair", "Foot Scrubs", "Foot Masks"],
  },
  {
    title: "Eye Care",
    href: "/shop?category=eye-care",
    image: "/category-images/eye-care.png",
    subcategories: ["Eye Serums", "Eye Oils", "Eyelash Care", "Eye Contour Care"],
  },
  {
    title: "Lip Care",
    href: "/shop?category=lip-care",
    image: "/category-images/lip-care.jpg",
    subcategories: ["Lip Balms", "Lip Masks", "Lip Peels"],
  },
  {
    title: "Sunscreens",
    href: "/shop?category=sunscreens",
    image: "/category-images/sunscreens.jpg",
    subcategories: ["SPF50", "Face & Body Sunscreen", "Sun Protection"],
  },
  {
    title: "Face Masks",
    href: "/shop?category=face-masks",
    image: "/category-images/face-masks.jpg",
    subcategories: ["Brightening Masks", "Skincare Treatments", "Targeted Care"],
  },
  {
    title: "Hand Care",
    href: "/shop?category=hand-creams",
    image: "/category-images/hand-care.jpg",
    subcategories: ["Hand Cream", "Vitamin C Care", "Daily Moisture"],
  },
];


const brands = [
  { name: "Bioxcin",  slug: "bioxcin",  logo: "/brands/bioxcin.png" },
  { name: "Restorex", slug: "restorex", logo: "/brands/restorex.png" },
  { name: "Procsin",  slug: "procsin",  logo: "/brands/procsin.png" },
  { name: "Bioblas",  slug: "bioblas",  logo: "/brands/bioblas.png" },
  { name: "Thalia",   slug: "thalia",   logo: "/brands/thalia.png" },
  { name: "Rain",     slug: "rain",     logo: "/brands/rain.png" },
];

const trustCards = [
  { icon: BadgeCheck, title: "100% Genuine Products", copy: "Every item is sourced with authenticity and brand integrity in mind." },
  { icon: CreditCard, title: "Secure Checkout", copy: "Protected payment flows with card and M-Pesa support." },
  { icon: Truck, title: "Fast Delivery", copy: "Reliable dispatch for beauty routines that cannot wait." },
  { icon: Award, title: "Trusted Beauty Brands", copy: "A focused marketplace for professional care and daily luxury." },
];

function SectionBanner({
  eyebrow,
  title,
  copy,
  image,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  align?: "left" | "center";
}) {
  return (
    <div className="relative isolate overflow-hidden bg-[#222222] px-6 py-9 text-white shadow-[0_24px_80px_rgba(34,34,34,0.16)] sm:px-10 sm:py-10 lg:px-14">
      <Image src={image} alt="" fill sizes="100vw" className="absolute inset-0 -z-20 object-cover opacity-30" />
      <div className="absolute inset-0 -z-10 bg-[#222222]/58" />
      <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
        <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-cream">{eyebrow}</p>
        <h2 className="mt-3 text-4xl font-semibold leading-[1.02] text-white sm:text-5xl">{title}</h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">{copy}</p>
      </div>
    </div>
  );
}

function ProductRail({
  title,
  products,
  cta = "View All",
}: {
  title: string;
  products: ProductCardData[];
  cta?: string;
}) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-[26px] font-extrabold tracking-tight text-ink">{title}</h3>
        <Link
          href="/shop"
          className="inline-flex h-10 items-center rounded-full border border-espresso/20 bg-white px-5 text-xs font-bold text-espresso shadow-sm transition hover:border-espresso hover:bg-espresso hover:text-ivory"
        >
          {cta}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {products.slice(0, 10).map((product) => (
          <ProductCard key={`${title}-${product.id}`} product={product} variant="shop" />
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  let bestSellerCards: ProductCardData[] = [];
  let offerCards: ProductCardData[] = [];

  try {
    const [, bestSellers, offers] = await getHomeCatalog();
    bestSellerCards = bestSellers.map((product) => toProductCard(product));
    offerCards = offers.map((product) => toProductCard(product));
  } catch (error) {
    console.error("Homepage catalog unavailable:", error);
  }

  return (
    <>
      <HeroSlider />

      <main className="overflow-hidden bg-[#FAF8F5]">
        <section className="pb-8 pt-16 sm:pb-10 sm:pt-24">
          <div className="container-page">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="section-title">Shop Beauty By Category</h2>
              </div>
              <Link href="/shop" className="fine-link">
                View all categories
              </Link>
            </div>
            <CarouselFrame ariaLabel="Main beauty categories carousel" className="gap-5 pb-4">
              {categoryShowcase.map((category, index) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className="group relative min-h-[360px] min-w-[78vw] snap-start overflow-hidden rounded-[30px] border border-espresso/10 bg-white shadow-[0_18px_55px_rgba(34,34,34,0.08)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(60,26,8,0.14)] sm:min-w-[420px] lg:min-w-[460px]"
                >
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/30" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-cream">
                      {String(index + 1).padStart(2, "0")} / Category
                    </p>
                    <h3 className="mt-2 text-3xl font-semibold text-white">{category.title}</h3>
                    <span className="mt-5 inline-flex items-center rounded-full bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-espresso transition group-hover:bg-cream">
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </CarouselFrame>
          </div>
        </section>

        <section className="bg-white pb-8 pt-4 sm:pb-14">
          <div className="container-page">
            <ProductRail title="Offers For You" products={offerCards} />
          </div>
        </section>


        <section className="bg-white py-16 sm:py-24">
          <div className="container-page">
            <SectionBanner
              eyebrow="Best selling products"
              title="The Eloria Best Seller Edit"
              copy="Premium product cards with quick view, wishlisting and smooth shopping actions."
              image="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1800&q=88"
            />
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
              {bestSellerCards.slice(0, 10).map((product) => (
                <ProductCard key={product.id} product={product} variant="shop" />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#FAF8F5] py-14 sm:py-20">
          <div className="container-page">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow">Why shop with Eloria</p>
                <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-[1.02] text-espressoDark sm:text-5xl lg:text-6xl">
                  A premium beauty marketplace built on trust
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-ink/65 sm:text-base">
                  Thoughtful product discovery, genuine brands and a polished shopping flow for skincare, haircare, body care and wellness essentials. Eloria Beauty — your premium Kenyan beauty destination.
                </p>
                <div className="mt-8 grid max-w-lg grid-cols-3 overflow-hidden rounded-[24px] border border-espresso/10 bg-white shadow-[0_18px_55px_rgba(34,34,34,0.05)]">
                  {[
                    ["100%", "Genuine"],
                    ["Fast", "Delivery"],
                    ["Secure", "Checkout"],
                  ].map(([value, label]) => (
                    <div key={label} className="border-r border-espresso/10 px-4 py-4 last:border-r-0">
                      <p className="text-lg font-semibold text-espressoDark">{value}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/45">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {trustCards.map((item, index) => (
                  <div
                    key={item.title}
                    className="group rounded-[22px] border border-espresso/12 bg-cream p-5 shadow-[0_16px_50px_rgba(34,34,34,0.06)] transition duration-300 hover:-translate-y-1 hover:border-espresso/28 hover:bg-blush hover:shadow-[0_24px_70px_rgba(60,26,8,0.12)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-espresso shadow-sm transition group-hover:bg-espresso group-hover:text-ivory">
                        <item.icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-bold tracking-[0.18em] text-espressoDark/35">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="mt-5 border-t border-espresso/12 pt-4">
                      <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-ink/64">{item.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-cream py-16 sm:py-24">
          <div className="container-page space-y-10">
            <SectionBanner
              eyebrow="Brand discovery"
              title="Shop Trusted Brands"
              copy="Explore premium products from internationally recognized beauty brands."
              image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1800&q=88"
              align="center"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {brands.map((brand) => (
                <Link
                  key={brand.name}
                  href={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                  className="group flex flex-col items-center justify-between gap-5 overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(60,26,8,0.10)] backdrop-blur transition duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_28px_80px_rgba(60,26,8,0.18)]"
                >
                  <div className="relative h-24 w-full">
                    <Image
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 44vw, 90vw"
                      className="object-contain transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="inline-flex items-center rounded-full bg-espresso px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ivory transition group-hover:bg-chestnut">
                    Shop {brand.name}
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
