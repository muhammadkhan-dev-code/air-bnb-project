import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck, Upload } from "lucide-react";
import { container, primary, secondary, input } from "../../utils/styles";
import { categories } from "../../utils/constants";
import { formatPrice } from "../../utils/formatters";
import Field from "../ui/Field";
import PropertyImage from "../ui/PropertyImage";

export default function ListingForm({ existing, onSave }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: existing?.title ?? "",
    description: existing?.description ?? "",
    location: existing?.location ?? "",
    country: existing?.country ?? "Pakistan",
    price: existing?.price ?? "",
    category: existing?.category ?? "Cabins",
    guests: existing?.guests ?? 2,
    bedrooms: existing?.bedrooms ?? 1,
    image: existing?.image ?? "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }
  function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Please choose an image smaller than 5 MB.");
      event.target.value = "";
      return;
    }
    setError("");
    setReading(true);
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, image: String(reader.result) }));
      setReading(false);
    };
    reader.onerror = () => {
      setError("The image could not be read. Please try another file.");
      setReading(false);
    };
    reader.readAsDataURL(file);
  }
  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!existing && !imageFile) {
      setError("Please add a property image.");
      return;
    }
    if (
      ![form.title, form.description, form.location, form.country].every(
        (value) => value.trim(),
      )
    ) {
      setError("Please complete all text fields.");
      return;
    }
    const payload = new FormData();
    for (const [key, value] of Object.entries(form))
      if (key !== "image") payload.append(key, String(value).trim());
    if (imageFile) payload.append("image", imageFile);
    setBusy(true);
    try {
      const result = await onSave(payload);
      navigate(`/listings/${result.listing.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={`${container} py-10 sm:py-14`}>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted"
      >
        <ArrowLeft size={16} />
        Back to discover
      </Link>
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-brand">
        {existing
          ? "Make it feel just right"
          : "Good spaces deserve to be shared"}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {existing
          ? "A little update. A better stay."
          : "Make room for new adventures."}
      </h1>
      <p className="mt-3 text-sm text-muted">
        {existing
          ? "Refresh your property details and preview the result."
          : "Tell us what makes your place special."}
      </p>
      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_350px]">
        <form
          onSubmit={submit}
          className="space-y-7 rounded-3xl border border-line bg-white p-6 sm:p-8"
        >
          <div>
            <h2 className="text-lg font-semibold">The essentials</h2>
            <p className="mt-1 text-xs text-muted">
              A thoughtful introduction to your space.
            </p>
          </div>
          <Field label="Property title">
            <input
              name="title"
              value={form.title}
              onChange={update}
              required
              maxLength={80}
              placeholder="e.g. A quiet cabin in Hunza"
              className={input}
            />
          </Field>
          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={update}
              required
              maxLength={3000}
              rows={5}
              placeholder="Describe the space, the atmosphere, and the little details..."
              className={input}
            />
          </Field>
          <Field label="Property photo" hint="JPG, PNG, or WebP · Up to 5 MB">
            <span className="flex min-h-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-canvas p-5 text-center">
              <Upload size={25} className="mb-3 text-brand" />
              <span className="text-sm font-semibold">
                {form.image
                  ? "Choose a replacement photo"
                  : "Choose your best property photo"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={upload}
                disabled={reading}
                className="mt-4 w-full max-w-xs text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:font-semibold file:text-ink"
              />
            </span>
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Location">
              <input
                name="location"
                value={form.location}
                onChange={update}
                required
                maxLength={100}
                placeholder="City or region"
                className={input}
              />
            </Field>
            <Field label="Country">
              <input
                name="country"
                value={form.country}
                onChange={update}
                required
                maxLength={80}
                className={input}
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Price per night (PKR)">
              <input
                name="price"
                type="number"
                min="1"
                max="10000000"
                step="1"
                value={form.price}
                onChange={update}
                required
                placeholder="15000"
                className={input}
              />
            </Field>
            <Field label="Category">
              <select
                name="category"
                value={form.category}
                onChange={update}
                className={input}
              >
                {categories.slice(1).map(({ label }) => (
                  <option key={label}>{label}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Guests">
              <input
                name="guests"
                type="number"
                min="1"
                max="30"
                value={form.guests}
                onChange={update}
                required
                className={input}
              />
            </Field>
            <Field label="Bedrooms">
              <input
                name="bedrooms"
                type="number"
                min="1"
                max="20"
                value={form.bedrooms}
                onChange={update}
                required
                className={input}
              />
            </Field>
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
            <Link
              to={existing ? `/listings/${existing.id}` : "/"}
              className={secondary}
            >
              Cancel
            </Link>
            <button disabled={reading || busy} className={primary}>
              {busy
                ? "Saving…"
                : reading
                  ? "Reading image…"
                  : existing
                    ? "Save changes"
                    : "Create listing"}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
        <aside className="space-y-5 lg:sticky lg:top-28">
          <div className="rounded-3xl border border-line bg-white p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
              Your listing preview
            </p>
            <PropertyImage
              key={form.image}
              src={form.image}
              alt="Your property preview"
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
            <span className="mt-4 inline-block rounded-full bg-canvas px-3 py-1 text-xs">
              {form.category}
            </span>
            <h2 className="mt-3 break-words text-lg font-semibold">
              {form.title || "Your beautiful place"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {form.location || "Your location"}, {form.country || "Country"}
            </p>
            <p className="mt-2 text-xs text-muted">
              {form.guests || 0} guests · {form.bedrooms || 0} bedrooms
            </p>
            <p className="mt-5 font-bold">
              {formatPrice(Number(form.price) || 0)}
              <span className="text-sm font-normal text-muted"> / night</span>
            </p>
          </div>
          <div className="rounded-2xl bg-[#e9ede4] p-5">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck size={19} />A good first impression
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              Use a clear, well-lit photo and an honest description. Small
              details help guests picture their stay.
            </p>
          </div>
          <p className="px-2 text-xs leading-5 text-muted">
            Your listing is saved to your account. You can update it anytime.
          </p>
        </aside>
      </div>
    </section>
  );
}
