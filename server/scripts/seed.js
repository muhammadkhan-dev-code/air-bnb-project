import { readEnv } from "../src/config/env.js";
import { connectDatabase } from "../src/config/database.js";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import Listing from "../src/models/Listing.js";
try {
  const config = readEnv();
  const password = process.env.SEED_PASSWORD;
  if (!password || password.length < 8)
    throw new Error(
      "Set SEED_PASSWORD to at least 8 characters in server/.env.",
    );
  await connectDatabase(config.mongoUrl);
  const username = process.env.SEED_USERNAME || "demo_host";
  let user = await User.findOne({ username });
  if (!user)
    user = await User.register(
      new User({
        username,
        email: process.env.SEED_EMAIL || "host@example.com",
      }),
      password,
    );
  else {
    const { user: authenticated } = await User.authenticate()(
      username,
      password,
    );
    if (!authenticated)
      throw new Error(
        "An account with that seed username exists. Supply its correct password or choose a new seed username.",
      );
  }
  const samples = [
    ["The Woodland Retreat", "Hunza", "Cabins", 18500, 4, 2],
    ["A Little Closer to the Sky", "Skardu", "Mountains", 14200, 3, 1],
    ["The Sunlit City Apartment", "Islamabad", "City stays", 9800, 2, 1],
    ["Palm House by the Water", "Karachi", "Beachfront", 24000, 6, 3],
    ["A Frame, A Forest, A Pause", "Murree", "Cabins", 16500, 4, 2],
    ["The Courtyard Residence", "Lahore", "Countryside", 12800, 5, 2],
  ];
  let added = 0;
  for (const [
    i,
    [title, location, category, price, guests, bedrooms],
  ] of samples.entries()) {
    const seedKey = `starter-${user._id}-${i}`;
    if (await Listing.exists({ seedKey })) continue;
    await Listing.create({
      seedKey,
      title,
      location,
      category,
      price,
      guests,
      bedrooms,
      country: "Pakistan",
      owner: user._id,
      image: {
        url: `/images/stay-${i + 1}.jpg`,
        filename: `stay-${i + 1}.jpg`,
        provider: "seed",
      },
      description:
        "Slow mornings, fresh air, and space to reconnect. This thoughtfully furnished retreat offers inviting interiors, a comfortable living area, and room to unwind. Explore the surroundings and make yourself at home.",
    });
    added++;
  }
  console.log(
    `Added ${added} sample listings. Existing data was not deleted. Sign in as ${username} using your SEED_PASSWORD.`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
