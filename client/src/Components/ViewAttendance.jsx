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

const MarkAttendance = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [staffId, setStaffId] = useState("");

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
  }, []);

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
  }, [staffId]);

  const handleLogin = async () => {
    try {
      await markLoginAttendance(staffId, password);
      ToastAndroid.show("Login Marked successfully!", ToastAndroid.SHORT);
      setIsLoginModalVisible(false);
      setPassword("");
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
            <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
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
    flex: 1,
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
    width: 120,
    height: 40,
    marginHorizontal: 20,
    borderRadius: 5,
    width: "40%",
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
    width: "60%",
    height: "auto",
    alignItems: "center",
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: "18%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "rgb(0, 128, 0)",
    width: "40%",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
});

export default MarkAttendance;
