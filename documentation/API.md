# Valterix Furniture API

Base URL in local development: `http://localhost:8000/api/v1`.

Admin routes use a Sanctum session cookie. Call `GET http://localhost:8000/sanctum/csrf-cookie` with credentials, then send `X-XSRF-TOKEN` on later requests. Public reads do not require a session.

## Public

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | API is up |
| GET | `/public/settings` | Brand, pages, heroes |
| GET | `/public/sections` | Home and Hotel |
| GET | `/public/category-tree?section=home\|hotel` | Nested categories |
| GET | `/public/products` | `section`, `category`, `q`, `sort`, `availability`, `per_page` |
| GET | `/public/products/{slug}?section=` | Detail. No numeric stock |
| POST | `/public/products/{id}/quote` | `{ option_value_ids, quantity }` |
| GET | `/public/collections?section=` | Collections in one section |
| GET | `/public/collections/{slug}?section=` | Collection plus its products |
| POST | `/public/enquiries` | Saves the enquiry, then returns a reference. Honeypot field `website` must be empty |
| POST | `/public/contact-messages` | Saves a contact message |

Availability labels are derived: made to order with quantity 0 is “Made to order”; any positive quantity is “In stock”; stock-only with quantity 0 is “Out of stock”. The quantity itself is omitted from public JSON.

## Admin

`POST /admin/login` with `{ email, password }`. Then:

- `GET /admin/me`, `POST /admin/logout`, `GET /admin/dashboard`, `GET /admin/activity-logs`
- Catalogue role: categories, products, collections, media upload, publish, archive, and `POST /admin/products/{id}/copy` with `{ destination_section }` equal to the opposite section. The copy is a draft.
- Enquiry role: enquiries, status, notes, assignment, contact messages
- Super admin: settings and users

Copying a product creates a new record. It does not link later edits back to the source.
