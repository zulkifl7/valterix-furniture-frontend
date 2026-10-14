"use client";

import { useEffect, useState } from "react";
import { formatLkr } from "../../lib/money";
import { apiGet } from "../../lib/api";
import { useStore } from "../../lib/store";
import type { ProductDetail } from "../../lib/types";

export default function Page() {
  const { compare, toggleCompare } = useStore();
  const [products, setProducts] = useState<ProductDetail[]>([]);
  useEffect(() => {
    Promise.all(compare.map((item) => apiGet<{ data: ProductDetail }>(`/public/products/${item.slug}?section=${item.section}`))).then((rows) => {
      setProducts(rows.flatMap((row) => (row ? [row.data] : [])));
    });
  }, [compare]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-5xl font-medium">Compare</h1>
      <p className="mt-2 text-sm text-muted">Up to three pieces, saved on this device. Open Compare from the header.</p>
      {products.length === 0 ? <p className="mt-8 text-muted">Add pieces with the compare icon.</p> : (
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="rounded-xl border border-line bg-surface p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-faint">{product.section}</p>
              <img src={product.image?.url} alt={product.image?.alt ?? product.name} className="mt-3 aspect-[4/5] w-full rounded-lg object-cover" />
              <h2 className="mt-3 text-2xl font-medium">{product.name}</h2>
              <p className="text-sm text-muted">{product.short_description}</p>
              <p className="mt-2 text-sm tabular">From {formatLkr(product.starting_price)}</p>
              <p className="text-sm">{product.availability_label}</p>
              <button type="button" onClick={() => toggleCompare({ section: product.section, slug: product.slug })} className="mt-3 text-sm text-accent">Remove</button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
