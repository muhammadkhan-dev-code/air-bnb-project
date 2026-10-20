import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import * as auth from "../controllers/authController.js";
import * as listings from "../controllers/listingController.js";
import * as reviews from "../controllers/reviewController.js";
import * as saved from "../controllers/savedController.js";
import {
  requireAuth,
  validId,
  loadListing,
  requireOwner,
} from "../middleware/auth.js";
import {
  validate,
  signupSchema,
  loginSchema,
  listingSchema,
  reviewSchema,
} from "../validators/index.js";
import { upload } from "../services/imageService.js";
export function apiRouter() {
  const router = Router();
  const authLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Too many attempts. Please try again later." },
  });
  router.get("/auth/me", auth.me);
  router.post("/auth/signup", authLimit, validate(signupSchema), auth.signup);
  router.post("/auth/login", authLimit, validate(loginSchema), auth.login);
  router.post("/auth/logout", requireAuth, auth.logout);
  router.get("/listings", listings.index);
  router.post(
    "/listings",
    requireAuth,
    upload.single("image"),
    validate(listingSchema),
    listings.create,
  );
  router.get("/listings/:id", validId, listings.show);
  router.put(
    "/listings/:id",
    requireAuth,
    validId,
    loadListing,
    requireOwner,
    upload.single("image"),
    validate(listingSchema),
    listings.update,
  );
  router.delete(
    "/listings/:id",
    requireAuth,
    validId,
    loadListing,
    requireOwner,
    listings.destroy,
  );
  router.post(
    "/listings/:id/reviews",
    requireAuth,
    validId,
    loadListing,
    validate(reviewSchema),
    reviews.create,
  );
  router.delete(
    "/listings/:id/reviews/:reviewId",
    requireAuth,
    validId,
    loadListing,
    reviews.destroy,
  );
  router.get("/saved", requireAuth, saved.index);
  router.put("/saved/:id", requireAuth, validId, loadListing, saved.save);
  router.delete("/saved/:id", requireAuth, validId, saved.unsave);
  return router;
}
