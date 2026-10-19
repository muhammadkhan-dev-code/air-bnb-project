import { request } from "./api";
export const savedApi = {
  list: () => request("/saved"),
  save: (id) => request(`/saved/${id}`, { method: "PUT" }),
  remove: (id) => request(`/saved/${id}`, { method: "DELETE" }),
};
