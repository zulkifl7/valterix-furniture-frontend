import type { Headboard, MattressOption, SizeOption } from "./types";

export const headboards: Headboard[] = [
  { id: "corvus", name: "Corvus", description: "Low horizontal panels.", adjustment: 0 },
  { id: "capella", name: "Capella", description: "Soft diamond tufting.", adjustment: 8500 },
  { id: "kuma", name: "Kuma", description: "Rounded shelter profile.", adjustment: 4500 },
  { id: "atria", name: "Atria", description: "Tall wing with a slim rail.", adjustment: 7500 },
  { id: "rana", name: "Rana", description: "Vertical channel stitching.", adjustment: 6000 },
  { id: "mira", name: "Mira", description: "Low, fully upholstered curve.", adjustment: 3500 },
  { id: "ritz", name: "Ritz", description: "Deep buttoned statement.", adjustment: 12000 },
  { id: "adelphi", name: "Adelphi", description: "Wide border with a plain centre.", adjustment: 9000 },
  { id: "umbra", name: "Umbra", description: "Floating rectangular panel.", adjustment: 5000 },
  { id: "dorchester", name: "Dorchester", description: "Classic rolled top.", adjustment: 7000 },
  { id: "waldorf", name: "Waldorf", description: "Tall hotel wing.", adjustment: 11000 },
  { id: "torre", name: "Torre", description: "Narrow vertical fins.", adjustment: 8000 },
];

export const bedSizes: SizeOption[] = [
  { id: "single", name: "Single", adjustment: 0, dimensions: "90 × 190 cm" },
  { id: "double", name: "Double", adjustment: 8000, dimensions: "135 × 190 cm" },
  { id: "queen", name: "Queen", adjustment: 12000, dimensions: "150 × 200 cm" },
  { id: "king", name: "King", adjustment: 15000, dimensions: "180 × 200 cm" },
];

export const mattressOptions: MattressOption[] = [
  { id: "none", name: "No mattress", adjustment: 0, description: "Frame and upholstery only." },
  { id: "comfort", name: "Comfort", adjustment: 28000, description: "Balanced everyday support." },
  { id: "hotel", name: "Hotel", adjustment: 35000, description: "Deeper, quieter hotel feel." },
  { id: "orthopaedic", name: "Orthopaedic", adjustment: 48000, description: "Firmer support layer." },
];

export function headboardById(id: string) {
  return headboards.find((item) => item.id === id);
}
