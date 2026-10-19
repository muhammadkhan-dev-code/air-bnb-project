import { Heart } from "lucide-react";

export default function SaveButton({ saved, onClick, overlay = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={saved ? "Remove from saved stays" : "Save stay"}
      aria-pressed={saved}
      className={`flex size-10 shrink-0 items-center justify-center rounded-full transition ${overlay ? "bg-white/95 shadow-sm hover:bg-white" : "border border-line bg-white hover:bg-stone-50"} ${saved ? "text-brand" : "text-ink"}`}
    >
      <Heart size={19} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
