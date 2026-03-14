import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useAdminAuthStore from "../store/adminAuthStore.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

const AdminRoute = ({ children }) => {
  const { isAdmin, checkAdmin } = useAdminAuthStore();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const ok = await checkAdmin();
      setAllowed(ok);
      setChecking(false);
    };
    verify();
  }, []);

  if (checking) {
    return (
      <div className="dark min-h-screen bg-zinc-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return allowed ? children : <Navigate to="/admin" replace />;
};

export default AdminRoute;