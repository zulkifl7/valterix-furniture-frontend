"use client";

import { FormEvent, useState } from "react";
import { apiPost } from "../lib/api";
import { formatLkr } from "../lib/money";
import { useStore } from "../lib/store";

type Result = { reference: string; whatsapp_url: string | null; whatsapp_ready: boolean; message: string };

export function EnquiryForm() {
  const { cart, clearCart, ready } = useStore();
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      whatsapp: String(data.get("whatsapp") ?? ""),
      email: String(data.get("email") ?? ""),
      address: String(data.get("address") ?? ""),
      city: String(data.get("city") ?? ""),
      notes: String(data.get("notes") ?? ""),
      preferred_date: String(data.get("date") ?? "") || null,
      intent: cart.length ? "cart" : "consultation",
      idempotency_key: crypto.randomUUID(),
      website: "",
      items: cart.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        option_value_ids: item.optionValueIds,
      })),
    };
    const response = await apiPost<{ data?: Result; message?: string; errors?: Record<string, string[]> }>("/public/enquiries", payload);
    if (!response.ok || !response.body.data) {
      setPending(false);
      setError(Object.values(response.body.errors ?? {}).flat()[0] ?? response.body.message ?? "The enquiry was not saved.");
      return;
    }
    clearCart();
    if (response.body.data.whatsapp_url) {
      window.location.assign(response.body.data.whatsapp_url);
      return;
    }
    setPending(false);
    setResult(response.body.data);
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-5xl font-medium">Enquiry {result.reference} is saved.</h1>
        <p className="mt-4 leading-7 text-muted">{result.message}</p>
        {result.whatsapp_url ? (
          <a href={result.whatsapp_url} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-ink">Open WhatsApp</a>
        ) : (
          <p className="mt-4 text-sm">WhatsApp is not configured yet. Keep this reference and email the team.</p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_20rem]">
      <form onSubmit={onSubmit} className="space-y-4">
        <p className="text-xs uppercase tracking-[0.16em] text-accent">Order enquiry</p>
        <h1 className="text-5xl font-medium">Tell us what you need.</h1>
        <p className="max-w-xl text-muted">Submitting saves the enquiry first, then opens WhatsApp to +94 70 618 5544 with the details filled in. You still send that message. Nothing is charged.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Full name" required />
          <Field name="phone" label="Phone" required />
          <Field name="whatsapp" label="WhatsApp (optional)" />
          <Field name="email" label="Email" type="email" required />
          <Field name="address" label="Delivery address (optional)" className="sm:col-span-2" />
          <Field name="city" label="City / area (optional)" />
          <Field name="date" label="Preferred date (optional)" type="date" />
        </div>
        <label className="block text-sm">Note
          <textarea name="notes" rows={4} className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2" />
        </label>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        {error && <p className="text-sm">{error}</p>}
        <button type="submit" disabled={pending} className="rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-ink disabled:opacity-40">{pending ? "Saving…" : "Submit enquiry"}</button>
      </form>
      <aside className="h-fit rounded-2xl bg-soft p-5">
        <h2 className="text-2xl font-medium">Enquiry cart</h2>
        {cart.length === 0 ? <p className="mt-3 text-sm text-muted">Nothing is in the cart. You can still ask for a consultation.</p> : (
          <ul className="mt-4 space-y-3 text-sm">
            {cart.map((item) => (
              <li key={item.id}>
                <p className="font-medium">{item.name}</p>
                <p className="text-muted">{item.summary || item.section} · Qty {item.quantity}{item.unitLabel ? ` ${item.unitLabel}` : ""}</p>
                <p className="tabular">{formatLkr(item.unitPrice * item.quantity)}</p>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && <p className="mt-4 font-medium tabular">Illustrated total {formatLkr(total)}</p>}
      </aside>
    </div>
  );
}

function Field({ name, label, type = "text", required, className }: { name: string; label: string; type?: string; required?: boolean; className?: string }) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>{label}
      <input name={name} type={type} required={required} className="mt-1 h-11 w-full rounded-lg border border-line bg-surface px-3" />
    </label>
  );
}
