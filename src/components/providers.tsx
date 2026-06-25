"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { useCart } from "@/lib/cart-store";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Trigger Zustand persist rehydration from localStorage after first client render.
    // This prevents SSR/client hydration mismatches that can break React event handlers.
    void useCart.persist.rehydrate();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
