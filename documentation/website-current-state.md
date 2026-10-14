# Valterix Home — current state of the website

This document describes the Valterix Home furniture website as it exists in the `valterix-furniture` project on 12 October 2026. It is a record of the source, the catalogue, and the behaviour a visitor actually gets. It is not a roadmap.

The site is a static catalogue and enquiry front for made-to-order beds and household furniture. It shows prices in Sri Lankan rupees, lets a visitor configure a piece, and stores an order request in the browser. It does not take payment, does not create an account, and does not send the request to a server.

---

## 1. What the site is

Valterix Home is the household catalogue of Valterix Assets (Pvt) Ltd. The copy on the site is explicit about three boundaries:

- Prices on the site are catalogue figures. A specialist confirms availability, lead time, and the final price before anything is made.
- The cart is an enquiry cart. Submitting it is a request, not a paid order, and production does not start from the website.
- Valterix Home is a retail catalogue. The footer states that it is not an investment product.

The public identity used in the interface:

| Item | Value |
| --- | --- |
| Wordmark | VALTERIX HOME (HOME in brand blue) |
| Browser title pattern | `Page name \| Valterix Home` |
| Default title | Valterix Home \| Beds and household furniture |
| Default description | Made-to-order divan beds, headboards, mattresses and household furniture from Valterix Home. Configure a piece and send an order request. |
| Canonical metadata base | `https://valterixfurniture.com` |
| Parent company site | `https://valterixassets.com`, overridable with `NEXT_PUBLIC_WWW_URL` |
| Contact email | hello@valterixassets.com |
| Location shown | Colombo, Sri Lanka |
| Phone / WhatsApp | Not published. The contact page says a specialist shares it when confirming a request. |
| Legal line | © 2026 Valterix Home \| Valterix Assets (Pvt) Ltd. All Rights Reserved. |
| Founder shown on About | Mr. Madhushanka, Founder, Valterix Assets (Pvt) Ltd. The portrait is a letter “M”, not a photograph. |
| Language | English (`<html lang="en">`) |
| Phase named in the UI | The order thank-you screen calls this “Phase 1” and says the request stays in the browser. |

There is no published shop telephone number, no opening hours beyond “order requests are reviewed on working days”, and no live chat. The site itself does not take calls.

---

## 2. Technical stack and how it is built

### 2.1 Runtime and packages

| Piece | Version / setting |
| --- | --- |
| Package name | `valterix-furniture` |
| Package version | `0.0.1` |
| Private | yes |
| Package manager | pnpm 10.15.1 (`packageManager` field; lockfile is `pnpm-lock.yaml`) |
| Node | `>=20.9` |
| Framework | Next.js 16.3.4, App Router |
| UI library | React 19.2.8 and react-dom 19.2.8 |
| Icons | lucide-react ^1.7.0 |
| Styling | Tailwind CSS 4.3.1 via `@tailwindcss/postcss` ^4.3.1 and PostCSS ^8.5.6 |
| Language | TypeScript ^5.9.3, `strict: true` |
| React types | `@types/react` and `@types/react-dom` ^19.2.0 |
| Node types | `@types/node` ^24.3.0 |

There is no database, no CMS, no authentication library, no form backend, no payment SDK, no analytics script, and no test runner. The catalogue is TypeScript data in `data/`.

### 2.2 Scripts

| Script | Command | What it does |
| --- | --- | --- |
| `dev` | `next dev --port 3014` | Local development server on port 3014 |
| `build` | `next build` | Static export (see config below) |
| `start` | `next start --port 3014` | Serves a Next server build on port 3014 |

`start` is present, but the Next config forces a static export, so the deployable artefact is the `out/` folder of HTML, not a Node server. A previous build is already present in `.next/` and `out/`.

### 2.3 Next.js configuration

`next.config.ts`:

- `output: "export"` — every route is pre-rendered to static HTML. There are no server actions, no route handlers, and no dynamic server rendering.
- `trailingSlash: true` — every URL ends with `/`. Internal links are written that way (`/products/`, `/order/`, and so on).
- `images.unoptimized: true` — the Next image optimiser is off, which static export requires. The site uses plain `<img>` tags, not `next/image`.
- `agentRules: false`.

TypeScript compile target is ES2022. JSX is `react-jsx`. Module resolution is `bundler`. `noEmit` is true (Next compiles). Incremental builds write `tsconfig.tsbuildinfo`. `next-env.d.ts` is the generated Next types file and is marked as not to be edited.

### 2.4 What is ignored

`.gitignore` ignores `node_modules`, `.next`, `out`, `*.rar`, `.env`, and `.env.local`.

### 2.5 Source layout

```
valterix-furniture/
  app/                  routes, global CSS, Gonnex font
  components/           page UI
  data/                 catalogue (the only content source)
  lib/                  pricing, search, browser store
  public/images/        divan photographs and the Open Graph image
  documentation/        this document
```

There is no `src/` directory, no `middleware.ts`, no `app/api`, no favicon file, no `robots.txt`, and no sitemap source file. There is no project README.

### 2.6 Fonts

Two fonts are loaded in the root layout and exposed as CSS variables.

| Font | Source | Weights | CSS variable | Used for |
| --- | --- | --- | --- | --- |
| Poppins | `next/font/google`, subset `latin`, `display: swap` | 400, 500, 600, 700 | `--font-poppins` | Body text (`font-sans`) |
| Gonnex | Local file `app/fonts/gonnex.otf` (33,084 bytes), `display: swap` | the file’s single face | `--font-gonnex` | Display headings (`.font-display`) |

If Gonnex fails to load, the display stack falls back to the family name `"Gonnex"`, then `sans-serif`. Body falls back to `"Poppins"`, then `sans-serif`.

### 2.7 Design tokens

Defined in `app/globals.css` with Tailwind v4 `@theme`:

| Token | Value | Role |
| --- | --- | --- |
| `--color-navy` | `#0b1d3a` | Headings, footer, primary dark buttons |
| `--color-brand` | `#2563eb` | Links, primary buttons, badges, the word HOME |
| `--color-brand-light` | `#3b82f6` | Defined, not used in components |
| `--color-ink` | `#172033` | Body text |
| `--color-muted` | `#667085` | Secondary text |
| `--color-faint` | `#98a2b3` | Eyebrows, SKUs, step numbers |
| `--color-line` | `#e6e2db` | Borders |
| `--color-paper` | `#faf9f6` | Page background |
| `--color-sand` | `#f2f0ec` | Panels, empty states, image wells |
| `--color-card` | `#ffffff` | Cards, header dropdowns, form fields |

The founder monogram block uses an extra hardcoded navy, `#132847`, which is not a token.

Other global CSS:

- `html` and the reduced-motion override both set `scroll-behavior: auto`. Smooth scrolling is not used.
- `body` uses the paper background, ink colour, and the sans font.
- Under `prefers-reduced-motion: reduce`, every transition duration is forced to `0.01ms`.
- The header is sticky, `z-40`, `h-[4.5rem]`, paper at 95% opacity with backdrop blur, and a bottom border.
- Content width is generally `max-w-7xl` (80rem) with `px-4`. Narrower pages use `max-w-6xl`, `max-w-5xl`, `max-w-4xl`, or `max-w-3xl`.
- Cards use a soft shadow `0 8px 30px rgba(16,24,40,0.06)`, and hover or dropdowns use `0 14px 40px rgba(16,24,40,0.10)`.
- Corners are mostly `rounded-xl` or `rounded-2xl`. Buttons are `rounded-lg`.
- There is no dark theme.

### 2.8 Root shell

`app/layout.tsx` wraps every page:

1. `StoreProvider` (client) owns cart, wishlist, compare, and quick view.
2. `SiteChrome` (client) renders the header, `<main>`, the quick-view dialog, and the footer.
3. `wwwUrl` is passed in from `getDomains()`, which reads `NEXT_PUBLIC_WWW_URL` at build time and strips a trailing slash. The default is `https://valterixassets.com`.

Metadata:

- Open Graph title and description match the default title and description.
- Open Graph image is `/images/og.png`, declared as 1200×630, alt text “Mira Divan Bed in a bedroom”.
- Twitter card is `summary_large_image` with the same image.

Changing the route does three things in the chrome: close the mobile menu, close the search panel, and `window.scrollTo(0, 0)`.

---

## 3. Information architecture and every route

All public URLs have a trailing slash. Unknown paths render `app/not-found.tsx`: heading “That page is not in the catalogue.” and a link “Back to the shop” to `/products/`. Title: “Not found”.

`/products/[slug]/` is one dynamic route that serves both category pages and product pages. A slug is tested as a category first. Only if it is not a category is it treated as a product. None of the current product slugs collide with category slugs. If they ever did, the category shop would win and the product page would be unreachable.

The Headboards category is a special case inside that route: the page title and summary stay “Headboards”, but the product filter is forced to `divan-beds`. Headboards are not separate products. Each divan bed is named for its headboard.

`/customise/` and `/customise/divan-bed/` render the same `Customizer` component and the same metadata. The navigation points at `/customise/divan-bed/`.

### 3.1 Route table

