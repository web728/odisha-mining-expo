# Content & Launch-Readiness Audit — 5th Odisha Mining & Infrastructure International Expo

Audited against: **`Open Editable File Odisha Brochure_2.pdf`** (12-page brochure you supplied, downloaded to your
Downloads folder on 2026-07-13). Where a claim could not be matched to that brochure or to a file already in this
repo, it is listed under "Unresolved" rather than silently changed or deleted.

## 1. Files changed this pass

| File | Change |
|---|---|
| `exhibit.html` | Removed fabricated "27,846+ industry professionals" stat; added 2 brochure-verified "Why Exhibit" pillars (Build Strategic Partnerships, Access); added 2 missing exhibitor categories (Jointing Products/Landscaping, Trade Associations); de-hardcoded search placeholder |
| `contact.html` | Removed unverified contact "Ms. Khushboo"; added visible consent line; added honeypot field; added no-backend code comment; adjusted team grid to 2 columns |
| `conference.html` | Replaced generic stock photo with a real inaugural lamp-lighting photo |
| `gallery.html` | Added 10 real event photos as glimpses 7–16 (section 6) |
| `js/main.js` | Honeypot check in submit handler; lightbox focus trap, auto-focus on open, focus-return to trigger on close |
| `css/style.css` | Honeypot visually-hidden style |
| `*.html` (all 11 pages) | Added `width`/`height` to every `<img>` missing them (prevents layout shift) |
| `img/expo-*.jpg` (10 new files) | Resized/compressed from supplied photos — originals were 6–13MB each, all now under 250KB (section 6) |
| `css/style.min.css`, `js/main.min.js` | New minified production builds (HTML still points at readable sources — see README-LAUNCH.md) |
| `odisha-mining-expo-website-DEV-PACKAGE.zip` | New — clean handoff zip (section 7) |
| `README-LAUNCH.md` | Documented minified builds and pointed here for content sourcing |

No page was rebuilt and no design-system change was made — every edit above is a targeted content/behaviour fix.

## 2. Content-correction report (brochure cross-check)

**Confirmed accurate, no change needed:**
- Event name, "07–10 January 2027", Baramunda Exhibition Ground, Bhubaneswar, Odisha — consistent everywhere
- Event scale: 200+ exhibitors, 20,000+ visitors, 10+ countries, 3,000+ products — matches brochure page 5 exactly
- 6 focus areas, all exhibitor/visitor profile categories (after the 4 additions above), organiser details, partner names — match brochure
- Namit Gupta / Soumo Roy names, numbers, emails — match brochure page 12 exactly
- `.ics` calendar file already correct: 07 Jan 2027 10:00 IST → 10 Jan 2027 18:00 IST, Baramunda Exhibition Ground, Bhubaneswar, Odisha (verified, not changed)
- "India's premier platform for..." and "world's next mining power house" — both are verbatim brochure copy, not fabricated marketing language

**Fixed (were wrong/unverified):**
- ❌ "27,846+ industry professionals" (exhibit.html) — not in brochure, not in any source I have → removed
- ❌ "Ms. Khushboo" contact — not listed in brochure's approved contacts → removed

**The 2026-vs-2027 branding conflict — resolved, documented, not silently guessed:**
Your brochure PDF is internally inconsistent: the **cover image** reads "5TH ODISHA...INTERNATIONAL EXPO 2026" while
the same page's dates say "07-10 JANUARY 2027", and page 5's body *text* says "OMIIE 2026" while page 4's badge
graphic says "...EXPO **2027**". I checked the actual logo file already live on the official site
(`5th-Odisha-Logo_White.png`, which this site uses) — **it reads "INTERNATIONAL EXPO 2027"**, matching the dates.
So: the website's logo asset and all its text are self-consistent at "2027" already; nothing needed changing there.
The inconsistency lives in the brochure file itself. **Action needed from you:** confirm with whoever designed that
brochure PDF whether its cover graphic and the "OMIIE 2026" sentence on page 5 should be updated to 2027, since they
currently contradict the brochure's own dates.

## 3. Unresolved — needs your confirmation

