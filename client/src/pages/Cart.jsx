import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../components/ProductCard.jsx";

export default function Cart() {
  const { cart, updateQty, remove } = useCart();

  if (!cart.items.length) {
    return (
      <div className="empty-box">
        <h2>Votre panier est vide</h2>
        <p>Les super deals vous attendent.</p>
        <Link to="/boutique" className="btn btn-primary">
          Explorer la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="split">
      <div className="cart-list">
        <h2>Panier ({cart.items.length})</h2>
        {cart.items.map((i) => (
          <article key={i.productId + i.color} className="cart-row">
            <img src={i.image} alt="" />
            <div>
              <Link to={`/produit/${i.productId}`}>{i.title}</Link>
              <p className="muted">{i.color}</p>
              <strong>{formatPrice(i.price)}</strong>
              <div className="qty">
                <button onClick={() => updateQty(i.productId, i.qty - 1, i.color)}>
                  −
                </button>
                <span>{i.qty}</span>
                <button onClick={() => updateQty(i.productId, i.qty + 1, i.color)}>
                  +
                </button>
              </div>
            </div>
            <button className="linkish" onClick={() => remove(i.productId, i.color)}>
              Retirer
            </button>
          </article>
        ))}
      </div>
      <aside className="summary">
        <h3>Récapitulatif</h3>
        <p>
          <span>Sous-total</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </p>
        <p>
          <span>Livraison</span>
          <span>{cart.shipping ? formatPrice(cart.shipping) : "Offerte"}</span>
        </p>
        <p className="total">
          <span>Total</span>
          <span>{formatPrice(cart.total)}</span>
        </p>
        <Link to="/checkout" className="btn btn-primary block">
          Passer commande
        </Link>
      </aside>
    </div>
  );
}
