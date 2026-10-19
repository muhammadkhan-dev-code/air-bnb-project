let csrfToken;
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
export async function request(path, { method = "GET", body, signal } = {}) {
  const headers = {};
  if (!["GET", "HEAD"].includes(method)) {
    if (!csrfToken) {
      const session = await request("/auth/me");
      csrfToken = session.csrfToken;
    }
    headers["X-CSRF-Token"] = csrfToken;
  }
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }
  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      body,
      signal,
      headers,
      credentials: "same-origin",
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError(
      "Cannot reach the server. Please check your connection and try again.",
      0,
    );
  }
  const data = await response.json().catch(() => ({}));
  if (data.csrfToken) csrfToken = data.csrfToken;
  if (!response.ok)
    throw new ApiError(
      data.message || "The request failed. Please try again.",
      response.status,
    );
  return data;
}
export function clearCsrfToken() {
  csrfToken = undefined;
}
