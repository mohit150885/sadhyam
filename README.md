# SadhyamIAS — website + admin panel

Next.js 16 (App Router) · Tailwind CSS 4 · Firebase (Auth, Firestore, Storage)

> **Upgrading an existing folder?** If you unzipped this over your old project, run
> `node cleanup-old-files.js` once. It removes the old pages (`app/courses`, `app/login`, …) that
> clash with the new `app/(site)/…` pages and cause "two parallel pages resolve to the same path".

```bash
npm install
cp .env.example .env.local   # fill in the values (see "Admin setup")
npm run dev                  # http://localhost:3000   admin: http://localhost:3000/admin
```

---

## How content flows

```
Admin panel  ──PUT /api/admin/content/<page>──▶  Firestore  site_content/<page>  ──onSnapshot──▶  every open page
(Website Settings, Courses, Banners …)          (server, Admin SDK)                              updates instantly
```

* Every page reads its own document live: `site_content/home`, `about`, `courses`, `testSeries`,
  `studyMaterial`, `faculty`, `results`, `courseDetails`, `testSeriesDetails`, `studyMaterialDetails`,
  `facultyDetails`, `cart`, `contact`, `help`, `faqs`, `legal`, and `global` (header, footer, contact,
  SEO, theme, UPI payment details).
* Anything missing in Firestore falls back to the defaults in `app/lib/siteContent.ts`, so the site
  never breaks. **Website Settings → Theme & Typography → Import missing pages** copies those defaults
  into Firestore.
* The catalog has a single source. Courses live in `site_content/courses.items`, test series in
  `testSeries.items`, material in `studyMaterial.items`, faculty in `faculty.items`, toppers in
  `results.toppers` and testimonials in `home.testimonials.items`. The home page, list pages, detail
  pages, search and cart all read from those. Mark an item **Featured** to show it first on the home page.

## Images

Every image field in the admin has **Upload** and **Media library** buttons. When you upload:

1. The browser resizes the image (max 1920px) and converts it to WebP under about 650 KB.
2. The server stores it in **Firebase Storage** (`site/<folder>/…`) and returns a public URL. It
   checks both `<project>.firebasestorage.app` and `<project>.appspot.com`, whichever exists.
   If Storage isn't enabled (it needs the Blaze plan on new projects), the file — image **or PDF,
   up to 10 MB** — is split into ~900 KB chunks in the Firestore collection **`site_media`** and
   served from `/api/media/<id>`. (On Vercel, single uploads are limited to 4.5 MB.)
3. That URL goes into the field. Press **Save & Publish** and the URL is written to `site_content`,
   so every visitor sees the new image right away.

All uploads are listed in **Banners & Media → Media library** (the `media_library` collection).
**Banners & Media → Page banners** lets you change the hero carousel on each page in one place.

## Typography

The home page type scale is the default on every page. It's defined once as CSS variables in
`app/globals.css` (`--fs-hero-title`, `--fs-card-title`, …) and used through `t-*` classes
(`t-hero-title`, `t-section-title`, `t-card-title`, `t-price` …). You can override any size, the
brand colour, the navy colour and the font in **Website Settings → Theme & Typography**.

| Element | Mobile / Desktop |
|---|---|
| Logo | 26 / 28 px |
| Nav links & buttons | 15 px |
| Hero title | 36 / 48 (tablet) / 60 px |
| Hero badge · features · description · exam tabs | 12/13 · 13/15 · 15/17 · 12/13 px |
| Stat numbers · labels | 24/28 · 14/15 px |
| Section titles · descriptions | 28/36 · 15/16 px |
| Card title · text · badge · meta | 16 · 13 · 11 · 13 px |
| Price · old price · discount | 22 · 14 · 12 px |
| Faculty name · subject · experience | 16 · 13 · 11 px |
| Rank · name · exam | 18 · 14 · 12 px |
| Quote · author · role | 14 · 15 · 12 px |
| CTA title · description · tagline | 32/40 · 15/16 · 32 px |
| Footer titles · links · app-store subtext | 16 · 14 · 9 px |

---

## Admin setup (required once)

1. **Service account:** Firebase console → Project settings → Service accounts →
   *Generate new private key*. Paste the whole JSON **on one line** into `.env.local`:
   ```
   FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"…","private_key":"-----BEGIN PRIVATE KEY-----\n…","client_email":"…"}'
   ```
   On Vercel, add the same value as an environment variable.
2. **Session secret:** set `ADMIN_SESSION_SECRET` to a random string of at least 32 characters.
   You can make one with `openssl rand -base64 48`.
3. **Security rules:** deploy the included rules, using the Firebase CLI or by pasting them into the console:
   ```bash
   npm i -g firebase-tools && firebase login
   firebase use <project-id>
   firebase deploy --only firestore:rules,storage
   ```
4. **Authentication:** enable *Email/Password* and *Google* sign-in in Firebase Authentication,
   and add your domain under *Authorized domains*.
5. Sign in at **/admin/login** with `ADMIN_LOGIN_ID` / `ADMIN_LOGIN_PASSWORD`. The dashboard
   shows a setup checklist until everything is connected.

### Admin roles
* **Owner** (from `.env`): everything, including Users & Admins.
* **Admin**: everything except managing admin accounts.
* **Editor**: website content, catalog, banners, reviews and notifications.

## Orders and payments

There's no payment gateway yet. Checkout (`/api/checkout`) recalculates prices and coupons on the
server and creates a **pending** order. The student then sees your UPI ID and QR code (set them in
Website Settings → General → Payment) and enters their transaction ID. In **Orders & Payments**,
click **Confirm payment** and the items appear in the student's *My Courses* / *My Test Series*.
You can also enrol a student by hand from **Students** (for cash or bank transfer).

For each course, test or material you can set a private **access link** in the admin, for example a
class link, playlist, Drive folder or test portal. Only students who have paid can see it.

## Firestore collections

**You don't need to create anything in the Firebase console.** Firestore creates a collection and its
fields automatically the first time something is written. The first time you open the admin panel,
every missing `site_content/<page>` document is also created with the default content.

| Collection | Written by | Purpose |
|---|---|---|
| `site_content` | admin (server) | all page content and the catalog |
| `site_media`, `media_library` | admin (server) | uploaded images (fallback storage) and the upload index |
| `users` | student | profiles (admin can block) |
| `orders` | server | purchases |
| `coupons` | admin | discount codes |
| `reviews` | student → admin approves | product and faculty reviews |
| `notifications` | admin | header bell notifications |
| `support_queries` | contact form → admin | support inbox |
| `private_content` | admin | access links for paid students |
| `admins` | owner | extra admin accounts (scrypt-hashed passwords) |

## Project structure

```
app/
  (site)/…            public pages (share one Navbar + Footer via (site)/layout.tsx)
  admin/login         admin sign-in
  admin/(panel)/…     admin pages (server-side session check in layout.tsx)
  api/…               checkout, coupon, media, admin APIs
  components/site     Navbar, Footer, Hero, cards, catalog, detail blocks, UI primitives
  components/views    page bodies
  components/admin    admin shell, schema-driven forms, editors
  lib/siteContent.ts  default content for every page
  hooks/useContent.ts live Firestore content hooks
```
