import { MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { CONTACT_DETAILS, SOCIAL_LINKS } from "@/config/brand";

export default function ContactPage() {
  return (
    <div className="bg-cream pb-20 pt-32">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Contact</p>
          <h1 className="mt-3 text-5xl">Visit Rodina Naturals</h1>
          <div className="mt-8 space-y-5 text-ink/75">
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
        <div className="soft-card overflow-hidden p-4">
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
