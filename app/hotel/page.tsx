import { CategoryStrip, HeroBreadcrumb, PhotoHero, icons } from "../../components/DesignHero";
import { ProductCard } from "../../components/ProductCard";
import { apiGet } from "../../lib/api";
import type { ProductCard as Card } from "../../lib/types";

export const metadata = { title: "Hotel Solutions" };

export default async function Page() {
  const products = await apiGet<{ data: Card[] }>("/public/products?section=hotel&sort=featured&per_page=8");

  return (
    <div>
      <PhotoHero
        image="/images/design/hotel-hero.png"
        alt="Golden-hour tropical resort lobby with lounge seating"
        overlay="hotel"
        breadcrumb={<HeroBreadcrumb current="Hotel Solutions" />}
        eyebrow="Hotel Solutions"
        title="Elevate Every"
        accent="Guest Experience."
        body="Complete furniture and interior solutions for hotels, resorts and hospitality spaces. Built for comfort, durability and timeless style."
        primary={{ href: "/products/?section=hotel", label: "Explore Hotel Products" }}
        secondary={{ href: "/order/", label: "Get a Quote" }}
        features={[
          { icon: icons.building, label: "Built for Hospitality" },
          { icon: icons.shield, label: "Durable & Long Lasting" },
          { icon: icons.settings, label: "Custom Solutions for Your Property" },
          { icon: icons.truck, label: "Reliable Supply & Service" },
        ]}
      >
        <CategoryStrip
          items={[
            {
              href: "/products/?section=hotel&category=hotel-bedroom-furniture",
              title: "Hotel Bedroom Furniture",
              detail: "Beds, mattresses, wardrobes & more",
              image: "/images/design/home-furniture-hero.png",
            },
            {
              href: "/products/?section=hotel&category=hotel-lounge-furniture",
              title: "Hotel Living & Lounge",
              detail: "Sofas, lounge chairs, tables & more",
              image: "/images/design/hotel-hero.png",
            },
            {
              href: "/products/?section=hotel&category=cleaning-chemicals",
              title: "Cleaning Chemicals",
              detail: "Cleaning, sanitation & hygiene solutions",
              image: "/images/design/about-nook.png",
            },
            {
              href: "/products/?section=hotel&category=housekeeping-supplies",
              title: "Housekeeping Supplies",
              detail: "Linen, towels, amenities & more",
              image: "/images/design/home-card-bedroom.png",
            },
          ]}
        />
      </PhotoHero>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="text-4xl font-medium">Hotel pieces</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(products?.data ?? []).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
}