These are pre-existing on the site (not introduced by me) and not confirmed by the brochure. I did **not** delete
them since they may be true and approved from another source — flagging per your instruction not to guess:

1. ~~"India's largest stainless-steel producer..." / mineral reserve percentages / "India's largest mining
   exhibition"~~ — **RESOLVED.** You supplied corrected copy for this section; index.html and why-odisha.html now
   both show "Odisha's Share of India's Identified Mineral Resources" with Chromite 96%, Nickel Ore 93%, Bauxite
   41%, Haematite Iron Ore 39%, Manganese Ore 34%, Coal 25%, Monazite 24%, plus your new lead-in and footer copy.
   Verified rendering correctly on both pages, all widths, no console errors.
2. **4 Conference themes** (Policy & Investment / Innovation & Technology / Sustainability & Green Mining / Future
   Practices & Skills) and **"Hon'ble Governor of Odisha as chief guest"** (conference.html) — not in the brochure.
   The page links to `odishamic.com` as the source; if that's where these came from, confirm and I can cite it.
3. **X/Twitter social link** (`x.com/odisaminingexpo`) in every footer — brochure only shows Facebook/Instagram/
   LinkedIn icons. Confirm the X account is real and active, or remove the link.
4. **Conclave-specific dates (08–09 Jan) and start time (10:00 IST)** — not stated in the brochure (which only gives
   the main 07–10 Jan expo dates). Not contradicted either; just unconfirmed by this source.
5. **3 of the 5 photos you pasted directly into chat couldn't be used.** I can only *view* pasted images, not
   extract their bytes — I need an actual file path. 2 of the 5 happened to also land in your Downloads folder
   (as `_DSC1518.JPG` and a WhatsApp image) so those were recoverable and are now on the site. The other 3 exist
   only as images rendered in the chat transcript; if you still want them used, save them to a folder and tell me
   the path. Separately (see section 6), I found a `/images` folder already inside the project with 8 more
   full-resolution event photos and used all of those too.

## 4. On the animation-library request (Framer Motion / HyperFrames / Remotion)

This site is plain HTML/CSS/vanilla JS — no React, no build step. Framer Motion is a **React** library and Remotion/
HyperFrames render **video files**; none of them can attach to static HTML without introducing React and a bundler,
which is a rebuild — and you asked me not to rebuild or change the design system. What I did instead, in the same
vanilla-JS spirit already used across the site: kept all existing scroll-reveals, hover/press feedback, and eased
transitions (already tuned to 150–300ms with easing, already respecting `prefers-reduced-motion`). If you do want
true spring-physics/Framer-Motion-grade motion, that's a legitimate next step but it means migrating the site to
React — happy to scope that separately if you want it.

## 5. Test results (this session, live local server)

| Feature | Result |
|---|---|
| All 11 pages load (200 OK) | ✅ |
| All image references resolve (200 OK), including all 10 new photos | ✅ |
| No console errors on any page tested | ✅ |
| Exhibitor search filters 69 categories correctly | ✅ verified via DOM inspection |
| Visitor search filters 28 categories correctly | ✅ verified via DOM inspection |
| FAQ search filters + auto-expands matches | ✅ verified via DOM inspection |
| Gallery lightbox: open/prev/next/counter across all 16 images | ✅ verified via DOM inspection |
| Gallery lightbox: focus trap, auto-focus on open, focus-return on close | ✅ verified via DOM inspection |
| Venue zone click → popover with correct content | ✅ verified via DOM inspection |
| Contact form: empty-submit validation + toast | ✅ verified via DOM inspection |
| Contact form: honeypot silently blocks bot-like submission | ✅ verified via DOM inspection |
| "Khushboo" fully removed from site | ✅ confirmed via grep, 0 matches |
| No duplicate element IDs across any page | ✅ confirmed via grep |
| All `target="_blank"` links carry `rel="noopener"` | ✅ confirmed via grep |
| No horizontal overflow at 375px / 768px / 1024px | ✅ confirmed (`scrollWidth` ≤ viewport at all three) |
| Mobile hamburger nav opens/closes | ✅ verified via DOM inspection |
| Minified `style.min.css` / `main.min.js` build and serve correctly | ✅ |

