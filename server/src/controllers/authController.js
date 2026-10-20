import passport from "passport";
import User from "../models/User.js";
import { userDto } from "../utils/serializers.js";
import { csrfToken } from "../middleware/csrf.js";
async function establishSession(req, user) {
  await new Promise((resolve, reject) =>
    req.session.regenerate((error) => (error ? reject(error) : resolve())),
  );
  await new Promise((resolve, reject) =>
    req.logIn(user, (error) => (error ? reject(error) : resolve())),
  );
  csrfToken(req);
  await new Promise((resolve, reject) =>
    req.session.save((error) => (error ? reject(error) : resolve())),
  );
}
export function me(req, res) {
  res.json({ user: userDto(req.user), csrfToken: csrfToken(req) });
}
export async function signup(req, res) {
  const { username, email, password } = req.validated;
  const user = await User.register(new User({ username, email }), password);
  await establishSession(req, user);
  res.status(201).json({ user: userDto(user), csrfToken: csrfToken(req) });
}
export function login(req, res, next) {
  req.body = req.validated;
  passport.authenticate("local", async (error, user) => {
    if (error) return next(error);
    if (!user)
      return res
        .status(401)
        .json({ message: "Incorrect username or password." });
    try {
      await establishSession(req, user);
      res.json({ user: userDto(user), csrfToken: csrfToken(req) });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
}
export async function logout(req, res) {
  await new Promise((resolve, reject) =>
    req.logout((error) => (error ? reject(error) : resolve())),
  );
  await new Promise((resolve, reject) =>
    req.session.destroy((error) => (error ? reject(error) : resolve())),
  );
  res.clearCookie("airbnb.sid", { path: "/" });
  res.json({ message: "Logged out." });
}
