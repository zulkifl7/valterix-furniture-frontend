import Link from "next/link";
import { apiGet } from "../../../lib/api";
import type { ProductCard } from "../../../lib/types";

export const metadata = { title: "Customise a bed" };

export default async function Page() {
  const payload = await apiGet<{ data: ProductCard[] }>("/public/products?section=home&category=bedroom-furniture/beds-divans&per_page=24");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.16em] text-accent">Home</p>
      <h1 className="mt-2 text-5xl font-medium">Customise a bed</h1>
      <p className="mt-3 max-w-xl text-muted">Choose a divan. Colour, size and mattress are set on the product page, and the price is calculated by the catalogue.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(payload?.data ?? []).map((product) => (
          <Link key={product.id} href={`/home/products/${product.slug}/`} className="overflow-hidden rounded-xl border border-line bg-surface">
            <img src={product.image?.url} alt={product.image?.alt ?? product.name} className="aspect-[4/3] w-full object-cover" />
            <span className="block px-3 py-3 text-sm font-medium">{product.name.replace(" Divan Bed", "")}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
