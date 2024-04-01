import React, { createContext, useContext, useState, useEffect } from "react";
import { ToastAndroid, View, ActivityIndicator } from "react-native";
import { getProfile } from "../Api/authAPI";
import { ROLES } from "../AccessControl/Roles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const profile = await getProfile();
          login(profile);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        ToastAndroid.show("Failed to fetch user profile", ToastAndroid.SHORT);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setUserRoles(userData.role || []);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setUser(null);
      setUserRoles([]);
    } catch (error) {
      console.error("Error removing token:", error);
      ToastAndroid.show("Failed to remove user token", ToastAndroid.SHORT);
    }
  };

  const hasRole = (role) => {
    return userRoles.includes(role);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, hasRole, ROLES }}>
      {isLoading ? <LoadingIndicator /> : children}
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

const LoadingIndicator = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="gray" />
  </View>
);
