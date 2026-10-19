import "dotenv/config";
import { connectDb, ensureSeed } from "./db.js";

await connectDb();
await ensureSeed();
console.log("Seed terminé. Compte démo : demo@dealora.app / demo1234");
process.exit(0);
