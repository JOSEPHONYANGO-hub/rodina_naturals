"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { useCart } from "@/lib/cart-store";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Rehydrate the Zustand cart store from localStorage after the client mounts.
    // This avoids SSR/client hydration mismatches that break add-to-cart.
    useCart.persist.rehydrate();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
