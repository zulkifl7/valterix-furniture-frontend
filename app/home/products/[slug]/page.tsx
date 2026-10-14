import type { Metadata } from "next";
import { apiGet } from "../../../../lib/api";
import { renderProduct } from "../../../../lib/catalogue-page";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const payload = await apiGet<{ data: { name: string; short_description: string | null } }>(`/public/products/${slug}?section=home`);
  return { title: payload?.data.name ?? "Product", description: payload?.data.short_description ?? undefined };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderProduct("home", slug);
}
