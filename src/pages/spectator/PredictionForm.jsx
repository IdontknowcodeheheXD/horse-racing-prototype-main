import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAdminData } from "../../data/AdminDataContext";
import { raceEntries, raceStarted, SPECTATOR_ID, spectatorIntro, SpectatorPageHeader } from "./spectatorUtils";

export default function PredictionForm() {
  const { data, setData, flash, raceById, horseById } = useAdminData();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [raceId, setRaceId] = useState(params.get("raceId") || data.races[0]?.id || "");
  const entries = raceEntries(data, raceId);
  const [top, setTop] = useState(["", "", ""]);
  const race = raceById.get(raceId);
  const locked = raceStarted(race);
  const existing = data.predictions.find((item) => item.spectatorId === SPECTATOR_ID && item.raceId === raceId);

  const submit = (event) => {
    event.preventDefault();
    if (locked) return flash("Prediction locked because race has already started.", "error");
    if (existing) return flash("Each spectator can submit only 1 prediction per race.", "error");
    if (top.some((horseId) => !horseId) || new Set(top).size !== 3) return flash("Please choose three different horses.", "error");
    const prediction = { id: `PR${Date.now()}`, spectatorId: SPECTATOR_ID, raceId, predictedHorseIds: top, submittedAt: new Date().toISOString(), result: "Pending result", rewardPoints: 0 };
    setData((current) => ({ ...current, predictions: [prediction, ...current.predictions] }));
    flash("Prediction submitted successfully");
    navigate("/spectator/predictions");
  };

  return (
    <>
      <SpectatorPageHeader meta={spectatorIntro.predict} />
      <section className="content-panel split-panel">
        <form className="form-grid compact" onSubmit={submit}>
          <label>Race<select value={raceId} onChange={(e) => { setRaceId(e.target.value); setTop(["", "", ""]); }}>{data.races.map((item) => <option key={item.id} value={item.id}>{item.round}</option>)}</select></label>
          {[0, 1, 2].map((index) => <label key={index}>Predicted Rank {index + 1}<select value={top[index]} onChange={(e) => setTop(top.map((value, itemIndex) => itemIndex === index ? e.target.value : value))}><option value="">Select horse</option>{entries.map((entry) => <option key={entry.id} value={entry.horseId}>{horseById.get(entry.horseId)?.name}</option>)}</select></label>)}
          <button type="submit">Submit Prediction</button>
        </form>
        <aside>
          <h3>Prediction Rule</h3>
          <div className={locked || existing ? "warning-box danger" : "warning-box ok"}>
            {locked && <p>Prediction locked after race start.</p>}
            {existing && <p>You already submitted prediction for this race.</p>}
            {!locked && !existing && <p>Prediction is open for this race.</p>}
          </div>
        </aside>
      </section>
    </>
  );
}
