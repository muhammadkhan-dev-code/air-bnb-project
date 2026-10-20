import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import MongoStore from "connect-mongo";
import request from "supertest";
import sharp from "sharp";
import { createApp } from "../src/app.js";
import Listing from "../src/models/Listing.js";
import Review from "../src/models/Review.js";
let mongo,
  store,
  app,
  owner,
  visitor,
  ownerToken,
  visitorToken,
  id,
  secondId,
  reviewId,
  image;
const fields = {
  title: "Integration cabin",
  description: "A comfortable cabin for integration tests.",
  price: "12000",
  location: "Hunza",
  country: "Pakistan",
  category: "Cabins",
  guests: "4",
  bedrooms: "2",
};
function write(agent, method, path, token) {
  return agent[method](path).set("X-CSRF-Token", token);
}
async function upload(
  agent,
  token,
  method = "post",
  path = "/api/listings",
  extra = {},
) {
  let operation = write(agent, method, path, token);
  for (const [key, value] of Object.entries({ ...fields, ...extra }))
    operation = operation.field(key, value);
  return operation.attach("image", image, {
    filename: "cabin.png",
    contentType: "image/png",
  });
}
before(
  async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
    await mongoose.model("User").init();
    store = MongoStore.create({ mongoUrl: mongo.getUri() });
    app = createApp({
      store,
      secret: "a-test-only-secret-with-more-than-32-characters",
    });
    owner = request.agent(app);
    visitor = request.agent(app);
    image = await sharp({
      create: { width: 32, height: 32, channels: 3, background: "#faf9f6" },
    })
      .png()
      .toBuffer();
  },
  { timeout: 180000 },
);
after(async () => {
  const { removeImage } = await import("../src/services/imageService.js");
  if (mongoose.connection.readyState === 1)
    for (const listing of await Listing.find())
      await removeImage(listing.image);
  if (store) await store.close();
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
test("sessions, CSRF protection and account creation", async () => {
  const initial = await owner.get("/api/auth/me").expect(200);
  assert.equal(initial.body.user, null);
  ownerToken = initial.body.csrfToken;
  await owner
    .post("/api/auth/signup")
    .send({
      username: "owner",
      email: "owner@example.com",
      password: "TestPassword!9",
    })
    .expect(403);
  const created = await write(owner, "post", "/api/auth/signup", ownerToken)
    .send({
      username: "owner",
      email: "owner@example.com",
      password: "TestPassword!9",
    })
    .expect(201);
  ownerToken = created.body.csrfToken;
  assert.equal(created.body.user.username, "owner");
  assert(!("hash" in created.body.user));
  assert(
    (created.headers["set-cookie"] || []).some(
      (cookie) =>
        cookie.includes("HttpOnly") && cookie.includes("SameSite=Lax"),
    ),
  );
  visitorToken = (await visitor.get("/api/auth/me")).body.csrfToken;
  const registered = await write(
    visitor,
    "post",
    "/api/auth/signup",
    visitorToken,
  )
    .send({
      username: "visitor",
      email: "visitor@example.com",
      password: "TestPassword!9",
    })
    .expect(201);
  visitorToken = registered.body.csrfToken;
  assert.equal((await owner.get("/api/auth/me")).body.user.username, "owner");
});
test("listing creation, decoded image validation, pagination and public DTO", async () => {
  const result = await upload(owner, ownerToken);
  assert.equal(result.status, 201);
  id = result.body.listing.id;
  assert.equal(result.body.listing.host, "owner");
  assert.match(result.body.listing.image, /^\/uploads\/.+\.webp$/);
  await request(app).get(result.body.listing.image).expect(200);
  const second = await upload(owner, ownerToken, "post", "/api/listings", {
    title: "Second cabin",
    price: "9000",
  });
  secondId = second.body.listing.id;
  const list = await request(app)
    .get("/api/listings?limit=1&sort=price-low&q=cabin")
    .expect(200);
  assert.equal(list.body.total, 2);
  assert.equal(list.body.pages, 2);
  assert.equal(list.body.items[0].price, 9000);
  await request(app).get("/api/listings?guests=invalid").expect(400);
  await request(app).get("/api/listings/not-an-id").expect(400);
  const detail = await request(app).get(`/api/listings/${id}`).expect(200);
  assert(!JSON.stringify(detail.body).includes("hash"));
  let fake = write(owner, "post", "/api/listings", ownerToken);
  for (const [key, value] of Object.entries(fields))
    fake = fake.field(key, value);
  await fake
    .attach("image", Buffer.from("not an image"), {
      filename: "fake.png",
      contentType: "image/png",
    })
    .expect(400);
});
test("ownership enforced and client cannot overwrite the owner", async () => {
  await write(visitor, "delete", `/api/listings/${id}`, visitorToken).expect(
    403,
  );
  await write(visitor, "put", `/api/listings/${id}`, visitorToken)
    .send(fields)
    .expect(403);
  await write(owner, "put", `/api/listings/${id}`, ownerToken)
    .send({ ...fields, owner: "000000000000000000000000" })
    .expect(400);
  const edited = await write(owner, "put", `/api/listings/${id}`, ownerToken)
    .send({ ...fields, title: "Updated cabin" })
    .expect(200);
  assert.equal(edited.body.listing.title, "Updated cabin");
  await write(owner, "put", `/api/listings/${id}`, ownerToken)
    .set("Origin", "https://untrusted.example")
    .send(fields)
    .expect(403);
});
test("saved stays persist and saves are idempotent", async () => {
  await write(visitor, "put", `/api/saved/${id}`, visitorToken).expect(200);
  await write(visitor, "put", `/api/saved/${id}`, visitorToken).expect(200);
  assert.equal(
    (await visitor.get("/api/saved").expect(200)).body.items.length,
    1,
  );
  assert.equal(
    (await owner.get("/api/saved").expect(200)).body.items.length,
    0,
  );
});
test("reviews enforce author and listing membership", async () => {
  await write(visitor, "post", `/api/listings/${id}/reviews`, visitorToken)
    .send({ rating: 6, comment: "Invalid" })
    .expect(400);
  await write(visitor, "post", `/api/listings/${id}/reviews`, visitorToken)
    .send({ rating: 5, comment: "Lovely place." })
    .expect(201);
  const detail = await visitor.get(`/api/listings/${id}`);
  reviewId = detail.body.listing.reviews[0].id;
  await write(
    owner,
    "delete",
    `/api/listings/${id}/reviews/${reviewId}`,
    ownerToken,
  ).expect(403);
  await write(
    visitor,
    "delete",
    `/api/listings/${secondId}/reviews/${reviewId}`,
    visitorToken,
  ).expect(404);
  await write(
    visitor,
    "delete",
    `/api/listings/${id}/reviews/${reviewId}`,
    visitorToken,
  ).expect(200);
  assert.equal(await Review.countDocuments(), 0);
});
test("logout invalidates the session and login restores it", async () => {
  await write(visitor, "post", "/api/auth/logout", visitorToken).expect(200);
  assert.equal((await visitor.get("/api/auth/me")).body.user, null);
  await visitor.get("/api/saved").expect(401);
  visitorToken = (await visitor.get("/api/auth/me")).body.csrfToken;
  await write(visitor, "post", "/api/auth/login", visitorToken)
    .send({ username: "visitor", password: "wrong" })
    .expect(401);
  const login = await write(visitor, "post", "/api/auth/login", visitorToken)
    .send({ username: "visitor", password: "TestPassword!9" })
    .expect(200);
  visitorToken = login.body.csrfToken;
  assert.equal((await visitor.get("/api/saved")).body.items.length, 1);
});
test("deleting listing removes reviews and saved references", async () => {
  await write(visitor, "post", `/api/listings/${id}/reviews`, visitorToken)
    .send({ rating: 4, comment: "Another review." })
    .expect(201);
  await write(owner, "delete", `/api/listings/${id}`, ownerToken).expect(200);
  assert.equal(await Review.countDocuments(), 0);
  assert.equal((await visitor.get("/api/saved")).body.items.length, 0);
  await request(app).get(`/api/listings/${id}`).expect(404);
  await write(owner, "delete", `/api/listings/${secondId}`, ownerToken).expect(
    200,
  );
});
