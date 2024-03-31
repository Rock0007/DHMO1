import React, { createContext, useContext, useState, useEffect } from "react";
import { ToastAndroid } from "react-native";
import { getProfile } from "../Api/authAPI";
import { ROLES } from "../AccessControl/Roles";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile();
        login(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        ToastAndroid.show("Failed to fetch user profile", ToastAndroid.SHORT);
      }
    };

    fetchUserProfile();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setUserRoles(userData.role || []);
  };

  const logout = () => {
    setUser(null);
    setUserRoles([]);
  };

  const hasRole = (role) => {
    return userRoles.includes(role);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, hasRole, ROLES }}>
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
