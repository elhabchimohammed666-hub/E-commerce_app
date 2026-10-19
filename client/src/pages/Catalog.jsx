import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [cats, setCats] = useState([]);
  const [items, setItems] = useState([]);
  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const sort = params.get("sort") || "sold";

  useEffect(() => {
    api("/api/products/categories").then(setCats);
  }, []);

  useEffect(() => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    if (category) qs.set("category", category);
    if (sort) qs.set("sort", sort);
    api(`/api/products?${qs}`).then(setItems);
  }, [q, category, sort]);

  function set(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }

  return (
    <div className="catalog">
      <aside className="filters">
        <h3>Catégories</h3>
        <button
          className={!category ? "chip on" : "chip"}
          onClick={() => set("category", "")}
        >
          Toutes
        </button>
        {cats.map((c) => (
          <button
            key={c.slug}
            className={category === c.slug ? "chip on" : "chip"}
            onClick={() => set("category", c.slug)}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </aside>
      <div>
        <div className="section-head">
          <h2>
            {q ? `Résultats pour « ${q} »` : "Boutique"}
            <small> {items.length} articles</small>
          </h2>
          <select value={sort} onChange={(e) => set("sort", e.target.value)}>
            <option value="sold">Les plus vendus</option>
            <option value="rating">Mieux notés</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>
        <div className="grid">
          {items.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
        {!items.length && <p className="empty">Aucun produit pour ces filtres.</p>}
      </div>
    </div>
  );
}
