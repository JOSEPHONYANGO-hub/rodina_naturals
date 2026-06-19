import {
  ArrowRight,
  Award,
  BadgeCheck,
  CreditCard,
  Droplets,
  Scissors,
  Sparkles,
  Truck,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CarouselFrame } from "@/components/home/carousel-frame";
import { HeroSlider } from "@/components/home/hero-slider";
import { ProductCard } from "@/components/product/product-card";
import { fallbackProducts, getHomeCatalog, toProductCard } from "@/services/catalog";
import type { ProductCardData } from "@/types/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rodina Naturals | Luxury Beauty, Skincare and Personal Care",
  description:
    "Shop premium skincare, haircare, wellness, makeup and personal care products from Bioxcin, Restorex, Procsin, Bioblas, Thalia and Rain.",
};

const categoryShowcase = [
  {
    title: "Skincare",
    href: "/shop?category=skincare",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85",
    subcategories: ["Cleansers", "Toners", "Serums", "Moisturizers", "Face Masks", "Sunscreens", "Eye Care", "Lip Care"],
  },
  {
    title: "Hair Care",
    href: "/shop?category=hair-care",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85",
    subcategories: ["Shampoo", "Conditioner", "Hair Oils", "Hair Masks", "Hair Serums", "Hair Growth Products", "Styling Products"],
  },
  {
    title: "Body Care",
    href: "/shop?category=body-care",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=85",
    subcategories: ["Body Wash", "Body Lotion", "Body Butter", "Body Scrubs", "Hand Creams"],
  },
  {
    title: "Foot Care",
    href: "/shop?category=foot-care",
    image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=1200&q=85",
    subcategories: ["Foot Creams", "Heel Repair", "Foot Scrubs", "Foot Masks"],
  },
  {
    title: "Eye Care",
    href: "/shop?category=eye-care",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
    subcategories: ["Eye Serums", "Eye Oils", "Eyelash Care", "Eye Contour Care"],
  },
  {
    title: "Lip Care",
    href: "/shop?category=lip-care",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
    subcategories: ["Lip Balms", "Lip Masks", "Lip Peels"],
  },
  {
    title: "Men's Grooming",
    href: "/shop?category=mens-grooming",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85",
    subcategories: ["Beard Care", "Shaving", "Face Care", "Hair Styling"],
  },
  {
    title: "Sunscreens",
    href: "/shop?category=sunscreens",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85",
    subcategories: ["SPF50", "Face & Body Sunscreen", "Sun Protection"],
  },
  {
    title: "Face Masks",
    href: "/shop?category=face-masks",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=85",
    subcategories: ["Brightening Masks", "Skincare Treatments", "Targeted Care"],
  },
  {
    title: "Hand Creams",
    href: "/shop?category=hand-creams",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=85",
    subcategories: ["Hand Cream", "Vitamin C Care", "Daily Moisture"],
  },
];

const concernGroups = [
  {
    title: "Skin Concerns",
    icon: Sparkles,
    concerns: ["Acne & Blemishes", "Dry Skin", "Oily Skin", "Sensitive Skin", "Hyperpigmentation", "Anti-Aging"],
  },
  {
    title: "Hair Concerns",
    icon: Scissors,
    concerns: ["Hair Loss", "Dandruff", "Dry Hair", "Damaged Hair", "Weak Hair", "Curly Hair Care"],
  },
  {
    title: "Body Concerns",
    icon: Droplets,
    concerns: ["Stretch Marks", "Dark Spots", "Uneven Skin Tone", "Dry Skin"],
  },
];

