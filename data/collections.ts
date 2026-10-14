import type { Collection } from "./types";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

export const collections: Collection[] = [
  {
    slug: "modern",
    name: "Modern Line",
    summary: "Clean outlines, low profiles and quiet hardware.",
    image: img("photo-1616594039964-ae9021a400a0"),
  },
  {
    slug: "tufted",
    name: "Tufted Collection",
    summary: "Buttoned and diamond-tufted headboards.",
    image: img("photo-1617325247661-675ab4b64ae2"),
  },
  {
    slug: "linear",
    name: "Linear Collection",
    summary: "Vertical and horizontal panel designs.",
    image: img("photo-1615874959474-d609969a20ed"),
  },
  {
    slug: "soft-living",
    name: "Soft Living",
    summary: "Neutral, comfort-led pieces for everyday rooms.",
    image: img("photo-1493663284031-b7e3aefcae8e"),
  },
  {
    slug: "signature",
    name: "Signature Collection",
    summary: "Taller, more formal designs for a statement bedroom.",
    image: img("photo-1540518614846-7eded433c457"),
  },
];
