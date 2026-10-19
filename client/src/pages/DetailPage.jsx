import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BedDouble,
  Heart,
  House,
  MapPin,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { container, primary, secondary, input } from "../utils/styles";
import { formatPrice, getRating } from "../utils/formatters";
import PropertyImage from "../components/ui/PropertyImage";
import SaveButton from "../components/listings/SaveButton";
import Field from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";

export default function DetailPage({
  listing,
  savedIds,
  toggleSaved,
  addReview,
  deleteReview,
  deleteListing,
}) {
  const id = listing.id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionError, setActionError] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const rating = getRating(listing.reviews);
  async function submitReview(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const comment = String(data.get("comment")).trim();
    if (!comment) {
      setReviewMessage("Please write a review.");
      return;
    }
    setBusy(true);
    setReviewMessage("");
    try {
      await addReview({ comment, rating: Number(data.get("rating")) });
      form.reset();
      setReviewMessage("Your review has been added.");
    } catch (error) {
      setReviewMessage(error.message);
    } finally {
      setBusy(false);
    }
  }
  async function removeReview(id) {
    setBusy(true);
    setActionError("");
    try {
      await deleteReview(id);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setBusy(false);
    }
  }
  async function removeListing() {
    setBusy(true);
    setActionError("");
    try {
      await deleteListing();
      navigate("/");
    } catch (error) {
      setActionError(error.message);
      setBusy(false);
    }
  }
  return (
    <section className={`${container} py-8 sm:py-12`}>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={16} />
        Back to stays
      </Link>
      <div className="mb-7 mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand">
            {listing.category}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {listing.title}
          </h1>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
            <MapPin size={15} />
            {listing.location}, {listing.country}
          </p>
        </div>
        <SaveButton
          saved={savedIds.includes(id)}
          onClick={() => toggleSaved(id)}
        />
      </div>
      <PropertyImage
        key={listing.image}
        src={listing.image}
        alt={listing.title}
        className="h-64 w-full rounded-3xl object-cover sm:h-96 lg:h-[480px]"
      />
      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_340px] lg:gap-16">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-5 border-b border-line pb-7">
            <div>
              <h2 className="text-xl font-semibold">
                A place to unwind, hosted by {listing.host}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {listing.guests} guests · {listing.bedrooms} bedrooms · Entire
                place
              </p>
            </div>
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#e9ede4] text-xl font-semibold">
              {listing.host.charAt(0)}
            </div>
          </div>
          <div className="space-y-5 border-b border-line py-7">
            {[
              [
                House,
                "Room to feel at home",
                "Your own space to settle in and slow down.",
              ],
              [
                MapPin,
                "A destination worth discovering",
                `Explore ${listing.location} at your own pace.`,
              ],
              [
                Sparkles,
                "The little things matter",
                "A welcoming setting for your next getaway.",
              ],
            ].map(([Icon, title, description]) => (
              <div key={title} className="flex gap-4">
                <Icon size={22} className="mt-1 shrink-0 text-brand" />
                <div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-b border-line py-8">
            <h2 className="text-xl font-semibold">About this space</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-muted">
              {listing.description}
            </p>
          </div>
          <div className="border-b border-line py-8">
            <h2 className="text-xl font-semibold">Where you’ll be</h2>
            <div className="mt-4 flex items-center gap-4 rounded-2xl bg-[#e9ede4] p-6">
              <MapPin size={30} className="shrink-0 text-brand" />
              <div>
                <p className="font-semibold">
                  {listing.location}, {listing.country}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.location}, ${listing.country}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm underline underline-offset-4"
                >
                  Explore this area on Google Maps
                </a>
              </div>
            </div>
          </div>
          <div className="py-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Star size={20} className="fill-brand text-brand" />
              {rating
                ? `${rating} · ${listing.reviews.length} reviews`
                : "No reviews yet"}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {listing.reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-line bg-white p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-canvas font-semibold">
                      {review.author.charAt(0)}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">{review.author}</h3>
                      <p
                        className="mt-1 text-xs text-brand"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {"★".repeat(review.rating)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 break-words text-sm leading-6 text-muted">
                    {review.comment}
                  </p>
                  {user?.id === review.authorId && (
                    <button
                      disabled={busy}
                      onClick={() => removeReview(review.id)}
                      className="mt-3 text-xs font-semibold text-brand"
                    >
                      Delete review
                    </button>
                  )}
                </article>
              ))}
            </div>
            {actionError && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {actionError}
              </p>
            )}
            {user ? (
              <form
                onSubmit={submitReview}
                className="mt-8 space-y-4 rounded-2xl border border-line bg-white p-6"
              >
                <h3 className="font-semibold">Share your experience</h3>
                <p className="text-xs text-muted">Posting as {user.username}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Rating">
                    <select name="rating" defaultValue="5" className={input}>
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                          {value} {value === 1 ? "star" : "stars"}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Your review">
                  <textarea
                    name="comment"
                    required
                    maxLength={1000}
                    rows={3}
                    placeholder="What made your stay memorable?"
                    className={input}
                  />
                </Field>
                <button disabled={busy} className={primary}>
                  {busy ? "Please wait…" : "Post review"}
                </button>
                <p role="status" className="text-sm text-muted">
                  {reviewMessage}
                </p>
              </form>
            ) : (
              <p className="mt-8 text-sm text-muted">
                <Link
                  className="font-semibold text-brand"
                  to="/login"
                  state={{ from: `/listings/${id}` }}
                >
                  Log in
                </Link>{" "}
                to share your experience.
              </p>
            )}
          </div>
        </div>
        <aside className="rounded-3xl border border-line bg-white p-7 shadow-xl shadow-stone-900/5 lg:sticky lg:top-28">
          <p className="text-2xl font-bold">
            {formatPrice(listing.price)}
            <span className="text-sm font-normal text-muted"> / night</span>
          </p>
          <div className="my-6 space-y-4 border-y border-line py-5 text-sm">
            <p className="flex items-center gap-3">
              <Users size={18} className="text-muted" />
              Up to {listing.guests} guests
            </p>
            <p className="flex items-center gap-3">
              <BedDouble size={18} className="text-muted" />
              {listing.bedrooms} bedrooms
            </p>
            <p className="flex items-center gap-3">
              <House size={18} className="text-muted" />
              {listing.category}
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleSaved(id)}
            className={`${primary} w-full`}
          >
            <Heart size={17} />
            {savedIds.includes(id)
              ? "Saved to your collection"
              : "Save this stay"}
          </button>
          <p className="mt-4 text-center text-xs leading-5 text-muted">
            Planning starts with a little inspiration.
          </p>
          {user?.id === listing.ownerId && (
            <>
              <Link
                to={`/listings/${id}/edit`}
                className={`${secondary} mt-5 w-full`}
              >
                Edit listing
              </Link>
              {confirmDelete ? (
                <div className="mt-4 rounded-xl bg-red-50 p-4">
                  <p className="text-sm">
                    Delete this listing and its reviews permanently?
                  </p>
                  <div className="mt-3 flex gap-3">
                    <button
                      disabled={busy}
                      onClick={removeListing}
                      className="text-sm font-bold text-red-700"
                    >
                      Delete permanently
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => setConfirmDelete(false)}
                      className="text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="mt-4 w-full text-sm text-red-700"
                >
                  Delete listing
                </button>
              )}
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
