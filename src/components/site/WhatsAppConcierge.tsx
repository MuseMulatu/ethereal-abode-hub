import { brand } from "@/data/site";

export function WhatsAppConcierge() {
  const href = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
    `Hello ${brand.name} — I would like to speak with the VIP concierge.`,
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact the VIP WhatsApp concierge"
      className="group fixed right-5 bottom-5 z-50 flex items-center gap-0 overflow-hidden border border-ink-foreground/15 bg-ink py-4 pr-4 pl-4 text-ink-foreground shadow-[0_18px_45px_-18px_oklch(0.16_0.004_60_/_0.6)] transition-all duration-700 ease-cinematic hover:pr-6 sm:right-8 sm:bottom-8"
    >
      <span className="relative flex size-5 shrink-0 items-center justify-center">
        <span className="absolute inline-flex size-2 rounded-full bg-concierge opacity-60 animate-pulse" />
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.02c-1.5 0-2.97-.4-4.26-1.16l-.31-.18-3.12.82.83-3.05-.2-.32a8.06 8.06 0 0 1-1.24-4.32c0-4.47 3.64-8.1 8.11-8.1 4.47 0 8.1 3.63 8.1 8.1 0 4.47-3.63 8.11-8.1 8.11Zm4.45-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.47-.4-.4-.55-.41h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.7 4.12 3.68 2.42.98 2.42.65 2.86.61.44-.04 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      </span>
      <span className="eyebrow max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-700 ease-cinematic group-hover:max-w-[13rem] group-hover:pl-4 group-hover:opacity-100">
        VIP Concierge
      </span>
    </a>
  );
}
