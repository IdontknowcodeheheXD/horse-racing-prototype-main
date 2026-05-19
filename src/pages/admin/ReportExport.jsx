import { PageHeader, pageIntro } from "./pageUtils";
import { useAdminData } from "../../data/AdminDataContext";

const reports = ["Tournament Report", "Race Result Report", "Ranking Report", "Violation Report"];

export default function ReportExport() {
  const { flash } = useAdminData();
  return (
    <>
      <PageHeader meta={pageIntro.exports} />
      <section className="report-grid">
        {reports.map((report) => (
          <article key={report} className="report-card">
            <h3>{report}</h3>
            <p>Generate a mock export file for admin demonstration.</p>
            <div className="actions">
              <button onClick={() => flash("Export successfully")}>Export PDF</button>
              <button onClick={() => flash("Export successfully")}>Export Excel</button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
