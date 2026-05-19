import { useNavigate } from "react-router-dom";

const roles = [
  { key: "Admin", path: "/admin/dashboard", description: "Create tournaments, races, schedules, results and reports." },
  { key: "Horse Owner", path: "/owner/dashboard", description: "Manage horses, register for races and track owner results." },
  { key: "Jockey", path: "/jockey/dashboard", description: "Accept invitations, view schedule and performance." },
  { key: "Referee", path: "/referee/dashboard", description: "Inspect races, enter results and submit official reports." },
  { key: "Spectator", path: "/spectator/dashboard", description: "View races, send predictions and track reward points." },
];

export default function RoleSelection() {
  const navigate = useNavigate();

  const chooseRole = (role) => {
    localStorage.setItem("horse-racing-current-role", role.key);
    navigate(role.path);
  };

  return (
    <main className="role-page">
      <section className="role-hero">
        <span className="role-kicker">Frontend Prototype</span>
        <h1>Horse Racing Tournament Management System</h1>
        <p>Select a role to start the end-to-end demo. All roles share the same mock data and localStorage state.</p>
        <button onClick={() => navigate("/demo-flow")}>View End-to-End Demo Flow</button>
      </section>
      <section className="role-grid">
        {roles.map((role) => (
          <article key={role.key} className="role-card">
            <h2>{role.key}</h2>
            <p>{role.description}</p>
            <button onClick={() => chooseRole(role)}>Enter {role.key}</button>
          </article>
        ))}
      </section>
    </main>
  );
}
