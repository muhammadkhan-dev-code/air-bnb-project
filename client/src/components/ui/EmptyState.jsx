
export default function EmptyState({ title, text, children }) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">

      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
        {text}
      </p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
