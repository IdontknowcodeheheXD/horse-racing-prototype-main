import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tournaments from "./pages/Tournaments";
import Races from "./pages/Races";
import Horses from "./pages/Horses";
import Jockeys from "./pages/Jockeys";
import Referees from "./pages/Referees";
import Registrations from "./pages/Registrations";
import Results from "./pages/Results";
import Predictions from "./pages/Predictions";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import CompetitorDashboard from "./pages/CompetitorDashboard";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/competitor" element={<CompetitorDashboard />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/races" element={<Races />} />
              <Route path="/horses" element={<Horses />} />
              <Route path="/jockeys" element={<Jockeys />} />
              <Route path="/referees" element={<Referees />} />
              <Route path="/registrations" element={<Registrations />} />
              <Route path="/results" element={<Results />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
