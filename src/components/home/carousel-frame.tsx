"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useRef } from "react";

type CarouselFrameProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
};

export function CarouselFrame({ ariaLabel, children, className = "" }: CarouselFrameProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    const element = scrollRef.current;
    if (!element) return;

    element.scrollBy({
      left: direction === "left" ? -element.clientWidth * 0.85 : element.clientWidth * 0.85,
      behavior: "smooth",
    });
  }

  return (
    <div className="group/carousel relative">
      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-[#a81723] opacity-0 shadow-[0_14px_35px_rgba(34,34,34,0.18)] transition duration-300 hover:bg-[#F5E6D3] focus:opacity-100 group-hover/carousel:opacity-100"
        aria-label={`Previous ${ariaLabel}`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div
        ref={scrollRef}
        className={`flex snap-x overflow-x-auto [scrollbar-width:thin] ${className}`}
        aria-label={ariaLabel}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-[#a81723] opacity-0 shadow-[0_14px_35px_rgba(34,34,34,0.18)] transition duration-300 hover:bg-[#F5E6D3] focus:opacity-100 group-hover/carousel:opacity-100"
        aria-label={`Next ${ariaLabel}`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
