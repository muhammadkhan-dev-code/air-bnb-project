import { request } from "./api";
export const listingApi = {
  create: (body) => request("/listings", { method: "POST", body }),
  update: (id, body) => request(`/listings/${id}`, { method: "PUT", body }),
  remove: (id) => request(`/listings/${id}`, { method: "DELETE" }),
  review: (id, body) =>
    request(`/listings/${id}/reviews`, { method: "POST", body }),
  removeReview: (id, reviewId) =>
    request(`/listings/${id}/reviews/${reviewId}`, { method: "DELETE" }),
};
