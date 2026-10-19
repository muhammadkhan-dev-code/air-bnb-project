import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import PropertyImage from "../ui/PropertyImage";
import SaveButton from "./SaveButton";
import { formatPrice, getRating } from "../../utils/formatters";

export default function PropertyCard({ listing, saved, toggleSaved }) {
  const rating = getRating(listing.reviews);
  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden rounded-2xl bg-stone-200">
        <Link to={`/listings/${listing.id}`} className="block overflow-hidden">
          <PropertyImage
            key={listing.image}
            src={listing.image}
            alt={listing.title}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition duration-500 motion-safe:group-hover:scale-105"
          />
        </Link>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold shadow-sm">
          {listing.category}
        </span>
        <div className="absolute right-3 top-3">
          <SaveButton
            overlay
            saved={saved}
            onClick={() => toggleSaved(listing.id)}
          />
        </div>
      </div>
      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/listings/${listing.id}`}
            className="font-semibold tracking-tight hover:text-brand"
          >
            {listing.title}
          </Link>
          <span className="flex shrink-0 items-center gap-1 text-xs">
            <Star size={13} className="fill-ink" />
            {rating ?? "New"}
          </span>
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-sm text-muted">
          <MapPin size={13} />
          {listing.location}, {listing.country}
        </p>
        <p className="mt-1 text-xs text-muted">
          {listing.guests} guests · {listing.bedrooms} bedrooms
        </p>
        <p className="mt-3 text-sm">
          <span className="font-bold">{formatPrice(listing.price)}</span>
          <span className="text-muted"> / night</span>
        </p>
      </div>
    </article>
  );
}
