import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { products as catalog } from "./data/catalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, "..", "data", "store.json");

export let usingMongo = false;

function emptyStore() {
  return { users: [], products: [], orders: [], carts: {} };
}

function loadFile() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return emptyStore();
  }
}

function saveFile(data) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

let memory = loadFile();

function nid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export async function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    await ensureSeed();
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    usingMongo = true;
    console.log("MongoDB connecté");
    await ensureSeed();
  } catch (err) {
    usingMongo = false;
    console.warn("MongoDB indisponible, mode fichier local :", err.message);
    await ensureSeed();
  }
}

export async function ensureSeed() {
  if (usingMongo) {
    const { Product } = await import("./models/Product.js");
    const { User } = await import("./models/User.js");
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(catalog);
      console.log("Catalogue MongoDB initialisé");
    }
    const demo = await User.findOne({ email: "demo@dealora.app" });
    if (!demo) {
      await User.create({
        name: "Amina Demo",
        email: "demo@dealora.app",
        passwordHash: await bcrypt.hash("demo1234", 10),
        address: {
          line: "12 rue des Halles",
          city: "Paris",
          zip: "75001",
          country: "France",
        },
      });
    }
    return;
  }

  if (!memory.products?.length) {
    memory.products = catalog.map((p, i) => ({
      ...p,
      _id: `p${i + 1}`,
      createdAt: new Date().toISOString(),
    }));
  }
  if (!memory.users.find((u) => u.email === "demo@dealora.app")) {
    memory.users.push({
      _id: "u_demo",
      name: "Amina Demo",
      email: "demo@dealora.app",
      passwordHash: await bcrypt.hash("demo1234", 10),
      address: {
        line: "12 rue des Halles",
        city: "Paris",
        zip: "75001",
        country: "France",
      },
    });
  }
  saveFile(memory);
}

export const store = {
  users: {
    async findByEmail(email) {
      if (usingMongo) {
        const { User } = await import("./models/User.js");
        return User.findOne({ email }).lean();
      }
      return memory.users.find((u) => u.email === email) || null;
    },
    async findById(id) {
      if (usingMongo) {
        const { User } = await import("./models/User.js");
        return User.findById(id).lean();
      }
      return memory.users.find((u) => u._id === id) || null;
    },
    async create(doc) {
      if (usingMongo) {
        const { User } = await import("./models/User.js");
        const u = await User.create(doc);
        return u.toObject();
      }
      const user = { _id: nid("u"), ...doc };
      memory.users.push(user);
      saveFile(memory);
      return user;
    },
    async update(id, patch) {
      if (usingMongo) {
        const { User } = await import("./models/User.js");
        return User.findByIdAndUpdate(id, patch, { new: true }).lean();
      }
      const u = memory.users.find((x) => x._id === id);
      if (!u) return null;
      Object.assign(u, patch);
      saveFile(memory);
      return u;
    },
  },
  products: {
    async list({ q, category, sort, min, max } = {}) {
      let items;
      if (usingMongo) {
        const { Product } = await import("./models/Product.js");
        const filter = {};
        if (category) filter.category = category;
        if (q) filter.title = { $regex: q, $options: "i" };
        if (min || max) {
          filter.price = {};
          if (min) filter.price.$gte = Number(min);
          if (max) filter.price.$lte = Number(max);
        }
        let query = Product.find(filter);
        if (sort === "price-asc") query = query.sort({ price: 1 });
        else if (sort === "price-desc") query = query.sort({ price: -1 });
        else if (sort === "sold") query = query.sort({ sold: -1 });
        else query = query.sort({ rating: -1 });
        items = await query.lean();
      } else {
        items = [...memory.products];
        if (category) items = items.filter((p) => p.category === category);
        if (q) {
          const s = q.toLowerCase();
          items = items.filter((p) => p.title.toLowerCase().includes(s));
        }
        if (min) items = items.filter((p) => p.price >= Number(min));
        if (max) items = items.filter((p) => p.price <= Number(max));
        if (sort === "price-asc") items.sort((a, b) => a.price - b.price);
        else if (sort === "price-desc") items.sort((a, b) => b.price - a.price);
        else if (sort === "sold") items.sort((a, b) => b.sold - a.sold);
        else items.sort((a, b) => b.rating - a.rating);
      }
      return items;
    },
    async byId(id) {
      if (usingMongo) {
        const { Product } = await import("./models/Product.js");
        return Product.findById(id).lean();
      }
      return (
        memory.products.find((p) => p._id === id || p.slug === id) || null
      );
    },
    async deals() {
      const all = await this.list({ sort: "sold" });
      return all
        .map((p) => ({
          ...p,
          discount: Math.round((1 - p.price / p.compareAt) * 100),
        }))
        .filter((p) => p.discount >= 50)
        .slice(0, 8);
    },
  },
  carts: {
    get(userId) {
      if (!memory.carts[userId]) memory.carts[userId] = [];
      return memory.carts[userId];
    },
    set(userId, items) {
      memory.carts[userId] = items;
      saveFile(memory);
      return items;
    },
  },
  orders: {
    async list(userId) {
      if (usingMongo) {
        const { Order } = await import("./models/Order.js");
        return Order.find({ userId }).sort({ createdAt: -1 }).lean();
      }
      return memory.orders
        .filter((o) => String(o.userId) === String(userId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    async create(doc) {
      if (usingMongo) {
        const { Order } = await import("./models/Order.js");
        const o = await Order.create(doc);
        return o.toObject();
      }
      const order = {
        _id: nid("o"),
        ...doc,
        createdAt: new Date().toISOString(),
      };
      memory.orders.unshift(order);
      saveFile(memory);
      return order;
    },
  },
};
