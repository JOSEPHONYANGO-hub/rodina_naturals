"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Reveal Your Natural Glow",
    copy: "Elevated skincare and beauty rituals selected for radiant everyday confidence.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Beauty, Softly Considered",
    copy: "A refined edit of hair, skin, and body essentials with a boutique Nairobi touch.",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Rituals With Radiance",
    copy: "Polished formulas and sensorial textures for a luminous self-care experience.",
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
      className="relative min-h-[94vh] overflow-hidden bg-maroon"
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
          <div className="absolute inset-0 bg-gradient-to-r from-maroon/82 via-maroon/42 to-maroon/5" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream to-transparent" />
        </div>
      ))}
      <div className="container-page relative flex min-h-[94vh] items-center pt-24">
        <div className="max-w-[720px] text-white">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.38em] text-gold">
            Rodina Naturals
          </p>
          <h1 className="max-w-3xl text-5xl leading-[0.98] text-white sm:text-7xl lg:text-8xl">
            {slides[active].title}
          </h1>
          <p className="mt-7 max-w-xl text-base font-light leading-8 text-white/86 sm:text-lg">
            {slides[active].copy}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="btn-primary bg-white text-maroon hover:bg-gold">
            Shop Now
            </Link>
            <Link href="/shop?category=thalia" className="btn-secondary border-white/50 text-white hover:border-gold hover:bg-white/10 hover:text-white">
              Explore Rituals
            </Link>
          </div>
        </div>
      </div>
      <button
        className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center border border-white/30 bg-white/10 text-white backdrop-blur transition hover:border-gold hover:bg-white/20 md:grid"
        onClick={() => go(-1)}
        aria-label="Previous slide"
      >
        <ChevronLeft />
      </button>
      <button
        className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center border border-white/30 bg-white/10 text-white backdrop-blur transition hover:border-gold hover:bg-white/20 md:grid"
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
              "h-2 w-8 border border-white/70 transition",
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
