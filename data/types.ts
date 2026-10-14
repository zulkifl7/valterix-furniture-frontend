export type Availability =
  | "in-stock"
  | "limited"
  | "made-to-order"
  | "pre-order"
  | "on-request"
  | "unavailable";

export type ProductColor = {
  id: string;
  adjustment: number;
  image: string;
  availability: Availability;
};

export type Headboard = {
  id: string;
  name: string;
  description: string;
  adjustment: number;
};

export type FabricColor = {
  id: string;
  name: string;
  hex: string;
};

export type SizeOption = {
  id: string;
  name: string;
  adjustment: number;
  dimensions: string;
};

export type MattressOption = {
  id: string;
  name: string;
  adjustment: number;
  description: string;
};

export type Category = {
  slug: string;
  name: string;
  summary: string;
  image: string;
};

export type Collection = {
  slug: string;
  name: string;
  summary: string;
  image: string;
};

export type Product = {
  slug: string;
  sku: string;
  name: string;
  category: string;
  collections: string[];
  shortDescription: string;
  description: string;
  basePrice: number;
  salePrice?: number;
  featured: boolean;
  customisable: boolean;
  colors: ProductColor[];
  headboardIds: string[];
  sizeIds: string[];
  mattressIds: string[];
  materials: string[];
  care: string[];
  dimensionsNote: string;
  delivery: string;
  warranty: string;
  availability: Availability;
};
