export default function StatCard({ title, value, note }) {
  return (
    <section className="stat-card">
      <span>{title}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </section>
  );
}
