import { CategoryStrip, HeroBreadcrumb, PhotoHero, icons } from "../../components/DesignHero";
import { ProductCard } from "../../components/ProductCard";
import { apiGet } from "../../lib/api";
import type { ProductCard as Card } from "../../lib/types";

export const metadata = { title: "Home Furniture" };

export default async function Page() {
  const products = await apiGet<{ data: Card[] }>("/public/products?section=home&sort=featured&per_page=8");

  return (
    <div>
      <PhotoHero
        image="/images/design/home-furniture-hero.png"
        alt="Golden-hour bedroom suite with a tufted bed and garden view"
        overlay="slash"
        breadcrumb={<HeroBreadcrumb current="Home Furniture" />}
        eyebrow="Home Furniture"
        title="Furnish Your"
        accent="Perfect Home"
        body="Discover premium furniture and home interior solutions designed for modern living. Style, comfort and functionality — all in one place."
        primary={{ href: "/products/?section=home", label: "Explore Home Furniture" }}
        secondary={{ href: "/order/", label: "Get a Quote" }}
        features={[
          { icon: icons.armchair, label: "Modern Designs" },
          { icon: icons.leaf, label: "Premium Materials" },
          { icon: icons.settings, label: "Customisable Options" },
          { icon: icons.shield, label: "Built for Everyday Living" },
        ]}
      >
        <CategoryStrip
          items={[
            { href: "/products/?section=home&category=bedroom-furniture", title: "Bedroom Furniture", detail: "Beds, wardrobes, dressers", icon: icons.bed },
            { href: "/products/?section=home&category=living-room-furniture", title: "Living Room Furniture", detail: "Sofas, TV units, coffee tables", icon: icons.sofa },
            { href: "/products/?section=home&category=dining-room-furniture", title: "Dining Room Furniture", detail: "Dining tables, chairs, cabinets", icon: icons.dining },
            { href: "/products/?section=home&category=lighting-accessories", title: "Home Decor & Accessories", detail: "Lighting, mirrors, rugs & more", icon: icons.lamp },
          ]}
        />
      </PhotoHero>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="text-4xl font-medium">Selected pieces</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(products?.data ?? []).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
}
