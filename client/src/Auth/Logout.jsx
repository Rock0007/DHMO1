import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { useUser } from "../Contexts/userContext";
import { logout as authApiLogout } from "../Api/authAPI";

const Logout = ({ navigation }) => {
  const { logout } = useUser();

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const handleLogout = async () => {
    try {
      await authApiLogout();
      logout();
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      showToast("Logout failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Logout</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Logout;
