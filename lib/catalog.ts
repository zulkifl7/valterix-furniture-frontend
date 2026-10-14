import { categories } from "../data/categories";
import { colorName } from "../data/colors";
import { collections } from "../data/collections";
import { fabricColors } from "../data/colors";
import { bedSizes, headboardById, headboards, mattressOptions } from "../data/options";
import { products } from "../data/products";
import type { Product } from "../data/types";

export type Configuration = {
  colorId?: string;
  headboardId?: string;
  sizeId?: string;
  mattressId?: string;
};

export type Quote = {
  available: boolean;
  basePrice: number;
  colorAdjustment: number;
  headboardAdjustment: number;
  sizeAdjustment: number;
  mattressAdjustment: number;
  discount: number;
  finalPrice: number;
  colorId: string;
  headboardId?: string;
  sizeId?: string;
  mattressId?: string;
  image: string;
};

export function getProducts() {
  return products;
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getCollections() {
  return collections;
}

export function getCollectionBySlug(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getColors() {
  return fabricColors;
}

export function getHeadboards() {
  return headboards;
}

export function getFeaturedProducts() {
  return products.filter((product) => product.featured);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.category === slug);
}

export function getProductsByCollection(slug: string) {
  return products.filter((product) => product.collections.includes(slug));
}

export function getRelatedProducts(product: Product) {
  return products
    .filter(
      (item) =>
        item.slug !== product.slug &&
        (item.category === product.category ||
          item.collections.some((collection) => product.collections.includes(collection))),
    )
    .slice(0, 4);
}

function searchBlob(product: Product) {
  const category = categories.find((item) => item.slug === product.category);
  const collectionNames = product.collections.map(
    (slug) => collections.find((item) => item.slug === slug)?.name ?? slug,
  );
  const headboardNames = product.headboardIds.map((id) => headboardById(id)?.name ?? id);
  const sizeNames = bedSizes
    .filter((size) => product.sizeIds.includes(size.id))
    .map((size) => `${size.name} ${size.dimensions}`);
  const mattressNames = mattressOptions
    .filter((item) => product.mattressIds.includes(item.id))
    .map((item) => item.name);
  return [
    product.name,
    product.slug,
    product.sku,
    product.shortDescription,
    product.description,
    product.category,
    category?.name ?? "",
    ...product.collections,
    ...collectionNames,
    ...product.colors.flatMap((color) => [color.id, colorName(color.id)]),
    ...product.headboardIds,
    ...headboardNames,
    ...sizeNames,
    ...mattressNames,
    ...product.materials,
    ...product.care,
    product.dimensionsNote,
    product.delivery,
    product.availability,
  ]
    .join(" ")
    .toLowerCase();
}

export function searchProducts(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return products;
  const tokens = needle.split(/\s+/).filter(Boolean);

  return products
    .map((product) => {
      const blob = searchBlob(product);
      const name = product.name.toLowerCase();
      const sku = product.sku.toLowerCase();
      const slug = product.slug.toLowerCase();
      let score = 0;
      let hits = 0;
      if (name === needle || sku === needle || slug === needle) score += 40;
      if (blob.includes(needle)) score += 16;
      for (const token of tokens) {
        if (!blob.includes(token)) continue;
        hits += 1;
        if (name.includes(token)) score += 12;
        if (sku.includes(token) || slug.includes(token)) score += 10;
        if (product.category.includes(token)) score += 8;
        score += 4;
      }
      if (hits === 0) score = 0;
      else score += hits * 6;
      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .map((item) => item.product);
}

export function defaultConfiguration(product: Product): Configuration {
  const color = product.colors.find((item) => item.availability !== "unavailable") ?? product.colors[0];
  return {
    colorId: color?.id,
    headboardId: product.headboardIds[0],
    sizeId: product.sizeIds[0],
    mattressId: product.mattressIds[0],
  };
}

export function quoteProduct(product: Product, input: Configuration = {}): Quote {
  const fallback = defaultConfiguration(product);
  const colorId = input.colorId ?? fallback.colorId ?? product.colors[0]?.id ?? "";
  const color = product.colors.find((item) => item.id === colorId) ?? product.colors[0];
  const headboardId = product.headboardIds.length
    ? input.headboardId ?? fallback.headboardId
    : undefined;
  const sizeId = product.sizeIds.length ? input.sizeId ?? fallback.sizeId : undefined;
  const mattressId = product.mattressIds.length
    ? input.mattressId ?? fallback.mattressId
    : undefined;
  const headboard = headboardId ? headboardById(headboardId) : undefined;
  const size = bedSizes.find((item) => item.id === sizeId);
  const mattress = mattressOptions.find((item) => item.id === mattressId);
  const available = color != null && color.availability !== "unavailable";
  const discount =
    product.salePrice != null ? Math.max(product.basePrice - product.salePrice, 0) : 0;
  const colorAdjustment = color?.adjustment ?? 0;
  const headboardAdjustment = headboard?.adjustment ?? 0;
  const sizeAdjustment = size?.adjustment ?? 0;
  const mattressAdjustment = mattress?.adjustment ?? 0;
  const finalPrice = available
    ? product.basePrice +
      colorAdjustment +
      headboardAdjustment +
      sizeAdjustment +
      mattressAdjustment -
      discount
    : 0;

  return {
    available,
    basePrice: product.basePrice,
    colorAdjustment,
    headboardAdjustment,
    sizeAdjustment,
    mattressAdjustment,
    discount,
    finalPrice,
    colorId,
    headboardId,
    sizeId,
    mattressId,
    image: color?.image ?? "",
  };
}

export function startingPrice(product: Product) {
  return quoteProduct(product, defaultConfiguration(product)).finalPrice;
}

export type ShopFilters = {
  category?: string;
  collection?: string;
  color?: string;
  headboard?: string;
  availability?: string;
  query?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "name";
};

export function filterProducts(filters: ShopFilters) {
  let list = filters.query ? searchProducts(filters.query) : [...products];
  if (filters.category) list = list.filter((product) => product.category === filters.category);
  if (filters.collection) {
    list = list.filter((product) => product.collections.includes(filters.collection as string));
  }
  if (filters.color) {
    list = list.filter((product) =>
      product.colors.some(
        (color) => color.id === filters.color && color.availability !== "unavailable",
      ),
    );
  }
  if (filters.headboard) {
    list = list.filter((product) => product.headboardIds.includes(filters.headboard as string));
  }
  if (filters.availability) {
    list = list.filter((product) => product.availability === filters.availability);
  }
  const sort = filters.sort ?? "featured";
  if (filters.query && sort === "featured") return list;
  return [...list].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "price-asc") return startingPrice(a) - startingPrice(b);
    if (sort === "price-desc") return startingPrice(b) - startingPrice(a);
    return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name);
  });
}
