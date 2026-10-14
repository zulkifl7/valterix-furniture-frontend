"use client";

import Link from "next/link";
import { formatLkr } from "../../lib/money";
import { useStore } from "../../lib/store";

export default function Page() {
  const { cart, updateQuantity, removeFromCart } = useStore();
  const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-5xl font-medium">Enquiry cart</h1>
      <p className="mt-2 text-sm text-muted">This is not a payment checkout.</p>
      {cart.length === 0 ? <p className="mt-8 text-muted">The cart is empty. <Link href="/home/" className="text-accent">Browse Home</Link> or <Link href="/hotel/" className="text-accent">Hotel</Link>.</p> : (
        <>
          <ul className="mt-8 divide-y divide-line">
            {cart.map((item) => (
              <li key={item.id} className="flex gap-4 py-4">
                <img src={item.image} alt="" className="h-24 w-20 rounded-lg object-cover" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted">{item.section} · {item.summary}</p>
                  <p className="text-sm tabular">{formatLkr(item.unitPrice)}{item.unitLabel ? ` / ${item.unitLabel}` : ""}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-11 w-11 rounded-lg border border-line">−</button>
                    <span>{item.quantity}</span>
                    <button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-11 w-11 rounded-lg border border-line">+</button>
                    <button type="button" onClick={() => removeFromCart(item.id)} className="ml-2 text-sm text-muted">Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-lg tabular">Illustrated total {formatLkr(total)}</p>
          <Link href="/order/" className="mt-4 inline-flex rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-ink">Submit enquiry</Link>
        </>
      )}
    </div>
  );
}
