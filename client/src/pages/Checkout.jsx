import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../components/ProductCard.jsx";

export default function Checkout() {
  const { user } = useAuth();
  const { cart, refresh } = useCart();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    line: user?.address?.line || "",
    city: user?.address?.city || "",
    zip: user?.address?.zip || "",
    country: user?.address?.country || "France",
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!form.line || !form.city || !form.zip) {
      setErr("Complétez l’adresse de livraison");
      return;
    }
    setBusy(true);
    try {
      await api("/api/orders", { method: "POST", body: { address: form } });
      await refresh();
      nav("/commandes");
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!cart.items.length) {
    return (
      <div className="empty-box">
        <h2>Rien à payer</h2>
        <Link to="/boutique">Retour boutique</Link>
      </div>
    );
  }

  return (
    <form className="split" onSubmit={submit}>
      <div className="form-card">
        <h2>Livraison</h2>
        <label>Nom</label>
        <input value={form.name} onChange={(e) => set("name", e.target.value)} />
        <label>Adresse</label>
        <input value={form.line} onChange={(e) => set("line", e.target.value)} />
        <div className="two">
          <div>
            <label>Ville</label>
            <input value={form.city} onChange={(e) => set("city", e.target.value)} />
          </div>
          <div>
            <label>Code postal</label>
            <input value={form.zip} onChange={(e) => set("zip", e.target.value)} />
          </div>
        </div>
        <label>Pays</label>
        <input value={form.country} onChange={(e) => set("country", e.target.value)} />
        <p className="muted">Paiement simulé — aucune carte n’est débitée.</p>
        {err && <p className="error">{err}</p>}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Validation…" : `Payer ${formatPrice(cart.total)}`}
        </button>
      </div>
      <aside className="summary">
        <h3>Votre commande</h3>
        {cart.items.map((i) => (
          <p key={i.productId + i.color} className="sum-line">
            <span>
              {i.qty}× {i.title}
            </span>
            <span>{formatPrice(i.price * i.qty)}</span>
          </p>
        ))}
        <p className="total">
          <span>Total</span>
          <span>{formatPrice(cart.total)}</span>
        </p>
      </aside>
    </form>
  );
}
