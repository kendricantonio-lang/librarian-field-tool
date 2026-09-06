export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="page">
      <div className="page-header">
        <h2>{title}</h2>
      </div>
      <p className="muted">This tab hasn't been built yet.</p>
    </div>
  );
}
