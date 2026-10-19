import { Router } from "express";
import { store } from "../db.js";
import { categories } from "../data/catalog.js";

const router = Router();

router.get("/categories", (_req, res) => {
  res.json(categories);
});

router.get("/deals", async (_req, res) => {
  res.json(await store.products.deals());
});

router.get("/", async (req, res) => {
  const { q, category, sort, min, max } = req.query;
  const items = await store.products.list({ q, category, sort, min, max });
  res.json(items);
});

router.get("/:id", async (req, res) => {
  const product = await store.products.byId(req.params.id);
  if (!product) return res.status(404).json({ message: "Produit introuvable" });
  const similar = (await store.products.list({ category: product.category }))
    .filter((p) => String(p._id) !== String(product._id))
    .slice(0, 6);
  res.json({ product, similar });
});

export default router;
