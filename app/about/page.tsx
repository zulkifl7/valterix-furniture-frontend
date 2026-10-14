import { apiGet } from "../../lib/api";
import type { SiteSettings } from "../../lib/types";

export const metadata = { title: "About" };

export default async function Page() {
  const settings = await apiGet<{ data: SiteSettings }>("/public/settings");
  const paragraphs = settings?.data.pages?.about ?? [];
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.16em] text-accent">About</p>
      <h1 className="mt-2 text-5xl font-medium">Furniture for home and hotel.</h1>
      <div className="mt-6 space-y-4 text-muted">{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </article>
  );
}
