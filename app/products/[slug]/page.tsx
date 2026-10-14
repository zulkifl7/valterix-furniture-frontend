import { redirect } from "next/navigation";

const map: Record<string, string> = {
  "divan-beds": "/home/categories/bedroom-furniture/beds-divans/",
  headboards: "/home/categories/bedroom-furniture/beds-divans/",
  mattresses: "/home/categories/bedroom-furniture/mattresses/",
  "bedroom-furniture": "/home/categories/bedroom-furniture/",
  household: "/products/?section=home",
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(map[slug] ?? `/home/products/${slug}/`);
}
