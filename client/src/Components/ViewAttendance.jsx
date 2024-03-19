import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import {
  markLoginAttendance,
  markLogoutAttendance,
  getProfile,
  GetAttendance,
} from "../Api/authAPI";

import SA from "../Charts/StaffAttendance";

const MarkAttendance = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [staffId, setStaffId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const logProfileData = async () => {
      try {
        const profileData = await getProfile();
        const { _id } = profileData;
        console.log("User ID:", _id);
        setStaffId(_id);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    logProfileData();
  }, [refreshKey]);

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      const attendanceData = await GetAttendance(staffId);
      console.log("Attendance Data:", attendanceData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [staffId, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleLogin = async () => {
    try {
      await markLoginAttendance(staffId, password);
      ToastAndroid.show("Login Marked successfully!", ToastAndroid.SHORT);
      setIsLoginModalVisible(false);
      setPassword("");
      handleRefresh();
    } catch (error) {
      console.error("Error marking login attendance:", error);
      if (error.message) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
        setIsLoginModalVisible(false);
      } else {
        ToastAndroid.show(
          "Failed to mark login attendance. Please try again.",
          ToastAndroid.SHORT
        );
        setIsLoginModalVisible(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await markLogoutAttendance(staffId, password);
      ToastAndroid.show("Logout Marked Successful!", ToastAndroid.SHORT);
      setIsLogoutModalVisible(false);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      if (error.message) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
        setIsLogoutModalVisible(false);
        handleRefresh();
      } else {
        ToastAndroid.show(
          "Failed to fetch profile data. Please try again.",
          ToastAndroid.SHORT
        );
        setIsLogoutModalVisible(false);
      }
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.heading}>Mark Attendance</Text>
        <View style={styles.buttonContainer}>
          <View style={styles.row}>
            <CustomButton
              text="Login"
              color="rgb(0, 128, 0)"
              onPress={() => setIsLoginModalVisible(true)}
            />
            <CustomButton
              text="Logout"
              color="rgb(255, 0, 0)"
              onPress={() => setIsLogoutModalVisible(true)}
            />
          </View>
          <View style={styles.row}>
            <CustomButton text="Leave Request" color="rgb(255, 165, 0)" />
            <CustomButton text="Status" color="rgb(0, 0, 255)" />
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isLoginModalVisible}
          onRequestClose={() => setIsLoginModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Enter Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Logout Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isLogoutModalVisible}
          onRequestClose={() => setIsLogoutModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Confirm Logout? </Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleLogout}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.heading}>Attendance Summary</Text>
        <SA />
      </View>
    </>
  );
};

const CustomButton = ({ text, color, onPress }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1 / 3,
    backgroundColor: "#fff",
    alignItems: "center",
    margin: 20,
    borderRadius: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 25,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-around",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%", // Modified width to fit buttons in a row
    height: 40,
    borderRadius: 5,
    backgroundColor: "#007aff", // Changed color to blue
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%", // Modified width to fit content
    alignItems: "center",
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40, // Changed height to fixed height
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#007aff", // Changed color to blue
    width: "40%",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  chartContainer: {
    flex: 1 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MarkAttendance;
