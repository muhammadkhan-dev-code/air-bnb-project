import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, maxlength: 3000 },
    image: {
      url: String,
      filename: String,
      provider: {
        type: String,
        enum: ["local", "cloudinary", "seed", "legacy"],
      },
    },
    price: { type: Number, required: true, min: 1 },
    location: { type: String, required: true, maxlength: 100 },
    country: { type: String, required: true, maxlength: 80 },
    category: {
      type: String,
      enum: ["Cabins", "Mountains", "Beachfront", "Countryside", "City stays"],
      default: "Cabins",
    },
    guests: { type: Number, default: 2, min: 1, max: 30 },
    bedrooms: { type: Number, default: 1, min: 1, max: 20 },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    // Existing EJS records retain their geometry; area links work without a map key.
    geometry: {
      type: { type: String, enum: ["Point"] },
      coordinates: [Number],
    },
    seedKey: { type: String, select: false },
  },
  { timestamps: true },
);
schema.index({ createdAt: -1, _id: -1 });
schema.index({ category: 1, price: 1 });
export default mongoose.model("Listing", schema);