const brands = [
  {
    name: "Bioxcin",
    count: "42 products",
    focus: "Hair loss prevention and hair strengthening products.",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Restorex",
    count: "36 products",
    focus: "Hair care and hair restoration solutions.",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Procsin",
    count: "58 products",
    focus: "Professional skincare and dermatological products.",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Bioblas",
    count: "44 products",
    focus: "Herbal hair care and hair growth support.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Thalia",
    count: "63 products",
    focus: "Natural beauty, soaps and body care.",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Rain",
    count: "28 products",
    focus: "Premium skincare and wellness products.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85",
  },
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
        <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#F5E6D3]">{eyebrow}</p>
        <h2 className="mt-3 text-4xl font-semibold leading-[1.02] text-white sm:text-5xl">{title}</h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">{copy}</p>
      </div>
    </div>
  );
}

function ProductRail({
  title,
  products,
}: {
  title: string;
  products: ProductCardData[];
}) {
  return (
    <div className="rounded-[32px] border border-[#a81723]/10 bg-white/72 p-4 shadow-[0_20px_70px_rgba(34,34,34,0.06)] sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-2xl font-semibold text-[#222222]">{title}</h3>
        <Link href="/shop" className="fine-link">
          Shop products
        </Link>
      </div>
      <CarouselFrame ariaLabel={`${title} carousel`} className="gap-4 pb-2">
        {products.map((product) => (
          <div key={`${title}-${product.id}`} className="min-w-[250px] snap-start sm:min-w-[290px] lg:min-w-[310px]">
            <ProductCard product={product} />
          </div>
        ))}
      </CarouselFrame>
    </div>
  );
}

