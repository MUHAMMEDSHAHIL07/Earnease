import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectHomeRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return children; 

  if (user.role === "admin") return <Navigate to="/admin/dashboard" />;
  if (user.role === "employer") return <Navigate to="/employer/dashboard" />;
  if (user.role === "student") return children; 

  return <Navigate to="/login" />;
};

export default ProtectHomeRoute;