import jwt from "jsonwebtoken";

export function signToken(user) {
  return jwt.sign(
    { id: String(user._id), email: user.email, name: user.name },
    process.env.JWT_SECRET || "dealora-dev",
    { expiresIn: "7d" }
  );
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Connexion requise" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dealora-dev");
    next();
  } catch {
    return res.status(401).json({ message: "Session expirée" });
  }
}
