"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiGet, apiPost } from "../../lib/api";
import type { SiteSettings } from "../../lib/types";

export default function Page() {
  const [brand, setBrand] = useState<SiteSettings["brand"]>();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    apiGet<{ data: SiteSettings }>("/public/settings").then((payload) => setBrand(payload?.data.brand));
  }, []);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await apiPost<{ message?: string }>("/public/contact-messages", {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      subject: data.get("subject"),
      message: data.get("message"),
      website: "",
    });
    if (!response.ok) {
      setError("The message was not saved.");
      return;
    }
    setSent(true);
  }
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 lg:grid-cols-2">
      <div>
        <h1 className="text-5xl font-medium">Contact</h1>
        <p className="mt-3 text-muted">{brand?.hours}</p>
        <p className="mt-4 text-sm">{brand?.email}</p>
        <p className="text-sm text-muted">{brand?.address}</p>
      </div>
      {sent ? <p>Your message is saved. The team will review it.</p> : (
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="name" required placeholder="Name" className="h-11 w-full rounded-lg border border-line bg-surface px-3" />
          <input name="email" type="email" required placeholder="Email" className="h-11 w-full rounded-lg border border-line bg-surface px-3" />
          <input name="phone" placeholder="Phone (optional)" className="h-11 w-full rounded-lg border border-line bg-surface px-3" />
          <input name="subject" required placeholder="Subject" className="h-11 w-full rounded-lg border border-line bg-surface px-3" />
          <textarea name="message" required rows={5} placeholder="Message" className="w-full rounded-lg border border-line bg-surface px-3 py-2" />
          {error && <p className="text-sm">{error}</p>}
          <button type="submit" className="rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-ink">Send message</button>
        </form>
      )}
    </div>
  );
}
