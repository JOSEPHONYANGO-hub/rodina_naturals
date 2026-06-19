"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Sun Protection Collection",
    image: "/hero-banners/sun-protection-collection.png",
    href: "/shop?category=sunscreens",
  },
  {
    title: "Pink Aloe Vera Series",
    image: "/hero-banners/pink-aloe-vera-series.png",
    href: "/shop?q=pink%20aloe%20vera",
  },
  {
    title: "Beauty Deals Scrubs",
    image: "/hero-banners/beauty-deals-scrubs.png",
    href: "/shop?q=scrub",
  },
  {
    title: "Bioxcin Age Reversal",
    image: "/hero-banners/bioxcin-age-reversal.png",
    href: "/shop?brand=bioxcin",
  },
  {
    title: "Bioxcin Hair Grow and Repair",
    image: "/hero-banners/bioxcin-hair-grow-repair.png",
    href: "/shop?category=hair-care",
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
      className="bg-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[2/1] w-full overflow-hidden bg-brandPurple shadow-[0_12px_36px_rgba(36,22,23,0.1)]">
        {slides.map((slide, index) => (
          <Link
            key={slide.title}
            href={slide.href}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              index === active ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-label={slide.title}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="h-full w-full object-cover"
            />
          </Link>
        ))}

        <button
          className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brandPurple shadow transition hover:bg-white md:grid"
          onClick={() => go(-1)}
          aria-label="Previous slide"
          type="button"
        >
          <ChevronLeft />
        </button>
        <button
          className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brandPurple shadow transition hover:bg-white md:grid"
          onClick={() => go(1)}
          aria-label="Next slide"
          type="button"
        >
          <ChevronRight />
        </button>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              className={cn(
                "h-2.5 w-8 rounded-full border border-white/80 shadow transition",
                index === active ? "bg-white" : "bg-white/35 hover:bg-white/65",
              )}
              onClick={() => setActive(index)}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