export default async function Home() {
  let featuredCards = fallbackProducts;
  let bestSellerCards = fallbackProducts;

  try {
    const [featured, bestSellers] = await getHomeCatalog();
    featuredCards = featured.length ? featured.map((product) => toProductCard(product)) : fallbackProducts;
    bestSellerCards = bestSellers.length ? bestSellers.map((product) => toProductCard(product)) : featuredCards;
  } catch (error) {
    console.warn("Using homepage fallback products because catalog data is unavailable.", error);
  }

  const products = bestSellerCards.length ? bestSellerCards : featuredCards;

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
                  className="group relative min-h-[360px] min-w-[78vw] snap-start overflow-hidden rounded-[30px] border border-[#a81723]/10 bg-white shadow-[0_18px_55px_rgba(34,34,34,0.08)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(168,23,35,0.14)] sm:min-w-[420px] lg:min-w-[460px]"
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
                    <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#F5E6D3]">
                      {String(index + 1).padStart(2, "0")} / Category
                    </p>
                    <h3 className="mt-2 text-3xl font-semibold text-white">{category.title}</h3>
                    <span className="mt-5 inline-flex items-center rounded-full bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#a81723] transition group-hover:bg-[#F5E6D3]">
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </CarouselFrame>
          </div>
        </section>

        <section className="bg-white pb-16 pt-8 sm:pb-24 sm:pt-10">
          <div className="container-page space-y-10">
            <SectionBanner
              eyebrow="Shop by concern"
              title="Find The Perfect Solution"
              copy="Target your beauty concerns with carefully selected products."
              image="https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1800&q=88"
            />
            <ProductRail title="Concern-focused favorites" products={products} />
            <CarouselFrame ariaLabel="Shop by concern carousel" className="gap-4 pb-3">
              {concernGroups.flatMap((group) =>
                group.concerns.map((concern) => (
                  <Link
                    key={`${group.title}-${concern}`}
                    href={`/shop?q=${encodeURIComponent(concern)}`}
                    className="group min-w-[210px] snap-start rounded-[24px] border border-[#a81723]/20 bg-[#7a111b] p-5 text-white shadow-[0_16px_45px_rgba(34,34,34,0.12)] transition duration-300 hover:-translate-y-1 hover:border-[#F5E6D3]/50 hover:bg-[#5f0d15] hover:shadow-[0_24px_65px_rgba(168,23,35,0.22)] sm:min-w-[240px]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F5E6D3] text-[#a81723] shadow-sm">
                        <group.icon className="h-5 w-5" />
                      </span>
                      <ArrowRight className="h-4 w-4 text-[#F5E6D3] opacity-60 transition group-hover:translate-x-1 group-hover:opacity-100" />
                    </div>
                    <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#F5E6D3]/78">
                      {group.title}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight text-white">
                      {concern}
                    </h3>
                  </Link>
                )),
              )}
            </CarouselFrame>
          </div>
        </section>

        <section className="bg-[#F5E6D3] py-16 sm:py-24">
          <div className="container-page space-y-10">
            <SectionBanner
              eyebrow="Brand discovery"
              title="Shop Trusted Brands"
              copy="Explore premium products from internationally recognized beauty brands."
              image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1800&q=88"
              align="center"
            />
            <ProductRail title="Featured brand products" products={featuredCards} />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {brands.map((brand) => (
                <Link
                  key={brand.name}
                  href={`/shop?brand=${encodeURIComponent(brand.name.toLowerCase())}`}
                  className="group overflow-hidden rounded-[32px] border border-white/60 bg-white/78 shadow-[0_24px_70px_rgba(168,23,35,0.12)] backdrop-blur transition duration-500 hover:-translate-y-1 hover:bg-white"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={brand.image} alt={`${brand.name} featured product`} fill sizes="(min-width: 1280px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#222222]/75 to-transparent" />
                    <div className="absolute bottom-5 left-5 rounded-2xl bg-white/16 px-5 py-3 text-white shadow backdrop-blur-md">
                      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#F5E6D3]">Brand</p>
                      <h3 className="text-3xl font-semibold text-white">{brand.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a81723]">{brand.count}</p>
                      <span className="rounded-full border border-[#a81723]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a81723]">
                        Logo
                      </span>
                    </div>
                    <p className="mt-3 min-h-14 text-sm leading-7 text-[#222222]/68">{brand.focus}</p>
                    <span className="mt-5 inline-flex items-center rounded-full bg-[#222222] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition group-hover:bg-[#a81723]">
                      Explore Brand
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="container-page">
            <SectionBanner
              eyebrow="Best selling products"
              title="The Rodina Best Seller Edit"
              copy="Premium product cards with quick view, wishlisting, ratings and smooth shopping actions."
              image="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1800&q=88"
            />
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {bestSellerCards.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#FAF8F5] py-14 sm:py-20">
          <div className="container-page">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow">Why shop with Rodina</p>
                <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-[1.02] text-[#7a111b] sm:text-5xl lg:text-6xl">
                  A premium beauty marketplace built on trust
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-[#222222]/65 sm:text-base">
                  Thoughtful product discovery, genuine brands and a polished shopping flow for skincare, haircare, body care and wellness essentials.
                </p>
                <div className="mt-8 grid max-w-lg grid-cols-3 overflow-hidden rounded-[24px] border border-[#a81723]/10 bg-white shadow-[0_18px_55px_rgba(34,34,34,0.05)]">
                  {[
                    ["100%", "Genuine"],
                    ["Fast", "Delivery"],
                    ["Secure", "Checkout"],
                  ].map(([value, label]) => (
                    <div key={label} className="border-r border-[#a81723]/10 px-4 py-4 last:border-r-0">
                      <p className="text-lg font-semibold text-[#7a111b]">{value}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#222222]/45">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {trustCards.map((item, index) => (
                  <div
                    key={item.title}
                    className="group rounded-[22px] border border-[#a81723]/12 bg-[#F5E6D3] p-5 shadow-[0_16px_50px_rgba(34,34,34,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#a81723]/28 hover:bg-[#f2dfc8] hover:shadow-[0_24px_70px_rgba(168,23,35,0.12)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[#a81723] shadow-sm transition group-hover:bg-[#a81723] group-hover:text-white">
                        <item.icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-bold tracking-[0.18em] text-[#7a111b]/35">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="mt-5 border-t border-[#a81723]/12 pt-4">
                      <h3 className="text-lg font-semibold text-[#222222]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#222222]/64">{item.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