| URL | Source | Metadata title | What it renders |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | Valterix Home | `HomePage` |
| `/products/` | `app/products/page.tsx` | Shop | `ShopView` of every product |
| `/products/divan-beds/` | `app/products/[slug]/page.tsx` | Divan Beds | Shop filtered to `divan-beds` |
| `/products/headboards/` | same | Headboards | Shop titled Headboards, filtered to `divan-beds` |
| `/products/mattresses/` | same | Mattresses | Shop filtered to `mattresses` |
| `/products/bedroom-furniture/` | same | Bedroom Furniture | Shop filtered to `bedroom-furniture` |
| `/products/household/` | same | Household | Shop filtered to `household` |
| `/products/<product-slug>/` | same | The product name | `ProductView` |
| `/collections/` | `app/collections/page.tsx` | Collections | Five collection cards |
| `/collections/modern/` | `app/collections/[slug]/page.tsx` | Modern Line | Shop filtered to that collection |
| `/collections/tufted/` | same | Tufted Collection | same |
| `/collections/linear/` | same | Linear Collection | same |
| `/collections/soft-living/` | same | Soft Living | same |
| `/collections/signature/` | same | Signature Collection | same |
| `/customise/` | `app/customise/page.tsx` | Customise your bed | Bed customiser |
| `/customise/divan-bed/` | `app/customise/divan-bed/page.tsx` | Customise your bed | Same customiser |
| `/order/` | `app/order/page.tsx` | Order | `OrderForm` inside `Suspense` |
| `/cart/` | `app/cart/page.tsx` | Enquiry cart | `CartPage` |
| `/wishlist/` | `app/wishlist/page.tsx` | Wishlist | `WishlistPage` |
| `/compare/` | `app/compare/page.tsx` | Compare | `ComparePage` |
| `/search/` | `app/search/page.tsx` | Search | `SearchResults` inside `Suspense`, reads `?q=` |
| `/about/` | `app/about/page.tsx` | About | Company and founder copy |
| `/contact/` | `app/contact/page.tsx` | Contact | Contact details and links |
| `/delivery/` | `app/delivery/page.tsx` | Delivery | Four delivery paragraphs |
| `/care/` | `app/care/page.tsx` | Care and warranty | Care notes and a `#warranty` section |
| `/faq/` | `app/faq/page.tsx` | FAQ | Five questions |
| any other path | `app/not-found.tsx` | Not found | Short 404 |

`generateStaticParams` prebuilds every category slug, every product slug, and every collection slug. Product and category metadata descriptions come from `shortDescription` or `summary`. A missing collection or product calls `notFound()`.

`Suspense` is required around `OrderForm` and `SearchResults` because both call `useSearchParams()` during a static export.

Home page description, separate from the layout default: “Shop divan beds, headboards, mattresses, bedroom furniture and household pieces. Prices are catalogue figures in LKR and are confirmed before making.”

### 3.2 Header

Desktop (`lg` and up), left to right:

1. Wordmark linking to `/`.
2. Center nav: Home, Shop (hover dropdown), Collections, Customise Your Bed, About, Contact.
3. Icon buttons: Search, Wishlist (badge), Enquiry cart (badge), and an “Order” button.

The Shop dropdown lists “All products” plus the five category names. It opens on mouse enter and closes on mouse leave. It is not keyboard-operable beyond the Shop link itself, which goes to `/products/`.

The Order button is `hidden` below the `md` breakpoint. The mobile menu does not contain an Order item. On a phone, Order is reached from the footer (“Order process”), a product page (“Order this piece”), the cart (“Submit order request”), the customiser, or the contact page.

Mobile menu (`lg:hidden` hamburger, icon swaps between Menu and X):

- Home
- Shop
- Each category, indented, in muted text
- Collections, Customise Your Bed, About, Contact

Wishlist and cart badges show a count in a brand-blue pill. The cart badge is the sum of quantities, not the number of lines. The wishlist badge is the number of saved slugs. A zero count hides the badge.

### 3.3 Header search

The search button toggles a panel anchored under the header, max width `max-w-3xl`.

- Input name is `q`. The form method is GET to `/search/`.
- Placeholder: “Search by name, category, colour, or product id”.
- The field is auto-focused when the panel opens.
- Escape closes it. A pointer down outside the panel and outside the search button closes it. The close X inside the field also closes it.
- While the query is non-empty, a dropdown lists up to 8 matches from `searchProducts`, each with the default configuration image, name, category name, SKU, and starting price.
- Empty results say “No pieces match that search.”
- The last row is a submit button, “See every match”, which navigates to `/search/?q=...`.
- The panel uses `pointer-events-none` on the outer form and `pointer-events-auto` on the inner panel so the rest of the page stays clickable.

### 3.4 Footer

Navy background, four columns from the `sm`/`lg` breakpoints.

**Column 1.** Wordmark and the sentence: “Made-to-order beds and household furniture from Valterix Assets. Prices are confirmed before anything is made.”

**Shop.** One link per category, to `/products/<category-slug>/`.

**Help.** Contact, Delivery, Order process (`/order/`), Care, Warranty (`/care/#warranty`), FAQ.

**Company.** About, an external link “Valterix Assets” (opens in a new tab, `rel="noreferrer"`), Collections, then `hello@valterixassets.com` and “Colombo, Sri Lanka” as plain text, not links.

The bottom bar repeats the copyright and: “Valterix Home is a retail catalogue. It is not an investment product, and an enquiry is not a paid order.”

### 3.5 Quick view

`QuickView` is mounted once in the chrome, so it can open from any page that uses a product card.

- It opens when `openQuickView(slug)` sets the slug. It returns nothing if the slug is missing.
- Overlay is `fixed inset-0 z-50`, navy at 50% opacity. The dialog is `max-w-4xl`, `max-h-[90vh]`, `role="dialog"`, `aria-modal="true"`, labelled “quick-view-title”.
- It shows the configured image, product-level availability, name, short description, and configured price (or the word “Unavailable”).
- Colour swatches are selectable. Disabled if that colour’s availability is `"unavailable"`. No current colour is unavailable.
- A headboard row renders only when `headboardIds.length > 0`. No current product has headboard ids, so this row never appears.
- Size and mattress are not editable here. The caption under the buttons shows the active size name, or “As shown”, and the active mattress name, or “No mattress”.
- “Add to enquiry cart” adds the active quote and closes the dialog. It is disabled when the quote is unavailable.
- “View full product” goes to `/products/<slug>/` and closes the dialog.
- Close is the X button only. Clicking the backdrop does not close it. Escape is not handled here (Escape only closes search).
- Colour state is a single `useState` that is not reset when a different product is opened. A colour chosen on one quick view can carry onto the next product if that product has the same colour id.

---

## 4. Page-by-page behaviour

### 4.1 Home (`/`)

`HomePage` is a client component. Sections, in order:

**Hero.** Eyebrow “Valterix Home”. Heading: “Beds, made for the room you actually live in.” Supporting line: “Divan beds, headboards, mattresses and household furniture. Configure the finish, then send an order request. Nothing is charged on this site.” Buttons: “Shop divan beds” (`/products/divan-beds/`) and “Customise a bed” (`/customise/divan-bed/`). The image is the Divan Beds category image (Kuma in beige). A floating card says “Starting piece”, “Kuma Divan Bed”, and “From” plus the default quote for Kuma, which is LKR 129,500 (single, no mattress, beige).

**Category mosaic.** All five categories. The first (Divan Beds) is the large tile: minimum height 26rem, two columns on small screens, and on large screens two columns by two rows in a four-column grid. The other four tiles are minimum height 14rem (`min-h-56`). On large screens each of those spans two columns, so Headboards and Mattresses stack in the right half beside the large tile, and Bedroom Furniture and Household sit on the next row. Each tile is a link to `/products/<slug>/`, with the category image, a navy gradient, the name, and the summary. Images scale to 1.03 on hover over 500ms.

**Featured pieces.** Heading plus “View the shop”. A horizontal scroller of every featured product, each card fixed at 18rem wide. See the featured list in section 6.

**Finish picker.** Only if the Kuma product exists. Sand background. Left: the image for the selected Kuma colour. Right: eyebrow “Choose your finish”, the name, short description, live price, and a swatch for every Kuma colour. Initial colour is Kuma’s first colour, beige. “Open the bed customiser” links to `/customise/divan-bed/`. This picker changes colour only. It does not change size or mattress, so the price moves only when the colour has an adjustment (sage and blue, each + LKR 2,500).

**Editorial split.** Left: “A bedroom, then the rest of the house.” Copy names the five collections (Modern, Tufted, Linear, Soft Living, Signature) and links to `/collections/`. Under that, an Unsplash bedroom (`photo-1616594039964-ae9021a400a0`). Right: the first four featured products as horizontal rows (image, category, name, short description clamped to two lines, “From” price). Featured order makes those four Kuma, Atria, Capella, and Rana is not featured, so the fourth is Mira Divan Bed. Exact order is the `featured` filter of the product array: Kuma, Atria, Capella, Mira.

**Three promises.**

| Title | Icon | Copy |
| --- | --- | --- |
| Built to order | Hammer | Most beds are cut after the style, colour and size are confirmed. |
| Sized in the quote | Ruler | King, queen, double and single change the price from the product data, not a hidden rule. |
| Confirmed before making | ShieldCheck | An enquiry is a request. Availability and the final price are confirmed by the team. |

