import { useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useSaved } from "../context/SavedContext";
import { listingApi } from "../services/listingApi";
import DetailPage from "./DetailPage";
import RequestState from "../components/ui/RequestState";
import NotFound from "./NotFound";
import { container } from "../utils/styles";
export default function ListingDetailsPage() {
  const { id } = useParams();
  const { data, loading, error, reload } = useApi(`/listings/${id}`);
  const { savedIds, toggleSaved, reload: reloadSaved } = useSaved();
  if (error?.status === 404 || error?.status === 400) return <NotFound />;
  // Keep the page mounted while a review refresh is pending.
  if ((loading && !data) || error)
    return (
      <div className={`${container} py-12`}>
        <RequestState loading={loading} error={error} retry={reload} />
      </div>
    );
  if (!data || data.listing.id !== id)
    return (
      <div className={`${container} py-12`}>
        <RequestState loading />
      </div>
    );
  return (
    <DetailPage
      key={id}
      listing={data.listing}
      savedIds={savedIds}
      toggleSaved={toggleSaved}
      addReview={async (body) => {
        await listingApi.review(id, body);
        reload();
      }}
      deleteReview={async (reviewId) => {
        await listingApi.removeReview(id, reviewId);
        reload();
      }}
      deleteListing={async () => {
        await listingApi.remove(id);
        await reloadSaved();
      }}
    />
  );
}
