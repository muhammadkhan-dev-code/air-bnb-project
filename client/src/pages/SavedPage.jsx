import { Link } from "react-router-dom";
import { useSaved } from "../context/SavedContext";
import PropertyCard from "../components/listings/PropertyCard";
import EmptyState from "../components/ui/EmptyState";
import RequestState from "../components/ui/RequestState";
import { container, primary } from "../utils/styles";
export default function SavedPage() {
  const { items, toggleSaved, loading, error, reload } = useSaved();
  return (
    <section className={`${container} py-12 sm:py-16`}>
      <p className="text-xs font-bold uppercase tracking-widest text-brand">
        A little inspiration
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Your saved stays.
      </h1>
      <p className="mb-10 mt-3 text-muted">
        All the places you’d love to wake up in.
      </p>
      {loading || error ? (
        <RequestState loading={loading} error={error} retry={reload} />
      ) : items.length ? (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((listing) => (
            <PropertyCard
              key={listing.id}
              listing={listing}
              saved
              toggleSaved={toggleSaved}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Start your someday list."
          text="Tap the heart on any stay to keep it here."
        >
          <Link to="/" className={primary}>
            Explore stays
          </Link>
        </EmptyState>
      )}
    </section>
  );
}
