"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { apiGet } from "../lib/api";
import type { CategoryNode, ProductCard, SectionKey } from "../lib/types";
import { ProductCard as Card } from "./ProductCard";

type Props = {
  initialSection: SectionKey;
  homeTree: CategoryNode[];
  hotelTree: CategoryNode[];
};

function flatten(nodes: CategoryNode[], parents: string[] = []): Array<{ id: number; name: string; path: string; depth: number }> {
  const rows: Array<{ id: number; name: string; path: string; depth: number }> = [];
  for (const node of nodes) {
    const path = [...parents, node.slug].join("/");
    rows.push({ id: node.id, name: node.name, path, depth: parents.length });
    rows.push(...flatten(node.children ?? [], [...parents, node.slug]));
  }
  return rows;
}

export function ProductsShop({ initialSection, homeTree, hotelTree }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const section = (params.get("section") === "hotel" ? "hotel" : params.get("section") === "home" ? "home" : initialSection) as SectionKey;
  const category = params.get("category") ?? "";
  const availability = params.get("availability") ?? "";
  const sort = params.get("sort") ?? "featured";
  const qParam = params.get("q") ?? "";

  const [query, setQuery] = useState(qParam);
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const categories = useMemo(
    () => flatten(section === "hotel" ? hotelTree : homeTree),
    [homeTree, hotelTree, section],
  );

  function write(next: Record<string, string>) {
    const merged = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) merged.set(key, value);
      else merged.delete(key);
    });
    if (!merged.get("section")) merged.set("section", section);
    router.push(`/products/?${merged.toString()}`);
  }

  useEffect(() => {
    setQuery(qParam);
  }, [qParam]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const search = new URLSearchParams({ section, sort, per_page: "48" });
    if (category) search.set("category", category);
    if (availability) search.set("availability", availability);
    if (qParam.trim()) search.set("q", qParam.trim());
    apiGet<{ data: ProductCard[]; meta: { total: number } }>(`/public/products?${search}`).then((payload) => {
      if (cancelled) return;
      setProducts(payload?.data ?? []);
      setTotal(payload?.meta.total ?? 0);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [availability, category, qParam, section, sort]);

  function onSearch(event: FormEvent) {
    event.preventDefault();
    write({ q: query.trim(), section });
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[16rem_1fr] md:px-8">
      <aside className="vx-scroll space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:self-start lg:pr-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-accent">Products</p>
          <h1 className="mt-2 text-3xl font-medium">Catalogue</h1>
          <p className="mt-2 text-sm text-muted">Every published piece in the selected catalogue. Filters read the live product data.</p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-xl border border-line bg-surface p-1">
          <button
            type="button"
            aria-pressed={section === "home"}
            onClick={() => write({ section: "home", category: "", q: query.trim() })}
            className={`rounded-lg px-3 py-2.5 text-sm font-medium ${section === "home" ? "bg-soft text-ink" : "text-muted"}`}
          >
            Home Furniture
          </button>
          <button
            type="button"
            aria-pressed={section === "hotel"}
            onClick={() => write({ section: "hotel", category: "", q: query.trim() })}
            className={`rounded-lg px-3 py-2.5 text-sm font-medium ${section === "hotel" ? "bg-soft text-ink" : "text-muted"}`}
          >
            Hotel
          </button>
        </div>

        <form onSubmit={onSearch}>
          <label className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3">
            <Search size={16} className="shrink-0 text-faint" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search this catalogue"
              className="h-11 w-full bg-transparent text-sm outline-none"
            />
          </label>
        </form>

        <label className="block text-sm text-muted">
          Availability
          <select
            value={availability}
            onChange={(event) => write({ availability: event.target.value, section })}
            className="mt-1 h-11 w-full rounded-lg border border-line bg-surface px-3 text-ink"
          >
            <option value="">Any</option>
            <option value="in_stock">In stock</option>
            <option value="made_to_order">Made to order</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        </label>

        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-faint">Categories</p>
          <div className="mt-2 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => write({ category: "", section })}
              className={`rounded-lg px-3 py-2 text-left text-sm ${!category ? "bg-soft font-medium" : "text-muted hover:bg-soft/70"}`}
            >
              All {section === "hotel" ? "Hotel" : "Home Furniture"}
            </button>
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => write({ category: item.path, section })}
                className={`rounded-lg px-3 py-2 text-left text-sm ${category === item.path ? "bg-soft font-medium" : "text-muted hover:bg-soft/70"}`}
                style={{ paddingLeft: `${0.75 + item.depth * 0.75}rem` }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {(category || availability || qParam) && (
          <Link href={`/products/?section=${section}`} className="inline-flex text-sm text-accent">
            Clear filters
          </Link>
        )}
      </aside>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">{loading ? "Loading…" : `${total} ${total === 1 ? "piece" : "pieces"}`}</p>
          <label className="text-sm text-muted">
            <span className="sr-only">Sort</span>
            <select
              value={sort}
              onChange={(event) => write({ sort: event.target.value, section })}
              className="h-11 rounded-lg border border-line bg-surface px-3 text-ink"
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price, low to high</option>
              <option value="price_desc">Price, high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>

        {!loading && products.length === 0 ? (
          <p className="mt-6 rounded-xl bg-soft p-8 text-sm text-muted">No pieces match these filters.</p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => <Card key={`${product.section}-${product.id}`} product={product} />)}
          </div>
        )}
      </section>
    </div>
  );
}