**How an order moves.** Five numbered steps:

| Step | Label | Copy |
| --- | --- | --- |
| 01 | Select | Choose the piece. |
| 02 | Customise | Set the bed, colour and size. |
| 03 | Request | Send an order enquiry. |
| 04 | Confirm | We confirm price and timing. |
| 05 | Deliver | The piece is made, then delivered. |

Under the steps: a truck icon and “Delivery follows confirmation. This site does not take payment.”

**Closing band.** Household category image, heading “Ready to specify a piece?”, line “Start with the household range, or send a configured bed as an order request.” Buttons: “Household” (`/products/household/`) and “Order enquiry” (`/order/`). A check icon and “Prices shown are catalogue figures in LKR.”

### 4.2 Shop, category, collection, and search lists

All four use `ShopView`.

| Prop | Shop | Category page | Collection page | Search |
| --- | --- | --- | --- | --- |
| Title | Shop | Category name | Collection name | `Search “query”`, or “Search” if `q` is empty |
| Summary | “Every piece in the current catalogue. Filters read the product data, so a new entry appears here without a layout change.” | Category summary | Collection summary | “Results update as you type. Matches can come from the name, category, colour, product id, or any other detail on the piece.” |
| Locked filter | none | `category` (headboards locked to `divan-beds`) | `collection` | none; `q` is the initial search box value |

Layout is a sidebar plus a grid (`lg:grid-cols-[16rem_1fr]`).

Sidebar controls, top to bottom:

- Title and summary.
- A search text field. It filters as the visitor types. It is local React state. It is not written back to the URL, except that arriving from header search seeds it once from `?q=`.
- Colour dropdown: “Any”, then the seven fabric colours in catalogue order.
- Availability dropdown: “Any”, In stock, Limited, Made to order, Pre-order, Available on request. There is no “Unavailable” option in this dropdown.
- Category links, hidden when a category filter is already locked. These are plain `<a href>` tags, so they do a full navigation to `/products/<slug>/`.
- Collection links, hidden when a collection filter is already locked. Same full navigation to `/collections/<slug>/`.

The catalogue function `filterProducts` also accepts a `headboard` filter. The shop UI does not expose it. Every product currently has an empty `headboardIds` array, so a headboard filter would return no products.

Results header: “N piece” or “N pieces”, and a sort select labelled “Sort” for screen readers. Options: Featured (default), Price low to high, Price high to low, Name.

Sort rules:

- `name`: locale compare on product name.
- `price-asc` / `price-desc`: `startingPrice`, which is the default configuration quote, not a visitor’s current configuration.
- `featured`: featured products first (`true` before `false`), then name.
- Exception: if there is a search query and sort is still “featured”, the relevance order from search is kept and the featured sort is not applied. Choosing another sort reorders the matches.

Empty state: “No pieces match these filters.” Otherwise a responsive grid: 1 column, 2 from `sm`, 3 from `xl`.

Colour filtering keeps a product only when it has that colour id and that colour’s availability is not `"unavailable"`. Availability filtering uses the product-level `availability` field, not the colour-level field. A product can therefore be “In stock” in the filter while most of its colours are made to order. See section 6.

### 4.3 Product card

Used on the shop, featured scroller, related products, and wishlist.

- Image is the default quote image (first available colour). Aspect ratio 4/5. Hover scales the image to 1.03 and lifts the card 0.5 units.
- Top-left pill: product-level availability label.
- Top-right: wishlist heart and compare scale icon. The heart fills when saved. Active icons turn brand blue. `aria-pressed` reflects state.
- SKU in small tracking-wide faint text.
- Name links to the product page. Display font, 2xl.
- Short description, clamped to two lines.
- Up to five colour dots. Further colours exist on the product but are not shown on the card. Dots have a `title` tooltip with the colour name.
- “From” plus starting price, and a “Quick view” button.

`optionLabel` is exported from this file and is not used anywhere else. It title-cases size and mattress ids and looks up colour and headboard names.

### 4.4 Product page

`ProductView` for one product.

Left: configured image, aspect 4/5, cover crop, rounded 2xl. Alt text is “{Name} in {Colour}” when the colour id is a known fabric colour, otherwise just the name (`piecePhotoLabel`).

Right:

- SKU.
- Name, display font, 5xl / 6xl.
- Full description.
- Product-level availability label (not the selected colour’s availability).
- Configured price, or “Unavailable”.
- A price breakdown. A row is shown only when its amount is not zero. Possible rows: Base, Colour, Headboard, Size, Mattress, Discount. Discount is shown as a negative LKR amount. If the finish is unavailable, the breakdown is replaced by “This finish is not offered.”
- Colour selector. A colour with availability `"unavailable"` is disabled at 30% opacity. None are unavailable today.
- Headboard selector, only if `headboardIds` is non-empty. It never renders for the current catalogue.
- Size selector, only if `sizeIds` is non-empty. Labels are “{Name} · {dimensions}”, for example “King · 180 × 200 cm”. The button does not show the size surcharge; the breakdown above does, once a non-zero size is selected.
- Mattress selector, only if `mattressIds` is non-empty. Labels are mattress names only.
- Buttons: “Add to enquiry cart” (disabled if unavailable), “Order this piece” (link to `/order/?product=<slug>`), and “Save” / “Saved” (toggles the wishlist slug).
- If `customisable` is true, a text link “Open the full bed customiser” to `/customise/divan-bed/`. All 12 divan beds are customisable. Nothing else is.

Below, a five-column definition list (stacks on small screens):

| Heading | Content |
| --- | --- |
| Materials | Joined with “ · ” |
| Dimensions | `dimensionsNote` |
| Care | Care sentences joined with a space |
| Delivery | `delivery` |
| Warranty | `warranty` |

Related pieces: up to four other products that share the category or any collection, in catalogue order, skipping the current product. Rendered as product cards. The cap is four, so a divan bed’s related list is the next divan beds in the array, not a curated set.

### 4.5 Bed customiser

Both customise URLs render `Customizer`. It lists every product with `customisable: true`, which is the 12 divan beds, in catalogue order. The first bed, Kuma, is selected on load, with that bed’s default configuration.

The page is a two-column grid from `lg`: a preview column and a 20rem panel.

Preview column (sticky under the header):

- Eyebrow “Divan customiser”.
- Heading “Build the bed, then request it.”
- Image well, sand background, image `object-contain` (not cover). Height is 38vh, or `calc(100svh - 14rem)` from `lg`.
- Step pills. Any step can be clicked. The active pill is navy.

Steps, fixed labels: Bed, Colour, Size, Mattress, Review.

**Bed.** A two-column grid of the 12 beds. Each tile shows the bed’s default-quote image and the name with the suffix “ Divan Bed” removed (so “Kuma”, “Atria”, “Dorchester”, “Waldorf”, “Torre”). Choosing a bed resets configuration to that bed’s defaults and sets the step index back to 0, so the visitor stays on the Bed step.

**Colour.** One button per colour on that bed, with a swatch. Unavailable colours would be disabled. The selected colour is a navy button with white text.

**Size.** One full-width button per size the product allows. Detail line is the dimensions, and if the adjustment is non-zero, “ · + LKR N”. Single has no surcharge, so it shows dimensions only.

**Mattress.** Same pattern. Detail is the mattress description plus a surcharge when non-zero. “No mattress” has a zero adjustment.

**Review.** Four rows: Bed, Colour, Size, Mattress. It does not repeat materials, care, or the price breakdown. The price sits in the panel footer on every step.

Panel footer, always visible:

- “Configured price” and the figure, or “Unavailable”.
- If unavailable: “This combination is not offered, so no price is shown.”
- Back, shown when step > 0.
- Continue, shown when not on Review. Continue does not validate; every current combination is available.
- “Add to enquiry cart”, disabled when unavailable.
- “Request this configuration”, a link to `/order/?product=<slug>`.

The request link passes only the product slug. It does not put the chosen colour, size, or mattress into the URL. Those choices are in the enquiry cart only if the visitor clicked “Add to enquiry cart”. See section 8 for what the order form then keeps.

The options panel is a sticky column with its own scroll (`h-[calc(100svh-8rem)]`, and from `lg` `h-[calc(100svh-6.5rem)]`).

### 4.6 Enquiry cart (`/cart/`)

Heading “Enquiry cart”. Intro: “Review the pieces, then send one order request. This is not a payment checkout.”

Empty: “The cart is empty.” plus “Browse the shop.”

Otherwise a list. Each line shows:

- The image stored at the time of add.
- Product name.
- Colour name, then headboard name if a headboard id was stored, then the raw size id if present (for example `king`, not “King”).
- Unit price, not the line total.
- Quantity minus, the number, quantity plus, and Remove.

The mattress id is stored on the line and is not shown. Decreasing quantity below 1 removes the line. The illustrated total is the sum of unit price times quantity. “Submit order request” goes to `/order/` with no query string. There is no “clear cart” button on this page. The cart is cleared only after a successful order-form submit.

### 4.7 Wishlist (`/wishlist/`)

Heading “Wishlist”. Line: “Saved on this device.” Empty: “Nothing saved yet.” Otherwise the saved products as cards, up to four columns. Saving stores the product slug only, not a colour or size. If a saved slug no longer exists in the catalogue, it is dropped from the render but left in storage until toggled. Cards still offer wishlist, compare, and quick view.

