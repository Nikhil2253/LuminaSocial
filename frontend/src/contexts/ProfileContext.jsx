import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({});
  const { isLoggedIn, token } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isLoggedIn && token) {
          const response = await axios.get("http://localhost:4000/api/user/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data)
          setProfile(response.data);
        }
      } catch (error) {
          console.log(error)
      }
    };

    fetchProfile();
  }, [isLoggedIn, token]);

  return (
    <ProfileContext.Provider value={{ profile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
