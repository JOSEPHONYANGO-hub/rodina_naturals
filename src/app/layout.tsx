import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rodina Naturals | Premium Skincare Boutique",
  description:
    "Luxury cosmetics and skincare products from Rodina Naturals in Nairobi.",
  icons: {
    icon: [
      { url: "/rodina-logo.jpeg", type: "image/jpeg" },
    ],
    shortcut: "/rodina-logo.jpeg",
    apple: [
      { url: "/rodina-logo.jpeg", type: "image/jpeg" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
