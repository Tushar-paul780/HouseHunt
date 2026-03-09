import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

// ── Token helpers ─────────────────────────────────────────────────────────────
const saveToken   = (token, remember) => {
  if (remember) localStorage.setItem("hh_token", token);
  else          sessionStorage.setItem("hh_token", token);
};

const clearToken  = () => {
  localStorage.removeItem("hh_token");
  localStorage.removeItem("hh_user");
  sessionStorage.removeItem("hh_token");
  sessionStorage.removeItem("hh_user");
};

const getStoredToken = () =>
  localStorage.getItem("hh_token") || sessionStorage.getItem("hh_token");

// ─────────────────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // checking token on mount

  // ── On mount: verify stored token against /api/auth/me ───────────────────
  useEffect(() => {
    const bootstrap = async () => {
      const token = getStoredToken();
      if (!token) { setLoading(false); return; }

      try {
        const { data } = await api.get("/auth/me");
        if (data.success) setUser(data.user);
      } catch {
        clearToken(); // token invalid/expired
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  // ── login: call API, persist token + user ─────────────────────────────────
  const login = useCallback(async (credentials, remember = false) => {
    const { data } = await api.post("/auth/login", credentials);
    if (data.success) {
      saveToken(data.token, remember);
      // Also cache user object for instant UI restore
      const store = remember ? localStorage : sessionStorage;
      store.setItem("hh_user", JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  }, []);

  // ── register: call API, auto-login ────────────────────────────────────────
  const register = useCallback(async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    if (data.success) {
      saveToken(data.token, false);
      sessionStorage.setItem("hh_user", JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  }, []);

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
