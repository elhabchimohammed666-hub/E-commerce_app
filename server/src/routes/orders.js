import { Router } from "express";
import { store } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  res.json(await store.orders.list(req.user.id));
});

router.post("/", async (req, res) => {
  const cart = store.carts.get(req.user.id);
  if (!cart.length) return res.status(400).json({ message: "Panier vide" });

  const items = [];
  let subtotal = 0;
  for (const row of cart) {
    const p = await store.products.byId(row.productId);
    if (!p) continue;
    items.push({
      productId: String(p._id),
      title: p.title,
      image: p.images[0],
      color: row.color,
      price: p.price,
      qty: row.qty,
    });
    subtotal += p.price * row.qty;
  }
  const shipping = items.length && subtotal >= 29 ? 0 : subtotal ? 4.99 : 0;
  const address = req.body?.address || {};
  const order = await store.orders.create({
    userId: req.user.id,
    items,
    total: +(subtotal + shipping).toFixed(2),
    shipping,
    status: "confirmée",
    address: {
      name: address.name || req.user.name,
      line: address.line || "",
      city: address.city || "",
      zip: address.zip || "",
      country: address.country || "France",
    },
  });
  store.carts.set(req.user.id, []);
  res.status(201).json(order);
});

export default router;
