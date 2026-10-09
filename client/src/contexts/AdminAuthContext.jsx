import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, login as apiLogin, logout as apiLogout } from "../lib/api";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState("checking"); // checking | authenticated | anonymous

  useEffect(() => {
    fetchMe()
      .then((data) => {
        setAdmin(data);
        setStatus("authenticated");
      })
      .catch(() => setStatus("anonymous"));
  }, []);

  async function login(username, password) {
    const data = await apiLogin(username, password);
    setAdmin(data);
    setStatus("authenticated");
  }

  async function logout() {
    await apiLogout().catch(() => {});
    setAdmin(null);
    setStatus("anonymous");
  }

  return (
    <AdminAuthContext.Provider value={{ admin, status, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth doit être utilisé dans AdminAuthProvider");
  return ctx;
}
