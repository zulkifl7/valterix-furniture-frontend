"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CircleX, Heart, Menu, Moon, Scale, Search, ShoppingBag, Sun, X } from "lucide-react";
import { apiGet } from "../lib/api";
import { formatLkr } from "../lib/money";
import { searchPlaceholder, searchQuery, searchScope } from "../lib/search-scope";
import { useStore } from "../lib/store";
import type { CategoryNode, ProductCard, SiteSettings } from "../lib/types";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, wishlist, compare, quickView, closeQuickView } = useStore();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<ProductCard[]>([]);
  const [tree, setTree] = useState<{ home: CategoryNode[]; hotel: CategoryNode[] }>({ home: [], hotel: [] });
  const [settings, setSettings] = useState<SiteSettings>({});
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const themeChoice = useRef<"system" | "light" | "dark">("system");
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const searchToggleRef = useRef<HTMLButtonElement>(null);
  const onRoot = pathname === "/";
  const onProducts = pathname.startsWith("/products");
  const section = pathname.startsWith("/hotel")
    ? "hotel"
    : onProducts && searchParams.get("section") === "hotel"
      ? "hotel"
      : "home";
  const scope = searchScope(pathname, searchParams);
  const productsHref = `/products/?section=${section}`;
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const saved = localStorage.getItem("vx-theme");
    themeChoice.current = saved === "light" || saved === "dark" ? saved : "system";
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const next = themeChoice.current === "system" ? (media.matches ? "dark" : "light") : themeChoice.current;
      setTheme(next);
      document.documentElement.setAttribute("data-theme", next);
    };
    apply();
    media.addEventListener("change", apply);
    apiGet<{ data: CategoryNode[] }>("/public/category-tree?section=home").then((payload) => {
      setTree((value) => ({ ...value, home: payload?.data?.[0]?.children ?? [] }));
    });
    apiGet<{ data: CategoryNode[] }>("/public/category-tree?section=hotel").then((payload) => {
      setTree((value) => ({ ...value, hotel: payload?.data?.[0]?.children ?? [] }));
    });
    apiGet<{ data: SiteSettings }>("/public/settings").then((payload) => setSettings(payload?.data ?? {}));
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        closeQuickView();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (searchPanelRef.current?.contains(target) || searchToggleRef.current?.contains(target)) return;
      setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [closeQuickView, searchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setHits([]);
      return;
    }
    const handle = window.setTimeout(() => {
      apiGet<{ data: ProductCard[] }>(searchQuery(scope, query.trim(), 8)).then((payload) => {
        setHits(payload?.data ?? []);
      });
    }, 200);
    return () => window.clearTimeout(handle);
  }, [query, scope.category, scope.section]);

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    themeChoice.current = next;
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("vx-theme", next);
  }

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const next = new URLSearchParams({ q: query.trim(), section: scope.section });
    if (scope.category) next.set("category", scope.category);
    router.push(`/search/?${next}`);
    setSearchOpen(false);
  }

  const brand = settings.brand;

  return (
    <>
      <header className="relative sticky top-0 z-40 border-b border-line bg-page/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-2 px-3 sm:gap-4 sm:px-4 md:px-8">
          <Link href="/" className="shrink-0" aria-label="Valterix Furniture home">
            <img src="/brand/logo-wordmark.png" alt="Valterix" className="theme-light h-8 w-auto sm:h-10" />
            <img src="/brand/logo-wordmark-dark.png" alt="" className="theme-dark h-8 w-auto sm:h-10" />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Sections">
            <SectionLink href="/home/" active={!onRoot && !onProducts && pathname.startsWith("/home")}>Home Furniture</SectionLink>
            <SectionLink href="/hotel/" active={pathname.startsWith("/hotel")}>Hotel</SectionLink>
            <SectionLink href={productsHref} active={onProducts}>Products</SectionLink>
            <Link href="/about/" className="px-3 py-2 text-sm">About</Link>
            <Link href="/contact/" className="px-3 py-2 text-sm">Contact</Link>
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <button
              ref={searchToggleRef}
              type="button"
              aria-label="Search"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-lg hover:bg-soft sm:h-11 sm:w-11"
            >
              <Search size={18} />
            </button>
            <IconLink href="/wishlist/" label="Wishlist" count={wishlist.length} className="hidden sm:grid"><Heart size={18} /></IconLink>
            <IconLink href="/compare/" label="Compare" count={compare.length} className="hidden sm:grid"><Scale size={18} /></IconLink>
            <IconLink href="/cart/" label="Enquiry cart" count={count}><ShoppingBag size={18} /></IconLink>
            <button type="button" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-soft sm:h-11 sm:w-11">
              <Sun size={18} className="theme-dark" />
              <Moon size={18} className="theme-light" />
            </button>
            <Link href="/order/" className="hidden rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-page md:inline-flex">Enquire</Link>
            <button type="button" className="grid h-10 w-10 place-items-center lg:hidden sm:h-11 sm:w-11" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((value) => !value)}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {searchOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-[color-mix(in_srgb,var(--vx-ink)_28%,transparent)]" />
            <form onSubmit={onSearch} className="pointer-events-none absolute inset-x-0 top-full z-50 px-4 py-3 md:px-8">
              <div ref={searchPanelRef} className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-line bg-surface p-3 shadow-[0_18px_50px_color-mix(in_srgb,var(--vx-ink)_16%,transparent)]">
                <label className="flex items-center gap-2 rounded-lg bg-page px-3">
                  <Search size={16} className="shrink-0 text-muted" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    autoFocus
                    placeholder={searchPlaceholder(scope)}
                    className="vx-search-input h-12 w-full border-0 bg-transparent text-sm shadow-none"
                  />
                  {query && (
                    <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="grid h-8 w-8 shrink-0 place-items-center text-muted hover:text-ink">
                      <CircleX size={16} />
                    </button>
                  )}
                  <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)} className="grid h-8 w-8 shrink-0 place-items-center text-muted hover:text-ink">
                    <X size={16} />
                  </button>
                </label>
                {query.trim() && (
                  <ul className="vx-scroll mt-2 max-h-[min(28rem,60vh)] overflow-y-auto">
                    {hits.length === 0 ? (
                      <li className="px-3 py-4 text-sm text-muted">No pieces match that search.</li>
                    ) : hits.map((product) => (
                      <li key={`${product.section}-${product.id}`}>
                        <Link href={`/${product.section}/products/${product.slug}/`} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-soft" onClick={() => setSearchOpen(false)}>
                          <img src={product.image?.url} alt={product.image?.alt ?? product.name} className="h-14 w-16 shrink-0 rounded-md object-cover bg-soft" />
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium">{product.name}</span>
                            <span className="mt-0.5 block truncate text-xs uppercase tracking-wide text-faint">{product.section} · {product.category?.name} · {product.sku}</span>
                          </span>
                          <span className="shrink-0 tabular text-muted">{formatLkr(product.starting_price)}</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button type="submit" className="mt-1 w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-accent hover:bg-soft">
                        See every match
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </form>
          </>
        )}
      </header>
      <div
        className={`fixed inset-0 top-20 z-30 bg-[color-mix(in_srgb,var(--vx-ink)_40%,transparent)] transition-opacity duration-300 ease-out lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <nav
        id="mobile-nav"
        aria-label="Mobile"
        aria-hidden={!open}
        inert={!open}
        className={`fixed bottom-0 left-0 top-20 z-[31] flex w-[min(18rem,86vw)] flex-col gap-1 border-r border-line bg-page px-4 py-6 shadow-[8px_0_30px_color-mix(in_srgb,var(--vx-ink)_12%,transparent)] transition-transform duration-300 ease-out lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Link href="/home/" className="rounded-lg px-3 py-3 text-base font-medium hover:bg-soft" onClick={() => setOpen(false)}>Home Furniture</Link>
        <Link href="/hotel/" className="rounded-lg px-3 py-3 text-base hover:bg-soft" onClick={() => setOpen(false)}>Hotel</Link>
        <Link href={productsHref} className="rounded-lg px-3 py-3 text-base hover:bg-soft" onClick={() => setOpen(false)}>Products</Link>
        <Link href="/about/" className="rounded-lg px-3 py-3 text-base hover:bg-soft" onClick={() => setOpen(false)}>About</Link>
        <Link href="/contact/" className="rounded-lg px-3 py-3 text-base hover:bg-soft" onClick={() => setOpen(false)}>Contact</Link>
        <Link href="/wishlist/" className="rounded-lg px-3 py-3 text-base hover:bg-soft" onClick={() => setOpen(false)}>Wishlist</Link>
        <Link href="/compare/" className="rounded-lg px-3 py-3 text-base hover:bg-soft" onClick={() => setOpen(false)}>Compare</Link>
        <Link href="/order/" className="mt-2 rounded-lg bg-ink px-3 py-3 text-center text-base font-medium text-page" onClick={() => setOpen(false)}>Enquire</Link>
      </nav>
      <main>{children}</main>
      {quickView && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#1f1b18]/50 p-4" onClick={closeQuickView}>
          <div role="dialog" aria-modal="true" aria-labelledby="quick-title" className="grid w-full max-w-3xl overflow-hidden rounded-2xl bg-surface md:grid-cols-2" onClick={(event) => event.stopPropagation()}>
            <img src={quickView.image?.url} alt={quickView.image?.alt ?? quickView.name} className="h-64 w-full object-cover md:h-full" />
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-faint">{quickView.section} · {quickView.availability_label}</p>
              <h2 id="quick-title" className="mt-2 text-3xl font-medium">{quickView.name}</h2>
              <p className="mt-3 text-sm text-muted">{quickView.short_description}</p>
              <p className="mt-4 tabular">From {formatLkr(quickView.starting_price)}</p>
              <Link href={`/${quickView.section}/products/${quickView.slug}/`} onClick={closeQuickView} className="mt-6 inline-flex rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-ink">View product</Link>
            </div>
          </div>
        </div>
      )}
      <footer className="mt-20 border-t border-line bg-page text-ink">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
          <div>
            <img src="/brand/logo-wordmark.png" alt="Valterix" className="theme-light h-12 w-auto" />
            <img src="/brand/logo-wordmark-dark.png" alt="" className="theme-dark h-12 w-auto" />
            <p className="mt-3 text-sm text-muted">{brand?.tagline ?? "Everyday Comfort. Lasting Quality."}</p>
          </div>
          <FooterColumn title="Home">
            {tree.home.map((node) => <FooterLink key={node.id} href={`/home/categories/${node.slug}/`}>{node.name}</FooterLink>)}
          </FooterColumn>
          <FooterColumn title="Hotel">
            {tree.hotel.map((node) => <FooterLink key={node.id} href={`/hotel/categories/${node.slug}/`}>{node.name}</FooterLink>)}
          </FooterColumn>
          <FooterColumn title="Visit">
            <FooterLink href="/contact/">Contact</FooterLink>
            <FooterLink href="/delivery/">Delivery</FooterLink>
            <FooterLink href="/care/">Care and warranty</FooterLink>
            <FooterLink href="/faq/">FAQ</FooterLink>
            <p className="pt-3 text-sm text-muted">{brand?.email}</p>
            <p className="text-sm text-muted">{brand?.address}</p>
          </FooterColumn>
        </div>
        <div className="border-t border-line">
          <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted md:px-8">© {new Date().getFullYear()} Valterix Furniture & Home Interior · {brand?.parent ?? "Valterix Assets (Pvt) Ltd."} An enquiry is not a paid order.</p>
        </div>
      </footer>
    </>
  );
}

function SectionLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={`rounded-lg px-3 py-2 text-sm font-medium ${active ? "bg-soft underline decoration-gold decoration-2 underline-offset-8" : ""}`}>
      {children}
    </Link>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-label={label} onClick={onClick} className="grid h-11 w-11 place-items-center rounded-lg hover:bg-soft">{children}</button>;
}

function IconLink({ href, label, count, children, className = "" }: { href: string; label: string; count: number; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} aria-label={count ? `${label}, ${count}` : label} className={`relative grid h-10 w-10 place-items-center rounded-lg hover:bg-soft sm:h-11 sm:w-11 ${className}`}>
      {children}
      {count > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] text-accent-ink">{count}</span>}
    </Link>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><p className="text-xs uppercase tracking-[0.16em] text-faint">{title}</p><div className="mt-3 flex flex-col gap-2">{children}</div></div>;
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="text-sm text-muted hover:text-ink">{children}</Link>;
}
