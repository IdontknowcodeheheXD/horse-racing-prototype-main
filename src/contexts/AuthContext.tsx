import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  email: string;
  name: string;
  role: "admin" | "competitor";
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string; user?: User }>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);
const STORAGE_KEY = "dd_session";

const USERS = [
  { email: "admin@duongdua.vn", password: "admin123", name: "Quản trị viên", role: "admin" as const },
  { email: "competitor@duongdua.vn", password: "competitor123", name: "Vận động viên", role: "competitor" as const },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const login: AuthCtx["login"] = async (email, password) => {
    await new Promise(r => setTimeout(r, 400));
    const matched = USERS.find(
      account => account.email === email.trim().toLowerCase() && account.password === password,
    );
    if (!matched) {
      return { error: "Email hoặc mật khẩu không đúng." };
    }
    const u: User = { email: matched.email, name: matched.name, role: matched.role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    return { user: u };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