### 4.8 Compare (`/compare/`)

Heading “Compare”. Line: “Up to three pieces, saved on this device.” Empty: “Add pieces from the shop with the compare icon.”

There is no compare link in the header or footer. The only way in is the scale icon on a card, then typing `/compare/` or using a saved URL. The header never shows a compare count.

Up to three products, in the order they were added. A fourth add drops the oldest (`current.slice(1)` plus the new slug). Removing uses the same toggle.

Each column shows the first colour image in the product’s `colors` array (not necessarily the default-quote image if the first colour were unavailable; none are), the name, short description, “From” starting price, materials joined with commas, and a Remove button. It does not show sizes, mattresses, colours, warranty, or availability.

### 4.9 Order enquiry (`/order/`)

Heading area: eyebrow “Order enquiry”, “Let's build your order.”, and “Tell us what you'd like and our team will confirm availability, configuration and final pricing.”

The form has two modes, chosen after the store has hydrated (`ready`). Until then the form shows “Loading your enquiry…” under the customer fields, because the cart is read from `localStorage` after mount.

**Customer details, always shown.**

| Field | Name | Required | Saved in the request |
| --- | --- | --- | --- |
| Full name | `name` | yes | yes |
| Phone number | `phone` | yes | yes |
| WhatsApp number | `whatsapp` | no | no |
| Email | `email` | yes, `type="email"` | yes |
| Delivery address | `address` | yes | no |
| City / area | `city` | yes | yes |

**If the cart has at least one line.** The product section is hidden. Only an optional Note is shown. Submit intent is stored as `"cart"`. The cart lines are stored with the request. The sidebar lists those lines.

**If the cart is empty.** A radio pair:

- “I know the piece” (default). Stored intent `"product"`.
- “Don't know what to select”, with the help line “Contact a specialist for a consultation to get a better idea about the product and decide.” Stored intent `"consultation"`.

When “I know the piece” is selected, a product fieldset appears:

| Field | Name | Required | Notes | Saved |
| --- | --- | --- | --- | --- |
| Product | `product` | yes | Every catalogue product. Default is `?product=` if that query is present, otherwise the first product (Kuma). The query is used only as `defaultValue`, so it is not kept if the cart path is showing. | yes, the slug |
| Colour | `color` | no | Blank “Not applicable”, then Beige, Cream, Grey, Charcoal, Sage, Blue, Stone. Stone is last here, not in fabric-catalogue order. The options are not limited to colours that product actually has. | no |
| Size | `size` | no | Blank “Not applicable”, then Single, Double, Queen, King. Not limited to the product’s `sizeIds`. | no |
| Mattress | `mattress` | no | No mattress, Comfort, Hotel, Orthopaedic. There is no blank option. Default is the first option, “No mattress”. | no |
| Quantity | `quantity` | yes | Number, default 1. | no |
| Preferred delivery date | `date` | no | Native date input. | no |
| Reference image | `reference` | no | `accept="image/*"`. | the file name only, and only in React state; the file bytes are never read |
| Note | `notes` | no | Textarea, 4 rows. | yes |

Consultation hides that fieldset and still shows the note. Stored `product` and `fileName` are empty strings. Cart lines are included but are empty in this branch.

The sidebar “Enquiry cart”:

- Empty: “Nothing is in the cart. Specify a piece below, or ask for a specialist consultation.”
- Otherwise each line’s name, colour name, “Qty N”, and the line total.
- “Illustrated total LKR …” when there are lines.
- Always, under the list or the empty message when lines exist: “The total is a catalogue illustration. The confirmed price can change after availability is checked.” The empty state does not show that sentence; it is rendered whenever `lines.length > 0` is handled, and the disclaimer under the total is unconditional after the list branch. Looking at the component: the disclaimer is outside the empty/list branch’s price line and is always rendered after the conditional. So the disclaimer shows even when the cart is empty.

Submit button: “Submit order request →”.

On submit the browser does not navigate away and does not call a network API. It writes `localStorage` key `vx-home-last-request` and clears the cart. The saved object is:

```json
{
  "name": "",
  "phone": "",
  "email": "",
  "city": "",
  "intent": "cart | consultation | product",
  "product": "",
  "notes": "",
  "fileName": "",
  "lines": [],
  "savedAt": "ISO timestamp"
}
```

`intent` is computed in code. The radio inputs are named `intent` as well, but their values are never read; the handler uses the `consult` boolean and whether the cart had lines. A cart always wins: if anything is in the cart, intent is `"cart"` even if the visitor had previously looked at the consultation copy (that copy is not on screen in the cart branch).

Thank-you screen, replacing the form:

- “Thank you.”
- “Your order request has been received. Our team will contact you to confirm the details and final price.”
- “This Phase 1 site keeps the request in this browser. Nothing has been charged, and no production has started. If you need to send it now, email hello@valterixassets.com.”
- If a reference file name was captured: “Reference image noted on this device: {fileName}.”

Refreshing the page returns to the empty form. The thank-you state is memory only. The last request remains in `localStorage` until another submit overwrites it. Nothing in the UI reads `vx-home-last-request` back.

### 4.10 Collections index (`/collections/`)

Heading “Collections”. Intro: “These are ways of grouping the catalogue. A piece can sit in more than one collection.” Five image cards, two columns from `md`, minimum height 18rem (`min-h-72`), name and summary over a navy gradient. Same hover scale as the home mosaic.

### 4.11 About (`/about/`)

Eyebrow “About”. Heading: “Furniture for the household side of Valterix.” Two photographs: the modern-bedroom Unsplash image and the sofa Unsplash image.

Four articles:

| Heading | Text |
| --- | --- |
| The idea | Valterix Home is the household catalogue: beds first, then the furniture that belongs in the same rooms. Pieces are specified, then requested. They are not investment packages. |
| How it is made | Frames, fabrics and mattress builds come from the product record. A finish marked unavailable is not priced. A specialist confirms the lead time before production. |
| Materials | Upholstery, timber frames and mattress cores are listed on each product. Care notes sit with the piece rather than in a separate brochure. |
| Valterix Assets | Home sits beside the investment sites as its own storefront. The main Valterix Assets site remains at valterixassets.com. |

The link uses `getDomains().www`.

**About the founder** (`#founder`). Left block, background `#132847`, a display “M” at text-8xl. Right, navy: “About the founder”, “Mr. Madhushanka”, “Founder, Valterix Assets (Pvt) Ltd.”, and “Valterix Home is the household catalogue under the company he founded. Beds and furniture are specified here, then requested. A specialist confirms the piece before it is made.”

### 4.12 Contact (`/contact/`)

Heading “Contact”. “The useful next step is an order enquiry. Tell us the piece, the finish and where it needs to go.” Button: “Order / enquire about a product” to `/order/`.

| Label | Value |
| --- | --- |
| Email | hello@valterixassets.com (text, not a `mailto` link) |
| Studio | Colombo, Sri Lanka |
| Phone and WhatsApp | Shared by the specialist who confirms your request. A shop number is not published here. |
| Hours | Order requests are reviewed on working days. The site itself does not take live calls. |

Side card: linear-bedroom Unsplash image, “Order support”, “Use the order form for a configured bed or a household piece. Delivery, care and warranty notes are on their own pages.” Links to Delivery, Care and warranty, and FAQ.

### 4.13 Delivery (`/delivery/`)

Four paragraphs:

1. Delivery is arranged after the order request is confirmed. The catalogue does not promise a dispatch date.
2. Colombo and the surrounding area are the first delivery focus. Other areas are quoted with the confirmation.
3. Beds are made to the size and fabric on the request. Access, stairs and room clearance are checked before delivery is booked.
4. A preferred date on the order form is a note for the team, not a booking.

### 4.14 Care and warranty (`/care/`)

Care:

- Vacuum upholstery with a soft nozzle. Blot spills. Do not soak fabric or bend a mattress core.
- Each product page lists the care notes that belong to that piece. Those notes override this general page.

Warranty (`#warranty`):

- Frames are covered for two years against manufacturing faults. Fabric, mattress covers and fittings are covered for one year.
- Wear, stains, and damage from misuse are not manufacturing faults. The confirmed order is the record of what was requested.

Product-level warranty strings are more specific and sometimes shorter. They are quoted per product in section 6. The care page is the general policy; the product page is what the product component prints.

### 4.15 FAQ (`/faq/`)

| Question | Answer |
| --- | --- |
| Is this a checkout? | No. The cart collects an enquiry. Payment is not taken on this site. |
| Are the prices final? | They are catalogue figures in LKR. The team confirms the price with availability. |
| Can I type a custom size? | Sizes come from the product data. A note on the order form can ask about something outside that list. |
| What if a colour says unavailable? | That finish is not offered. The customiser does not show a price for it. |
| Where is my wishlist stored? | On this browser, with the enquiry cart. |

---

## 5. Catalogue model

All content lives in `data/` and is read through `lib/catalog.ts`. There is no fetch.

### 5.1 Types

`Availability` is one of: `in-stock`, `limited`, `made-to-order`, `pre-order`, `on-request`, `unavailable`.

A product colour is `{ id, adjustment, image, availability }`. Adjustment is an integer number of rupees added to the base price. It can be zero.