*Note on method:* the browser tool's screenshot/click-by-pixel actions were unreliable this session (timed out
repeatedly / occasionally missed elements) — all checks above were done via direct DOM/JS inspection of the live
local server instead, which is more precise for functional testing than a screenshot would have been anyway.
I have **not** produced a visual screenshot for you this session; if you want one, ask and I'll retry.

## 6. Photos used (sourcing detail)

10 real event photos are now live (gallery.html glimpses 7–16, one of which is reused on conference.html), all
resized to max 1400px wide and compressed to JPEG q78 (originals were 6–13MB each; all now 150–250KB):

| Site file | Source | Used on |
|---|---|---|
| `expo-inaugural-lamp-lighting-2026.jpg` | Your Downloads: `_DSC1518.JPG` | conference.html hero + gallery |
| `expo-entrance-thank-you-arch.jpg` | Your Downloads: WhatsApp image | gallery |
| `expo-show-floor-avenue.jpg` | Project `/images/AV008407.JPG` | gallery |
| `expo-machinery-booth-1.jpg` | Project `/images/AV008404.JPG` | gallery |
| `expo-machinery-booth-2.jpg` | Project `/images/AV008405.JPG` | gallery |
| `expo-caterpillar-booth.jpg` | Project `/images/AV008477.JPG` | gallery |
| `expo-concrete-tunneling-booth.jpg` | Project `/images/AV008431.JPG` | gallery |
| `expo-institute-booth.jpg` | Project `/images/AV008427.JPG` | gallery |
| `expo-steel-wire-booth.jpg` | Project `/images/AV008490.JPG` | gallery |
| `expo-mr-engineers-group.jpg` | Project `/images/AV008590.JPG` | gallery |

All show exhibitor booths, show-floor crowds, or an inaugural ceremony — no expo-organiser branding conflicts,
only third-party exhibitor logos (Caterpillar, Schwing Stetter, XCMG, Everest, MR Engineers, etc.), which is normal
and expected in an expo's own recap gallery. The original full-resolution files are untouched in `/images/` —
I only read and compressed copies into `/img/`, I didn't move or delete your originals.

## 7. Developer package

`odisha-mining-expo-website-DEV-PACKAGE.zip` (3.64MB, one level up from the site folder, at
`D:\odisha-mining-expo-website-DEV-PACKAGE.zip`) contains the entire site minus the raw `/images` source folder
(55MB of unprocessed originals — kept on your disk, just not worth shipping to a developer since every one of them
is already processed into `/img`) and minus `.claude/` (this session's local preview config, irrelevant to a
developer). Everything a developer needs — HTML, CSS, JS, minified builds, `/img`, sitemap/robots, the `.ics` file,
this audit, and the launch README — is in the zip.

## 8. Launch checklist

**✅ Ready:**
- All content matches the brochure except the 7 flagged items in section 3
- Contact details correct and consistent (Namit, Soumo, info@futurextrade.com, no unverified names)
- Add-to-calendar file already correct
- Images self-hosted, sized, lazy-loaded, no layout-shift risk
- Accessibility: skip link, landmarks, aria-current, alt text, focus-visible, lightbox focus trap, reduced-motion
- Form: inline validation, consent line, honeypot, no fake "submitted to server" messaging
- SEO: unique titles/descriptions, canonicals, OG/Twitter cards, Event structured data, robots.txt, sitemap.xml, favicon + apple-touch-icon all present and verified
- No broken links/images, no console errors, no duplicate IDs, no horizontal overflow at any tested width
- Minified CSS/JS builds ready for production if you want them
- Developer handoff zip built and verified

**⚠️ Needs your confirmation before/at launch:**
- Items 1–5 in section 3 (conference themes, Governor mention, X link, conclave-specific times, remaining 3 chat-only photos) and the brochure's own 2026/2027 inconsistency (section 2)
- Whether you want the site to actually reference `.min.css`/`.min.js` in production (currently references readable sources — see README-LAUNCH.md)
