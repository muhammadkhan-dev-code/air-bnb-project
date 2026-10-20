import Listing from "../models/Listing.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { listingDto, populateListing } from "../utils/serializers.js";
import { parse, searchSchema } from "../validators/index.js";
import { storeImage, removeImage } from "../services/imageService.js";
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export async function index(req, res) {
  const query = parse(searchSchema, req.query);
  const filter = { guests: { $gte: query.guests } };
  // Older EJS records may have no guest-count field.
  if (query.guests <= 2) {
    delete filter.guests;
    filter.$and = [
      {
        $or: [
          { guests: { $gte: query.guests } },
          { guests: { $exists: false } },
        ],
      },
    ];
  }
  if (query.q)
    filter.$or = ["title", "location", "country"].map((key) => ({
      [key]: { $regex: escapeRegex(query.q), $options: "i" },
    }));
  if (query.category !== "All stays") filter.category = query.category;
  if (query.maxPrice !== undefined) filter.price = { $lte: query.maxPrice };
  const sort =
    query.sort === "price-low"
      ? { price: 1, _id: 1 }
      : query.sort === "price-high"
        ? { price: -1, _id: -1 }
        : { createdAt: -1, _id: -1 };
  const [items, total] = await Promise.all([
    populateListing(
      Listing.find(filter)
        .sort(sort)
        .skip((query.page - 1) * query.limit)
        .limit(query.limit),
    ),
    Listing.countDocuments(filter),
  ]);
  res.json({
    items: items.map(listingDto),
    total,
    page: query.page,
    pages: Math.ceil(total / query.limit),
  });
}
export async function show(req, res) {
  const listing = await populateListing(Listing.findById(req.params.id));
  if (!listing) throw new ApiError(404, "This listing could not be found.");
  res.json({ listing: listingDto(listing) });
}
export async function create(req, res) {
  if (!req.file) throw new ApiError(400, "Please add a property image.");
  const image = await storeImage(req.file);
  try {
    const listing = await Listing.create({
      ...req.validated,
      owner: req.user._id,
      image,
    });
    await listing.populate("owner", "username");
    res.status(201).json({ listing: listingDto(listing) });
  } catch (error) {
    await removeImage(image);
    throw error;
  }
}
export async function update(req, res) {
  const oldImage = req.listing.image?.toObject();
  const image = req.file ? await storeImage(req.file) : null;
  try {
    Object.assign(req.listing, req.validated);
    if (image) req.listing.image = image;
    await req.listing.save();
  } catch (error) {
    if (image) await removeImage(image);
    throw error;
  }
  if (image) await removeImage(oldImage);
  const listing = await populateListing(Listing.findById(req.params.id));
  res.json({ listing: listingDto(listing) });
}
export async function destroy(req, res) {
  // Remove related data first so a retry can safely finish a partially failed operation.
  await Review.deleteMany({ _id: { $in: req.listing.reviews } });
  await User.updateMany(
    { savedListings: req.listing._id },
    { $pull: { savedListings: req.listing._id } },
  );
  await Listing.deleteOne({ _id: req.listing._id });
  await removeImage(req.listing.image);
  res.json({ message: "Listing deleted." });
}
