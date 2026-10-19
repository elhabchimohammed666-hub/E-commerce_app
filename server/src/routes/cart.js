import { Router } from "express";
import { store } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

async function hydrate(userId) {
  const raw = store.carts.get(userId);
  const items = [];
  for (const row of raw) {
    const p = await store.products.byId(row.productId);
    if (!p) continue;
    items.push({
      productId: String(p._id),
      title: p.title,
      image: p.images[0],
      price: p.price,
      compareAt: p.compareAt,
      freeShipping: p.freeShipping,
      stock: p.stock,
      color: row.color,
      qty: row.qty,
    });
  }
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = items.every((i) => i.freeShipping) || subtotal >= 29 ? 0 : 4.99;
  return { items, subtotal, shipping, total: +(subtotal + shipping).toFixed(2) };
}

router.get("/", async (req, res) => {
  res.json(await hydrate(req.user.id));
});

router.post("/", async (req, res) => {
  const { productId, qty = 1, color } = req.body || {};
  const p = await store.products.byId(productId);
  if (!p) return res.status(404).json({ message: "Produit introuvable" });
  const cart = store.carts.get(req.user.id);
  const found = cart.find((i) => i.productId === productId && i.color === color);
  if (found) found.qty += Number(qty);
  else cart.push({ productId, qty: Number(qty), color: color || p.colors?.[0] });
  store.carts.set(req.user.id, cart);
  res.status(201).json(await hydrate(req.user.id));
});

router.put("/:productId", async (req, res) => {
  const { qty, color } = req.body || {};
  let cart = store.carts.get(req.user.id);
  cart = cart
    .map((i) => {
      if (i.productId === req.params.productId && (!color || i.color === color)) {
        return { ...i, qty: Number(qty) };
      }
      return i;
    })
    .filter((i) => i.qty > 0);
  store.carts.set(req.user.id, cart);
  res.json(await hydrate(req.user.id));
});

router.delete("/:productId", async (req, res) => {
  const color = req.query.color;
  let cart = store.carts.get(req.user.id);
  cart = cart.filter(
    (i) =>
      !(
        i.productId === req.params.productId &&
        (!color || i.color === color)
      )
  );
  store.carts.set(req.user.id, cart);
  res.json(await hydrate(req.user.id));
});

export default router;
