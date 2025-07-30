import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    setIsLoggedIn(true);
    localStorage.setItem("auth", JSON.stringify({ user: userData, token }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("auth");
  };

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    if (storedAuth?.token) {
      setUser(storedAuth.user);
      setToken(storedAuth.token);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
