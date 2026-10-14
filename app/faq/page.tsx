import { apiGet } from "../../lib/api";
import type { SiteSettings } from "../../lib/types";

export const metadata = { title: "FAQ" };

export default async function Page() {
  const settings = await apiGet<{ data: SiteSettings }>("/public/settings");
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-5xl font-medium">FAQ</h1>
      <dl className="mt-8 space-y-6">
        {(settings?.data.pages?.faq ?? []).map((item) => (
          <div key={item.q}><dt className="font-medium">{item.q}</dt><dd className="mt-1 text-sm text-muted">{item.a}</dd></div>
        ))}
      </dl>
    </div>
  );
}
