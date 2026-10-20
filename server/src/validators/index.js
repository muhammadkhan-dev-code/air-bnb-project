import Joi from "joi";
import { ApiError } from "../utils/ApiError.js";
export const listingSchema = Joi.object({
  title: Joi.string().trim().min(1).max(80).required(),
  description: Joi.string().trim().min(1).max(3000).required(),
  location: Joi.string().trim().min(1).max(100).required(),
  country: Joi.string().trim().min(1).max(80).required(),
  price: Joi.number().integer().min(1).max(10000000).required(),
  category: Joi.string()
    .valid("Cabins", "Mountains", "Beachfront", "Countryside", "City stays")
    .required(),
  guests: Joi.number().integer().min(1).max(30).required(),
  bedrooms: Joi.number().integer().min(1).max(20).required(),
});
export const signupSchema = Joi.object({
  username: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z0-9_]{3,40}$/)
    .required(),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .lowercase()
    .max(254)
    .required(),
  password: Joi.string().min(8).max(128).required(),
});
export const loginSchema = Joi.object({
  username: Joi.string().trim().max(40).required(),
  password: Joi.string().max(128).required(),
});
export const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().min(1).max(1000).required(),
});
export const searchSchema = Joi.object({
  q: Joi.string().trim().max(100).allow("").default(""),
  category: Joi.string()
    .valid(
      "All stays",
      "Cabins",
      "Mountains",
      "Beachfront",
      "Countryside",
      "City stays",
    )
    .default("All stays"),
  guests: Joi.number().integer().min(1).max(30).default(1),
  maxPrice: Joi.number().min(0).max(10000000),
  sort: Joi.string()
    .valid("recommended", "price-low", "price-high")
    .default("recommended"),
  page: Joi.number().integer().min(1).max(10000).default(1),
  limit: Joi.number().integer().min(1).max(24).default(9),
});
export function parse(schema, value) {
  const result = schema.validate(value, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (result.error)
    throw new ApiError(
      400,
      result.error.details.map((item) => item.message).join(" "),
    );
  return result.value;
}
export const validate = (schema) => (req, res, next) => {
  req.validated = parse(schema, req.body);
  next();
};
