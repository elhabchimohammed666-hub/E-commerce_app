import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

const empty = { items: [], subtotal: 0, shipping: 0, total: 0 };

export function CartProvider({ children }) {
  const { user, ready } = useAuth();
  const [cart, setCart] = useState(empty);
  const [toast, setToast] = useState("");

  async function refresh() {
    if (!user) {
      setCart(empty);
      return;
    }
    try {
      setCart(await api("/api/cart"));
    } catch {
      setCart(empty);
    }
  }

  useEffect(() => {
    if (ready) refresh();
  }, [user, ready]);

  function ping(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  async function add(productId, qty, color) {
    if (!user) throw new Error("auth");
    const next = await api("/api/cart", {
      method: "POST",
      body: { productId, qty, color },
    });
    setCart(next);
    ping("Ajouté au panier");
  }

  async function updateQty(productId, qty, color) {
    const next = await api(`/api/cart/${productId}`, {
      method: "PUT",
      body: { qty, color },
    });
    setCart(next);
  }

  async function remove(productId, color) {
    const q = color ? `?color=${encodeURIComponent(color)}` : "";
    const next = await api(`/api/cart/${productId}${q}`, { method: "DELETE" });
    setCart(next);
  }

  const count = cart.items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, count, add, updateQty, remove, refresh, toast }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
