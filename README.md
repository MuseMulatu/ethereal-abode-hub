# Luxe Haven

Build a high-performance, ultra-luxury digital furniture showroom and e-commerce frontend. The design language must strictly mirror global luxury brands like Restoration Hardware (RH), Minotti, BoConcept, and CB2. 

DESIGN SYSTEM & AESTHETIC:

- "Quiet Luxury" and editorial magazine style. Minimalist, monochromatic color palette (deep blacks, crisp whites, muted warm grays/creams).

- Typography: Use a sophisticated Serif for large headings (e.g., Playfair Display) and a highly legible Sans-Serif for body text and micro-copy (e.g., Inter). Use wide letter-spacing (tracking-widest) and uppercase for subheadings.

- Layout: Edge-to-edge, full-bleed high-resolution image placeholders, massive whitespace, and zero clutter. 

- Animations: Smooth, cinematic fade-ins and subtle parallax scrolling. No bouncy or cheap animations.

CORE ARCHITECTURE & ROUTING:

Please set up React Router with the following exact pages:

1. Home (Landing Page)

2. Kitchen & More

3. Kids

4. Soft Furnishings (Pillows, Puff Sofas)

5. Blog (Editorial Design Journal)

6. About Us

7. Contact Us

PAGE SPECIFICATIONS:

1. Home (Landing Page): 

- A cinematic, full-screen (h-screen) hero section with a high-quality background image overlay, a minimal elegant headline, and a "View Collection" CTA.

- A dedicated "New Arrivals" auto-scrolling or grid section featuring large product cards.

- A "Lifestyle" section that looks like an interior design magazine spread.

2. Product Category Pages (Kitchen, Kids, Soft Furnishings):

- Clean masonry grid for products.

- Product cards should only show the image, title, and a subtle "Inquire" button on hover. 

3. Blog Page:

- Editorial layout, mimicking an architecture or interior design magazine. Featured article at the top, followed by a clean grid of past articles.

4. Contact Us Page:

- A sophisticated layout including a placeholder for a Google Maps integration.

- Text blocks for: Opening Hours, Phone, WhatsApp, and Directions.

- A minimal contact form.

GLOBAL FUNCTIONALITY & INTEGRATIONS:

- Navigation: A sticky, transparent-to-solid sleek top navbar.

- VIP Concierge (WhatsApp): Instead of a standard chat bubble, integrate a highly styled, persistent "WhatsApp Concierge" floating button in the bottom right corner for immediate sales team contact.

- Footer: A massive, structured footer containing all site links, newsletter signup, and business details.

TECHNICAL REQUIREMENTS:

- Use Tailwind CSS for all styling.

- Create reusable components for ProductCards, SectionHeaders, and HeroBanners.

- Use mock data (JSON arrays) for the products and blog posts so the frontend is fully populated and ready to be connected to a Headless CMS later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f36db1f0-e36f-4279-88ef-81d25443736f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
