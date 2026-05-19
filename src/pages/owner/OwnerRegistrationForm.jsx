import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { DEMO_NOW, formatDateTime, OWNER_NAME, ownerHorses, ownerIntro, OwnerPageHeader, registrationErrors } from "./ownerUtils";

export default function OwnerRegistrationForm() {
  const { data, setData, flash, raceById, horseById, jockeyById, tournamentById } = useAdminData();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const raceOptions = data.races.filter((race) => ["Open Registration", "Confirmed", "Draft"].includes(race.status) && new Date(race.raceDate) > DEMO_NOW);
  const horses = ownerHorses(data).filter((horse) => horse.status === "Active" || horse.status === "Ineligible");
  const [raceId, setRaceId] = useState(params.get("raceId") || raceOptions[0]?.id || "");
  const [horseId, setHorseId] = useState(horses[0]?.id || "");
  const [jockeyId, setJockeyId] = useState(data.jockeys.find((jockey) => jockey.status === "Active")?.id || "");
  const [errors, setErrors] = useState([]);
  const race = raceById.get(raceId);
  const horse = horseById.get(horseId);
  const jockey = jockeyById.get(jockeyId);
  const validation = useMemo(() => registrationErrors({ race, horse, registrations: data.registrations }), [race, horse, data.registrations]);

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = registrationErrors({ race, horse, registrations: data.registrations });
    setErrors(nextErrors);
    if (nextErrors.length) {
      flash("Registration failed. Please review validation errors.", "error");
      return;
    }
    const registration = {
      id: `REG${Date.now()}`,
      raceId,
      horseId,
      jockeyId,
      owner: OWNER_NAME,
      registeredAt: DEMO_NOW.toISOString(),
      status: "Pending",
      lane: "",
    };
    setData((current) => ({ ...current, registrations: [registration, ...current.registrations] }));
    flash("Registration Success");
    navigate("/owner/history");
  };

  return (
    <>
      <OwnerPageHeader meta={ownerIntro.register} />
      <section className="content-panel split-panel">
        <form className="form-grid compact" onSubmit={submit}>
          <label>Race<select value={raceId} onChange={(e) => setRaceId(e.target.value)}>{raceOptions.map((item) => <option key={item.id} value={item.id}>{item.round} - {formatDateTime(item.raceDate)}</option>)}</select></label>
          <label>Horse<select value={horseId} onChange={(e) => setHorseId(e.target.value)}>{horses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label>Jockey<select value={jockeyId} onChange={(e) => setJockeyId(e.target.value)}>{data.jockeys.filter((item) => item.status === "Active").map((item) => <option key={item.id} value={item.id}>{item.name} - #{item.ranking}</option>)}</select></label>
          <button type="submit">Submit Registration</button>
        </form>
        <aside>
          <h3>Registration Preview</h3>
          <div className="preview-card">
            <p><strong>Tournament:</strong> {tournamentById.get(race?.tournamentId)?.name || "-"}</p>
            <p><strong>Race:</strong> {race?.round || "-"} ({race ? formatDateTime(race.raceDate) : "-"})</p>
            <p><strong>Horse:</strong> {horse?.name || "-"} {horse && <StatusBadge status={horse.status} />}</p>
            <p><strong>Jockey:</strong> {jockey?.name || "-"}</p>
          </div>
          <h3>Validation</h3>
          <div className={validation.length || errors.length ? "warning-box danger" : "warning-box ok"}>
            {(errors.length ? errors : validation).length ? (errors.length ? errors : validation).map((item) => <p key={item}>{item}</p>) : "All registration rules are satisfied."}
          </div>
        </aside>
      </section>
    </>
  );
}
