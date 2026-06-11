"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Reveal Your Natural Glow",
    copy: "Curated skincare rituals with a polished boutique touch.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Beauty, Softly Considered",
    copy: "Premium hair, skin, and body essentials selected for daily confidence.",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Rituals With Radiance",
    copy: "Elegant formulas for a clean, luminous self-care experience.",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1800&q=85",
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
      className="relative min-h-[92vh] overflow-hidden bg-maroon"
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
          <div className="absolute inset-0 bg-gradient-to-r from-maroon/80 via-maroon/42 to-transparent" />
        </div>
      ))}
      <div className="container-page relative flex min-h-[92vh] items-center pt-24">
        <div className="max-w-2xl text-white">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Rodina Naturals
          </p>
          <h1 className="text-5xl leading-tight text-white sm:text-6xl lg:text-7xl">
            {slides[active].title}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-white/85 sm:text-lg">
            {slides[active].copy}
          </p>
          <Link href="/shop" className="btn-primary mt-8 bg-white text-maroon hover:bg-gold">
            Shop Now
          </Link>
        </div>
      </div>
      <button
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 bg-white/90 p-3 text-maroon transition hover:bg-gold md:block"
        onClick={() => go(-1)}
        aria-label="Previous slide"
      >
        <ChevronLeft />
      </button>
      <button
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 bg-white/90 p-3 text-maroon transition hover:bg-gold md:block"
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
              "h-2.5 w-2.5 rounded-full border border-white transition",
              index === active ? "bg-gold" : "bg-white/40",
            )}
            onClick={() => setActive(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
