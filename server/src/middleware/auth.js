import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import { ApiError } from "../utils/ApiError.js";
export function requireAuth(req, res, next) {
  if (!req.isAuthenticated())
    throw new ApiError(401, "Please log in to continue.");
  next();
}
export function validId(req, res, next) {
  for (const key of ["id", "reviewId"])
    if (req.params[key] && !mongoose.isObjectIdOrHexString(req.params[key]))
      throw new ApiError(400, "Invalid resource ID.");
  next();
}
export async function loadListing(req, res, next) {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ApiError(404, "This listing could not be found.");
  req.listing = listing;
  next();
}
export function requireOwner(req, res, next) {
  if (!req.listing.owner || String(req.listing.owner) !== String(req.user._id))
    throw new ApiError(403, "Only the owner can change this listing.");
  next();
}
