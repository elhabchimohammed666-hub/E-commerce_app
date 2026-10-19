import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Auth({ mode }) {
  const isLogin = mode === "login";
  const { login, register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({
    name: "",
    email: "demo@dealora.app",
    password: "demo1234",
  });
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      nav(loc.state?.from || "/");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <form className="auth-card" onSubmit={submit}>
      <h1>{isLogin ? "Bon retour" : "Créer un compte"}</h1>
      <p className="muted">
        Compte démo : <code>demo@dealora.app</code> / <code>demo1234</code>
      </p>
      {!isLogin && (
        <>
          <label>Nom</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </>
      )}
      <label>Email</label>
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <label>Mot de passe</label>
      <input
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      {err && <p className="error">{err}</p>}
      <button className="btn btn-primary block">
        {isLogin ? "Se connecter" : "S’inscrire"}
      </button>
      <p className="switch">
        {isLogin ? (
          <>
            Nouveau ? <Link to="/register">Créer un compte</Link>
          </>
        ) : (
          <>
            Déjà membre ? <Link to="/login">Connexion</Link>
          </>
        )}
      </p>
    </form>
  );
}
