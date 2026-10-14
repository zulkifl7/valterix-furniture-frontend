"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ProductCard, SectionKey } from "./types";

export type CartItem = {
  id: string;
  productId: number;
  section: SectionKey;
  slug: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  optionValueIds: number[];
  summary: string;
  unitLabel?: string | null;
};

type SavedPiece = { section: SectionKey; slug: string };

type StoreValue = {
  ready: boolean;
  cart: CartItem[];
  wishlist: SavedPiece[];
  compare: SavedPiece[];
  quickView: ProductCard | null;
  addToCart: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (piece: SavedPiece) => void;
  toggleCompare: (piece: SavedPiece) => void;
  openQuickView: (product: ProductCard) => void;
  closeQuickView: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);
const KEY = "vx-furniture-v1";

function samePiece(a: SavedPiece, b: SavedPiece) {
  return a.section === b.section && a.slug === b.slug;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<SavedPiece[]>([]);
  const [compare, setCompare] = useState<SavedPiece[]>([]);
  const [quickView, setQuickView] = useState<ProductCard | null>(null);

  useEffect(() => {
    try {
      const raw = JSON.parse(window.localStorage.getItem(KEY) || "{}") as {
        cart?: CartItem[];
        wishlist?: SavedPiece[];
        compare?: SavedPiece[];
      };
      setCart(raw.cart ?? []);
      setWishlist(raw.wishlist ?? []);
      setCompare(raw.compare ?? []);
    } catch {
      setCart([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(KEY, JSON.stringify({ cart, wishlist, compare }));
  }, [cart, compare, ready, wishlist]);

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      cart,
      wishlist,
      compare,
      quickView,
      addToCart: (item) => {
        const id = [item.productId, ...item.optionValueIds].join("|");
        setCart((current) => {
          const existing = current.find((line) => line.id === id);
          if (existing) {
            return current.map((line) => (line.id === id ? { ...line, quantity: line.quantity + item.quantity } : line));
          }
          return [...current, { ...item, id }];
        });
      },
      updateQuantity: (id, quantity) => {
        setCart((current) => (quantity < 1 ? current.filter((line) => line.id !== id) : current.map((line) => (line.id === id ? { ...line, quantity } : line))));
      },
      removeFromCart: (id) => setCart((current) => current.filter((line) => line.id !== id)),
      clearCart: () => setCart([]),
      toggleWishlist: (piece) =>
        setWishlist((current) => (current.some((item) => samePiece(item, piece)) ? current.filter((item) => !samePiece(item, piece)) : [...current, piece])),
      toggleCompare: (piece) =>
        setCompare((current) => {
          if (current.some((item) => samePiece(item, piece))) return current.filter((item) => !samePiece(item, piece));
          if (current.length >= 3) return [...current.slice(1), piece];
          return [...current, piece];
        }),
      openQuickView: (product) => setQuickView(product),
      closeQuickView: () => setQuickView(null),
    }),
    [cart, compare, quickView, ready, wishlist],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}
