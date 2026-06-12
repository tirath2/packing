# Packaging Solution

Premium restaurant packaging landing page built with vinext, React and Tailwind CSS.

## Contact Flow

- WhatsApp links open a prefilled chat to `+91 7977045133`.
- The enquiry form submits via FormSubmit AJAX to `btirath2@gmail.com`.
- FormSubmit may ask the recipient email to confirm the first submission before forwarding live enquiries.

## SEO

- Set `NEXT_PUBLIC_SITE_URL` to the production domain before deploy so canonical links, `robots.txt`, `sitemap.xml`, Open Graph, and JSON-LD use the live URL.
- The site includes page metadata, social preview metadata, structured data for the business/services/FAQ, and generated sitemap/robots routes.

## Vercel

- Framework preset: `Next.js`
- Build command: `npm run build`
- Output directory: leave empty/default so Vercel uses `.next`
- Root directory: repository root

## Commands

```bash
npm install
npm run dev
npm run build
```
