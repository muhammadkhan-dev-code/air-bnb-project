import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RequestState from "../ui/RequestState";
import { container } from "../../utils/styles";
export default function ProtectedRoute({ children }) {
  const { user, loading, error, retry } = useAuth();
  const location = useLocation();
  if (loading || error)
    return (
      <div className={`${container} py-12`}>
        <RequestState loading={loading} error={error} retry={retry} />
      </div>
    );
  return user ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}
