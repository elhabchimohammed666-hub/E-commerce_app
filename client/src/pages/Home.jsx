import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import ProductCard, { formatPrice } from "../components/ProductCard.jsx";

function useCountdown() {
  const end = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 0);
    return d;
  }, []);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, end - now);
  const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
  return { h, m, s };
}

export default function Home() {
  const [cats, setCats] = useState([]);
  const [deals, setDeals] = useState([]);
  const [all, setAll] = useState([]);
  const { h, m, s } = useCountdown();

  useEffect(() => {
    api("/api/products/categories").then(setCats);
    api("/api/products/deals").then(setDeals);
    api("/api/products?sort=sold").then(setAll);
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Ventes flash du jour</p>
          <h1>
            Des prix qui fondent.
            <br />
            Des deals qui restent.
          </h1>
          <p className="lead">
            Marketplace façon Temu & AliExpress : réductions jusqu’à -70 %,
            livraison offerte dès 29 €.
          </p>
          <div className="hero-cta">
            <Link to="/boutique" className="btn btn-light">
              Chasser les deals
            </Link>
            <div className="clock">
              <span>{h}</span>:<span>{m}</span>:<span>{s}</span>
            </div>
          </div>
        </div>
        <div className="hero-mosaic">
          {all.slice(0, 4).map((p) => (
            <Link key={p._id} to={`/produit/${p._id}`} className="mosaic-tile">
              <img src={p.images[0]} alt="" />
              <em>{formatPrice(p.price)}</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cats">
          {cats.map((c) => (
            <Link
              key={c.slug}
              to={`/boutique?category=${c.slug}`}
              className="cat"
              style={{ background: c.color }}
            >
              <span>{c.icon}</span>
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>⚡ Super deals</h2>
          <Link to="/boutique?sort=sold">Tout voir</Link>
        </div>
        <div className="grid">
          {deals.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      <section className="banner-row">
        <div className="mini-banner coral">
          <h3>Mode street</h3>
          <p>Jusqu’à -60 % sur les vestes & sneakers</p>
          <Link to="/boutique?category=mode">Shopper →</Link>
        </div>
        <div className="mini-banner mint">
          <h3>Maison & lumière</h3>
          <p>Ambiance cocooning à petit prix</p>
          <Link to="/boutique?category=maison">Shopper →</Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Pour toi</h2>
          <span className="hint">Triés par popularité</span>
        </div>
        <div className="grid">
          {all.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
