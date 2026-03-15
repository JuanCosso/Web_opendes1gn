"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ProductCard } from "@/components/shop/ProductCard";

type Image = { url: string; alt?: string | null };
type Category = { id: string; name: string; slug: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  description?: string | null;
  images: Image[];
  category?: Category | null;
};

type Props = {
  products: Product[];
  categories: Category[];
};

export function ProductosClient({ products, categories }: Props) {
  const [query, setQuery]               = useState("");
  const [category, setCategory]         = useState("");
  const [order, setOrder]               = useState("newest");
  const [maxPrice, setMaxPrice]         = useState(0);
  const [priceLimit, setPriceLimit]     = useState(0);
  const [sliderValue, setSliderValue]   = useState(0); // valor "en vivo" del slider
  const [catOpen, setCatOpen]           = useState(false);
  const [ordOpen, setOrdOpen]           = useState(false);
  const catRef  = useRef<HTMLDivElement>(null);
  const ordRef  = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const max = Math.max(...products.map((p) => Number(p.price)), 0);
    setMaxPrice(max);
    setPriceLimit(max);
    setSliderValue(max);
  }, [products]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
      if (ordRef.current && !ordRef.current.contains(e.target as Node)) setOrdOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounce: actualiza el filtro real 180ms después de soltar el slider
  const handleSliderChange = useCallback((val: number) => {
    setSliderValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setPriceLimit(val), 180);
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          (p.category?.name ?? "").toLowerCase().includes(q)
      );
    }
    if (category) list = list.filter((p) => p.category?.slug === category);
    if (priceLimit < maxPrice) list = list.filter((p) => Number(p.price) <= priceLimit);
    if (order === "price-asc")  list.sort((a, b) => Number(a.price) - Number(b.price));
    if (order === "price-desc") list.sort((a, b) => Number(b.price) - Number(a.price));
    return list;
  }, [products, query, category, priceLimit, maxPrice, order]);

  const hasFilters   = query || category || order !== "newest" || priceLimit < maxPrice;
  const activeCatName = categories.find((c) => c.slug === category)?.name;
  const orderLabels: Record<string, string> = {
    newest: "Más recientes",
    "price-asc": "Menor precio",
    "price-desc": "Mayor precio",
  };

  const btnBase     = "flex items-center gap-2 px-4 py-2.5 text-[11px] tracking-[2px] uppercase border transition-all duration-300 rounded-[var(--radius-sm)]";
  const btnActive   = `${btnBase} bg-[var(--text)] text-[var(--cream)] border-[var(--text)]`;
  const btnInactive = `${btnBase} border-[var(--border)] text-[var(--text-light)] hover:border-[var(--accent)]/60 hover:text-[var(--text)]`;

  return (
    <>
      <div className="mb-10 space-y-4">

        {/* Buscador */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar piezas…"
            className="w-full pl-4 pr-10 py-3 bg-[var(--white)] border border-[var(--border)] text-[13px] text-[var(--text)] placeholder-[var(--text-light)]/60 font-light focus:outline-none focus:border-[var(--accent)] transition-colors rounded-[var(--radius)]"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)]">
            {query ? (
              <button onClick={() => setQuery("")} className="hover:text-[var(--text)] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="pointer-events-none">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            )}
          </span>
        </div>

        {/* Filtros + slider en la misma fila */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Dropdown categorías */}
          {categories.length > 0 && (
            <div className="relative" ref={catRef}>
              <button onClick={() => { setCatOpen((v) => !v); setOrdOpen(false); }}
                className={category ? btnActive : btnInactive}>
                {activeCatName ?? "Categoría"}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className={`transition-transform ${catOpen ? "rotate-180" : ""}`}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-[var(--cream)] border border-[var(--border)] rounded-[var(--radius-sm)] shadow-lg min-w-[160px] py-1">
                  <button
                    onClick={() => { setCategory(""); setCatOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-[11px] tracking-[2px] uppercase text-[var(--text-light)] hover:bg-[var(--blush)] hover:text-[var(--text)] transition-colors flex items-center justify-between">
                    Todas
                    {!category && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                  </button>
                  {categories.map((cat) => (
                    <button key={cat.id}
                      onClick={() => { setCategory(cat.slug); setCatOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-[11px] tracking-[2px] uppercase text-[var(--text-light)] hover:bg-[var(--blush)] hover:text-[var(--text)] transition-colors flex items-center justify-between">
                      {cat.name}
                      {category === cat.slug && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Dropdown orden */}
          <div className="relative" ref={ordRef}>
            <button onClick={() => { setOrdOpen((v) => !v); setCatOpen(false); }}
              className={order !== "newest" ? btnActive : btnInactive}>
              {orderLabels[order]}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className={`transition-transform ${ordOpen ? "rotate-180" : ""}`}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {ordOpen && (
              <div className="absolute top-full left-0 mt-1 z-20 bg-[var(--cream)] border border-[var(--border)] rounded-[var(--radius-sm)] shadow-lg min-w-[160px] py-1">
                {Object.entries(orderLabels).map(([val, label]) => (
                  <button key={val}
                    onClick={() => { setOrder(val); setOrdOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-[11px] tracking-[2px] uppercase text-[var(--text-light)] hover:bg-[var(--blush)] hover:text-[var(--text)] transition-colors flex items-center justify-between">
                    {label}
                    {order === val && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Slider precio — ancho acotado, no ocupa todo el row */}
          {maxPrice > 0 && (
            <div className="flex items-center gap-3 bg-[var(--white)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-2 w-full sm:w-72">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                className="text-[var(--text-light)] flex-shrink-0">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 6v4l3 3"/>
              </svg>
              <input
                type="range"
                min={0}
                max={maxPrice}
                step={500}
                value={sliderValue}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="flex-1 accent-[var(--accent)] cursor-pointer h-[2px]"
                style={{ minWidth: 0 }}
              />
              <span className="text-[10px] tracking-[1px] text-[var(--text-light)] whitespace-nowrap flex-shrink-0">
                ${sliderValue.toLocaleString("es-AR")}
              </span>
            </div>
          )}

          <span className="text-[11px] text-[var(--text-light)]">
            {filtered.length} {filtered.length === 1 ? "pieza" : "piezas"}
          </span>

          {hasFilters && (
            <button
              onClick={() => {
                setQuery(""); setCategory(""); setOrder("newest");
                setPriceLimit(maxPrice); setSliderValue(maxPrice);
              }}
              className="ml-auto flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase text-[var(--accent)] hover:text-[var(--text)] transition-colors">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Grilla */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-[13px] text-[var(--text-light)] font-light mb-2">No hay piezas con esos filtros.</p>
          <button
            onClick={() => { setQuery(""); setCategory(""); setOrder("newest"); setPriceLimit(maxPrice); setSliderValue(maxPrice); }}
            className="text-[11px] tracking-[2px] uppercase text-[var(--accent)] hover:text-[var(--text)] transition-colors underline underline-offset-4">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </>
  );
}