# API and migration

All routes use `/api`. Responses are JSON. Failures return `{ "message": "..." }` with an appropriate HTTP status. UI values are escaped by React.

## Authentication

| Method | Route        | Payload / result                                             |
| ------ | ------------ | ------------------------------------------------------------ |
| GET    | /auth/me     | `{ user, csrfToken }`; user is null when logged out          |
| POST   | /auth/signup | `{ username, email, password }`; creates account and session |
| POST   | /auth/login  | `{ username, password }`; rotates session                    |
| POST   | /auth/logout | destroys session                                             |

GET /auth/me before mutations. Send `X-CSRF-Token` and the session cookie on POST/PUT/DELETE. Login and signup return a fresh CSRF token. User DTO includes only id, username and email. Never expose password hashes/salts or save passwords in the client.

## Listings

| Method | Route         | Behavior                                         |
| ------ | ------------- | ------------------------------------------------ |
| GET    | /listings     | paginated items, total, page and pages           |
| GET    | /listings/:id | `{ listing }` with owner and review display data |
| POST   | /listings     | authenticated creation                           |
| PUT    | /listings/:id | owner-only full field update                     |
| DELETE | /listings/:id | owner-only deletion and related-data cleanup     |

Search query: `q`, `category`, `guests`, `maxPrice`, `sort` (`recommended`, `price-low`, `price-high`), `page`, `limit` (1–24). Search is literal/escaped, not a user-supplied regular expression.

Create/update fields: title, description, location, country, price, category, guests, bedrooms. Use FormData with file field `image`; required on creation, optional on update. Unknown fields, including owner IDs, are rejected. Numeric strings from multipart forms are validated/coerced on the server.

## Reviews and favorites

| Method | Route                           | Behavior                                        |
| ------ | ------------------------------- | ----------------------------------------------- |
| POST   | /listings/:id/reviews           | `{ rating: 1..5, comment }`; authenticated      |
| DELETE | /listings/:id/reviews/:reviewId | review author only; must belong to this listing |
| GET    | /saved                          | current user's saved listing DTOs               |
| PUT    | /saved/:id                      | idempotent save                                 |
| DELETE | /saved/:id                      | idempotent removal                              |

## Existing database compatibility

Collection names remain `users`, `listings`, `reviews`. The Passport Local Mongoose hash/salt format is retained. Set `MONGODB_URI` to a copied instance of your original DB to verify existing accounts. `ATLASDB_URL` and `SECRET` are accepted as aliases, but secrets shorter than 32 characters are rejected. Changing the session secret logs users out; it does not change their passwords.

New optional listing fields (category, guests, bedrooms) use defaults on old records. Existing populated owner/review links are retained. Missing owners/authors display a fallback and do not gain edit permissions. Existing user savedListings defaults to an empty list. The seed adds samples without deleting old listings.

Old cloud images keep their original URLs. Uploaded images from the supplied archive are included in **server/public/images/uploads**. Copy any additional old `/images/uploads/...` files from your deployed server into that folder. The dev proxy forwards this legacy URL to the server. New uploads use `/uploads/...` or Cloudinary URLs. Legacy images without a storage provider marker are deliberately not automatically deleted, to avoid deleting shared or unknown files.

The stored geometry field is preserved, but new records do not receive fabricated coordinates. Location links use city/country search instead of the original embedded Mapbox widget. Add a geocoding service later if exact map display is required.

## Operational limits

Mongo sessions and records are persistent. Local image storage needs a persistent disk. Cloudinary cleanup failures are logged for later retry. Review/listing deletion is ordered and retryable, but multi-document changes are not transactional; large production deployments should add replica-set transactions and an image cleanup queue. Rate limits are per process; shared rate-limit storage is needed for horizontally scaled API instances. The API paginates listings; saved stays currently return the user's entire saved collection.
