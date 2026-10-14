"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "../../components/ProductCard";
import { apiGet } from "../../lib/api";
import { useStore } from "../../lib/store";
import type { ProductCard as Card } from "../../lib/types";

export default function Page() {
  const { wishlist } = useStore();
  const [products, setProducts] = useState<Card[]>([]);
  useEffect(() => {
    Promise.all(wishlist.map((item) => apiGet<{ data: Card }>(`/public/products/${item.slug}?section=${item.section}`))).then((rows) => {
      setProducts(rows.flatMap((row) => (row ? [row.data] : [])));
    });
  }, [wishlist]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-5xl font-medium">Wishlist</h1>
      <p className="mt-2 text-sm text-muted">Saved on this device.</p>
      {products.length === 0 ? <p className="mt-8 text-muted">Nothing saved yet.</p> : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      )}
    </div>
  );
}
