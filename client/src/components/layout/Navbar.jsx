import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from './Logo.jsx'
import { container, primary } from "../../utils/styles";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function Navbar({ savedCount }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  async function handleLogout() {
    try {
      await logout();
      setOpen(false);
    } catch (error) {
      toast(error.message);
    }
  }
  const [open, setOpen] = useState(false);
  const navClass = ({ isActive }) =>
    `text-sm font-medium transition ${isActive ? "text-brand" : "text-muted hover:text-ink"}`;
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur-xl">
      <div
        className={`${container} flex h-20 items-center justify-between gap-5`}
      >
        <Logo />
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 md:flex"
        >
          <NavLink to="/" end className={navClass}>
            Discover
          </NavLink>
          <NavLink to="/saved" className={navClass}>
            Saved stays {savedCount > 0 && `(${savedCount})`}
          </NavLink>
          <NavLink to="/listings/new" className={navClass}>
            Become a host
          </NavLink>
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          {user ? (
            <>
              <span className="max-w-28 truncate text-sm font-semibold">
                Hi, {user.username}
              </span>
              <button onClick={handleLogout} className={primary}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold">
                Log in
              </Link>
              <Link to="/signup" className={primary}>
                Get started <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className="rounded-xl border border-line p-2.5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="space-y-1 border-t border-line bg-white p-4 md:hidden"
        >
          {[
            ["/", "Discover"],
            ["/saved", `Saved stays (${savedCount})`],
            ["/listings/new", "Become a host"],
            ...(!user
              ? [
                ["/login", "Log in"],
                ["/signup", "Create an account"],
              ]
              : []),
          ].map(([to, label]) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-canvas"
            >
              {label}
            </Link>
          ))}
          {user && (
            <button
              className="block px-4 py-3 text-sm font-medium"
              onClick={handleLogout}
            >
              Log out ({user.username})
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