A product is:

| Field | Meaning |
| --- | --- |
| `slug` | URL segment and stable id |
| `sku` | Shown on cards and product pages. Pattern `VH-BED-…`, `VH-MAT-…`, `VH-FUR-…`, or `VH-HOME-…` |
| `name` | Display name |
| `category` | One category slug |
| `collections` | Zero or more collection slugs. A piece may be in several. |
| `shortDescription` | Cards, quick view, meta description |
| `description` | Product page only |
| `basePrice` | Integer LKR before adjustments and before sale discount |
| `salePrice` | Optional. Only Lumen Floor Lamp sets it. |
| `featured` | Home scroller and default shop sort |
| `customisable` | Included in the bed customiser, and shows the customiser link on the product page |
| `colors` | At least one finish, each with its own image and availability |
| `headboardIds` | Optional headboard choices. Empty on every current product. |
| `sizeIds` | Allowed sizes. Empty means no size selector. |
| `mattressIds` | Allowed mattress add-ons. Empty means no mattress selector. |
| `materials` | String list |
| `care` | String list |
| `dimensionsNote` | Free text, not a structured size |
| `delivery` | Free text |
| `warranty` | Free text |
| `availability` | Product-level status used by the shop filter and by the badges. Separate from each colour’s availability. |

### 5.2 Categories

| Slug | Name | Summary | Image |
| --- | --- | --- | --- |
| `divan-beds` | Divan Beds | Each bed is named for its headboard. Choose the colour, size and mattress. | Local `/images/divan/kuma/kuma-divan-bed-beige.png` |
| `headboards` | Headboards | Each headboard style is its own divan bed. The bed name is the headboard. | Local `/images/divan/mira/mira-divan-bed-beige.png` |
| `mattresses` | Mattresses | Comfort, hotel and orthopaedic builds sized to the bed. | Unsplash `photo-1631049307264-da0ec9d70304` |
| `bedroom-furniture` | Bedroom Furniture | Bedsides, wardrobes and quiet storage for the same room. | Unsplash `photo-1595526114035-0d45ed16cfbf` |
| `household` | Household | Sofas, tables and lighting for the rest of the home. | Unsplash `photo-1555041469-a586c61ea9bc` |

Unsplash URLs are built as `https://images.unsplash.com/{id}?auto=format&fit=crop&w=1400&q=80` for categories and collections, and `w=1600` for non-divan product photos.

There is no product whose `category` is `headboards`. The headboards URL reuses the divan-bed products.

### 5.3 Collections

| Slug | Name | Summary | Image id |
| --- | --- | --- | --- |
| `modern` | Modern Line | Clean outlines, low profiles and quiet hardware. | `photo-1616594039964-ae9021a400a0` |
| `tufted` | Tufted Collection | Buttoned and diamond-tufted headboards. | `photo-1617325247661-675ab4b64ae2` |
| `linear` | Linear Collection | Vertical and horizontal panel designs. | `photo-1615874959474-d609969a20ed` |
| `soft-living` | Soft Living | Neutral, comfort-led pieces for everyday rooms. | `photo-1493663284031-b7e3aefcae8e` |
| `signature` | Signature Collection | Taller, more formal designs for a statement bedroom. | `photo-1540518614846-7eded433c457` |

### 5.4 Fabric colours

| Id | Name | Hex |
| --- | --- | --- |
| `beige` | Beige | `#D8CBB8` |
| `cream` | Cream | `#F3EDE3` |
| `stone` | Stone | `#C8C2B8` |
| `grey` | Grey | `#8E9296` |
| `charcoal` | Charcoal | `#3E4348` |
| `sage` | Sage | `#8FA387` |
| `blue` | Blue | `#6E8CA0` |

`colorName` returns the name, or the raw id if unknown. `colorHex` returns the hex, or beige `#D8CBB8` if unknown. These swatches are also used for non-fabric finishes (stone and charcoal on the dining table, cream and grey on mattresses).

### 5.5 Headboards

Defined in `data/options.ts`. They are not attached to any product. The product page and the customiser never offer them as a choice, because each bed already is one headboard. The data remains in the project and would affect price if a future product listed ids in `headboardIds`.

| Id | Name | Description | Adjustment (LKR) |
| --- | --- | --- | --- |
| `corvus` | Corvus | Low horizontal panels. | 0 |
| `capella` | Capella | Soft diamond tufting. | 8,500 |
| `kuma` | Kuma | Rounded shelter profile. | 4,500 |
| `atria` | Atria | Tall wing with a slim rail. | 7,500 |
| `rana` | Rana | Vertical channel stitching. | 6,000 |
| `mira` | Mira | Low, fully upholstered curve. | 3,500 |
| `ritz` | Ritz | Deep buttoned statement. | 12,000 |
| `adelphi` | Adelphi | Wide border with a plain centre. | 9,000 |
| `umbra` | Umbra | Floating rectangular panel. | 5,000 |
| `dorchester` | Dorchester | Classic rolled top. | 7,000 |
| `waldorf` | Waldorf | Tall hotel wing. | 11,000 |
| `torre` | Torre | Narrow vertical fins. | 8,000 |

`headboardById` looks these up. The cart would print the name if a line had a `headboardId`. No current add-to-cart path sets one, because quote only sets `headboardId` when the product has headboard ids.

### 5.6 Bed sizes

Used by every divan and by both mattresses, except Waldorf Mattress, which omits single.

| Id | Name | Dimensions | Adjustment (LKR) |
| --- | --- | --- | --- |
| `single` | Single | 90 × 190 cm | 0 |
| `double` | Double | 135 × 190 cm | 8,000 |
| `queen` | Queen | 150 × 200 cm | 12,000 |
| `king` | King | 180 × 200 cm | 15,000 |

Default configuration picks `sizeIds[0]`. For every divan and for Dorchester Mattress that is single, so the “From” price has no size surcharge. For Waldorf Mattress the first id is `double`, so its “From” price includes + LKR 8,000.

### 5.7 Mattress add-ons

These are options on a divan, not the standalone mattress products.

| Id | Name | Description | Adjustment (LKR) |
| --- | --- | --- | --- |
| `none` | No mattress | Frame and upholstery only. | 0 |
| `comfort` | Comfort | Balanced everyday support. | 28,000 |
| `hotel` | Hotel | Deeper, quieter hotel feel. | 35,000 |
| `orthopaedic` | Orthopaedic | Firmer support layer. | 48,000 |

Every divan allows all four, in that order. Default is `none`, so “From” prices exclude a mattress. The standalone Dorchester Mattress is described as the hotel build and is priced at LKR 35,000, matching the hotel add-on. The standalone Waldorf Mattress is described as the orthopaedic build and is priced at LKR 48,000, matching the orthopaedic add-on. Ordering a divan with “Hotel” does not add the Dorchester Mattress product to the cart; it only adds the adjustment. The same is true of “Orthopaedic” and the Waldorf Mattress.

### 5.8 Shared copy constants

Most divan beds use:

- Delivery: “Made to order in the finish you select. A specialist confirms the lead time before production starts.”
- Warranty: “Frame 2 years. Fabric and mattress covers 1 year against manufacturing faults.”

Atria, Capella, and several non-bed products override delivery. Nera Sofa reuses the shared warranty. Other non-beds have their own warranty strings.

The shared care pair, used by several beds: “Vacuum the fabric with a soft nozzle.” and “Blot spills. Do not soak the upholstery.”

---

## 6. Pricing

### 6.1 Formula

`quoteProduct` resolves a configuration, then:

```
discount = salePrice is set ? max(basePrice - salePrice, 0) : 0

if the chosen colour exists and its availability is not "unavailable":
  finalPrice = basePrice
             + colour adjustment
             + headboard adjustment
             + size adjustment
             + mattress adjustment
             - discount
else:
  finalPrice = 0
  available = false
```

Missing options contribute zero. Headboard, size, and mattress are omitted entirely when the product’s id list for that option is empty.

`startingPrice` is `quoteProduct` with `defaultConfiguration`:

- Colour: the first colour whose availability is not `"unavailable"`, otherwise the first colour.
- Headboard, size, mattress: the first id in each list, if the list is non-empty.

`formatLkr` rounds to the nearest integer, groups thousands with commas, and prefixes `LKR`. Negative amounts get a leading minus, which is how the discount row is displayed (`-LKR 5,000`). There are no cents. Every price in the data is already an integer.

Prices are snapshotted onto the cart line as `unitPrice` at the moment of add. Later edits to the catalogue do not change lines already in `localStorage`.

Add to cart does nothing if the product slug is unknown or the quote is unavailable. The same configuration merges by incrementing quantity. The line id is:

```
slug|colorId|headboardId|sizeId|mattressId
```

Empty segments are dropped, so a bedside with only a colour is `mira-bedside|beige`.

### 6.2 Worked “from” prices

These are the figures the cards show today.

