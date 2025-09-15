import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import GlobalLoader from "../components/GlobalLoader";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, globalLoading } = useAuth()
  if (globalLoading) return <GlobalLoader />

  if (!user) return <Navigate to="/login" replace />

  if (!allowedRoles.includes(user.role)) return <Navigate to="/notfound" replace />

  return children
}
export default ProtectedRoute