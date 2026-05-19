import { useNavigate } from "react-router-dom";

const steps = [
  { role: "Admin", title: "Create tournament and race", path: "/admin/tournaments", detail: "Create or inspect tournament/race setup before registration opens." },
  { role: "Horse Owner", title: "Register horse and choose jockey", path: "/owner/register", detail: "Owner selects race, horse and jockey. Validation runs on certificate, weight, deadline and duplicate registration." },
  { role: "Jockey", title: "Accept invitation", path: "/jockey/invitations", detail: "Jockey accepts or rejects invitations with schedule conflict and daily race limit checks." },
  { role: "Admin", title: "Schedule race, assign lane and referee", path: "/admin/scheduling", detail: "Admin assigns lanes, checks conflicts and then assigns referee for the race." },
  { role: "Spectator", title: "Submit prediction", path: "/spectator/predict", detail: "Spectator chooses top 3 horses before race start; one prediction per race." },
  { role: "Referee", title: "Enter result and submit report", path: "/referee/enter-result", detail: "Referee saves temporary results, records violations and submits report." },
  { role: "Admin", title: "Publish result", path: "/admin/results-rankings", detail: "Admin publishes result only after referee report confirmation." },
  { role: "Spectator", title: "View live result, ranking and reward", path: "/spectator/live-results", detail: "Spectator reviews official/unofficial result, ranking and reward points." },
];

export default function DemoFlow() {
  const navigate = useNavigate();

  const go = (step) => {
    localStorage.setItem("horse-racing-current-role", step.role);
    navigate(step.path);
  };

  return (
    <main className="role-page flow-page">
      <section className="role-hero">
        <span className="role-kicker">End-to-End Demo</span>
        <h1>Horse Racing Prototype Flow</h1>
        <p>Follow the system from admin setup through owner registration, jockey confirmation, referee report and spectator rewards.</p>
        <div className="actions">
          <button onClick={() => navigate("/")}>Choose Role</button>
          <button onClick={() => go(steps[0])}>Start Demo</button>
        </div>
      </section>
      <section className="flow-stepper">
        {steps.map((step, index) => (
          <article key={`${step.role}-${step.title}`} className="flow-step">
            <div className="step-index">{index + 1}</div>
            <div>
              <span>{step.role}</span>
              <h2>{step.title}</h2>
              <p>{step.detail}</p>
              <button onClick={() => go(step)}>Go to screen</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
