"use client";

import Link from "next/link";
import { Heart, Scale } from "lucide-react";
import { formatLkr } from "../lib/money";
import { useStore } from "../lib/store";
import type { ProductCard as Card } from "../lib/types";

export function ProductCard({ product }: { product: Card }) {
  const { wishlist, compare, toggleWishlist, toggleCompare, openQuickView } = useStore();
  const piece = { section: product.section, slug: product.slug };
  const saved = wishlist.some((item) => item.section === piece.section && item.slug === piece.slug);
  const compared = compare.some((item) => item.section === piece.section && item.slug === piece.slug);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="relative aspect-[4/5] bg-soft">
        <Link href={`/${product.section}/products/${product.slug}/`} className="block h-full">
          <img src={product.image?.url} alt={product.image?.alt ?? product.name} className="h-full w-full object-cover" />
        </Link>
        <p className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[11px]">{product.availability_label}</p>
        <div className="absolute right-3 top-3 flex gap-2">
          <button type="button" aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={saved} onClick={() => toggleWishlist(piece)} className="grid h-11 w-11 place-items-center rounded-full bg-surface"><Heart size={16} fill={saved ? "currentColor" : "none"} /></button>
          <button type="button" aria-label={compared ? "Remove from comparison" : "Add to comparison"} aria-pressed={compared} onClick={() => toggleCompare(piece)} className="grid h-11 w-11 place-items-center rounded-full bg-surface"><Scale size={16} /></button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-faint">{product.section} · {product.category?.name}</p>
        <h3 className="mt-1 text-lg font-medium"><Link href={`/${product.section}/products/${product.slug}/`}>{product.name}</Link></h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{product.short_description}</p>
        {product.minimum_order_quantity_enabled && <p className="mt-2 text-xs text-muted">Minimum {product.minimum_order_quantity} {product.unit_type}</p>}
        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="text-sm tabular">From {formatLkr(product.starting_price)}</p>
          <button type="button" onClick={() => openQuickView(product)} className="text-sm font-medium text-accent">Quick view</button>
        </div>
      </div>
    </article>
  );
}
