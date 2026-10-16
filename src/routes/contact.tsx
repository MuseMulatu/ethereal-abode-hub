import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { brand } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Anteniguss Home Showroom, Addis Ababa" },
      {
        name: "description",
        content:
          "Visit the Anteniguss Home showroom at Abkem Tower, Meskel Flower, Addis Ababa. Opening hours, phone, WhatsApp concierge, and showroom directions.",
      },
      { property: "og:title", content: "Contact Us — Anteniguss Home Showroom, Addis Ababa" },
      {
        property: "og:description",
        content: "Opening hours, directions and WhatsApp concierge for our Addis Ababa showroom.",
      },
    ],
  }),
  component: Contact,
});

const details = [
  {
    heading: "Opening Hours",
    lines: [
      "Monday – Thursday, 10:00 – 20:00",
      "Friday – Saturday, 10:00 – 22:00",
      "Sunday by private appointment",
    ],
  },
  {
    heading: "Directions",
    lines: [
      brand.address,
      "Meskel Flower, adjacent to Dreamliner Hotel",
      "Secure basement parking available; Abkem Tower is the building on the right when entering Meskel Flower from Bole Road.",
    ],
  },
];

function Contact() {
  const [sent, setSent] = useState(false);
  const whatsappHref = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
    `Hello ${brand.name} — I would like to arrange a showroom visit.`,
  )}`;

  return (
    <>
      <section className="mx-auto max-w-[110rem] px-6 pt-40 pb-16 sm:px-10 lg:px-16 lg:pt-52">
        <Reveal>
          <span className="eyebrow text-muted-foreground">Client Care</span>
          <h1 className="display mt-8 max-w-4xl text-5xl sm:text-6xl lg:text-8xl">Contact Us</h1>
          <p className="mt-10 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Speak with the concierge, or simply arrive — the showroom is open seven days and there
            is always a designer on the floor.
          </p>
        </Reveal>
      </section>

      {/* Map */}
      <section className="mx-auto max-w-[110rem] px-6 pb-24 sm:px-10 lg:px-16">
        <Reveal>
          <div className="aspect-[16/9] w-full overflow-hidden bg-stone lg:aspect-[21/9]">
            {/* <iframe
              title="Ante Design showroom location"
              src="https://www.google.com/maps?q=Alserkal%20Avenue%20Al%20Quoz%20Addis-Ababa&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0 grayscale-[95%] contrast-[1.05]"
            /> */}
            <iframe
              title="Ante Design showroom location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.6133037286377!2d38.761009!3d8.998492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85ab1b8bdfcd%3A0x6b777a8b30d32f!2sABKEM%20Tower!5e0!3m2!1sen!2set!4v1700000000000!5m2!1sen!2set"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0 grayscale-[95%] contrast-[1.05]" // This Tailwind class makes the map match the luxury monochromatic vibe
            ></iframe>
          </div>
        </Reveal>
      </section>

      {/* Details + form */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-[110rem] gap-20 px-6 py-24 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-16 lg:py-32">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="space-y-14">
                <div>
                  <h2 className="eyebrow text-muted-foreground">Telephone</h2>
                  <a
                    href={`tel:${brand.phone.replace(/\s/g, "")}`}
                    className="display link-quiet mt-5 block text-3xl"
                  >
                    {brand.phone}
                  </a>
                  <a
                    href={`mailto:${brand.email}`}
                    className="link-quiet mt-4 inline-block text-sm tracking-wide text-muted-foreground"
                  >
                    {brand.email}
                  </a>
                </div>

                <div>
                  <h2 className="eyebrow text-muted-foreground">WhatsApp Concierge</h2>
                  <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Direct line to the sales team for stock checks, fabric photographs and lead
                    times. Answered within minutes during showroom hours.
                  </p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="eyebrow mt-7 inline-block border border-foreground px-8 py-4 transition-colors duration-700 hover:bg-ink hover:text-ink-foreground"
                  >
                    Message the Concierge
                  </a>
                </div>

                {details.map((d) => (
                  <div key={d.heading}>
                    <h2 className="eyebrow text-muted-foreground">{d.heading}</h2>
                    <ul className="mt-5 space-y-2 text-sm leading-relaxed text-muted-foreground">
                      {d.lines.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={120}>
              <SectionHeader eyebrow="Enquiries" title="Write to us" />
              <form
                className="mt-14 space-y-10"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <Field label="Full name" name="name" />
                <Field label="Email" name="email" type="email" />
                <Field label="Telephone" name="phone" type="tel" required={false} />
                <div>
                  <label htmlFor="message" className="eyebrow block text-muted-foreground">
                    Your project
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="mt-4 w-full resize-none border-b border-input bg-transparent pb-3 text-sm tracking-wide focus:border-foreground focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="eyebrow border border-foreground px-10 py-5 transition-colors duration-700 hover:bg-ink hover:text-ink-foreground"
                >
                  Send Enquiry
                </button>
                {sent ? (
                  <p className="text-sm tracking-wide text-muted-foreground">
                    Thank you — the concierge will reply within one working day.
                  </p>
                ) : null}
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow block text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-4 w-full border-b border-input bg-transparent pb-3 text-sm tracking-wide focus:border-foreground focus:outline-none"
      />
    </div>
  );
}
