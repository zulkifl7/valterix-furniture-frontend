import { ProductCard } from "../../components/ProductCard";
import { apiGet } from "../../lib/api";
import { searchQuery } from "../../lib/search-scope";
import type { ProductCard as Card, SectionKey } from "../../lib/types";

export const metadata = { title: "Search" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q : "";
  const section = query.section === "hotel" || query.section === "home" || query.section === "all" ? query.section : "all";
  const category = typeof query.category === "string" ? query.category : undefined;
  const payload = await apiGet<{ data: Card[]; meta: { total: number } }>(
    searchQuery({ section: section as SectionKey | "all", category }, q, 48),
  );
  const products = payload?.data ?? [];
  const total = payload?.meta.total ?? 0;
  const scopeLabel = category
    ? `${section === "hotel" ? "Hotel" : "Home Furniture"} · ${category.replace(/-/g, " ")}`
    : section === "all"
      ? "Home Furniture and Hotel"
      : section === "hotel"
        ? "Hotel"
        : "Home Furniture";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <p className="text-xs uppercase tracking-[0.16em] text-accent">Search</p>
      <h1 className="mt-2 text-4xl font-medium sm:text-5xl">{q ? `Search “${q}”` : "Search"}</h1>
      <p className="mt-3 max-w-2xl text-muted">Showing matches in {scopeLabel}.</p>
      <p className="mt-6 text-sm text-muted">{total} {total === 1 ? "piece" : "pieces"}</p>
      {products.length === 0 ? (
        <p className="mt-6 rounded-xl bg-soft p-8 text-sm text-muted">No pieces match that search.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => <ProductCard key={`${product.section}-${product.id}`} product={product} />)}
        </div>
      )}
    </div>
  );
}
