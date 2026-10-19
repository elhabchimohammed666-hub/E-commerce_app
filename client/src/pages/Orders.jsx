import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { formatPrice } from "../components/ProductCard.jsx";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api("/api/orders").then(setOrders);
  }, []);

  if (!orders.length) {
    return (
      <div className="empty-box">
        <h2>Pas encore de commande</h2>
        <Link to="/boutique" className="btn btn-primary">
          Commencer à shopper
        </Link>
      </div>
    );
  }

  return (
    <div className="orders">
      <h2>Mes commandes</h2>
      {orders.map((o) => (
        <article key={o._id} className="order-card">
          <header>
            <strong>#{String(o._id).slice(-6).toUpperCase()}</strong>
            <span className="status">{o.status}</span>
            <em>
              {new Date(o.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
              })}
            </em>
          </header>
          <div className="order-items">
            {o.items.map((i) => (
              <div key={i.productId + i.color}>
                <img src={i.image} alt="" />
                <p>
                  {i.qty}× {i.title}
                  <small>{i.color}</small>
                </p>
              </div>
            ))}
          </div>
          <p className="total">
            Total {formatPrice(o.total)} · {o.address?.city}
          </p>
        </article>
      ))}
    </div>
  );
}
