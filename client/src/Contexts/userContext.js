import React, { createContext, useContext, useState } from "react";
import { getProfile } from "../Api/authAPI";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const signup = async (formData) => {
    try {
      await signup(formData);
    } catch (error) {
      console.error(error);
    }
  };

  const UserProfile = async () => {
    try {
      const profile = await getProfile();
      login(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, signup, UserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser, getProfile };
