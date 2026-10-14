import { notFound } from "next/navigation";
import { Catalogue } from "../components/Catalogue";
import { apiGet } from "./api";
import type { ProductCard, SectionKey } from "./types";

export async function renderCatalogue(section: SectionKey, path: string[], query: Record<string, string | string[] | undefined>) {
  const category = path.join("/");
  const sort = typeof query.sort === "string" ? query.sort : "featured";
  const availability = typeof query.availability === "string" ? query.availability : "";
  const search = new URLSearchParams({ section, sort, per_page: "24" });
  if (category) search.set("category", category);
  if (availability) search.set("availability", availability);
  const payload = await apiGet<{ data: ProductCard[]; meta: { total: number } }>(`/public/products?${search.toString()}`);
  if (!payload) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-muted">The catalogue could not be loaded. Start the API and refresh.</p>;
  }
  const crumbs = [{ name: section === "home" ? "Home" : "Hotel", href: `/${section}/` }];
  path.forEach((slug, index) => {
    crumbs.push({ name: slug.replace(/-/g, " "), href: `/${section}/categories/${path.slice(0, index + 1).join("/")}/` });
  });
  return (
    <Catalogue
      section={section}
      title={path.length ? path[path.length - 1].replace(/-/g, " ") : section === "home" ? "Home catalogue" : "Hotel catalogue"}
      summary={section === "hotel" ? "Hotel furniture and supply categories. Prices are indicative and confirmed before making." : "Household furniture. Prices are indicative catalogue figures in LKR."}
      breadcrumb={crumbs}
      products={payload.data}
      total={payload.meta.total}
      categoryPath={category ? `${category}/` : ""}
    />
  );
}

export async function renderProduct(section: SectionKey, slug: string) {
  const payload = await apiGet<{ data: import("./types").ProductDetail; related: ProductCard[] }>(`/public/products/${slug}?section=${section}`);
  if (!payload) notFound();
  const { ProductPanel } = await import("../components/ProductPanel");
  const { ProductCard } = await import("../components/ProductCard");
  const product = payload.data;
  const crumbs = (product.category?.breadcrumb ?? []).filter((item) => !item.is_root);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <a href={`/${section}/`}>{section === "home" ? "Home" : "Hotel"}</a>
        {crumbs.map((item, index) => (
          <span key={item.id}> / <a href={`/${section}/categories/${crumbs.slice(0, index + 1).map((crumb) => crumb.slug).join("/")}/`}>{item.name}</a></span>
        ))}
      </nav>
      <ProductPanel product={product} />
      <dl className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
        <div><dt className="font-medium">Materials</dt><dd className="text-muted">{product.materials.join(" · ")}</dd></div>
        <div><dt className="font-medium">Dimensions</dt><dd className="text-muted">{product.dimensions}</dd></div>
        <div><dt className="font-medium">Care</dt><dd className="text-muted">{product.care}</dd></div>
        <div><dt className="font-medium">Warranty</dt><dd className="text-muted">{product.warranty_note}</dd></div>
      </dl>
      {payload.related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-medium">Related in {section}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {payload.related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      )}
    </div>
  );
}
