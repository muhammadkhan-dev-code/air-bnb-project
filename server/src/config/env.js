import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
dotenv.config({
  path: fileURLToPath(new URL("../../.env", import.meta.url)),
  quiet: true,
});
export function readEnv() {
  const mongoUrl = process.env.MONGODB_URI || process.env.ATLASDB_URL;
  const secret = process.env.SESSION_SECRET || process.env.SECRET;
  if (!mongoUrl) throw new Error("Set MONGODB_URI in server/.env.");
  if (!secret || secret.length < 32)
    throw new Error("SESSION_SECRET must contain at least 32 characters.");
  const production = process.env.NODE_ENV === "production";
  return {
    mongoUrl,
    secret,
    production,
    port: Number(process.env.PORT || 3000),
    origin:
      process.env.APP_ORIGIN ||
      (production ? "http://localhost:3000" : "http://localhost:5173"),
  };
}
