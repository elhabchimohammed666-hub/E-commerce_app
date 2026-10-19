import { Router } from "express";
import bcrypt from "bcryptjs";
import { store } from "../db.js";
import { requireAuth, signToken } from "../middleware/auth.js";

const router = Router();

function publicUser(u) {
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    address: u.address || {},
  };
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Mot de passe trop court (6 min.)" });
  }
  const exists = await store.users.findByEmail(email.toLowerCase());
  if (exists) return res.status(409).json({ message: "Cet email est déjà utilisé" });
  const user = await store.users.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: await bcrypt.hash(password, 10),
    address: { line: "", city: "", zip: "", country: "France" },
  });
  const token = signToken(user);
  res.status(201).json({ token, user: publicUser(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = await store.users.findByEmail((email || "").toLowerCase());
  if (!user) return res.status(401).json({ message: "Identifiants incorrects" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Identifiants incorrects" });
  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await store.users.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
  res.json({ user: publicUser(user) });
});

router.put("/me", requireAuth, async (req, res) => {
  const { name, address } = req.body || {};
  const user = await store.users.update(req.user.id, {
    ...(name ? { name } : {}),
    ...(address ? { address } : {}),
  });
  res.json({ user: publicUser(user) });
});

export default router;
