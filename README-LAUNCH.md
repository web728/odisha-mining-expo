# 5th Odisha Mining & Infrastructure International Expo 2027 — Website

Complete multi-page static site, ready to deploy. No build step, no dependencies, no backend required.

## Pages
| File | Purpose |
|---|---|
| index.html | Home — hero, countdown, event scale, focus areas, minerals, exhibitors, partners |
| about.html | About the show, India's mining industry, organiser (Futurex) |
| why-odisha.html | India's mineral powerhouse — reserves chart, state advantages |
| exhibit.html | Why exhibit, full exhibitor profiles, stand booking CTA |
| exhibitor-registration.html | Real on-site stand-booking enquiry form (mailto fallback, no backend) |
| visit.html | Why visit, full visitor profiles, free registration CTA |
| visitor-registration.html | Real on-site visitor registration form (mailto fallback, no backend) |
| venue.html | Venue & floor plan — indicative zones, map, how to reach, floor-plan request |
| gallery.html | Last edition glimpses with lightbox viewer (16 real event photos) |
| faq.html | FAQ with Google FAQ rich-result schema and live search |
| contact.html | Team contacts, Delhi HQ, map, contact form |
| 404.html | Branded error page (point your host's 404 rule here) |
| odisha-mining-expo-2027.ics | Add-to-calendar file linked from the homepage hero |
| sitemap.xml / robots.txt | SEO indexing files |

**Note:** this edition has no conference/conclave component — `conference.html` has been removed and every
reference to it (nav, footer, page copy, structured data) stripped from the site. See `CONTENT-AUDIT.md`.

## How to launch
1. Upload the entire folder to any web host (cPanel public_html, Netlify, Vercel, GitHub Pages, S3, etc.) — includes the `/img` folder.
2. Update canonical URLs in each page's `<head>` and in sitemap.xml if the domain differs from odishaminingexpo.com.
3. Submit sitemap.xml in Google Search Console.

## Notes for going live
- **Images/logos** are self-hosted in `/img` (47 files) — no third-party hotlinking, so the site keeps working even if odishaminingexpo.com changes.
- **Exhibitor & Visitor registration are now real on-site forms**, not redirects to the old WordPress site. Both validate inline, have a honeypot spam trap and a visible consent line, and use a mailto: fallback (no backend). To capture leads on-server instead, wire them to Formspree/WPForms/a CRM endpoint — see the HTML comment at the top of each form.
- **Contact form** works the same way, plus a WhatsApp quick-chat link as an instant alternative.
- **Nav dropdowns**: hovering/focusing "Exhibit" or "Visit" in the top nav reveals a submenu (Why Exhibit + Book Your Stand / Why Visit + Visitor Registration).
- Countdown targets 07 Jan 2027, 10:00 IST — edit in js/main.js if timings change.
- **Quick-contact number/WhatsApp** (+91 98108 55697, Namit Gupta) is hardcoded in the floating widget on every page — update in js/main.js if the primary contact changes.

## SEO built in
- Unique title + meta description per page, canonical tags, Open Graph + Twitter cards
- JSON-LD structured data: ExhibitionEvent (home), FAQPage (faq) + BreadcrumbList on all subpages
- Semantic HTML5, single H1 per page, descriptive alt text, lazy-loaded images
- sitemap.xml + robots.txt
- Mobile-responsive, keyboard-focus visible, prefers-reduced-motion respected

## Brand system (from the official 2027 brochure)
- Expo Yellow #F7B500 · Carbon Black #141517 · Paper #F7F6F3
- Display: Montserrat ExtraBold (italic for eyebrows, matching brochure headers)
- Signature motif: the "//" diagonal slashes and faceted yellow panels from the brochure

## Interactive features
- Live countdown, animated stat counters, mineral-reserve bars, scroll reveals
- Yellow scroll-progress bar, back-to-top button
- Gallery lightbox with prev/next arrows, arrow-key navigation, image counter, focus trap and focus-return (Esc to close)
- Exhibitor logo marquee + ticker strip (pause on hover, reduced-motion safe)
- FAQ accordion **with live search** that filters and auto-expands matching questions
- Live search/filter boxes on the Exhibit and Visit pages (~70 and 28 profile categories)
- Interactive venue zone tiles — click/tap any zone for a detail popover
- Floating quick-contact widget (Call / WhatsApp / Email / Add-to-Calendar) on every page
- Contact form with inline validation, honeypot spam trap, visible consent line, toast feedback and a WhatsApp quick-chat alternative
- Add-to-calendar (.ics), mobile hamburger navigation, skip-to-content link, aria-current nav state

## Production builds (minified)
`css/style.min.css` and `js/main.min.js` are pre-built alongside the readable sources (`style.css` / `main.js`).
The HTML currently references the **readable** versions — at this site's size (~35KB combined) the performance
difference is negligible, and unminified is far easier for a developer to debug in browser devtools.
To switch to the minified build for production, replace in every HTML file:
```
css/style.css  →  css/style.min.css
js/main.js     →  js/main.min.js
```
If you edit `style.css` or `main.js` later, regenerate the `.min` files with:
```
npx clean-css-cli -o css/style.min.css css/style.css
npx terser js/main.js --compress --mangle --output js/main.min.js
```

## Content sourcing & unresolved items
See `CONTENT-AUDIT.md` for the full brochure cross-check, unverified statistics flagged for
organiser confirmation, and the 2026-vs-2027 branding note.
