import { Link } from "react-router-dom";

export function discountOf(p) {
  if (!p.compareAt) return 0;
  return Math.round((1 - p.price / p.compareAt) * 100);
}

export function formatPrice(n) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

export function soldLabel(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}k vendus`;
  return `${n} vendus`;
}

export default function ProductCard({ product }) {
  const d = discountOf(product);
  return (
    <Link to={`/produit/${product._id}`} className="card">
      <div className="card-media">
        <img src={product.images[0]} alt={product.title} />
        {d >= 40 && <span className="badge-off">-{d}%</span>}
        {product.badge && <span className="badge-tag">{product.badge}</span>}
      </div>
      <div className="card-body">
        <h3>{product.title}</h3>
        <div className="price-row">
          <strong>{formatPrice(product.price)}</strong>
          {product.compareAt && <s>{formatPrice(product.compareAt)}</s>}
        </div>
        <div className="meta-row">
          <span className="stars">★ {product.rating}</span>
          <span>{soldLabel(product.sold)}</span>
        </div>
        {product.freeShipping && <span className="ship">Livraison offerte</span>}
      </div>
    </Link>
  );
}
