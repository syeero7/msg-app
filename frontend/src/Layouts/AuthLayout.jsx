import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

function AuthLayout() {
  const { user } = useAuth();

  return !user ? <Outlet /> : <Navigate replace to="/chat" />;
}

export default AuthLayout;
