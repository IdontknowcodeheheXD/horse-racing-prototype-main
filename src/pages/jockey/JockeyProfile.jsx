import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { JOCKEY_ID, jockeyIntro, JockeyPageHeader } from "./jockeyUtils";

export default function JockeyProfile() {
  const { jockeyById } = useAdminData();
  const jockey = jockeyById.get(JOCKEY_ID);
  const blocked = jockey?.status === "Suspended" || jockey?.status === "Banned";

  return (
    <>
      <JockeyPageHeader meta={jockeyIntro.profile} />
      <section className="content-panel profile-panel">
        <div className="profile-row"><span>License No</span><strong>{jockey?.licenseNo}</strong></div>
        <div className="profile-row"><span>Name</span><strong>{jockey?.name}</strong></div>
        <div className="profile-row"><span>Weight</span><strong>{jockey?.weight}kg</strong></div>
        <div className="profile-row"><span>Ranking</span><strong>#{jockey?.ranking}</strong></div>
        <div className="profile-row"><span>Status</span><strong><StatusBadge status={jockey?.status} /></strong></div>
        {blocked && <div className="warning-box danger">This jockey is Suspended/Banned and cannot accept race invitations.</div>}
      </section>
    </>
  );
}
