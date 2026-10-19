import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { container, primary } from "../utils/styles";
import EmptyState from "../components/ui/EmptyState";

export default function NotFound() {
  return (
    <section className={`${container} py-20`}>
      <EmptyState
        title="Looks like we took a scenic detour."
        text="This page or property isn’t available. Let’s find you somewhere else."
      >
        <Link to="/" className={primary}>
          Back to discover <ArrowRight size={16} />
        </Link>
      </EmptyState>
    </section>
  );
}
