import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";
import {
  parse,
  listingSchema,
  reviewSchema,
  signupSchema,
  searchSchema,
} from "../src/validators/index.js";
import { storeImage } from "../src/services/imageService.js";
test("reject invalid and privileged request fields", () => {
  const valid = {
    title: "Cabin",
    description: "A cabin",
    price: "1000",
    location: "Hunza",
    country: "Pakistan",
    category: "Cabins",
    guests: "2",
    bedrooms: "1",
  };
  assert.equal(parse(listingSchema, valid).price, 1000);
  assert.throws(() =>
    parse(listingSchema, { ...valid, owner: "someone-else" }),
  );
  assert.throws(() => parse(listingSchema, { ...valid, price: -1 }));
  assert.throws(() => parse(reviewSchema, { rating: 4.5, comment: "Nice" }));
  assert.throws(() => parse(reviewSchema, { rating: 5, comment: "   " }));
  assert.throws(() =>
    parse(signupSchema, { username: "a", email: "invalid", password: "short" }),
  );
  assert.throws(() => parse(searchSchema, { limit: 1000 }));
});
test("anonymous sessions supply CSRF and unsafe requests fail before database access", async () => {
  const app = createApp({
    secret: "a-unit-test-secret-more-than-32-characters",
  });
  const agent = request.agent(app);
  const session = await agent.get("/api/auth/me").expect(200);
  assert.equal(session.body.user, null);
  assert.equal(session.body.csrfToken.length, 64);
  await agent.post("/api/auth/login").send({}).expect(403);
  await agent
    .post("/api/auth/login")
    .set("X-CSRF-Token", "é".repeat(64))
    .send({})
    .expect(403);
  await agent
    .post("/api/auth/login")
    .set("X-CSRF-Token", session.body.csrfToken)
    .set("Origin", "https://untrusted.example")
    .send({})
    .expect(403);
  await agent.get("/api/saved").expect(401);
  await agent
    .post("/api/listings")
    .set("X-CSRF-Token", session.body.csrfToken)
    .send({})
    .expect(401);
  await agent.get("/api/missing").expect(404);
});
test("image processor rejects forged image bytes", async () => {
  await assert.rejects(
    () => storeImage({ buffer: Buffer.from("<script>not an image</script>") }),
    (error) => error.status === 400,
  );
});
