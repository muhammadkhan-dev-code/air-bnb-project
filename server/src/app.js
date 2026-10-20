import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";
import User from "./models/User.js";
import { apiRouter } from "./routes/index.js";
import { csrfProtection } from "./middleware/csrf.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
const root = fileURLToPath(new URL("../", import.meta.url));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
export function createApp({
  store,
  secret,
  production = false,
  origin = "http://localhost:5173",
}) {
  const app = express();
  app.disable("x-powered-by");
  if (production) app.set("trust proxy", 1);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          imgSrc: ["'self'", "data:", "blob:", "https:"],
          upgradeInsecureRequests: production ? [] : null,
        },
      },
      strictTransportSecurity: production ? undefined : false,
    }),
  );
  app.use(express.json({ limit: "32kb" }));
  app.use("/images", express.static(path.join(root, "public/images")));
  app.use(
    "/uploads",
    express.static(path.join(root, "uploads"), { maxAge: "7d" }),
  );
  app.use(
    "/api",
    rateLimit({
      windowMs: 60000,
      limit: 300,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: { message: "Too many requests. Please try again shortly." },
    }),
  );
  app.use(
    "/api",
    session({
      name: "airbnb.sid",
      store,
      secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: production,
        sameSite: "lax",
        maxAge: 7 * 86400000,
      },
    }),
  );
  app.use(
    "/api",
    passport.initialize(),
    passport.session(),
    csrfProtection(origin),
  );
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api", apiRouter(), notFound);
  if (production) {
    const dist = path.resolve(root, "../client/dist");
    app.use(express.static(dist));
    app.get("/{*path}", (req, res) =>
      res.sendFile(path.join(dist, "index.html")),
    );
  }
  app.use(errorHandler);
  return app;
}
