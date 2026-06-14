"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "The future of skincare",
    image: "/hero-banner-3.jpg",
    href: "/shop?category=thalia",
  },
  {
    title: "Beauty products seasonal sale",
    image: "/hero-banner-1.jpg",
    href: "/shop?max=2000",
  },
  {
    title: "Special offer new product",
    image: "/hero-banner-2.jpg",
    href: "/shop",
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
      className="bg-cream py-2 sm:py-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-page">
        <div className="relative mx-auto aspect-[2/1] w-full max-w-[min(100%,calc((100vh-460px)*2),860px)] overflow-hidden bg-brandPurple shadow-[0_14px_42px_rgba(36,22,23,0.1)] max-lg:max-w-[min(100%,calc((100vh-440px)*2),760px)] max-sm:max-w-full">
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
                sizes="(min-width: 1440px) 1440px, 100vw"
                className="object-cover"
              />
            </Link>
          ))}

          <button
            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brandPurple shadow transition hover:bg-white md:grid"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            type="button"
          >
            <ChevronLeft />
          </button>
          <button
            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brandPurple shadow transition hover:bg-white md:grid"
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
      </div>
    </section>
  );
}
