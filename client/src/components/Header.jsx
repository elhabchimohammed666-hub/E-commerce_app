import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const { user } = useAuth();
  const { count } = useCart();

  function search(e) {
    e.preventDefault();
    nav(`/boutique?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className="topbar">
      <div className="topbar-strip">
        Livraison offerte dès 29 € · Retours 30 jours · Paiement sécurisé
      </div>
      <div className="topbar-row">
        <Link to="/" className="brand">
          <span className="brand-mark">⚡</span>
          Dealora
        </Link>
        <form className="search" onSubmit={search}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Chercher un deal, une marque, une catégorie…"
          />
          <button type="submit">Rechercher</button>
        </form>
        <nav className="top-links">
          <Link to={user ? "/compte" : "/login"} className="icon-link">
            <span>👤</span>
            <small>{user ? user.name.split(" ")[0] : "Compte"}</small>
          </Link>
          <Link to="/panier" className="icon-link cart-link">
            <span>🛒</span>
            <small>Panier</small>
            {count > 0 && <em>{count}</em>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
