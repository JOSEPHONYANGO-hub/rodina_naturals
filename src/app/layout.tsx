import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

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
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <a
            href="https://wa.me/254793200000"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_24px_rgba(37,211,102,0.45)] transition hover:scale-110 hover:shadow-[0_6px_30px_rgba(37,211,102,0.6)]"
          >
            <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.347.637 4.637 1.84 6.64L2.667 29.333l6.88-1.8A13.253 13.253 0 0 0 16.003 29.333c7.363 0 13.33-5.97 13.33-13.333 0-7.363-5.967-13.333-13.33-13.333Zm7.787 18.48c-.32.9-1.88 1.72-2.587 1.787-.68.06-1.32.313-4.44-.92-3.76-1.48-6.173-5.307-6.36-5.553-.187-.247-1.52-2.027-1.52-3.867s.96-2.747 1.307-3.12c.347-.373.753-.467.987-.467.24 0 .48.003.693.013.22.013.52-.083.813.62.3.72 1.02 2.48 1.107 2.667.087.187.147.407.027.653-.12.24-.18.387-.36.6-.18.213-.377.473-.54.64-.18.18-.367.373-.16.733.207.36.92 1.52 1.973 2.46 1.36 1.213 2.507 1.587 2.867 1.773.36.187.567.16.78-.093.213-.253.907-1.053 1.147-1.413.24-.36.48-.3.807-.18.327.12 2.073.98 2.433 1.16.36.18.6.267.687.413.087.147.087.853-.233 1.753Z"/>
            </svg>
          </a>
        </Providers>
      </body>
    </html>
  );
}