| Product | Base | Default extras | From price |
| --- | --- | --- | --- |
| Kuma Divan Bed | 129,500 | beige, single, no mattress | LKR 129,500 |
| Atria Divan Bed | 145,500 | beige, single, no mattress | LKR 145,500 |
| Capella Divan Bed | 157,500 | beige, single, no mattress | LKR 157,500 |
| Rana Divan Bed | 162,000 | beige, single, no mattress | LKR 162,000 |
| Corvus Divan Bed | 125,000 | beige, single, no mattress | LKR 125,000 |
| Mira Divan Bed | 128,500 | beige, single, no mattress | LKR 128,500 |
| Umbra Divan Bed | 130,000 | beige, single, no mattress | LKR 130,000 |
| Adelphi Divan Bed | 134,000 | beige, single, no mattress | LKR 134,000 |
| Ritz Divan Bed | 137,000 | beige, single, no mattress | LKR 137,000 |
| Dorchester Divan Bed | 132,000 | beige, single, no mattress | LKR 132,000 |
| Waldorf Divan Bed | 136,000 | beige, single, no mattress | LKR 136,000 |
| Torre Divan Bed | 133,000 | beige, single, no mattress | LKR 133,000 |
| Dorchester Mattress | 35,000 | cream, single | LKR 35,000 |
| Waldorf Mattress | 48,000 | grey, double (+8,000) | LKR 56,000 |
| Mira Bedside | 28,000 | beige | LKR 28,000 |
| Torre Wardrobe | 96,000 | stone | LKR 96,000 |
| Nera Sofa | 185,000 | sage | LKR 185,000 |
| Halden Dining Table | 112,000 | stone | LKR 112,000 |
| Lumen Floor Lamp | 24,000, sale 19,000 | cream, discount 5,000 | LKR 19,000 |

Colour surcharges that change a configured price:

| Product | Colour | Extra |
| --- | --- | --- |
| Kuma Divan Bed | sage, blue | +2,500 each |
| Rana Divan Bed | blue | +2,500 |
| Nera Sofa | charcoal | +4,000 |

A fully optioned Kuma in sage, king, orthopaedic is 129,500 + 2,500 + 15,000 + 48,000 = LKR 195,000. The same bed in beige, single, no mattress stays LKR 129,500.

Lumen’s sale is described on the product as “The sale price is the current shade price, not a checkout discount code.” The breakdown shows Base LKR 24,000 and Discount −LKR 5,000. No other product has `salePrice`.

---

## 7. The 19 products

Counts: 12 divan beds, 2 mattresses, 2 bedroom pieces, 3 household pieces. Nine are featured.

Divan images are local files:

```
/images/divan/{style}/{style}-divan-bed-{colour}.png
```

Non-divan images are Unsplash. The shot names below refer to the map in `data/products.ts`.

### 7.1 Divan beds

All 12: category `divan-beds`, `customisable: true`, `headboardIds: []`, sizes single / double / queen / king, mattresses none / comfort / hotel / orthopaedic. Materials always include a hardwood frame unless noted. Default colour for “From” and for the card image is the first colour in the list.

**Kuma Divan Bed** — `kuma-divan-bed` — SKU `VH-BED-KUMA` — featured — collections modern, soft-living — base LKR 129,500 — product availability made-to-order.

- Short: “A rounded shelter headboard on a fully upholstered divan base.”
- Description: “Kuma is the house divan: a low base and a channelled headboard in one piece. Colour, size and mattress are chosen on this bed. The headboard is not a separate option.”
- Colours: beige, cream, stone, grey, charcoal, sage (+2,500), blue (+2,500). All made-to-order.
- Materials: Hardwood frame, Performance fabric, Solid divan base.
- Care: soft-nozzle vacuum; blot spills, do not soak.
- Dimensions: “The headboard is part of this bed. Mattress height is extra.”
- Delivery: shared made-to-order sentence. Warranty: shared frame/fabric sentence.
- Local images: all seven colours, including stone.

**Atria Divan Bed** — `atria-divan-bed` — `VH-BED-ATRIA` — featured — linear, modern — base LKR 145,500 — product availability in-stock.

- Short: “A tall wing headboard with a slim top rail.”
- Description: “Atria lifts the head of the room without adding carving or buttoning. The wing is upholstered as one piece, and the base stays low so the bed reads as a single line.”
- Colours: beige, cream, stone (in-stock), grey (in-stock), charcoal, sage, blue. Unlisted colours are made-to-order. No colour surcharge.
- Materials: Hardwood frame, Woven upholstery, Adjustable feet.
- Care: “Brush the weave in one direction.” “Keep the bed out of direct prolonged sun.”
- Dimensions: “Wing headboards need clearance above a low window sill.”
- Delivery: “Selected stone and grey finishes are held for faster confirmation. Other colours are made to order.”
- The product badge says “In stock” even when beige (the default image) is made-to-order. Only stone and grey are in stock at colour level.
- Local images: all seven colours.

**Capella Divan Bed** — `capella-divan-bed` — `VH-BED-CAPELLA` — featured — tufted, signature — base LKR 157,500 — product availability limited.

- Short: “Diamond tufting across a deep, quiet headboard.”
- Description: “Capella is the tufted divan. The diamond pattern is stitched into the headboard only, so the base stays plain and easier to live with.”
- Colours: beige (limited), cream (limited), stone, grey, charcoal, sage, blue. The rest are made-to-order.
- Materials: Hardwood frame, Button-tufted fabric, Layered foam edge.
- Care: “Do not pull loose buttons.” “Use a soft brush along the diamond channels.”
- Dimensions: “Tufted headboards sit deeper than a flat panel.”
- Delivery: “Beige and cream are limited. Other colours are made to order.”
- Local images: all seven colours.

**Rana Divan Bed** — `rana-divan-bed` — `VH-BED-RANA` — not featured — linear, signature — base LKR 162,000 — made-to-order. Highest bed base price.

- Short: “Vertical channels on a taller, more formal headboard.”
- Description: “Rana uses narrow vertical channels so the bed feels architectural. It pairs with the Linear and Signature collections.”
- Colours: beige, cream, stone, charcoal, sage, blue (+2,500). No grey.
- Materials: Hardwood frame, Channel-stitched fabric.
- Care: “Vacuum channels from top to bottom.” “Rotate the mattress, not the upholstered base.”
- Dimensions: “Channel depth adds a few centimetres to the headboard thickness.”
- Delivery and warranty: shared.
- Local images: beige, blue, charcoal, cream, sage, stone. No grey file, matching the data.

**Corvus Divan Bed** — `corvus-divan-bed` — `VH-BED-CORVUS` — not featured — linear, modern — base LKR 125,000 — made-to-order. Lowest bed base price.

- Short: “Wide horizontal breaks on a lower headboard.”
- Description: “Corvus is the low horizontal divan. The headboard is part of the bed, so colour, size and mattress are the choices.”
- Colours: beige, cream, stone, grey, charcoal, sage, blue. All made-to-order. No surcharges.
- Materials: Hardwood frame, Upholstered headboard, Divan base.
- Care and dimensions: the shared vacuum/blot pair, and “The headboard is part of this bed. Mattress height is extra.”
- Delivery and warranty: shared.
- Local images: all seven colours.

**Mira Divan Bed** — `mira-divan-bed` — `VH-BED-MIRA` — featured — soft-living, modern — base LKR 128,500 — made-to-order.

- Short: “A low, fully upholstered curve.”
- Description: “Mira is the curved divan. The headboard shape is the bed, so there is no separate headboard to add.”
- Colours: beige, cream, grey, charcoal, sage, blue. No stone.
- Materials, care, dimensions, delivery, warranty: same pattern as Corvus.
- Local images: beige, blue, charcoal, cream, grey, sage. No stone file.
- This is a different product from Mira Bedside. The Open Graph alt text refers to the Mira bed.

**Umbra Divan Bed** — `umbra-divan-bed` — `VH-BED-UMBRA` — featured — modern only — base LKR 130,000 — made-to-order.

- Short: “A flat rectangular headboard with a narrow shadow gap.”
- Description: “Umbra is the rectangular divan. Colour, size and mattress are configured on this bed.”
- Colours: all seven, made-to-order, no surcharges.
- Materials, care, dimensions, delivery, warranty: Corvus pattern.
- Local images: all seven colours.

**Adelphi Divan Bed** — `adelphi-divan-bed` — `VH-BED-ADELPHI` — not featured — tufted, signature — base LKR 134,000 — made-to-order.

- Short: “A wide border around a plain upholstered centre.”
- Description: “Adelphi keeps the detail in the border. The headboard is fixed to this bed.”
- Colours: all seven, made-to-order, no surcharges.
- Materials: Hardwood frame, Border-stitched fabric, Divan base.
- Care: “Brush the border. Do not compress the stitching.”
- Dimensions: headboard-is-part-of-this-bed sentence.
- Delivery and warranty: shared.
- Local images: all seven colours.

**Ritz Divan Bed** — `ritz-divan-bed` — `VH-BED-RITZ` — not featured — tufted, signature — base LKR 137,000 — made-to-order.

- Short: “A deep buttoned headboard.”
- Description: “Ritz is the buttoned divan. The headboard style is the bed name.”
- Colours: beige, cream, stone, charcoal, sage, blue. No grey.
- Materials: Hardwood frame, Buttoned upholstery, Divan base.
- Care: “Do not pull loose buttons.” “Use a soft brush along the channels.”
- Dimensions, delivery, warranty: shared bed pattern.
- Local images: beige, blue, charcoal, cream, sage, stone. No grey file.

