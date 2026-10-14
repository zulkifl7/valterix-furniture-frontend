import type { SectionKey } from "./types";

export type SearchScope = {
  section: SectionKey | "all";
  category?: string;
};

const shared = [
  "/",
  "/about/",
  "/contact/",
  "/search/",
  "/delivery/",
  "/care/",
  "/faq/",
  "/cart/",
  "/wishlist/",
  "/compare/",
  "/order/",
];

function parentCategory(path: string) {
  return path.split("/").filter(Boolean)[0] || undefined;
}

export function searchScope(pathname: string, params?: URLSearchParams | { get: (key: string) => string | null }): SearchScope {
  if (pathname.startsWith("/search") || shared.includes(pathname)) {
    return { section: "all" };
  }

  if (pathname.startsWith("/products")) {
    const section: SectionKey = params?.get("section") === "hotel" ? "hotel" : "home";
    const category = parentCategory(params?.get("category") ?? "");
    return category ? { section, category } : { section };
  }

  if (pathname.startsWith("/hotel")) {
    const match = pathname.match(/^\/hotel\/categories\/(.+)/);
    const category = parentCategory(match?.[1] ?? "");
    return category ? { section: "hotel", category } : { section: "hotel" };
  }

  if (pathname.startsWith("/home")) {
    const match = pathname.match(/^\/home\/categories\/(.+)/);
    const category = parentCategory(match?.[1] ?? "");
    return category ? { section: "home", category } : { section: "home" };
  }

  return { section: "all" };
}

export function searchQuery(scope: SearchScope, q: string, perPage = 8) {
  const search = new URLSearchParams({
    section: scope.section,
    q,
    per_page: String(perPage),
  });
  if (scope.category) search.set("category", scope.category);
  return `/public/products?${search}`;
}

export function searchPlaceholder(scope: SearchScope) {
  if (scope.section === "all") return "Search Home Furniture and Hotel";
  if (scope.category) return `Search this ${scope.section === "hotel" ? "Hotel" : "Home Furniture"} category`;
  return scope.section === "hotel" ? "Search the Hotel catalogue" : "Search the Home Furniture catalogue";
}
