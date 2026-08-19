"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  fallback: string;
}

export function ImageGallery({ images, productName, fallback }: ImageGalleryProps) {
  const allImages = images.length ? images : [fallback];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  function openLightbox(index: number) {
    setLightboxIndex(index);
    setLightbox(true);
  }

  const closeLightbox = useCallback(() => setLightbox(false), []);

  const prev = useCallback(() =>
    setLightboxIndex((i) => (i - 1 + allImages.length) % allImages.length), [allImages.length]);

  const next = useCallback(() =>
    setLightboxIndex((i) => (i + 1) % allImages.length), [allImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox, prev, next]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  const thumbnails = allImages.slice(0, 4);

  return (
    <>
      {/* ── Gallery ── */}
      <div className="grid gap-3">
        {/* Primary image */}
        <button
          type="button"
          onClick={() => openLightbox(active)}
          aria-label="Enlarge image"
          className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-[22px] border border-maroon/10 bg-rose/35 shadow-[0_12px_40px_rgba(77,12,18,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon/40"
        >
          <Image
            src={allImages[active]}
            alt={productName}
            fill
            priority
            sizes="(min-width: 1024px) 340px, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          {/* Zoom hint overlay */}
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM11 8v6M8 11h6" />
            </svg>
            Click to zoom
          </span>
        </button>

        {/* Thumbnails */}
        {thumbnails.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {thumbnails.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative aspect-square overflow-hidden rounded-[12px] border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon/40 ${
                  active === i
                    ? "border-maroon shadow-[0_4px_16px_rgba(168,23,35,0.22)] scale-105"
                    : "border-maroon/10 bg-white opacity-70 hover:opacity-100 hover:border-maroon/30"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image zoom"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Image container — stop propagation so clicking image doesn't close */}
          <div
            className="relative flex max-h-screen max-w-5xl w-full items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[80vh] w-full max-w-3xl">
              <Image
                src={allImages[lightboxIndex]}
                alt={productName}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Prev / Next — only shown when multiple images exist */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
                  aria-label="Previous image"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
                  aria-label="Next image"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Counter */}
            {allImages.length > 1 && (
              <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
                {lightboxIndex + 1} / {allImages.length}
              </span>
            )}

            {/* Thumbnail strip inside lightbox */}
            {allImages.length > 1 && (
              <div className="absolute bottom-14 left-1/2 flex -translate-x-1/2 gap-2">
                {allImages.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setLightboxIndex(i)}
                    className={`relative h-12 w-12 overflow-hidden rounded-lg border-2 transition ${
                      lightboxIndex === i ? "border-white scale-110" : "border-white/30 opacity-60 hover:opacity-90"
                    }`}
                  >
                    <Image src={img} alt="" fill sizes="48px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