**Dorchester Divan Bed** — `dorchester-divan-bed` — `VH-BED-DORCHESTER` — not featured — signature, soft-living — base LKR 132,000 — made-to-order.

- Short: “A classic rolled top on a divan base.”
- Description: “Dorchester is the rolled-top divan. It is a different piece from the Dorchester mattress.”
- Colours: all seven, made-to-order, no surcharges.
- Materials, care, dimensions, delivery, warranty: Corvus pattern.
- Local images: all seven colours.

**Waldorf Divan Bed** — `waldorf-divan-bed` — `VH-BED-WALDORF` — not featured — signature only — base LKR 136,000 — made-to-order.

- Short: “A tall hotel wing on a divan base.”
- Description: “Waldorf is the tall wing divan. It is a different piece from the Waldorf mattress.”
- Colours: beige, cream, stone, grey, charcoal, sage. No blue.
- Materials: Hardwood frame, Upholstered headboard, Divan base.
- Care: soft-nozzle vacuum, and “Keep the wing out of direct prolonged sun.”
- Dimensions: “Wing headboards need clearance above a low window sill. Mattress height is extra.”
- Delivery and warranty: shared.
- Local images: beige, charcoal, cream, grey, sage, stone. No blue file.

**Torre Divan Bed** — `torre-divan-bed` — `VH-BED-TORRE` — not featured — linear, modern — base LKR 133,000 — made-to-order.

- Short: “Horizontal panels across a tall headboard.”
- Description: “Torre is the panelled divan. The headboard is part of the bed. The Torre wardrobe is a separate piece.”
- Colours: all seven, made-to-order, no surcharges.
- Materials, care, dimensions, delivery, warranty: Corvus pattern.
- Local images: all seven colours.
- The headboard option text calls Torre “Narrow vertical fins.” The product short description says “Horizontal panels”. Those two sentences disagree. The product copy is what the site shows.

### 7.2 Mattresses

Neither mattress is customisable. Neither has headboard ids or mattress-add-on ids. Size still changes the quote.

**Dorchester Mattress** — `dorchester-mattress` — `VH-MAT-DORCHESTER` — featured — soft-living — base LKR 35,000 — in-stock — not customisable.

- Short: “The hotel build: deeper, quieter, and finished with a plain border.”
- Description: “Dorchester is the mattress used when a Kuma or Atria order asks for the hotel feel. It can also be ordered on its own.”
- Colours: cream only, in-stock, image `linen` (`photo-1631049552057-403cdb8f0658`).
- Sizes: single, double, queen, king.
- Materials: Quilted cover, Support core, Edge tape.
- Care: “Air the mattress monthly.” “Use a protector. Do not bend the core.”
- Dimensions: “Height is included in the quoted size, not added as a second mattress.”
- Delivery: “Stocked in the four bed sizes. A specialist confirms the exact dispatch window.”
- Warranty: “1 year against manufacturing faults.”

**Waldorf Mattress** — `waldorf-mattress` — `VH-MAT-WALDORF` — not featured — signature — base LKR 48,000 — on-request.

- Short: “A firmer orthopaedic build for the same bed sizes.”
- Description: “Waldorf is the firmer mattress. It is the piece added when an order selects Orthopaedic.”
- Colours: grey only, on-request, image `greyBed` (`photo-1616594039964-ae9021a400a0`).
- Sizes: double, queen, king. The dimensions note says “Single is not offered.”
- Materials: Firmer support core, Quilted cover.
- Care: “Rotate head to foot every season.” “Keep it flat in transit.”
- Delivery: “Available on request once the size is confirmed.”
- Warranty: “1 year against manufacturing faults.”
- From price is LKR 56,000 because double is the first size.

### 7.3 Bedroom furniture

No sizes, no mattresses, no headboards, not customisable.

**Mira Bedside** — `mira-bedside` — `VH-FUR-MIRA` — featured — soft-living, modern — base LKR 28,000 — in-stock.

- Short: “A one-drawer bedside with a soft top edge.”
- Description: “Mira sits beside the divans. The top is upholstered, the drawer is plain, and the footprint stays small.”
- Colours: beige (in-stock, `night` / `photo-1595526114035-0d45ed16cfbf`), cream (in-stock, `white` / `photo-1505691938895-1758d7feb511`), grey (limited, `greyBed`).
- Materials: Upholstered top, Painted carcass.
- Care: “Wipe with a damp cloth and dry immediately.”
- Dimensions: “45 × 40 × 55 cm.”
- Delivery: “Stocked piece. Delivery is arranged with the bed when both are ordered.”
- Warranty: “1 year against manufacturing faults.”

**Torre Wardrobe** — `torre-wardrobe` — `VH-FUR-TORRE` — not featured — linear, modern — base LKR 96,000 — made-to-order.

- Short: “Two doors, a hanging rail, and a vertical shadow gap.”
- Description: “Torre is the bedroom wardrobe in the linear language: flat doors, no moulding, and a finish that can match the headboard fabric family.”
- Colours: stone (made-to-order, `room` / `photo-1538688525198-9b88f6f53126`), charcoal (made-to-order, `dark` / `photo-1540518614846-7eded433c457`), cream (pre-order, `interior` / `photo-1586023492125-27b2c045efd7`).
- Materials: Panel carcass, Soft-close doors.
- Care: “Wipe handles dry.” “Do not hang from the door edge.”
- Dimensions: “120 × 60 × 210 cm.”
- Delivery: “Made to order. Cream is a pre-order finish.”
- Warranty: “2 years on the carcass.”
- Cream is the only `pre-order` finish in the catalogue. The product-level status stays made-to-order, so the shop’s Pre-order filter returns nothing.

### 7.4 Household

**Nera Sofa** — `nera-sofa` — `VH-HOME-NERA` — featured — soft-living, modern — base LKR 185,000 — made-to-order.

- Short: “A three-seat sofa in the same fabric family as the beds.”
- Description: “Nera is the household sofa. It uses the bedroom fabric colours so a sitting room can follow the bed without matching it exactly.”
- Colours: sage (made-to-order, `sofa` / `photo-1555041469-a586c61ea9bc`), beige (made-to-order, `living` / `photo-1493663284031-b7e3aefcae8e`), grey (limited, `calm` / `photo-1616486338812-3dadae4b4ace`), charcoal (on-request, +4,000, `dark`).
- Materials: Hardwood frame, Performance fabric, Loose seat cushions.
- Care: “Plump cushions daily.” “Professionally clean the fabric.”
- Dimensions: “220 × 95 × 82 cm.”
- Delivery: shared made-to-order sentence. Warranty: shared frame/fabric sentence.
- Highest base price in the catalogue. Charcoal configured price is LKR 189,000.

**Halden Dining Table** — `halden-dining-table` — `VH-HOME-HALDEN` — not featured — linear — base LKR 112,000 — in-stock.

- Short: “A rectangular table with a quiet edge and four seats in mind.”
- Description: “Halden is the household dining table. The top is a plain rectangle. Seating is not included.”
- Colours: stone (in-stock, `interior`), charcoal (on-request, `room`). No surcharge.
- Materials: Solid top, Metal underframe.
- Care: “Use coasters.” “Wipe spills before they sit.”
- Dimensions: “180 × 90 × 75 cm. Seats four.”
- Delivery: “Stone is stocked. Charcoal is made on request.”
- Warranty: “2 years on the frame.”
- The product badge says “In stock”. Charcoal is only on request.

**Lumen Floor Lamp** — `lumen-floor-lamp` — `VH-HOME-LUMEN` — featured — modern, soft-living — base LKR 24,000, sale LKR 19,000 — in-stock.

- Short: “A slim floor lamp for the corner of a bedroom or sitting room.”
- Description: “Lumen is a household light, not a fitted electrical installation. The shade finish follows the fabric colours.”
- Colours: cream (in-stock, `bright` / `photo-1560185007-cde436f6a4d0`), beige (in-stock, `beigeBed` / `photo-1505693416388-ac5ce068fe85`), charcoal (limited, `dark`).
- Materials: Metal stem, Fabric shade.
- Care: “Dust the shade. Switch off before changing the bulb.”
- Dimensions: “150 cm tall. Bulb not included.”
- Delivery: “A stocked accessory. The sale price is the current shade price, not a checkout discount code.”
- Warranty: “1 year on the fitting.”
- Lowest “From” price in the catalogue, LKR 19,000.

### 7.5 Featured set, in catalogue order

1. Kuma Divan Bed
2. Atria Divan Bed
3. Capella Divan Bed
4. Mira Divan Bed
5. Umbra Divan Bed
6. Dorchester Mattress
7. Mira Bedside
8. Nera Sofa
9. Lumen Floor Lamp

The home page scroller shows all nine. The “bedroom, then the rest of the house” list shows the first four only.

### 7.6 Which collection contains which piece

| Collection | Pieces |
| --- | --- |
| Modern Line | Kuma, Atria, Corvus, Mira bed, Umbra, Torre bed, Mira Bedside, Torre Wardrobe, Nera Sofa, Lumen Floor Lamp |
| Tufted Collection | Capella, Adelphi, Ritz |
| Linear Collection | Atria, Rana, Corvus, Torre bed, Torre Wardrobe, Halden Dining Table |
| Soft Living | Kuma, Mira bed, Dorchester bed, Dorchester Mattress, Mira Bedside, Nera Sofa, Lumen Floor Lamp |
| Signature Collection | Capella, Rana, Adelphi, Ritz, Dorchester bed, Waldorf bed, Waldorf Mattress |

