import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Account() {
  const { user, logout } = useAuth();
  return (
    <div className="form-card">
      <h2>Bonjour, {user.name}</h2>
      <p className="muted">{user.email}</p>
      <div className="account-links">
        <Link to="/commandes">Suivre mes commandes</Link>
        <Link to="/panier">Voir mon panier</Link>
      </div>
      <button className="btn btn-ghost" onClick={logout}>
        Se déconnecter
      </button>
    </div>
  );
}
