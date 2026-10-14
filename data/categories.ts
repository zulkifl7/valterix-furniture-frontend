import type { Category } from "./types";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

export const categories: Category[] = [
  {
    slug: "divan-beds",
    name: "Divan Beds",
    summary: "Each bed is named for its headboard. Choose the colour, size and mattress.",
    image: "/images/divan/kuma/kuma-divan-bed-beige.png",
  },
  {
    slug: "headboards",
    name: "Headboards",
    summary: "Each headboard style is its own divan bed. The bed name is the headboard.",
    image: "/images/divan/mira/mira-divan-bed-beige.png",
  },
  {
    slug: "mattresses",
    name: "Mattresses",
    summary: "Comfort, hotel and orthopaedic builds sized to the bed.",
    image: img("photo-1631049307264-da0ec9d70304"),
  },
  {
    slug: "bedroom-furniture",
    name: "Bedroom Furniture",
    summary: "Bedsides, wardrobes and quiet storage for the same room.",
    image: img("photo-1595526114035-0d45ed16cfbf"),
  },
  {
    slug: "household",
    name: "Household",
    summary: "Sofas, tables and lighting for the rest of the home.",
    image: img("photo-1555041469-a586c61ea9bc"),
  },
];
