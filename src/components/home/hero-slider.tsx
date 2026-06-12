"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const slides = [
  {
    kicker: "Skincare ritual",
    title: "Thalia Signature Care for a soft natural glow.",
    copy: "A lifestyle-led skincare pick inspired by Rodina Naturals social beauty content, curated for daily radiance and confident skin.",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1800&q=85",
    cta: "/shop?category=thalia",
  },
  {
    kicker: "New arrivals",
    title: "Beauty routines that feel personal and polished.",
    copy: "Shop skincare, haircare, bath, body, and boutique beauty essentials styled around real everyday rituals.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1800&q=85",
    cta: "/shop",
  },
  {
    kicker: "Limited offers",
    title: "Discover your next ritual with Rodina Naturals.",
    copy: "Fresh picks, best sellers, and considered deals selected for a modern Nairobi beauty experience.",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1800&q=85",
    cta: "/shop?max=2000",
  },
];

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const go = (direction: number) => {
    setActive((value) => (value + direction + slides.length) % slides.length);
  };

  return (
    <section
      className="relative min-h-[430px] overflow-hidden bg-charcoal md:min-h-[520px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            index === active ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brandPurple/88 via-brandPurple/48 to-white/0" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-cream to-transparent" />
        </div>
      ))}

      <div className="container-page relative flex min-h-[430px] items-center py-10 md:min-h-[520px]">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_360px]">
          <div className="max-w-2xl text-white">
            <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold backdrop-blur">
              {slides[active].kicker}
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.04] text-white sm:text-5xl lg:text-6xl">
              {slides[active].title}
            </h1>
            <p className="mt-5 max-w-xl text-sm font-light leading-7 text-white/86 sm:text-base">
              {slides[active].copy}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={slides[active].cta} className="btn-primary bg-white text-brandPurple hover:bg-gold">
                Shop Now
              </Link>
              <Link
                href="/shop?max=2000"
                className="btn-secondary border-white/45 text-white hover:border-gold hover:bg-white/10 hover:text-white"
              >
                View Deals
              </Link>
            </div>
          </div>

          <div className="hidden rounded-[28px] border border-white/20 bg-white/12 p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.2)] backdrop-blur lg:block">
            <div className="rounded-[24px] bg-white p-5 text-charcoal">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                Rodina promise
              </p>
              <p className="mt-3 text-2xl font-semibold leading-tight">
                Authentic beauty, fast Nairobi delivery, secure checkout.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-brandPurple">
                <span className="rounded-2xl bg-cream px-3 py-4">Skin</span>
                <span className="rounded-2xl bg-cream px-3 py-4">Hair</span>
                <span className="rounded-2xl bg-cream px-3 py-4">Body</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:border-gold hover:bg-white/20 md:grid"
        onClick={() => go(-1)}
        aria-label="Previous slide"
      >
        <ChevronLeft />
      </button>
      <button
        className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:border-gold hover:bg-white/20 md:grid"
        onClick={() => go(1)}
        aria-label="Next slide"
      >
        <ChevronRight />
      </button>
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            className={cn(
              "h-2 w-9 rounded-full border border-white/70 transition",
              index === active ? "bg-gold" : "bg-white/30",
            )}
            onClick={() => setActive(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
