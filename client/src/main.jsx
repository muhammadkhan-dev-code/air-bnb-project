import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { SavedProvider } from "./context/SavedContext";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ToastProvider>
      <AuthProvider>
        <SavedProvider>
          <App />
        </SavedProvider>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>,
);
