import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";
const Context = createContext(null);
export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");
  const timer = useRef();
  const notify = useCallback((text) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 6000);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <Context.Provider value={notify}>
      {children}
      {message && (
        <div
          role="status"
          className="fixed bottom-5 left-5 right-5 z-50 flex items-center justify-between gap-5 rounded-2xl bg-ink p-5 text-sm text-white shadow-xl sm:left-auto sm:max-w-md"
        >
          <span>{message}</span>
          <button
            onClick={() => setMessage("")}
            aria-label="Dismiss notification"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
export const useToast = () => useContext(Context);
