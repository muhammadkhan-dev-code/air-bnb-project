import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  },
  { timestamps: true },
);
schema.plugin(passportLocalMongoose);
export default mongoose.model("User", schema);
