"use client";

import { useEffect, useMemo, useState } from "react";
import { apiPost } from "../lib/api";
import { formatLkr } from "../lib/money";
import { useStore } from "../lib/store";
import type { ProductDetail, Quote } from "../lib/types";

export function ProductPanel({ product }: { product: ProductDetail }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const initial = useMemo(() => {
    const ids: number[] = [];
    for (const group of product.option_groups) {
      const value = group.values.find((item) => item.availability !== "unavailable");
      if (group.is_required && value) ids.push(value.id);
    }
    return ids;
  }, [product]);
  const [selected, setSelected] = useState<number[]>(initial);
  const [quantity, setQuantity] = useState(product.minimum_order_quantity_enabled ? product.minimum_order_quantity ?? 1 : 1);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");
  const saved = wishlist.some((item) => item.section === product.section && item.slug === product.slug);
  const out = product.availability_key === "out_of_stock";
  const selectedColour = product.option_groups
    .filter((group) => group.option_type === "colour" || group.option_type === "color")
    .flatMap((group) => group.values)
    .find((value) => selected.includes(value.id) && value.image_url);
  const image = selectedColour?.image_url ?? quote?.options.find((option) => option.image_url)?.image_url ?? product.media[0]?.url;

  useEffect(() => {
    setSelected(initial);
  }, [initial, product.id]);

  useEffect(() => {
    let cancelled = false;
    apiPost<{ data?: Quote; message?: string; errors?: Record<string, string[]> }>(`/public/products/${product.id}/quote`, {
      option_value_ids: selected,
      quantity,
    }).then((result) => {
      if (cancelled) return;
      if (result.ok && result.body.data) {
        setQuote(result.body.data);
        setError("");
      } else {
        setQuote(null);
        setError(Object.values(result.body.errors ?? {}).flat()[0] ?? result.body.message ?? "This combination is not available.");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [product.id, quantity, selected]);

  function choose(groupId: number, valueId: number) {
    const group = product.option_groups.find((item) => item.id === groupId);
    const others = selected.filter((id) => !group?.values.some((value) => value.id === id));
    setSelected([...others, valueId]);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <img src={image} alt={product.image?.alt ?? product.name} className="aspect-[4/5] w-full rounded-2xl object-cover" />
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-faint">{product.section} · {product.sku} · {product.availability_label}</p>
        <h1 className="mt-2 text-4xl font-medium sm:text-5xl">{product.name}</h1>
        <p className="mt-3 leading-7 text-muted">{product.description}</p>
        <p className="mt-4 text-2xl tabular">{quote ? formatLkr(quote.indicative_total) : formatLkr(product.starting_price)}</p>
        <p className="mt-1 text-sm text-muted">{quote?.price_note ?? product.price_note}</p>
        {quote && (
          <ul className="mt-3 space-y-1 text-sm text-muted">
            <li className="flex justify-between"><span>Base</span><span className="tabular">{formatLkr(quote.base_price)}</span></li>
            {quote.adjustments !== 0 && <li className="flex justify-between"><span>Options</span><span className="tabular">{formatLkr(quote.adjustments)}</span></li>}
            {quote.discount !== 0 && <li className="flex justify-between"><span>Catalogue reduction</span><span className="tabular">-{formatLkr(quote.discount)}</span></li>}
          </ul>
        )}
        {product.option_groups.map((group) => (
          <fieldset key={group.id} className="mt-5">
            <legend className="text-sm font-medium">{group.label}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.values.map((value) => {
                const active = selected.includes(value.id);
                const disabled = value.availability === "unavailable";
                return (
                  <button key={value.id} type="button" disabled={disabled} aria-pressed={active} onClick={() => choose(group.id, value.id)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm disabled:opacity-40 ${active ? "border-ink bg-ink text-page" : "border-line bg-surface"}`}>
                    {value.color_hex && <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ background: value.color_hex }} />}
                    {value.label}
                    {value.price_adjustment ? <span className="text-xs opacity-80">+{formatLkr(value.price_adjustment)}</span> : null}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
        <label className="mt-5 block text-sm">
          Quantity {product.unit_enabled ? `(${product.unit_type})` : ""}
          {product.minimum_order_quantity_enabled && <span className="text-muted"> · minimum {product.minimum_order_quantity}</span>}
          <input type="number" min={product.minimum_order_quantity_enabled ? product.minimum_order_quantity ?? 1 : 1} step={product.unit_type === "litre" ? "0.1" : "1"} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="mt-1 h-11 w-28 rounded-lg border border-line bg-surface px-3" />
        </label>
        {error && <p className="mt-3 text-sm text-muted">{error}</p>}
        {out && <p className="mt-3 text-sm">This piece is out of stock. You can still send an availability enquiry.</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!quote}
            onClick={() => quote && addToCart({
              productId: product.id,
              section: product.section,
              slug: product.slug,
              name: product.name,
              image: image ?? "",
              quantity: quote.quantity,
              unitPrice: quote.unit_price,
              optionValueIds: selected,
              summary: quote.options.map((option) => `${option.group_label}: ${option.label}`).join(" · "),
              unitLabel: quote.unit_label,
            })}
            className="rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-ink disabled:opacity-40"
          >
            {out ? "Request availability" : "Add to enquiry cart"}
          </button>
          <button type="button" onClick={() => toggleWishlist({ section: product.section, slug: product.slug })} className="rounded-lg border border-line px-5 py-3 text-sm">{saved ? "Saved" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}
