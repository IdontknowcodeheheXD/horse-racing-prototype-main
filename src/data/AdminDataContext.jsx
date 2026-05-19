import { createContext, useContext, useMemo, useState } from "react";
import * as mock from "./mockData";

const AdminDataContext = createContext(null);
const STORAGE_KEY = "horse-racing-admin-prototype";

const collectionKeys = [
  "tournaments",
  "races",
  "horses",
  "jockeys",
  "registrations",
  "referees",
  "refereeReports",
  "violationReports",
  "raceResults",
  "rankings",
  "prizes",
  "notifications",
  "predictions",
  "rewardHistory",
];

function mockState() {
  return {
    tournaments: mock.tournaments,
    races: mock.races,
    horses: mock.horses,
    jockeys: mock.jockeys,
    registrations: mock.registrations,
    referees: mock.referees,
    refereeReports: mock.refereeReports,
    violationReports: mock.violationReports,
    raceResults: mock.raceResults,
    rankings: mock.rankings,
    prizes: mock.prizes,
    notifications: mock.notifications,
    predictions: mock.predictions,
    rewardHistory: mock.rewardHistory,
  };
}

function mergeById(saved = {}, base = mockState()) {
  const next = { ...base, ...saved };
  collectionKeys.forEach((key) => {
    const savedItems = Array.isArray(saved[key]) ? saved[key] : [];
    const savedIds = new Set(savedItems.map((item) => item.id));
    const baseItems = Array.isArray(base[key]) ? base[key] : [];
    next[key] = [...savedItems, ...baseItems.filter((item) => !savedIds.has(item.id))];
  });
  return next;
}

function loadInitialData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return mergeById(JSON.parse(saved));
  } catch {
    // Ignore broken demo storage and fall back to mock data.
  }
  return mockState();
}

export function AdminDataProvider({ children }) {
  const [data, setDataState] = useState(loadInitialData);
  const [alert, setAlert] = useState(null);

  const setData = (updater) => {
    setDataState((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const flash = (message, type = "success") => {
    setAlert({ message, type, id: Date.now() });
    window.setTimeout(() => setAlert(null), 3200);
  };

  const helpers = useMemo(() => {
    const byId = (items) => new Map(items.map((item) => [item.id, item]));
    return {
      tournamentById: byId(data.tournaments),
      raceById: byId(data.races),
      horseById: byId(data.horses),
      jockeyById: byId(data.jockeys),
      refereeById: byId(data.referees),
    };
  }, [data]);

  return (
    <AdminDataContext.Provider value={{ data, setData, alert, flash, ...helpers }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used inside AdminDataProvider");
  return ctx;
}
