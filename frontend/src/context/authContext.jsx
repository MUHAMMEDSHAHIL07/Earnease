import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(true);
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, { withCredentials: true });
      setUser(res.data.user);

      if (res.data.user) {
        localStorage.setItem('isLoggedIn', 'true'); 
        localStorage.setItem(
          "earneaseUser",
          JSON.stringify({
            avatarUrl: res.data.user.avatarUrl,
            name: res.data.user.name,
          })
        );
      } else {
        localStorage.removeItem("earneaseUser");
        localStorage.removeItem('isLoggedIn'); 
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem("earneaseUser");
      localStorage.removeItem('isLoggedIn'); 
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    const loggedInFlag = localStorage.getItem('isLoggedIn');
    if (loggedInFlag === 'true') {
      fetchUser();
    } else {
      setGlobalLoading(false);
    }
  }, []);


  return (
    <AuthContext.Provider value={{ user, setUser, globalLoading, setGlobalLoading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);