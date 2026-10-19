import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Auth from "./pages/Auth.jsx";
import Orders from "./pages/Orders.jsx";
import Account from "./pages/Account.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useCart } from "./context/CartContext.jsx";

function Guard({ children }) {
  const { user, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return <div className="page-loader">Chargement…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return children;
}

export default function App() {
  const { toast } = useCart();
  return (
    <div className="app-shell">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/boutique" element={<Catalog />} />
          <Route path="/produit/:id" element={<Product />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route
            path="/panier"
            element={
              <Guard>
                <Cart />
              </Guard>
            }
          />
          <Route
            path="/checkout"
            element={
              <Guard>
                <Checkout />
              </Guard>
            }
          />
          <Route
            path="/commandes"
            element={
              <Guard>
                <Orders />
              </Guard>
            }
          />
          <Route
            path="/compte"
            element={
              <Guard>
                <Account />
              </Guard>
            }
          />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
