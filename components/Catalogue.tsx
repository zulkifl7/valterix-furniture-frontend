import Link from "next/link";
import { ProductCard } from "./ProductCard";
import type { ProductCard as Card, SectionKey } from "../lib/types";

export function Catalogue({
  section,
  title,
  summary,
  breadcrumb,
  products,
  total,
  categoryPath = "",
}: {
  section: SectionKey;
  title: string;
  summary?: string | null;
  breadcrumb?: Array<{ name: string; href: string }>;
  products: Card[];
  total: number;
  categoryPath?: string;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      {breadcrumb && (
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
          {breadcrumb.map((item, index) => (
            <span key={item.href}>
              {index > 0 && " / "}
              <Link href={item.href}>{item.name}</Link>
            </span>
          ))}
        </nav>
      )}
      <p className="text-xs uppercase tracking-[0.16em] text-accent">{section}</p>
      <h1 className="mt-2 text-4xl font-medium sm:text-5xl">{title}</h1>
      {summary && <p className="mt-3 max-w-2xl text-muted">{summary}</p>}
      <form className="mt-6 flex flex-wrap gap-3" action={`/${section}/categories/${categoryPath}`}>
        <label className="text-sm">Sort
          <select name="sort" className="ml-2 h-11 rounded-lg border border-line bg-surface px-3" defaultValue="featured">
            <option value="featured">Featured</option>
            <option value="price_asc">Price, low to high</option>
            <option value="price_desc">Price, high to low</option>
            <option value="name">Name</option>
          </select>
        </label>
        <label className="text-sm">Availability
          <select name="availability" className="ml-2 h-11 rounded-lg border border-line bg-surface px-3" defaultValue="">
            <option value="">Any</option>
            <option value="in_stock">In stock</option>
            <option value="made_to_order">Made to order</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        </label>
        <button type="submit" className="h-11 rounded-lg border border-line px-4 text-sm">Apply</button>
        <Link href={`/${section}/categories/${categoryPath}`} className="self-center text-sm text-accent">Clear filters</Link>
      </form>
      <p className="mt-6 text-sm text-muted">{total} {total === 1 ? "piece" : "pieces"}</p>
      {products.length === 0 ? (
        <p className="mt-6 rounded-xl bg-soft p-8 text-sm text-muted">No products in this category yet.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
