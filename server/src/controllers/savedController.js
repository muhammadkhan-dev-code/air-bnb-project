import User from "../models/User.js";
import Listing from "../models/Listing.js";
import { listingDto, populateListing } from "../utils/serializers.js";
export async function index(req, res) {
  const user = await User.findById(req.user._id).select("savedListings");
  const items = await populateListing(
    Listing.find({ _id: { $in: user.savedListings } }).sort({ createdAt: -1 }),
  );
  res.json({ items: items.map(listingDto) });
}
export async function save(req, res) {
  await User.updateOne(
    { _id: req.user._id },
    { $addToSet: { savedListings: req.params.id } },
  );
  res.json({ message: "Stay saved." });
}
export async function unsave(req, res) {
  await User.updateOne(
    { _id: req.user._id },
    { $pull: { savedListings: req.params.id } },
  );
  res.json({ message: "Stay removed." });
}
