import { Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useState } from "react";

import { brand } from "@/data/site";

type FooterLink =
  { to: string; label: string; href?: never } | { href: string; label: string; to?: never };

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

const columns: FooterColumn[] = [
  {
    heading: "Collections",
    links: [
      { to: "/soft-furnishings", label: "Sofas & Armchairs" },
      { to: "/kitchen", label: "Dining & Tables" },
      { to: "/kids", label: "Bedroom & Living" },
    ],
  },
  {
    heading: "Maison",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/blog", label: "Design Journal" },
      { href: "/anteniguss-look-book-2026.pdf", label: "2026 Look Book (PDF)" },
      { to: "/contact", label: "Showroom Visit" },
    ],
  },
  {
    heading: "Client Care",
    links: [
      { to: "/contact", label: "Contact Us" },
      { to: "/contact", label: "Find Support" },
      { to: "/contact", label: "Delivery & Setup" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-[110rem] px-6 pt-24 pb-12 sm:px-10 lg:px-16 lg:pt-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="display text-2xl tracking-[0.32em] uppercase">{brand.name}</p>
            <p className="mt-8 max-w-sm text-sm leading-relaxed opacity-65">
              Furniture for the modern Ethiopian home. Sofas, armchairs, dining sets and beds, made
              in Addis Ababa in the size and fabric you choose.
            </p>

            <div className="mt-8">
              <a
                href="/anteniguss-look-book-2026.pdf"
                download="Anteniguss-Look-Book-2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow inline-flex items-center gap-2 border border-ink-foreground/35 px-6 py-3.5 text-ink-foreground transition-colors hover:border-ink-foreground hover:bg-ink-foreground hover:text-ink"
              >
                <Download className="h-4 w-4" />
                Download 2026 Look Book
              </a>
            </div>

            <form
              className="mt-12 max-w-sm"
              onSubmit={(e) => {
                e.preventDefault();
                setJoined(true);
                setEmail("");
              }}
            >
              <span className="eyebrow opacity-60">Private Newsletter</span>
              <div className="mt-5 flex items-center border-b border-ink-foreground/25 pb-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-transparent text-sm tracking-wide placeholder:text-ink-foreground/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="eyebrow shrink-0 pl-4 opacity-70 hover:opacity-100"
                >
                  Join
                </button>
              </div>
              <p className="mt-4 text-xs tracking-wide opacity-50">
                {joined
                  ? "Thank you — a welcome note is on its way."
                  : "Collection previews and private viewings. No noise."}
              </p>
            </form>
          </div>

          {columns.map((col) => (
            <div key={col.heading} className="lg:col-span-2">
              <h3 className="eyebrow opacity-60">{col.heading}</h3>
              <ul className="mt-7 space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a
                        href={link.href}
                        download="Anteniguss-Look-Book-2026.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-quiet text-sm tracking-wide opacity-75 hover:opacity-100"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="link-quiet text-sm tracking-wide opacity-75 hover:opacity-100"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-3">
            <h3 className="eyebrow opacity-60">Showroom</h3>
            <address className="mt-7 space-y-4 text-sm leading-relaxed not-italic opacity-75">
              <p>{brand.address}</p>
              <p>
                Mon – Sat, 10:00 – 20:00
                <br />
                Sunday by appointment
              </p>
              <p>
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="link-quiet block">
                  {brand.phone}
                </a>
                <a href={`mailto:${brand.email}`} className="link-quiet mt-2 block">
                  {brand.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-4 border-t border-ink-foreground/12 pt-8 text-xs tracking-[0.16em] uppercase opacity-45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p>Addis-Ababa, ET</p>
        </div>
      </div>
    </footer>
  );
}
