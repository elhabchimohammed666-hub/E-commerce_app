import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function BottomNav() {
  const { count } = useCart();
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end>
        <span>🏠</span>Accueil
      </NavLink>
      <NavLink to="/boutique">
        <span>🔍</span>Boutique
      </NavLink>
      <NavLink to="/panier" className="bn-cart">
        <span>🛒</span>Panier
        {count > 0 && <em>{count}</em>}
      </NavLink>
      <NavLink to="/compte">
        <span>👤</span>Moi
      </NavLink>
    </nav>
  );
}
