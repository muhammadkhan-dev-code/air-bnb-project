import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import { container, primary, secondary, input } from "../utils/styles";
import { categories, heroImage } from "../utils/constants";
import PropertyImage from "../components/ui/PropertyImage";
import PropertyCard from "../components/listings/PropertyCard";
import Field from "../components/ui/Field";
import EmptyState from "../components/ui/EmptyState";
import RequestState from "../components/ui/RequestState";
import { useApi } from "../hooks/useApi";
import { useSaved } from "../context/SavedContext";

export default function Home() {
  const { savedIds, toggleSaved } = useSaved();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All stays");
  const [sort, setSort] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState("");
  const [guests, setGuests] = useState("1");
  const params = JSON.stringify({
    q: query,
    category,
    sort,
    guests,
    ...(maxPrice !== "" && { maxPrice }),
    page,
    limit: 9,
  });
  const { data, loading, error, reload } = useApi(
    `/listings?${new URLSearchParams(JSON.parse(params))}`,
  );
  const filtered = data?.items || [];
  function resetFilters() {
    setPage(1);
    setQuery("");
    setSearch("");
    setCategory("All stays");
    setMaxPrice("");
    setGuests("1");
    setSort("recommended");
  }
  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    setQuery(search);
    document.getElementById("stays")?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <>
      <section className={`${container} pt-6 sm:pt-8`}>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-stone-800">
          <PropertyImage
            src={heroImage}
            alt="A peaceful cabin surrounded by trees"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 -z-10 bg-black/45" />
          <div className="max-w-3xl px-7 pb-28 pt-16 sm:px-12 sm:pb-32 sm:pt-20 lg:px-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md sm:text-xs">
              <Sparkles size={14} />
              Less ordinary. More you.
            </span>
            <h1 className="mt-7 text-5xl font-medium leading-[1.06] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              Somewhere new.
              <br />
              Something <span className="font-serif italic">you.</span>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/85 sm:text-base">
              Discover thoughtful stays, quiet corners, and places you’ll wish
              you’d found sooner.
            </p>
            <a
              href="#stays"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white"
            >
              Find your next escape <ArrowRight size={17} />
            </a>
          </div>
          <span className="absolute bottom-7 right-8 hidden items-center gap-2 text-xs text-white/80 sm:flex">
            <MapPin size={14} />A slower kind of getaway
          </span>
        </div>
        <form
          onSubmit={handleSearch}
          className="relative z-10 mx-4 -mt-14 grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-xl shadow-stone-900/5 sm:mx-10 md:grid-cols-[1fr_180px_auto] md:items-end md:gap-6 md:p-6"
        >
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold">
              <MapPin size={15} className="text-brand" />
              Where to?
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search a city or a special stay"
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold">
              <Users size={15} className="text-brand" />
              Who’s coming?
            </span>
            <select
              value={guests}
              onChange={(event) => {
                setPage(1);
                setGuests(event.target.value);
              }}
              className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
            >
              {[1, 2, 3, 4, 5, 6].map((number) => (
                <option key={number} value={number}>
                  {number} {number === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </label>
          <button className={`${primary} min-h-11`}>
            <Search size={17} />
            Explore stays
          </button>
        </form>
      </section>
      <section
        id="stays"
        className={`${container} scroll-mt-28 py-14 sm:py-20`}
      >
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
              A place for every pace
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your next good memory.
            </h2>
            <p className="mt-3 text-sm text-muted">
              Beautiful places to switch off and settle in.
            </p>
          </div>
          <button
            type="button"
            className={`${secondary} self-start`}
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-expanded={filtersOpen}
            aria-controls="listing-filters"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              aria-pressed={category === label}
              onClick={() => {
                setPage(1);
                setCategory(label);
              }}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition ${category === label ? "border-ink bg-ink text-white" : "border-line bg-white text-muted hover:border-stone-400 hover:text-ink"}`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
        {filtersOpen && (
          <div
            id="listing-filters"
            className="mb-8 grid  gap-5 rounded-2xl border border-line bg-white p-5 sm:grid-cols-3 sm:items-end"
          >
            <Field label="Maximum nightly price (PKR)">
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) => {
                  setPage(1);
                  setMaxPrice(event.target.value);
                }}
                placeholder="No maximum"
                className={input}
              />
            </Field>
            <Field label="Sort by">
              <select
                value={sort}
                onChange={(event) => {
                  setPage(1);
                  setSort(event.target.value);
                }}
                className={input}
              >
                <option value="recommended">Featured order</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </Field>
            <button type="button" onClick={resetFilters} className={secondary}>
              Reset filters
            </button>
          </div>
        )}
        <div className="mb-5 flex items-center justify-between gap-3 text-xs text-muted">
          <p>{data?.total || 0} stays to make your own</p>
          {query && <p>Results for “{query}”</p>}
        </div>
        {loading || error ? (
          <RequestState loading={loading} error={error} retry={reload} />
        ) : filtered.length ? (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((listing) => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                saved={savedIds.includes(listing.id)}
                toggleSaved={toggleSaved}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your next stay is still out there."
            text="Try another destination or adjust your filters."
          >
            <button onClick={resetFilters} className={primary}>
              Clear filters
            </button>
          </EmptyState>
        )}
        {data?.pages > 1 && !loading && (
          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              className={secondary}
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-muted">
              {page} / {data.pages}
            </span>
            <button
              className={secondary}
              disabled={page >= data.pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>
      <section className={`${container} pb-16`}>
        <div className="grid overflow-hidden rounded-[2rem] bg-[#e9ede4] md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
              Open your doors
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Your space.
              <br />
              Someone’s favorite place.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted">
              A cozy room, a mountain hideaway, or a home full of character.
              Share what makes your place special.
            </p>
            <Link to="/listings/new" className={`${primary} mt-7 self-start`}>
              Become a host <ArrowRight size={16} />
            </Link>
          </div>
          <PropertyImage
            src="/images/host-home.jpg"
            alt="A welcoming home"
            loading="lazy"
            className="h-64 w-full object-cover md:h-full md:min-h-96"
          />
        </div>
      </section>
    </>
  );
}
