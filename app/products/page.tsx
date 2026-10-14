import { Suspense } from "react";
import { ProductsShop } from "../../components/ProductsShop";
import { apiGet } from "../../lib/api";
import type { CategoryNode, SectionKey } from "../../lib/types";

export const metadata = { title: "Products" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const section: SectionKey = query.section === "hotel" ? "hotel" : "home";
  const [homeTree, hotelTree] = await Promise.all([
    apiGet<{ data: CategoryNode[] }>("/public/category-tree?section=home"),
    apiGet<{ data: CategoryNode[] }>("/public/category-tree?section=hotel"),
  ]);

  return (
    <Suspense fallback={<p className="px-4 py-16 text-muted">Loading the catalogue…</p>}>
      <ProductsShop
        initialSection={section}
        homeTree={homeTree?.data?.[0]?.children ?? []}
        hotelTree={hotelTree?.data?.[0]?.children ?? []}
      />
    </Suspense>
  );
}
