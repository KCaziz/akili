import { Outlet } from "react-router-dom";
import { AdminAuthProvider } from "../contexts/AdminAuthContext";

export default function AdminAuthLayout() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
}
