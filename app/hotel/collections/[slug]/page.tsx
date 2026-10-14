import { Catalogue } from "../../../../components/Catalogue";
import { apiGet } from "../../../../lib/api";
import type { ProductCard } from "../../../../lib/types";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await apiGet<{ data: { name: string; summary: string }; products: { data: ProductCard[]; meta: { total: number } } }>(`/public/collections/${slug}?section=hotel`);
  if (!payload) return <p className="px-4 py-16">That collection is not available.</p>;
  return <Catalogue section="hotel" title={payload.data.name} summary={payload.data.summary} products={payload.products.data} total={payload.products.meta.total} />;
}
