import Listing from "../models/Listing.js";
import Review from "../models/Review.js";
import { ApiError } from "../utils/ApiError.js";
export async function create(req, res) {
  const review = await Review.create({
    ...req.validated,
    author: req.user._id,
  });
  try {
    const result = await Listing.updateOne(
      { _id: req.listing._id },
      { $push: { reviews: review._id } },
    );
    if (!result.matchedCount)
      throw new ApiError(404, "This listing is no longer available.");
  } catch (error) {
    await Review.deleteOne({ _id: review._id });
    throw error;
  }
  res.status(201).json({ message: "Review added." });
}
export async function destroy(req, res) {
  if (!req.listing.reviews.some((id) => String(id) === req.params.reviewId))
    throw new ApiError(404, "Review not found on this listing.");
  const review = await Review.findById(req.params.reviewId);
  if (!review) throw new ApiError(404, "Review not found.");
  if (String(review.author) !== String(req.user._id))
    throw new ApiError(403, "Only the author can delete this review.");
  await Listing.updateOne(
    { _id: req.listing._id },
    { $pull: { reviews: review._id } },
  );
  await Review.deleteOne({ _id: review._id });
  res.json({ message: "Review deleted." });
}
