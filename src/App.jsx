import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AdminDataProvider } from "./data/AdminDataContext";
import AdminLayout from "./layouts/AdminLayout";
import OwnerLayout from "./layouts/OwnerLayout";
import JockeyLayout from "./layouts/JockeyLayout";
import RefereeLayout from "./layouts/RefereeLayout";
import SpectatorLayout from "./layouts/SpectatorLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TournamentManagement from "./pages/admin/TournamentManagement";
import RaceManagement from "./pages/admin/RaceManagement";
import RegistrationManagement from "./pages/admin/RegistrationManagement";
import SchedulingManagement from "./pages/admin/SchedulingManagement";
import AssignReferee from "./pages/admin/AssignReferee";
import HorseManagement from "./pages/admin/HorseManagement";
import JockeyManagement from "./pages/admin/JockeyManagement";
import RefereeReportManagement from "./pages/admin/RefereeReportManagement";
import ResultRankingManagement from "./pages/admin/ResultRankingManagement";
import PrizeManagement from "./pages/admin/PrizeManagement";
import NotificationManagement from "./pages/admin/NotificationManagement";
import ReportExport from "./pages/admin/ReportExport";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerHorseManagement from "./pages/owner/OwnerHorseManagement";
import OwnerAddHorse from "./pages/owner/OwnerAddHorse";
import OwnerRaceList from "./pages/owner/OwnerRaceList";
import OwnerRegistrationForm from "./pages/owner/OwnerRegistrationForm";
import OwnerRegistrationHistory from "./pages/owner/OwnerRegistrationHistory";
import OwnerResultView from "./pages/owner/OwnerResultView";
import JockeyDashboard from "./pages/jockey/JockeyDashboard";
import JockeyInvitation from "./pages/jockey/JockeyInvitation";
import JockeySchedule from "./pages/jockey/JockeySchedule";
import JockeyPerformance from "./pages/jockey/JockeyPerformance";
import JockeyProfile from "./pages/jockey/JockeyProfile";
import RefereeDashboard from "./pages/referee/RefereeDashboard";
import AssignedRace from "./pages/referee/AssignedRace";
import RaceInspection from "./pages/referee/RaceInspection";
import EnterRaceResult from "./pages/referee/EnterRaceResult";
import ViolationReport from "./pages/referee/ViolationReport";
import SubmitRefereeReport from "./pages/referee/SubmitRefereeReport";
import RefereeReportHistory from "./pages/referee/RefereeReportHistory";
import SpectatorDashboard from "./pages/spectator/SpectatorDashboard";
import SpectatorRaceSchedule from "./pages/spectator/SpectatorRaceSchedule";
import RaceDetail from "./pages/spectator/RaceDetail";
import PredictionForm from "./pages/spectator/PredictionForm";
import PredictionHistory from "./pages/spectator/PredictionHistory";
import LiveResult from "./pages/spectator/LiveResult";
import SpectatorRanking from "./pages/spectator/SpectatorRanking";
import RewardPoints from "./pages/spectator/RewardPoints";
import RoleSelection from "./pages/RoleSelection";
import DemoFlow from "./pages/DemoFlow";
import "./styles/admin.css";

export default function App() {
  return (
    <AdminDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/demo-flow" element={<DemoFlow />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tournaments" element={<TournamentManagement />} />
            <Route path="races" element={<RaceManagement />} />
            <Route path="scheduling" element={<SchedulingManagement />} />
            <Route path="registrations" element={<RegistrationManagement />} />
            <Route path="horses" element={<HorseManagement />} />
            <Route path="jockeys" element={<JockeyManagement />} />
            <Route path="referees" element={<AssignReferee />} />
            <Route path="referee-reports" element={<RefereeReportManagement />} />
            <Route path="results-rankings" element={<ResultRankingManagement />} />
            <Route path="prizes" element={<PrizeManagement />} />
            <Route path="notifications" element={<NotificationManagement />} />
            <Route path="reports" element={<ReportExport />} />
          </Route>
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<Navigate to="/owner/dashboard" replace />} />
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="horses" element={<OwnerHorseManagement />} />
            <Route path="add-horse" element={<OwnerAddHorse />} />
            <Route path="races" element={<OwnerRaceList />} />
            <Route path="register" element={<OwnerRegistrationForm />} />
            <Route path="history" element={<OwnerRegistrationHistory />} />
            <Route path="results" element={<OwnerResultView />} />
          </Route>
          <Route path="/jockey" element={<JockeyLayout />}>
            <Route index element={<Navigate to="/jockey/dashboard" replace />} />
            <Route path="dashboard" element={<JockeyDashboard />} />
            <Route path="invitations" element={<JockeyInvitation />} />
            <Route path="schedule" element={<JockeySchedule />} />
            <Route path="performance" element={<JockeyPerformance />} />
            <Route path="profile" element={<JockeyProfile />} />
          </Route>
          <Route path="/referee" element={<RefereeLayout />}>
            <Route index element={<Navigate to="/referee/dashboard" replace />} />
            <Route path="dashboard" element={<RefereeDashboard />} />
            <Route path="assigned-races" element={<AssignedRace />} />
            <Route path="inspection" element={<RaceInspection />} />
            <Route path="enter-result" element={<EnterRaceResult />} />
            <Route path="violations" element={<ViolationReport />} />
            <Route path="submit-report" element={<SubmitRefereeReport />} />
            <Route path="history" element={<RefereeReportHistory />} />
          </Route>
          <Route path="/spectator" element={<SpectatorLayout />}>
            <Route index element={<Navigate to="/spectator/dashboard" replace />} />
            <Route path="dashboard" element={<SpectatorDashboard />} />
            <Route path="schedule" element={<SpectatorRaceSchedule />} />
            <Route path="race-detail" element={<RaceDetail />} />
            <Route path="predict" element={<PredictionForm />} />
            <Route path="predictions" element={<PredictionHistory />} />
            <Route path="live-results" element={<LiveResult />} />
            <Route path="ranking" element={<SpectatorRanking />} />
            <Route path="rewards" element={<RewardPoints />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </Router>
    </AdminDataProvider>
  );
}
