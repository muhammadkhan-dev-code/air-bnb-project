import { randomBytes, timingSafeEqual } from "node:crypto";
import { ApiError } from "../utils/ApiError.js";
export function csrfToken(req) {
  if (!req.session.csrf) req.session.csrf = randomBytes(32).toString("hex");
  return req.session.csrf;
}
export function csrfProtection(origin) {
  return (req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
    const reqOrigin = req.get("origin");
    if (reqOrigin && reqOrigin !== origin) {
      const isLocalDev =
        (origin.includes("localhost") || origin.includes("127.0.0.1")) &&
        (reqOrigin.includes("localhost") || reqOrigin.includes("127.0.0.1"));
      if (!isLocalDev) {
        throw new ApiError(403, "Request origin is not allowed.");
      }
    }
    const expected = req.session.csrf;
    const actual = req.get("x-csrf-token");
    if (
      !expected ||
      !actual ||
      Buffer.byteLength(actual) !== Buffer.byteLength(expected) ||
      !timingSafeEqual(Buffer.from(expected), Buffer.from(actual))
    )
      throw new ApiError(
        403,
        "Your session expired. Refresh the page and try again.",
      );
    next();
  };
}
