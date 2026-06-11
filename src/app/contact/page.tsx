import { MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { CONTACT_DETAILS, SOCIAL_LINKS } from "@/config/brand";

export default function ContactPage() {
  return (
    <div className="bg-cream pb-24 pt-32">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-5xl leading-tight sm:text-6xl">Visit Rodina Naturals</h1>
          <p className="mt-5 max-w-xl leading-8 text-ink/68">
            Step into our Nairobi boutique office for product support, order assistance, and personal recommendations.
          </p>
          <div className="mt-8 space-y-5 border-t border-maroon/10 pt-8 text-ink/75">
            <p className="flex gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
              {CONTACT_DETAILS.location}
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gold" />
              {CONTACT_DETAILS.phone}
            </p>
            <Link className="flex items-center gap-3 text-maroon" href={SOCIAL_LINKS.instagram}>
              <span className="grid h-5 w-5 place-items-center text-xs font-semibold text-gold">IG</span>
              @rodinanaturals
            </Link>
          </div>
        </div>
        <div className="overflow-hidden border border-maroon/10 bg-ivory p-4 shadow-[0_24px_80px_rgba(77,12,18,0.06)]">
          <iframe
            title="Rodina Naturals location"
            className="h-[430px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Kenafrica%20Business%20Park%20Ruaraka%20Nairobi&output=embed"
          />
        </div>
      </div>
    </div>
  );
}
