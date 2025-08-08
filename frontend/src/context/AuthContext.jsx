import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true })
      setUser(res.data.user)
      
      if (res.data.user) {
        localStorage.setItem(
          "earneaseUser",
          JSON.stringify({
            avatarUrl: res.data.user.avatarUrl,
            name: res.data.user.name,
          })
        );
      } else {
        localStorage.removeItem("earneaseUser")
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem("earneaseUser")
    } finally {
      setLoading(false)
    }
  };
  
  useEffect(() => {
    fetchUser()
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)