Umbra is in Modern only. Waldorf bed is in Signature only. Halden is in Linear only. No product is in zero collections.

### 7.7 Names that refer to two products

| Name | Bed | Other piece |
| --- | --- | --- |
| Mira | Mira Divan Bed, the curved headboard | Mira Bedside, 45 × 40 × 55 cm |
| Dorchester | Rolled-top divan | Hotel mattress, also the narrative match for the Hotel mattress option |
| Waldorf | Tall wing divan | Orthopaedic mattress, also the narrative match for the Orthopaedic option |
| Torre | Panelled divan | Two-door wardrobe, 120 × 60 × 210 cm |

The product descriptions call out the Dorchester, Waldorf, and Torre pairs. The Mira pair is only implied (“Mira sits beside the divans” on the bedside).

### 7.8 Product-level availability, as the shop filter sees it

| Filter value | Products |
| --- | --- |
| In stock | Atria Divan Bed, Dorchester Mattress, Mira Bedside, Halden Dining Table, Lumen Floor Lamp |
| Limited | Capella Divan Bed |
| Made to order | Kuma, Rana, Corvus, Mira bed, Umbra, Adelphi, Ritz, Dorchester bed, Waldorf bed, Torre bed, Torre Wardrobe, Nera Sofa |
| Pre-order | none |
| Available on request | Waldorf Mattress |
| Unavailable | none |

Colour-level exceptions inside those products:

| Colour status | Where |
| --- | --- |
| in-stock | Atria stone and grey; Dorchester Mattress cream; Mira Bedside beige and cream; Halden stone; Lumen cream and beige |
| limited | Capella beige and cream; Mira Bedside grey; Nera grey; Lumen charcoal |
| pre-order | Torre Wardrobe cream only |
| on-request | Waldorf Mattress grey; Nera charcoal; Halden charcoal |
| made-to-order | every other finish |
| unavailable | none |

---

## 8. Browser state

`StoreProvider` is a React context. It starts empty, then on mount reads three `localStorage` keys. A `ready` flag blocks writes until that read finishes, so the empty initial state does not wipe storage. JSON parse errors fall back to empty lists.

| Key | Contents |
| --- | --- |
| `vx-home-cart` | Array of cart lines |
| `vx-home-wishlist` | Array of product slugs |
| `vx-home-compare` | Array of up to three product slugs |
| `vx-home-last-request` | Last submitted enquiry object. Written by the order form, never read by the UI. |

Cart line shape: `id`, `slug`, `name`, `image`, `quantity`, `unitPrice`, and optional `colorId`, `headboardId`, `sizeId`, `mattressId`.

There is no sync across devices, no login, and no expiry. Clearing site data clears the enquiry.

Compare behaviour: toggle off if present; if three are already stored, drop the first and append; otherwise append.

Wishlist behaviour: toggle the slug.

`useStore` throws “useStore must be used within StoreProvider” if called outside the provider. Every page is inside it.

---

## 9. Search scoring

`searchProducts` is used by the header dropdown and by shop filtering when the search box is non-empty. An empty query returns every product (shop filters still apply afterwards).

The searchable text for a product is lowercased and includes: name, slug, SKU, short description, description, category slug, category name, collection slugs, collection names, each colour id and colour name, each headboard id and headboard name, each allowed size as “{name} {dimensions}”, each allowed mattress name, materials, care lines, dimensions note, delivery text, and the availability slug. Warranty text is not in the blob.

Scoring, for a trimmed lowercase query:

- Split into tokens on whitespace.
- Exact match of the full query against name, SKU, or slug: +40.
- The full query string appears anywhere in the blob: +16.
- For each token that appears in the blob: +4, plus +12 if the name contains it, plus +10 if the SKU or slug contains it, plus +8 if the category slug contains it. A token that misses the blob is skipped.
- If no token hits, the score is forced to 0 even if the exact-match bonuses were applied. A multi-word query therefore requires every matching decision to be per token; the full-string +16 still applies only when the whole phrase is in the blob, but a zero-hit token loop zeroes the score.
- If at least one token hits, add `hits * 6`.
- Results with score 0 are removed.
- Sort by score descending, then by name ascending.

Header search shows the first 8 of that list. The search page shows all of them, and keeps this order while sort stays on “featured”.

Examples of what a query can hit because of the blob: a colour name such as “sage”, a collection name such as “Signature”, a material such as “foam”, the size text “180 × 200 cm”, the SKU `VH-HOME-LUMEN`, or the availability word `on-request` (the slug, not the label “Available on request”).

---

## 10. Related products

`getRelatedProducts` walks the catalogue in array order, skips the current slug, keeps an item if the category matches or any collection overlaps, and stops at four.

Because divan beds are consecutive and share categories, the related row for an early bed is the next four beds. Kuma’s related row is Atria, Capella, Rana, and Corvus. Later beds start including mattresses and furniture once collection overlap is the only link left, still capped at four and still in array order. It is not a “customers also viewed” ranking.

---

## 11. Images on disk

`public/images/og.png` is the social preview. It is not used as a page hero.

`public/images/divan/` holds 80 PNG photographs, one per bed-and-colour pair that the data lists. Nothing in the data points at a missing file, and there is no extra PNG for a colour the data omits.

| Style folder | Files |
| --- | --- |
| adelphi, atria, capella, corvus, dorchester, kuma, torre, umbra | 7 each: beige, blue, charcoal, cream, grey, sage, stone |
| mira | 6: beige, blue, charcoal, cream, grey, sage |
| rana | 6: beige, blue, charcoal, cream, sage, stone |
| ritz | 6: beige, blue, charcoal, cream, sage, stone |
| waldorf | 6: beige, charcoal, cream, grey, sage, stone |

Filename pattern: `{style}-divan-bed-{colour}.png`.

Every other photograph is a remote Unsplash URL. The pages that use them directly, beyond product data, are:

| Place | Photo id |
| --- | --- |
| Home editorial | `photo-1616594039964-ae9021a400a0` |
| Home category tiles | the category images (two local, three Unsplash) |
| About, first photo | `photo-1616594039964-ae9021a400a0` |
| About, second photo | `photo-1555041469-a586c61ea9bc` |
| Contact side image | `photo-1615874959474-d609969a20ed` |
| Collection cards | the five collection images |

Unsplash parameters are `auto=format&fit=crop&w=1400&q=80` on categories, collections, and these page-level images, and `w=1600` on product shot helpers. The site will show a broken image for those blocks if Unsplash is blocked. Divan beds do not depend on Unsplash.

There is no favicon in `app/` or `public/`.

---

## 12. What the interface never does

These are absent from the current source, not planned features:

- No payment, no tax, no shipping price, no promo codes, no currency switch. LKR only.
- No user accounts, no order history page, no email or WhatsApp send. The enquiry never leaves the browser except by the visitor emailing hello@valterixassets.com themselves.
- No admin, no inventory editor, no CMS. Changing the catalogue means editing `data/*.ts` and rebuilding.
- No reviews, no stock counts, no lead-time numbers, no showroom appointment calendar.
- No 3D viewer and no fabric zoom. The customiser swaps a still image per colour. Size and mattress do not change the photograph.
- No headboard picker on a product, despite the headboard table in `data/options.ts`.
- The order form collects WhatsApp, delivery address, colour, size, mattress, quantity, preferred date, and a reference image, and then does not put those fields into the saved request. Address is required on the form and then discarded. Only the file’s name can appear on the thank-you screen, and only for the empty-cart “I know the piece” path.
- “Request this configuration” and “Order this piece” put the slug in `?product=` and do not carry the configuration. If the cart already has lines, the order form hides the product dropdown entirely, so that query is unused.
- Compare has no navigation entry.
- The mobile header has no Order button.
- Quick view does not close on backdrop click or Escape, and it can reuse the previous product’s colour id.
- The shop availability filter ignores colour-level status, so Pre-order matches nothing, and Atria appears under In stock for every Atria colour.
- Cart lines show the size id in lowercase and hide the mattress.
- `optionLabel` is unused. `--color-brand-light` is unused.
- No automated tests, no lint script in `package.json`, no CI config in the project.
- No cookie banner. The only storage is the four `localStorage` keys above. There is no analytics snippet in the layout.

---

## 13. How a visitor moves through the site

1. Land on the home page, or open Shop, a category, or a collection.
2. Filter or search. Open a card, a quick view, or the product page.
3. On a divan, change colour, size, and mattress. The price is base plus those adjustments. “From” always means the cheapest default, which is single and no mattress, except Waldorf Mattress, whose default size is double.
4. Save a slug to the wishlist, or pin up to three slugs for compare.
5. Add the configured quote to the enquiry cart. Repeating the same configuration increases quantity. A different colour or size is a separate line.
6. Review the cart, then submit the order form. With lines in the cart, the form sends customer name, phone, email, city, notes, and the lines. It also requires an address and offers WhatsApp, but those two are not stored.
7. The thank-you screen says the team will be in touch. The request is in `vx-home-last-request` on that browser. The cart is now empty. No message has been transmitted.

That is the whole commercial loop the site implements today.
