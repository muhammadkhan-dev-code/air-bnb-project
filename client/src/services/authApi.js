import { request, clearCsrfToken } from "./api";
export const authApi = {
  me: () => request("/auth/me"),
  login: (body) => request("/auth/login", { method: "POST", body }),
  signup: (body) => request("/auth/signup", { method: "POST", body }),
  logout: async () => {
    await request("/auth/logout", { method: "POST" });
    clearCsrfToken();
  },
};
