import Link from "next/link";
import { AboutBand, GatewayCards, HowItWorks, PhotoHero, icons } from "../components/DesignHero";
import { ProductCard } from "../components/ProductCard";
import { apiGet } from "../lib/api";
import type { ProductCard as Card, SiteSettings } from "../lib/types";

export default async function Page() {
  const [settings, products] = await Promise.all([
    apiGet<{ data: SiteSettings }>("/public/settings"),
    apiGet<{ data: Card[] }>("/public/products?section=home&sort=featured&per_page=4"),
  ]);
  const brand = settings?.data.brand;
  const about = settings?.data.pages?.about?.[0];

  return (
    <div>
      <PhotoHero
        fullHeight
        overlay="home"
        image="/images/design/home-hero.png"
        alt="Golden-hour living room with a linen sofa and round coffee table"
        eyebrow="Furniture & Home Interior Solutions"
        title="Everyday Comfort."
        accent="Lasting Quality."
        body="Explore premium furniture and interior solutions for homes and hospitality spaces. Thoughtfully designed. Built for real life."
        primary={{ href: "/home/", label: "Explore Home Furniture" }}
        secondary={{ href: "/hotel/", label: "Explore Hotel Solutions" }}
        features={[
          { icon: icons.armchair, label: "Premium Craftsmanship" },
          { icon: icons.leaf, label: "Modern & Timeless Designs" },
          { icon: icons.truck, label: "Reliable Service" },
          { icon: icons.shield, label: "Built for Lasting Quality" },
        ]}
      >
        <GatewayCards />
      </PhotoHero>

      <HowItWorks />

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-accent">Selected from Home</p>
            <h2 className="mt-3 text-4xl font-medium">Pieces to start with</h2>
          </div>
          <Link href="/home/" className="text-sm font-medium text-accent">View the Home catalogue</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(products?.data ?? []).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <AboutBand
        body={
          about
            ? `${about} We bring together quality furniture, modern design and functional interior solutions for homes, hotels and commercial spaces.`
            : "Valterix Furniture & Home Interior is the household and hospitality catalogue of Valterix Assets (Pvt) Ltd. We bring together quality furniture, modern design and functional interior solutions for homes, hotels and commercial spaces."
        }
        hours={brand?.hours}
        address={brand?.address}
        email={brand?.email}
      />
    </div>
  );
}
