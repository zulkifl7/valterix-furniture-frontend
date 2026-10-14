import { apiGet } from "../../lib/api";
import type { SiteSettings } from "../../lib/types";

export const metadata = { title: "Care and warranty" };

export default async function Page() {
  const settings = await apiGet<{ data: SiteSettings }>("/public/settings");
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-5xl font-medium">Care</h1>
      <div className="mt-6 space-y-4 text-muted">{(settings?.data.pages?.care ?? []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <h2 id="warranty" className="mt-10 text-4xl font-medium">Warranty</h2>
      <div className="mt-4 space-y-4 text-muted">{(settings?.data.pages?.warranty ?? []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </article>
  );
}
