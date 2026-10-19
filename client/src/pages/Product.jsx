import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";

const CAT_LABEL = {
  electronique: "Électronique",
  mode: "Mode",
  maison: "Maison",
  beaute: "Beauté",
  sport: "Sport",
  jouets: "Jouets",
  cuisine: "Cuisine",
  accessoires: "Accessoires",
};
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import ProductCard, {
  discountOf,
  formatPrice,
  soldLabel,
} from "../components/ProductCard.jsx";

export default function Product() {
  const { id } = useParams();
  const { user } = useAuth();
  const { add } = useCart();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [err, setErr] = useState("");

  useEffect(() => {
    setData(null);
    api(`/api/products/${id}`).then((d) => {
      setData(d);
      setColor(d.product.colors?.[0] || "");
      setImg(0);
      setQty(1);
    });
  }, [id]);

  if (!data) return <div className="page-loader">Chargement du produit…</div>;
  const p = data.product;
  const d = discountOf(p);

  async function addCart() {
    setErr("");
    if (!user) {
      nav("/login", { state: { from: `/produit/${id}` } });
      return;
    }
    try {
      await add(p._id, qty, color);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div>
      <p className="crumbs">
        <Link to="/">Accueil</Link> /{" "}
        <Link to={`/boutique?category=${p.category}`}>
          {CAT_LABEL[p.category] || p.category}
        </Link>
      </p>
      <div className="pdp">
        <div className="gallery">
          <img className="hero-img" src={p.images[img]} alt={p.title} />
          <div className="thumbs">
            {p.images.map((src, i) => (
              <button
                key={src}
                className={i === img ? "on" : ""}
                onClick={() => setImg(i)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="pdp-info">
          {d > 0 && <span className="badge-off">-{d} % aujourd’hui</span>}
          <h1>{p.title}</h1>
          <div className="meta-row lg">
            <span className="stars">★ {p.rating}</span>
            <span>{p.reviews.toLocaleString("fr-FR")} avis</span>
            <span>{soldLabel(p.sold)}</span>
          </div>
          <div className="price-block">
            <strong>{formatPrice(p.price)}</strong>
            <s>{formatPrice(p.compareAt)}</s>
          </div>
          <p className="desc">{p.description}</p>
          <label>Couleur</label>
          <div className="swatches">
            {p.colors.map((c) => (
              <button
                key={c}
                className={color === c ? "chip on" : "chip"}
                onClick={() => setColor(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <label>Quantité</label>
          <div className="qty">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
          {p.freeShipping && (
            <p className="ship">Livraison offerte · Expédition sous 24 h</p>
          )}
          {err && <p className="error">{err}</p>}
          <div className="pdp-actions">
            <button className="btn btn-primary" onClick={addCart}>
              Ajouter au panier
            </button>
            <button
              className="btn btn-ghost"
              onClick={async () => {
                await addCart();
                if (user) nav("/checkout");
              }}
            >
              Acheter maintenant
            </button>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="section-head">
          <h2>Souvent achetés ensemble</h2>
        </div>
        <div className="grid">
          {data.similar.map((s) => (
            <ProductCard key={s._id} product={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
