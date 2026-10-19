import { useParams } from "react-router-dom";
import ListingForm from "../components/listings/ListingForm";
import { listingApi } from "../services/listingApi";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { useSaved } from "../context/SavedContext";
import RequestState from "../components/ui/RequestState";
import EmptyState from "../components/ui/EmptyState";
import { container } from "../utils/styles";
export function CreateListingPage() {
  return <ListingForm onSave={listingApi.create} />;
}
export function EditListingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { reload: reloadSaved } = useSaved();
  const { data, loading, error, reload } = useApi(`/listings/${id}`);
  if (loading || error)
    return (
      <div className={`${container} py-12`}>
        <RequestState loading={loading} error={error} retry={reload} />
      </div>
    );
  if (data.listing.ownerId !== user.id)
    return (
      <div className={`${container} py-12`}>
        <EmptyState
          title="This space belongs to another host."
          text="Only the listing owner can edit its details."
        />
      </div>
    );
  return (
    <ListingForm
      key={id}
      existing={data.listing}
      onSave={async (body) => {
        const result = await listingApi.update(id, body);
        await reloadSaved();
        return result;
      }}
    />
  );
}
