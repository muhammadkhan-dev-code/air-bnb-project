import { useState } from "react";
import { House } from "lucide-react";

export default function PropertyImage({ src, alt, className = "", ...props }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src)
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-stone-200 text-stone-500 ${className}`}
      >
        <House size={40} strokeWidth={1.2} />
      </div>
    );
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
      {...props}
    />
  );
}
