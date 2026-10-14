import Link from "next/link";
import { apiGet } from "../../../lib/api";

export const metadata = { title: "Home collections" };

export default async function Page() {
  const payload = await apiGet<{ data: Array<{ slug: string; name: string; summary: string; image_url: string }> }>("/public/collections?section=home");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.16em] text-accent">Home</p>
      <h1 className="mt-2 text-5xl font-medium">Collections</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {(payload?.data ?? []).map((collection) => (
          <Link key={collection.slug} href={`/home/collections/${collection.slug}/`} className="relative min-h-64 overflow-hidden rounded-2xl">
            <img src={collection.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--vx-page)_92%,transparent)] via-[color-mix(in_srgb,var(--vx-page)_35%,transparent)] to-transparent" />
            <div className="absolute bottom-0 p-6 text-ink">
              <h2 className="text-3xl">{collection.name}</h2>
              <p className="text-sm text-muted">{collection.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
