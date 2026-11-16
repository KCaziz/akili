import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { AdminAuthProvider } from "../contexts/AdminAuthContext";

export default function AdminAuthLayout() {
  return (
    <AdminAuthProvider>
      <Suspense fallback={<div className="admin-loading"><div className="admin-spinner" /></div>}>
        <Outlet />
      </Suspense>
    </AdminAuthProvider>
  );
}
