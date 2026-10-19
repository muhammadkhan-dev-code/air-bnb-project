import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Compass, Eye, EyeOff } from "lucide-react";
import { container, primary, input } from "../utils/styles";
import { heroImage } from "../utils/constants";
import PropertyImage from "../components/ui/PropertyImage";
import Field from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";


export default function AuthPage({ signup = false }) {
  const { login, signup: register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await (signup ? register(values) : login(values));
      const target = location.state?.from;
      navigate(
        typeof target === "string" &&
          target.startsWith("/") &&
          !target.startsWith("//")
          ? target
          : "/",
        { replace: true },
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={`${container} py-8 sm:py-12`}>
      <div className="grid overflow-hidden rounded-[2rem] border border-line bg-white lg:min-h-[650px] lg:grid-cols-2">
        <div className="relative isolate hidden bg-stone-800 p-12 lg:flex lg:flex-col lg:justify-end">
          <PropertyImage
            src={heroImage}
            alt="A peaceful retreat among trees"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-black/45" />
          <span className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/80">
            <Compass size={18} />
            Go somewhere that stays with you
          </span>
          <h2 className="max-w-md text-5xl font-medium leading-tight tracking-tight text-white">
            A new place.
            <br />A fresh perspective.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/80">
            Find your next favorite corner of the world. We’ll help you feel at
            home there.
          </p>
        </div>
        <div className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-sm">
            <span className="mb-6 inline-flex size-10 items-center justify-center rounded-2xl  text-brand">
              <img src='./public/images/Logo.svg' alt="logo" />
            </span>
            <h1 className="text-3xl font-semibold tracking-tight">
              {signup
                ? "Your next chapter starts here."
                : "Good to see you again."}
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              {signup
                ? "Create an account and start collecting new experiences."
                : "Welcome back to your next adventure."}
            </p>
            <form onSubmit={submit} className="mt-8 space-y-5">
              <Field label="Username">
                <input
                  name="username"
                  pattern={signup ? "[a-zA-Z0-9_]{3,40}" : undefined}
                  title="3–40 letters, numbers, or underscores"
                  autoComplete="username"
                  required
                  minLength={3}
                  maxLength={40}
                  placeholder="Enter your username"
                  className={input}
                />
              </Field>
              {signup && (
                <Field label="Email address">
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className={input}
                  />
                </Field>
              )}
              <div>
                <label
                  htmlFor="auth-password"
                  className="mb-2 block text-sm font-semibold"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="auth-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={signup ? "new-password" : "current-password"}
                    required
                    maxLength={128}
                    minLength={signup ? 8 : 1}
                    placeholder={
                      signup ? "At least 8 characters" : "Enter your password"
                    }
                    className={`${input} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-3 rounded p-0.5 text-muted"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>
              <button disabled={busy} className={`${primary} w-full`}>
                {busy ? "Please wait…" : signup ? "Create account" : "Log in"}
                <ArrowRight size={17} />
              </button>
              {message && (
                <p
                  role="status"
                  className="rounded-xl bg-canvas p-4 text-sm leading-6 text-muted"
                >
                  {message}
                </p>
              )}
            </form>
            <p className="mt-6 text-center text-sm text-muted">
              {signup ? "Already part of the journey?" : "New around here?"}{" "}
              <Link
                to={signup ? "/login" : "/signup"}
                state={location.state}
                className="font-semibold text-brand hover:underline"
              >
                {signup ? "Log in" : "Join Airbnb"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
