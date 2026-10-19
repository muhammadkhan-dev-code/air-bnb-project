import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/authApi";
const Context = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  async function restore() {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.me();
      setUser(data.user);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    restore();
  }, []);
  const login = async (values) => {
    const data = await authApi.login(values);
    setUser(data.user);
    setError(null);
  };
  const signup = async (values) => {
    const data = await authApi.signup(values);
    setUser(data.user);
    setError(null);
  };
  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };
  return (
    <Context.Provider
      value={{ user, loading, error, retry: restore, login, signup, logout }}
    >
      {children}
    </Context.Provider>
  );
}
export const useAuth = () => useContext(Context);
