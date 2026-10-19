import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <strong className="brand">Dealora</strong>
          <p>Marketplace inspirée des géants du deal. Prix cassés, UX soignée.</p>
        </div>
        <div>
          <h4>Explorer</h4>
          <Link to="/boutique">Toute la boutique</Link>
          <Link to="/boutique?category=electronique">Électronique</Link>
          <Link to="/boutique?category=mode">Mode</Link>
        </div>
        <div>
          <h4>Aide</h4>
          <span>Livraison 5–12 jours</span>
          <span>Service client 7j/7</span>
          <span>Paiement à la commande (démo)</span>
        </div>
      </div>
      <p className="copy">© {new Date().getFullYear()} Dealora · Projet MERN démo</p>
    </footer>
  );
}
