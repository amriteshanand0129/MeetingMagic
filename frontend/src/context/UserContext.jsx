import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
export const UserContext = createContext();

// Context Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = document.cookie.split("=")[1];
        if (token) {
          const response = await axios.get("http://localhost:8080/user/me", { withCredentials: true });
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // Function to log out user
  const logoutUser = () => {
    setUser(null);
  };

  return <UserContext.Provider value={{ user, setUser, logoutUser }}>{children}</UserContext.Provider>;
};
