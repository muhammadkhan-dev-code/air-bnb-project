export function notFound(req, res) {
  res.status(404).json({ message: "API route not found." });
}
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  let status = error.status || 500;
  let message = error.message;
  if (error.code === 11000 || error.name === "UserExistsError") {
    status = 409;
    message = "That username or email is already registered.";
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    status = 400;
    message = "Please check the values you entered.";
  }
  if (error.name === "MulterError") {
    status = 400;
    message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Image must be smaller than 5 MB."
        : "Invalid image upload.";
  }
  if (status >= 500) {
    console.error("Request failed:", error.name);
    message = "Something went wrong. Please try again.";
  }
  res.status(status).json({ message });
}
