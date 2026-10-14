import type { FabricColor } from "./types";

export const fabricColors: FabricColor[] = [
  { id: "beige", name: "Beige", hex: "#D8CBB8" },
  { id: "cream", name: "Cream", hex: "#F3EDE3" },
  { id: "stone", name: "Stone", hex: "#C8C2B8" },
  { id: "grey", name: "Grey", hex: "#8E9296" },
  { id: "charcoal", name: "Charcoal", hex: "#3E4348" },
  { id: "sage", name: "Sage", hex: "#8FA387" },
  { id: "blue", name: "Blue", hex: "#6E8CA0" },
];

export function colorName(id: string) {
  return fabricColors.find((color) => color.id === id)?.name ?? id;
}

export function piecePhotoLabel(name: string, colorId?: string) {
  const known = fabricColors.find((color) => color.id === colorId);
  return known ? `${name} in ${known.name}` : name;
}

export function colorHex(id: string) {
  return fabricColors.find((color) => color.id === id)?.hex ?? "#D8CBB8";
}
