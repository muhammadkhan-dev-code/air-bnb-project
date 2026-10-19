import { LoaderCircle } from "lucide-react";
import { secondary } from "../../utils/styles";
export default function RequestState({ loading, error, retry }) {
  return (
    <div
      className="rounded-2xl border border-line bg-white px-6 py-16 text-center"
      role={error ? "alert" : "status"}
    >
      {loading ? (
        <>
          <LoaderCircle className="mx-auto mb-4 animate-spin text-brand motion-reduce:animate-none" />
          <p className="text-sm text-muted">Finding your next adventure…</p>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold">
            We couldn’t load this just yet.
          </h2>
          <p className="mt-2 text-sm text-muted">{error?.message}</p>
          {retry && (
            <button onClick={retry} className={`${secondary} mt-5`}>
              Try again
            </button>
          )}
        </>
      )}
    </div>
  );
}
