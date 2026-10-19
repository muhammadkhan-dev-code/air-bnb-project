import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { savedApi } from "../services/savedApi";
const Context = createContext(null);
export function SavedProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [state, setState] = useState({
    owner: null,
    items: [],
    loading: false,
    error: null,
  });
  const pending = useRef(new Set());
  const userId = user?.id;
  const reload = useCallback(async () => {
    if (!userId) return;
    setState((current) => ({
      ...current,
      owner: userId,
      loading: true,
      error: null,
    }));
    try {
      const data = await savedApi.list();
      setState({
        owner: userId,
        items: data.items,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({ owner: userId, items: [], loading: false, error });
    }
  }, [userId]);
  useEffect(() => {
    reload();
  }, [reload]);
  const items = state.owner === userId ? state.items : [];
  async function toggleSaved(id) {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (pending.current.has(id)) return;
    pending.current.add(id);
    try {
      await (items.some((item) => item.id === id)
        ? savedApi.remove(id)
        : savedApi.save(id));
      await reload();
    } catch (error) {
      toast(error.message);
    } finally {
      pending.current.delete(id);
    }
  }
  return (
    <Context.Provider
      value={{
        items,
        savedIds: items.map((item) => item.id),
        toggleSaved,
        reload,
        loading: Boolean(userId) && (state.owner !== userId || state.loading),
        error: state.owner === userId ? state.error : null,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useSaved = () => useContext(Context);
