import { Link } from "react-router-dom";
import Logo from './Logo'
import { container } from "../../utils/styles";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className={`${container} py-10`}>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
              A little further from ordinary.
              <br />
              Find a place that feels like you.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-brand">
              Explore stays
            </Link>
            <Link to="/saved" className="hover:text-brand">
              Your favorites
            </Link>
            <Link to="/listings/new" className="hover:text-brand">
              Become a host
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Airbnb. Made for the curious.</p>
          <p>Pakistan · English · PKR</p>
        </div>
      </div>
    </footer>
  );
}
