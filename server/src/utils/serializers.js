export const userDto = (user) =>
  user
    ? { id: String(user._id), username: user.username, email: user.email }
    : null;
export function listingDto(listing) {
  const reviews = (listing.reviews || [])
    .filter((review) => review && typeof review.rating === "number")
    .map((review) => ({
      id: String(review._id),
      rating: review.rating,
      comment: review.comment,
      author: review.author?.username || "Former member",
      authorId: review.author?._id ? String(review.author._id) : null,
      createdAt: review.createdAt,
    }));
  return {
    id: String(listing._id),
    title: listing.title,
    description: listing.description,
    image: listing.image?.url || "/images/stay-1.jpg",
    price: listing.price,
    location: listing.location,
    country: listing.country,
    category: listing.category || "Cabins",
    guests: listing.guests || 2,
    bedrooms: listing.bedrooms || 1,
    host: listing.owner?.username || "Former host",
    ownerId: listing.owner?._id ? String(listing.owner._id) : null,
    reviews,
    createdAt: listing.createdAt,
  };
}
export const populateListing = (query) =>
  query
    .populate("owner", "username")
    .populate({
      path: "reviews",
      select: "rating comment author createdAt",
      populate: { path: "author", select: "username" },
    });
