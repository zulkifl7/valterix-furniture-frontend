import Link from "next/link";
import { apiGet } from "../../../lib/api";

export const metadata = { title: "Hotel collections" };

export default async function Page() {
  const payload = await apiGet<{ data: Array<{ slug: string; name: string; summary: string }> }>("/public/collections?section=hotel");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.16em] text-accent">Hotel</p>
      <h1 className="mt-2 text-5xl font-medium">Collections</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {(payload?.data ?? []).map((collection) => (
          <Link key={collection.slug} href={`/hotel/collections/${collection.slug}/`} className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-2xl font-medium">{collection.name}</h2>
            <p className="mt-2 text-sm text-muted">{collection.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
