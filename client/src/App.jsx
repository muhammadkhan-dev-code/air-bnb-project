import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Home from "./pages/Home";
import SavedPage from "./pages/SavedPage";
import ListingDetailsPage from "./pages/ListingDetailsPage";
import { CreateListingPage, EditListingPage } from "./pages/ListingEditorPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import { useSaved } from "./context/SavedContext";
export default function App() {
  const { savedIds } = useSaved();
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:not-sr-only focus:rounded-xl focus:bg-white focus:p-4"
      >
        Skip to content
      </a>
      <Navbar savedCount={savedIds.length} />
      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings/new"
            element={
              <ProtectedRoute>
                <CreateListingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/listings/:id" element={<ListingDetailsPage />} />
          <Route
            path="/listings/:id/edit"
            element={
              <ProtectedRoute>
                <EditListingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<AuthPage key="login" />} />
          <Route path="/signup" element={<AuthPage key="signup" signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
