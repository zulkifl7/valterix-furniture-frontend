# Catalogue migration

The public site no longer prices products from local TypeScript files. Home and Hotel catalogues come from the API.

## What was seeded

- 19 published Home products: 12 divan beds, Dorchester and Waldorf mattresses, Mira bedside, Torre wardrobe, Nera sofa, Halden dining table, and Lumen floor lamp.
- The same 19 records were copied into Hotel and published, so the hotel catalogue is usable on first run. A later copy from the admin starts as a draft.
- Hotel SKUs insert `HOT` after `VH-` (for example `VH-BED-KUMA` becomes `VH-HOT-BED-KUMA`). Slugs can repeat across sections and stay unique inside one section.
- Categories were mapped along the ancestor path only: Bedroom Furniture to Hotel Bedroom Furniture, Living Room Furniture to Hotel Lounge Furniture, Dining Room Furniture to Hotel Dining Furniture, Lighting & Accessories to Hotel Lighting & Accessories.
- Hotel chemical, housekeeping, and equipment categories exist and stay empty. No chemical products were invented.
- Stock-only products, quantity 1: Dorchester mattress, Mira bedside, Halden dining table, Lumen floor lamp. Every other Home product is made to order with quantity 0. Hotel copies inherit those values.
- Lumen is the only sale price: 24000 base, 19000 sale. Quotes add option adjustments and then apply that sale.
- Divan images stay on `/images/divan/...` and are prefixed with the public site URL. Other product shots keep their Unsplash URLs.
- Five Home collections were seeded. Hotel collection rows are created when a copied product still belongs to a collection.

## Behaviour that changed on purpose

- Old `/products`, `/collections`, and `/customise` URLs redirect into the Home catalogue.
- Enquiries are stored before WhatsApp is opened. If `brand.whatsapp` is blank, the success state shows the reference and does not claim a chat was sent.
- An enquiry does not change stock.
- The public JSON never includes `stock_quantity`.
