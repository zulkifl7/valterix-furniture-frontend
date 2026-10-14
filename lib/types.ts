export type SectionKey = "home" | "hotel";

export type Breadcrumb = { id: number; name: string; slug: string; is_root: boolean };

export type CategoryNode = {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_root: boolean;
  children: CategoryNode[];
};

export type ProductCard = {
  id: number;
  section: SectionKey;
  sku: string;
  slug: string;
  name: string;
  short_description: string | null;
  starting_price: number;
  featured: boolean;
  availability_label: string;
  availability_key: string;
  unit_enabled: boolean;
  unit_type: string | null;
  minimum_order_quantity_enabled: boolean;
  minimum_order_quantity: number | null;
  category: { id: number; name: string; slug: string; breadcrumb: Breadcrumb[]; path: string[] } | null;
  image: { url: string; alt: string } | null;
};

export type OptionValue = {
  id: number;
  label: string;
  value: string;
  color_hex: string | null;
  price_adjustment: number;
  availability: string;
  detail: string | null;
  image_url: string | null;
};

export type OptionGroup = {
  id: number;
  label: string;
  option_type: string;
  input_style: string;
  is_required: boolean;
  values: OptionValue[];
};

export type ProductDetail = ProductCard & {
  description: string | null;
  base_price: number;
  sale_price: number | null;
  materials: string[];
  dimensions: string | null;
  care: string | null;
  delivery_note: string | null;
  warranty_note: string | null;
  price_note: string;
  collections: Array<{ slug: string; name: string }>;
  media: Array<{ url: string; alt: string; role: string }>;
  option_groups: OptionGroup[];
};

export type Quote = {
  availability_label: string;
  unit_price: number;
  quantity: number;
  indicative_total: number;
  base_price: number;
  adjustments: number;
  discount: number;
  unit_label: string | null;
  options: Array<{ group_label: string; label: string; value_id: number; image_url: string | null }>;
  price_note: string;
};

export type SiteSettings = {
  brand?: {
    name: string;
    short_name: string;
    tagline: string;
    parent: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    hours: string;
    www_url: string;
  };
  home_hero?: Hero;
  hotel_hero?: Hero;
  pages?: {
    about: string[];
    delivery: string[];
    care: string[];
    warranty: string[];
    faq: Array<{ q: string; a: string }>;
  };
  seo?: { title: string; description: string };
};

export type Hero = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  primary_label: string;
  primary_href: string;
  secondary_label: string;
  secondary_href: string;
};
